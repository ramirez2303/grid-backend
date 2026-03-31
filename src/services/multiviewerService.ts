import axios from "axios";
import { gridToMultiviewerKey, gridToMeetingKey } from "../config/circuitKeyMapping.js";
import { getCachedData, setCachedData } from "./timingCacheService.js";
import { fetchSessions, fetchLocation, fetchLaps } from "./openF1Client.js";
import { CURRENT_SEASON } from "../config/apis.js";

import type { CircuitTrackDataResponse, CircuitElevationResponse, CircuitCorner, CircuitMarshalSector } from "../types/circuitTrack.js";

interface MvCorner { number: number; angle: number; length: number; trackPosition: { x: number; y: number } }
interface MvSector { number: number; trackPosition: { x: number; y: number } }
interface MvResponse { x: number[]; y: number[]; corners: MvCorner[]; marshalSectors: MvSector[]; rotation: number }

export async function getCircuitTrackData(circuitId: string): Promise<CircuitTrackDataResponse | null> {
  const circuitKey = gridToMultiviewerKey[circuitId];
  if (!circuitKey) return null;

  const cacheKey = `multiviewer-${circuitKey}`;
  const cached = await getCachedData<CircuitTrackDataResponse>(0, cacheKey);
  if (cached && cached.length > 0) return cached[0] ?? null;

  try {
    const { data } = await axios.get<MvResponse>(`https://api.multiviewer.app/api/v1/circuits/${circuitKey}/${CURRENT_SEASON}`, { timeout: 10000 });

    const trackPoints = data.x.map((x, i) => ({ x, y: data.y[i]! }));
    const corners: CircuitCorner[] = data.corners.map((c) => ({
      number: c.number, angle: Math.round(c.angle), length: Math.round(c.length),
      x: c.trackPosition.x, y: c.trackPosition.y,
    }));
    const marshalSectors: CircuitMarshalSector[] = data.marshalSectors.map((s) => ({
      number: s.number, x: s.trackPosition.x, y: s.trackPosition.y,
    }));

    const xs = trackPoints.map((p) => p.x);
    const ys = trackPoints.map((p) => p.y);
    const result: CircuitTrackDataResponse = {
      trackPoints, corners, marshalSectors, rotation: data.rotation,
      bounds: { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) },
    };

    await setCachedData(0, cacheKey, [result]).catch(() => null);
    return result;
  } catch {
    console.warn(`[Multiviewer] Failed for circuit ${circuitId} (key ${circuitKey})`);
    return null;
  }
}

export async function getCircuitElevation(circuitId: string): Promise<CircuitElevationResponse | null> {
  const meetingKey = gridToMeetingKey[circuitId];
  if (!meetingKey) return null;

  const sessions = await fetchSessions(meetingKey);
  const raceSes = sessions.find((s) => s.session_type === "Race");
  if (!raceSes) return null;

  const laps = await fetchLaps(raceSes.session_key);
  if (laps.length === 0) return null;

  const leaderLaps = laps.filter((l) => l.driver_number === laps[0]!.driver_number).sort((a, b) => a.lap_number - b.lap_number);
  const lap1 = leaderLaps.find((l) => l.lap_number === 1);
  const lap2 = leaderLaps.find((l) => l.lap_number === 2);
  if (!lap1?.date_start || !lap2?.date_start) return null;

  const raw = await fetchLocation(raceSes.session_key, laps[0]!.driver_number);
  const startMs = new Date(lap1.date_start).getTime();
  const endMs = new Date(lap2.date_start).getTime();
  const lapPts = raw.filter((r) => { const t = new Date(r.date).getTime(); return t >= startMs && t < endMs && (r.x !== 0 || r.y !== 0); });

  if (lapPts.length === 0) return null;

  const points: { distance: number; altitude: number }[] = [];
  let cumDist = 0;
  let totalClimb = 0;
  for (let i = 0; i < lapPts.length; i++) {
    if (i > 0) {
      const dx = lapPts[i]!.x - lapPts[i - 1]!.x;
      const dy = lapPts[i]!.y - lapPts[i - 1]!.y;
      cumDist += Math.sqrt(dx * dx + dy * dy);
      const dz = lapPts[i]!.z - lapPts[i - 1]!.z;
      if (dz > 0) totalClimb += dz;
    }
    points.push({ distance: Math.round(cumDist), altitude: lapPts[i]!.z });
  }

  const alts = points.map((p) => p.altitude);
  return { points, minAltitude: Math.min(...alts), maxAltitude: Math.max(...alts), totalClimb: Math.round(totalClimb) };
}

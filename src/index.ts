import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./config/env.js";
import { calendarRouter } from "./routes/calendar.js";
import { resultsRouter } from "./routes/results.js";
import { standingsRouter } from "./routes/standings.js";
import { teamsRouter } from "./routes/teams.js";
import { driversRouter } from "./routes/drivers.js";
import { circuitsRouter } from "./routes/circuits.js";
import { timingRouter } from "./routes/timing.js";
import { sessionsRouter } from "./routes/sessions.js";
import { newsRouter } from "./routes/news.js";
import { triviaRouter } from "./routes/trivia.js";
import { recordsRouter } from "./routes/records.js";
import { factsRouter } from "./routes/facts.js";
import { upgradesRouter } from "./routes/upgrades.js";
import { glossaryRouter } from "./routes/glossary.js";
import { syncRouter } from "./routes/sync.js";
import { meetingsRouter } from "./routes/meetings.js";
import { replayRouter } from "./routes/replay.js";

const app = express();
const PORT = env.PORT;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/calendar", calendarRouter);
app.use("/api/results", resultsRouter);
app.use("/api/standings", standingsRouter);
app.use("/api/teams", teamsRouter);
app.use("/api/drivers", driversRouter);
app.use("/api/circuits", circuitsRouter);
app.use("/api/timing", timingRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/news", newsRouter);
app.use("/api/trivia", triviaRouter);
app.use("/api/records", recordsRouter);
app.use("/api/facts", factsRouter);
app.use("/api/upgrades", upgradesRouter);
app.use("/api/glossary", glossaryRouter);
app.use("/api/sync", syncRouter);
app.use("/api/meetings", meetingsRouter);
app.use("/api/replay", replayRouter);

app.listen(PORT, () => {
  console.log(`GRID backend running on port ${PORT}`);
});

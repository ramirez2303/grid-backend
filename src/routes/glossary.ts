import { Router } from "express";

export const glossaryRouter = Router();

glossaryRouter.get("/", (_req, res) => {
  res.json({ message: "GET /api/glossary — not implemented" });
});

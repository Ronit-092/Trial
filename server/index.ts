import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleLogin, handleRegister } from "./routes/auth";
import {
  handleGetComplaints,
  handleCreateComplaint,
  handleGetComplaint,
  handleUpdateComplaint,
} from "./routes/complaints";
import { handleGetStats, setComplaints } from "./routes/stats";

// Store complaints map to be shared with stats route
const complaintsMap = new Map();

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Share complaints with stats module
  setComplaints(complaintsMap);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth routes
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/register", handleRegister);

  // Complaints routes
  app.get("/api/complaints", handleGetComplaints);
  app.post("/api/complaints", handleCreateComplaint);
  app.get("/api/complaints/:id", handleGetComplaint);
  app.patch("/api/complaints/:id", handleUpdateComplaint);

  // Stats routes
  app.get("/api/stats", handleGetStats);

  return app;
}

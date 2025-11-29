import { RequestHandler } from "express";
import { StatsResponse } from "@shared/api";
import store from "../store";

export const handleGetStats: RequestHandler = (req, res) => {
  try {
    const allComplaints = Array.from(store.complaints.values());
    const totalComplaints = allComplaints.length;
    const resolvedComplaints = allComplaints.filter(
      (c) => c.status === "resolved"
    ).length;

    res.json({
      totalComplaints,
      resolvedComplaints,
    } as StatsResponse);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

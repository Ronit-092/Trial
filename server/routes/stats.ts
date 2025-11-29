import { RequestHandler } from "express";
import { StatsResponse } from "@shared/api";

// Import the complaints from the complaints route
let complaints: Map<string, any> = new Map();

// Export function to set complaints (will be called from server/index.ts)
export function setComplaints(complaintsMap: Map<string, any>) {
  complaints = complaintsMap;
}

export const handleGetStats: RequestHandler = (req, res) => {
  try {
    const allComplaints = Array.from(complaints.values());
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

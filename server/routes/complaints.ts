import { RequestHandler } from "express";
import {
  Complaint,
  ComplaintsResponse,
  CreateComplaintRequest,
  UpdateComplaintRequest,
  UpdateComplaintStatusResponse,
} from "@shared/api";
import store from "../store";

// Mock auth middleware - in production use real JWT validation
export function extractUserId(req: any): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  // Mock token parsing: token_userId_timestamp
  const parts = token.split("_");
  if (parts.length >= 2) {
    return parts[1];
  }

  return null;
}

export const handleGetComplaints: RequestHandler = (req, res) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const allComplaints = Array.from(store.complaints.values());

    res.json({
      complaints: allComplaints,
      total: allComplaints.length,
    } as ComplaintsResponse);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
};

export const handleCreateComplaint: RequestHandler = (req, res) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const {
      title,
      description,
      category,
      location,
    } = req.body as CreateComplaintRequest;

    if (!title || !description || !category || !location) {
      res
        .status(400)
        .json({
          message:
            "Title, description, category, and location are required",
        });
      return;
    }

    const complaintId = `complaint_${Date.now()}`;
    const newComplaint: Complaint = {
      id: complaintId,
      title,
      description,
      category,
      location: {
        latitude: location.latitude || 0,
        longitude: location.longitude || 0,
        address: location.address || "",
      },
      status: "pending",
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updates: [],
      imageUrl: req.body.imageUrl,
    };

    store.complaints.set(complaintId, newComplaint);

    res.status(201).json({
      complaint: newComplaint,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create complaint" });
  }
};

export const handleGetComplaint: RequestHandler = (req, res) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const complaint = store.complaints.get(id);

    if (!complaint) {
      res.status(404).json({ message: "Complaint not found" });
      return;
    }

    res.json({ complaint });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch complaint" });
  }
};

export const handleUpdateComplaint: RequestHandler = (req, res) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const { status, message } = req.body as UpdateComplaintRequest;

    const complaint = store.complaints.get(id);
    if (!complaint) {
      res.status(404).json({ message: "Complaint not found" });
      return;
    }

    complaint.status = status;
    complaint.updatedAt = new Date().toISOString();

    if (message) {
      complaint.updates.push({
        id: `update_${Date.now()}`,
        message,
        createdAt: new Date().toISOString(),
        createdBy: userId,
      });
    }

    store.complaints.set(id, complaint);

    res.json({
      complaint,
    } as UpdateComplaintStatusResponse);
  } catch (error) {
    res.status(500).json({ message: "Failed to update complaint" });
  }
};

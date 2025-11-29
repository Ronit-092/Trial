/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  userType: "public" | "government";
  createdAt: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: "garbage" | "roads" | "electricity" | "other";
  imageUrl?: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: "pending" | "in-progress" | "resolved";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  updates: ComplaintUpdate[];
}

export interface ComplaintUpdate {
  id: string;
  message: string;
  createdAt: string;
  createdBy: string;
}

export interface StatsResponse {
  totalComplaints: number;
  resolvedComplaints: number;
}

export interface ComplaintsResponse {
  complaints: Complaint[];
  total: number;
}

export interface ComplaintResponse {
  complaint: Complaint;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  userType: "public" | "government";
}

export interface CreateComplaintRequest {
  title: string;
  description: string;
  category: "garbage" | "roads" | "electricity" | "other";
  imageUrl?: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface UpdateComplaintRequest {
  status: "pending" | "in-progress" | "resolved";
  message?: string;
}

export interface UpdateComplaintStatusResponse {
  complaint: Complaint;
}

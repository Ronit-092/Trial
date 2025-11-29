import { Complaint, User } from "@shared/api";

// Shared data store
export const store = {
  complaints: new Map<string, Complaint>(),
  users: new Map<string, User & { password: string }>(),
};

export default store;

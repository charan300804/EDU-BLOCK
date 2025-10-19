export type Role = "admin" | "principal" | "student" | "employer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Certificate {
  id: string;
  title: string;
  studentId: string;
  principalId: string;
  timestamp: string;
  hash: string;
  blockchainTxId?: string;
}

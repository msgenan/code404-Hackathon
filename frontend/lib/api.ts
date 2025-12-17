// API_BASE_URL: Browser'dan /api kullan (Nginx proxy), server-side'da Docker network kullan
const API_BASE_URL = 
  typeof window !== "undefined"
    ? "/api" // Browser: Nginx reverse proxy üzerinden
    : process.env.NEXT_PUBLIC_API_URL || "http://backend:8000"; // Server-side: Docker network

interface RequestOptions extends RequestInit {
  body?: any;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      console.log("Using auth token:", token.substring(0, 20) + "...");
    } else {
      console.warn("No auth token found in localStorage!");
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    if (options.body && typeof options.body === "object") {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage =
            errorData.error || errorData.detail || errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use status text
        }
        throw new Error(errorMessage);
      }

      // Handle empty responses (204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body });
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", body });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  }

  // Auth methods
  async login(data: { email: string; password: string }) {
    return this.post("/auth/login", data);
  }

  async register(data: { email: string; password: string; full_name: string }) {
    return this.post("/auth/register", data);
  }

  // Doctor methods
  async getDoctors() {
    return this.get("/doctors");
  }

  // Appointment methods
  async getMyAppointments() {
    return this.get("/appointments/my");
  }

  async createAppointment(data: { doctor_id: number; start_time: string }) {
    return this.post("/appointments", data);
  }

  // Patient methods
  async getWaitingList() {
    return this.get("/patients/waiting-list");
  }

  async getPriorityPatients() {
    return this.get("/patients/priority");
  }

  // User methods
  async getCurrentUser() {
    return this.get("/auth/me");
  }

  async checkProfileCompletion() {
    return this.get("/users/profile-completion");
  }

  async updateProfile(data: {
    full_name?: string;
    phone?: string;
    age?: number;
    gender?: string;
    medical_history?: string;
    allergies?: string;
  }) {
    return this.put("/users/profile", data);
  }
}

export const api = new ApiClient(API_BASE_URL);

export function saveToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("auth_token", token);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_data");
}

export function removeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_data");
}

export function saveUserData(data: any): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("user_data", JSON.stringify(data));
}

export function getUserData(): any {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("user_data");
  return data ? JSON.parse(data) : null;
}

// Type definitions
export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

export interface Appointment {
  id: number;
  doctor_id: number;
  patient_id: number;
  start_time: string;
  status: string;
  doctor?: User;
  patient?: User;
}

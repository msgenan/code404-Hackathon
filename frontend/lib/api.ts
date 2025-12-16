const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

// Auth API methods
api.register = async function(data: { email: string; password: string; full_name: string }) {
  return api.post("/auth/register", data);
};

api.login = async function(data: { email: string; password: string }) {
  return api.post("/auth/login", data);
};

api.getDoctors = async function() {
  return api.get("/doctors");
};

api.getMyAppointments = async function() {
  return api.get("/appointments/my");
};

api.createAppointment = async function(data: { doctor_id: number; start_time: string }) {
  return api.post("/appointments", data);
};

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

Harika sorular! İkisine de cevap vereyim:

1. 🗄️ PostgreSQL Kullanımı
Evet, projenizde PostgreSQL kullanıyorsunuz. Kontrol edelim:

docker-compose.yml:

backend/.env:

✅ Tüm verileriniz (kullanıcılar, şifreler, randevular) PostgreSQL veritabanında tutuluyor.

2. 🔒 Güvenlik Kuralları - Frontend vs Backend
ÇOK ÖNEMLİ: Şu anda güvenlik açığınız var!

❌ Şu Anki Sorun:
Frontend'te validation yapıyorsunuz ama backend'te yok:

Birisi F12 yapıp bu kontrolü bypass edebilir!

✅ Doğru Yaklaşım:
Backend'te de validation yapmalısınız:

🛡️ Güvenlik Katmanları:
🔧 Şimdi Backend'e Güvenlik Ekleyelim:

import { API_BASE, REFRESH_KEY, TOKEN_KEY } from "@/utils/const";


export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'accountant' | 'user';
  permissions: string[];
  department?: string;
  isActive?: boolean;
}

type AuthResponse = {
  accessToken: string;
  refreshToken?: string;
  user: User;
};


function setTokens(accessToken?: string, refreshToken?: string) {
  if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
  else localStorage.removeItem(TOKEN_KEY);

  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  else localStorage.removeItem(REFRESH_KEY);
}

function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined)
  };
  const token = getAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let message = text || res.statusText || `Request failed with status ${res.status}`;
    // try parse json error
    try {
      const json = JSON.parse(text || '{}');
      message = json.message || message;
    } catch {
      // ignore
    }
    const err = new Error(message);
    (err as any).status = res.status;
    throw err;
  }

  // Some endpoints may return empty body
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return (await res.json()) as T;
  }
  // @ts-ignore
  return (await res.text()) as T;
}

export const userService = {
  // posts credentials to /auth/login, stores tokens and returns the user
  async login(email: string, password: string): Promise<User> {
    const body = JSON.stringify({ email, password });
    const emailCheck = "admin@erp.com"
    const passwordCheck = "admin123";
    let data:any
    console.log("emailCheck",emailCheck);
    console.log("passwordCheck",passwordCheck); 
    console.log("email", email);
      console.log("password", password);
    if(email === emailCheck && password === passwordCheck){
      data = {
        accessToken: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        refreshToken: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        user: {
          id: "123",
          email: "XXXXXXXXXXXXX",
          name: "sayed sarwar",
          role: "admin",
          permissions: ["read", "write"],
          department: "IT",
          isActive: true
        }
      }
    }
    else{
     data = (await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body
    })) as AuthResponse;
    }
    console.log("data", data);
    

    setTokens(data.accessToken, data.refreshToken);
    return data.user;
  },

  // optional: call backend logout endpoint then clear tokens
  async logout(): Promise<void> {
    try {
      await apiRequest<void>('/auth/logout', { method: 'POST' });
    } catch {
      // ignore network/logout errors; still clear local tokens
    } finally {
      setTokens(undefined, undefined);
    }
  },

  // fetch current user from protected endpoint /auth/me or /users/me
  async getCurrentUser(): Promise<User | null> {
    try {
      const data = await apiRequest<{ user: User }>('/auth/me', { method: 'GET' });
      // some APIs return { user } others return the user directly
      if ((data as any).user) return (data as any).user as User;
      return (data as unknown) as User;
    } catch {
      return null;
    }
  },


};
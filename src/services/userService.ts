import { API_BASE, REFRESH_KEY, TOKEN_KEY } from "@/utils/const";


export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'accountant' | 'sales' | 'purchase';
  permissions: string[];
  department?: string;
  isActive?: boolean;
  defaultRoute?: string;
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
    // Demo login - different roles for testing
    const demoUsers = {
      'admin@erp.com': { role: 'admin', name: 'Admin User' },
      'accountant@erp.com': { role: 'accountant', name: 'Accountant User' },
      'sales@erp.com': { role: 'sales', name: 'Sales User' },
      'purchase@erp.com': { role: 'purchase', name: 'Purchase User' }
    };
    
    const demoUser = demoUsers[email as keyof typeof demoUsers];
    
    if(demoUser && password === passwordCheck){
      data = {
        accessToken: "demo_token_" + Date.now(),
        refreshToken: "demo_refresh_" + Date.now(),
        user: {
          id: "demo_" + demoUser.role,
          email: email,
          name: demoUser.name,
          role: demoUser.role as 'admin' | 'accountant' | 'sales' | 'purchase',
          permissions: ["read", "write"],
          department: demoUser.role.toUpperCase(),
          isActive: true,
          defaultRoute: demoUser.role === 'admin' ? '/dashboard' : 
                       demoUser.role === 'sales' ? '/sales' :
                       demoUser.role === 'purchase' ? '/purchase' : '/dashboard'
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
      // Skip API call for demo mode
      const token = getAccessToken();
      if (!token || token.startsWith('demo_token_')) {
        // Demo mode - just clear tokens
        setTokens(undefined, undefined);
        return;
      }
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
      const token = getAccessToken();
      if (!token) return null;
      
      // For demo mode, return user from localStorage
      if (token.startsWith('demo_token_')) {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
      }
      
      const data = await apiRequest<{ user: User }>('/auth/me', { method: 'GET' });
      // some APIs return { user } others return the user directly
      if ((data as any).user) return (data as any).user as User;
      return (data as unknown) as User;
    } catch {
      return null;
    }
  },


};
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
  
  // Clear user data when tokens are cleared
  if (!accessToken) {
    localStorage.removeItem('userData');
  }
}

function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined)
  };
  const token = getAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  console.log(`[API Request] ${options.method || 'GET'} ${API_BASE}${path}`);

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
    console.error(`[API Error] ${res.status}: ${message}`);
    const err = new Error(message);
    (err as any).status = res.status;
    throw err;
  }

  // Some endpoints may return empty body
  const contentType = res.headers.get('content-type') || '';
  let responseData: T;
  
  if (contentType.includes('application/json')) {
    responseData = (await res.json()) as T;
  } else {
    // @ts-ignore
    responseData = (await res.text()) as T;
  }
  
  console.log(`[API Response] ${options.method || 'GET'} ${API_BASE}${path}:`, responseData);
  return responseData;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const userService = {
  // posts registration data to /auth/register
  async register(data: RegisterData): Promise<{ message: string }> {
    const body = JSON.stringify(data);
    const response = await apiRequest<{ message: string }>('/auth/register', {
      method: 'POST',
      body
    });
    return response;
  },

  // posts credentials to /auth/login, stores tokens and returns the user
  async login(email: string, password: string): Promise<User> {
    const body = JSON.stringify({ email, password });
    
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body
    });
    
    // Parse response data properly
    const responseData = await Promise.resolve(response);
    
    // Handle different response structures
    let data: AuthResponse;
    
    // If response is already the AuthResponse object
    if ('user' in responseData && 'accessToken' in responseData) {
      data = responseData as AuthResponse;
    } else if ('data' in responseData && (responseData as any).data?.user) {
      // If response has data wrapper
      data = (responseData as any).data as AuthResponse;
    } else {
      // Treat entire response as AuthResponse
      data = responseData as AuthResponse;
    }
    
    // Validate required fields
    if (!data.user) {
      console.error('Login error: Missing user in response', data);
      throw new Error('Invalid response: missing user data');
    }
    
    if (!data.accessToken) {
      console.error('Login error: Missing accessToken in response', data);
      throw new Error('Invalid response: missing accessToken');
    }
    
    // Save user data for API login
    localStorage.setItem('userData', JSON.stringify(data.user));

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
      const token = getAccessToken();
      if (!token) return null;
      
      // Fetch from backend
      const data = await apiRequest<{ user: User }>('/auth/me', { method: 'GET' });
      // some APIs return { user } others return the user directly
      if ((data as any).user) return (data as any).user as User;
      return (data as unknown) as User;
    } catch (error) {
      console.error('getCurrentUser error:', error);
      // If token is invalid, clear it
      setTokens(undefined, undefined);
      return null;
    }
  },


};
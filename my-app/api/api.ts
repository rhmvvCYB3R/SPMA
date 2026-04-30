import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://10.55.100.196:8080';

// SESSION STORAGE
export async function saveSession(token: string, email: string) {
  try {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('email', email);
  } catch (e) {
    console.log('saveSession error:', e);
  }
}

export async function clearSession() {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('email');
  } catch (e) {
    console.log('clearSession error:', e);
  }
}

export async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('token');
  } catch (e) {
    console.log('getToken error:', e);
    return null;
  }
}

export async function getStoredEmail(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('email');
  } catch (e) {
    console.log('getEmail error:', e);
    return null;
  }
}

// HEADERS
async function authHeaders(): Promise<Record<string, string>> {
  const token = await getToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  auth = false,
): Promise<T> {
  const headers = auth
    ? await authHeaders()
    : { 'Content-Type': 'application/json', 'Accept': 'application/json' };

  console.log(`[API LOG] ${method} ${path}`);
  if (auth) {
    console.log(`[API LOG] Auth: ${headers.Authorization ? 'Token present' : 'MISSING TOKEN'}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Получаем текст ответа
  const text = await res.text();

  if (!res.ok) {
    console.log(`[API ERROR] ${res.status}: ${text}`);
    let message = `HTTP ${res.status}`;
    try {
      const err = JSON.parse(text);
      message = err.message || message;
    } catch {
      message = text || message;
    }
    throw new Error(message);
  }

  // ОБРАБОТКА ПУСТОГО ОТВЕТА (как в твоем Swagger: content-length: 0)
  if (!text || text.trim().length === 0) {
    return {} as T;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    // Если сервер вернул строку вместо JSON
    return text as unknown as T;
  }
}

// TYPES
export interface LoginResponse {
  token: string;
  email: string;
}

export interface MessageResponse {
  message: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'PENDING' | 'DONE';
  userEmail: string;
}

// AUTH API
export const authApi = {
  login: (email: string, password: string) =>
    request<LoginResponse>('POST', '/api/auth/login', { email, password }),

  register: (email: string, password: string, confirmPassword: string) =>
    request<MessageResponse>('POST', '/api/auth/register', {
      email,
      password,
      confirmPassword,
    }),

  verify: (code: string) =>
    request<MessageResponse>('POST', '/api/auth/verify', {
      message: code,
    }),

  resendVerify: (email: string) =>
    request<MessageResponse>(
      'POST', 
      `/api/auth/resend-verify?email=${encodeURIComponent(email)}`
    ),

  forgotPassword: (email: string) =>
    request<MessageResponse>(
      'POST', 
      `/api/auth/forgot-password?email=${encodeURIComponent(email)}`
    ),

  verifyResetCode: (email: string, code: string) =>
    request<MessageResponse>(
      'PUT', 
      `/api/auth/verify-reset-code?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`
    ),

  resetPassword: (email: string, code: string, password: string, confirmPassword: string) => {
    const queryParams = new URLSearchParams({ email, code }).toString();
    return request<MessageResponse>('PUT', `/api/auth/reset-password?${queryParams}`, {
      email,
      password,
      confirmPassword
    });
  },

  updatePassword: (oldPassword: string, newPassword: string, confirmPassword: string) => 
    request<MessageResponse>('PUT', '/api/user/password', { 
      oldPassword, 
      newPassword, 
      confirmPassword 
    }, true),
};

// TASKS API
export const tasksApi = {
  getAll: () => request<Task[]>('GET', '/api/tasks', undefined, true),
  
  create: (title: string, description: string, dueDate: string) =>
    request<Task>('POST', '/api/tasks', { title, description, dueDate }, true),
  
  markDone: (id: number) =>
    request<Task>('PUT', `/api/tasks/${id}/done`, undefined, true),
  
  delete: (id: number) =>
    request<any>('DELETE', `/api/tasks/${id}`, undefined, true),
  
  export: async (): Promise<void> => {
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/api/tasks/export`, {
      headers: token ? { Authorization: `Bearer ${token}` } : { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  },
};

// USER API
export const userApi = {
  me: () => request<Record<string, unknown>>('GET', '/api/user/me', undefined, true),
  
  requestEmailChange: (newEmail: string) =>
    request<MessageResponse>('PUT', '/api/user/email/request', { newEmail }, true),
    
  confirmEmailChange: (code: string) =>
    request<MessageResponse>('PUT', '/api/user/email/confirm', { code }, true),
  
   resendEmailChange: (email: string) =>
    request<MessageResponse>('POST', `/api/auth/resend-verify?email=${encodeURIComponent(email)}`),
};

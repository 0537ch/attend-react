interface UserData {
  [key: string]: unknown;
}

interface AuthState {
  token: string | null;
  user: UserData | null;
  tokenExpiry: string | null;
}

const STORAGE_KEY = 'tps_auth';

class AuthManager {
  private listeners: Set<(state: AuthState) => void> = new Set();

  constructor() {
    // Load from localStorage on init
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load auth from localStorage:', error);
    }
    return {
      token: null,
      user: null,
      tokenExpiry: null,
    };
  }

  private saveToStorage(state: AuthState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save auth to localStorage:', error);
    }
  }

  getState(): AuthState {
    return this.loadFromStorage();
  }

  getToken(): string | null {
    const state = this.loadFromStorage();
    return state.token;
  }

  getUser(): UserData | null {
    const state = this.loadFromStorage();
    return state.user;
  }

  isAuthenticated(): boolean {
    const state = this.loadFromStorage();

    // Check if token exists
    if (!state.token) {
      return false;
    }

    if (state.tokenExpiry) {
      const expiryDate = new Date(state.tokenExpiry);
      if (expiryDate < new Date()) {
        this.clearAuth();
        return false;
      }
    }

    return true;
  }

  getTokenExpiry(): string | null {
    const state = this.loadFromStorage();
    return state.tokenExpiry;
  }

  setAuth(token: string, user: UserData | null, tokenExpiry: string | null = null) {
    const state = {
      token,
      user,
      tokenExpiry,
    };
    this.saveToStorage(state);
    this.notifyListeners(state);
  }

  clearAuth() {
    const state = {
      token: null,
      user: null,
      tokenExpiry: null,
    };
    this.saveToStorage(state);
    this.notifyListeners(state);
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener);
    listener(this.loadFromStorage());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(state: AuthState) {
    this.listeners.forEach((listener) => listener(state));
  }
}

export const authManager = new AuthManager();

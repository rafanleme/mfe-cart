import { AuthApi } from "@mfe/contracts";

let state = { isAuthenticated: false, user: null as any };

const listeners = new Set<(s: typeof state) => void>();
const emit = () => listeners.forEach((l) => l(state));

const authApi: AuthApi = {
  getSnapshot: () => state,
  subscribe(cb) {
    listeners.add(cb as any);
    return () => listeners.delete(cb as any);
  },
  async login(email: string, password: string) {
    state = { isAuthenticated: true, user: { id: "dev", name: "Dev User", email } };
    emit();
    return Promise.resolve(state.user);
  },
  async logout() {
    state = { isAuthenticated: false, user: null };
    emit();
    return Promise.resolve();
  },
};

export default authApi;

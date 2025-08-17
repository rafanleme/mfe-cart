import { useRemote } from "./useRemote";
import type { AuthApi } from "@mfe/contracts";

export function useAuthApi() {
  return useRemote<AuthApi>(
    async () => {
      const m = (await import("host/authApi")) as {
        default?: AuthApi;
        authApi?: AuthApi;
      };
      return (
        m.default ??
        m.authApi ??
        (() => {
          throw new Error("AuthApi não encontrado");
        })()
      );
    },
    async () => {
      const m = (await import("../mocks/authApi.local")) as {
        default?: AuthApi;
        authApi?: AuthApi;
      };
      return (
        m.default ??
        m.authApi ??
        (() => {
          throw new Error("Mock AuthApi não encontrado");
        })()
      );
    }
  );
}

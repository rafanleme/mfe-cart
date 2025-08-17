import { useRemote } from "./useRemote";
import type { CartApi } from "@mfe/contracts";

export function useCartApi() {
  return useRemote<CartApi>(
    async () => {
      const m = (await import("host/cartApi")) as {
        default?: CartApi;
        cartApi?: CartApi;
      };
      return (
        m.default ??
        m.cartApi ??
        (() => {
          throw new Error("CartApi não encontrado");
        })()
      );
    },
    async () => {
      const m = (await import("../mocks/cartApi.local")) as {
        default?: CartApi;
        cartApi?: CartApi;
      };
      return (
        m.default ??
        m.cartApi ??
        (() => {
          throw new Error("Mock CartApi não encontrado");
        })()
      );
    }
  );
}

import { useEffect, useRef, useState } from "react";
import { loadWithFallback } from "../federation/loadRemote";

type Status = "idle" | "loading" | "ready" | "error";

export function useRemote<T>(
  remoteLoader: () => Promise<T>,
  fallbackLoader: () => Promise<T>,
  opts?: { standalone?: boolean }
) {
  const [mod, setMod] = useState<T | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    setStatus("loading");
    loadWithFallback(remoteLoader, fallbackLoader, opts)
      .then((m) => {
        if (!mounted.current) return;
        setMod(m);
        setStatus("ready");
      })
      .catch(() => mounted.current && setStatus("error"));

    return () => {
      mounted.current = false;
    };
  }, []);

  return { mod, status };
}

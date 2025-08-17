export type Loader<T> = () => Promise<T>;

type Options = {
  standalone?: boolean;
};

export async function loadWithFallback<T>(
  remoteLoader: Loader<T>,
  fallbackLoader: Loader<T>,
  opts: Options = {}
): Promise<T> {
  const isStandalone =
    opts.standalone ??
    (typeof process !== "undefined" && process.env?.STANDALONE === "true");

  if (isStandalone) return fallbackLoader();

  try {
    return await remoteLoader();
  } catch (err) {
    console.warn("[ModuleFederation] Falling back to local mock:", err);
    return fallbackLoader();
  }
}

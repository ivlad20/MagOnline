"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** False during SSR and the first hydration render, true afterwards. */
export function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}

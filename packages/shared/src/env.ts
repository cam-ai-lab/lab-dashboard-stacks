import type { EnvironmentStatus } from "./types.js";

export function environmentStatus(
  names: readonly string[],
  environment: Readonly<Record<string, string | undefined>>
): EnvironmentStatus[] {
  return names.map((name) => ({
    name,
    present: Boolean(environment[name]?.trim())
  }));
}

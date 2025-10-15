export const EVENTS = {
  CONNECTED: "CONNECTED",
  START_BATTLE: "START_BATTLE",
  JOIN_BATTLE: "JOIN_BATTLE",
} as const;

export type Events = keyof typeof EVENTS;

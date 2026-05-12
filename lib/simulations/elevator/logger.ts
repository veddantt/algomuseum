import { ElevatorLogEvent } from "./types";

export function createLog(message: string, type: "info" | "action" | "system" = "info"): ElevatorLogEvent {
  return {
    timestamp: Date.now(),
    message,
    type,
  };
}

export type ElevatorDirection = "up" | "down" | "idle";
export type ElevatorAlgorithm = "fcfs" | "sstf" | "scan";

export interface ElevatorRequest {
  floor: number;
  timestamp: number;
}

export interface ElevatorState {
  currentFloor: number;
  direction: ElevatorDirection;
  algorithm: ElevatorAlgorithm;
  queue: ElevatorRequest[];
  completedRequests: number;
  totalRequests: number;
  targetFloor?: number | null;
}

export type ElevatorAction = 
  | { type: "REQUEST_FLOOR"; payload: { floor: number } }
  | { type: "SET_ALGORITHM"; payload: { algorithm: ElevatorAlgorithm } }
  | { type: "STEP" }
  | { type: "ARRIVE_AT_TARGET" }
  | { type: "RESET" };

export interface ElevatorLogEvent {
  timestamp: number;
  message: string;
  type: "info" | "action" | "system";
}

export interface ElevatorMetrics {
  queueLength: number;
  completedRequests: number;
  totalRequests: number;
  currentFloor: number;
  direction: ElevatorDirection;
  algorithm: ElevatorAlgorithm;
  targetFloor: number | null;
}

export interface ElevatorStepResponse {
  state: ElevatorState;
  logs: ElevatorLogEvent[];
  metrics: ElevatorMetrics;
}

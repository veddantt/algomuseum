import { ElevatorState } from "./types";

export const defaultState: ElevatorState = {
  currentFloor: 1,
  direction: "idle",
  algorithm: "fcfs",
  queue: [],
  completedRequests: 0,
  totalRequests: 0,
  targetFloor: null,
};

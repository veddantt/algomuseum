import { NextResponse } from "next/server";
import { processElevatorAction } from "@/lib/simulations/elevator/engine";
import { ElevatorState, ElevatorAction, ElevatorStepResponse } from "@/lib/simulations/elevator/types";

/**
 * Step endpoint for the Elevator Dispatch backend.
 * Evaluates the next algorithm action based on the current state.
 * 
 * Example usage (REQUEST_FLOOR):
 * curl -X POST http://localhost:3000/api/exhibits/elevator-dispatch/step \
 *   -H "Content-Type: application/json" \
 *   -d '{ "state": { "currentFloor": 1, "direction": "idle", "algorithm": "fcfs", "queue": [], "completedRequests": 0, "totalRequests": 0, "targetFloor": null }, "action": { "type": "REQUEST_FLOOR", "payload": { "floor": 5 } } }'
 * 
 * Example usage (STEP):
 * curl -X POST http://localhost:3000/api/exhibits/elevator-dispatch/step \
 *   -H "Content-Type: application/json" \
 *   -d '{ "state": { "currentFloor": 1, "direction": "up", "algorithm": "fcfs", "queue": [{ "floor": 5, "timestamp": 123 }], "completedRequests": 0, "totalRequests": 1, "targetFloor": null }, "action": { "type": "STEP" } }'
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { state, action } = body as { state: ElevatorState; action: ElevatorAction };

    if (!state || !action) {
      return NextResponse.json({ error: "Missing state or action" }, { status: 400 });
    }

    // Validation
    if (action.type === "REQUEST_FLOOR") {
      if (typeof action.payload.floor !== "number" || action.payload.floor < 1 || action.payload.floor > 10) {
        return NextResponse.json({ error: "Floor must be between 1 and 10" }, { status: 400 });
      }
    }

    if (action.type === "SET_ALGORITHM") {
      if (!["fcfs", "sstf", "scan"].includes(action.payload.algorithm)) {
        return NextResponse.json({ error: "Invalid algorithm. Must be fcfs, sstf, or scan." }, { status: 400 });
      }
    }

    // Engine is pure, state is not mutated
    const { state: newState, logs } = processElevatorAction(state, action);

    // Map metrics for frontend
    const response: ElevatorStepResponse = {
      state: newState,
      logs,
      metrics: {
        queueLength: newState.queue.length,
        completedRequests: newState.completedRequests,
        totalRequests: newState.totalRequests,
        currentFloor: newState.currentFloor,
        direction: newState.direction,
        algorithm: newState.algorithm,
        targetFloor: newState.targetFloor || null
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON or request format" }, { status: 400 });
  }
}

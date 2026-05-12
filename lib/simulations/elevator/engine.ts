import { ElevatorState, ElevatorAction, ElevatorLogEvent, ElevatorRequest } from "./types";
import { createLog } from "./logger";
import { defaultState } from "./defaultState";

/**
 * Pure function to process elevator actions against the current state.
 * Returns a new ElevatorState without mutating the original.
 */
export function processElevatorAction(
  state: ElevatorState,
  action: ElevatorAction
): { state: ElevatorState; logs: ElevatorLogEvent[] } {
  const logs: ElevatorLogEvent[] = [];

  switch (action.type) {
    case "RESET":
      logs.push(createLog("System reset to default state.", "system"));
      return { state: { ...defaultState, algorithm: state.algorithm }, logs };

    case "SET_ALGORITHM":
      logs.push(createLog(`Algorithm changed to ${action.payload.algorithm.toUpperCase()}`, "system"));
      return { state: { ...state, algorithm: action.payload.algorithm }, logs };

    case "REQUEST_FLOOR": {
      const floor = action.payload.floor;
      if (
        state.queue.some((r) => r.floor === floor) ||
        (state.currentFloor === floor && state.targetFloor === null) ||
        state.targetFloor === floor
      ) {
        // Floor already queued or currently being served
        return { state, logs };
      }
      
      logs.push(createLog(`Request received for Floor ${floor}`, "action"));
      
      return {
        state: {
          ...state,
          queue: [...state.queue, { floor, timestamp: Date.now() }],
          totalRequests: state.totalRequests + 1,
          direction:
            state.direction === "idle" && !state.targetFloor
              ? floor > state.currentFloor
                ? "up"
                : "down"
              : state.direction,
        },
        logs,
      };
    }

    case "ARRIVE_AT_TARGET": {
      let nextState = { ...state };

      if (nextState.targetFloor === null || nextState.targetFloor === undefined) {
        logs.push(createLog("No target floor locked. Cannot arrive.", "system"));
        return { state: nextState, logs };
      }

      nextState.currentFloor = nextState.targetFloor;
      nextState.completedRequests += 1;
      logs.push(createLog(`Arrived at Floor ${nextState.currentFloor}`, "info"));
      
      // Clear target floor
      nextState.targetFloor = null;

      if (nextState.queue.length === 0) {
         logs.push(createLog("All requests completed. System idle.", "system"));
         nextState.direction = "idle";
      }

      return { state: nextState, logs };
    }

    case "STEP": {
      let nextState = { ...state };

      // Determine the next target floor if the queue has pending requests
      if (nextState.queue.length > 0) {
        let nextTarget: ElevatorRequest | null = null;

        switch (nextState.algorithm) {
          case "fcfs":
            // First-Come, First-Served: oldest request wins
            nextTarget = nextState.queue[0];
            break;

          case "sstf":
            // Shortest Seek Time First: closest floor wins
            let minDistance = Infinity;
            for (const req of nextState.queue) {
              const dist = Math.abs(req.floor - nextState.currentFloor);
              if (
                dist < minDistance ||
                (dist === minDistance && req.timestamp < (nextTarget?.timestamp || Infinity))
              ) {
                minDistance = dist;
                nextTarget = req;
              }
            }
            break;

          case "scan":
            // SCAN: sweep in current direction, then reverse
            let dir = nextState.direction === "idle" ? "up" : nextState.direction;
            let requestsAhead = nextState.queue.filter((r) =>
              dir === "up" ? r.floor >= nextState.currentFloor : r.floor <= nextState.currentFloor
            );

            if (requestsAhead.length === 0) {
              // Reverse direction
              dir = dir === "up" ? "down" : "up";
              requestsAhead = nextState.queue.filter((r) =>
                dir === "up" ? r.floor >= nextState.currentFloor : r.floor <= nextState.currentFloor
              );
              logs.push(createLog(`Reversing scan direction to ${dir}`, "system"));
            }

            if (requestsAhead.length > 0) {
              let scanMinDist = Infinity;
              for (const req of requestsAhead) {
                const dist = Math.abs(req.floor - nextState.currentFloor);
                if (
                  dist < scanMinDist ||
                  (dist === scanMinDist && req.timestamp < (nextTarget?.timestamp || Infinity))
                ) {
                  scanMinDist = dist;
                  nextTarget = req;
                }
              }
            }
            nextState.direction = dir;
            break;
        }

        if (nextTarget) {
          nextState.targetFloor = nextTarget.floor;
          nextState.direction =
            nextState.targetFloor > nextState.currentFloor
              ? "up"
              : nextState.targetFloor < nextState.currentFloor
              ? "down"
              : "idle";
          
          // Remove selected target from queue
          nextState.queue = nextState.queue.filter((r) => r.floor !== nextTarget?.floor);
          logs.push(
            createLog(
              `Target locked: Floor ${nextTarget.floor} (${nextState.algorithm.toUpperCase()})`,
              "system"
            )
          );
        }
      } else {
        // Queue is empty, return to idle
        if (nextState.direction !== "idle") {
          logs.push(createLog("Queue empty. System idle.", "system"));
        }
        nextState.direction = "idle";
      }

      return { state: nextState, logs };
    }

    default:
      return { state, logs };
  }
}

import { NextResponse } from "next/server";
import { defaultState } from "@/lib/simulations/elevator/defaultState";

/**
 * Reset endpoint for the Elevator Dispatch backend.
 * Returns the deterministic default state.
 * 
 * Example usage:
 * curl -X POST http://localhost:3000/api/exhibits/elevator-dispatch/reset
 */
export async function POST() {
  return NextResponse.json(defaultState);
}

export async function GET() {
  return NextResponse.json(defaultState);
}

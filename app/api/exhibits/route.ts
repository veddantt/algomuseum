import { NextResponse } from "next/server";
import { exhibits } from "@/lib/data";

/**
 * Returns a list of all exhibits available in AlgoMuseum.
 * Used by the frontend Museum directory to load metadata.
 */
export async function GET() {
  return NextResponse.json(exhibits);
}

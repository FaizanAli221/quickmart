import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Quickmart API is running",
    timestamp: new Date().toISOString(),
  });
}

// src/app/api/student/data/route.ts
import { NextResponse } from 'next/server';

export const dynamic = "force-static";
export const revalidate = 10;

export async function GET() {
  // TODO: Replace with real data source or API call
  return NextResponse.json({ courses: [], grades: [] });
}

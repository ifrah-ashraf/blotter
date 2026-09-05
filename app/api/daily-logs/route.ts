import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { dateKeyRegex, dateKeyToDate , dateToDateKey} from "@/lib/logbook/date";

const logsSchema = z.object({
  date: z.string().regex(dateKeyRegex),
  dsa: z.string().optional(),
  development: z.string().optional(),
  mathsOther: z.string().optional(),
  dayIntensity: z.number().int().min(1).max(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = logsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues },
        { status: 400 }
      );
    }

    // Convert the dateKey to a UTC Date
    const dateUtc = dateKeyToDate(parsed.data.date);

    const newLog = await prisma.dailyLog.create({
      data: {
        date: dateUtc,
        dsa: parsed.data.dsa,
        development: parsed.data.development,
        mathsOther: parsed.data.mathsOther,
        dayIntensity: parsed.data.dayIntensity,
      },
    });

    // Return the log with the dateKey for frontend consistency
    return NextResponse.json(
      {
        ...newLog,
        date: dateToDateKey(newLog.date),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Failed to create daily log:", error);
    return NextResponse.json(
      { error: `Failed to create daily log ${error}` },
      { status: 500 }
    );
  }
}

// this route return 
export async function GET(request: Request) {
  const dateKey = new URL(request.url).searchParams.get("date");

  // Validate the date format
  if (!dateKey || !dateKeyRegex.test(dateKey)) {
    return NextResponse.json(
      { error: "date must be in YYYY-MM-DD format" },
      { status: 400 }
    );
  }

  const dateUtc = dateKeyToDate(dateKey);

  const todayLog = await prisma.dailyLog.findUnique({
    where: { date: dateUtc },
  });

  if (!todayLog) return NextResponse.json(null);

  // Return with dateKey for consistent frontend representation
  return NextResponse.json({
    ...todayLog,
    date: dateToDateKey(todayLog.date),
  });
}
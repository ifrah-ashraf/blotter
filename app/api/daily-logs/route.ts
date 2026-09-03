import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const logsSchema = z.object({
  date: z.coerce.date(),
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

    const newLog = await prisma.dailyLog.create({
      data: {
        date: parsed.data.date,
        dsa: parsed.data.dsa,
        development: parsed.data.development,
        mathsOther: parsed.data.mathsOther,
        dayIntensity: parsed.data.dayIntensity,
      },
    });

    return NextResponse.json(newLog, { status: 201 });
  } catch (error) {
    console.error("Failed to create daily log:", error);

    return NextResponse.json(
      { error: "Failed to create daily log" },
      { status: 500 }
    );
  }
}
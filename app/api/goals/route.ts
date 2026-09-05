import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { monthKeyRegex , monthKeyToDate , dateToMonthKey } from "@/lib/logbook/date";

const createSchema = z.object({
  month: z.string().regex(monthKeyRegex),
  goalText: z.string().min(1).max(200),
});

export async function GET(request: Request) {
  const month = new URL(request.url).searchParams.get("month");
  if (!month || !monthKeyRegex.test(month)) {
    return NextResponse.json({ error: "month=YYYY-MM required" }, { status: 400 });
  }

  const goal = await prisma.monthlyGoal.findUnique({
    where: { month: monthKeyToDate(month) },
  });

  if (!goal) return NextResponse.json(null);
  return NextResponse.json({ ...goal, month: dateToMonthKey(goal.month) });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const newGoal = await prisma.monthlyGoal.create({
      data: {
        month: monthKeyToDate(parsed.data.month),
        goalText: parsed.data.goalText,
        // achieved: omitted → stays null (undecided)
      },
    });

    return NextResponse.json({ ...newGoal, month: dateToMonthKey(newGoal.month) }, { status: 201 });
  } catch (error) {
    console.error("Failed to create monthly goal", error);
    return NextResponse.json({ error: "Failed to create monthly goal" }, { status: 500 });
  }
}
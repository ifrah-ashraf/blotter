// this api will fetch all the goals
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { dateToMonthKey } from "@/lib/logbook/date";

// to fetch all month GOALS
export async function GET() {
    const goals = await prisma.monthlyGoal.findMany();
    if (!goals) return NextResponse.json(null)
    const transformed = goals.map(key => {
       return {
        ...key,
        month: dateToMonthKey(key.month)
       }
    })
    return NextResponse.json(transformed)
} 
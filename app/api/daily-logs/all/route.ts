// to fetch all the logs

import { dateToDateKey } from "@/lib/logbook/date";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(){
    const logs = await prisma.dailyLog.findMany();
    if(!logs) return NextResponse.json(null);

    const transformed = logs.map(item => {
        return {
            ...item ,
            date: dateToDateKey(item.date)
        }
    })

    return NextResponse.json(transformed)
}
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const patchSchema = z.object({ achieved: z.boolean() });

// in new nextjs 15+ the params is now a promise
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params; // Must await it!
    const body = await request.json();

    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const updated = await prisma.monthlyGoal.update({
        where: { id: id }, // Use the awaited id
        data: { achieved: parsed.data.achieved },
    });

    return NextResponse.json(updated);
}
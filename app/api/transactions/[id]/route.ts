import { NextRequest, NextResponse } from "next/server";
import transaction from "@/lib/models/transaction";
import dbConnect from "@/lib/mongoDb";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
    ) {
    try {
        const body = await req.json();
        const { id } = await params; // Await the params
        await dbConnect();
        const updated = await transaction.findByIdAndUpdate(id, body, {
        new: true,
        });
        return NextResponse.json(updated);
    } catch {
        return NextResponse.json(
        { error: "Error updating transaction" },
        { status: 500 }
        );
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
    ) {
    try {
        const { id } = await params;
        await dbConnect();
        await transaction.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted" });
    } catch {
        return NextResponse.json(
        { error: "Error deleting transaction" },
        { status: 500 }
        );
    }
    }

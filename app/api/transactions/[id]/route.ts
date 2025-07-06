import { NextRequest } from "next/server";
import transaction from "@/lib/models/transaction";
import dbConnect from "@/lib/mongoDb";

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
    ) {
    try {
        const body = await req.json();
        await dbConnect();
        const updated = await transaction.findByIdAndUpdate(params.id, body, {
        new: true,
        });
        return Response.json(updated);
    } catch (error) {
        return Response.json(
        { error: "Error updating transaction" },
        { status: 500 }
        );
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string } }
    ) {
    try {
        await dbConnect();
        await transaction.findByIdAndDelete(params.id);
        return Response.json({ message: "Deleted" });
    } catch (error) {
        return Response.json(
        { error: "Error deleting transaction" },
        { status: 500 }
        );
    }
}

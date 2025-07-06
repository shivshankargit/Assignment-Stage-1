import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/lib/models/transaction";
import dbConnect from "@/lib/mongoDb";
import transaction from "@/lib/models/transaction";

export async function GET() {
    await dbConnect();
    const transactions = await Transaction.find().sort({ date: -1 });
    return NextResponse.json(transactions);
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
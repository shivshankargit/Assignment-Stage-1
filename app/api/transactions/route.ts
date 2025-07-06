import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/lib/models/transaction";
import dbConnect from "@/lib/mongoDb";

export async function GET() {
    await dbConnect();
    const transactions = await Transaction.find().sort({ date: -1 });
    return NextResponse.json(transactions);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        await dbConnect();
        const newTransaction = await Transaction.create(body);
        return NextResponse.json(newTransaction, { status: 201 });
    } catch (error) {
        console.error("POST /api/transactions error:", error);
        return NextResponse.json(
        { error: "Error creating transaction" },
        { status: 500 }
        );
    }
}

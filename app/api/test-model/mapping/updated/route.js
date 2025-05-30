import dbConnect from "@/helper/dbConnect";
import Test from "@/models/Test";
import { NextResponse } from "next/server";

export async function POST(req) {
    await dbConnect();
    const body = await req.json();
    const { id, mapping, antibiotic_columns } = body;
    try {
        const test = await Test.findByIdAndUpdate(
            id,
            {
                mapping_data: mapping,
                antibiotic_columns: antibiotic_columns,
            },
            { new: true, runValidators: true }
        );
        if (!test) {
            return NextResponse.json(
                { success: false, message: "Failed to save updated mapping." },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { success: true, message: "Updated mapping successfully.", data: test },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
import dbConnect from "@/helper/dbConnect";
import Test from "@/models/Test";
import { NextResponse } from "next/server";

export async function POST(req) {
    await dbConnect();
    const body = await req.json();
    const { id, dataset, columns } = body;
    try {
        const test = await Test.create({
            user: id,
            dataset: dataset,
            columns: columns,
        })
        if (!test) {
            return NextResponse.json(
                { success: false, message: "Failed to save mapping." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Saved mapping successfully.", data: test },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    try {
        const test = await Test.findById(id);
        if (!test) {
            return NextResponse.json(
                { success: false, message: "No mappings found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Fetched mappings successfully.", data: test },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
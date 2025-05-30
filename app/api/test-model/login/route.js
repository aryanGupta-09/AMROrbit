import dbConnect from "@/helper/dbConnect";
import { login } from "@/helper/email";
import { NextResponse } from "next/server";

export async function POST(req) {
    await dbConnect();
    const body = await req.json();
    const { username, password } = body;
    try {
        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: "Missing required fields." },
                { status: 400 }
            );
        }
        const user = await login(username, password);
        if (!user.success) {
            return NextResponse.json(
                { success: false, message: "Incorrect details." },
                { status: 500 }
            );
        }
        const u = {
            id: user.user._id,
            username: user.user.username,
            email: user.user.email,
            first_name: user.user.first_name,
            last_name: user.user.last_name,
            verified: user.user.verified,
        }

        return NextResponse.json(
            { success: true, message: "User logged successfully.", data: u },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
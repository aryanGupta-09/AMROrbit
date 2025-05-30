import { checkEmail, checkUsername } from "@/helper/check";
import dbConnect from "@/helper/dbConnect";
import { NextResponse } from "next/server";
import { register } from "@/helper/email";

export async function POST(req) {
    await dbConnect();
    const body = await req.json();
    const { first_name, last_name, username, email, password } = body;
    try {
        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: "Missing required fields." },
                { status: 400 }
            );
        }

        // Check if username, email, and phone number are available
        const usernameCheck = await checkUsername(username);
        if (!usernameCheck.success) {
            return NextResponse.json(
                { success: false, message: usernameCheck.message },
                { status: 400 }
            );
        }
        const emailCheck = await checkEmail(email);
        if (!emailCheck.success) {
            return NextResponse.json(
                { success: false, message: emailCheck.message },
                { status: 400 }
            );
        }

        // Create a new user
        const newUser = await register(first_name, last_name, username, email, password);

        if (!newUser.success) {
            return NextResponse.json(
                { success: false, message: newUser.message },
                { status: 500 }
            );
        }

        const u = {
            id: newUser.user._id,
            username: newUser.user.username,
            email: newUser.user.email,
            first_name: newUser.user.first_name,
            last_name: newUser.user.last_name,
            verified: newUser.user.verified,
        }

        return NextResponse.json(
            { success: true, message: "User created successfully.", data: u },
            { status: 201 }
        );
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
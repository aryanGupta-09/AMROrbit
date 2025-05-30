import User from "@/models/User";
import { hashPass, verifyPass } from "./password";

export const login = async (username, password) => {
    const user = await User.findOne({ username });
    if (!user) {
        return { success: false, message: "User not found." };
    }
    const hashedPassword = user.password;
    const verify = await verifyPass(hashedPassword, password);
    if (!verify) {
        return { success: false, message: "Invalid password." };
    }
    return { success: true, user };
}

export const register = async (first_name, last_name, username, email, password) => {
    const hashedPassword = await hashPass(password);
    const newUser = await User.create({
        first_name,
        last_name,
        username,
        email,
        password: hashedPassword,
    });
    if (!newUser) {
        return { success: false, message: "User creation failed." };
    }
    return { success: true, user: newUser };
}

import User from "@/models/User"

export const checkUsername = async (username) => {
    const user = await User.findOne({ username });
    if (user) {
        return { success: false, message: "Username already exists." };
    }
    return { success: true, message: "Username is available." };
}

export const checkEmail = async (email) => {
    const user = await User.findOne({ email });
    if (user) {
        return { success: false, message: "Email already exists." };
    }
    return { success: true, message: "Email is available." };
}
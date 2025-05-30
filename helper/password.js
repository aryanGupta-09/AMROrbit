import bcrypt from 'bcrypt';

export const hashPass = async (password) => {
    return await bcrypt.hash(password, 10);
}

export const verifyPass = async (hash, password) => {
    return await bcrypt.compare(password, hash);
}

export const resetPass = async () => {

}

export const changePass = async () => {

}

export const forgotPass = async () => {

}
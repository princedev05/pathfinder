import jwt from "jsonwebtoken";

export const getJWTToken = (tokenData) => {
    return jwt.sign(tokenData, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

// export const verifyJWTToken = (token) => {
//     return jwt.verify(token, process.env.JWT_SECRET);
// };

export const setCookie = (res, payload) => {
    const isProduction = process.env.NODE_ENV === "production";
    const defaultOptions = {
        maxAge: (Number(process.env.COOKIE_EXPIRES) || 1) * 24 * 60 * 60 * 1000, // milliseconds, not Date
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        path: "/",
    };
    res.cookie("loginToken", payload, defaultOptions);
};

export const clearCookie = (res) => {
    res.clearCookie("loginToken", { path: "/" });
    res.clearCookie("userName", { path: "/" });
};

export const setUserNameCookie = (res, userName) => {
    const isProduction = process.env.NODE_ENV === "production";
    const defaultOptions = {
        maxAge: (Number(process.env.COOKIE_EXPIRES) || 1) * 24 * 60 * 60 * 1000, // milliseconds, not Date
        httpOnly: false, // Allow frontend to read this cookie
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        path: "/",
    };
    res.cookie("userName", userName, defaultOptions);
};
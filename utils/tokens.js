import jwt from 'jsonwebtoken'

export function generateToken(user, expirationDate, action) {
    const token = jwt.sign({
        email: user.email,
        exp: expirationDate ? expirationDate : Math.floor(Date.now() / 1000) + (60 * 60),
        action
    }, process.env.JWT_SECRET)
    return token
}

export function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET)
}
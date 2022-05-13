import { hash, compare } from 'bcryptjs'

/**
 * Hash a password
 * @param {string} password 
 * @returns {string} hashedPassword
 */
export async function hashPassword(password) {
    const hashedPassword = await hash(password, 12)
    return hashedPassword
}

/**
 * Check is password is valid comparing clear password with hashed password
 * @param {string} password 
 * @param {string} hashedPassword 
 * @returns {boolean} isPasswordValid
 */
export async function verifyPassword(password, hashedPassword) {
    const isPasswordValid = await compare(password, hashedPassword)
    return isPasswordValid
}

/**
 * Generates a password
 * @param {number} passwordLength at least 8 
 * @returns {string} generatedPassword
 */
export function generatePassword(passwordLength) {
    passwordLength = passwordLength && passwordLength > 8 ? passwordLength : 12
    const passwordCharset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#&-_/$*!?=.+^'
    let generatedPassword = ''
    for (let i = 0, n = passwordCharset.length; i < passwordLength; ++i) {
        generatedPassword += passwordCharset.charAt(Math.floor(Math.random() * n))
    }
    return generatedPassword
}
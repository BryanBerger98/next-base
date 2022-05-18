import axios from "axios"

const baseUrl = '/api/auth'

export async function getCurrentLoggedInUser() {
    try {
        const response = await axios.get(`${baseUrl}/account`)
        return response.data
    } catch (error) {
        throw error
    }
}

export async function signupUser(email, password) {
    try {
        const response = await axios.post(`${baseUrl}/signup`, {email, password}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export async function resetPassword(token, password) {
    try {
        const response = await axios.put(`${baseUrl}/reset-password`, {token, password}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    } catch (error) {
        throw error
    }
}


export async function sendResetPasswordEmailToUserByEmail(email) {
    try {
        const response = await axios.post(`${baseUrl}/reset-password`, {email}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data       
    } catch (error) {
        throw error
    }
}

export async function updatePassword(oldPassword, newPassword) {
    try {
        const response = await axios.put(`${baseUrl}/update-password`, {newPassword, oldPassword}, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export async function updateEmail(email, password) {
    try {
        const response = await axios.put(`${baseUrl}/update-email`, {email, password}, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export async function updateAccount({phone_number, username}) {
    try {
        const response = await axios.put(`${baseUrl}/account`, {phone_number, username}, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export async function updateAvatar(file) {
    try {
        const formData = new FormData()
        formData.append('avatar', file)
        const response = await axios.put('/api/auth/account/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data        
    } catch (error) {
        throw error
    }
}
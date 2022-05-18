import axios from "axios"

const baseUrl = '/api/users'

export async function createUser(user) {
    try {
        const response = await axios.post(`${baseUrl}`, user, {
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

export async function updateUser(user) {
    try {
        const response = axios.put(`${baseUrl}`, user, {
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

export async function deleteUserById(userId) {
    try {
        const response = await axios.delete(`${baseUrl}/${userId}`, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export async function getUsers(sort, skip, limit, searchString) {
    try {
        const response = await axios.get(`${baseUrl}?sortField=${sort.field}&sortDirection=${sort.direction}&limit=${limit}&skip=${skip}${searchString && searchString.length > 0 ? '&search=' + searchString : ''}`, {
            withCredentials: true
        })
        const users = response && response.data && response.data.users ? response.data.users : []
        const count = response && response.data && response.data.count ? response.data.count : 0
        const total = response && response.data && response.data.total ? response.data.total : 0 
        
        return {
            users,
            count,
            total
        }
    } catch (error) {
        throw error
    }
}

export async function sendResetPasswordEmailToUser(userId) {
    try {
        const response = await axios.get(`${baseUrl}/reset-password/${userId}`, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export async function switchDisabledUser(userId) {
    try {
        const response = await axios.get(`${baseUrl}/switch-disabled/${userId}`, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        throw error
    }
}
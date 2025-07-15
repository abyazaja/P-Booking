import axios from 'axios'

const API_URL = "https://exyryyzfjbwlpxcjthem.supabase.co/rest/v1/message" 
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4eXJ5eXpmamJ3bHB4Y2p0aGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMzcwMzMsImV4cCI6MjA2NjYxMzAzM30.mOBThxbgF65RMx8t1tmrArkH4PL2vU7vXAYZAteIWa4"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
}

export const messagesAPI = { // Changed 'notesAPI' to 'messagesAPI'
    async fetchMessages() { // Changed 'fetchNotes' to 'fetchMessages'
        const response = await axios.get(API_URL, { headers })
        return response.data
    },

    async createMessage(data) { // Changed 'createNote' to 'createMessage'
        const response = await axios.post(API_URL, data, { headers })
        return response.data
    },

    async deleteMessage(id) { // Changed 'deleteNote' to 'deleteMessage'
        await axios.delete(`${API_URL}?id=eq.${id}`, { headers })
    },

    async updateMessage(id, data) { // Changed 'updateNote' to 'updateMessage'
        const response = await axios.patch(
            `${API_URL}?id=eq.${id}`,
            data,
            { headers }
        )
        return response.data
    }
}
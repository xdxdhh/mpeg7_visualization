import axios from "axios"

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

export const postApi = async (path, data) => {
  try {
    const response = await apiClient.post(path, data)
    return response.data
  } catch (error) {
    console.error("Error posting data", error)
    throw error
  }
}

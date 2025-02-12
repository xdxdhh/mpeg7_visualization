import axios from "axios"

const apiClient = axios.create({
  baseURL: "https://mpeg7.diana.lumias.cz/api",
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

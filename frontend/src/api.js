import axios from "axios"

const apiClient = axios.create({
  baseURL: "http://0.0.0.0:8000/", // replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
})

export const getDominantColorsDescriptor = async (data) => {
  try {
    const response = await apiClient.post("/dominant_color", data)
    return response.data
  } catch (error) {
    console.error("Error posting data", error)
    throw error
  }
}

export const postApi = async (path, data) => {
  try {
    const response = await apiClient.post(path, data)
    return response.data
  } catch (error) {
    console.error("Error posting data", error)
    throw error
  }
}

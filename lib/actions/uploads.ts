"use server";

import apiClient from "@/app/utils/api/ApiClient";

export const createAlbumUser = async (values, token) => {
  try {
    const { data } = await apiClient.post("/protected/createAlbumUser", values, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("Request successful:", data);
    return data;
  } catch (error) {
    console.log("Request error:", error);
    return null;
  }
};
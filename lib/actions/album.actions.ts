"use server";

import apiClient from "@/app/utils/api/ApiClient";

export const postCreateAlbum = async (values) => {
  try {
    const { data } = await apiClient.post("/protected/createAlbum", values);

    return data;
  } catch (error) {
    console.error("Failed to post createAlbum", error);

    return null;
  }
};

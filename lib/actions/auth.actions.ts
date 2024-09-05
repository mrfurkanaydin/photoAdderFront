"use server";

import apiClient from "@/app/utils/api/ApiClient";

export const postRegister = async (values) => {
  try {
    const { data } = await apiClient.post("/register", values);

    return data;
  } catch (error) {
    console.error("Failed to post Register", error);

    return null;
  }
};

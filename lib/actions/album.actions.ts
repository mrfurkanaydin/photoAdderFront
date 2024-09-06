"use server";

import apiClient from "@/app/utils/api/ApiClient";

export const postCreateAlbum = async (values, token) => {
  try {
    const { data } = await apiClient.post("/protected/createAlbum", values, {
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

export const getAlbums = async (token) => {
  try {
    const { data } = await apiClient.get("/protected/getAlbums", {
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

export const getQR = async (token) => {
  try {
    const { data } = await apiClient.get("/protected/getQR", {
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

export const getAllAlbumImages = async (id, token) => {
  try {
    const { data } = await apiClient.get("/protected/getAllAlbumImages/" + id, {
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

export const generateQR = async (values, token) => {
  try {
    const { data } = await apiClient.post("/protected/generateQR", values, {
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

export const upload = async (values, token) => {
  try {
    const { data } = await apiClient.post("/protected/upload", values, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });

    console.log("Request successful:", data);
    return data;
  } catch (error) {
    console.log("Request error:", error);
    return null;
  }
};

export const createAlbumImage = async (values, token) => {
  try {
    const { data } = await apiClient.post(
      "/protected/createAlbumImage",
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("Request successful:", data);
    return data;
  } catch (error) {
    console.log("Request error:", error);
    return null;
  }
};

export const getAllUserImages = async (id, token) => {
  try {
    const { data } = await apiClient.get("/protected/getAllUserImages/" + id, {
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

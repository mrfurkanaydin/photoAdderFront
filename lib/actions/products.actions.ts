"use server"

import apiClient from "@/app/utils/api/ApiClient";


export const getProducts = async () => {
  try {
    const { data } = await apiClient.get('/api/products');

    return data;
  } catch (error) {
    console.error('Failed to fetch products', error);

    return null;
  }
}

export const getProduct = async (slug: string) => {
  try {
    const timestamp = new Date().getTime();
    const response = await apiClient.get(`/api/products/slug/${slug}?cb=${timestamp}`);
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch product data 2', error);

    return null;
  }
}
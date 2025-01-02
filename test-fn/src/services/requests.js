// swap.js
import api from "./api";

export const swapRequest = async (swapData) => {
  try {
    const response = await api.post("swap-request", swapData);
    return response;
  } catch (error) {
    console.error("error creating swap request", error);
    throw error;
  }
};

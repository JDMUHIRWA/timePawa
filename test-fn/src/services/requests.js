// swap.js
import api from "./api";

// Create a new swap request
export const swapRequest = async (data) => {
  try {
    const response = await api.post("/swap-requests", data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get all swap requests (optionally filter by status)
export const getSwapRequests = async () => {
  try {
    const response = await api.get("/swap-requests", {});
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get all swap requests initiated by a specific user
export const getUserSwapRequests = async (username) => {
  try {
    const response = await api.get(`/swap-requests/${username}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Update a swap request status
export const updateSwapRequest = async (requestId, status) => {
  try {
    const response = await api.patch(`/swap-requests/${requestId}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get all swap requests targeting a specific user
export const getTargetSwapRequests = async (username) => {
  try {
    const response = await api.get(`/swap-requests/target/${username}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

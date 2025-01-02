import SwapRequest from "../models/SwapRequest.js";
import User from "../models/user.js";

// Creating new Swap Request
export const swapRequest = async (req, res) => {
  try {
    const { initiator, target, from, to, date, reason } = req.body;
    // validation logic
    // if (!initiator || !target || !from || !to || !date || !reason) {
    //   return res.status(400).json({ error: "All fields are required" });
    // }
    //show missing fields

    const missingFields = [];

    if (!initiator) {
      missingFields.push("Initiator");
      return res.status(400).json({ error: "Initiator is required" });
    }
    if (!target) {
      missingFields.push("Target");
      return res.status(400).json({ error: "Target is required" });
    }
    if (!from) {
      missingFields.push("From");
      return res.status(400).json({ error: "From is required" });
    }
    if (!to) {
      missingFields.push("To");
      return res.status(400).json({ error: "To is required" });
    }
    if (!date) {
      missingFields.push("Date");
      return res.status(400).json({ error: "Date is required" });
    }
    if (!reason) {
      missingFields.push("Reason");
      return res.status(400).json({ error: "Reason is required" });
    }

    // check if the initiator and target exist
    const initiatorExists = await User.findOne({ username: initiator });
    if (!initiatorExists) {
      return res.status(404).json({ error: "Initiator not found" });
    }

    const targetExists = await User.findOne({ username: target });
    if (!targetExists) {
      return res.status(404).json({ error: "Target not found" });
    }

    // check if the initiator and target are the same
    if (initiator === target) {
      return res
        .status(400)
        .json({ error: "Initiator and target must be different" });
    }
    const newRequest = new SwapRequest({
      initiator,
      target,
      from,
      to,
      date,
      reason,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to create swap request", message: error });
  }
};

// GET: Get all swap requests
export const getSwapRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const requests = await SwapRequest.find(status ? { status: status } : {});
    // Check if requests are found
    if (requests.length === 0) {
      // If no requests match the status, send a custom message
      return res
        .status(404)
        .json({ message: `No swap requests found with status: ${status}` });
    }

    res.status(200).json(requests);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to get swap requests", message: error });
  }
};

// GET: Get all swap requests initiated by a user
export const getUserSwapRequests = async (req, res) => {
  try {
    const { username } = req.params;

    // check if the user existsin the db
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const requests = await SwapRequest.find({ initiator: username });
    // validate if requests are found
    if (requests.length === 0) {
      return res
        .status(404)
        .json({ message: `No swap requests found for user: ${username}` });
    }
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({
      error: "Unable to find request initiated by specific user",
      message: error,
    });
  }
};

// PATCH: Update swap request status
export const updateSwapRequest = async (req, res) => {
  try {
    const { requestId } = req.params; // Get request ID from URL params
    const { status } = req.body; // Get status from request body

    // Check if the request exists
    const request = await SwapRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Check the current status before updating
    if (request.status !== "PENDING") {
      return res
        .status(400)
        .json({ error: `Request already updated to ${request.status}` });
    }

    // Validate the new status
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Update the request status
    request.status = status;
    request.actionedAt = Date.now(); // Record when the action was taken
    await request.save();

    res.status(200).json(request); // Return the updated request
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to update swap request", message: error.message });
  }
};

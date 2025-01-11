import ScheduleBreakRequest from "../models/ScheduleBreakRequest.js";
import User from "../models/user.js";

// creating a new break request
export const breakRequest = async (req, res) => {
  try {
    const { initiator, type, time, date, reason } = req.body;

    const missingFields = [];

    if (!initiator) {
      missingFields.push("Initiator");
      return res.status(400).json({ error: "Initiator is required" });
    }

    if (!type) {
      missingFields.push("Type");
      return res.status(400).json({ error: "Type is required" });
    }
    if (!time) {
      missingFields.push("Time");
      return res.status(400).json({ error: "Time is required" });
    }
    if (!date) {
      missingFields.push("Date");
      return res.status(400).json({ error: "Date is required" });
    }
    if (!reason) {
      missingFields.push("Reason");
      return res.status(400).json({ error: "Reason is required" });
    }

    // check if the user exists

    const userExists = await User.findOne({ username: initiator });
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    const newRequest = new ScheduleBreakRequest({
      initiator,
      type,
      time,
      date,
      reason,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to create break Request", message: error });
  }
};

// GET: Get all break requests
export const getBreakRequests = async (req, res) => {
  try {
    const { status } = req.query;

    const request = await ScheduleBreakRequest.find(
      status ? { status: status } : {}
    );

    // check if requests are found
    if (request.length === 0) {
      return res.status(404).json({
        message: `No break requests found with ${status} status`,
      });
    }

    res.status(200).json(request);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to get break requests", message: error });
  }
};

// get break request by initiator
export const getRequest = async (req, res) => {
  try {
    const { username } = req.params;

    // check if the user exists
    const userExists = await User.findOne({ username });
    if (!userExists) {
      return res.status(404).json({ error: `${username}, User not found` });
    }

    const requests = await ScheduleBreakRequest.find({ initiator: username });
    // validate if requests are found
    if (requests.length === 0) {
      return res
        .status(404)
        .json({ message: `No break requests found for user: ${username}` });
    }
    res.status(200).json(requests);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to get break requests", message: error });
  }
};

// update break request status
export const updateBreakRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const request = await ScheduleBreakRequest.findById(requestId);

    // check if the reqest exists
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // check the current status before updating
    if (request.status === "APPROVED" || request.status === "REJECTED") {
      return res
        .status(400)
        .json({ error: "Request has already been actioned" });
    }

    // update the status
    request.status = status;
    request.actionedAt = Date.now(); // Record when the action was taken
    await request.save();
    res.status(200).json(request);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to update break request", message: error });
  }
};

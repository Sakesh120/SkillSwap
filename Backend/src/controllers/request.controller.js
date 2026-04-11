import SwapRequest from "../model/swapRequest.model.js";
import userModel from "../model/user.model.js";

//SENDER REQUEST
export const sendRequest = async (req, res) => {
  try {
    const { receiverId, skillOffered, skillWanted } = req.body;
    const senderUser = await userModel.findById(req.user);

    const existingRequest = await SwapRequest.findOne({
      sender: req.user,
      receiver: receiverId,
      skillOffered,
      skillWanted,
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Request already sent",
      });
    }

    if (senderUser.credits < 10) {
      return res.status(400).json({
        message: "NOT enough credits",
      });
    }

    const request = await SwapRequest.create({
      sender: req.user,
      receiver: receiverId,
      skillOffered,
      skillWanted,
    });

    res.status(201).json({
      message: "Request sent successfully",
      request,
    });

    //Deduct credits
    senderUser.credits -= 10;
    await senderUser.save();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//// RECEIVED REQUEST
export const getReceivedRequests = async (req, res) => {
  try {
    const requests = await SwapRequest.find({
      receiver: req.user,
    }).populate("sender", "name email");

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

///RESPOND TO REQUEST
export const respondRequest = async (req, res) => {
  try {
    const { status } = req.body; //accepted or rejected

    // validate  status
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }
    // find request
    const request = await SwapRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    /// Authorization check
    if (request.receiver.toString() !== req.user) {
      return res.status(403).json({
        message: "NOT authorized",
      });
    }

    // REFUND LOGIC
    if (status === "rejected" && request.status === "pending") {
      const sender = await userModel.findById(request.sender);
      sender.credits += 10;
      await sender.save();
    }
    /// update status
    request.status = status;
    await request.save();

    res.json({
      message: "Request updated successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE REQUEST
export const deleteRequest = async (req, res) => {
  try {
    const request = await SwapRequest.findById(req.params.id);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

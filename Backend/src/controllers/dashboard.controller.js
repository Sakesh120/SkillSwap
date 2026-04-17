import SwapRequest from "../model/swapRequest.model.js";
import Session from "../model/session.model.js";

export const getActivity = async (req, res) => {
  try {
    const userId = req.user;

    const requests = await SwapRequest.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "name")
      .populate("receiver", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const sessions = await Session.find({
      users: userId,
    })
      .populate("users", "name")
      .sort({ updatedAt: -1 })
      .limit(5);

    const requestActivities = requests.map((request) => {
      const isSender = request.sender._id.toString() === userId;
      const otherUser = isSender ? request.receiver.name : request.sender.name;

      const text = isSender
        ? `You sent a swap request to ${otherUser} for ${request.skillWanted}`
        : `${otherUser} requested ${request.skillWanted} from you`;

      return {
        _id: request._id,
        text,
        time: request.createdAt,
      };
    });

    const sessionActivities = sessions.map((session) => {
      const otherUser = session.users.find((u) => u._id.toString() !== userId);
      let text = "";

      if (session.status === "scheduled") {
        text = `Your session with ${otherUser?.name || "someone"} for ${session.skillRequested} is scheduled`;
      } else if (session.status === "completed") {
        text = `You completed a session with ${otherUser?.name || "someone"} for ${session.skillRequested}`;
      } else {
        text = `Pending session with ${otherUser?.name || "someone"} for ${session.skillRequested}`;
      }

      return {
        _id: session._id,
        text,
        time: session.updatedAt,
      };
    });

    const activities = [...requestActivities, ...sessionActivities]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

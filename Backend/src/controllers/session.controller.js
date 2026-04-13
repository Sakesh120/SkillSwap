import Session from "../model/session.model.js";

/// GET user session
export const getSession = async (req, res) => {
  try {
    const session = await Session.find({
      users: req.user,
    }).populate("users", "name email");

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SCHEDULE SESSION
export const scheduleSession = async (req, res) => {
  try {
    const { sessionId, scheduledAt } = req.body;
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Only participants can schedule
    if (!session.users.some((user) => user.toString() === req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    session.scheduledAt = scheduledAt;
    session.status = "scheduled";
    await session.save();
    res.json({ message: "Session scheduled", session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

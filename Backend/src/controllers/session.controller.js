import Session from "../model/session.model.js";
import userModel from "../model/user.model.js";

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

// GET specific session by ID
export const getSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId).populate(
      "users",
      "name email",
    );

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!session.users.some((user) => user._id.toString() === req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

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

// UPDATE SESSION PLATFORM
export const updateSessionPlatform = async (req, res) => {
  try {
    const { sessionId, platform } = req.body;
    const allowedPlatforms = ["ZOOM", "GMEET", "WHATSAPP CALL"];

    if (!platform || !allowedPlatforms.includes(platform)) {
      return res.status(400).json({ message: "Invalid platform selected" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!session.users.some((user) => user.toString() === req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (session.status === "completed") {
      return res
        .status(400)
        .json({ message: "Platform cannot be changed after completion" });
    }

    session.platform = platform;
    await session.save();

    res.json({ message: "Platform updated", session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

///// SESSION COMPLETION
export const completeSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Only participants can complete
    if (!session.users.some((user) => user.toString() === req.user)) {
      return res.status(403).json({ message: "Not Authorized" });
    }

    //Must be scheduled
    if (session.status != "scheduled") {
      return res.status(400).json({
        message: "Session must be scheduled first",
      });
    }

    // Prevent  the duplicate completion by the same user
    if (session.completeBy.some((user) => user.toString() === req.user)) {
      return res.status(400).json({
        message: "You already marked this session completed",
      });
    }

    // Add current user to
    session.completeBy.push(req.user);

    // If both users completed -> finalize
    if (session.completeBy.length === 2) {
      // Reward both users
      for (let userId of session.users) {
        const user = await userModel.findById(userId);
        user.credits += 20;
        await user.save();
      }
      session.status = "completed";
    }

    await session.save();

    res.json({
      message:
        session.status === "completed"
          ? "Session completed successfully"
          : "Marked as completed (waiting for other user)",
      session,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

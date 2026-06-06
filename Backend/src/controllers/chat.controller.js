import ChatMessage from "../model/chat.model.js";
import Session from "../model/session.model.js";

export const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!session.users.some((user) => user.toString() === req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const history = await ChatMessage.find({ session: sessionId })
      .sort({ createdAt: 1 })
      .populate("sender", "name avatar email");

    res.json({ messages: history });
  } catch (error) {
    console.error("Error fetching chat history", error);
    res.status(500).json({ message: error.message });
  }
};

export const postChatMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!session.users.some((user) => user.toString() === req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const message = await ChatMessage.create({
      session: sessionId,
      sender: req.user,
      content: content.trim(),
    });

    const populated = await message.populate("sender", "name avatar email");
    res.status(201).json({ message: populated });
  } catch (error) {
    console.error("Error saving chat message", error);
    res.status(500).json({ message: error.message });
  }
};

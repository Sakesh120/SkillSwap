import userModel from "../model/user.model.js";

export const getMatches = async (req, res) => {
  try {
    const userId = req.user;
    //get  current user
    const currentUser = await userModel.findById(userId);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // match logic
    const matches = await userModel.find({
      skillsOffered: { $in: currentUser.skillsWanted },
      skillsWanted: { $in: currentUser.skillsOffered },
      _id: { $ne: userId },
    });

    res.json({
      count: matches.length,
      matches,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

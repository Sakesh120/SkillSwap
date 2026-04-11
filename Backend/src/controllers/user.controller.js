import userModel from "../model/user.model.js";

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

///UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { name, skillOffered, skillWanted } = req.body;

    const user = await userModel.findByIdAndUpdate(
      req.user,
      {
        name,
        skillOffered,
        skillWanted,
      },
      { new: true },
    );

    res.status(201).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

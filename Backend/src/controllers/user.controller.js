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
    const { name, skillsOffered, skillsWanted, about, tagline } = req.body;

    // Parse JSON strings for arrays
    const parsedSkillsOffered = skillsOffered ? JSON.parse(skillsOffered) : [];
    const parsedSkillsWanted = skillsWanted ? JSON.parse(skillsWanted) : [];

    // Prepare update object
    const updateData = {
      name,
      skillsOffered: parsedSkillsOffered,
      skillsWanted: parsedSkillsWanted,
      about,
      tagline,
    };

    // Handle avatar upload if file exists
    if (req.file) {
      // Generate image URL path
      const imageUrl = `/uploads/avatars/${req.file.filename}`;
      updateData.avatar = {
        image: imageUrl,
      };
    }

    const user = await userModel.findByIdAndUpdate(req.user, updateData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET OTHER PROFILE
export const getOtherProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
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

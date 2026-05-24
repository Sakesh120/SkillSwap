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

// UPLOAD TUTORIAL VIDEO
export const uploadTutorial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No video file uploaded",
      });
    }

    // Generate video URL path
    const videoUrl = `/uploads/videos/${req.file.filename}`;
    const caption =
      typeof req.body.caption === "string" ? req.body.caption.trim() : "";
    const skillCategory =
      typeof req.body.skillCategory === "string"
        ? req.body.skillCategory.trim()
        : "";

    if (!skillCategory) {
      return res.status(400).json({
        message: "Skill category is required",
      });
    }

    const tutorial = { url: videoUrl, caption, skillCategory };

    const user = await userModel.findByIdAndUpdate(
      req.user,
      { $push: { tutorials: tutorial } },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.credits += 10;
    await user.save();

    res.status(200).json({
      message: "Tutorial video uploaded successfully",
      tutorial,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET USER'S OWN TUTORIALS
export const getUserTutorials = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user)
      .select("name avatar tutorials");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      userId: user._id,
      userName: user.name,
      userAvatar: user.avatar?.image || null,
      tutorials: user.tutorials,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL TUTORIALS
export const getAllTutorials = async (req, res) => {
  try {
    const usersWithTutorials = await userModel
      .find({ "tutorials.0": { $exists: true } })
      .select("name avatar tutorials");

    const tutorials = usersWithTutorials.flatMap((user) =>
      user.tutorials.map((tutorial) => ({
        userId: user._id,
        userName: user.name,
        userAvatar: user.avatar?.image || null,
        url: tutorial.url,
        caption: tutorial.caption,
        skillCategory: tutorial.skillCategory || "",
      })),
    );

    res.json(tutorials);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

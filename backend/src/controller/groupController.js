import Group from "../schemas/group.js";

// Create a new group
export const createGroup = async (req, res) => {
  try {
    const group = new Group(req.body);
    await group.save();
    res.status(201).json({
      message: "Group created successfully",
      data: group,
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to create group",
      message: error.message,
    });
  }
};

// Get all groups
export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json({
      message: "Groups retrieved successfully",
      data: groups,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve groups",
      message: error.message,
    });
  }
};

// Get group by ID
export const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({
        error: "Group not found",
      });
    }
    res.status(200).json({
      message: "Group retrieved successfully",
      data: group,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve group",
      message: error.message,
    });
  }
};

// Update group by ID
export const updateGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!group) {
      return res.status(404).json({
        error: "Group not found",
      });
    }
    res.status(200).json({
      message: "Group updated successfully",
      data: group,
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to update group",
      message: error.message,
    });
  }
};

// Delete group by ID
export const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) {
      return res.status(404).json({
        error: "Group not found",
      });
    }
    res.status(200).json({
      message: "Group deleted successfully",
      data: group,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete group",
      message: error.message,
    });
  }
};

// Delete all groups
export const deleteAllGroups = async (req, res) => {
  try {
    const result = await Group.deleteMany({});
    res.status(200).json({
      message: "All groups deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete all groups",
      message: error.message,
    });
  }
};

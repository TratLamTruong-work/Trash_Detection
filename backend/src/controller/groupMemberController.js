import GroupMember from "../schemas/groupMember.js";

// Create a new group member
export const createGroupMember = async (req, res) => {
  try {
    const groupMember = new GroupMember(req.body);
    await groupMember.save();
    res.status(201).json({
      message: "Group member created successfully",
      data: groupMember,
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to create group member",
      message: error.message,
    });
  }
};

// Get all group members
export const getGroupMembers = async (req, res) => {
  try {
    const groupMembers = await GroupMember.find();
    res.status(200).json({
      message: "Group members retrieved successfully",
      data: groupMembers,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve group members",
      message: error.message,
    });
  }
};

// Get group member by ID
export const getGroupMemberById = async (req, res) => {
  try {
    const groupMember = await GroupMember.findById(req.params.id);
    if (!groupMember) {
      return res.status(404).json({
        error: "Group member not found",
      });
    }
    res.status(200).json({
      message: "Group member retrieved successfully",
      data: groupMember,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve group member",
      message: error.message,
    });
  }
};

// Update group member by ID
export const updateGroupMember = async (req, res) => {
  try {
    const groupMember = await GroupMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!groupMember) {
      return res.status(404).json({
        error: "Group member not found",
      });
    }
    res.status(200).json({
      message: "Group member updated successfully",
      data: groupMember,
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to update group member",
      message: error.message,
    });
  }
};

// Delete group member by ID
export const deleteGroupMember = async (req, res) => {
  try {
    const groupMember = await GroupMember.findByIdAndDelete(req.params.id);
    if (!groupMember) {
      return res.status(404).json({
        error: "Group member not found",
      });
    }
    res.status(200).json({
      message: "Group member deleted successfully",
      data: groupMember,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete group member",
      message: error.message,
    });
  }
};

// Delete all group members
export const deleteAllGroupMembers = async (req, res) => {
  try {
    const result = await GroupMember.deleteMany({});
    res.status(200).json({
      message: "All group members deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete all group members",
      message: error.message,
    });
  }
};

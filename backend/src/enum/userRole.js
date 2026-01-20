class UserRole {
  static ADMIN = "admin";
  static USER = "user";

  static isValidRole(role) {
    return role === UserRole.ADMIN || role === UserRole.USER;
  }
}

export default UserRole;

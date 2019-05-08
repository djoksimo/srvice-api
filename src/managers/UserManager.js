class UserManager {

  constructor(userService) {
    this.userService = userService;
  }

  async getUserById({ id }) {
    try {
      const result = await this.userService.findUserById(id);
      return { status: 200, json: result };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async patchUser(user) {
    try {
      const result = await this.userService.updateUser(user);
      return { status: 200, json: result } ;
    } catch (error) {
      return { status: 500, json: error };
    }
  }
}

module.exports = UserManager;

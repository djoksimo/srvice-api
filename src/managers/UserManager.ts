import UserService from "services/UserService";
import { ObjectID } from "mongodb";
import { User } from "types";

export default class UserManager {
  userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async getUserById({ id }: { id: ObjectID }) {
    try {
      const result = await this.userService.findUserById(id);
      return { status: 200, json: result };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async patchUser(newPartialUserData: Partial<User>) {
    try {
      const result = await this.userService.updateUser(newPartialUserData);
      return { status: 200, json: result };
    } catch (error) {
      return { status: 500, json: error };
    }
  }
}

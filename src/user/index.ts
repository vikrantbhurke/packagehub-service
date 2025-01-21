import { userController, UserController } from "./user.controller";
import { userService, UserService } from "./user.service";
import { userRepository, UserRepository } from "./user.repository";
import { userUtility, UserUtility } from "./user.utility";
import { reviewService } from "../review";

userService.setUserRepository(userRepository);
userService.setUserUtility(userUtility);
userService.setReviewService(reviewService);

export {
  userController,
  userService,
  userRepository,
  userUtility,
  UserController,
  UserService,
  UserRepository,
  UserUtility,
};

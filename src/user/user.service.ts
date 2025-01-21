import {
  UpdateUserDTO,
  SignUpUserDTO,
  SignInUserDTO,
  UsernameDTO,
} from "./dtos";
import { ReviewService } from "../review";
import { v2 as cloudinary } from "cloudinary";
import { UserRepository, UserUtility } from "./index";

export class UserService {
  userRepository: UserRepository;
  userUtility: UserUtility;
  reviewService: ReviewService;

  setUserRepository(userRepository: UserRepository): void {
    this.userRepository = userRepository;
  }

  setUserUtility(userUtility: UserUtility): void {
    this.userUtility = userUtility;
  }

  setReviewService(reviewService: ReviewService): void {
    this.reviewService = reviewService;
  }

  async generateToken(jwtPayload: any) {
    return this.userUtility.generateToken(jwtPayload);
  }

  async verifyToken(token: string) {
    return this.userUtility.verifyToken(token);
  }

  async signUpUser(signUpUserDTO: SignUpUserDTO) {
    const { firstname, lastname, username, email, password } = signUpUserDTO;

    const newUser = {
      firstname,
      lastname,
      username,
      email,
      hashedPassword: await this.userUtility.encryptPassword(password),
    };

    const user = await this.userRepository.signUpUser(newUser);

    const token = await this.generateToken({ username });

    await this.userUtility.sendEmail(
      email,
      `Verify Your Email For ${process.env.APP_NAME}`,
      "verify-account.email.html",
      {
        clientUrl: process.env.CLIENT_URL,
        name: firstname,
        token,
      }
    );

    return user;
  }

  async signInUser(signInUserDTO: SignInUserDTO) {
    const { username, password } = signInUserDTO;
    const user = await this.userRepository.getUserByUsername({ username });

    if (!user) throw new Error("User with given username not found.");

    if (!user.isVerified)
      throw new Error("Please verify your email. Check your inbox.");

    const isPasswordValid = await this.userUtility.validateHashedPassword(
      password,
      user.hashedPassword
    );

    if (!isPasswordValid) throw new Error("Password is incorrect.");
    return user;
  }

  async verifyAccount(token: string) {
    if (!token) throw new Error("Invalid or expired token.");
    const decoded = await this.verifyToken(token);

    // @ts-ignore
    const user = await this.getUserByUsername({ username: decoded.username });
    if (user.isVerified) throw new Error("Email already verified.");
    user.isVerified = true;

    await this.updateUserById(user._id, { isVerified: true }, null);

    await this.userUtility.sendEmail(
      user.email,
      `Welcome To ${process.env.APP_NAME}!`,
      "welcome.email.html",
      {
        clientUrl: process.env.CLIENT_URL,
        name: user.firstname,
      }
    );
  }

  async verifyEmail(token: string) {
    if (!token) throw new Error("Invalid or expired token.");
    const decoded = await this.verifyToken(token);
    // @ts-ignore
    const { uid, email } = decoded;
    const user = await this.updateUserEmailById(uid, email);

    if (!user) throw new Error("User not found.");
  }

  async getUserByUsername(usernameDTO: UsernameDTO) {
    return await this.userRepository.getUserByUsername(usernameDTO);
  }

  async getUserById(uid: string) {
    return await this.userRepository.getUserById(uid);
  }

  async updateUserById(
    uid: string,
    updateUserByIdDTO: UpdateUserDTO,
    file: any
  ) {
    const user = await this.userRepository.getUserById(uid);

    if (!user) throw new Error("User not found.");

    const { firstname, lastname, email, password, isVerified } =
      updateUserByIdDTO;

    if (email && email !== user.email) {
      const token = await this.generateToken({ uid, email });

      await this.userUtility.sendEmail(
        email,
        `Verify Your New Email For ${process.env.APP_NAME}`,
        "verify-email.email.html",
        {
          clientUrl: process.env.CLIENT_URL,
          name: firstname || user.firstname,
          token,
        }
      );
    }

    const updatedUser = {
      profilepic: user.profilepic,
      firstname: firstname ? firstname : user.firstname,
      lastname: lastname ? lastname : user.lastname,
      email: user.email,
      hashedPassword: password
        ? await this.userUtility.encryptPassword(password)
        : user.hashedPassword,
      isVerified: isVerified ? isVerified : user.isVerified,
    };

    if (file) {
      const result = await this.userUtility.uploadToCloudinary(
        file.buffer,
        user.username
      );

      updatedUser.profilepic = result.secure_url;
    }

    return await this.userRepository.updateUserById(uid, updatedUser);
  }

  async updateUserEmailById(uid: string, email: string) {
    const user = await this.userRepository.updateUserById(uid, { email });
    if (!user) throw new Error("User not found.");
    return user;
  }

  async deleteProfilePicById(uid: string) {
    const user = await this.userRepository.getUserById(uid);

    await cloudinary.uploader.destroy(
      `${process.env.CLOUDINARY_PROFILE_PICS}/${user.username}`
    );

    return await this.userRepository.updateUserById(uid, { profilepic: "" });
  }

  async deleteUserById(uid: string) {
    const user = await this.userRepository.getUserById(uid);

    await cloudinary.uploader.destroy(
      `${process.env.CLOUDINARY_PROFILE_PICS}/${user.username}`
    );

    await this.userRepository.deleteUserById(uid);

    await this.reviewService.deleteReviewsByReviewerId({ reviewerId: uid });

    await this.reviewService.deleteReviewsVotesByVoterId(uid);

    await this.userUtility.sendEmail(
      user.email,
      `Account Deleted From ${process.env.APP_NAME}!`,
      "delete.email.html",
      {
        name: user.firstname,
      }
    );

    return user;
  }
}

export const userService = new UserService();

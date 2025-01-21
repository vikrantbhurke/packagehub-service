import { ReviewController } from "./review.controller";
import { reviewService, ReviewService } from "./review.service";
import { reviewRepository, ReviewRepository } from "./review.repository";
import { reviewUtility, ReviewUtility } from "./review.utility";
import { packageService } from "../package";
import { userService } from "../user";

reviewService.setReviewRepository(reviewRepository);
reviewService.setPackageService(packageService);
reviewService.setUserService(userService);

export {
  reviewService,
  reviewRepository,
  reviewUtility,
  ReviewController,
  ReviewService,
  ReviewRepository,
  ReviewUtility,
};

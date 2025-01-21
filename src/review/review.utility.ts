import { Review } from "./review.model";
import { ReviewResponseDTO } from "./dtos";
import { Schema } from "mongoose";

export class ReviewUtility {
  convertReviewToReviewDTO(review: Review): ReviewResponseDTO {
    const reviewDTO = new ReviewResponseDTO();
    reviewDTO.id = review._id as Schema.Types.ObjectId;
    reviewDTO.title = review.title;
    reviewDTO.body = review.body;
    reviewDTO.packageId = review.packageId;
    reviewDTO.reviewerId = review.reviewerId;
    reviewDTO.votes = review.votes;
    reviewDTO.upvoterIds = review.upvoterIds;
    reviewDTO.downvoterIds = review.downvoterIds;
    reviewDTO.rating = review.rating;
    reviewDTO.updatedAt = review.updatedAt;
    return reviewDTO;
  }
}

export const reviewUtility = new ReviewUtility();

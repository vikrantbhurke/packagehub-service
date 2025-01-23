import Review from "./review.model";
import { Page } from "../global/types/page.type";
import { createModel } from "../global/decorators/create";
import {
  checkModel,
  checkModelById,
  countModelsByField,
  getModelByField,
  getModelById,
  getModelsByField,
  getModelsByFieldDynamic,
  searchModelsByIdField,
} from "../global/decorators/read";
import {
  pullRefFromModelById,
  pushRefToModelById,
  updateModelById,
} from "../global/decorators/update";
import {
  deleteModelById,
  deleteModelsByField,
} from "../global/decorators/delete";
import {
  getReviewByIdConfig,
  getReviewsByPackageIdConfig,
  getReviewsByReviewerIdConfig,
  getReviewsByVoterIdConfig,
  searchReviewsByPackageIdConfig,
  searchReviewsByReviewerIdConfig,
} from "./review.config";
import {
  GetReviewsDTO,
  PackageIdDTO,
  PackageIdReviewerIdDTO,
  ReviewerIdDTO,
  UpvoterIdDTO,
} from "./dtos";
import DownvoterIdDTO from "./dtos/downvoter-id.dto";

export class ReviewRepository {
  @createModel(Review)
  async createReview(newReview: any, review?: any) {
    return review;
  }

  @countModelsByField(Review)
  async countReviewsByPackageId(packageIdDTO: PackageIdDTO, count?: number) {
    return count;
  }

  @countModelsByField(Review)
  async countReviewsByReviewerId(reviewerIdDTO: ReviewerIdDTO, count?: number) {
    return count;
  }

  @searchModelsByIdField(Review, searchReviewsByPackageIdConfig)
  async searchReviewsByPackageId(
    pid: string,
    search: string,
    page: number,
    reviewsPage?: Page
  ) {
    return reviewsPage;
  }

  @searchModelsByIdField(Review, searchReviewsByReviewerIdConfig)
  async searchReviewsByReviewerId(
    rid: string,
    search: string,
    page: number,
    reviewsPage?: Page
  ) {
    return reviewsPage;
  }

  @getModelsByFieldDynamic(Review, getReviewsByPackageIdConfig)
  async getReviewsByPackageId(
    getReviewsDTO: GetReviewsDTO,
    packageIdDTO: PackageIdDTO,
    reviewsPage?: Page
  ) {
    return reviewsPage;
  }

  @getModelsByFieldDynamic(Review, getReviewsByReviewerIdConfig)
  async getReviewsByReviewerId(
    getReviewsDTO: GetReviewsDTO,
    reviewerIdDTO: ReviewerIdDTO,
    reviewsPage?: Page
  ) {
    return reviewsPage;
  }

  @getModelsByField(Review, getReviewsByVoterIdConfig)
  async getReviewsByUpvoterId(
    page: number,
    upvoterIdDTO: UpvoterIdDTO,
    reviewsPage?: any
  ) {
    return reviewsPage;
  }

  @getModelsByField(Review, getReviewsByVoterIdConfig)
  async getReviewsByDownvoterId(
    page: number,
    downvoterIdDTO: DownvoterIdDTO,
    reviewsPage?: any
  ) {
    return reviewsPage;
  }

  @getModelById(Review, getReviewByIdConfig)
  async getReviewById(rid: string, review?: any) {
    return review;
  }

  @getModelByField(Review, getReviewByIdConfig)
  async getReviewByPackageIdAndReviewerId(
    packageIdReviewerIdDTO: PackageIdReviewerIdDTO,
    review?: any
  ) {
    return review;
  }

  @updateModelById(Review)
  async updateReviewById(rid: string, updateReview: any, review?: any) {
    return review;
  }

  @pushRefToModelById(Review, "upvoterIds")
  async pushUpvoterIdToReviewById(rid: string, uid: string, review?: any) {
    return review;
  }

  @pullRefFromModelById(Review, "upvoterIds")
  async pullUpvoterIdFromReviewById(rid: string, uid: string, review?: any) {
    return review;
  }

  @pushRefToModelById(Review, "downvoterIds")
  async pushDownvoterIdToReviewById(rid: string, did: string, review?: any) {
    return review;
  }

  @pullRefFromModelById(Review, "downvoterIds")
  async pullDownvoterIdFromReviewById(rid: string, did: string, review?: any) {
    return review;
  }

  @deleteModelById(Review)
  async deleteReviewById(rid: string, review?: any) {
    return review;
  }

  @deleteModelsByField(Review)
  async deleteReviewsByReviewerId(reviewerIdDTO: ReviewerIdDTO) {}
}

export const reviewRepository = new ReviewRepository();

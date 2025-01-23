import {
  CreateFirstReviewDTO,
  CreateNextReviewDTO,
  GetReviewsDTO,
  PackageIdDTO,
  UpdateReviewDTO,
  ReviewerIdDTO,
  PackageIdReviewerIdDTO,
  UpvoterIdDTO,
} from "./dtos";
import { ReviewRepository } from "./index";
import { PackageService } from "../package";
import { UserService } from "../user";
import DownvoterIdDTO from "./dtos/downvoter-id.dto";

export class ReviewService {
  reviewRepository: ReviewRepository;
  packageService: PackageService;
  userService: UserService;

  setReviewRepository(reviewRepository: ReviewRepository): void {
    this.reviewRepository = reviewRepository;
  }

  setPackageService(packageService: PackageService): void {
    this.packageService = packageService;
  }

  setUserService(userService: UserService): void {
    this.userService = userService;
  }

  async createFirstReview(createFirstReviewDTO: CreateFirstReviewDTO) {
    const {
      title,
      body,
      packageId,
      reviewerId,
      rating,
      platform,
      packageUrl,
      homepageUrl,
      description,
    } = createFirstReviewDTO;

    const pkg = await this.packageService.createPackage({
      name: packageId,
      description,
      rating,
      reviews: 1,
      homepageUrl,
      packageUrl,
      platform,
    });

    const review = await this.reviewRepository.createReview({
      title,
      body,
      packageId: pkg._id,
      reviewerId,
      rating,
    });

    return review;
  }

  async createNextReview(createNextReviewDTO: CreateNextReviewDTO) {
    const review = await this.reviewRepository.createReview(
      createNextReviewDTO
    );

    await this.packageService.updatePackageById(review.packageId);
    return review;
  }

  async countReviewsByPackageId(packageIdDTO: PackageIdDTO) {
    return await this.reviewRepository.countReviewsByPackageId(packageIdDTO);
  }

  async countReviewsByReviewerId(reviewerIdDTO: ReviewerIdDTO) {
    return await this.reviewRepository.countReviewsByReviewerId(reviewerIdDTO);
  }

  async searchReviewsByPackageId(pid: string, search: string, page: number) {
    return await this.reviewRepository.searchReviewsByPackageId(
      pid,
      search,
      page
    );
  }

  async searchReviewsByReviewerId(rid: string, search: string, page: number) {
    return await this.reviewRepository.searchReviewsByReviewerId(
      rid,
      search,
      page
    );
  }

  async getReviewsByPackageId(
    getReviewsDTO: GetReviewsDTO,
    packageIdDTO: PackageIdDTO
  ) {
    return await this.reviewRepository.getReviewsByPackageId(
      getReviewsDTO,
      packageIdDTO
    );
  }

  async getReviewsByReviewerId(
    getReviewsDTO: GetReviewsDTO,
    reviewerIdDTO: ReviewerIdDTO
  ) {
    return await this.reviewRepository.getReviewsByReviewerId(
      getReviewsDTO,
      reviewerIdDTO
    );
  }

  async getReviewsByUpvoterId(page: number, upvoterIdDTO: UpvoterIdDTO) {
    return await this.reviewRepository.getReviewsByUpvoterId(
      page,
      upvoterIdDTO
    );
  }

  async getReviewsByDownvoterId(page: number, downvoterIdDTO: DownvoterIdDTO) {
    return await this.reviewRepository.getReviewsByDownvoterId(
      page,
      downvoterIdDTO
    );
  }

  async getReviewById(rid: string) {
    return await this.reviewRepository.getReviewById(rid);
  }

  async getReviewByPackageIdAndReviewerId(
    packageIdReviewerIdDTO: PackageIdReviewerIdDTO
  ) {
    return await this.reviewRepository.getReviewByPackageIdAndReviewerId(
      packageIdReviewerIdDTO
    );
  }

  async updateReviewById(rid: string, updateReviewDTO: UpdateReviewDTO) {
    let updates: object = {};
    const fieldsThatTriggerUpdatedAt = ["title", "body", "rating"];

    const shouldUpdateUpdatedAt = Object.keys(updateReviewDTO).some((field) =>
      fieldsThatTriggerUpdatedAt.includes(field)
    );

    if (shouldUpdateUpdatedAt)
      updates = { ...updateReviewDTO, updatedAt: new Date() };

    const review = await this.reviewRepository.updateReviewById(rid, updates);
    await this.packageService.updatePackageById(review.packageId);
    return review;
  }

  async upvoteReviewById(rid: string, uid: string) {
    const review = await this.reviewRepository.getReviewById(rid);

    if (!review) throw new Error("Review not found.");

    if (review.downvoterIds.find((downId: any) => downId.toString() === uid))
      await this.reviewRepository.pullDownvoterIdFromReviewById(rid, uid);

    let updatedReview: any;

    if (!review.upvoterIds.find((upId: any) => upId.toString() === uid)) {
      updatedReview = await this.reviewRepository.pushUpvoterIdToReviewById(
        rid,
        uid
      );
    } else {
      updatedReview = await this.reviewRepository.pullUpvoterIdFromReviewById(
        rid,
        uid
      );
    }

    updatedReview.votes =
      updatedReview.upvoterIds.length - updatedReview.downvoterIds.length;

    return await this.reviewRepository.updateReviewById(rid, updatedReview);
  }

  async downvoteReviewById(rid: string, did: string) {
    const review = await this.reviewRepository.getReviewById(rid);

    if (!review) throw new Error("Review not found.");

    let updatedReview: any;

    if (review.upvoterIds.find((upId: any) => upId.toString() === did))
      await this.reviewRepository.pullUpvoterIdFromReviewById(rid, did);

    if (!review.downvoterIds.find((downId: any) => downId.toString() === did)) {
      updatedReview = await this.reviewRepository.pushDownvoterIdToReviewById(
        rid,
        did
      );
    } else {
      updatedReview = await this.reviewRepository.pullDownvoterIdFromReviewById(
        rid,
        did
      );
    }

    updatedReview.votes =
      updatedReview.upvoterIds.length - updatedReview.downvoterIds.length;

    return await this.reviewRepository.updateReviewById(rid, updatedReview);
  }

  async deleteReviewById(rid: string) {
    const review = await this.reviewRepository.deleteReviewById(rid);

    const reviewsCount = await this.countReviewsByPackageId({
      packageId: review.packageId,
    });

    if (!reviewsCount)
      await this.packageService.deletePackageById(review.packageId);
    else await this.packageService.updatePackageById(review.packageId);

    return review;
  }

  async deleteReviewsByReviewerId(reviewerIdDTO: ReviewerIdDTO) {
    let page = 0;

    while (true) {
      const reviewsPage = await this.getReviewsByReviewerId(
        { page },
        reviewerIdDTO
      );

      if (!reviewsPage?.content.length) break;

      for (const review of reviewsPage.content)
        await this.deleteReviewById(review._id);

      if (reviewsPage.lastPage) break;
      page++;
    }
  }

  async deleteReviewsVotesByVoterId(voterId: string) {
    let page = 0;

    while (true) {
      const reviewsWithUpvoterIdPage = await this.getReviewsByUpvoterId(page, {
        upvoterIds: voterId,
      });

      if (!reviewsWithUpvoterIdPage?.content.length) break;

      for (const review of reviewsWithUpvoterIdPage.content)
        await this.downvoteReviewById(review._id, voterId);

      if (reviewsWithUpvoterIdPage.lastPage) break;
      page++;
    }

    page = 0;

    while (true) {
      const reviewsWithDownvoterIdPage = await this.getReviewsByDownvoterId(
        page,
        {
          downvoterIds: voterId,
        }
      );

      if (!reviewsWithDownvoterIdPage?.content.length) break;

      for (const review of reviewsWithDownvoterIdPage.content)
        await this.downvoteReviewById(review._id, voterId);

      if (reviewsWithDownvoterIdPage.lastPage) break;
      page++;
    }
  }
}

export const reviewService = new ReviewService();

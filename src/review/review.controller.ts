import {
  Res,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
  QueryParams,
} from "routing-controllers";
import {
  GetReviewsDTO,
  UpdateReviewDTO,
  ReviewResponseDTO,
  CreateNextReviewDTO,
  CreateFirstReviewDTO,
} from "./dtos";
import { Response } from "express";
import { Review } from "./review.model";
import { Page } from "../global/types/page.type";
import {
  reviewService,
  ReviewService,
  reviewUtility,
  ReviewUtility,
} from "./index";

@Controller("/reviews")
export class ReviewController {
  reviewService: ReviewService;
  reviewUtility: ReviewUtility;

  constructor() {
    this.reviewService = reviewService;
    this.reviewUtility = reviewUtility;
  }

  @Post("/first")
  async createFirstReview(
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    createFirstReviewDTO: CreateFirstReviewDTO,
    @Res() response: Response
  ) {
    try {
      await this.reviewService.createFirstReview(createFirstReviewDTO);
      return response.status(201).send({ message: "First Review created." });
    } catch (error: any) {
      let message;
      if (error.code === 11000) message = "Review already exists.";
      else message = error.message;
      return response.status(500).send({ message });
    }
  }

  @Post("/next")
  async createNextReview(
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    createNextReviewDTO: CreateNextReviewDTO,
    @Res() response: Response
  ) {
    try {
      await this.reviewService.createNextReview(createNextReviewDTO);
      return response.status(201).send({ message: "Next Review created." });
    } catch (error: any) {
      let message;
      if (error.code === 11000) message = "Review already exists.";
      else message = error.message;
      return response.status(500).send({ message });
    }
  }

  @Get("/packageId/:pid/search/:search")
  async searchReviewsByPackageId(
    @QueryParams() { page }: GetReviewsDTO,
    @Param("search") search: string,
    @Param("pid") pid: string,
    @Res() response: Response
  ) {
    try {
      const reviewsPage: Page | undefined =
        await this.reviewService.searchReviewsByPackageId(pid, search, page);

      if (!reviewsPage)
        return response.status(404).send({ message: "Reviews not found." });

      if (reviewsPage.content.length === 0)
        return response.status(200).json(reviewsPage);

      const reviewsDTO: ReviewResponseDTO[] = reviewsPage.content.map(
        (review) => this.reviewUtility.convertReviewToReviewDTO(review)
      );

      const reviewsPageDTO: Page = {
        ...reviewsPage,
        content: reviewsDTO,
      };

      return response.status(200).json(reviewsPageDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/reviewerId/:rwid/search/:search")
  async searchReviewsByReviewerId(
    @QueryParams() { page }: GetReviewsDTO,
    @Param("search") search: string,
    @Param("rwid") rwid: string,
    @Res() response: Response
  ) {
    try {
      const reviewsPage: Page | undefined =
        await this.reviewService.searchReviewsByReviewerId(rwid, search, page);

      if (!reviewsPage)
        return response.status(404).send({ message: "Reviews not found." });

      if (reviewsPage.content.length === 0)
        return response.status(200).json(reviewsPage);

      const reviewsDTO: ReviewResponseDTO[] = reviewsPage.content.map(
        (review) => this.reviewUtility.convertReviewToReviewDTO(review)
      );

      const reviewsPageDTO: Page = {
        ...reviewsPage,
        content: reviewsDTO,
      };

      return response.status(200).json(reviewsPageDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/packageId/:pid")
  async getReviewsByPackageId(
    @QueryParams() getReviewsDTO: GetReviewsDTO,
    @Param("pid") pid: string,
    @Res()
    response: Response
  ) {
    try {
      const grDTO = getReviewsDTO.rating
        ? { ...getReviewsDTO, rating: Number(getReviewsDTO.rating) }
        : getReviewsDTO;

      const reviewsPage: Page | undefined =
        await this.reviewService.getReviewsByPackageId(grDTO, {
          packageId: pid,
        });

      if (!reviewsPage)
        return response.status(404).send({ message: "Reviews not found." });

      if (reviewsPage.content.length === 0)
        return response.status(200).json(reviewsPage);

      const reviewsDTO: ReviewResponseDTO[] = reviewsPage.content.map(
        (review) => this.reviewUtility.convertReviewToReviewDTO(review)
      );

      const reviewsPageDTO: Page = {
        ...reviewsPage,
        content: reviewsDTO,
      };

      return response.status(200).json(reviewsPageDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/reviewerId/:rwid")
  async getReviewsByReviewerId(
    @QueryParams() getReviewsDTO: GetReviewsDTO,
    @Param("rwid") rwid: string,
    @Res()
    response: Response
  ) {
    try {
      const grDTO = getReviewsDTO.rating
        ? { ...getReviewsDTO, rating: Number(getReviewsDTO.rating) }
        : getReviewsDTO;

      const reviewsPage: Page | undefined =
        await this.reviewService.getReviewsByReviewerId(grDTO, {
          reviewerId: rwid,
        });

      if (!reviewsPage)
        return response.status(404).send({ message: "Reviews not found." });

      if (reviewsPage.content.length === 0)
        return response.status(200).json(reviewsPage);

      const reviewsDTO: ReviewResponseDTO[] = reviewsPage.content.map(
        (review) => this.reviewUtility.convertReviewToReviewDTO(review)
      );

      const reviewsPageDTO: Page = {
        ...reviewsPage,
        content: reviewsDTO,
      };

      return response.status(200).json(reviewsPageDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/:rid")
  async getReviewById(@Param("rid") rid: string, @Res() response: Response) {
    try {
      const review: Review = await this.reviewService.getReviewById(rid);
      if (!review) return response.status(404).send("Review not found.");
      const reviewDTO = this.reviewUtility.convertReviewToReviewDTO(review);
      return response.status(200).json(reviewDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/packageId/:pid/reviewerId/:rwid")
  async getReviewByPackageIdAndReviewerId(
    @Param("pid") pid: string,
    @Param("rwid") rwid: string,
    @Res() response: Response
  ) {
    try {
      const review: Review =
        await this.reviewService.getReviewByPackageIdAndReviewerId({
          packageId: pid,
          reviewerId: rwid,
        });

      if (!review) return response.status(200).json({ id: "" });
      const reviewDTO = this.reviewUtility.convertReviewToReviewDTO(review);
      return response.status(200).json(reviewDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Patch("/:rid")
  async updateReviewById(
    @Param("rid") rid: string,
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    updateReviewDTO: UpdateReviewDTO,
    @Res() response: Response
  ) {
    try {
      await this.reviewService.updateReviewById(rid, updateReviewDTO);
      return response.status(200).send({ message: "Review updated." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Patch("/:rid/upvoterId/:uid")
  async upvoteReview(
    @Param("rid") rid: string,
    @Param("uid") uid: string,
    @Res() response: Response
  ) {
    try {
      await this.reviewService.upvoteReviewById(rid, uid);
      return response.status(200).send({ message: "Review upvoted." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Patch("/:rid/downvoterId/:did")
  async downvoteReview(
    @Param("rid") rid: string,
    @Param("did") did: string,
    @Res() response: Response
  ) {
    try {
      await this.reviewService.downvoteReviewById(rid, did);
      return response.status(200).send({ message: "Review downvoted." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Delete("/:rid")
  async deleteReviewById(@Param("rid") rid: string, @Res() response: Response) {
    try {
      await this.reviewService.deleteReviewById(rid);
      return response.status(200).send({ message: "Review deleted." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Delete("/reviewerId/:rwid")
  async deleteReviewsByReviewerId(
    @Param("rwid") rwid: string,
    @Res() response: Response
  ) {
    try {
      await this.reviewService.deleteReviewsByReviewerId({ reviewerId: rwid });
      return response.status(200).send({ message: "Reviews deleted." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }
}

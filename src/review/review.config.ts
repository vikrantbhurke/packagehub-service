import { Order } from "../global/enums";
import { PAGE_SIZE } from "../global/constants/constants";

export const searchReviewsByPackageIdConfig = {
  refs: ["packageId", "reviewerId"],
  refFields: ["name", "profilepic firstname lastname username"],
  searchField: "body",
  byField: "packageId",
  sort: "createdAt",
  order: Order.Ascending,
  PAGE_SIZE,
};

export const searchReviewsByReviewerIdConfig = {
  refs: ["packageId", "reviewerId"],
  refFields: ["name", "profilepic firstname lastname username"],
  searchField: "body",
  byField: "reviewerId",
  sort: "createdAt",
  order: Order.Ascending,
  PAGE_SIZE,
};

export const getReviewsByPackageIdConfig = {
  refs: ["packageId", "reviewerId"],
  refFields: ["name", "profilepic firstname lastname username"],
  PAGE_SIZE,
};

export const getReviewsByReviewerIdConfig = {
  refs: ["packageId", "reviewerId"],
  refFields: ["name", "profilepic firstname lastname username"],
  PAGE_SIZE,
};

export const getReviewsByVoterIdConfig = {
  PAGE_SIZE,
};

export const getReviewByIdConfig = {
  refs: ["packageId", "reviewerId"],
  refFields: ["name", "profilepic firstname lastname username"],
};

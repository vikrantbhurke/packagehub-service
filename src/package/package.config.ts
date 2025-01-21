import { Order } from "../global/enums";
import { PAGE_SIZE } from "../global/constants/constants";

export const getPackagesConfig = {
  sort: "name",
  order: Order.Ascending,
  PAGE_SIZE,
};

export const searchPackagesByPlatformConfig = {
  searchField: "name",
  byField: "platform",
  sort: "name",
  order: Order.Ascending,
  PAGE_SIZE,
};

export const getPackagesByPlatformConfig = {
  PAGE_SIZE,
};

export const getPackageByIdConfig = {};

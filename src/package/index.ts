import { packageController, PackageController } from "./package.controller";
import { packageService, PackageService } from "./package.service";
import { packageRepository, PackageRepository } from "./package.repository";
import { packageUtility, PackageUtility } from "./package.utility";
import { packageClient, PackageClient } from "./package.client";
import { reviewService } from "../review";

packageService.setPackageClient(packageClient);
packageService.setReviewService(reviewService);
packageService.setPackageRepository(packageRepository);

export {
  packageController,
  packageService,
  packageRepository,
  packageUtility,
  packageClient,
  PackageController,
  PackageService,
  PackageRepository,
  PackageUtility,
  PackageClient,
};

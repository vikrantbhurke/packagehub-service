import { PackagePage } from "./package.page";
import { Platform } from "./platform.enum";
import { PackageRepository, PackageClient } from "./index";
import { CreatePackageDTO, GetPackagesDTO, PlatformDTO } from "./dtos";
import { ReviewService } from "../review";
import { Order } from "../global/enums";

export class PackageService {
  packageRepository: PackageRepository;
  packageClient: PackageClient;
  reviewService: ReviewService;

  setPackageRepository(packageRepository: PackageRepository): void {
    this.packageRepository = packageRepository;
  }

  setReviewService(reviewService: ReviewService): void {
    this.reviewService = reviewService;
  }

  setPackageClient(packageClient: PackageClient): void {
    this.packageClient = packageClient;
  }

  async createPackage(createPackageDTO: CreatePackageDTO) {
    return await this.packageRepository.createPackage(createPackageDTO);
  }

  async getPackagesByPlatform(
    getPackagesDTO: GetPackagesDTO,
    platformDTO: PlatformDTO
  ) {
    const { rating } = getPackagesDTO;
    let bracket;

    switch (rating) {
      case 1:
        bracket = { $gte: 1.0, $lt: 2.0 };
        break;
      case 2:
        bracket = { $gte: 2.0, $lt: 3.0 };
        break;
      case 3:
        bracket = { $gte: 3.0, $lt: 4.0 };
        break;
      case 4:
        bracket = { $gte: 4.0, $lt: 5.0 };
        break;
      case 5:
        bracket = 5;
        break;
      default:
        bracket = { $gte: 0, $lte: 5 };
    }

    getPackagesDTO.rating = bracket;

    return await this.packageRepository.getPackagesByPlatform(
      getPackagesDTO,
      platformDTO
    );
  }

  async searchPackagesByPlatform(
    platform: Platform,
    search: string,
    page: number
  ) {
    const repoPackagesPage =
      await this.packageRepository.searchPackagesByPlatform(
        platform,
        search,
        page
      );

    const registryPackage = await this.packageClient.searchPackages(
      platform,
      search
    );

    let packagesPage = new PackagePage();
    packagesPage.registry = registryPackage || null;

    if (!repoPackagesPage || repoPackagesPage.content.length === 0)
      return packagesPage;

    const { content, ...rest } = repoPackagesPage;

    packagesPage = {
      ...rest,
      registry: registryPackage || null,
      repo: content,
    };

    return packagesPage;
  }

  async getPackageById(pid: string) {
    return await this.packageRepository.getPackageById(pid);
  }

  async updatePackageById(pid: string) {
    const pkg = await this.getPackageById(pid);

    let page = 0;
    let totalRating = 0;
    let totalPackageReviews = 0;

    while (true) {
      const reviewsPage = await this.reviewService.getReviewsByPackageId(
        {
          page: 0,
          sort: "createdAt",
          order: Order.Ascending,
        },
        { packageId: pid }
      );

      if (!reviewsPage?.content.length) break;

      totalPackageReviews += reviewsPage.content.length;

      for (const review of reviewsPage.content) {
        totalRating += review.rating;
      }

      if (reviewsPage.lastPage) break;
      page++;
    }

    pkg.rating = totalRating / totalPackageReviews;
    pkg.reviews = totalPackageReviews;
    await this.packageRepository.updatePackageById(pid, pkg);
  }

  async deletePackageById(pid: string) {
    return await this.packageRepository.deletePackageById(pid);
  }
}

export const packageService = new PackageService();

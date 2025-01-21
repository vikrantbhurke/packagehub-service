import Package from "./package.model";
import { Page } from "../global/types/page.type";
import { createModel } from "../global/decorators/create";
import {
  getModelById,
  searchModelsByField,
  getModelsByFieldDynamic,
} from "../global/decorators/read";
import { deleteModelById } from "../global/decorators/delete";
import {
  getPackageByIdConfig,
  getPackagesByPlatformConfig,
  searchPackagesByPlatformConfig,
} from "./package.config";
import { Platform } from "./platform.enum";
import { CreatePackageDTO, GetPackagesDTO, PlatformDTO } from "./dtos";
import { updateModelById } from "../global/decorators/update";

export class PackageRepository {
  @createModel(Package)
  async createPackage(createPackageDTO: CreatePackageDTO, pkg?: any) {
    return pkg;
  }

  @getModelsByFieldDynamic(Package, getPackagesByPlatformConfig)
  async getPackagesByPlatform(
    getPackagesByPlatformDTO: any,
    platformDTO: PlatformDTO,
    packagesPage?: Page
  ) {
    return packagesPage;
  }

  @searchModelsByField(Package, searchPackagesByPlatformConfig)
  async searchPackagesByPlatform(
    platform: Platform,
    search: string,
    page: number,
    packagesPage?: Page
  ) {
    return packagesPage;
  }

  @getModelById(Package, getPackageByIdConfig)
  async getPackageById(pid: string, pkg?: any) {
    return pkg;
  }

  @updateModelById(Package)
  async updatePackageById(pid: string, updatedPackage: any, pkg?: any) {
    return pkg;
  }

  @deleteModelById(Package)
  async deletePackageById(pid: string, pkg?: any) {
    return pkg;
  }
}

export const packageRepository = new PackageRepository();

import { Controller, Get, Param, QueryParams, Res } from "routing-controllers";
import { GetPackagesDTO, PackageResponseDTO, SearchPackagesDTO } from "./dtos";
import { Response } from "express";
import { Page } from "../global/types/page.type";
import { Package } from "./package.model";
import { Platform } from "./platform.enum";
import {
  packageService,
  PackageService,
  packageUtility,
  PackageUtility,
} from "./index";

@Controller("/packages")
export class PackageController {
  packageService: PackageService;
  packageUtility: PackageUtility;

  constructor() {
    this.packageService = packageService;
    this.packageUtility = packageUtility;
  }

  @Get("/platform/:platform")
  async getPackagesByPlatform(
    @QueryParams() getPackagesDTO: GetPackagesDTO,
    @Param("platform") platform: Platform,
    @Res()
    response: Response
  ) {
    try {
      const packagesPage: Page | undefined =
        await this.packageService.getPackagesByPlatform(getPackagesDTO, {
          platform,
        });

      if (!packagesPage)
        return response.status(404).send({ message: "Packages not found." });

      if (packagesPage.content.length === 0)
        return response.status(200).json(packagesPage);

      const packagesDTO: PackageResponseDTO[] = packagesPage.content.map(
        (pkg) => this.packageUtility.convertPackageToPackageDTO(pkg)
      );

      const packagesPageDTO: Page = {
        ...packagesPage,
        content: packagesDTO,
      };

      return response.status(200).json(packagesPageDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/platform/:platform/search")
  async searchPackagesByPlatform(
    @Param("platform") platform: Platform,
    @QueryParams() { search }: SearchPackagesDTO,
    @QueryParams() { page }: GetPackagesDTO,
    @Res() response: Response
  ) {
    try {
      const packagesPage: any =
        await this.packageService.searchPackagesByPlatform(
          platform,
          search,
          page
        );

      if (packagesPage.repo.length === 0 && !packagesPage.registry)
        return response.status(404).send({ message: "Packages not found." });

      let packagesPageDTO;
      let repoPackagesDTO;
      let registryPackageDTO;

      if (packagesPage.repo.length > 0) {
        repoPackagesDTO = packagesPage.repo.map((pkg: Package) =>
          this.packageUtility.convertPackageToPackageDTO(pkg)
        );
      }

      if (packagesPage.registry) {
        registryPackageDTO = this.packageUtility.convertPackageToPackageDTO(
          packagesPage.registry
        );
      }

      packagesPageDTO = {
        ...packagesPage,
        repo: repoPackagesDTO || [],
        registry: registryPackageDTO || null,
      };

      return response.status(200).json(packagesPageDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/:pid")
  async getPackageById(@Param("pid") pid: string, @Res() response: Response) {
    try {
      const pkg: Package = await this.packageService.getPackageById(pid);

      if (!pkg)
        return response.status(404).send({ message: "Package not found." });

      const packageDTO = this.packageUtility.convertPackageToPackageDTO(pkg);
      return response.status(200).json(packageDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }
}

export const packageController = new PackageController();

import { Package } from "./package.model";
import { PackageResponseDTO } from "./dtos";

export class PackageUtility {
  convertPackageToPackageDTO(pkg: Package): PackageResponseDTO {
    const pkgDTO = new PackageResponseDTO();
    pkgDTO.id = pkg._id as any;
    pkgDTO.name = pkg.name;
    pkgDTO.description = pkg.description;
    pkgDTO.rating = pkg.rating;
    pkgDTO.reviews = pkg.reviews;
    pkgDTO.homepageUrl = pkg.homepageUrl;
    pkgDTO.packageUrl = pkg.packageUrl;
    pkgDTO.platform = pkg.platform;
    return pkgDTO;
  }
}

export const packageUtility = new PackageUtility();

import { Platform } from "../platform.enum";

export default class PackageResponseDTO {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviews: number;
  homepageUrl: string;
  packageUrl: string;
  platform: Platform;
}

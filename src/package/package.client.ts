import axios from "axios";
import { Platform } from "./platform.enum";

export class PackageClient {
  async searchPackages(platform: Platform, search: string) {
    switch (platform) {
      case Platform.Npm:
        try {
          const result = await axios.get(
            `https://registry.npmjs.org/${search}/latest`
          );

          const { _id, name, description, homepage } = result.data;

          const pkg = await this.getPackage(
            platform,
            _id,
            name,
            description,
            homepage ? homepage : `https://www.npmjs.com/package/${search}`,
            `https://www.npmjs.com/package/${search}`
          );

          return pkg;
        } catch (error: any) {
          return null;
        }

      case Platform.Pypi:
        try {
          const result2 = await axios.get(
            `https://pypi.org/pypi/${search}/json`
          );
          const { info } = result2.data;

          const pkg2 = await this.getPackage(
            platform,
            info.name,
            info.name,
            info.summary,
            info.home_page
              ? info.home_page
              : `https://pypi.org/project/${search}`,
            `https://pypi.org/project/${search}`
          );

          return pkg2;
        } catch (error: any) {
          return null;
        }

      case Platform.Maven:
        try {
          await axios.get(`https://central.sonatype.com/artifact/${search}`);

          const pkg3 = await this.getPackage(
            platform,
            `${search}`,
            `${search}`,
            "None",
            `https://central.sonatype.com/artifact/${search}`,
            `https://central.sonatype.com/artifact/${search}`
          );

          return pkg3;
        } catch (error: any) {
          return null;
        }

      case Platform.Packagist:
        try {
          const result4 = await axios.get(
            `https://repo.packagist.org/p2/${search}.json`
          );

          const { packages: pack } = result4.data;
          const p = pack[Object.keys(pack)[0]][0];

          const pkg4 = await this.getPackage(
            platform,
            p.name,
            p.name,
            p.description,
            p.homepage
              ? p.homepage
              : `https://packagist.org/packages/${search}`,
            `https://packagist.org/packages/${search}`
          );

          return pkg4;
        } catch (error: any) {
          return null;
        }

      case Platform.Rubygems:
        try {
          const result5 = await axios.get(
            `https://rubygems.org/api/v1/gems/${search}.json`
          );

          const {
            name: gem_name,
            info: gem_info,
            homepage_uri,
            project_uri,
          } = result5.data;

          const pkg5 = await this.getPackage(
            platform,
            gem_name,
            gem_name,
            gem_info,
            homepage_uri ? homepage_uri : project_uri,
            project_uri
          );

          return pkg5;
        } catch (error: any) {
          return null;
        }

      case Platform.Crates:
        try {
          const result6 = await axios.get(
            `https://crates.io/api/v1/crates/${search}`
          );

          const { crate } = result6.data;

          const pkg6 = await this.getPackage(
            platform,
            crate.id,
            crate.name,
            crate.description,
            crate.homepage
              ? crate.homepage
              : `https://crates.io/crates/${search}`,
            `https://crates.io/crates/${search}`
          );

          return pkg6;
        } catch (error: any) {
          return null;
        }

      case Platform.Nuget:
        try {
          const result7 = await axios.get(
            `https://api.nuget.org/v3/registration5-gz-semver2/${search}/index.json`
          );

          const { items } = result7.data;
          const subItem = items[0].items;
          const item = subItem[subItem.length - 1];

          const pkg7 = await this.getPackage(
            platform,
            item.catalogEntry.id,
            item.catalogEntry.id.toLowerCase(),
            item.catalogEntry.description,
            item.catalogEntry.projectUrl
              ? item.catalogEntry.projectUrl
              : `https://www.nuget.org/packages/${search}`,
            `https://www.nuget.org/packages/${search}`
          );

          return pkg7;
        } catch (error: any) {
          return null;
        }

      case Platform.Go:
        try {
          await axios.get(`https://pkg.go.dev/${search}`);

          const pkg8 = await this.getPackage(
            platform,
            `${search}`,
            `${search}`,
            "None",
            `https://pkg.go.dev/${search}`,
            `https://pkg.go.dev/${search}`
          );

          return pkg8;
        } catch (error: any) {
          return null;
        }

      default:
        return null;
    }
  }

  async getPackage(
    platform: Platform,
    _id: string,
    name: string,
    description: string,
    homepageUrl: string,
    packageUrl: string
  ) {
    return {
      _id,
      name,
      description,
      homepageUrl,
      packageUrl,
      rating: 0,
      raters: 0,
      totalRating: 0,
      platform,
      isDeleted: false,
    };
  }
}

export const packageClient = new PackageClient();

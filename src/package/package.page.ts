export class PackagePage {
  registry: object | null = null;
  repo: any[] = [];
  totalElements: number = 0;
  totalPages: number = 0;
  pageSize: number | null = 0;
  page: number | null = 0;
  sort: string | null = null;
  firstPage: boolean = false;
  lastPage: boolean = false;
  emptyPage: boolean = true;
}

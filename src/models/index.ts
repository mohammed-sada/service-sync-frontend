export interface PaginatedResponse<T> {
  currentPage: number;
  next: number | null;
  pageSize: number;
  previous: number | null;
  results: T[];
  totalItems: number;
}
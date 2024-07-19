export interface IFilterValues {
  searchKey: string;
  category_ids: string[];
  instructor_ids: string[];
  ratingRange: { min: number|null; max: number|null};
  priceRange: { min: number|null; max: number|null };

}

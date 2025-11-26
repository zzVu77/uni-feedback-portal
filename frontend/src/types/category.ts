export type Category = {
  id: string;
  name: string;
  isActive: boolean;
  feedbackCount: number;
};
export type UpdateCategoryStatusPayload = Pick<Category, "isActive">;
export type CreateCategoryPayload = Pick<Category, "name">;
export type UpdateCategoryNamePayload = Pick<Category, "name">;

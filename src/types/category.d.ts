/**
 * Category types
 * Available globally without import
 */

declare global {
  /**
   * Category model from database
   */
  type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };

  /**
   * Category input for creating/updating
   */
  type CategoryInput = {
    name: string;
    slug: string;
    description?: string | null;
    isActive?: boolean;
  };

  /**
   * Category update input
   */
  type CategoryUpdateInput = {
    name?: string;
    slug?: string;
    description?: string | null;
    isActive?: boolean;
  };
}

export {};

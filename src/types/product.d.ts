/**
 * Product types based on Prisma schema
 * Available globally without import
 */

declare global {
  /**
   * Product model from database
   */
  type Product = {
    id: number;
    name: string;
    description: string | null;
    price: number | null; // Decimal from DB converted to number
    image: string | null;
    slug: string | null;
    category: string;
    stock: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  };

  /**
   * Product input for creating/updating
   */
  type ProductInput = {
    name: string;
    description?: string | null;
    price?: number | null;
    image?: string | null;
    slug?: string | null;
    category?: string;
    stock?: number;
    active?: boolean;
  };

  /**
   * Product display props (for UI components)
   */
  type ProductDisplay = {
    id: number;
    name: string;
    description?: string | null;
    price: number | string;
    image?: string | null;
    category?: string;
    stock?: number;
  };

  /**
   * Product card props
   */
  type ProductCardProps = {
    id: number;
    name: string;
    price: number | string;
    image?: string | null;
  };
}

export {};

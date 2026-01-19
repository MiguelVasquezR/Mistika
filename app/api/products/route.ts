import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../lib/prisma";

/**
 * GET /api/products
 * Fetch products with pagination
 * Query params: page (default: 1), limit (default: 12)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    
    // Validate pagination parameters
    const currentPage = Math.max(1, page);
    const pageSize = Math.min(Math.max(1, limit), 100); // Max 100 items per page
    const skip = (currentPage - 1) * pageSize;

    // Get total count for pagination metadata
    const total = await prisma.products.count();
    
    // Fetch paginated products with category
    const products = await prisma.products.findMany({
      include: {
        category: true,
      },
      orderBy: { id: "desc" },
      skip,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        currentPage,
        pageSize,
        total,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Create a new product
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle category - can be categoryId or category name (legacy)
    let categoryId = body.categoryId;
    if (!categoryId && body.category) {
      // Try to find category by name (legacy support)
      const category = await prisma.categories.findFirst({
        where: { name: body.category },
      });
      if (category) {
        categoryId = category.id;
      } else {
        // Create default category or use General
        const defaultCategory = await prisma.categories.findFirst({
          where: { name: "General" },
        });
        categoryId = defaultCategory?.id || 1; // Fallback to ID 1 if exists
      }
    }

    if (!categoryId) {
      return NextResponse.json(
        {
          success: false,
          error: "Category ID is required",
        },
        { status: 400 }
      );
    }

    const product = await prisma.products.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price ? parseFloat(body.price) : null,
        discountPrice: body.discountPrice ? parseFloat(body.discountPrice) : null,
        isOnSale: body.isOnSale !== undefined ? body.isOnSale : false,
        imageUrl: body.imageUrl,
        slug: body.slug,
        categoryId,
        stock: body.stock || 0,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create product",
      },
      { status: 500 }
    );
  }
}

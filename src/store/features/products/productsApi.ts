import { apiSlice } from "../api/apiSlice";

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Fetch products with pagination
    fetchProducts: build.query({
      query: ({ page = 1, limit = 12 }: { page?: number; limit?: number } = {}) => 
        `/products?page=${page}&limit=${limit}`,
      transformResponse: (response: any) => {
        // Handle the response structure from Next.js API route
        if (response.success && response.data) {
          return {
            data: response.data,
            pagination: response.pagination || null,
          };
        }
        if (Array.isArray(response)) {
          return { data: response, pagination: null };
        }
        if (response.data) {
          return {
            data: Array.isArray(response.data) ? response.data : [],
            pagination: response.pagination || null,
          };
        }
        return { data: [], pagination: null };
      },
      providesTags: ["Products"],
    }),

    // Fetch single product by ID
    fetchProduct: build.query({
      query: (id: string) => `/products/${id}`,
      transformResponse: (response: any) => {
        // Handle the response structure from Next.js API route
        if (response.success && response.data) {
          return { data: response.data };
        }
        if (response.data) {
          return { data: response.data };
        }
        return { data: response };
      },
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    // Create product (mutation)
    createProduct: build.mutation({
      query: (formData: ProductInput) => ({
        url: "",
        method: "POST",
        body: { product: formData },
        headers: {
          endpoint: "products",
          method: "POST",
        },
      }),
      invalidatesTags: ["Products"],
    }),

    // Update product (mutation)
    updateProduct: build.mutation({
      query: ({ id, ...formData }: { id: number } & Partial<ProductInput>) => ({
        url: "",
        method: "PUT",
        body: { product: formData },
        headers: {
          endpoint: `products/${id}`,
          method: "PUT",
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Products", id },
        "Products",
      ],
    }),

    // Delete product (mutation)
    deleteProduct: build.mutation({
      query: (id: number) => ({
        url: "",
        method: "DELETE",
        headers: {
          endpoint: `products/${id}`,
          method: "DELETE",
        },
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useFetchProductsQuery,
  useFetchProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;

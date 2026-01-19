import { apiSlice } from "../api/apiSlice";

export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Fetch all categories
    fetchCategories: build.query({
      query: (activeOnly?: boolean) => 
        activeOnly ? "/categories?activeOnly=true" : "/categories",
      transformResponse: (response: any) => {
        if (response.success && response.data) {
          return { data: response.data };
        }
        if (Array.isArray(response)) {
          return { data: response };
        }
        if (response.data) {
          return {
            data: Array.isArray(response.data) ? response.data : [],
          };
        }
        return { data: [] };
      },
      providesTags: ["Categories"],
    }),

    // Fetch single category by ID
    fetchCategory: build.query({
      query: (id: string) => `/categories/${id}`,
      transformResponse: (response: any) => {
        if (response.success && response.data) {
          return { data: response.data };
        }
        if (response.data) {
          return { data: response.data };
        }
        return { data: response };
      },
      providesTags: (result, error, id) => [{ type: "Categories", id }],
    }),

    // Create category (mutation)
    createCategory: build.mutation({
      query: (categoryData: CategoryInput) => ({
        url: "/categories",
        method: "POST",
        body: categoryData,
      }),
      transformResponse: (response: any) => {
        if (response.success && response.data) {
          return { success: true, data: response.data };
        }
        return response;
      },
      invalidatesTags: ["Categories"],
    }),

    // Update category (mutation)
    updateCategory: build.mutation({
      query: ({ id, ...updateData }: { id: number } & CategoryUpdateInput) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: updateData,
      }),
      transformResponse: (response: any) => {
        if (response.success && response.data) {
          return { success: true, data: response.data };
        }
        return response;
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Categories", id },
        "Categories",
      ],
    }),

    // Delete category (mutation)
    deleteCategory: build.mutation({
      query: (id: number) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => {
        if (response.success) {
          return { success: true };
        }
        return response;
      },
      invalidatesTags: ["Categories"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useFetchCategoriesQuery,
  useFetchCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;

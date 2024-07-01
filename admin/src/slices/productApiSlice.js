import { PRODUCTS_URL, UPLOADS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
              url:PRODUCTS_URL ,
              
            }),
            keepUnusedDataFor:5
        }),
        getProductDetails: builder.query({
            query: (id) => ({
                url: `${PRODUCTS_URL}/${id}`,
            }),
            keepUnusedDataFor:5
        }),
        createProduct: builder.mutation({
            query: (product) => ({
                url:PRODUCTS_URL,
                method: 'POST',
                body: product
        }),
        invalidatesTags: ['Product']
        }),
        updateProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data._id}`,
                method: 'PUT',
                body: data
        }),
        invalidatesTags: ['Product']
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `${PRODUCTS_URL}/${id}`,
                method: 'DELETE'
            }),
                
        }),
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: `${UPLOADS_URL}`,
                method: 'POST',
                body: data
            }),
        }),
        createAdminReply: builder.mutation({
            query: ({ productId, reviewId, reply }) => ({
              url: `${PRODUCTS_URL}/${productId}/reviews/${reviewId}/reply`,
              method: 'PUT',
              body: { reply },
              credentials: 'include',
            }),
          }),


})
});


export const {
    useGetProductsQuery ,
    useGetProductDetailsQuery,
    useCreateProductMutation, 
    useUpdateProductMutation, 
    useUploadProductImageMutation,
    useDeleteProductMutation,
    useCreateAdminReplyMutation
} = productsApiSlice;
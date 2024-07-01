import { apiSlice } from './apiSlice';
import { SUPPLIER_URL } from '../constants';


export const supplierApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSuppliers: builder.query({
      query: () => SUPPLIER_URL,
    }),
    createSupplier: builder.mutation({
      query: (supplier) => ({
        url: SUPPLIER_URL,
        method: 'POST',
        body: supplier,
        
      }),
    }),
    deleteSupplier: builder.mutation({
      query: (id) => ({
        url: `${SUPPLIER_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
    updateSupplier: builder.mutation({
      query: (selectedSupplier) => ({
        url: `${SUPPLIER_URL}/${selectedSupplier.id}`,  
        method: 'PUT',
        body: selectedSupplier,
      }),
    }),
    
  }),
});

export const { 
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useDeleteSupplierMutation,
  useUpdateSupplierMutation,
 } = supplierApiSlice;

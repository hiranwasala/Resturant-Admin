import { apiSlice } from './apiSlice';
import { INVENTORY_URL } from '../constants';



export const inventoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInventories: builder.query({
      query: () => INVENTORY_URL,
    }),
    createInventory: builder.mutation({
      query: (inventory) => ({
        url: INVENTORY_URL,
        method: 'POST',
        body: inventory,
        
      }),
    }),
    deleteInventory: builder.mutation({
      query: (id) => ({
        url: `${INVENTORY_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
    updateInventory: builder.mutation({
      query: (selectedInventory) => ({
        url: `${INVENTORY_URL}/${selectedInventory.id}`,  
        method: 'PUT',
        body: selectedInventory,
      }),
    }),
    
  }),
});

export const { 
    useGetInventoriesQuery,
    useCreateInventoryMutation,
    useDeleteInventoryMutation,
    useUpdateInventoryMutation,
  } = inventoryApiSlice;
  


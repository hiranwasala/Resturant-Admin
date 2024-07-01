import { apiSlice } from './apiSlice';
import { RESERVATION_URL } from '../constants';

export const reservationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReservations: builder.query({
      query: () => RESERVATION_URL,
    }),
    createReservation: builder.mutation({
      query: (reservation) => ({
        url: RESERVATION_URL,
        method: 'POST',
        body: reservation,
        credentials: 'include', 
      }),
    }),
    deleteReservation: builder.mutation({
      query: (id) => ({
        url: `${RESERVATION_URL}/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
    }),
    updateReservation: builder.mutation({
      query: (reservation) => ({
        url: `${RESERVATION_URL}/${reservation._id}`,
        method: 'PUT',
        body: reservation,
        credentials: 'include', 
      }),
    }),
  }),
});

export const { 
    useGetReservationsQuery,
    useCreateReservationMutation,
    useDeleteReservationMutation,
    useUpdateReservationMutation,
 } = reservationApiSlice;

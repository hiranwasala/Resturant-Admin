import { USERS_URL } from '../constants';
import { apiSlice } from './apiSlice';

const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`, 
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
            invalidatesTags: ['User'],
        }),
        register: builder.mutation({
            query: (data) => ({
                url: USERS_URL, 
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
            invalidatesTags: ['User'],
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`, 
                method: 'POST',
                credentials: 'include',
            }),
            invalidatesTags: ['User'],
        }),
        profile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`, 
                method: 'PUT',
                body: data,
                credentials: 'include',
            }),
            invalidatesTags: ['User'],
        }),
        forgotPassword: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/forgotPassword`, 
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
        }),
        verifyEmail: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/verifyEmail`, 
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
        }),
        getUsers: builder.query({
            query: () => ({
                url: USERS_URL, 
                method: 'GET',
            
            }),
            providesTags: ['Users'],
            keepUnusedDataFor: 5
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`, 
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['User'],
        }),
        getUserDetails: builder.query({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`, 
                credentials: 'include',
            }),
            keepUnusedDataFor: 5
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.userId}`,  
                method: 'PUT',
                body: data,
                credentials: 'include',
            }),
            invalidatesTags: ['Users'],
        })
    }),
});

export const { 
    useLoginMutation, 
    useRegisterMutation, 
    useLogoutMutation, 
    useProfileMutation, 
    useForgotPasswordMutation, 
    useVerifyEmailMutation,
    useGetUsersQuery,
    useDeleteUserMutation,
    useGetUserDetailsQuery,
    useUpdateUserMutation,
} = usersApiSlice;

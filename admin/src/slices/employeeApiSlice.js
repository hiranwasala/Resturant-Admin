import { apiSlice } from './apiSlice';
import { EMPLOYEE_URL, UPLOADS_URL } from '../constants';


export const employeeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: () => EMPLOYEE_URL,
    }),
    createEmployee: builder.mutation({
      query: (employee) => ({
        url: EMPLOYEE_URL,
        method: 'POST',
        body: employee,
        
      }),
    }),
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `${EMPLOYEE_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
    updateEmployee: builder.mutation({
      query: (selectedEmployee) => ({
        url: `${EMPLOYEE_URL}/${selectedEmployee.id}`,  
        method: 'PUT',
        body: selectedEmployee,
      }),
    }),
    uploadProfileImage: builder.mutation({
      query: (data) => ({
          url: `${UPLOADS_URL}`,
          method: 'POST',
          body: data
      }),
  }),
    
  }),
});

export const { 
   useCreateEmployeeMutation,
   useDeleteEmployeeMutation,
   useGetEmployeesQuery,
   useUpdateEmployeeMutation,
   useUploadProfileImageMutation,
 } = employeeApiSlice;

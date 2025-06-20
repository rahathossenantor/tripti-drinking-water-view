import baseApi from "./baseAPI";

const customerApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        createCustomer: build.mutation({
            query: (data) => ({
                url: "/customers/",
                method: "POST",
                data
            }),
            invalidatesTags: ["customers"],
        }),
        getCustomers: build.query({
            query: () => ({
                url: "/customers/",
                method: "GET",
            }),
            providesTags: ["customers"],
        }),
        deleteCustomer: build.mutation({
            query: (id) => ({
                url: `/customers/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["customers", "orders"],
        }),
    }),
});

export const {
    useCreateCustomerMutation,
    useGetCustomersQuery,
    useDeleteCustomerMutation,
} = customerApi;

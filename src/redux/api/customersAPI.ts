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
    }),
});

export const {
    useCreateCustomerMutation,
    useGetCustomersQuery,
} = customerApi;

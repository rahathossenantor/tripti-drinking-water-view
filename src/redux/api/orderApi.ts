import baseApi from "./baseAPI";

const orderApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        createOrder: build.mutation({
            query: (data) => ({
                url: "/orders/",
                method: "POST",
                data
            }),
            invalidatesTags: ["orders"],
        }),
        getOrders: build.query({
            query: () => ({
                url: "/orders/",
                method: "GET",
            }),
            providesTags: ["orders"],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrdersQuery,
} = orderApi;

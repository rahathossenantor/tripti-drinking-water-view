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
        updateOrderPaymentStatus: build.mutation({
            query: ({ id }) => ({
                url: `/orders/${id}`,
                method: "PATCH",
                data: { paymentStatus: "Paid" },
            }),
            invalidatesTags: ["orders"],
        }),
        deleteOrder: build.mutation({
            query: ({ id }) => ({
                url: `/orders/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["orders"],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrdersQuery,
    useUpdateOrderPaymentStatusMutation,
    useDeleteOrderMutation,
} = orderApi;

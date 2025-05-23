import axiosBaseQuery from "@/axios/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

const baseApi = createApi({
    reducerPath: "api",
    baseQuery: axiosBaseQuery({ baseUrl: "https://tripti-drinking-water.vercel.app/api/v1" }),
    endpoints: () => ({}),
    tagTypes: [
        "customers",
        "orders",
    ],
});

export default baseApi;

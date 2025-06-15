/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
    Container, Typography, Box, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, TextField, MenuItem, Stack, IconButton
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useGetOrdersQuery, useUpdateOrderPaymentStatusMutation, useDeleteOrderMutation } from "@/redux/api/orderApi";
import Loader from "@/components/Loader";
import NoDataFound from "@/components/NoDataFound";
import Link from "next/link";
import { toast } from "sonner";
import Swal from "sweetalert2";
import React from "react";

const ManageSales = () => {
    const { data: orders, isLoading } = useGetOrdersQuery(undefined);
    const [updatePaymentStatus] = useUpdateOrderPaymentStatusMutation();
    const [deleteOrder] = useDeleteOrderMutation();

    const [filters, setFilters] = React.useState({
        customerType: "",
        serviceType: "",
        paymentStatus: "",
        search: ""
    });

    const handlePaymentStatusUpdate = async (id: string) => {
        Swal.fire({
            title: "আপনি কি নিশ্চিতভাবে এই অর্ডারটিকে পরিশোধিত হিসেবে চিহ্নিত করতে চান?",
            text: "পরবর্তীতে এটি আর পরিবর্তন করতে পারবেন না!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "হ্যাঁ, করুন।"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const toastId = toast.loading("পরিশোধিত হিসেবে চিহ্নিত করা হচ্ছে...");

                try {
                    const res = await updatePaymentStatus({ id }).unwrap();
                    toast.success(res?.message, { id: toastId, duration: 2000 });
                } catch (error: any) {
                    console.error("Error updating payment status:", error);
                    toast.error(error?.message || error?.data?.message, { id: toastId });
                }
            }
        });
    };

    const handleDeleteOrder = async (id: string) => {
        Swal.fire({
            title: "আপনি কি নিশ্চিতভাবে এটি ডিলিট করতে চান?",
            text: "এটি পুনরায় আর ফিরিয়ে আনা সম্ভব নয়!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "হ্যাঁ, করুন।"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const toastId = toast.loading("ডিলিট করা হচ্ছে...");
                try {
                    const res = await deleteOrder({ id }).unwrap();
                    toast.success(res?.message, { id: toastId, duration: 2000 });
                } catch (error: any) {
                    console.error("Error deleting order:", error);
                    toast.error(error?.message || error?.data?.message, { id: toastId });
                }
            }
        });
    };

    const filteredOrders = React.useMemo(() => {
        if (!orders?.data) return [];

        return orders.data.filter((order: any) => {
            const matchesCustomerType = !filters.customerType || order.customer.customerType === filters.customerType;
            const matchesServiceType = !filters.serviceType || order.customer.serviceType === filters.serviceType;
            const matchesPaymentStatus = !filters.paymentStatus || order.paymentStatus === filters.paymentStatus;
            const matchesSearch = !filters.search ||
                order.customer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                order.customer.phone.includes(filters.search);

            return matchesCustomerType && matchesServiceType && matchesPaymentStatus && matchesSearch;
        });
    }, [orders?.data, filters]);

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    if (isLoading) {
        return (
            <Container className="h-screen flex items-center justify-center">
                <Loader />
            </Container>
        );
    };

    return (
        <Container className="py-8">
            <Box className="flex justify-between items-center mb-6">
                <Link
                    href="/"
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                    ← পেছনে যান
                </Link>
                <Typography variant="h5" className="font-bold hidden md:block">
                    বিক্রি ম্যানেজ করুন
                </Typography>
                <Link
                    href="/manage-customers"
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                    সব কাস্টমার দেখুন
                </Link>
            </Box>

            {/* Add Filter Section */}
            <Paper className="p-4 mb-4">
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                        label="Search"
                        size="small"
                        value={filters.search}
                        onChange={(e) => handleFilterChange("search", e.target.value)}
                        placeholder="নাম বা নাম্বার দিয়ে খুঁজুন"
                        className="min-w-[200px]"
                    />
                    <TextField
                        select
                        label="ক্রেতার ধরণ"
                        size="small"
                        value={filters.customerType}
                        onChange={(e) => handleFilterChange('customerType', e.target.value)}
                        className="min-w-[150px]"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Residential">Residential</MenuItem>
                        <MenuItem value="Business">Business</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="ডেলিভারির ধরণ"
                        size="small"
                        value={filters.serviceType}
                        onChange={(e) => handleFilterChange("serviceType", e.target.value)}
                        className="min-w-[150px]"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Daily">Daily</MenuItem>
                        <MenuItem value="Weekly">Weekly</MenuItem>
                        <MenuItem value="Monthly">Monthly</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="পেমেন্ট স্ট্যাটাস"
                        size="small"
                        value={filters.paymentStatus}
                        onChange={(e) => handleFilterChange("paymentStatus", e.target.value)}
                        className="min-w-[150px]"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                        <MenuItem value="Due">Due</MenuItem>
                    </TextField>
                </Stack>
            </Paper>

            <TableContainer component={Paper} className="shadow-md">
                <Table>
                    <TableHead className="bg-gray-100">
                        <TableRow>
                            <TableCell className="font-bold">নাম</TableCell>
                            <TableCell className="font-bold">পরিমাণ</TableCell>
                            <TableCell className="font-bold">মোট মূল্য</TableCell>
                            <TableCell className="font-bold">পেমেন্ট স্ট্যাটাস</TableCell>
                            <TableCell className="font-bold">ডেলিভারির ধরণ</TableCell>
                            <TableCell className="font-bold">ক্রেতার ধরণ</TableCell>
                            <TableCell className="font-bold">একশন</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.map((order: any) => (
                            <TableRow key={order._id} className="hover:bg-gray-50">
                                <TableCell>{order.customer.name}</TableCell>
                                <TableCell>{order.quantity}</TableCell>
                                <TableCell>৳{order.totalPrice}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={order.paymentStatus}
                                        color={order.paymentStatus === "Paid" ? "success" : "error"}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={order.customer.serviceType}
                                        color={
                                            order.customer.serviceType === "Daily" ? "success" :
                                                order.customer.serviceType === "Weekly" ? "warning" : "error"
                                        }
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={order.customer.customerType}
                                        color={order.customer.customerType === "Business" ? "primary" : "default"}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        className="mr-2"
                                        disabled={order.paymentStatus === "Paid"}
                                        onClick={() => {
                                            handlePaymentStatusUpdate(order._id);
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => {
                                            handleDeleteOrder(order._id);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {(!filteredOrders.length && !isLoading) && <NoDataFound />}
            </TableContainer>
        </Container>
    );
};

export default ManageSales;

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import {
    Container, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, TextField, MenuItem, Stack, IconButton, Card, CardContent
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import { TrendingUp, Search, Filter, ArrowLeft, ExternalLink, Receipt, DollarSign } from "lucide-react";
import Link from "next/link";
import { useGetOrdersQuery, useUpdateOrderPaymentStatusMutation, useDeleteOrderMutation } from "@/redux/api/orderApi";
import Loader from "@/components/Loader";
import NoDataFound from "@/components/NoDataFound";
import { toast } from "sonner";
import Swal from "sweetalert2";

const ManageSales = () => {
    const { data: orders, isLoading } = useGetOrdersQuery(undefined);
    const [updatePaymentStatus] = useUpdateOrderPaymentStatusMutation();
    const [deleteOrder] = useDeleteOrderMutation();

    const [filters, setFilters] = useState({
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
            cancelButtonText: "না, বাতিল করুন।",
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
            cancelButtonText: "না, বাতিল করুন।",
            confirmButtonText: "হ্যাঁ, ডিলিট করুন।"
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

    const filteredOrders = useMemo(() => {
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

    // Calculate summary statistics
    const stats = useMemo(() => {
        if (!filteredOrders.length) return { totalSales: 0, totalPaid: 0, totalDue: 0, totalOrders: 0 };

        return {
            totalSales: filteredOrders.reduce((sum: any, order: any) => sum + order.totalPrice, 0),
            totalPaid: filteredOrders.filter((order: any) => order.paymentStatus === "Paid").reduce((sum: any, order: any) => sum + order.totalPrice, 0),
            totalDue: filteredOrders.filter((order: any) => order.paymentStatus === "Due").reduce((sum: any, order: any) => sum + order.totalPrice, 0),
            totalOrders: filteredOrders.length
        };
    }, [filteredOrders]);

    if (isLoading) {
        return (
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
            {/* Modern Header */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-2xl"
            >
                <Container maxWidth="xl">
                    <div className="py-6">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex items-center justify-between"
                        >
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-white hover:text-blue-100 font-semibold transition-colors duration-300 group"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                                পেছনে যান
                            </Link>
                            <div className="text-center">
                                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                                    <TrendingUp className="w-8 h-8" />
                                    বিক্রি ম্যানেজমেন্ট
                                </h1>
                                <p className="text-blue-100 mt-1">বিক্রয় রেকর্ড ও আয়ের হিসাব</p>
                            </div>
                            <Link
                                href="/manage-customers"
                                className="flex items-center gap-2 text-white hover:text-blue-100 font-semibold transition-colors duration-300 group"
                            >
                                কাস্টমার তালিকা
                                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>
                        </motion.div>
                    </div>
                </Container>
            </motion.div>

            {/* Main Content */}
            <Container maxWidth="xl" className="py-8">
                {/* Enhanced Statistics Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Typography variant="h4" className="font-bold">
                                        {stats.totalOrders}
                                    </Typography>
                                    <Typography className="opacity-90">
                                        📊 মোট অর্ডার
                                    </Typography>
                                </div>
                                <Receipt className="w-12 h-12 opacity-80" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Typography variant="h4" className="font-bold">
                                        ৳{stats.totalSales}
                                    </Typography>
                                    <Typography className="opacity-90">
                                        💰 মোট বিক্রয়
                                    </Typography>
                                </div>
                                <DollarSign className="w-12 h-12 opacity-80" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Typography variant="h4" className="font-bold">
                                        ৳{stats.totalPaid}
                                    </Typography>
                                    <Typography className="opacity-90">
                                        ✅ পরিশোধিত
                                    </Typography>
                                </div>
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">✅</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Typography variant="h4" className="font-bold">
                                        ৳{stats.totalDue}
                                    </Typography>
                                    <Typography className="opacity-90">
                                        ⏳ বকেয়া
                                    </Typography>
                                </div>
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">⏳</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Enhanced Filter Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mb-8"
                >
                    <Paper
                        elevation={8}
                        className="p-6 bg-gradient-to-r from-white to-blue-50 border border-blue-100 rounded-2xl"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Filter className="w-6 h-6 text-indigo-600" />
                            <Typography variant="h5" className="font-bold text-gray-800">
                                🔍 ফিল্টার ও খুঁজুন
                            </Typography>
                        </div>
                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={3}
                            className="w-full"
                            alignItems="stretch"
                        >
                            <TextField
                                label="খুঁজুন"
                                size="medium"
                                value={filters.search}
                                onChange={(e) => handleFilterChange("search", e.target.value)}
                                placeholder="নাম বা নাম্বার দিয়ে খুঁজুন"
                                className="flex-1 min-w-[280px]"
                                InputProps={{
                                    startAdornment: <Search className="w-5 h-5 text-gray-400 mr-2" />,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '&:hover fieldset': {
                                            borderColor: '#4f46e5',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#4f46e5',
                                        },
                                    },
                                }}
                            />
                            <TextField
                                select
                                label="ক্রেতার ধরণ"
                                size="medium"
                                value={filters.customerType}
                                onChange={(e) => handleFilterChange('customerType', e.target.value)}
                                className="flex-1 min-w-[200px]"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                    },
                                }}
                            >
                                <MenuItem value="">🌐 সব ধরণের</MenuItem>
                                <MenuItem value="Residential">🏠 আবাসিক</MenuItem>
                                <MenuItem value="Business">🏢 ব্যবসায়িক</MenuItem>
                            </TextField>
                            <TextField
                                select
                                label="ডেলিভারির ধরণ"
                                size="medium"
                                value={filters.serviceType}
                                onChange={(e) => handleFilterChange("serviceType", e.target.value)}
                                className="flex-1 min-w-[200px]"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                    },
                                }}
                            >
                                <MenuItem value="">🌐 সব ধরণের</MenuItem>
                                <MenuItem value="Daily">📅 দৈনিক</MenuItem>
                                <MenuItem value="Weekly">📆 সাপ্তাহিক</MenuItem>
                                <MenuItem value="Monthly">🗓️ মাসিক</MenuItem>
                            </TextField>
                            <TextField
                                select
                                label="পেমেন্ট স্ট্যাটাস"
                                size="medium"
                                value={filters.paymentStatus}
                                onChange={(e) => handleFilterChange("paymentStatus", e.target.value)}
                                className="flex-1 min-w-[200px]"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                    },
                                }}
                            >
                                <MenuItem value="">🌐 সব ধরণের</MenuItem>
                                <MenuItem value="Paid">✅ পরিশোধিত</MenuItem>
                                <MenuItem value="Due">⏳ বকেয়া</MenuItem>
                            </TextField>
                        </Stack>

                        {/* Filter Results Info */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <Typography variant="body2" className="text-gray-600">
                                📊 মোট {filteredOrders.length} টি অর্ডার পাওয়া গেছে
                                {orders?.data && orders.data.length !== filteredOrders.length &&
                                    ` (সর্বমোট ${orders.data.length} টির মধ্যে)`
                                }
                            </Typography>
                        </div>
                    </Paper>
                </motion.div>

                {/* Enhanced Table Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <TableContainer
                        component={Paper}
                        elevation={12}
                        className="shadow-2xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm"
                    >
                        <Table>
                            <TableHead className="bg-gradient-to-r from-indigo-500 to-purple-600">
                                <TableRow>
                                    <TableCell className="font-bold text-white text-lg">👤 নাম</TableCell>
                                    <TableCell className="font-bold text-white text-lg">📦 পরিমাণ</TableCell>
                                    <TableCell className="font-bold text-white text-lg">💰 মোট মূল্য</TableCell>
                                    <TableCell className="font-bold text-white text-lg">💳 পেমেন্ট</TableCell>
                                    <TableCell className="font-bold text-white text-lg">📅 ডেলিভারি</TableCell>
                                    <TableCell className="font-bold text-white text-lg">🏠 ধরণ</TableCell>
                                    <TableCell className="font-bold text-white text-lg">⚙️ একশন</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredOrders.map((order: any) => (
                                    <TableRow
                                        key={order._id}
                                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
                                    >
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-bold">
                                                        {order.customer.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-gray-800">
                                                        {order.customer.name}
                                                    </span>
                                                    <div className="text-sm text-gray-500">
                                                        📱 {order.customer.phone}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 font-bold text-gray-700 text-lg">
                                            {order.quantity} বোতল
                                        </TableCell>
                                        <TableCell className="py-4 font-bold text-green-600 text-lg">
                                            ৳{order.totalPrice}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Chip
                                                label={order.paymentStatus === "Paid" ? "✅ পরিশোধিত" : "⏳ বকেয়া"}
                                                color={order.paymentStatus === "Paid" ? "success" : "error"}
                                                size="medium"
                                                className="font-semibold"
                                            />
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Chip
                                                label={
                                                    order.customer.serviceType === "Daily" ? "📅 দৈনিক" :
                                                        order.customer.serviceType === "Weekly" ? "📆 সাপ্তাহিক" : "🗓️ মাসিক"
                                                }
                                                color={
                                                    order.customer.serviceType === "Daily" ? "success" :
                                                        order.customer.serviceType === "Weekly" ? "warning" : "error"
                                                }
                                                size="medium"
                                                className="font-semibold"
                                            />
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Chip
                                                label={order.customer.customerType === "Business" ? "🏢 ব্যবসায়িক" : "🏠 আবাসিক"}
                                                color={order.customer.customerType === "Business" ? "primary" : "default"}
                                                size="medium"
                                                className="font-semibold"
                                            />
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex gap-2">
                                                <IconButton
                                                    size="medium"
                                                    className="bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all duration-300 hover:scale-110"
                                                    disabled={order.paymentStatus === "Paid"}
                                                    onClick={() => {
                                                        handlePaymentStatusUpdate(order._id);
                                                    }}
                                                    title="পরিশোধিত হিসেবে চিহ্নিত করুন"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    size="medium"
                                                    className="bg-red-100 hover:bg-red-200 text-red-600 transition-all duration-300 hover:scale-110"
                                                    onClick={() => {
                                                        handleDeleteOrder(order._id);
                                                    }}
                                                    title="অর্ডার ডিলিট করুন"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {(!filteredOrders.length && !isLoading) && <NoDataFound />}
                    </TableContainer>
                </motion.div>
            </Container>
        </div>
    );
};

export default ManageSales;

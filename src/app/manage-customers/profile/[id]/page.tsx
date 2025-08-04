/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useMemo, use } from "react";
import { motion } from "framer-motion";
import {
    Box,
    Paper,
    Typography,
    Card,
    CardContent,
    Chip,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Pagination,
    Alert,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from "@mui/material";
import {
    ArrowLeft,
    User,
    Phone,
    Mail,
    MapPin,
    Package,
    CreditCard,
    AlertCircle,
    ShoppingCart,
    DollarSign,
    Edit,
    Trash2
} from "lucide-react";
import Link from "next/link";
import { useDeleteCustomerMutation, useGetSingleCustomerQuery } from "@/redux/api/customersAPI";
import { useGetCustomersOrdersQuery } from "@/redux/api/orderApi";
import { TOrder } from "@/types";
import Loader from "@/components/Loader";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Date utility functions
const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
};

const isToday = (date: string) => {
    const today = new Date();
    const orderDate = new Date(date);
    return formatDate(today) === formatDate(orderDate);
};

const isThisMonth = (date: string) => {
    const today = new Date();
    const orderDate = new Date(date);
    return today.getMonth() === orderDate.getMonth() && today.getFullYear() === orderDate.getFullYear();
};

const isSameDate = (date1: string, date2: string) => {
    return formatDate(new Date(date1)) === formatDate(new Date(date2));
};

const isSameMonth = (date1: string, date2: string) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
};

type DateFilter = "today" | "selected-day" | "this-month" | "selected-month" | "all-time";

const Profile = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const [currentPage, setCurrentPage] = useState(1);
    const [dateFilter, setDateFilter] = useState<DateFilter>("all-time");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().split('T')[0]);
    const ordersPerPage = 10;

    const { data: customerData, isLoading: customerLoading, error: customerError } = useGetSingleCustomerQuery(id);
    const { data: ordersData, isLoading: ordersLoading } = useGetCustomersOrdersQuery(id);

    const customer = customerData?.data;
    const customerOrders: TOrder[] = useMemo(() => ordersData?.data || [], [ordersData?.data]);

    // Calculate customer statistics with date filtering
    const customerStats = useMemo(() => {
        let filteredOrders = customerOrders;

        // Apply date filter
        if (dateFilter === "today") {
            filteredOrders = customerOrders.filter(order => order.createdAt && isToday(order.createdAt));
        } else if (dateFilter === "selected-day") {
            filteredOrders = customerOrders.filter(order => order.createdAt && isSameDate(order.createdAt, selectedDate));
        } else if (dateFilter === "this-month") {
            filteredOrders = customerOrders.filter(order => order.createdAt && isThisMonth(order.createdAt));
        } else if (dateFilter === "selected-month") {
            filteredOrders = customerOrders.filter(order => order.createdAt && isSameMonth(order.createdAt, selectedMonth));
        }
        // "all-time" uses all orders without filtering

        const totalOrders = filteredOrders.length;
        const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        const totalQuantity = filteredOrders.reduce((sum, order) => sum + order.quantity, 0);
        const paidOrders = filteredOrders.filter(order => order.paymentStatus === "Paid").length;
        const paidAmount = filteredOrders
            .filter(order => order.paymentStatus === "Paid")
            .reduce((sum, order) => sum + order.totalPrice, 0);
        const dueOrders = filteredOrders.filter(order => order.paymentStatus === "Due").length;
        const totalDue = filteredOrders
            .filter(order => order.paymentStatus === "Due")
            .reduce((sum, order) => sum + order.totalPrice, 0);

        return {
            totalOrders,
            totalRevenue,
            totalQuantity,
            paidOrders,
            paidAmount,
            dueOrders,
            totalDue,
            filteredOrders // Return filtered orders for table display
        };
    }, [customerOrders, dateFilter, selectedDate, selectedMonth]);

    // Paginate filtered orders
    const paginatedOrders = useMemo(() => {
        const filteredOrders = customerStats?.filteredOrders || [];
        const startIndex = (currentPage - 1) * ordersPerPage;
        const endIndex = startIndex + ordersPerPage;
        return filteredOrders.slice(startIndex, endIndex);
    }, [customerStats?.filteredOrders, currentPage]);

    const totalPages = Math.ceil((customerStats?.filteredOrders?.length || 0) / ordersPerPage);

    // Reset to first page when filter changes
    const handleFilterChange = (newFilter: DateFilter) => {
        setDateFilter(newFilter);
        setCurrentPage(1);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const formatDateDisplay = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('bn-BD', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const [deleteCustomer] = useDeleteCustomerMutation();
    const router = useRouter();

    // Handle customer deletion
    const handleDelete = async (id: string) => {
        Swal.fire({
            title: "আপনি কি নিশ্চিতভাবে এই কাস্টমারকে ডিলিট করতে চান?",
            text: "ডিলিট হওয়ার পরে এটি আর পাওয়া যাবে না!",
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
                    const res = await deleteCustomer(id).unwrap();
                    toast.success(res?.message, { id: toastId, duration: 2000 });

                    router.push("/manage-customers");
                } catch (error: any) {
                    console.error("Error deleting customer:", error);
                    toast.error(error?.message || error?.data?.message, { id: toastId });
                };
            }
        });
    };

    if (customerLoading || ordersLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
                <Loader />
            </div>
        );
    }

    if (customerError || !customer) {
        return (
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen p-8">
                <div className="max-w-4xl mx-auto">
                    <Alert severity="error" sx={{ borderRadius: 3, mb: 4 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            কাস্টমার পাওয়া যায়নি
                        </Typography>
                        <Typography variant="body2">
                            এই আইডি দিয়ে কোন কাস্টমার খুঁজে পাওয়া যায়নি। দয়া করে সঠিক আইডি দিয়ে চেষ্টা করুন।
                        </Typography>
                    </Alert>
                    <Link href="/manage-customers">
                        <Button variant="contained" startIcon={<ArrowLeft />}>
                            কাস্টমার তালিকায় ফিরে যান
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
            {/* Header */}
            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-2xl"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex items-center justify-between"
                    >
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                                <User size={36} />
                                👤 কাস্টমার প্রোফাইল
                            </h1>
                            <p className="text-blue-100 text-lg">বিস্তারিত কাস্টমার তথ্য ও অর্ডার ইতিহাস</p>
                        </div>
                        <Link href="/manage-customers">
                            <Button
                                variant="contained"
                                startIcon={<ArrowLeft />}
                                sx={{
                                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.3)"
                                    },
                                    borderRadius: 3,
                                    px: 3,
                                    py: 1.5
                                }}
                            >
                                ফিরে যান
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </motion.header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Customer Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <Paper
                        elevation={8}
                        className="p-6 mb-8 bg-gradient-to-r from-white to-blue-50 border border-blue-100"
                        sx={{ borderRadius: 4 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <Typography variant="h5" className="font-bold text-gray-800 flex items-center gap-3">
                                <User className="w-6 h-6 text-indigo-600" />
                                👤 কাস্টমার তথ্য
                            </Typography>

                            {/* Modern Action Buttons */}
                            <div className="flex items-center gap-3">
                                {/* Update Customer Button */}
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link href={`/manage-customers/${id}`}>
                                        <Button
                                            variant="contained"
                                            startIcon={<Edit size={20} />}
                                            sx={{
                                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                color: "white",
                                                borderRadius: 3,
                                                px: 3,
                                                py: 1.5,
                                                fontWeight: 600,
                                                textTransform: "none",
                                                boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                                                "&:hover": {
                                                    background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                                                    boxShadow: "0 12px 35px rgba(102, 126, 234, 0.4)",
                                                }
                                            }}
                                        >
                                            আপডেট করুন
                                        </Button>
                                    </Link>
                                </motion.div>

                                {/* Delete Customer Button */}
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<Trash2 size={20} />}
                                        onClick={() => handleDelete(id)}
                                        sx={{
                                            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                                            color: "white",
                                            borderRadius: 3,
                                            px: 3,
                                            py: 1.5,
                                            fontWeight: 600,
                                            textTransform: "none",
                                            boxShadow: "0 8px 25px rgba(239, 68, 68, 0.3)",
                                            "&:hover": {
                                                background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                                                boxShadow: "0 12px 35px rgba(239, 68, 68, 0.4)",
                                            }
                                        }}
                                    >
                                        মুছে ফেলুন
                                    </Button>
                                </motion.div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm"
                                >
                                    <div className="p-3 bg-blue-600 rounded-lg shadow-lg">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <Typography variant="body2" className="text-blue-600 font-medium mb-1">
                                            নাম
                                        </Typography>
                                        <Typography variant="h6" className="font-bold text-blue-900">
                                            {customer.name}
                                        </Typography>
                                    </div>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm"
                                >
                                    <div className="p-3 bg-green-600 rounded-lg shadow-lg">
                                        <Phone className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <Typography variant="body2" className="text-green-600 font-medium mb-1">
                                            ফোন নম্বর
                                        </Typography>
                                        <Typography variant="h6" className="font-bold text-green-900">
                                            {customer.phone}
                                        </Typography>
                                    </div>
                                </motion.div>

                                {customer.email && (
                                    <motion.div
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm"
                                    >
                                        <div className="p-3 bg-purple-600 rounded-lg shadow-lg">
                                            <Mail className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <Typography variant="body2" className="text-purple-600 font-medium mb-1">
                                                ইমেইল
                                            </Typography>
                                            <Typography variant="h6" className="font-bold text-purple-900">
                                                {customer.email}
                                            </Typography>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Additional Info */}
                            <div className="space-y-4">
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200 shadow-sm"
                                >
                                    <div className="p-3 bg-orange-600 rounded-lg shadow-lg">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <Typography variant="body2" className="text-orange-600 font-medium mb-1">
                                            ডেলিভারি ঠিকানা
                                        </Typography>
                                        <Typography variant="h6" className="font-bold text-orange-900">
                                            {customer.deliveryAddress}
                                        </Typography>
                                    </div>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200 shadow-sm"
                                >
                                    <div className="p-3 bg-indigo-600 rounded-lg shadow-lg">
                                        <Package className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <Typography variant="body2" className="text-indigo-600 font-medium mb-3">
                                            সেবার ধরন
                                        </Typography>
                                        <div className="flex gap-2 flex-wrap">
                                            <Chip
                                                label={customer.customerType === "Business" ? "🏢 ব্যবসায়িক" : "🏠 আবাসিক"}
                                                sx={{
                                                    background: customer.customerType === "Business"
                                                        ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                                                        : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                                    color: "white",
                                                    fontWeight: 600,
                                                    borderRadius: 2,
                                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                                                }}
                                            />
                                            <Chip
                                                label={`📅 ${customer.serviceType === "Daily" ? "দৈনিক" : customer.serviceType === "Weekly" ? "সাপ্তাহিক" : "মাসিক"}`}
                                                variant="outlined"
                                                sx={{
                                                    borderColor: "#6366f1",
                                                    color: "#6366f1",
                                                    fontWeight: 600,
                                                    borderRadius: 2,
                                                    borderWidth: 2,
                                                    backgroundColor: "rgba(99, 102, 241, 0.05)"
                                                }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm"
                                >
                                    <div className="p-3 bg-gray-600 rounded-lg shadow-lg">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <Typography variant="body2" className="text-gray-600 font-medium mb-1">
                                            কাস্টমার আইডি
                                        </Typography>
                                        <Typography variant="h6" className="font-bold text-gray-900">
                                            {customer.customerId}
                                        </Typography>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </Paper>
                </motion.div>

                {/* Date Filter Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                >
                    <Paper
                        elevation={8}
                        className="p-6 mb-8 bg-gradient-to-r from-white to-indigo-50 border border-indigo-100"
                        sx={{ borderRadius: 4 }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Date Filter Type */}
                            <FormControl fullWidth>
                                <InputLabel>সময়কাল নির্বাচন করুন</InputLabel>
                                <Select
                                    value={dateFilter}
                                    onChange={(e) => handleFilterChange(e.target.value as DateFilter)}
                                    label="সময়কাল নির্বাচন করুন"
                                    sx={{ borderRadius: 2 }}
                                >
                                    <MenuItem value="all-time">সকল সময়</MenuItem>
                                    <MenuItem value="today">আজ</MenuItem>
                                    <MenuItem value="selected-day">নির্দিষ্ট দিন</MenuItem>
                                    <MenuItem value="this-month">এই মাস</MenuItem>
                                    <MenuItem value="selected-month">নির্দিষ্ট মাস</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Specific Date Picker */}
                            {dateFilter === "selected-day" && (
                                <FormControl fullWidth>
                                    <TextField
                                        type="date"
                                        label="তারিখ নির্বাচন করুন"
                                        value={selectedDate}
                                        onChange={(e) => {
                                            setSelectedDate(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ borderRadius: 2 }}
                                    />
                                </FormControl>
                            )}

                            {/* Specific Month Picker */}
                            {dateFilter === "selected-month" && (
                                <FormControl fullWidth>
                                    <TextField
                                        type="month"
                                        label="মাস নির্বাচন করুন"
                                        value={selectedMonth.substring(0, 7)} // Format to YYYY-MM
                                        onChange={(e) => {
                                            setSelectedMonth(e.target.value + '-01'); // Add day for consistency
                                            setCurrentPage(1);
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ borderRadius: 2 }}
                                    />
                                </FormControl>
                            )}

                            {/* Filter Summary */}
                            <div className="flex items-center justify-center gap-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                                <Typography variant="body2" className="text-indigo-800 font-medium text-center">
                                    ফিল্টার: {
                                        dateFilter === "all-time" ? "সকল সময়" :
                                            dateFilter === "today" ? "আজ" :
                                                dateFilter === "selected-day" ? `${new Date(selectedDate).toLocaleDateString('bn-BD')}` :
                                                    dateFilter === "this-month" ? "এই মাস" :
                                                        `${new Date(selectedMonth).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long' })}`
                                    }
                                </Typography>
                            </div>
                        </div>
                    </Paper>
                </motion.div>

                {/* Statistics Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <motion.div whileHover={{ scale: 1.02, y: -2 }}>
                            <Card elevation={8} sx={{ background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", color: "white", borderRadius: 4 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <Box>
                                            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                                                {customerStats.totalOrders}
                                            </Typography>
                                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                                মোট অর্ডার
                                            </Typography>
                                        </Box>
                                        <ShoppingCart size={48} style={{ opacity: 0.8 }} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02, y: -2 }}>
                            <Card elevation={8} sx={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "white", borderRadius: 4 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <Box>
                                            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                                                ৳{customerStats.totalRevenue.toLocaleString()}
                                            </Typography>
                                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                                মোট আয়
                                            </Typography>
                                        </Box>
                                        <DollarSign size={48} style={{ opacity: 0.8 }} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02, y: -2 }}>
                            <Card elevation={8} sx={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", color: "white", borderRadius: 4 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <Box>
                                            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                                                ৳{customerStats.paidAmount.toLocaleString()}
                                            </Typography>
                                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                                পরিশোধিত অর্থ
                                            </Typography>
                                        </Box>
                                        <CreditCard size={48} style={{ opacity: 0.8 }} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02, y: -2 }}>
                            <Card elevation={8} sx={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", color: "white", borderRadius: 4 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <Box>
                                            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                                                ৳{customerStats.totalDue.toLocaleString()}
                                            </Typography>
                                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                                মোট বকেয়া
                                            </Typography>
                                        </Box>
                                        <AlertCircle size={48} style={{ opacity: 0.8 }} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Orders Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <Paper
                        elevation={8}
                        className="overflow-hidden bg-gradient-to-r from-white to-blue-50 border border-blue-100"
                        sx={{ borderRadius: 4 }}
                    >
                        <div className="p-6 border-b border-blue-200 bg-gradient-to-r from-blue-600 to-indigo-600">
                            <Typography variant="h5" className="font-bold text-white flex items-center gap-3">
                                <Package size={24} />
                                📦 অর্ডার ইতিহাস ({customerStats.filteredOrders?.length || 0} টি অর্ডার)
                                {dateFilter !== "all-time" && (
                                    <span className="text-blue-200 text-sm">
                                        (মোট {customerOrders.length} টির মধ্যে)
                                    </span>
                                )}
                            </Typography>
                        </div>

                        {(customerStats.filteredOrders?.length || 0) === 0 ? (
                            <div className="p-8 text-center">
                                <div className="text-gray-400 mb-4">
                                    <Package size={64} className="mx-auto" />
                                </div>
                                <Typography variant="h6" className="text-gray-600 mb-2">
                                    {dateFilter === "all-time" ? "কোন অর্ডার পাওয়া যায়নি" : "এই ফিল্টারে কোন অর্ডার নেই"}
                                </Typography>
                                <Typography variant="body2" className="text-gray-500">
                                    {dateFilter === "all-time"
                                        ? "এই কাস্টমারের এখনো কোন অর্ডার নেই"
                                        : "নির্বাচিত সময়কালে কোন অর্ডার পাওয়া যায়নি"
                                    }
                                </Typography>
                            </div>
                        ) : (
                            <>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                                                <TableCell sx={{ fontWeight: 700, color: "#374151" }}>প্রোডাক্ট</TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: "#374151" }}>পরিমাণ</TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: "#374151" }}>মূল্য</TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: "#374151" }}>পেমেন্ট স্ট্যাটাস</TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: "#374151" }}>তারিখ</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {paginatedOrders.map((order, index) => (
                                                <TableRow
                                                    key={index}
                                                    component={motion.tr}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    sx={{
                                                        "&:hover": {
                                                            backgroundColor: "#f0f9ff"
                                                        }
                                                    }}
                                                >
                                                    <TableCell>
                                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                            🚰 {order.product}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                            {order.quantity} বোতল
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body1" sx={{ fontWeight: 700, color: "#059669" }}>
                                                            ৳{order.totalPrice.toLocaleString()}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={order.paymentStatus === "Paid" ? "✅ পরিশোধিত" : "⏳ বাকি"}
                                                            sx={{
                                                                backgroundColor: order.paymentStatus === "Paid" ? "#10b981" : "#f59e0b",
                                                                color: "white",
                                                                fontWeight: 600
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                                                            {order.createdAt ? formatDateDisplay(order.createdAt) : "তারিখ নেই"}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center p-6 border-t border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                        <Pagination
                                            count={totalPages}
                                            page={currentPage}
                                            onChange={handlePageChange}
                                            color="primary"
                                            size="large"
                                            showFirstButton
                                            showLastButton
                                            sx={{
                                                "& .MuiPaginationItem-root": {
                                                    borderRadius: 2,
                                                    fontWeight: 600,
                                                    "&:hover": {
                                                        backgroundColor: "#e0e7ff"
                                                    }
                                                },
                                                "& .Mui-selected": {
                                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important",
                                                    color: "white !important"
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </Paper>
                </motion.div>
            </main>
        </div>
    );
};

export default Profile;

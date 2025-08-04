/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Button, Stack, TextField, MenuItem, Card, CardContent, Pagination } from "@mui/material";
import Modal from "@mui/material/Modal";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, Filter, ArrowLeft, ExternalLink, Droplets, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useDeleteCustomerMutation, useGetCustomersQuery } from "@/redux/api/customersAPI";
import FormWrapper from "@/components/FormWrapper";
import InputWrapper from "@/components/InputWrapper";
import InputSelectWrapper from "@/components/InputSelectWrapper";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { useCreateOrderMutation } from "@/redux/api/orderApi";
import Loader from "@/components/Loader";
import NoDataFound from "@/components/NoDataFound";
import Swal from "sweetalert2";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    maxWidth: "90vw",
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "16px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    p: 0,
    outline: "none",
    overflow: "hidden",
};

const ManageCustomers = () => {
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const handleOpen = (customer: any) => setSelectedCustomer(customer);
    const handleClose = () => setSelectedCustomer(null);

    const [filters, setFilters] = useState({
        search: "",
        serviceType: "",
        customerType: ""
    });

    const [pagination, setPagination] = useState({
        page: 1,
        itemsPerPage: 10
    });

    const [deleteCustomer] = useDeleteCustomerMutation();

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
                } catch (error: any) {
                    console.error("Error deleting customer:", error);
                    toast.error(error?.message || error?.data?.message, { id: toastId });
                };
            }
        });
    };

    const { data: customers, isLoading } = useGetCustomersQuery(undefined);
    const [createOrder] = useCreateOrderMutation();

    // Instant filtering for better UX
    const filteredCustomers = useMemo(() => {
        if (!customers?.data) return [];

        return customers.data.filter((customer: any) => {
            const matchesSearch = !filters.search ||
                customer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                customer.phone.includes(filters.search);
            const matchesServiceType = !filters.serviceType ||
                customer.serviceType === filters.serviceType;
            const matchesCustomerType = !filters.customerType ||
                customer.customerType === filters.customerType;

            return matchesSearch && matchesServiceType && matchesCustomerType;
        });
    }, [customers?.data, filters.search, filters.serviceType, filters.customerType]);

    // Pagination logic
    const paginatedCustomers = useMemo(() => {
        const startIndex = (pagination.page - 1) * pagination.itemsPerPage;
        const endIndex = startIndex + pagination.itemsPerPage;
        return filteredCustomers.slice(startIndex, endIndex);
    }, [filteredCustomers, pagination.page, pagination.itemsPerPage]);

    const totalPages = Math.ceil(filteredCustomers.length / pagination.itemsPerPage);

    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPagination({
            page: 1,
            itemsPerPage: parseInt(event.target.value)
        });
    };

    const onSubmit = async (values: FieldValues) => {
        values.quantity = Number(values.quantity);
        values.totalPrice = values.quantity * values.price;
        delete values.price;

        const toastId = toast.loading("পানি দেয়া হচ্ছে...");

        try {
            const res = await createOrder(values).unwrap();
            toast.success(res?.message, { id: toastId, duration: 2000 });
            handleClose();
        } catch (error: any) {
            console.error("Error submitting form:", error);
            toast.error(error?.message || error?.data?.message, { id: toastId });
        }
    };

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
                                    <Users className="w-8 h-8" />
                                    কাস্টমার ম্যানেজমেন্ট
                                </h1>
                                <p className="text-blue-100 mt-1">গ্রাহক তালিকা ও ব্যবস্থাপনা</p>
                            </div>
                            <Link
                                href="/manage-sales"
                                className="flex items-center gap-2 text-white hover:text-blue-100 font-semibold transition-colors duration-300 group"
                            >
                                বিক্রির তালিকা
                                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>
                        </motion.div>
                    </div>
                </Container>
            </motion.div>

            {/* Main Content */}
            <Container maxWidth="xl" className="py-8">

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
                                onChange={(e) => setFilters(prev => ({
                                    ...prev,
                                    search: e.target.value
                                }))}
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
                                label="ডেলিভারির ধরণ"
                                size="medium"
                                value={filters.serviceType}
                                onChange={(e) => setFilters(prev => ({
                                    ...prev,
                                    serviceType: e.target.value
                                }))}
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
                                label="কাস্টমারের ধরণ"
                                size="medium"
                                value={filters.customerType}
                                onChange={(e) => setFilters(prev => ({
                                    ...prev,
                                    customerType: e.target.value
                                }))}
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
                        </Stack>

                        {/* Filter Results Info */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <Typography variant="body2" className="text-gray-600">
                                📊 মোট {filteredCustomers.length} জন গ্রাহক পাওয়া গেছে
                                {customers?.data && customers.data.length !== filteredCustomers.length &&
                                    ` (সর্বমোট ${customers.data.length} জনের মধ্যে)`
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
                                    <TableCell className="font-bold text-white text-lg">📱 মোবাইল</TableCell>
                                    <TableCell className="font-bold text-white text-lg">🏠 ধরণ</TableCell>
                                    <TableCell className="font-bold text-white text-lg">📅 ডেলিভারি</TableCell>
                                    <TableCell className="font-bold text-white text-lg">💰 মূল্য</TableCell>
                                    {/* <TableCell className="font-bold text-white text-lg">⚙️ একশন</TableCell> */}
                                    <TableCell className="font-bold text-white text-lg">⚙️ Profile</TableCell>
                                    <TableCell className="font-bold text-white text-lg">💧 বিক্রি</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    paginatedCustomers.map((customer: any) => (
                                        <TableRow
                                            key={customer.customerId}
                                            className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
                                        >
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-bold">
                                                            {customer.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <span className="font-semibold text-gray-800">
                                                        {customer.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 font-medium text-gray-700">
                                                {customer.phone}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Chip
                                                    label={customer.customerType === "Business" ? "🏢 ব্যবসায়িক" : "🏠 আবাসিক"}
                                                    color={customer.customerType === "Business" ? "primary" : "default"}
                                                    size="medium"
                                                    className="font-semibold"
                                                />
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Chip
                                                    label={
                                                        customer.serviceType === "Daily" ? "📅 দৈনিক" :
                                                            customer.serviceType === "Weekly" ? "📆 সাপ্তাহিক" : "🗓️ মাসিক"
                                                    }
                                                    color={
                                                        customer.serviceType === "Daily" ? "success" :
                                                            customer.serviceType === "Weekly" ? "warning" : "error"
                                                    }
                                                    size="medium"
                                                    className="font-semibold"
                                                />
                                            </TableCell>
                                            <TableCell className="py-4 font-bold text-green-600 text-lg">
                                                ৳{customer.productPrice}
                                            </TableCell>

                                            <TableCell className="py-4">
                                                <Link href={`/manage-customers/profile/${customer._id}`}>
                                                    <IconButton
                                                        size="medium"
                                                        className="bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all duration-300 hover:scale-110"
                                                        title="গ্রাহক প্রোফাইল"
                                                    >
                                                        <EyeIcon />
                                                    </IconButton>
                                                </Link>
                                            </TableCell>

                                            {/* <TableCell className="py-4">
                                                <div className="flex gap-2">
                                                    <Link href={`/manage-customers/${customer._id}`}>
                                                        <IconButton
                                                            size="medium"
                                                            className="bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all duration-300 hover:scale-110"
                                                            title="গ্রাহক সম্পাদনা করুন"
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Link>
                                                    <IconButton
                                                        size="medium"
                                                        className="bg-red-100 hover:bg-red-200 text-red-600 transition-all duration-300 hover:scale-110"
                                                        title="গ্রাহক মুছে ফেলুন"
                                                        onClick={() => {
                                                            handleDelete(customer._id);
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </div>
                                            </TableCell> */}
                                            <TableCell className="py-4">
                                                <Button
                                                    onClick={() => handleOpen(customer)}
                                                    variant="contained"
                                                    size="medium"
                                                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                                    sx={{
                                                        textTransform: 'none',
                                                        borderRadius: '12px',
                                                        padding: '8px 16px',
                                                        background: 'linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)',
                                                        '&:hover': {
                                                            background: 'linear-gradient(135deg, #0891b2 0%, #1d4ed8 100%)',
                                                            transform: 'scale(1.05)',
                                                        },
                                                    }}
                                                >
                                                    <Droplets className="w-5 h-5 mr-2" />
                                                    পানি দিন
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                        {(!customers?.data?.length && !isLoading) && <NoDataFound />}
                    </TableContainer>
                </motion.div>

                {/* Enhanced Pagination Section */}
                {filteredCustomers.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mt-8"
                    >
                        <Paper
                            elevation={8}
                            className="p-6 bg-gradient-to-r from-white to-blue-50 border border-blue-100 rounded-2xl"
                        >
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                {/* Pagination Info */}
                                <div className="flex items-center gap-4">
                                    <Typography variant="body1" className="text-gray-700 font-medium">
                                        📄 পেজ {pagination.page} of {totalPages}
                                    </Typography>
                                    <Typography variant="body2" className="text-gray-500">
                                        (মোট {filteredCustomers.length} জন গ্রাহক)
                                    </Typography>
                                </div>

                                {/* Items Per Page */}
                                <div className="flex items-center gap-3">
                                    <Typography variant="body2" className="text-gray-600">
                                        প্রতি পেজে:
                                    </Typography>
                                    <TextField
                                        select
                                        size="small"
                                        value={pagination.itemsPerPage}
                                        onChange={handleItemsPerPageChange}
                                        className="min-w-[80px]"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '8px',
                                            },
                                        }}
                                    >
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={20}>20</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                    </TextField>
                                </div>

                                {/* Pagination Controls */}
                                <Pagination
                                    count={totalPages}
                                    page={pagination.page}
                                    onChange={handlePageChange}
                                    color="primary"
                                    size="large"
                                    sx={{
                                        '& .MuiPaginationItem-root': {
                                            borderRadius: '12px',
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                backgroundColor: '#e0e7ff',
                                            },
                                            '&.Mui-selected': {
                                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                color: 'white',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #5856eb 0%, #7c3aed 100%)',
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </Paper>
                    </motion.div>
                )}

                {/* Enhanced Modal */}
                <Modal
                    open={!!selectedCustomer}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className="backdrop-blur-sm"
                >
                    <Box sx={style}>
                        <AnimatePresence>
                            {selectedCustomer && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Modal Header */}
                                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-center">
                                        <motion.div
                                            initial={{ y: -20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.4, delay: 0.1 }}
                                            className="flex flex-col items-center gap-3"
                                        >
                                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                                <Droplets className="w-8 h-8 text-white" />
                                            </div>
                                            <Typography variant="h5" className="font-bold text-white">
                                                পানি সরবরাহ করুন
                                            </Typography>
                                            <Typography className="text-blue-100">
                                                {selectedCustomer.name} এর জন্য অর্ডার তৈরি করুন
                                            </Typography>
                                        </motion.div>
                                    </div>

                                    {/* Modal Content */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.4, delay: 0.2 }}
                                        className="p-6"
                                    >
                                        <FormWrapper
                                            onSubmit={onSubmit}
                                            defaultValues={{
                                                quantity: 1,
                                                paymentStatus: "Due",
                                                customer: selectedCustomer._id,
                                                price: selectedCustomer.productPrice,
                                            }}
                                        >
                                            <div className="space-y-6">
                                                {/* Customer Info Card */}
                                                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                                                <span className="text-white font-bold text-lg">
                                                                    {selectedCustomer.name.charAt(0)}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <Typography variant="h6" className="font-bold text-gray-800">
                                                                    {selectedCustomer.name}
                                                                </Typography>
                                                                <Typography className="text-gray-600">
                                                                    📱 {selectedCustomer.phone} • 💰 ৳{selectedCustomer.productPrice}/বোতল
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                {/* Form Fields */}
                                                <div className="space-y-4">
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.4, delay: 0.3 }}
                                                    >
                                                        <InputWrapper
                                                            name="quantity"
                                                            label="পরিমাণ (বোতল)"
                                                            type="number"
                                                            required
                                                        />
                                                    </motion.div>
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.4, delay: 0.4 }}
                                                    >
                                                        <InputSelectWrapper
                                                            name="paymentStatus"
                                                            label="পেমেন্ট স্ট্যাটাস"
                                                            items={["Paid", "Due"]}
                                                            required
                                                        />
                                                    </motion.div>
                                                </div>

                                                {/* Submit Button */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.4, delay: 0.5 }}
                                                    className="pt-4"
                                                >
                                                    <Button
                                                        variant="contained"
                                                        type="submit"
                                                        fullWidth
                                                        size="large"
                                                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                                                        sx={{
                                                            textTransform: 'none',
                                                            borderRadius: '12px',
                                                            padding: '16px 0',
                                                            fontSize: '18px',
                                                            fontWeight: 'bold',
                                                            background: 'linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)',
                                                            '&:hover': {
                                                                background: 'linear-gradient(135deg, #0891b2 0%, #1d4ed8 100%)',
                                                                transform: 'scale(1.02)',
                                                            },
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Droplets className="w-6 h-6" />
                                                            পানি সরবরাহ করুন
                                                        </div>
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        </FormWrapper>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Box>
                </Modal>
            </Container>
        </div>
    );
};

export default ManageCustomers;

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
import React from "react";

const SellsHistory = () => {
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
        if (!window.confirm("Are you sure you want to update the payment status?")) return;

        const toastId = toast.loading("Updating payment status...");

        try {
            const res = await updatePaymentStatus({ id }).unwrap();
            toast.success(res?.message, { id: toastId, duration: 2000 });
        } catch (error: any) {
            console.error("Error updating payment status:", error);
            toast.error(error?.message || error?.data?.message, { id: toastId });
        }
    };

    const handleDeleteOrder = async (id: string) => {

        if (!window.confirm("Are you sure you want to delete this order?")) return;

        const toastId = toast.loading("Deleting order...");
        try {
            const res = await deleteOrder({ id }).unwrap();
            toast.success(res?.message, { id: toastId, duration: 2000 });
        } catch (error: any) {
            console.error("Error deleting order:", error);
            toast.error(error?.message || error?.data?.message, { id: toastId });
        }
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
                <Typography variant="h5" className="font-bold">
                    Sales History
                </Typography>
            </Box>

            {/* Add Filter Section */}
            <Paper className="p-4 mb-4">
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                        label="Search"
                        size="small"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        placeholder="Search by name or phone"
                        className="min-w-[200px]"
                    />
                    <TextField
                        select
                        label="Customer Type"
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
                        label="Service Type"
                        size="small"
                        value={filters.serviceType}
                        onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                        className="min-w-[150px]"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Daily">Daily</MenuItem>
                        <MenuItem value="Weekly">Weekly</MenuItem>
                        <MenuItem value="Monthly">Monthly</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="Payment Status"
                        size="small"
                        value={filters.paymentStatus}
                        onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
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
                            <TableCell className="font-bold">Customer Name</TableCell>
                            <TableCell className="font-bold">Quantity</TableCell>
                            <TableCell className="font-bold">Total Price</TableCell>
                            <TableCell className="font-bold">Payment Status</TableCell>
                            <TableCell className="font-bold">Service Type</TableCell>
                            <TableCell className="font-bold">Customer Type</TableCell>
                            <TableCell className="font-bold">Actions</TableCell>
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
            <Box className="my-5">
                <Link href="/" className="text-blue-600 hover:text-blue-800">← Go back</Link>
            </Box>
        </Container>
    );
};

export default SellsHistory;

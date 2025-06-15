/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Button, Stack, TextField, MenuItem } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import Modal from "@mui/material/Modal";
import Link from "next/link";
import { useGetCustomersQuery } from "@/redux/api/customersAPI";
import FormWrapper from "@/components/FormWrapper";
import InputWrapper from "@/components/InputWrapper";
import InputSelectWrapper from "@/components/InputSelectWrapper";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { useCreateOrderMutation } from "@/redux/api/orderApi";
import Loader from "@/components/Loader";
import NoDataFound from "@/components/NoDataFound";

const style = {
    position: "absolute",
    top: "20%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "1px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
    outline: "none",
};

const ManageCustomers = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [filters, setFilters] = React.useState({
        search: "",
        serviceType: "",
        customerType: ""
    });

    const { data: customers, isLoading } = useGetCustomersQuery(undefined);
    const [createOrder] = useCreateOrderMutation();

    const onSubmit = async (values: FieldValues) => {
        values.quantity = Number(values.quantity);
        values.totalPrice = values.quantity * values.price;
        delete values.price;

        const toastId = toast.loading("Providing water...");

        try {
            const res = await createOrder(values).unwrap();
            toast.success(res?.message, { id: toastId, duration: 2000 });
            handleClose();
        } catch (error: any) {
            console.error("Error submitting form:", error);
            toast.error(error?.message || error?.data?.message, { id: toastId });
        }
    };

    const filteredCustomers = React.useMemo(() => {
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
    }, [customers?.data, filters]);

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
                    ← Go back
                </Link>
                <Typography variant="h5" className="font-bold hidden md:block">
                    Manage Customers
                </Typography>
                <Link
                    href="/manage-sales"
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                    See All Sales
                </Link>
            </Box>

            <Paper className="p-4 mb-4">
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                        label="Search"
                        size="small"
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({
                            ...prev,
                            search: e.target.value
                        }))}
                        placeholder="Search by name or phone"
                        className="min-w-[200px]"
                    />
                    <TextField
                        select
                        label="Service Type"
                        size="small"
                        value={filters.serviceType}
                        onChange={(e) => setFilters(prev => ({
                            ...prev,
                            serviceType: e.target.value
                        }))}
                        className="min-w-[150px]"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Daily">Daily</MenuItem>
                        <MenuItem value="Weekly">Weekly</MenuItem>
                        <MenuItem value="Monthly">Monthly</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="Customer Type"
                        size="small"
                        value={filters.customerType}
                        onChange={(e) => setFilters(prev => ({
                            ...prev,
                            customerType: e.target.value
                        }))}
                        className="min-w-[150px]"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Residential">Residential</MenuItem>
                        <MenuItem value="Business">Business</MenuItem>
                    </TextField>
                </Stack>
            </Paper>

            <TableContainer component={Paper} className="shadow-md">
                <Table>
                    <TableHead className="bg-gray-100">
                        <TableRow>
                            <TableCell className="font-bold">Name</TableCell>
                            <TableCell className="font-bold">Phone</TableCell>
                            <TableCell className="font-bold">Customer Type</TableCell>
                            <TableCell className="font-bold">Service Type</TableCell>
                            <TableCell className="font-bold">Price</TableCell>
                            <TableCell className="font-bold">Actions</TableCell>
                            <TableCell className="font-bold">Sell</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {
                            filteredCustomers.map((customer: any) => (
                                <TableRow key={customer.customerId} className="hover:bg-gray-50">
                                    <TableCell>{customer.name}</TableCell>
                                    <TableCell>{customer.phone}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={customer.customerType}
                                            color={customer.customerType === "Business" ? "primary" : "default"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={customer.serviceType}
                                            color={
                                                customer.serviceType === "Daily" ? "success" :
                                                    customer.serviceType === "Weekly" ? "warning" : "error"
                                            }
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>৳{customer.productPrice}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            className="mr-2"
                                            onClick={() => {
                                                // Handle edit
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => {
                                                // Handle delete
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={handleOpen}>
                                            <WaterDropIcon />
                                        </Button>
                                        <Modal
                                            open={open}
                                            onClose={handleClose}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-description"
                                        >
                                            <Box sx={style}>
                                                <FormWrapper
                                                    onSubmit={onSubmit}
                                                    defaultValues={{
                                                        quantity: 1,
                                                        paymentStatus: "Due",
                                                        customer: customer._id,
                                                        price: customer.productPrice,
                                                    }}
                                                >
                                                    <Typography variant="h6" component="h2">
                                                        Provide Water
                                                    </Typography>
                                                    <Box className="flex flex-col gap-4 my-4">
                                                        <InputWrapper
                                                            name="quantity"
                                                            label="Quantity"
                                                            type="number"
                                                            required
                                                        />
                                                        <InputSelectWrapper
                                                            name="paymentStatus"
                                                            label="Payment Status"
                                                            items={["Paid", "Due"]}
                                                            required
                                                        />
                                                    </Box>
                                                    <Button
                                                        variant="contained"
                                                        type="submit"
                                                        color="primary"
                                                        className="mt-4"
                                                    >
                                                        Provide
                                                    </Button>
                                                </FormWrapper>
                                            </Box>
                                        </Modal>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                {(!customers?.data?.length && !isLoading) && <NoDataFound />}
            </TableContainer>
        </Container>
    );
};

export default ManageCustomers;

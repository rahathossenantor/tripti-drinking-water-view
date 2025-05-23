/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { FieldValues } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
import FormWrapper from "@/components/FormWrapper";
import InputWrapper from "@/components/InputWrapper";
import InputSelectWrapper from "@/components/InputSelectWrapper";
import Link from "next/link";
import { useCreateCustomerMutation } from "@/redux/api/customersAPI";
import { toast } from "sonner";

// const customerSchema = z.object({
//     name: z.string().min(2, "Name must be be given"),
//     email: z.string().optional(),
//     phone: z.string().min(11, "Phone number must be at least 11 digits"),
//     productPrice: z.string(),
//     deliveryAddress: z.string().min(5, "Address must be given"),
//     customerType: z.enum(["Residential", "Business"]),
//     serviceType: z.enum(["Daily", "Weekly", "Monthly"])
// });

const AddCustomer = () => {
    const [createCustomer] = useCreateCustomerMutation();

    const onSubmit = async (values: FieldValues) => {
        values.productPrice = Number(values.productPrice);
        const toastId = toast.loading("Creating customer...");

        try {
            const res = await createCustomer(values).unwrap();
            toast.success(res?.message, { id: toastId, duration: 2000 });
        } catch (error: any) {
            console.error("Error submitting form:", error);
            toast.error(error?.message || error?.data?.message, { id: toastId });
        }
    };

    return (
        <Container>
            <Box className="my-5">
                <Link href="/">← Go back</Link>
            </Box>
            <Container className="py-8 border-2 border-gray-300 rounded-lg">
                <Stack className="items-center justify-center">
                    <Box className="w-full border rounded-lg p-5">
                        <Typography variant="h5" className="font-bold text-center">
                            Add New Customer
                        </Typography>

                        <Box
                            sx={{
                                mt: 2
                            }}
                        >
                            <FormWrapper
                                onSubmit={onSubmit}
                                // resolver={zodResolver(customerSchema)}
                                defaultValues={{
                                    name: "",
                                    email: "",
                                    phone: "",
                                    productPrice: 0,
                                    deliveryAddress: "",
                                    customerType: "Residential",
                                    serviceType: "Daily"
                                }}
                            >
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputWrapper
                                            label="Full Name"
                                            name="name"
                                            required
                                        />
                                        <InputWrapper
                                            label="Email"
                                            type="email"
                                            name="email"
                                        />
                                        <InputWrapper
                                            label="Phone Number"
                                            name="phone"
                                            type="number"
                                            required
                                        />
                                        <InputWrapper
                                            label="Product Price"
                                            type="number"
                                            name="productPrice"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <InputWrapper
                                            label="Delivery Address"
                                            name="deliveryAddress"
                                            multiline
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputSelectWrapper
                                            name="customerType"
                                            label="Customer Type"
                                            items={["Residential", "Business"]}
                                            required
                                        >
                                        </InputSelectWrapper>
                                        <InputSelectWrapper
                                            label="Service Type"
                                            name="serviceType"
                                            required
                                            items={["Daily", "Weekly", "Monthly"]}
                                        >
                                        </InputSelectWrapper>
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        className="bg-blue-600 hover:bg-blue-700 py-3 text-lg"
                                    >
                                        Add Customer
                                    </Button>
                                </div>
                            </FormWrapper>
                        </Box>
                    </Box>
                </Stack>
            </Container>
        </Container>
    );
};

export default AddCustomer;

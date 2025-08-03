/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button, Container, Typography, Card, CardContent } from "@mui/material";
import { FieldValues } from "react-hook-form";
import { motion } from "framer-motion";
import { UserPlus, ArrowLeft, Users, Phone, Building } from "lucide-react";
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

        if (!values.email) {
            delete values.email;
        };

        if (!values.deliveryAddress) {
            values.deliveryAddress = "N/A";
        }

        try {
            const res = await createCustomer(values).unwrap();
            toast.success(res?.message, { id: toastId, duration: 2000 });
        } catch (error: any) {
            console.error("Error submitting form:", error);
            toast.error(error?.message || error?.data?.message, { id: toastId });
        }
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
                <Container maxWidth="lg">
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
                                    <UserPlus className="w-8 h-8" />
                                    নতুন কাস্টমার যোগ করুন
                                </h1>
                                <p className="text-blue-100 mt-1">গ্রাহক তথ্য পূরণ করুন</p>
                            </div>
                            <div className="w-20"></div> {/* Spacer for centering */}
                        </motion.div>
                    </div>
                </Container>
            </motion.div>

            {/* Main Content */}
            <Container maxWidth="md" className="py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <Card
                        elevation={12}
                        className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <CardContent className="p-0">
                            {/* Card Header */}
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-center">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                        <Users className="w-8 h-8 text-white" />
                                    </div>
                                    <Typography variant="h4" className="font-bold text-white">
                                        কাস্টমার তথ্য ফর্ম
                                    </Typography>
                                    <Typography className="text-blue-100">
                                        নিচের ফর্মটি পূরণ করে নতুন গ্রাহক যোগ করুন
                                    </Typography>
                                </motion.div>
                            </div>

                            {/* Form Content */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="p-8"
                            >
                                <FormWrapper
                                    onSubmit={onSubmit}
                                    // resolver={zodResolver(customerSchema)}
                                    defaultValues={{
                                        name: "",
                                        phone: "",
                                        productPrice: 0,
                                        deliveryAddress: "",
                                        customerType: "Residential",
                                        serviceType: "Daily"
                                    }}
                                >
                                    <div className="space-y-8">
                                        {/* Personal Information Section */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: 0.7 }}
                                            className="space-y-6"
                                        >
                                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <Users className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <Typography variant="h6" className="font-semibold text-gray-800">
                                                    ব্যক্তিগত তথ্য
                                                </Typography>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.5, delay: 0.8 }}
                                                >
                                                    <InputWrapper
                                                        label="পুরো নাম"
                                                        name="name"
                                                        required
                                                    />
                                                </motion.div>
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.5, delay: 0.9 }}
                                                >
                                                    <InputWrapper
                                                        label="ইমেইল (যদি থাকে)"
                                                        type="email"
                                                        name="email"
                                                    />
                                                </motion.div>
                                            </div>
                                        </motion.div>

                                        {/* Contact Information Section */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: 1.0 }}
                                            className="space-y-6"
                                        >
                                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                                <div className="p-2 bg-green-100 rounded-lg">
                                                    <Phone className="w-5 h-5 text-green-600" />
                                                </div>
                                                <Typography variant="h6" className="font-semibold text-gray-800">
                                                    যোগাযোগের তথ্য
                                                </Typography>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.5, delay: 1.1 }}
                                                >
                                                    <InputWrapper
                                                        label="মোবাইল নাম্বার"
                                                        name="phone"
                                                        type="number"
                                                        required
                                                    />
                                                </motion.div>
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.5, delay: 1.2 }}
                                                >
                                                    <InputWrapper
                                                        label="প্রতি বোতলের মূল্য"
                                                        type="number"
                                                        name="productPrice"
                                                        required
                                                    />
                                                </motion.div>
                                            </div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 1.3 }}
                                            >
                                                <InputWrapper
                                                    label="ঠিকানা"
                                                    name="deliveryAddress"
                                                    multiline
                                                    required
                                                />
                                            </motion.div>
                                        </motion.div>

                                        {/* Service Information Section */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: 1.4 }}
                                            className="space-y-6"
                                        >
                                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <Building className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <Typography variant="h6" className="font-semibold text-gray-800">
                                                    সেবার তথ্য
                                                </Typography>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.5, delay: 1.5 }}
                                                >
                                                    <InputSelectWrapper
                                                        name="customerType"
                                                        label="কাস্টমারের ধরণ"
                                                        items={["Residential", "Business"]}
                                                        required
                                                    />
                                                </motion.div>
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.5, delay: 1.6 }}
                                                >
                                                    <InputSelectWrapper
                                                        label="ডেলিভারির ধরণ"
                                                        name="serviceType"
                                                        required
                                                        items={["Daily", "Weekly", "Monthly"]}
                                                    />
                                                </motion.div>
                                            </div>
                                        </motion.div>

                                        {/* Submit Button */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 1.7 }}
                                            className="pt-6"
                                        >
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                fullWidth
                                                size="large"
                                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                                                sx={{
                                                    textTransform: 'none',
                                                    borderRadius: '12px',
                                                    padding: '16px 0',
                                                    fontSize: '18px',
                                                    fontWeight: 'bold',
                                                    background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                                                        transform: 'scale(1.02)',
                                                    },
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <UserPlus className="w-6 h-6" />
                                                    গ্রাহক যোগ করুন
                                                </div>
                                            </Button>
                                        </motion.div>
                                    </div>
                                </FormWrapper>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </Container>
        </div>
    );
};

export default AddCustomer;

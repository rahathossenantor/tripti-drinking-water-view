/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loader from "@/components/Loader";
import { useGetOrdersQuery } from "@/redux/api/orderApi";
import Link from "next/link";
import React from "react";
import { TextField, MenuItem, Paper, Typography, Stack, Card, CardContent, Chip } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, ShoppingCart, CreditCard, Droplets, Calendar } from "lucide-react";

const Dashboard = () => {
  const { data: orders, isFetching } = useGetOrdersQuery(undefined);

  // Date filter states
  const [filterType, setFilterType] = React.useState<string>("all");
  const [selectedDate, setSelectedDate] = React.useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedMonth, setSelectedMonth] = React.useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  // Helper function to filter orders based on date
  const getFilteredOrders = () => {
    if (!orders?.data) return [];

    const today = new Date();
    const currentMonth = today.toISOString().slice(0, 7);
    const currentDate = today.toISOString().split('T')[0];

    switch (filterType) {
      case "today":
        return orders.data.filter((order: any) => {
          const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
          return orderDate === currentDate;
        });

      case "selected-date":
        return orders.data.filter((order: any) => {
          const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
          return orderDate === selectedDate;
        });

      case "current-month":
        return orders.data.filter((order: any) => {
          const orderMonth = new Date(order.createdAt).toISOString().slice(0, 7);
          return orderMonth === currentMonth;
        });

      case "selected-month":
        return orders.data.filter((order: any) => {
          const orderMonth = new Date(order.createdAt).toISOString().slice(0, 7);
          return orderMonth === selectedMonth;
        });

      default: // "all"
        return orders.data;
    }
  };

  const filteredOrders = getFilteredOrders();
  const totalOrders = filteredOrders.length;

  let totalPaid: any, totalUnpaid: any;

  if (!isFetching) {
    totalPaid = filteredOrders?.filter((order: any) => {
      return order.paymentStatus === "Paid";
    })?.reduce((acc: number, order: any) => acc + order.totalPrice, 0) || 0;

    totalUnpaid = filteredOrders?.filter((order: any) => {
      return order.paymentStatus === "Due";
    })?.reduce((acc: number, order: any) => acc + order.totalPrice, 0) || 0;
  };

  const totalBottles = filteredOrders?.reduce((acc: number, order: any) => acc + order.quantity, 0) || 0;
  const totalSales = totalPaid + totalUnpaid;

  // Helper function to get filter description
  const getFilterDescription = () => {
    switch (filterType) {
      case "today":
        return "আজকের";
      case "selected-date":
        return `${new Date(selectedDate).toLocaleDateString('bn-BD')} তারিখের`;
      case "current-month":
        return "এই মাসের";
      case "selected-month":
        return `${new Date(selectedMonth + '-01').toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' })} মাসের`;
      default:
        return "সব সময়ের";
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      {/* Modern Header with Gradient */}
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
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              💧 Tripti Drinking Water
            </h1>
            <p className="text-blue-100 text-lg">আধুনিক ড্যাশবোর্ড ও বিক্রয় ব্যবস্থাপনা</p>
          </motion.div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Date Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Paper
            elevation={8}
            className="p-6 mb-8 bg-gradient-to-r from-white to-blue-50 border border-blue-100 rounded-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-indigo-600" />
              <Typography variant="h5" className="font-bold text-gray-800">
                📊 রিপোর্ট ফিল্টার
              </Typography>
            </div>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
              <TextField
                select
                label="রিপোর্টের ধরণ"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="min-w-[220px]"
                size="medium"
                variant="outlined"
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
              >
                <MenuItem value="all">🌐 সব সময়ের</MenuItem>
                <MenuItem value="today">📅 আজকের</MenuItem>
                <MenuItem value="selected-date">🎯 নির্দিষ্ট তারিখের</MenuItem>
                <MenuItem value="current-month">📆 এই মাসের</MenuItem>
                <MenuItem value="selected-month">🗓️ নির্দিষ্ট মাসের</MenuItem>
              </TextField>

              <AnimatePresence>
                {filterType === "selected-date" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TextField
                      type="date"
                      label="তারিখ নির্বাচন করুন"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      size="medium"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        },
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {filterType === "selected-month" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TextField
                      type="month"
                      label="মাস নির্বাচন করুন"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      size="medium"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        },
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </Stack>
          </Paper>
        </motion.div>

        {/* Enhanced Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-10"
        >
          <div className="grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/add-customer">
                <button className="w-full py-6 px-4 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:from-green-600 hover:to-emerald-700 cursor-pointer">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">👤</span>
                    ক্রেতা যোগ করুন
                  </div>
                </button>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/manage-customers">
                <button className="w-full py-6 px-4 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-red-500 to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:from-red-600 hover:to-pink-700 cursor-pointer">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">👥</span>
                    কাস্টমার ব্যবস্থাপনা
                  </div>
                </button>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/manage-sales">
                <button className="w-full py-6 px-4 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:from-blue-600 hover:to-indigo-700 cursor-pointer">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">📊</span>
                    সেলস ব্যবস্থাপনা
                  </div>
                </button>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/">
                <button className="w-full py-6 px-4 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-yellow-500 to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:from-yellow-600 hover:to-orange-700 cursor-pointer">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">🔄</span>
                    প্রোডাক্ট আপডেট
                  </div>
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <div>
          {
            isFetching ? (
              <div className="text-center py-16">
                <Loader />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-center mb-8"
                >
                  <Typography variant="h4" className="font-bold text-gray-800 mb-2">
                    {getFilterDescription()} পরিসংখ্যান
                  </Typography>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                  {/* Total Orders Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    className="group"
                  >
                    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
                      <CardContent className="p-6 text-center">
                        <div className="flex items-center justify-center mb-4">
                          <div className="p-3 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full">
                            <ShoppingCart className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <Typography className="text-lg font-semibold text-gray-700 mb-2">
                          মোট অর্ডার
                        </Typography>
                        <Typography className="text-3xl font-bold text-gray-800">
                          {totalOrders} <span className="text-lg">টি</span>
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Total Sales Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    className="group"
                  >
                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
                      <CardContent className="p-6 text-center">
                        <div className="flex items-center justify-center mb-4">
                          <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full">
                            <TrendingUp className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <Typography className="text-lg font-semibold text-purple-700 mb-2">
                          মোট বিক্রয়
                        </Typography>
                        <Typography className="text-3xl font-bold text-purple-800">
                          ৳{totalSales}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Paid Amount Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    className="group"
                  >
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
                      <CardContent className="p-6 text-center">
                        <div className="flex items-center justify-center mb-4">
                          <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full">
                            <CreditCard className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <Typography className="text-lg font-semibold text-green-700 mb-2">
                          পরিশোধিত
                        </Typography>
                        <Typography className="text-3xl font-bold text-green-800">
                          ৳{totalPaid}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Unpaid Amount Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    className="group"
                  >
                    <Card className="bg-gradient-to-br from-red-50 to-red-100 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
                      <CardContent className="p-6 text-center">
                        <div className="flex items-center justify-center mb-4">
                          <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full">
                            <TrendingDown className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <Typography className="text-lg font-semibold text-red-700 mb-2">
                          অপরিশোধিত
                        </Typography>
                        <Typography className="text-3xl font-bold text-red-800">
                          ৳{totalUnpaid}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Total Bottles Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.1 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    className="group"
                  >
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
                      <CardContent className="p-6 text-center">
                        <div className="flex items-center justify-center mb-4">
                          <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
                            <Droplets className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <Typography className="text-lg font-semibold text-blue-700 mb-2">
                          বিক্রিত বোতল
                        </Typography>
                        <Typography className="text-3xl font-bold text-blue-800">
                          {totalBottles} <span className="text-lg">টি</span>
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            )
          }
        </div>

        {/* Enhanced Recent Orders Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="bg-white rounded-2xl shadow-xl mt-8 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {getFilterDescription()} রিসেন্ট অর্ডার সমূহ
              </h3>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-4">
              <AnimatePresence>
                {
                  filteredOrders?.slice(-10)?.reverse()?.map((order: any, idx: number) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {order.customer.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">
                            {order.customer.name}
                            <span className="text-sm text-gray-500 ml-2">
                              #{order.customer.customerId}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Droplets className="w-4 h-4" />
                            20L বোতল - {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Chip
                          label={order.paymentStatus}
                          color={order.paymentStatus === "Paid" ? "success" : "error"}
                          variant="filled"
                          className="font-semibold"
                        />
                        <Chip
                          label={`৳${order.totalPrice}`}
                          variant="outlined"
                          className="font-bold border-2"
                          style={{
                            borderColor: order.paymentStatus === "Paid" ? "#10b981" : "#ef4444",
                            color: order.paymentStatus === "Paid" ? "#10b981" : "#ef4444"
                          }}
                        />
                        <Chip
                          label={`${order.quantity} বোতল`}
                          variant="outlined"
                          className="font-semibold border-blue-300 text-blue-600"
                        />
                      </div>
                    </motion.div>
                  ))
                }
              </AnimatePresence>

              {filteredOrders?.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-xl font-semibold">
                    এই ফিল্টারে কোন অর্ডার পাওয়া যায়নি!
                  </p>
                  <p className="text-gray-400 mt-2">
                    অন্য তারিখ বা সময়কাল নির্বাচন করে দেখুন
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;

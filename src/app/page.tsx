/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loader from "@/components/Loader";
import { useGetOrdersQuery } from "@/redux/api/orderApi";
import Link from "next/link";

const Dashboard = () => {
  const { data: orders, isFetching } = useGetOrdersQuery(undefined);

  const totalOrders = orders?.data?.length || 0;

  let totalPaid: any, totalUnpaid: any;

  if (!isFetching) {
    totalPaid = orders?.data?.filter((order: any) => {
      return order.paymentStatus === "Paid";
    })?.reduce((acc: number, order: any) => acc + order.totalPrice, 0) || 0;

    totalUnpaid = orders?.data?.filter((order: any) => {
      return order.paymentStatus === "Due";
    })?.reduce((acc: number, order: any) => acc + order.totalPrice, 0) || 0;
  };

  const totalBottles = orders?.data?.reduce((acc: number, order: any) => acc + order.quantity, 0) || 0;

  return (
    <div className="bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 text-center">Tripti Drinking Water</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 mt-0">
          <div className="grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2 gap-5 raleway">
            <Link href="/add-customer">
              <button className="w-full py-5 rounded-xl text-[19px] font-semibold text-white bg-green-500 cursor-pointer">ক্রেতা যোগ করুন</button>
            </Link>
            <Link href="/manage-customers">
              <button className="w-full py-5 rounded-xl text-[19px] font-semibold text-white bg-red-500 cursor-pointer">কাস্টমার ম্যানেজমেন্ট</button>
            </Link>
            <Link href="/manage-sales">
              <button className="w-full py-5 rounded-xl text-[19px] font-semibold text-white bg-blue-500 cursor-pointer">সেলস ম্যানেজমেন্ট</button>
            </Link>
            <Link href="/dashboard/manage-students"><button className="w-full py-5 rounded-xl text-[19px] font-semibold text-white bg-yellow-500">Update Product</button></Link>
          </div>
        </div>

        <div>
          {
            isFetching ? (
              <div className="text-center py-8">
                <Loader />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">সর্বমোট অর্ডার</h3>
                  <p className="text-2xl font-bold text-gray-800">{totalOrders} টি</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">সর্বমোট পরিশোধিত</h3>
                  <p className="text-2xl font-bold text-green-600">৳{totalPaid}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">সর্বমোট অপরিশোধিত</h3>
                  <p className="text-2xl font-bold text-red-600">৳{totalUnpaid}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">সর্বমোট বিক্রিত বোতল</h3>
                  <p className="text-2xl font-bold text-blue-600">{totalBottles} টি</p>
                </div>
              </div>
            )
          }
        </div>

        <div className="bg-white rounded-lg shadow mt-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">রিসেন্ট অর্ডার সমূহ</h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              {
                orders?.data?.slice(0, 10)?.map((order: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customer.name} #{order.customer.customerId}</p>
                      <p className="text-sm text-gray-500">20L বোতল</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {
                        order.paymentStatus === "Paid" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {order.paymentStatus}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {order.paymentStatus}
                          </span>
                        )
                      }
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ৳{order.totalPrice}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {order.quantity} Bottles
                      </span>
                    </div>
                  </div>
                ))
              }
              {
                orders?.data?.length === 0 && (
                  <p className="text-gray-500 text-center">কোন তথ্য পাওয়া যায়নি!</p>
                )
              }
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

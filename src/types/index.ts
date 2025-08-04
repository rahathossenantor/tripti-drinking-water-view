export type TProduct = {
    name: string;
    price: number;
    weight: number;
};

export type TCustomer = {
    customerId: string;
    name: string;
    email?: string;
    phone: string;
    deliveryAddress: string;
    customerType: "Residential" | "Business";
    serviceType: "Daily" | "Weekly" | "Monthly";
};

export type TOrder = {
    paymentStatus: "Due" | "Paid";
    product: string;
    customer: string;
    quantity: number;
    totalPrice: number;
    createdAt?: string;
};

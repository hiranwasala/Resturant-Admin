import mongoose from "mongoose";

export const orders = [
    {
        user: new mongoose.Types.ObjectId("60c72b2f9b1d4c4bbcde3e88"),
        orderItems: [
            {
                name: "Sample Product",
                qty: 2,
                price: 29.99,
                image: "sample-image.jpg",
                product: new mongoose.Types.ObjectId("60c72b3a9b1d4c4bbcde3e89")
            }
        ],
        deliveryAddress: {
            address1: "123 Main St",
            address2: "Apt 4B",
            city: "Sample City",
            landMark: "Near Sample Park"
        },
        instruction: "Leave at the door",
        paymentMethod: "PayPal",
        paymentResult: {
            id: "PAYID-123456789",
            status: "COMPLETED",
            update_time: "2024-06-05T12:00:00Z",
            email_address: "buyer@example.com"
        },
        itemsPrice: 59.98,
        deliveryFee: 5.00,
        serviceFee: 2.00,
        totalPrice: 66.98,
        isPaid: true,
        paidAt: new Date("2024-06-05T12:00:00Z"),
        isDelivered: false,
        deliveredAt: null,
        createdAt: new Date("2024-06-05T11:00:00Z"),
        updatedAt: new Date("2024-06-05T11:00:00Z")
    }
];


import { NextRequest, NextResponse } from "next/server";

function generateOrderId(): string {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `ORD-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerDetails, paymentMethod } = body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "`items` must be a non-empty array of { id, quantity, price }.",
        },
        { status: 400 }
      );
    }

    const invalidItem = items.find(
      (item: any) =>
        !item ||
        typeof item.id === "undefined" ||
        typeof item.quantity !== "number" ||
        item.quantity <= 0 ||
        typeof item.price !== "number" ||
        item.price < 0
    );

    if (invalidItem) {
      return NextResponse.json(
        {
          status: "error",
          message: "Each item requires a valid `id`, positive `quantity`, and non-negative `price`.",
        },
        { status: 400 }
      );
    }

    if (
      !customerDetails ||
      !customerDetails.name ||
      !customerDetails.address ||
      !customerDetails.phone
    ) {
      return NextResponse.json(
        {
          status: "error",
          message: "`customerDetails` requires `name`, `address`, and `phone`.",
        },
        { status: 400 }
      );
    }

    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const order = {
      orderId: generateOrderId(),
      timestamp: new Date().toISOString(),
      items,
      customerDetails,
      paymentMethod: paymentMethod || "COD",
      totalAmount,
      deliveryETA: "20-30 mins",
      status: "confirmed",
    };

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Invalid JSON request body" },
      { status: 400 }
    );
  }
}

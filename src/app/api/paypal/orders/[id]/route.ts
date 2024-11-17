import { generateAccessToken } from "@/lib/utils/orders";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accessToken = await generateAccessToken();
    const orderId = params.id;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const url = `${process.env.PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("PayPal API Error:", errorData);
      return NextResponse.json(
        { error: "PayPal API request failed", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

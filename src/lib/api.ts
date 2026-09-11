import type { Product } from "@/types";
import { PRODUCTS as FALLBACK_PRODUCTS } from "@/data/products";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
}

export interface OrderItemPayload {
  id: string;
  quantity: number;
  price: number;
}

export interface CreateOrderPayload {
  items: OrderItemPayload[];
  customerDetails: CustomerDetails;
  paymentMethod?: string;
}

export interface OrderResponse {
  orderId: string;
  timestamp: string;
  items: OrderItemPayload[];
  customerDetails: CustomerDetails;
  paymentMethod: string;
  totalAmount: number;
  deliveryETA: string;
  status: string;
}

export async function checkBackendStatus(): Promise<{ online: boolean; message?: string }> {
  try {
    const healthUrl = API_BASE_URL ? `${API_BASE_URL}/` : "/api";
    const res = await fetch(healthUrl, { method: "GET", cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return { online: true, message: data.message };
    }
    return { online: false };
  } catch {
    return { online: false };
  }
}

export async function fetchProducts(category?: string, subCategory?: string): Promise<{ products: Product[]; isLive: boolean }> {
  try {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (subCategory) params.append("subCategory", subCategory);

    const url = `${API_BASE_URL}/api/products${params.toString() ? `?${params.toString()}` : ""}`;
    const res = await fetch(url, { method: "GET", cache: "no-store" });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    return { products: data.products ?? [], isLive: true };
  } catch (error) {
    console.warn("Backend API unavailable, using local product fallback:", error);
    let filtered = FALLBACK_PRODUCTS;
    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (subCategory) {
      filtered = filtered.filter((p) => p.subCategory === subCategory);
    }
    return { products: filtered, isLive: false };
  }
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
  const url = `${API_BASE_URL}/api/orders`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Order creation failed with status ${res.status}`);
  }

  return res.json();
}

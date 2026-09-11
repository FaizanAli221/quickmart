import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/data/products";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const subCategory = searchParams.get("subCategory");

  let filtered = PRODUCTS;

  if (category) {
    const catLower = category.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.category.toLowerCase() === catLower ||
        product.category.toLowerCase().replace(/[^a-z]/g, "") === catLower.replace(/[^a-z]/g, "")
    );
  }

  if (subCategory) {
    const subCatLower = subCategory.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.subCategory &&
        product.subCategory.toLowerCase() === subCatLower
    );
  }

  return NextResponse.json({
    count: filtered.length,
    products: filtered,
  });
}

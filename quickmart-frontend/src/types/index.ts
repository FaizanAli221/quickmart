export interface Product {
  id: string;
  name: string;
  unit: string; // e.g. "1 Litre", "500g"
  price: number; // PKR
  image: string;
  category: string; // category id
  subCategory: string; // sub-category id
  stock: number; // total stock available for this product
}

export interface CartItem {
  id: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  maxStock: number;
  image: string;
}

export interface SubCategory {
  id: string;
  label: string;
}

export interface Category {
  id: string;
  label: string;
  subCategories: SubCategory[];
}

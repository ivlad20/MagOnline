// Mirrors the backend's `Product` record (server/.../model/Product.java)
export interface Product {
  id: number;
  seller_id: number;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  stock: number;
}

// Mirrors the backend's `ProductPlusImages` record — used by /products/random/{count}
export interface ProductPlusImages {
  id: number;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  stock: number;
  mainImage: string | null;
  images: string[];
}

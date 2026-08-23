// lib/api.ts (sau types.ts, oriunde ai definit Product / ProductPlusImages)

export interface Product {
  id: number;
  seller_id: number;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  stock: number;
  title: string;
}

export interface ProductPlusImages {
  id: number;
  brand: string;
  category: string;
  title: string;
  price: number;
  mainImage: string | null;
  images: string[];
}

// types/product.ts — adaugă lângă Product / ProductPlusImages
export interface ProductDetail extends Product {
  mainImage: string | null;
  images: string[];
}

export interface ProductShowcaseProps {
  product: {
    title: string;
    brand: string;
    subcategory: string;
    description: string;
    price: number;
    stock: number;
    mainImage: string | null;
    images: string[];
    rating?: number;
    reviewCount?: number;
  };
}
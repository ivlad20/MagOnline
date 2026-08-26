
// full definition of product model

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

// definition of model product + productImages

export interface ProductPlusImages extends Product {
  mainImage: string | null;
  images: string[];
}

// definition of model Product + mainImage for ProductCard excluding stock, description, subcategory, seller_id

export interface ProductCardInterface extends Pick<Product, "id" | "brand" | "category" | "title" | "price"> {
  mainImage: string | null;
}

//interface for product page which requires besides almost all types from Product also requires ratings and images

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
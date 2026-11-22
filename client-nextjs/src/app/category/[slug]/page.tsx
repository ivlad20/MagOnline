import ListingLayout from "@/components/ListingLayout";
import { type Product } from "@/components/ProductCard";
import { apiFetch } from "@/lib/api";
import { CATEGORIES } from "@/lib/categories";

interface ApiProduct {
  id: number;
  brand: string;
  category: string;
  title: string;
  price: number;
  mainImage: string | null;
  images: string[];
}

function mapProduct(p: ApiProduct): Product {
  return { id: p.id, mainImage: p.mainImage, title: p.title, category: p.category, price: p.price, brand: p.brand };
}

async function fetchCategoryProducts(category: string, subcategory?: string): Promise<Product[]> {
  const qs = subcategory ? `?subcategory=${encodeURIComponent(subcategory)}` : "";
  const data = await apiFetch<ApiProduct[]>(`/products/category/${encodeURIComponent(category)}/listing${qs}`, 0);
  return (data ?? []).map(mapProduct);
}

async function fetchSubcategories(category: string): Promise<string[]> {
  return (await apiFetch<string[]>(`/products/category/${encodeURIComponent(category)}/subcategories`, 0)) ?? [];
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ subcategory?: string }>;
}) {
  const { slug } = await params;
  const { subcategory } = await searchParams;
  const category = decodeURIComponent(slug); // Next.js lasă slug-ul codat (ex. "Componente%20PC")

  const [products, subcategories] = await Promise.all([
    fetchCategoryProducts(category, subcategory),
    fetchSubcategories(category),
  ]);

  const subcategoryLinkBuilder = (sub: string | null) =>
    sub
      ? `/category/${encodeURIComponent(slug)}?subcategory=${encodeURIComponent(sub)}`
      : `/category/${encodeURIComponent(slug)}`;

  return (
    <ListingLayout
      heading={CATEGORIES.find((c) => c.value === category)?.label ?? category}
      resultCount={products.length}
      products={products}
      subcategories={subcategories}
      activeSubcategory={subcategory}
      subcategoryLinkBuilder={subcategoryLinkBuilder}
    />
  );
}

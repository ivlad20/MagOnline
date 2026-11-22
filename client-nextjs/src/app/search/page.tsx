import ListingLayout from "@/components/ListingLayout";
import { fetchSearchResults } from "@/lib/search";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const products = await fetchSearchResults(q);

  return (
    <ListingLayout
      heading={q ? `Rezultate pentru „${q}”` : "Căutare produse"}
      resultCount={products.length}
      products={products}
    />
  );
}

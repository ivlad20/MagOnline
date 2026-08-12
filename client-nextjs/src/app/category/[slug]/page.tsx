import ComingSoon from "@/components/ComingSoon";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <ComingSoon
      title={`Categorie: ${slug}`}
      description="Listarea produselor pe categorie urmează."
    />
  );
}

import BusinessList from "@/components/BusinessList";
import CategoryList from "@/components/CategoryList";
import Hero from "@/components/Hero";

export default async function Page({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  return <div>
    <Hero />
    <CategoryList />
    <BusinessList category={category} />
  </div>;
}
import ServiceDetailPage from "@/views/ServiceDetailPage";
import { services } from "@/data/services";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const service = services.find((s) => s.slug === resolvedParams?.slug);
  if (!service) {
    return { title: "Service Not Found — G1 Healthcare" };
  }
  return {
    title: `${service.title} — G1 Healthcare`,
    description: service.short,
  };
}

export default function Page() {
  return <ServiceDetailPage />;
}

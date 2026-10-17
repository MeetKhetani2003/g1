import DoctorDetailPage from "@/views/DoctorDetailPage";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const formattedName = slug
    ? slug
        .replace(/^dr-?/i, "Dr. ")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Doctor Profile";

  return {
    title: `${formattedName} — G1 Healthcare Verified Doctor`,
    description: `Book consultation with ${formattedName}. Check verified reviews, available consultation timings, and hospital affiliations on G1 Healthcare.`,
  };
}

export default function DoctorSlugRoute() {
  return <DoctorDetailPage />;
}

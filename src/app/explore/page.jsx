import { Suspense } from "react";
import ExplorePage from "@/views/ExplorePage";

export const metadata = {
  title: "Explore Healthcare Providers — G1 Healthcare",
  description: "Search and filter hospitals, diagnostic centers, and clinics near you.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen py-24 text-center text-muted">Loading providers...</div>}>
      <ExplorePage />
    </Suspense>
  );
}

import { Suspense } from "react";
import { DeedForm } from "@/components/deeds/deed-form";

export default function NewDeedPage() {
  return (
    <Suspense>
      <DeedForm />
    </Suspense>
  );
}

import { Suspense } from "react";
import PlacementQuize from "@/src/modules/onboarding/placementQuize";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex justify-center items-center"></div>
      }
    >
      <PlacementQuize />
    </Suspense>
  );
}

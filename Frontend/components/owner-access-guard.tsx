"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthUser } from "@/lib/backend";

export function OwnerAccessGuard() {
  const router = useRouter();

  useEffect(() => {
    const user = getAuthUser();
    if (user?.user_type === "owner") {
      // Restaurant owners are redirected to their owner dashboard/verification gate
      router.replace("/owner/dashboard");
    }
  }, [router]);

  return null;
}

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getAuthUser } from "@/lib/backend";

export function CustomerAccessGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const user = getAuthUser();
    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.user_type !== "user") {
      const destination = user.user_type === "admin"
        ? "/admin/dashboard"
        : user.user_type === "owner"
          ? "/owner/dashboard"
          : "/rider/dashboard";
      router.replace(destination);
      return;
    }

    setAllowed(true);
  }, [router]);

  return allowed ? children : null;
}
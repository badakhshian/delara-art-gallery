"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Right after a successful purchase, Stripe redirects back here almost
// instantly — but the webhook that actually marks the piece "sold" runs
// slightly after that, asynchronously. This quietly re-fetches the page's
// data a few times over the following ~12 seconds so the Buy button flips
// to "Sold" on its own once the webhook catches up, instead of requiring
// a manual refresh.
export default function SoldStatusRefresher({ active }) {
  const router = useRouter();

  useEffect(() => {
    if (!active) return;

    const delays = [2000, 4000, 6000];
    const timeouts = delays.map((delay) => setTimeout(() => router.refresh(), delay));

    return () => timeouts.forEach(clearTimeout);
  }, [active, router]);

  return null;
}

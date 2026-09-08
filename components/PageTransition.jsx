"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease" }}>
      {children}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

// Matches Tailwind's `sm` breakpoint (640px). Below it the cart drawer
// behaves as a bottom sheet instead of a right-side panel.
export function useIsMobile(breakpointPx = 640) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [breakpointPx]);

  return isMobile;
}

"use client";

import React, { useRef, useEffect, useState } from "react";
import { useScrollStore } from "@/zustand/website/scrollStore";

export function ImageGalleryWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const setShouldShowBar = useScrollStore((state) => state.setShouldShowBar);
  const scrollPosition = useScrollStore((state) => state.scrollPosition);
  const productInfoWrapperHeight = useScrollStore(
    (state) => state.productInfoWrapperHeight
  );
  const [wrapperHeight, setWrapperHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (wrapperRef.current) {
        setWrapperHeight(wrapperRef.current.offsetHeight);
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });
    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const calculateThreshold = () => {
      const offset = 82;
      if (productInfoWrapperHeight > wrapperHeight) {
        return productInfoWrapperHeight + offset;
      }

      return wrapperHeight + offset;
    };

    const threshold = calculateThreshold();
    setShouldShowBar(scrollPosition >= threshold);
  }, [
    scrollPosition,
    wrapperHeight,
    productInfoWrapperHeight,
    setShouldShowBar,
  ]);

  return (
    <div
      ref={wrapperRef}
      className="sticky top-5 max-w-[650px] flex flex-col gap-16"
    >
      {children}
    </div>
  );
}

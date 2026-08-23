"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { recordProductView } from "@/lib/api";

export default function RecordProductView({ productId }: { productId: number }) {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      recordProductView(productId);
    }
  }, [productId, user]);

  return null;
}
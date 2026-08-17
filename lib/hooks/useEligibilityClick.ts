"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openAuthModal } from "@/store/slices/uiSlice";

export function useEligibilityClick() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isLoggedIn = useAppSelector((s) => s.user.isLoggedIn);
  const hasProfile = useAppSelector((s) => s.user.hasProfile);

  return function handleEligibilityClick() {
    if (!isLoggedIn) {
      dispatch(openAuthModal("signup"));
    } else if (!hasProfile) {
      router.push("/profile");
    } else {
      router.push("/eligible-exams");
    }
  };
}
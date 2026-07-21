import React from "react";
import { SignIn } from "@clerk/nextjs";
import { Logo } from "@/components/ui/Logo";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#F0F0F0] text-[#0D0D0F] font-poppins flex flex-col items-center justify-center p-4">
      <div className="mb-6 text-center">
        <Logo size="md" showTagline={true} />
      </div>
      <div className="bg-white p-2 sm:p-4 rounded-[16px] shadow-ds-lg border border-[#E5E7EB]">
        <SignIn />
      </div>
    </div>
  );
}

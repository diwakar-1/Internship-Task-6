"use client";

import React, { useState } from "react";
import posthog from "posthog-js";
import { Button } from "../ui/Button";

export const NewsletterBanner: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      posthog.capture("newsletter_subscribed", {
        placement: "article_page",
      });
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <div className="bg-[#F6F6F6] rounded-[12px] p-6 sm:p-8 border border-[#E5E7EB] shadow-ds-sm font-poppins flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      {/* Left text */}
      <div className="space-y-1 max-w-lg">
        <h3 className="text-lg font-bold text-[#0D0D0F]">
          Stay Informed. Stay Balanced.
        </h3>
        <p className="text-xs text-[#6B7280]">
          Get the top stories and bias analysis delivered to your inbox.
        </p>
      </div>

      {/* Right form */}
      <form onSubmit={handleSubmit} className="w-full md:w-auto flex items-center gap-2">
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white border border-[#E5E7EB] rounded-[6px] px-4 py-2 text-xs font-poppins focus:outline-none focus:border-[#0D0D0F] min-w-[240px]"
        />
        <Button variant="primary" stateVariant="default" type="submit" className="text-xs py-2 px-5 rounded-[6px]">
          {subscribed ? "Subscribed!" : "Subscribe"}
        </Button>
      </form>
    </div>
  );
};

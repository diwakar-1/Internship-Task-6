import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "text";
  stateVariant?: "default" | "hover" | "outline" | "disabled";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  stateVariant = "default",
  children,
  className = "",
  disabled,
  ...props
}) => {
  const isDisabled = disabled || stateVariant === "disabled";

  let variantStyles = "";

  if (variant === "primary") {
    switch (stateVariant) {
      case "hover":
        variantStyles = "bg-[#1F2937] text-white shadow-ds-sm";
        break;
      case "outline":
        variantStyles = "bg-transparent text-[#0D0D0F] border border-[#0D0D0F]";
        break;
      case "disabled":
        variantStyles = "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed border-none";
        break;
      case "default":
      default:
        variantStyles = "bg-[#0D0D0F] text-white hover:bg-[#1F2937] active:scale-[0.99]";
        break;
    }
  } else if (variant === "secondary") {
    switch (stateVariant) {
      case "hover":
        variantStyles = "bg-[#E5E7EB] text-[#0D0D0F] border border-[#D1D5DB]";
        break;
      case "outline":
        variantStyles = "bg-transparent text-[#0D0D0F] border border-[#E5E7EB]";
        break;
      case "disabled":
        variantStyles = "bg-[#F3F4F6] text-[#D1D5DB] border border-[#F3F4F6] cursor-not-allowed";
        break;
      case "default":
      default:
        variantStyles = "bg-[#F6F6F6] text-[#0D0D0F] border border-[#E5E7EB] hover:bg-[#E5E7EB]";
        break;
    }
  } else if (variant === "text") {
    switch (stateVariant) {
      case "hover":
        variantStyles = "bg-transparent text-[#1D4ED8]";
        break;
      case "disabled":
        variantStyles = "bg-transparent text-[#D1D5DB] cursor-not-allowed";
        break;
      case "outline":
      case "default":
      default:
        variantStyles = "bg-transparent text-[#0D0D0F] hover:text-[#1D4ED8]";
        break;
    }
  }

  return (
    <button
      disabled={isDisabled}
      className={`px-5 py-2 text-sm font-medium font-poppins rounded-[8px] transition-all duration-150 inline-flex items-center justify-center ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

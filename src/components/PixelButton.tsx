"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
}

export function PixelButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}: PixelButtonProps) {
  const variantStyles = {
    primary: "bg-pop-pink hover:bg-pop-rose text-cloud-white",
    secondary: "bg-cloud-cream hover:bg-cloud-white text-ink",
    danger: "bg-pop-danger hover:bg-cotton-candy-600 text-cloud-white",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white",
  };

  const sizeStyles = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`
        font-terminal
        border-4 border-ink-border
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        shadow-pixel
        rounded-none
        btn-pixel
        cursor-pointer
        select-none
        uppercase
        tracking-wide
        transition-colors
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

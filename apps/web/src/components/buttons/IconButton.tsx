import { type LucideIcon, type LucideProps } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  Icon: LucideIcon;
  iconProps?: LucideProps;
};

export function IconButton({
  Icon,
  className = "",
  iconProps = {},
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      className={`rounded-full h-10 w-10 flex items-center justify-center ${className}`}
    >
      <Icon
        className={`w-6 h-6 text-gray-200 ${iconProps?.className ?? ""}`}
        strokeWidth={1.4}
        {...iconProps}
      />
    </button>
  );
}

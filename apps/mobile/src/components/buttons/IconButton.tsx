import { type LucideIcon, type LucideProps } from "lucide-react-native";
import { Pressable, PressableProps } from "react-native";

type IconButtonProps = PressableProps & {
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
    <Pressable
      {...props}
      className={`rounded-full h-10 w-10 flex items-center justify-center ${className}`}
    >
      <Icon
        className={`w-6 h-6 text-gray-200 ${iconProps?.className ?? ""}`}
        strokeWidth={1.4}
        {...iconProps}
      />
    </Pressable>
  );
}

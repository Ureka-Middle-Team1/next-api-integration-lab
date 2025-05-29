// components/tailwind/Button.tsx
type Props = {
  children: React.ReactNode;
  variant?: "default" | "outline";
};

export const Button = ({ children, variant = "default" }: Props) => {
  const baseStyle = "px-4 py-2 text-sm font-medium rounded transition duration-200";

  const variantStyle =
    variant === "outline"
      ? "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
      : "bg-blue-600 text-white hover:bg-blue-700";

  return <button className={`${baseStyle} ${variantStyle}`}>{children}</button>;
};

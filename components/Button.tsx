interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded font-medium transition";
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

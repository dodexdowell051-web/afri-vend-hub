import { motion } from "framer-motion";

interface ButtonLoaderProps {
  variant?: "dots" | "spinner" | "pulse";
  size?: "sm" | "md";
  className?: string;
}

const ButtonLoader = ({ variant = "dots", size = "md", className = "" }: ButtonLoaderProps) => {
  const dotSize = size === "sm" ? "w-1 h-1" : "w-1.5 h-1.5";
  
  if (variant === "dots") {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className={`${dotSize} rounded-full bg-current`}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "spinner") {
    const spinnerSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";
    return (
      <motion.div
        className={`${spinnerSize} border-2 border-current border-t-transparent rounded-full ${className}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    );
  }

  // Pulse variant
  return (
    <motion.span
      className={`${size === "sm" ? "w-2 h-2" : "w-3 h-3"} rounded-full bg-current ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

export default ButtonLoader;

import { motion } from "framer-motion";
import afrivendLogoIcon from "@/assets/afrivend-logo.png";

interface LogoLoaderProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const sizeMap = {
  sm: { icon: 32, text: "text-lg" },
  md: { icon: 48, text: "text-2xl" },
  lg: { icon: 64, text: "text-3xl" },
};

const LogoLoader = ({ size = "md", showText = true }: LogoLoaderProps) => {
  const { icon, text } = sizeMap[size];

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Pulsing ring effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ width: icon * 1.5, height: icon * 1.5, margin: -(icon * 0.25) }}
        />
        
        {/* Logo with subtle bounce */}
        <motion.img
          src={afrivendLogoIcon}
          alt="Afrivend"
          style={{ width: icon, height: icon }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            y: [0, -4, 0],
          }}
          transition={{
            scale: { duration: 0.3 },
            opacity: { duration: 0.3 },
            y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      </div>

      {showText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex items-center gap-1"
        >
          <span className={`font-bold text-foreground ${text}`}>
            Afri<span className="text-primary">vend</span>
          </span>
        </motion.div>
      )}

      {/* Loading dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LogoLoader;

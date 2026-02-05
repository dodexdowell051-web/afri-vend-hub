import { motion, AnimatePresence } from "framer-motion";
import LogoLoader from "./LogoLoader";

interface PageLoaderProps {
  isLoading?: boolean;
  fullScreen?: boolean;
  message?: string;
}

const PageLoader = ({ isLoading = true, fullScreen = true, message }: PageLoaderProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`
            flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm z-50
            ${fullScreen ? "fixed inset-0" : "absolute inset-0 min-h-[400px]"}
          `}
        >
          <LogoLoader size="lg" />
          
          {message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-muted-foreground text-sm"
            >
              {message}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;

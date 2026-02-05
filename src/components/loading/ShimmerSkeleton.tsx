import { cn } from "@/lib/utils";

interface ShimmerSkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card" | "image";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const ShimmerSkeleton = ({
  className,
  variant = "rectangular",
  width,
  height,
  lines = 1,
}: ShimmerSkeletonProps) => {
  const baseClasses = "relative overflow-hidden bg-muted before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-primary/5 before:to-transparent";

  const variantClasses = {
    text: "h-4 rounded-md",
    circular: "rounded-full aspect-square",
    rectangular: "rounded-lg",
    card: "rounded-2xl",
    image: "rounded-xl aspect-video",
  };

  const style = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(baseClasses, variantClasses.text)}
            style={{
              ...style,
              width: i === lines - 1 ? "70%" : style.width,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
    />
  );
};

// Product Card Skeleton
export const ProductCardSkeleton = () => (
  <div className="bg-card rounded-2xl overflow-hidden border border-border/50">
    <ShimmerSkeleton variant="image" className="w-full" />
    <div className="p-4 space-y-3">
      <ShimmerSkeleton variant="text" width="40%" />
      <ShimmerSkeleton variant="text" width="70%" height={20} />
      <ShimmerSkeleton variant="text" lines={2} />
      <div className="flex items-center justify-between pt-2">
        <ShimmerSkeleton variant="text" width="30%" height={24} />
        <ShimmerSkeleton variant="rectangular" width={100} height={40} className="rounded-xl" />
      </div>
    </div>
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 5 }: { columns?: number }) => (
  <tr className="border-b border-border/50">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="p-4">
        <ShimmerSkeleton variant="text" width={i === 0 ? "80%" : "60%"} />
      </td>
    ))}
  </tr>
);

// Dashboard Card Skeleton
export const DashboardCardSkeleton = () => (
  <div className="bg-card rounded-2xl p-6 border border-border/50">
    <div className="flex items-center justify-between mb-4">
      <ShimmerSkeleton variant="circular" width={48} height={48} />
      <ShimmerSkeleton variant="text" width={60} height={20} />
    </div>
    <ShimmerSkeleton variant="text" width="50%" height={32} className="mb-2" />
    <ShimmerSkeleton variant="text" width="70%" />
  </div>
);

// Hero Section Skeleton
export const HeroSkeleton = () => (
  <div className="container mx-auto px-4 py-20">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <ShimmerSkeleton variant="text" width="60%" height={16} className="mb-4" />
        <ShimmerSkeleton variant="text" width="90%" height={48} />
        <ShimmerSkeleton variant="text" width="80%" height={48} />
        <ShimmerSkeleton variant="text" lines={3} className="mt-6" />
        <div className="flex gap-4 pt-4">
          <ShimmerSkeleton variant="rectangular" width={160} height={56} className="rounded-xl" />
          <ShimmerSkeleton variant="rectangular" width={160} height={56} className="rounded-xl" />
        </div>
      </div>
      <ShimmerSkeleton variant="card" className="aspect-[4/3] w-full" />
    </div>
  </div>
);

export default ShimmerSkeleton;

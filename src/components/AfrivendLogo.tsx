import afrivendLogoIcon from "@/assets/afrivend-logo.png";

interface AfrivendLogoProps {
  variant?: "icon" | "full";
  className?: string;
  iconSize?: number;
}

const AfrivendLogo = ({ variant = "icon", className = "", iconSize = 40 }: AfrivendLogoProps) => {
  if (variant === "icon") {
    return (
      <img 
        src={afrivendLogoIcon} 
        alt="Afrivend" 
        className={className}
        style={{ width: iconSize, height: iconSize }}
      />
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src={afrivendLogoIcon} 
        alt="Afrivend" 
        style={{ width: iconSize, height: iconSize }}
      />
      <span className="text-2xl font-bold text-foreground">
        Afri<span className="text-primary">vend</span>
      </span>
    </div>
  );
};

export default AfrivendLogo;

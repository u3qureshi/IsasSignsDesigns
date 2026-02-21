import LogoMark from "../assets/brand/IsaSignsAndDesignsLOGO.svg";
import LogoTitle from "../assets/brand/IsaSignsAndDesignsTITLELOGO.png";

type BrandProps = {
  variant?: "stacked" | "compact" | "icon";
  className?: string;
};

export default function Brand({ variant = "stacked", className = "" }: BrandProps) {
  if (variant === "icon") {
    return <img src={LogoMark} alt="Logo" className={`h-12 w-12 shrink-0 block ${className}`} />;
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <img src={LogoMark} alt="Logo" className="h-16 w-16 shrink-0 block" />
        <img
          src={LogoTitle}
          alt="Isa's Signs & Designs"
          className="h-24 w-auto block"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src={LogoMark} alt="Logo" className="h-[clamp(3.5rem,6vw,5rem)] w-[clamp(3.125rem,5.4vw,4.5rem)] shrink-0 block" />
      <img
        src={LogoTitle}
        alt="Isa's Signs & Designs"
        className="h-[clamp(2.7rem,4.5vw,4rem)] w-auto block"
      />
    </div>
  );
}


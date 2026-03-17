import Image from "next/image";

interface MobiusLogoProps {
  size?: number;
  className?: string;
}

export function MobiusLogo({ size = 80, className = "" }: MobiusLogoProps) {
  return (
    <Image
      src="/images/otium-mark.png"
      alt="Otium"
      width={size}
      height={Math.round(size * 0.727)}
      className={className}
      priority
    />
  );
}

export function MobiusLogoMark({ size = 28, className = "" }: MobiusLogoProps) {
  return (
    <Image
      src="/images/otium-mark-sm.png"
      alt="Otium"
      width={size}
      height={Math.round(size * 0.727)}
      className={className}
      priority
    />
  );
}

import { cn } from "@/lib/utils";
import type { ThemeIconSources } from "@/lib/theme/siteIcons";

type ThemeIconProps = ThemeIconSources & {
  className?: string;
};

export function ThemeIcon({ dark, light, className }: ThemeIconProps) {
  return (
    <span className={cn("relative inline-block", className)} aria-hidden>
      <img
        src={dark}
        alt=""
        loading="lazy"
        className="theme-icon-dark absolute inset-0 h-full w-full object-contain"
        style={{ filter: "brightness(0) invert(1)" }}
      />
      <img
        src={light}
        alt=""
        loading="lazy"
        className="theme-icon-light absolute inset-0 h-full w-full object-contain"
      />
    </span>
  );
}

import burkDark from "@/assets/site/icon-burkolas.png";
import burkLight from "@/assets/site/icon-burkolas-wh.png";
import festesDark from "@/assets/site/icon-festes.png";
import festesLight from "@/assets/site/icon-festes-wh.png";
import acsDark from "@/assets/site/icon-acs.png";
import acsLight from "@/assets/site/icon-acs-wh.png";
import komuvesDark from "@/assets/site/icon-komuves.png";
import komuvesLight from "@/assets/site/icon-komuves-wh.png";
import takarDark from "@/assets/site/icon-takaritas.png";
import takarLight from "@/assets/site/icon-takaritas-wh.png";

export type ThemeIconSources = {
  dark: string;
  light: string;
};

export const SERVICE_ICONS: ThemeIconSources[] = [
  { dark: burkDark, light: burkLight },
  { dark: festesDark, light: festesLight },
  { dark: acsDark, light: acsLight },
  { dark: komuvesDark, light: komuvesLight },
  { dark: takarDark, light: takarLight },
];

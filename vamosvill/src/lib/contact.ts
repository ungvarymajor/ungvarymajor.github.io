export const PHONES = {
  construction: {
    display: "+36 30 993 0472",
    tel: "tel:+36309930472",
  },
  trade: [
    {
      display: "+36 70 604 3681",
      tel: "tel:+36706043681",
    },
    {
      display: "+36 30 590 3152",
      tel: "tel:+36305903152",
    },
  ],
} as const;

export const EMAILS = {
  construction: "epites@vamosvill.hu",
  office: "iroda@vamosvill.hu",
  trade: "kereskedes@vamosvill.hu",
} as const;

export const PHONE_DISPLAY_LIST = [
  PHONES.construction.display,
  ...PHONES.trade.map((p) => p.display),
] as const;
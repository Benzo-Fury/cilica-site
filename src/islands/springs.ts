/** The app's four spring presets (docs/design-system/motion.md), for Motion. */
export const springs = {
  snappy: { type: "spring", visualDuration: 0.2, bounce: 0.15 },
  smooth: { type: "spring", visualDuration: 0.3, bounce: 0.1 },
  bouncy: { type: "spring", visualDuration: 0.35, bounce: 0.3 },
  gentle: { type: "spring", visualDuration: 0.45, bounce: 0 },
} as const;

import localFont from "next/font/local";

export const gotham = localFont({
  src: [
    {
      path: "../public/fonts/Gotham-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-gotham",
  display: "swap",
});

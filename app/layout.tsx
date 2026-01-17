import "./globals.css";
import { IBM_Plex_Sans } from "next/font/google";
import { gotham } from "./fonts";
import Navbar from "./components/Navbar";
import Background from "./components/Background";
import CustomCursor from "./components/CustomCursor";

const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "Slab Fant",
  description: "Slovenski glasbenik – atmosfere, teksture in zvok",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="sl"
      className={`${ibmPlex.variable} ${gotham.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-black text-white overflow-x-hidden">
        <CustomCursor />
        <Background />
        <Navbar />
        {children}
      </body>
    </html>
  );
}

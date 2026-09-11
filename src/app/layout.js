import { Inter } from "next/font/google";
import "./globals.css";
import Image from 'next/image';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DataHara",
  description: "Agritech Solution",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Simple banner with centered logo */}
        <div className="w-full bg-white pb-2 pt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
            <Image
              src="/banner.png"
              alt="DataHara Logo"
              width={300}
              height={400}
              className="h-16 w-auto"
            />
          </div>
        </div>
        
        {children}
        
      </body>
    </html>
  );
}

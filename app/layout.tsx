import type { Metadata } from 'next';
import './globals.css';
import NavigationBar from '@/components/NavigationBar'; // We will build this next!

// GEO & SEO Optimization
export const metadata: Metadata = {
  title: "Achint Tiwari | Full-Stack Developer",
  description: "Portfolio of Achint Tiwari, a Full-Stack Developer specializing in Next.js, React, and GSAP animations.",
  keywords: ["Achint Tiwari", "Full-Stack Developer", "Next.js", "React", "GSAP", "Software Engineer Portfolio"],
  authors: [{ name: "Achint Tiwari" }],
  robots: "index, follow", // Ensures AI crawlers and search engines can index your site
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Global Navigation ensures users always know where they are */}
        <NavigationBar />
        
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
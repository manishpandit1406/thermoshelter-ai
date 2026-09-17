import type { Metadata } from "next";
import "./globals.css";
import { ProjectProvider } from "@/store/projectStore";

export const metadata: Metadata = {
  title: { default: "ThermoShelter AI", template: "%s | ThermoShelter AI" },
  description:
    "Location-aware, physics-based AI-assisted shelter thermal design platform.",
  keywords: ["thermal", "shelter", "AI", "simulation", "architecture"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ProjectProvider>
          {children}
        </ProjectProvider>
      </body>
    </html>
  );
}

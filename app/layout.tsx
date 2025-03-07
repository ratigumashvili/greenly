import type { Metadata } from "next";

import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Toaster } from "@/components/ui/sonner";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/shared/app-sidebar"

import { firaGo } from "@/lib/fonts"

import "./globals.css";
import "leaflet/dist/leaflet.css"

export const metadata: Metadata = {
  title: "Greenly",
  description: "Your Hub for Biodiversity & Ecology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      className={`${firaGo.variable} font-firaGo`}
      >
        <SidebarProvider className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex flex-col flex-1 w-full">
            <Navbar />
            <main className="flex-1 h-full w-full max-w-7xl mx-auto pr-4 pl-16 md:px-16 xl:px-4">
              {children}
              <ConfirmModal />
              <Toaster />
            </main>
            <Footer />
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}

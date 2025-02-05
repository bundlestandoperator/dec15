import { MobileNavbarOverlay } from "@/components/admin/Navbar/MobileNavbarOverlay";
import Navbar from "@/components/admin/Navbar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-10 min-h-screen bg-neutral-50">
        <div className="w-full max-w-screen-lg mx-auto">{children}</div>
      </main>
      <MobileNavbarOverlay />
    </>
  );
}

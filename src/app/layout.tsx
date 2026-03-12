import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gharpayy CRM",
  description: "Advanced Lead Management System with 5-minute SLAs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="app-container">
          <nav className="sidebar">
            <div className="brand">
              <h2 className="text-gradient-accent">Gharpayy</h2>
              <span className="badge badge-info text-xs">CRM OS</span>
            </div>
            <ul className="nav-links">
              <li><a href="/" className="nav-link">Dashboard</a></li>
              <li><a href="/leads" className="nav-link">Leads Pipeline</a></li>
              <li><a href="/capture" className="nav-link text-gradient-accent">Public Form Demo</a></li>
            </ul>
          </nav>
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

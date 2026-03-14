import "./globals.css";

export const metadata = {
  title: "DTEC Admin Dashboard",
  description: "Product Management Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

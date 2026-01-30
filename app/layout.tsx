import "./globals.css";

export const metadata = {
  title: "Forever Shepherd",
  description: "Guidance that remains.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 20px" }}>
          {children}
        </div>
      </body>
    </html>
  );
}

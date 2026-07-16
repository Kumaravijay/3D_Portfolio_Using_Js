import "./globals.css";

export const metadata = {
  title: "Kumara Vijay M G | Data Analyst · Gen AI · Full-stack AI apps",
  description:
    "Freelance data analyst and Gen AI developer. Meet my 3D avatar and explore my work.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

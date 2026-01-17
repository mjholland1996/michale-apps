import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recetas Peruanas",
  description: "Traditional Peruvian family recipes",
};

export default function RecetasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

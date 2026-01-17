import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meal Planner",
  description: "Plan your weekly meals with Gousto recipes",
};

export default function MealPlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

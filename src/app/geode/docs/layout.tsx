import type { Metadata } from "next";
import "./docs.css";

export const metadata: Metadata = {
  title: "GEODE Docs",
  description:
    "GEODE — General-Purpose Autonomous Execution Agent. Architecture, runtime, harness, and plugin documentation.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

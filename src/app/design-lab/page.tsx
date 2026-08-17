import type { Metadata } from "next";
import { LabLoader } from "./LabLoader";

export const metadata: Metadata = {
  title: "Design Lab",
  robots: { index: false, follow: false },
};

export default function DesignLabPage() {
  return <LabLoader />;
}

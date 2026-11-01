import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";
import { legalUpdated, terms } from "@/data/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms for using the Career Blueprint website and our services.",
};

export default function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro="Please read these terms before using this website or enrolling in our services. They are written to be clear and fair."
      updated={legalUpdated}
      sections={terms}
    />
  );
}

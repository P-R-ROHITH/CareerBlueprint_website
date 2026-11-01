import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";
import { legalUpdated, privacy } from "@/data/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Career Blueprint handles the information you share with us.",
};

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="We respect your privacy. This page explains what this website collects, what you share when you contact us, and the choices you have."
      updated={legalUpdated}
      sections={privacy}
    />
  );
}

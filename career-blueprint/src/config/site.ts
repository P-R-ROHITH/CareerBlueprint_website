export const site = {
  name: "Career Blueprint",
  tagline: "The Blueprint to Your Dream Job.",
  description:
    "Career guidance and training: interview preparation, resume preparation, NIOS coaching for Class 12 and personality development.",
};

// Confirmed by the owner. Change these in one place.
export const contact = {
  phoneDisplay: "+91 70124 97529",
  phoneHref: "tel:+917012497529",
  whatsappNumber: "917012497529",
  email: "careerblueprint.official@gmail.com",
};

export function whatsappLink(message = "Hi Career Blueprint, I'd like to know more about your services.") {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const nav = [
  { label: "Home", href: "/" },
  { label: "Programs & Services", href: "/programs" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
] as const;

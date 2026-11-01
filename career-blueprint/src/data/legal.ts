/**
 * Text of the legal pages. A paragraph is a string; a bulleted list is an array of strings.
 * The wording describes how this website works today (no forms, accounts, cookies or analytics):
 * if that changes, update the privacy policy at the same time.
 */
export type LegalBlock = string | string[];
export type LegalSection = { heading: string; body: LegalBlock[] };

export const legalUpdated = "28 October 2026";

export const privacy: LegalSection[] = [
  {
    heading: "About this policy",
    body: [
      "This policy explains what personal information Career Blueprint (“we”, “us”) handles when you visit this website or contact us, and the choices you have. We have tried to keep it short and plain.",
    ],
  },
  {
    heading: "What this website collects",
    body: [
      "This website does not ask you to create an account or fill in a form, and it does not use advertising or analytics tools. It does not set cookies of its own, and its fonts are served from the website itself rather than from a third party.",
      "Like most websites, the company that hosts it may keep standard technical records when you visit, such as your IP address, browser type and the pages requested. These are used to keep the site running and secure, and we do not use them to identify you.",
    ],
  },
  {
    heading: "Information you share when you contact us",
    body: [
      "You can reach us by WhatsApp, phone call or email. If you do, we receive what you choose to tell us, which may include:",
      ["Your name, phone number or email address", "Your education, work background or goals", "Anything else you include in your message"],
      "We use this only to reply to you, answer your questions, talk through programs that may suit you, arrange sessions and keep a record of our conversations. Please share only what you are comfortable sharing. You do not need to send documents such as ID numbers or bank details to ask a question.",
    ],
  },
  {
    heading: "Other services you use to reach us",
    body: [
      "Buttons on this website open WhatsApp, your phone’s dialler or your email app. Those services are run by other companies (for example WhatsApp, owned by Meta, and your email provider). When you use them, their own terms and privacy policies apply to your messages, and we do not control how they handle your data.",
      "This website may link to other websites. We are not responsible for their content or privacy practices.",
    ],
  },
  {
    heading: "Who we share information with",
    body: [
      "We do not sell your personal information. We share it only when it is needed to give you a service you asked for, or when the law requires us to.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "We keep the messages and details you send us for as long as we need them for the purposes above, or as the law requires. If you ask us to delete them, we will do so unless we are legally required to keep them.",
    ],
  },
  {
    heading: "Keeping it safe",
    body: [
      "We take reasonable steps to protect the information you share with us. No method of sending or storing information is completely secure, so we cannot promise absolute security.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      "You can ask us to:",
      ["Tell you what personal information of yours we hold", "Correct anything that is wrong", "Delete your information", "Stop messaging you"],
      "To do any of these, contact us using the details at the end of this page. We will respond within a reasonable time and in line with the laws that apply in India, including the Digital Personal Data Protection Act, 2023. If you have a concern about how we handled your information, please tell us first so we can put it right.",
    ],
  },
  {
    heading: "Children and students under 18",
    body: [
      "Many of our students are young. If you are under 18, please ask a parent or guardian to contact us on your behalf or to be involved in the conversation. We do not knowingly keep a child’s personal information without a parent or guardian’s involvement.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: ["We may update this policy from time to time. The date at the top shows when it was last changed."],
  },
];

export const terms: LegalSection[] = [
  {
    heading: "About these terms",
    body: [
      "These terms apply to your use of this website and to your conversations with Career Blueprint (“we”, “us”) about our services. By using the website or contacting us about our services, you agree to them. If you do not agree, please do not use the website.",
    ],
  },
  {
    heading: "What we offer",
    body: [
      "Career Blueprint provides career guidance and training, including interview preparation, resume preparation, NIOS coaching for Class 12 and personality development.",
      "The website gives general information about these services. The details that apply to you, such as what a program includes, its schedule, how it is delivered and its fee, are confirmed with you directly before you start. If the website and what we tell you directly ever differ, please ask us to confirm which applies.",
    ],
  },
  {
    heading: "No guarantee of results",
    body: [
      "Our services are meant to help you prepare. Outcomes depend on many things outside our control, including your own effort and the decisions of employers, institutions and examiners. We do not guarantee any job, interview, offer, admission, exam result or income.",
    ],
  },
  {
    heading: "Fees and payments",
    body: [
      "Fees, payment schedule and any cancellation or refund terms for a program are told to you before you enrol. Please ask us if anything is unclear before you pay.",
    ],
  },
  {
    heading: "Your part",
    body: [
      "When you use the website or our services, please:",
      [
        "Give us accurate information",
        "Treat our team and other students with respect",
        "Use what you learn and the materials we give you lawfully and honestly",
        "Not misuse the website, for example by trying to interfere with it or access it in unauthorised ways",
      ],
      "If you are under 18, a parent or guardian should be involved in contacting us and enrolling.",
    ],
  },
  {
    heading: "Our content",
    body: [
      "The website’s text, design, logo, images and any materials we provide belong to Career Blueprint or are used with permission. You may view them for your own personal use. Please do not copy, share publicly, sell or adapt them without our written permission.",
    ],
  },
  {
    heading: "Links to other websites and services",
    body: [
      "The website links to services run by others, such as WhatsApp. We do not control them and are not responsible for their content, availability or practices.",
    ],
  },
  {
    heading: "Our responsibility",
    body: [
      "We try to keep the website accurate and available, but it is provided “as is”, and we cannot promise it will always be error-free or uninterrupted. To the fullest extent the law allows, Career Blueprint is not liable for indirect or consequential loss arising from your use of the website or from relying on its general information. Nothing in these terms limits any right or liability that cannot be limited by law.",
    ],
  },
  {
    heading: "Governing law",
    body: ["These terms are governed by the laws of India, and the courts in India with jurisdiction will handle any dispute that cannot be settled by talking to us first."],
  },
  {
    heading: "Changes",
    body: [
      "We may change these terms or the website from time to time. The date at the top shows when the terms were last updated. Continuing to use the website after a change means you accept the updated terms.",
    ],
  },
];

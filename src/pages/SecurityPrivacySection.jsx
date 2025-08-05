// src/components/SecurityPrivacySection.jsx
import React from "react";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  EyeOff,
  AlertTriangle,
} from "lucide-react";

const SECURITY_POINTS = [
  {
    icon: <Lock className="w-7 h-7 text-green-600" />,
    title: "End-to-End Encryption",
    description:
      "Your personal health data is encrypted during transmission and while stored on our servers.",
  },
  {
    icon: <KeyRound className="w-7 h-7 text-green-600" />,
    title: "Secure Login",
    description:
      "We use industry-standard JWT tokens and OAuth 2.0 for passwordless and social logins.",
  },
  {
    icon: <ShieldCheck className="w-7 h-7 text-green-600" />,
    title: "Role-Based Access",
    description:
      "Different permissions for trainers, doctors, and users ensure sensitive data is only seen by authorized personnel.",
  },
  {
    icon: <AlertTriangle className="w-7 h-7 text-green-600" />,
    title: "AI Threat Detection",
    description:
      "Our AI monitors unusual activity patterns to prevent unauthorized access or data breaches.",
  },
  {
    icon: <EyeOff className="w-7 h-7 text-green-600" />,
    title: "Privacy-First Design",
    description:
      "We follow HIPAA & GDPR guidelines to give you full control over your personal data.",
  },
];

export default function SecurityPrivacySection() {
  return (
    <section className="bg-gray-50 py-20 px-4 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Security & Privacy You Can Trust
        </h2>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto mt-3">
          We know your health data is sensitive. Our platform is built with
          enterprise-grade security to keep your information safe at all times.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {SECURITY_POINTS.map((point, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow hover:shadow-md transition"
            >
              <div className="mb-4">{point.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {point.title}
              </h3>
              <p className="text-gray-600 text-sm">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React, { useState } from "react";
import {
  Pocket,
  Activity,
  Video,
  ShieldCheck,
  Calendar,
  Award,
  Zap,
  MapPin,
} from "lucide-react";

const FEATURES = [
  {
    id: "realtime",
    title: "Real-time Progress",
    short: "Live charts for steps, calories, sleep, and heart rate.",
    long: "Interactive dashboards with real-time and historical charts. Exportable reports (PDF/CSV) and scheduled reports via email.",
    icon: <Activity className="w-7 h-7" />,
  },
  {
    id: "pose",
    title: "Pose Detection",
    short: "Webcam-based posture & rep tracking using CV.",
    long: "Pose estimation guides form correction and counts reps. Works with webcam or smartphone camera. Includes feedback overlays and progress scoring.",
    icon: <Zap className="w-7 h-7" />,
  },
  {
    id: "consult",
    title: "Virtual Consultations",
    short: "Book doctors or trainers for video calls.",
    long: "Integrated telemedicine: schedule appointments, secure video calls, share health logs and get prescriptions or follow-ups.",
    icon: <Video className="w-7 h-7" />,
  },
  {
    id: "market",
    title: "Product Marketplace",
    short: "Buy fitness gear, supplements, and plans.",
    long: "Curated marketplace with product reviews, subscription plans, and secure checkout with multiple payment options and promo codes.",
    icon: <Pocket className="w-7 h-7" />,
  },
  {
    id: "cert",
    title: "Certificates",
    short: "Completion certificates for training programs.",
    long: "Generate shareable certificates and badges when users complete certified programs. Option to download or share on social media.",
    icon: <Award className="w-7 h-7" />,
  },
  {
    id: "security",
    title: "Enterprise-Grade Security",
    short: "JWT/OAuth2.0, E2E encryption and RBAC.",
    long: "Role-based access controls for users, trainers and doctors. Encryption at rest and in transit. AI threat detection for anomalous accesses.",
    icon: <ShieldCheck className="w-7 h-7" />,
  },
  {
    id: "scheduling",
    title: "Plans & Payment",
    short: "Manage subscriptions, trials, and pay-as-you-go.",
    long: "Flexible payment plans with invoicing, trials, and promo management. Secure PCI-compliant gateway integration.",
    icon: <Calendar className="w-7 h-7" />,
  },
  {
    id: "emergency",
    title: "Emergency Finder",
    short: "Locate nearby medical experts & services.",
    long: "Find closest clinics, hospitals, emergency contacts and share location in one tap. Integrates map & local language support for instructions.",
    icon: <MapPin className="w-7 h-7" />,
  },
];

export default function CoreFeaturesSection() {
  const [open, setOpen] = useState(null);

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20 px-4 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Core Features
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-3">
            Everything you need to measure, improve and secure your health — built for real life and real results.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <button
              key={f.id}
              onClick={() => setOpen(f.id)}
              className="group text-left bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 focus:outline-none"
            >
              <div className="flex items-center gap-4">
                <div className="flex-none rounded-lg bg-green-50 text-green-600 p-3">
                  {f.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {f.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">{f.short}</p>
                </div>
              </div>

              <div className="mt-4 text-sm text-green-600 font-medium group-hover:underline">
                Learn more →
              </div>
            </button>
          ))}
        </div>

        {/* Modal */}
        {open && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(null)}
            />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 z-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {
                      FEATURES.find((x) => x.id === open)
                        ?.title
                    }
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {
                      FEATURES.find((x) => x.id === open)
                        ?.long
                    }
                  </p>
                </div>
                <button
                  onClick={() => setOpen(null)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setOpen(null)}
                  className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // placeholder for CTA - e.g., open signup
                    setOpen(null);
                    // implement actual navigation/action in app
                  }}
                  className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

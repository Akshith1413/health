// src/components/ComingSoonSection.jsx
import React from "react";
import {
  Mic,
  Activity,
  Users,
  WifiOff,
  Watch,
} from "lucide-react";

const PLANNED = [
  {
    icon: <Mic className="w-8 h-8 text-green-600" />,
    title: "Voice Assistant Control",
    description: "Talk to your tracker via Alexa or Google Assistant for hands-free wellness updates.",
  },
  {
    icon: <Activity className="w-8 h-8 text-green-600" />,
    title: "ML Health Predictions",
    description: "AI predicts potential health risks early and recommends preventive action.",
  },
  {
    icon: <Users className="w-8 h-8 text-green-600" />,
    title: "Community Forums",
    description: "Join like-minded users, share achievements, and take part in group challenges.",
  },
  {
    icon: <WifiOff className="w-8 h-8 text-green-600" />,
    title: "Offline Mode",
    description: "Access essential features even without internet connectivity.",
  },
  {
    icon: <Watch className="w-8 h-8 text-green-600" />,
    title: "IoT Wearable & Gym Integration",
    description: "Seamlessly sync data from smartwatches, bands, and connected gym equipment.",
  },
];

export default function ComingSoonSection() {
  return (
    <section className="bg-green-50 py-20 px-4 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Coming Soon 🚀
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-3">
          We’re constantly evolving to make your health journey even smarter.
          Here’s a sneak peek at what’s next:
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {PLANNED.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12">
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-md transition-all">
            Join the Beta Program
          </button>
        </div>
      </div>
    </section>
  );
}

// src/components/WhyItMattersSection.jsx
import React from "react";
import { Activity, BrainCircuit, Languages, Users } from "lucide-react";

export default function WhyItMattersSection() {
  return (
    <section className="bg-gray-50 py-20 px-4 md:px-10 lg:px-20">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Why This Matters
        </h2>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto mt-4">
          <strong>According to the World Health Organization</strong>, over{" "}
          <span className="text-green-600 font-semibold">60% of people globally</span>{" "}
          suffer from lifestyle-related health issues due to poor tracking of diet,
          sleep, and exercise.
          <br />
          <a
            href="https://www.who.int/news-room/fact-sheets/detail/physical-activity"
            className="text-green-600 underline"
            target="_blank"
            rel="noreferrer"
          >
            Source: WHO
          </a>
        </p>

        {/* Comparison */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Existing Solutions */}
          <div className="bg-white p-8 rounded-2xl shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              The Problem with Existing Apps
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li>• Generic tracking without personalized recommendations</li>
              <li>• No emotional engagement or real-time feedback</li>
              <li>• Limited language and accessibility options</li>
              <li>• Weak integration with devices and IoT</li>
            </ul>
          </div>

          {/* Our Solution */}
          <div className="bg-green-50 p-8 rounded-2xl shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              How We’re Different
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <BrainCircuit className="w-6 h-6 text-green-600" />
                <span>AI-powered personalized health assistant with predictive analytics</span>
              </li>
              <li className="flex items-start gap-3">
                <Activity className="w-6 h-6 text-green-600" />
                <span>Real-time posture correction and daily plan adjustments</span>
              </li>
              <li className="flex items-start gap-3">
                <Languages className="w-6 h-6 text-green-600" />
                <span>Multilingual support for global accessibility</span>
              </li>
              <li className="flex items-start gap-3">
                <Users className="w-6 h-6 text-green-600" />
                <span>Engaging, inclusive community with trainers & experts</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

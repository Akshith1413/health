// src/components/PersonaWorkingAdults.jsx
import React from "react";
import { Briefcase, Clock, Coffee, BarChart3, HeartPulse } from "lucide-react";

export default function PersonaWorkingAdults() {
  return (
    <section className="bg-white py-20 px-4 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            For Busy Professionals Who Care About Their Health
          </h2>
          <p className="text-gray-600 text-lg mt-4">
            Juggling deadlines, meetings, and personal life can make wellness feel impossible. 
            Our AI-powered tracker helps you stay fit, energized, and focused — without disrupting your workday.
          </p>

          {/* Feature List */}
          <ul className="mt-8 space-y-6">
            <li className="flex items-start gap-4">
              <div className="bg-green-50 text-green-600 p-3 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Smart Time Management</h3>
                <p className="text-gray-600 text-sm">
                  AI schedules quick workouts and reminders around your calendar so you never miss a beat.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="bg-green-50 text-green-600 p-3 rounded-xl">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Stress & Sleep Tracking</h3>
                <p className="text-gray-600 text-sm">
                  Get real-time alerts when burnout patterns appear and receive recovery tips.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="bg-green-50 text-green-600 p-3 rounded-xl">
                <Coffee className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Office-Friendly Workouts</h3>
                <p className="text-gray-600 text-sm">
                  Desk stretches, posture correction, and quick cardio — all doable in 5–10 minutes.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="bg-green-50 text-green-600 p-3 rounded-xl">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Performance Reports</h3>
                <p className="text-gray-600 text-sm">
                  Visual progress reports keep you motivated and show tangible health gains.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <img
            src="https://learnenglish.britishcouncil.org/sites/podcasts/files/RS4967_78781313-hig.jpg"
            alt="Working Professional using Health Tracker"
            className="rounded-3xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}

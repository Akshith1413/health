// src/components/TestimonialsSection.jsx
import React from "react";

const TESTIMONIALS = [
  {
    name: "Sarah Mitchell",
    role: "Marketing Manager",
    text: "This app fits perfectly into my busy schedule. The AI workout suggestions are a game-changer!",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "Software Engineer",
    text: "I’ve tried many health apps, but this one keeps me motivated. The real-time posture correction is amazing.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
  },
  {
    name: "Priya Kapoor",
    role: "HR Specialist",
    text: "From meal plans to virtual doctor consults — I feel in control of my wellness for the first time.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 4,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-white py-20 px-4 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Loved by Our Users
        </h2>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto mt-3">
          See what real people are saying about their experience with our Health & Fitness Tracker.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-2xl p-6 shadow hover:shadow-md transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800">{t.name}</h3>
                  <p className="text-gray-500 text-sm">{t.role}</p>
                </div>
              </div>

              <p className="text-gray-700 italic mb-4">"{t.text}"</p>

              <div className="flex">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
                {Array.from({ length: 5 - t.rating }).map((_, i) => (
                  <span key={i} className="text-gray-300">★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

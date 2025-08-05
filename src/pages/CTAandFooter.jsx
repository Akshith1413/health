// src/components/CTAandFooter.jsx
import React from "react";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

export default function CTAandFooter() {
  return (
    <>
      {/* Call to Action Section */}
      <section className="bg-green-600 text-white py-20 px-4 md:px-10 lg:px-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold">
          Start Your Health Journey Today
        </h2>
        <p className="text-lg mt-4 max-w-2xl mx-auto">
          Join thousands of people taking control of their wellness with our AI-powered health tracker.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-green-600 font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-gray-100 transition">
            Get Started Now
          </button>
          <button className="border border-white text-white font-semibold py-3 px-6 rounded-xl hover:bg-white hover:text-green-600 transition">
            Join the Beta
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">Health & Fitness Tracker</h3>
            <p className="text-gray-400 text-sm">
              AI-powered health assistant for a better, healthier you.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#testimonials" className="hover:text-white">Testimonials</a></li>
              <li><a href="#security" className="hover:text-white">Security</a></li>
              <li><a href="#contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail size={16} /> support@healthtracker.com</li>
              <li className="flex items-center gap-2"><Phone size={16} /> +1 (555) 123-4567</li>
              <li className="flex items-center gap-2"><MapPin size={16} /> San Francisco, CA</li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white"><Facebook /></a>
              <a href="#" className="hover:text-white"><Twitter /></a>
              <a href="#" className="hover:text-white"><Instagram /></a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Health & Fitness Tracker. All rights reserved.
        </div>
      </footer>
    </>
  );
}

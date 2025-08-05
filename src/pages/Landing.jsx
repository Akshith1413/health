import React from 'react';
import { PlayCircle } from 'lucide-react';
import AiSection from './AIHealthAssistantSection.jsx';
import CoreFeaturesSection from './CoreFeaturesSection.jsx';
import ComingSoonSection from './ComingSoonSection.jsx';
import PersonaWorkingAdults from './PersonaWorkingAdults';
import SecurityPrivacySection from './SecurityPrivacySection';
import TestimonialsSection from './TestimonialsSection.jsx';
import WhyItMattersSection from './WhyItMattersSection.jsx';
import CTAandFooter from './CTAandFooter.jsx';
const Landing = () => {
  return (
    <>
      {/* Landing Hero Section */}
      <section className="bg-gradient-to-br from-green-100 to-white py-20 px-4 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
          
          {/* Left Content */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
              Master Your Wellness Journey<br />
              with <span className="text-green-600">AI-Powered Health Tracking</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Track your fitness, diet, sleep, and health trends — all guided by intelligent AI assistants that personalize your journey.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-md transition-all">
                Get Started
              </button>
              <button className="flex items-center gap-2 text-green-700 hover:text-green-900 font-medium">
                <PlayCircle className="w-6 h-6" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="flex justify-center">
            <img
              src="/logo.png"
              alt="Health Tracker Preview"
              className="rounded-3xl shadow-xl w-full max-w-sm sm:max-w-md"
            />
          </div>
        </div>
      </section>

      {/* Full Width Section */}
      <section className="w-full">
        <AiSection />
      </section>
      <section className="w-full">
        <CoreFeaturesSection />
      </section>
      <section className="w-full">
        <ComingSoonSection />
      </section>
      <section className="w-full">
        <PersonaWorkingAdults />
      </section>
      <section className="w-full">
        <SecurityPrivacySection />
      </section>
      <section className="w-full">
        <TestimonialsSection />
      </section>
      <section className="w-full">
        <WhyItMattersSection />
      </section>
      <section className="w-full">
        <CTAandFooter />
      </section>
    </>
  );
};

export default Landing;

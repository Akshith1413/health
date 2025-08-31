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
      <section className="bg-gradient-to-br from-green-100 to-white dark:from-gray-900 dark:via-gray-850 dark:to-gray-900 py-20 px-4 md:px-10 lg:px-20 relative overflow-hidden">
        {/* Subtle background pattern for dark mode */}
        <div className="absolute inset-0 hidden dark:block opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0zMCAzMG0tMjggMGEyOCwyOCAwIDEsMSA1NiwwYTI4LDI4IDAgMSwxIC01NiwwIiBzdHJva2U9IiMzNzQxNGEiIHN0cm9rZS13aWR0aD0iMC41IiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==')]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-23 relative z-10">
          
          {/* Left Content */}
          <div className="max-w-3xl mx-auto px-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white mb-10 leading-tight">
              Master Your Wellness Journey<br />
              with <span className="text-green-600 dark:text-green-400 bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent">AI-Powered Health Tracking</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
              Track your fitness, diet, sleep, and health trends — all guided by intelligent AI assistants that personalize your journey.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="bg-green-600 hover:bg-green-700 dark:bg-gradient-to-r dark:from-green-500 dark:to-teal-600 dark:hover:from-green-600 dark:hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-md dark:shadow-lg dark:shadow-green-900/30 transition-all transform hover:-translate-y-0.5">
                Get Started
              </button>
              <button className="flex items-center gap-2 text-green-700 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 font-medium group">
                <PlayCircle className="w-6 h-6 transition-transform group-hover:scale-110" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="flex justify-center relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-teal-400 rounded-3xl opacity-20 dark:opacity-30 blur-xl"></div>
            <img
              src="/logo.png"
              alt="Health Tracker Preview"
              className="rounded-3xl shadow-xl dark:shadow-2xl dark:shadow-gray-900/50 w-full max-w-sm sm:max-w-md relative z-10 border border-gray-200 dark:border-gray-700"
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
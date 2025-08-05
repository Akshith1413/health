import React from 'react';
import {
  BrainCircuit,
  MessageSquareText,
  Activity,
  AlertCircle,
} from 'lucide-react';

const features = [
  {
    icon: <BrainCircuit className="w-8 h-8 text-green-600" />,
    title: 'AI Health Assistant',
    description: 'Get diet, workout, and sleep plans tailored to your behavior patterns with real-time optimization.',
  },
  {
    icon: <MessageSquareText className="w-8 h-8 text-green-600" />,
    title: 'Chat-Based NLP Coach',
    description: 'Interact with your AI assistant using natural language to receive tips, reminders, and advice instantly.',
  },
  {
    icon: <AlertCircle className="w-8 h-8 text-green-600" />,
    title: 'Health Risk Alerts',
    description: 'Receive early warnings for conditions like fatigue, burnout, or weight gain using predictive analytics.',
  },
  {
    icon: <Activity className="w-8 h-8 text-green-600" />,
    title: 'Smart Daily Insights',
    description: 'AI adapts your wellness plan daily by analyzing activity levels and sleep patterns.',
  },
];

const AIHealthAssistantSection = () => {
  return (
    <section className="bg-white py-20 px-4 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
          Smarter Health Starts Here
        </h2>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-12">
          Experience the power of artificial intelligence in your fitness journey. From daily check-ins to predictive insights, your AI coach has your back.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-md transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIHealthAssistantSection;

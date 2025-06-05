import React from 'react';
import { Check, ExternalLink, Mail, Leaf, Zap, Shield } from 'lucide-react';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 5,
    calls: '20 API calls/day',
    description: 'Perfect for small projects and testing',
    features: [
      'Access to plant disease prediction API',
      'Email support',
      'Basic documentation access',
      'Community forum access'
    ],
    popular: false,
    icon: <Leaf className="w-6 h-6" />
  },
  {
    id: 'mid',
    name: 'Professional',
    price: 12,
    calls: '50 API calls/day',
    description: 'Ideal for growing applications',
    features: [
      'All Basic features',
      'Priority email support',
      'Advanced analytics dashboard',
      'Webhook support',
      'Custom rate limits'
    ],
    popular: true,
    icon: <Zap className="w-6 h-6" />
  },
  {
    id: 'premium',
    name: 'Enterprise',
    price: 25,
    calls: 'Unlimited API calls',
    description: 'For production applications at scale',
    features: [
      'All Professional features',
      'Dedicated support channel',
      'Early access to new features',
      'Custom integrations',
      'SLA guarantee',
      'White-label options'
    ],
    popular: false,
    icon: <Shield className="w-6 h-6" />
  }
];

const WORKFLOW_STEPS = [
  {
    step: 1,
    title: 'Choose Your Plan',
    description: 'Select the subscription plan that best fits your needs and usage requirements.'
  },
  {
    step: 2,
    title: 'Complete Payment',
    description: 'Secure checkout process with multiple payment options available.'
  },
  {
    step: 3,
    title: 'Get Your API Key',
    description: 'Receive your unique API key via email within minutes of payment confirmation.'
  },
  {
    step: 4,
    title: 'Start Building',
    description: 'Integrate our API into your application and start detecting plant diseases.'
  }
];

const PlanCard = ({ plan }) => {
  const cardClasses = `
    relative bg-white rounded-xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1
    ${plan.popular 
      ? 'border-green-500 shadow-lg ring-2 ring-green-500 ring-opacity-20' 
      : 'border-gray-200 hover:border-green-300'
    }
  `;

  return (
    <div className={cardClasses}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-green-600">{plan.icon}</div>
          <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
        </div>
        
        <div className="mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
            <span className="text-gray-600">/month</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
        </div>
        
        <div className="mb-6">
          <div className="bg-green-50 rounded-lg p-3 mb-4">
            <p className="font-semibold text-green-800">{plan.calls}</p>
          </div>
        </div>
        
        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        
        <button 
          onClick={() => window.location.href = `/payment-prompt?plan=${plan.id}`}
          className={`
            w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 cursor-pointer
            ${plan.popular
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-900 hover:bg-gray-800 text-white hover:shadow-lg'
            }
          `}
        >
          Choose {plan.name}
        </button>
      </div>
    </div>
  );
};

const WorkflowStep = ({ step, isLast }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0">
      <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
        {step.step}
      </div>
      {!isLast && <div className="w-0.5 h-16 bg-gray-300 mx-auto mt-4"></div>}
    </div>
    <div className="pt-1">
      <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
      <p className="text-gray-600">{step.description}</p>
    </div>
  </div>
);

const Api = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Plant Disease Detection API
            </h1>
            <p className="text-xl mb-8 text-green-100">
              Integrate our advanced machine learning API to detect plant diseases from images 
              with industry-leading accuracy and speed.
            </p>
            <a 
              href="https://plant-disease-api-zwyx.onrender.com/docs#/default/predict_image_predict__post"
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              View API Documentation
            </a>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your needs. All plans include access to our 
            state-of-the-art plant disease detection API.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {PLANS.map(plan => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          
          <div className="max-w-2xl mx-auto">
            {WORKFLOW_STEPS.map((step, index) => (
              <WorkflowStep 
                key={step.step} 
                step={step} 
                isLast={index === WORKFLOW_STEPS.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="text-center mt-16 p-8 bg-green-50 rounded-2xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Need Help Getting Started?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our support team is here to help you integrate our API successfully. 
            Get in touch with any questions about implementation or pricing.
          </p>
          <a 
            href="mailto:support@yourdomain.com"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            <Mail className="w-5 h-5" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default Api;
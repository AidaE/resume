import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { FileText, ArrowRight, Sparkles, CheckCircle, Users, Zap, Shield, BadgeCheck } from 'lucide-react';

interface LandingPageProps {
  currentUser: User | null;
  onGetStarted: () => void;
  onGoToResumes: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentUser,
  onGetStarted,
  onGoToResumes
}) => {
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>('yearly');

  const pricing = {
    monthly: {
      price: 14,
      period: 'month',
      description: ''
    },
    yearly: {
      price: 12,
      period: 'month',
      description: ''
    }
  };

  const currentPricing = pricing[billingCycle];
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                  {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200 rounded-b-2xl w-full md:w-[800px] md:mx-auto">
        <div className="w-full px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 ml-1.5">
              <img 
                src="/logo.png" 
                alt="TheTailored.cv Logo"
                className="w-6 h-6"
              />
              <span className="text-lg font-medium text-gray-900">TheTailored.cv</span>
            </div>
            
            <div className="flex items-center gap-4">
              {currentUser ? (
                <button
                  onClick={onGoToResumes}
                  className="flex items-center gap-2.5 pl-4 pr-3 py-2.5 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors"
                >
                  
                  Your resumes
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-black transition-colors duration-300 group-hover:bg-black group-hover:text-white">
            <ArrowRight className="w-4 h-4" />
          </span>
                </button>
              ) : (
                <button
                  onClick={onGetStarted}
                  className="flex items-center gap-2.5 pl-4 pr-3 py-2.5 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors"
                >
                  
                  Build resumes
                  
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-black transition-colors duration-300 group-hover:bg-black group-hover:text-white">
            <ArrowRight className="w-4 h-4" />
          </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden h-screen">
        <img
          src="/cloud.png"
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
            Stop Sending Generic CVs.
              <span className="text-black-300 block mt-2">Land your dream job.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Tailor your resume to every job in seconds, beat the ATS filters, and get noticed by recruiters.
            </p>
            
            {!currentUser && (
              <div className="flex gap-4 justify-center">
                <button
                  onClick={onGetStarted}
                  className="flex items-center gap-2.5 pl-4 pr-3 py-2.5 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors"
                >
                 
                  Get Started
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-black transition-colors duration-300 group-hover:bg-black group-hover:text-white">
            <ArrowRight className="w-4 h-4" />
          </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Clouds Background Section */}
      <section className="relative overflow-hidden">
  <img
    src="/mdbg.png"
    alt="Clouds background"
    className="absolute inset-0 w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-white/30"></div>

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div className="text-center mb-10 mt-10">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
        Your Career, Your Way
      </h2>
      <p className="text-gray-900 text-lg max-w-2xl mx-auto mb-20">
        Create tailored CVs that pass ATS filters and catch recruiters’ attention — every time you apply.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-6 items-end mb-10">
  {/* Card 1 — Quick Apply */}
  <div className="group relative bg-white/95 backdrop-blur rounded-3xl shadow-xl p-6 md:p-8 flex flex-col justify-between min-h-[320px] overflow-hidden">
    {/* Base content */}
    <div>
      <h3 className="text-3xl font-extrabold text-gray-900 mb-2">Quick Apply</h3>
      <p className="text-gray-600">
        Generate a fully customized CV in under 60 seconds for any job posting.
        <br />
        <span className="font-semibold">+40% more interview callbacks</span>
      </p>
    </div>
    <div className="mt-6">
      <button
        onClick={onGetStarted}
        className="inline-flex items-center justify-between bg-black text-white font-medium pl-4 pr-3 py-2.5 rounded-xl transition-colors duration-300 group-hover:bg-white group-hover:text-black"
      >
        <span className="mr-3">Build Now</span>
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#A1DDFF] text-black transition-colors duration-300 group-hover:bg-black group-hover:text-white">
          <ArrowRight className="w-4 h-4" />
        </span>
      </button>
    </div>

    {/* Hover panel */}
    <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[#9BD8FE] text-gray-900 p-6 md:p-8 flex flex-col justify-between opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 shadow-xl">
      <div>
        <h3 className="text-3xl font-extrabold mb-2">Quick Apply</h3>
        <p className="text-base mb-4">+40% more interview callbacks</p>
        <span className="inline-block bg-white text-gray-900 font-semibold px-4 py-2 rounded-xl -rotate-2 shadow-sm">
          1-click tailoring, minimal edits
        </span>
        <p className="mt-5 text-xs leading-relaxed">
          We scan the job post, mirror the language, and build an ATS-safe layout. You can edit anything before sending.
        </p>
      </div>
      <div className="mt-6 pointer-events-auto">
        <button
          onClick={onGetStarted}
          className="inline-flex items-center justify-between bg-black text-white font-medium pl-4 pr-3 py-2.5 rounded-xl transition-colors duration-300 group-hover:bg-white group-hover:text-black"
        >
          <span className="mr-3">Build Now</span>
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-black transition-colors duration-300 group-hover:bg-black group-hover:text-white">
            <ArrowRight className="w-4 h-4" />
          </span>
        </button>
      </div>
    </div>
  </div>

  {/* Card 2 — ATS Optimized */}
  <div className="group relative bg-white/95 backdrop-blur rounded-3xl shadow-xl p-6 md:p-8 flex flex-col justify-between min-h-[380px] overflow-hidden">
    {/* Base content */}
    <div>
      <h3 className="text-3xl font-extrabold text-gray-900 mb-2">ATS Optimized</h3>
      <p className="text-gray-600">
        Automatically match keywords and formatting to beat applicant tracking systems.
        <br />
        <span className="font-semibold">Avoid up to 70% of automated rejections</span>
      </p>
    </div>
    <div className="mt-6">
      <button
        onClick={onGetStarted}
        className="inline-flex items-center justify-between bg-black text-white font-medium pl-4 pr-3 py-2.5 rounded-xl transition-colors duration-300 group-hover:bg-white group-hover:text-black"
      >
        <span className="mr-3">Optimize My CV</span>
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#A1DDFF] text-black transition-colors duration-300 group-hover:bg-black group-hover:text-white">
          <ArrowRight className="w-4 h-4" />
        </span>
      </button>
    </div>

    {/* Hover panel */}
    <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[#9BD8FE] text-gray-900 p-6 md:p-8 flex flex-col justify-between opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 shadow-xl">
      <div>
        <h3 className="text-3xl font-extrabold mb-2">ATS Optimized</h3>
        <p className="text-base mb-4">Avoid up to 70% of auto rejections</p>
        <span className="inline-block bg-white text-gray-900 font-semibold px-4 py-2 rounded-xl -rotate-2 shadow-sm">
          Keyword match, ATS-safe format
        </span>
        <p className="mt-5 text-xs leading-relaxed">
          We map JD keywords to your experience, normalize headings, and structure content so parsers read it perfectly.
        </p>
      </div>
      <div className="mt-6 pointer-events-auto">
        <button
          onClick={onGetStarted}
          className="inline-flex items-center justify-between bg-black text-white font-medium pl-4 pr-3 py-2.5 rounded-xl transition-colors duration-300 group-hover:bg-white group-hover:text-black"
        >
          <span className="mr-3">Optimize My CV</span>
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-black transition-colors duration-300 group-hover:bg-black group-hover:text-white">
            <ArrowRight className="w-4 h-4" />
          </span>
        </button>
      </div>
    </div>
  </div>

  {/* Card 3 — Multi-Role Ready */}
  <div className="group relative bg-white/95 backdrop-blur rounded-3xl shadow-xl p-6 md:p-8 flex flex-col justify-between min-h-[440px] overflow-hidden">
    {/* Base content */}
    <div>
      <h3 className="text-3xl font-extrabold text-gray-900 mb-2">Multi-Role Ready</h3>
      <p className="text-gray-600">
        Save multiple versions of your CV for different roles and switch in one click.
        <br />
        <span className="font-semibold">Tailor for multiple applications in minutes</span>
      </p>
    </div>
    <div className="mt-6">
      <button
        onClick={onGetStarted}
        className="inline-flex items-center justify-between bg-black text-white font-medium pl-4 pr-3 py-2.5 rounded-xl transition-colors duration-300 group-hover:bg-white group-hover:text-black"
      >
        <span className="mr-3">Start Now</span>
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#A1DDFF] text-black transition-colors duration-300 group-hover:bg-black group-hover:text-white">
          <ArrowRight className="w-4 h-4" />
        </span>
      </button>
    </div>

    {/* Hover panel */}
    <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[#9BD8FE] text-gray-900 p-6 md:p-8 flex flex-col justify-between opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 shadow-xl">
      <div>
        <h3 className="text-3xl font-extrabold mb-2">Multi-Role Ready</h3>
        <p className="text-base mb-4">Tailor for multiple applications in minutes</p>
        <span className="inline-block bg-white text-gray-900 font-semibold px-4 py-2 rounded-xl -rotate-2 shadow-sm">
          One-click role switch
        </span>
        <p className="mt-5 text-xs leading-relaxed">
          Store CVs for different tracks (PM, Data, Design) and swap versions instantly. Syncs with your cover letters, too.
        </p>
      </div>
      <div className="mt-6 pointer-events-auto">
        <button
          onClick={onGetStarted}
          className="inline-flex items-center justify-between bg-black text-white font-medium pl-4 pr-3 py-2.5 rounded-xl transition-colors duration-300 group-hover:bg-white group-hover:text-black"
        >
          <span className="mr-3">Start Now</span>
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-black transition-colors duration-300 group-hover:bg-black group-hover:text-white">
            <ArrowRight className="w-4 h-4" />
          </span>
        </button>
      </div>
    </div>
  </div>
</div>

  </div>
</section>



      {/* Features Section */}
      {/* <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Build the Perfect Resume
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional templates, AI-powered content suggestions, and seamless PDF export
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Multiple Templates</h3>
              <p className="text-gray-600">
                Choose from modern, classic, minimal, and professional templates to match your style
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-gray-600">
                Get intelligent suggestions for content optimization based on job descriptions
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Export</h3>
              <p className="text-gray-600">
                Download your resume as a professional PDF with one click
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* How It Works Section */}
      {/* <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to create your professional resume
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Set Up Your Profile</h3>
              <p className="text-gray-600">
                Add your personal information, work experience, education, and skills
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Template & Customize</h3>
              <p className="text-gray-600">
                Select from multiple professional templates and customize for specific jobs
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Export & Apply</h3>
              <p className="text-gray-600">
                Download your resume as PDF and start applying to your dream jobs
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your Professional Resume?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who have created winning resumes with our platform
          </p>
          
          {!currentUser ? (
            <button
              onClick={onGetStarted}
              className="flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-colors text-lg font-semibold mx-auto"
            >
              <Sparkles className="w-5 h-5" />
              Start Building Now
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onGoToResumes}
              className="flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-colors text-lg font-semibold mx-auto"
            >
              <FileText className="w-5 h-5" />
              Go to Your Resumes
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </section> */}

      {/* Pricing Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background image */}
        <img 
          src="/clouds.jpg" 
          alt="Clouds background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-10 mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Heading */}
            <div className="text-gray-800">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Simple, affordable
                <br />
                pricing with
                <br />
                everything included.
              </h2>
            </div>

            {/* Right side - Pricing card */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              {/* Toggle switch */}
              <div className="flex items-start  mb-6">
                <div className="bg-gray-100 rounded-full p-1 flex">
                  <button 
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
                      billingCycle === 'yearly' 
                        ? 'bg-gray-800 text-white' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Yearly
                  </button>
                  <button 
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
                      billingCycle === 'monthly' 
                        ? 'bg-gray-800 text-white' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  ${currentPricing.price}
                  <span className="text-gray-800 text-2xl font-normal"> / {currentPricing.period}</span>
                </div>
                <p className="text-gray-500 text-sm">
                  {currentPricing.description}
                </p>
              </div>

              {/* Features list */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                 
                    <BadgeCheck className="w-6 h-6 text-blue-600" />
                  
                  <span className="text-gray-700">All resume templates</span>
                </div>
                <div className="flex items-center gap-3">
                 
                  <BadgeCheck className="w-6 h-6 text-blue-600" />
                  
                  <span className="text-gray-700">AI-powered content suggestions</span>
                </div>
                <div className="flex items-center gap-3">
                 
                  <BadgeCheck className="w-6 h-6 text-blue-600" />
                  
                  <span className="text-gray-700">Unlimited PDF exports</span>
                </div>
                <div className="flex items-center gap-3">
                 
                  <BadgeCheck className="w-6 h-6 text-blue-600" />
                  
                  <span className="text-gray-700">Priority support</span>
                </div>
              </div>

              {/* CTA button */}
              <button
                onClick={onGetStarted}
                className="w-full mt-8 bg-gray-800 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-900 transition-colors"
              >
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer 
  className="bg-[url('/footerbg.png')] bg-cover bg-center -mt-8 relative z-20 rounded-t-[2.5rem]"
>
  {/* Green CTA section */}
  <div className="p-12 pt-20">
    <div className="text-center max-w-2xl mx-auto">
      <h3 className="text-5xl font-bold text-gray-900 mb-0 leading-[1.2]">
      Outsmart the algorithms.
      </h3>
      <h3 className="text-5xl font-bold text-gray-900 mb-8 leading-[1.2]">
      Land the interview.
      </h3>
      {/* <p className="text-gray-800 mb-8 text-lg">
        Join thousands of professionals who trust TheTailored.cv to land their dream jobs.
      </p> */}
      <button
  onClick={onGetStarted}
  className="group inline-flex items-center justify-between bg-black text-white font-medium pl-4 pr-3 py-2.5 rounded-xl transition-colors duration-300 hover:bg-white hover:text-black"
>
  <span className="mr-3">Get started</span>
  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#A1DDFF] transition-colors duration-300 group-hover:bg-black">
    <ArrowRight className="w-4 h-4 text-black transition-colors duration-300 group-hover:text-white" />
  </span>
</button>

    </div>
  </div>

  {/* Gray rectangle fully inside green, with side margins */}
  <div className="max-w-7xl mx-auto w-full mt-8">
    <div className="mx-4 sm:mx-6 lg:mx-8">
      <div className="bg-[#19181A] p-8 rounded-xl">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img 
                src="/logowhite.png" 
                alt="TheTailored.cv Logo"
                className="w-6 h-6"
              />
              <span className="text-lg font-medium text-white">TheTailored.cv</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>© 2024 TheTailored.cv. All rights reserved.</span>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Extra green area below gray footer (80px) */}
  <div className="h-20"></div>
</footer>

    </div>
  );
};

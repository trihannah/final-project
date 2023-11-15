// app\page.tsx
import React from 'react';
import LandingPageContent from './landingPage';

export default function LandingPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Dynamic Left Section */}
      <LandingPageContent />

      {/* Static Right Section */}
      <div className="w-1/2 bg-blue-500 p-12 flex flex-col justify-center items-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900 opacity-60" />
        <img
          src="/images/roadinforest.jpg"
          alt="road in forest"
          className="absolute w-full h-full object-cover top-0 left-0"
        />
        <h2 className="text-7xl text-white mb-4 z-10">GreenHabit</h2>
        <p className="text-white text-lg z-10">
          Lorem ipsum dolor sit amet, consetetur
          <br />
          sadipscing elitr, sed diam nonumy eirmod.
        </p>
      </div>
    </div>
  );
}

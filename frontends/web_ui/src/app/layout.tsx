import React, { useState } from "react";
import { Logo } from "(components)/logo";
import { MenuBar } from "(components)/menu-bar";
import MainContent from "pages/main-content";

export default function Layout() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div
      className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans"
      style={{ fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif" }}
    >
      <header
        className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-200 bg-white"
      >
        <Logo />
        <MenuBar />
      </header>
      <main className="flex-grow p-4 sm:p-6">
        <MainContent
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      </main>
    </div>
  );
}

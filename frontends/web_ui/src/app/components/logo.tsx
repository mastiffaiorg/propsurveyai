import React from "react";
import Image from "next/image";

export function Logo() {
  return (
    <div
      className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-0"
    >
      <Image
        src="https://images.squarespace-cdn.com/content/v1/5975fdaf6a49636e876f4033/9249af88-a241-45b6-9f35-ceeeb09a2c93/Reilly+Associates+color+logo.JPG?format=1500w"
        alt="Reilly Associates Logo"
        width={120}
        height={120}
        className="rounded"
      />

      <span
        className="text-2xl sm:text-3xl font-bold text-blue-800 text-center sm:text-left"
        style={{
          fontFamily: "'Orbitron', sans-serif",
          letterSpacing: "0.05em",
        }}
      >
        Property Survey AI
      </span>
    </div>
  );
}

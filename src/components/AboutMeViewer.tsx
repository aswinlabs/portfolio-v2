"use client";

import React, { useState } from "react";
import Image from "next/image";
import siteConfig from "@/config/site.json";

const AboutMeViewer = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="w-full p-4 relative text-base">
      <h2 className="text-3xl mb-4">About Me</h2>
      <hr className="border-t border-dashed border-gray-500 mb-4" />
      
      <div className="w-full mb-2 relative">
        
      {!imageLoaded && (
            <div className="w-full h-64 bg-background rounded-lg border border-foreground/10 relative overflow-hidden">
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(45deg, transparent, transparent 49px, var(--foreground) 49px, var(--foreground) 50px, transparent 50px, transparent)',
                backgroundSize: '70px 70px'
              }}></div>
              
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(-45deg, transparent, transparent 49px, var(--foreground) 49px, var(--foreground) 50px, transparent 50px, transparent)',
                backgroundSize: '70px 70px'
              }}></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-foreground bg-background px-4 py-2 rounded-full shadow-md border border-foreground/20">
                  Loading...
                </div>
              </div>
            </div>
          )}
        <Image
          src="/images/about-cover.webp" 
          alt="Aswin Kumar - Cover"
          width={600}
          height={300}
          className={`w-full h-auto rounded-lg border border-gray-600 ${imageLoaded ? 'block' : 'hidden'}`}
          quality={80}
          priority
          onLoad={() => setImageLoaded(true)}
          loading="eager"
        />
      </div>
      
      <div className="space-y-4 leading-relaxed">
        <p>
          Hey, I&apos;m <strong>Aswin Kumar</strong> — a full-stack developer from Kerala with a passion for building clean, scalable, and user-friendly products from frontend to backend.
        </p>
        <p>
          For me, it&apos;s always problem-solving first and technology second. Whether it&apos;s pixel-perfect interfaces, bulletproof backend logic, or wrestling undocumented APIs until they behave — if it lives on the web, I&apos;ll figure it out and make it fly.
        </p>
        <p className="text-sm opacity-85">
          <strong>TL;DR:</strong> Give me an ambiguous problem, an unfamiliar SDK, and a blank repo — I&apos;ll deliver a shipping product.
        </p>
        <div className="mt-6 pt-4 border-t border-dashed border-gray-500/50 flex items-center gap-5">
          {/* LinkedIn */}
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
            aria-label="LinkedIn Profile"
            className="inline-flex items-center justify-center select-none"
          >
            <Image
              src="/images/linkedin.webp"
              alt="LinkedIn"
              width={24}
              height={24}
              className="object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/aswin.001?igsh=ajQzNW05cXhzZXJn"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
            aria-label="Instagram Profile"
            className="inline-flex items-center justify-center select-none"
          >
            <Image
              src="/images/instagram.webp"
              alt="Instagram"
              width={24}
              height={24}
              className="object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${siteConfig.phone.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`WhatsApp: ${siteConfig.phone}`}
            aria-label="Chat on WhatsApp"
            className="inline-flex items-center justify-center select-none"
          >
            <Image
              src="/images/whatsapp.webp"
              alt="WhatsApp"
              width={24}
              height={24}
              className="object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          </a>

          {/* Email */}
          <a
            href={`mailto:${siteConfig.email}`}
            title={`Email: ${siteConfig.email}`}
            aria-label="Send Email"
            className="inline-flex items-center justify-center select-none"
          >
            <Image
              src="/images/email.webp"
              alt="Email"
              width={24}
              height={24}
              className="object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutMeViewer;
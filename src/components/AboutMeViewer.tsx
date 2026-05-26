"use client";

import React, { useState } from "react";
import Image from "next/image";

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
                Hey, I&apos;m <strong>Aswin Kumar</strong> — a full-stack developer from Kerala with a passion for building clean, scalable, and user-friendly apps.
                I work with React, Node.js, TypeScript, Material-UI, and AWS to bring ideas to life — from frontend to backend and everything in between.
                I love solving problems, learning new things, and crafting experiences that make an impact.
              </p>
        <div className="flex items-center space-x-4 mt-6">
          <a 
            href="https://www.linkedin.com/in/aswinkumar-ts-626a901a0/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            LinkedIn
          </a>
          <a 
            href="https://www.instagram.com/aswin.001?igsh=ajQzNW05cXhzZXJn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-pink-600 hover:text-pink-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutMeViewer;
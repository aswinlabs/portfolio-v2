'use client';

import { useState } from 'react';
import { MessageSquare, MapPin } from 'lucide-react';

const Contact = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="relative w-full py-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="group relative overflow-hidden rounded-md border border-[var(--foreground)] p-3 transition-all duration-300">
          <div className="absolute inset-0 rounded-md bg-gradient-to-b from-[#FF9933] via-white to-[#138808] opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
          <p className="flex items-center text-[var(--primary)] font-bold mb-1 text-sm">
            <MapPin size={14} className="min-w-[14px] mr-1" />
            <span>LOCATION.TXT</span>
          </p>
          <p className="text-xl">India</p>
        </div>

        <div
          className="group relative overflow-hidden cursor-pointer rounded-md border border-[var(--foreground)] hover:border-[var(--primary)] p-3 transition-all duration-300 hover:border-[var(--foreground)]"
          onClick={() => setShowForm(true)}
        >
          <p className="flex items-center text-[var(--primary)] font-bold mb-1 text-sm">
            <MessageSquare size={14} className="min-w-[14px] mr-1" />
            <span>MESSAGE.EXE</span>
          </p>
          <p className="text-xl">Say &quot;Hello&quot; !</p>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40">
          <div className="absolute top-1/2 left-1/2 z-50 w-[500px] max-w-full h-[400px] -translate-x-1/2 -translate-y-1/2 bg-[var(--background)] text-[var(--foreground)] rounded-md border-2 shadow-lg pixelated p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">CONTACT_FORM.EXE</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-red-500 font-bold text-[30px] w-10 h-10 flex items-center justify-center hover:text-red-400 transition-all"
              >
                X
              </button>
            </div>

            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Name"
                className="bg-[var(--background)] text-[var(--foreground)] border border-[var(--foreground)] p-2 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                className="bg-[var(--background)] text-[var(--foreground)] border border-[var(--foreground)] p-2 rounded"
              />
              <textarea
                rows={4}
                placeholder="Your message..."
                className="bg-[var(--background)] text-[var(--foreground)] border border-[var(--foreground)] p-2 rounded resize-none"
              />
                <button
                    type="submit"
                    className="font-bold py-2 px-4 rounded-lg bg-[var(--foreground)] text-[var(--background)] 
                    border-b-4 border-[#6d4a32] hover:border-b-2 hover:translate-y-0.5 
                    transition-all active:border-b-0 active:translate-y-1">
                    SEND
                </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;

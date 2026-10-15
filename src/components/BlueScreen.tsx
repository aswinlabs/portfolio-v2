'use client';

import { useEffect, useState } from 'react';

const BlueScreen=({ onClose }: { onClose: () => void })=> {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = new Audio('/music/error.mp3');
    audio.play().catch(() => {});
    return () => audio.pause(); 
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 100));
    }, 300);
    const timeout = setTimeout(onClose, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onClose]);

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] bg-blue-700 text-white p-8 flex flex-col font-mono"
    >
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <h1 className="text-5xl mb-8 font-bold">{":("}</h1>
        <p className="text-2xl mb-4">
          Portfolio OS has encountered a critical error and needs to restart.
        </p>
        <p className="mb-8 text-xl">
          We&apos;re collecting some system information, and then we&apos;ll reboot for you.
        </p>

        <p className="text-sm mb-2">{Math.floor(progress)}% complete</p>
        <div className="w-full max-w-md bg-blue-800 h-6 mt-2 mb-12">
          <div
            className="bg-blue-400 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-lg space-y-4">
          <p>
            If you&apos;d like to know more, you can search online later for this error:<br />
            <span className="font-bold">CRITICAL_PORTFOLIO_FAILURE</span>
          </p>
          <p className="text-base">
            For more information about this issue and possible fixes, visit:<br />
            <a href="https://www.linkedin.com/in/aswinkumar-ts-626a901a0/" className="underline">
            https://www.linkedin.com/in/aswinkumar-ts;
            </a>
          </p>
        </div>
      </div>

      <div className="text-right mt-6">
        <p className="text-sm">Stop code: CRITICAL_POSTIOFLO_FAILURE</p>
        <p className="text-xs mt-2">Error ID: 0x000000EF</p>
      </div>
    </div>
  );
}
export default BlueScreen

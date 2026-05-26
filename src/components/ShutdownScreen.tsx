import { jersey_15 } from '../app/fonts';

const ShutdownScreen = () => {
  return (
    <div className={`fixed inset-0 z-50 bg-black flex flex-col items-start justify-center p-4 overflow-auto ${jersey_15.className}`}>
      <div className="w-full max-w-5xl text-left mx-auto p-6">
        <p className="text-white text-2xl mb-4">Portfolio_OS v1.2.5 Shutdown</p>
        <p className="text-green-500 text-xl mb-8">System shutdown in progress...</p>

        <div className="text-gray-300 text-lg">
          <p className="mb-3">[0.000000] Initiating system shutdown sequence</p>
          <p className="mb-3">[0.132456] Sending SIGTERM to all processes</p>

          {[
            'Stopping system services',
            'Unmounting filesystems',
            'Saving session data',
            'Terminating processes',
          ].map((text, i) => (
            <p
              key={text}
              className="mb-2 text-amber-400 opacity-0"
              style={{ animation: `fadeIn 0.5s ${i * 0.5 + 0.5}s forwards` }}
            >
              [{(i * 0.5 + 0.5).toFixed(6)}] {text}
            </p>
          ))}
        </div>

        <div className="mt-8 text-white text-xl">
          <div className="relative w-full h-8 bg-gray-900 border border-gray-700">
            <div className="absolute left-0 top-0 bottom-0 bg-green-600 animate-[progress_3s_forwards]"></div>
          </div>
          <p className="text-green-400 mt-6 text-left opacity-0" style={{ animation: 'fadeIn 0.5s 3s forwards' }}>
            [3.215678] System halted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShutdownScreen;

import { jersey_15 } from '../app/fonts';

const PowerScreen=({ onPowerOn }: { onPowerOn: () => void })=> {
  return (
    <div className={`fixed inset-0 bg-black flex items-center justify-center ${jersey_15.className}`}>
      <div className="text-center flex flex-col items-center">
        <button
          onClick={onPowerOn}
          className="w-24 h-24 rounded-full bg-gray-800 hover:bg-gray-700 transition-all flex items-center justify-center border border-gray-700 group shadow-lg"
          aria-label="Power on"
        >
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-12 h-12 text-green-500">
              <path 
                fill="currentColor" 
                d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A1,1 0 0,0 11,7V13A1,1 0 0,0 12,14A1,1 0 0,0 13,13V7A1,1 0 0,0 12,6Z"
              />
            </svg>
          </div>
        </button>
        <p className="text-lg mt-1 text-white">Power</p>
      </div>
    </div>
  );
}

export default PowerScreen
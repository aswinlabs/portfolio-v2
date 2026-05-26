'use client';

interface StartButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

const StartButton = ({ onClick }: StartButtonProps) => {
  return (
    <button 
      onClick={onClick}
      className="h-8 px-3 bg-[color:var(--button)] hover:bg-[color:var(--button-hover)] 
                border-t-2 border-l-2 border-[color:var(--button-light)] 
                border-r-2 border-b-2 border-[color:var(--button-dark)] 
                active:border-[color:var(--button-pressed)] flex items-center justify-center 
                text-sm font-bold text-[color:var(--button-text)]"
    >
      <span className="mr-2">Start</span>
    </button>
  );
};

export default StartButton;
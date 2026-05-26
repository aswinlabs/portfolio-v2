'use client';
import Image from 'next/image';
import clsx from 'clsx';
import useIndiaTime from '@/hooks/useIndiaTime';

const Profile = () => {
  const { isActive } = useIndiaTime(true);

  return (
    <div className="flex items-center justify-start border-b border-dashed border-gray-500 pb-4 overflow-y-auto">
      <div className="relative w-20 h-20 mr-4 rounded-full border border-dashed border-gray-500 shrink-0">
        <Image
          src="/images/profile.webp"
          alt="A"
          fill
          className="object-cover object-top rounded-full"
          sizes="80px"
          priority
        />
        <div
          className={clsx(
            'absolute bottom-1 right-1 w-4 h-4 rounded-full z-[10] shadow-lg transition-colors duration-200',
            {
              'bg-green-500 shadow-green-500/50': isActive,
              'bg-gray-400 shadow-gray-400/50': !isActive,
            }
          )}
          aria-label={isActive ? 'Active now (8AM–8PM IST)' : 'Away (8PM–8AM IST)'}
        />
      </div>

      <div className="flex flex-col">
        <h1 className="font-semibold leading-snug text-xl sm:text-2xl md:text-4xl">
          Aswinkumar TS
        </h1>
        <p className="text-md">SDE @ Experion</p>
      </div>
    </div>
  );
};

export default Profile;

import React from 'react';
import Profile from './Profile';
import Contact from './Contact';
import Description from './Description';
import MusicPlayer from './MusicPlayer';
import { ProfileTabProps } from '@/types';

const ProfileTab = ({ shouldStopMusic, musicCommand }: ProfileTabProps) => {
  return (
    <div className="w-full md:pr-4 flex flex-col min-h-full md:justify-evenly md:space-y-0 space-y-6">
      <div>
        <Profile />
        <Contact />
        <MusicPlayer stopPlaying={shouldStopMusic} command={musicCommand} />
      </div>

      <div className="pt-4">
        <Description />
      </div>
    </div>
  );
};

export default ProfileTab;

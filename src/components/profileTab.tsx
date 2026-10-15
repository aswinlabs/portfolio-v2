import Contact from './Contact';
import Description from './Description';
import Profile from './Profile';
import MusicPlayer from './MusicPlayer';
import { ProfileTabProps } from '@/types';

const ProfileTab = ({ shouldStopMusic, musicCommand }: ProfileTabProps) => {
  return (
    <div className="w-full md:pr-4 flex flex-col md:min-h-full gap-6">
      <div>
        <Profile />
        <Contact />
      </div>

      <div>
        <Description />
      </div>

      <MusicPlayer stopPlaying={shouldStopMusic} command={musicCommand} />
    </div>
  );
};

export default ProfileTab

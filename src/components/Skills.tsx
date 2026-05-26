'use client';

import Image from 'next/image';
import { useState } from 'react';

export const skills = [
  { id: 'react', name: 'React', image: '/images/react.webp' },
  { id: 'typescript', name: 'TypeScript', image: '/images/TypeScript.webp' },
  { id: 'nextjs', name: 'Next.js', image: '/images/next.svg' },
  { id: 'go', name: 'Go', image: '/images/go.webp' },
  { id: 'graphql', name: 'GraphQL', image: '/images/GraphQL.webp' },
  { id: 'aws', name: 'AWS', image: '/images/aws.webp' },
  { id: 'mui', name: 'Material UI', image: '/images/materialUI.webp' },
  { id: 'shopify', name: 'Shopify', image: '/images/shopify.webp' },
  { id: 'redux', name: 'Redux', image: '/images/redux.webp' },
  { id: 'pwa', name: 'PWA', image: '/images/exe.webp' },
  { id: 'postgresql', name: 'PostgreSQL', image: '/images/postgreSQL.webp' },
  { id: 'javascript', name: 'JavaScript', image: '/images/javaScript.webp' },
  { id: 'nodejs', name: 'Node.js', image: '/images/nodeJS.webp' },
];

const Skills = () => {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="w-full p-4 relative text-base">
      <h2 className="text-3xl mb-4">Skills</h2>
      <hr className="border-t border-dashed border-gray-500 mb-4" />
      
      <ul className="list-disc list-inside space-y-3">
        {skills.map((skill) => (
          <li key={skill.id} className="flex items-center gap-3">
            <div className="relative w-6 h-6">
              {!loadedImages[skill.id] && (
                <div className="absolute w-6 h-6 bg-gray-200 rounded-sm animate-pulse" />
              )}
              <Image
                src={skill.image}
                alt={skill.name}
                width={24}
                height={24}
                quality={80}
                loading="lazy"
                className="object-contain"
                onLoad={() => handleImageLoad(skill.id)}
              />
            </div>
            <span>{skill.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Skills;
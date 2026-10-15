import siteConfig from '@/config/site.json';

const Description = () => {
  return (
    <div className="leading-relaxed">
      <h2 className="text-2xl mb-3">{siteConfig.role}</h2>
      <p className="font-sans text-base leading-relaxed">{siteConfig.summary}</p>
      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-lg">
        <a className="underline underline-offset-4 focus-visible:outline-2" href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        <a className="underline underline-offset-4 focus-visible:outline-2" href={`mailto:${siteConfig.email}`}>Email me ↗</a>
      </div>
    </div>
  );
};

export default Description;

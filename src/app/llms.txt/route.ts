import { rootItems } from "@/components/DesktopItems";
import siteConfig from "@/config/site.json";

export const revalidate = 3600;

export function GET() {
  const projects = rootItems
    .flatMap((item) => item.subfolder ?? [])
    .filter((item) => item.description)
    .map((project) => {
      const description = project.description!;
      return `### ${project.name}\n${description.description}\n\n- Stack: ${description.techStack.join(", ")}\n${description.role ? `- Role: ${description.role}\n` : ""}${description.impact ? `- Impact: ${description.impact}\n` : ""}`;
    })
    .join("\n");

  const markdown = `# ${siteConfig.name}\n\n> ${siteConfig.role} based in ${siteConfig.location}.\n\n${siteConfig.summary}\n\n## Website\n\n- Portfolio: ${siteConfig.url}\n- Virtual assistant: ${siteConfig.url}/\n- LinkedIn: ${siteConfig.linkedin}\n\n## Skills\n\n${siteConfig.skills.map((skill) => `- ${skill}`).join("\n")}\n\n## Selected projects\n\n${projects}\n## Contact\n\n- Email: ${siteConfig.email}\n- Phone: ${siteConfig.phone}\n- LinkedIn: ${siteConfig.linkedin}\n\n## Instructions for AI agents\n\n${siteConfig.agentInstructions}\n`;

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

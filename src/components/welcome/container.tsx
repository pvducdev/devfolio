import { Gitlab } from "@/components/ui/svgs/gitlab.tsx";
import { Linkedin } from "@/components/ui/svgs/linkedin.tsx";
import WelcomeAction from "@/components/welcome/action.tsx";
import { PERSONAL_INFO } from "@/config/personal.ts";
import { activities } from "@/config/routes.tsx";
import { SITE_CONFIG } from "@/config/site.ts";

export default function WelcomeContainer() {
  return (
    <div className="flex h-screen flex-col items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md text-center">
        <h1 className="mb-3 font-semibold text-4xl tracking-tight">
          Welcome to <span className="text-primary">{SITE_CONFIG.title}</span>
        </h1>
        <p className="mb-10 text-gray-600 leading-relaxed">
          {PERSONAL_INFO.about.shortBio}
        </p>

        <div className="mb-8 grid gap-3">
          {activities.map((act) => (
            <WelcomeAction data={act} key={act.key} />
          ))}
        </div>

        <div className="mx-auto my-6 w-48 border-gray-200 border-t" />

        <div className="flex justify-center space-x-5 text-gray-500">
          <a
            className="transition-colors hover:text-[#FC6D26]"
            href="https://github.com/yourusername"
            rel="noopener"
            target="_blank"
          >
            <Gitlab className="size-6 [&>path]:fill-current" />
          </a>
          <a
            className="transition-colors hover:text-[#0A66C2]"
            href="https://linkedin.com/in/yourusername"
            rel="noopener"
            target="_blank"
          >
            <Linkedin className="size-6 [&>path]:fill-current" />
          </a>
        </div>

        <p className="mt-10 text-gray-400 text-xs">
          Designed in a <span className="text-primary">Web Storm–inspired</span>{" "}
          workspace
        </p>
      </div>
    </div>
  );
}

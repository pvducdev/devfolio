import { FileCode2, Folder, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Gitlab } from "@/components/ui/svgs/gitlab";
import { Linkedin } from "@/components/ui/svgs/linkedin";

export default function PortfolioWelcome() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#fafafa] px-4 font-sans text-[#1e1e1e]">
      <div className="w-full max-w-md text-center">
        <h1 className="mb-3 font-semibold text-4xl tracking-tight">
          Welcome to <span className="text-primary">D’s Portfolio</span>
        </h1>
        <p className="mb-10 text-gray-600 leading-relaxed">
          I craft modern web experiences with clean design and thoughtful code.
          Dive in and explore what I’ve been building.
        </p>

        <div className="mb-8 grid gap-3">
          <Button
            className="justify-center border-gray-300 transition-all hover:border-primary hover:text-primary"
            variant="outline"
          >
            <Folder className="mr-2 h-4 w-4" />
            View Projects
          </Button>
          <Button
            className="justify-center border-gray-300 transition-all hover:border-primary hover:text-primary"
            variant="outline"
          >
            <FileCode2 className="mr-2 h-4 w-4" />
            About Me
          </Button>
          <Button
            className="justify-center border-gray-300 transition-all hover:border-primary hover:text-primary"
            variant="outline"
          >
            <Mail className="mr-2 h-4 w-4" />
            Contact
          </Button>
        </div>

        <div className="mx-auto my-6 w-48 border-gray-200 border-t" />

        <div className="flex justify-center space-x-5 text-gray-500">
          <a
            className="transition-colors hover:text-black"
            href="https://github.com/yourusername"
            rel="noopener"
            target="_blank"
          >
            <Gitlab className="size-6 [&>path]:fill-current" />
          </a>
          <a
            className="transition-colors hover:text-blue-700"
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

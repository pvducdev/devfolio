import { Eye } from "lucide-react";
import DownloadAction from "@/components/resume-viewer/download-action.tsx";
import ResumeViewer from "@/components/resume-viewer/pdf-viewer.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Kbd } from "@/components/ui/kbd.tsx";
import { PERSONAL_INFO } from "@/config/personal.ts";
import { action_cancel, ui_resume_title } from "@/paraglide/messages.js";

type ResumeReviewerProps = {
  className?: string;
};

export default function DialogContainer({ className }: ResumeReviewerProps) {
  return (
    <div className={className}>
      <p className="text-xs">{ui_resume_title()}</p>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="size-6 bg-primary text-center text-primary-foreground hover:bg-primary/90"
            size="icon"
          >
            <Eye className="size-3" />
          </Button>
        </DialogTrigger>
        <DialogContent
          className="min-w-150 rounded-xl p-4 sm:max-w-fit"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle className="text-center">
              {PERSONAL_INFO.resume.fileName}
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <ResumeViewer className="h-[70dvh]" url={PERSONAL_INFO.resume.url} />
          <DialogFooter className="sm:justify-center">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                {action_cancel()} <Kbd>Esc</Kbd>
              </Button>
            </DialogClose>
            <DownloadAction
              filename={PERSONAL_INFO.resume.fileName}
              url={PERSONAL_INFO.resume.url}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

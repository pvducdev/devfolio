import {
  msg_error_fileload,
  msg_error_filepath,
  msg_error_pagenotfound,
} from "@/paraglide/messages.js";

interface PageNotFoundProps {
  pageId: string;
}

export default function PageNotFound({ pageId }: PageNotFoundProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <p className="mb-2 text-destructive">{msg_error_fileload()}</p>
        <p className="text-muted-foreground text-sm">
          {msg_error_pagenotfound({ pageId })}
        </p>
        <p className="mt-2 text-muted-foreground text-xs">
          {msg_error_filepath()}
        </p>
      </div>
    </div>
  );
}

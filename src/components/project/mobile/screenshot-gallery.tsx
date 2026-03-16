import { useEffect, useState } from "react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { ProjectConfig } from "@/config/projects";
import { cn } from "@/lib/utils";

interface ScreenshotGalleryProps {
  guides: ProjectConfig["guides"];
}

export default function ScreenshotGallery({ guides }: ScreenshotGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (guides.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="flex items-center gap-1.5 border-border border-b bg-muted/30 px-3 py-2">
          <span className="size-2.5 rounded-full bg-red-500/70" />
          <span className="size-2.5 rounded-full bg-yellow-500/70" />
          <span className="size-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2 flex-1 truncate font-mono text-muted-foreground text-xs">
            {guides[current]?.title}
          </span>
        </div>

        <Carousel opts={{ loop: true }} setApi={setApi}>
          <CarouselContent>
            {guides.map((guide) => (
              <CarouselItem key={guide.src}>
                <img
                  alt={guide.title}
                  className="w-full grayscale transition-[filter] duration-200 active:grayscale-0"
                  height={600}
                  loading="lazy"
                  src={guide.src}
                  width={800}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {guides.length > 1 ? (
        <div className="flex justify-center gap-1.5">
          {guides.map((guide, index) => (
            <button
              className={cn(
                "size-1.5 rounded-full transition-colors",
                index === current ? "bg-foreground" : "bg-muted-foreground/30"
              )}
              key={guide.src}
              onClick={() => api?.scrollTo(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

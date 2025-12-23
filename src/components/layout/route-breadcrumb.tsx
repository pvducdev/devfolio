import { useLocation } from "@tanstack/react-router";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ROUTES } from "@/config/routes.ts";

export default function RouteBreadcrumb() {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  const segments =
    pathname === "/" ? [ROUTES.HOME] : pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList className="list-none gap-1">
        <BreadcrumbItem>
          <BreadcrumbLink className="text-muted-foreground text-xs">
            /
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment) => (
          <Fragment key={segment}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-muted-foreground text-xs">
                {segment}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

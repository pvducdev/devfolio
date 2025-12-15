import { createServerFn } from "@tanstack/react-start";
import { object, optional, parse, string } from "valibot";
import { fetchContributions } from "@/lib/contributions";

const InputSchema = object({
  from: optional(string()),
  to: optional(string()),
});

const fetchContributionsServer = createServerFn()
  .inputValidator((data: unknown) => parse(InputSchema, data))
  .handler(({ data }) => fetchContributions(data));

export default fetchContributionsServer;

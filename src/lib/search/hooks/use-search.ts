import { useMemo, useRef, useState } from "react";
import { useMount } from "@/hooks/use-mount.ts";
import { getAllGrouped, initSearchEngine, searchGrouped } from "../engine";
import { getStaticSearchItems, registerSearchItems } from "../registry";
import { buildCommandItems } from "../sources/commands";
import { buildContentItems } from "../sources/content";
import { buildPageItems } from "../sources/pages";
import type { GroupedResults } from "../types";

export function useSearch() {
  const [query, setQuery] = useState("");
  const isRegistryInitialized = useRef(false);

  useMount(() => {
    if (isRegistryInitialized.current) {
      return;
    }

    const pageItems = buildPageItems();
    const commandItems = buildCommandItems();
    const contentItems = buildContentItems();

    registerSearchItems([...pageItems, ...commandItems, ...contentItems]);
    initSearchEngine([...pageItems, ...commandItems, ...contentItems]);
    isRegistryInitialized.current = true;
  });

  const results: GroupedResults = useMemo(() => {
    const allItems = getStaticSearchItems();

    if (query.trim() === "") {
      return getAllGrouped(allItems);
    }

    return searchGrouped(query);
  }, [query]);

  const hasResults =
    results.pages.length > 0 ||
    results.commands.length > 0 ||
    results.content.length > 0;

  return {
    query,
    setQuery,
    results,
    hasResults,
    clearQuery: () => setQuery(""),
  };
}

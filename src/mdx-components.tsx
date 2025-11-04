import type { MDXComponents } from "mdx/types";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// your components directory.

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Customize MDX components here if needed
    // Example:
    // h1: ({ children }) => <h1 className="custom-class">{children}</h1>,
    ...components,
  };
}

import type { MDXComponents } from "mdx/types";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// your components directory.

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings with consistent typography
    h1: ({ children }) => (
      <h1 className="mb-6 font-bold text-4xl tracking-tight">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 mb-4 font-semibold text-3xl">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-3 font-semibold text-2xl">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-4 mb-2 font-semibold text-xl">{children}</h4>
    ),
    h5: ({ children }) => (
      <h5 className="mt-3 mb-2 font-semibold text-lg">{children}</h5>
    ),
    h6: ({ children }) => (
      <h6 className="mt-2 mb-2 font-semibold text-base">{children}</h6>
    ),

    // Paragraphs with proper spacing
    p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,

    // Links with external link handling
    a: ({ href, children }) => {
      const isExternal = href?.startsWith("http");
      const externalProps = isExternal
        ? { rel: "noopener noreferrer" as const, target: "_blank" as const }
        : {};
      return (
        <a
          className="text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:text-primary/80 hover:decoration-primary/50"
          href={href}
          {...externalProps}
        >
          {children}
        </a>
      );
    },

    // Inline code with subtle background
    code: ({ children, className }) => {
      // Check if this is a code block (has language class)
      const isCodeBlock = className?.startsWith("language-");
      if (isCodeBlock) {
        // Let syntax highlighting handle code blocks
        return <code className={className}>{children}</code>;
      }
      // Style inline code
      return (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground text-sm">
          {children}
        </code>
      );
    },

    // Blockquotes with border accent
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-accent border-l-4 pl-4 text-muted-foreground italic">
        {children}
      </blockquote>
    ),

    // Lists with proper spacing
    ul: ({ children }) => (
      <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,

    // Horizontal rule with subtle styling
    hr: () => <hr className="my-8 border-border" />,

    // Tables with borders and hover effects
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-border">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
    tbody: ({ children }) => (
      <tbody className="divide-y divide-border bg-card">{children}</tbody>
    ),
    tr: ({ children }) => (
      <tr className="transition-colors hover:bg-muted/50">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 text-left font-semibold text-foreground text-sm">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-muted-foreground text-sm">{children}</td>
    ),

    // Pre-formatted text blocks (code blocks)
    pre: ({ children }) => (
      <pre className="my-4 overflow-x-auto rounded-lg bg-card p-4 text-card-foreground">
        {children}
      </pre>
    ),

    // Allow component overrides
    ...components,
  };
}

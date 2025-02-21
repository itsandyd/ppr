"use client"

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
    value: string;
}

export const Markdown = ({
    value
}: MarkdownProps) => {
    // Pre-process the markdown content
    const processedContent = value
        // Handle dangling hyphens before bold text with more specific pattern
        .replace(/([^\n]+)\s+-\s*\n+\s*\*\*([^*]+)\*\*/g, (match, text, boldContent) => {
            return `${text}\n- **${boldContent}**`;
        })
        // Ensure all headers start on a new line
        .replace(/([^\n])#/g, '$1\n#')
        // Handle headers with bold text
        .replace(/#{1,4}\s+\*\*([^*]+)\*\*/g, (match, content) => {
            const level = (match.match(/#/g) || []).length;
            return `\n${'#'.repeat(level)} ${content}\n`;
        })
        // Handle regular headers
        .replace(/#{1,4}\s+([^#\n]+)/g, (match, content) => {
            const level = (match.match(/#/g) || []).length;
            return `\n${'#'.repeat(level)} ${content}\n`;
        })
        // Handle bullet points with bold titles and colons
        .replace(/\n-\s*\*\*([^*:]+):\*\*\s*([^\n]+)/g, '\n\n- **$1:** $2')
        // Handle standalone bold sections with colons
        .replace(/\n\*\*([^*:]+):\*\*/g, '\n\n**$1:**\n')
        // Handle any remaining bold text
        .replace(/([^\n])\*\*([^*]+)\*\*/g, '$1\n\n**$2**\n')
        // Add spacing around bullet points
        .replace(/\n-\s+([^\n]+)/g, '\n\n- $1\n')
        // Add spacing after periods before capital letters
        .replace(/\.\s+([A-Z])/g, '.\n\n$1')
        // Clean up multiple line breaks
        .replace(/\n{3,}/g, '\n\n')
        // Add spacing around sections
        .replace(/(\n[A-Z][^:\n]+:)/g, '\n\n$1')
        // Ensure proper spacing around headers
        .replace(/\n#+\s/g, '\n\n$&')
        .trim();

    console.log('Processed content:', processedContent); // For debugging

    return (
        <div className="prose dark:prose-invert w-full max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ children }) => (
                        <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-xl font-bold mt-5 mb-2">{children}</h3>
                    ),
                    h4: ({ children }) => (
                        <h4 className="text-lg font-bold mt-4 mb-2">{children}</h4>
                    ),
                    p: ({ children }) => (
                        <p className="my-3 leading-relaxed text-base">{children}</p>
                    ),
                    ul: ({ children }) => (
                        <ul className="my-4 ml-6 space-y-2 list-disc">{children}</ul>
                    ),
                    li: ({ children }) => (
                        <li className="leading-relaxed">{children}</li>
                    ),
                    strong: ({ children }) => (
                        <strong className="font-bold text-primary">{children}</strong>
                    ),
                    code({node, inline, className, children, ...props}: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                {...props}
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                className="my-4 rounded-md"
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    }
                }}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    );
} 
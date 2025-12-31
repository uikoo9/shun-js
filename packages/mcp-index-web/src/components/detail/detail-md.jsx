import React, { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import ghcolors from 'react-syntax-highlighter/dist/esm/styles/prism/ghcolors';

/**
 * DetailMarkdown
 */
export const DetailMarkdown = memo(({ content, githubUrl, githubBranch }) => {
  const components = useMemo(
    () => ({
      code({ inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
          <SyntaxHighlighter
            style={ghcolors}
            language={match[1].toLowerCase()}
            PreTag="div"
            wrapLongLines
            showLineNumbers
            lineNumberStyle={{ color: '#999', paddingRight: '1.5em' }}
            customStyle={{ background: '#f6f8fa', borderRadius: '6px' }}
            codeTagProps={{ style: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' } }}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
    }),
    [],
  );

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={components}
      skipHtml={false}
      urlTransform={(url) => {
        if (!(url.startsWith('http') || url.startsWith('https'))) {
          const prefix = `${githubUrl}/raw/${githubBranch}/`;
          const finalUrl = new URL(url, prefix).href;
          return finalUrl;
        }

        return url;
      }}
    >
      {content}
    </ReactMarkdown>
  );
});

import React from 'react';

import './footer.scss';

const projects = [
  { domain: 'webcc.dev', desc: 'Web Claude Code', link: 'https://www.webcc.dev/' },
  { domain: 'viho.fun', desc: 'AI CLI Tool', link: 'https://www.viho.fun/' },
  { domain: 'remotion.cool', desc: 'Video Creation', link: 'https://www.remotion.cool/' },
  { domain: 'mcp-servers.online', desc: 'MCP Server Collection', link: 'https://mcp-servers.online/' },
  { domain: 'aibaiban.com', desc: 'AI Whiteboard', link: 'https://aibaiban.com/' },
  { domain: 'aitubiao.online', desc: 'AI Chart Generator', link: 'https://aitubiao.online/' },
];

const openSource = [
  { name: 'qiao-z', desc: 'Node.js Web Framework', link: 'https://qiao-z.vincentqiao.com/#/' },
  { name: 'qiao-ui', desc: 'React UI Library', link: 'https://qiao-ui.vincentqiao.com/#/' },
  { name: 'qiao-webpack', desc: 'Webpack Scaffolding', link: 'https://qiao-webpack.vincentqiao.com/#/' },
  { name: 'qiao-project', desc: 'Monorepo Tooling', link: 'https://qiao-project.vincentqiao.com/#/' },
  { name: 'qiao-electron-cli', desc: 'Electron Packaging CLI', link: 'https://qiao-electron-cli.vincentqiao.com/#/' },
];

export const CustomFooter = () => {
  return (
    <>
      <footer className="custom-footer">
        <div className="custom-footer-grid">
          {/* Column 1: Projects */}
          <div className="custom-footer-column">
            <h4 className="custom-footer-title">Projects</h4>
            {projects.map((item) => (
              <a
                key={item.domain}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="custom-footer-link"
              >
                {item.domain} - {item.desc}
              </a>
            ))}
          </div>

          {/* Column 2: Open Source */}
          <div className="custom-footer-column">
            <h4 className="custom-footer-title">Open Source</h4>
            {openSource.map((item) => (
              <a
                key={item.name}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="custom-footer-link"
              >
                {item.name} - {item.desc}
              </a>
            ))}
            <a
              href="https://code.vincentqiao.com/#/"
              target="_blank"
              rel="noopener noreferrer"
              className="custom-footer-link custom-footer-link-more"
            >
              More 50+ npm packages →
            </a>
          </div>

          {/* Column 3: More */}
          <div className="custom-footer-column">
            <h4 className="custom-footer-title">More</h4>
            <a
              href="https://blog.vincentqiao.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="custom-footer-link"
            >
              Blog
            </a>
            <a
              href="https://blog.csdn.net/uikoo9"
              target="_blank"
              rel="noopener noreferrer"
              className="custom-footer-link"
            >
              CSDN
            </a>
            <a
              href="https://code.vincentqiao.com/#/"
              target="_blank"
              rel="noopener noreferrer"
              className="custom-footer-link"
            >
              Code Collection
            </a>
          </div>

          {/* Column 4: Contact */}
          <div className="custom-footer-column">
            <h4 className="custom-footer-title">Contact</h4>
            <a
              href="https://github.com/uikoo9"
              target="_blank"
              rel="noopener noreferrer"
              className="custom-footer-link"
            >
              GitHub
            </a>
            <a
              href="https://resume.vincentqiao.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="custom-footer-link"
            >
              Resume
            </a>
            <a href="mailto:hello@vincentqiao.com" className="custom-footer-link">
              hello@vincentqiao.com
            </a>
          </div>
        </div>
      </footer>

      <div className="custom-sub-footer">
        <span>
          © 2026{' '}
          <a
            href="https://www.vincentqiao.com"
            target="_blank"
            rel="noopener noreferrer"
            className="custom-sub-footer-link"
          >
            vincentqiao.com
          </a>
          . All rights reserved.
        </span>
      </div>
    </>
  );
};

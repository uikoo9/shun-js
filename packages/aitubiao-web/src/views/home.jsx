// react
import React from 'react';
import { createRoot } from 'react-dom/client';

// css
import './home.scss';

/**
 * home view
 */
const HomeView = () => {
  const navs = [
    {
      blank: true,
      name: 'AI白板',
      url: 'https://aibaiban.com/',
    },
    {
      blank: true,
      name: 'MCP列表',
      url: 'https://mcp-servers.online/',
    },
  ];
  const navDivs = navs.map((nav, index) => {
    return (
      <li key={index}>
        {nav.blank ? (
          <a href={nav.url} target="_blank" rel="noreferrer">
            {nav.name}
          </a>
        ) : (
          <a href={nav.url}>{nav.name}</a>
        )}
      </li>
    );
  });
  return (
    <div class="h-full">
      <div class="flex flex-col min-h-full">
        <div className="navbar bg-base-100 shadow-sm">
          <div className="navbar-start">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {' '}
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />{' '}
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                {navDivs}
              </ul>
            </div>
            <a className="btn btn-ghost text-xl">AITuBiao.online</a>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">{navDivs}</ul>
          </div>
          <div className="navbar-end">
            <a className="btn">Button</a>
          </div>
        </div>

        <main class="flex-1 bg-gray-100 p-4">
          <h2 class="text-xl mb-4">Container</h2>
          <p>内容区域...</p>
        </main>

        <footer class="bg-gray-800 text-white p-4">
          <p>Footer</p>
        </footer>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<HomeView />);

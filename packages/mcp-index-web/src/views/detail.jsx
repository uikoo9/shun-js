// react
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// css
import './detail.scss';

// ui
import { Header, Breadcrumbs, Footer } from 'qiao-ui';

// md
import { DetailDesc, DetailMarkdown, DetailArtalk } from '@components';

// data
import { reportWebData } from '@util/data.js';

// constants
import { siteName, siteUrl, navs } from '@util/constants.js';

/**
 * DetailView
 */
const DetailView = () => {
  // effect
  useEffect(() => {
    reportWebData('view.detail');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // state
  const [item, setItem] = useState({});
  const [breadcrumbsActiveId, setBreadcrumbsActiveId] = useState(1);

  // effect
  useEffect(() => {
    const data = window.qzServerProperties;
    if (!data) return;

    setItem(data);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container">
      {/* header */}
      <Header logo={siteName} logoUrl={siteUrl} navs={navs} />

      <div className="detail">
        {/* desc */}
        <DetailDesc item={item} />

        <div className="detail-content">
          {/* Breadcrumbs */}
          <Breadcrumbs
            breadcrumbs={[
              {
                id: 1,
                name: '详情',
              },
              {
                id: 2,
                name: '评论',
              },
            ]}
            breadcrumbsActiveId={breadcrumbsActiveId}
            onClick={(id) => {
              setBreadcrumbsActiveId(id);
            }}
          />

          {/* md or artalk */}
          {breadcrumbsActiveId === 1 ? (
            <DetailMarkdown
              content={item.mcp_item_contentzh}
              githubUrl={item.mcp_item_homepage}
              githubBranch={item.mcp_item_branch}
            ></DetailMarkdown>
          ) : (
            <DetailArtalk code={item.mcp_item_code} />
          )}
        </div>
      </div>

      {/* footer */}
      <Footer companyName={siteName} companyUrl={siteUrl} />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<DetailView />);

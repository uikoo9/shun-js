// react
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// css
import './index.scss';

// ui
import { Header, Button, Footer } from 'qiao-ui';

// models
import { store } from '@models';

// components
import { Search, Cards } from '@components';

// services
import { mcpList } from '@services';

// data
import { reportWebData } from '@util/data.js';

// constants
import { siteName, siteUrl, navs } from '@util/constants.js';

/**
 * index view
 */
const IndexView = () => {
  // effect
  useEffect(() => {
    reportWebData('view.index');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // state
  const { mcpServers, setMCPServers, mcpPage, setMCPPage, mcpTotal, setMCPTotal, searchWord, tag, total } = store();

  // load more
  const loadMore = async () => {
    const page = mcpPage + 1;

    // options
    const searchOptions = { page: page };
    if (searchWord) searchOptions.word = searchWord;
    if (tag) searchOptions.tag = tag;

    // search
    const mcpListRes = await mcpList(searchOptions);
    if (!mcpListRes) return;

    // set
    setMCPServers([...mcpServers, ...mcpListRes.rows]);
    setMCPTotal(mcpListRes.total);
    setMCPPage(page);
  };

  // format
  function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <div className="container">
      {/* header */}
      <Header logo={siteName} logoUrl={siteUrl} navs={navs} />

      {/* sitename */}
      <div className="sitename">
        已收录
        <span>{formatNumber(total)}</span>
        个MCP服务器
      </div>

      {/* search */}
      <Search />

      {/* cards */}
      <Cards items={mcpServers} />
      <div className="clear"></div>

      {/* more */}
      {!(mcpServers && mcpServers.length === mcpTotal) ? (
        <div className="more">
          <Button
            text="加载更多..."
            onClick={() => {
              reportWebData('click.btn', 'index.loadmore');
              loadMore();
            }}
          />
        </div>
      ) : null}

      {/* footer */}
      <Footer companyName={siteName} companyUrl={siteUrl} />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<IndexView />);

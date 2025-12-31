// react
import React, { useState, useEffect } from 'react';

// css
import './search.scss';

// ui
import { Input, Button, Breadcrumbs } from 'qiao-ui';

// models
import { store } from '@models';

// services
import { mcpList } from '@services';

// data
import { reportWebData } from '@util/data.js';

/**
 * Search
 */
export const Search = () => {
  // state
  const [tags, setTags] = useState([]);
  const { setMCPServers, setMCPTotal, setMCPPage, setTotal, searchWord, setSearchWord, tag, setTag } = store();

  // effect
  useEffect(() => {
    const serverData = window.qzServerProperties;
    if (!serverData) return;

    // set
    setTotal(serverData.mcps.total);
    setMCPServers(serverData.mcps.rows);
    setMCPTotal(serverData.mcps.total);
    setMCPPage(1);
    setTags(serverData.mcpTags);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // search
  const search = async (options) => {
    const mcpListRes = await mcpList(options);
    if (!mcpListRes) return;

    // set
    setMCPServers(mcpListRes.rows);
    setMCPTotal(mcpListRes.total);
    setMCPPage(1);
  };

  // on reset
  const onReset = () => {
    reportWebData('click.btn', 'search.reset');

    setSearchWord('');
    setTag('');
    search();
  };

  // filter
  const filter = (options) => {
    const searchOptions = {};
    if (searchWord) searchOptions.word = searchWord;
    if (options && options.tag) searchOptions.tag = options.tag;

    // go
    search(searchOptions);
  };

  return (
    <div className="search-container">
      {/* search */}
      <div className="search">
        <div className="search-input">
          <Input
            placeholder="搜索 MCP Server"
            value={searchWord}
            onChange={(e) => {
              setSearchWord(e.target.value);
            }}
          />
        </div>
        <div className="search-btn">
          <Button
            text="搜索"
            onClick={() => {
              reportWebData('click.btn', 'search.search');
              filter({});
            }}
          />
        </div>
        <div className="search-btn">
          <Button text="重置" onClick={onReset} />
        </div>
      </div>

      {/* tags */}
      <div className="options">
        <Breadcrumbs
          breadcrumbs={tags.map((item) => {
            return { id: item, name: item };
          })}
          breadcrumbsActiveId={tag}
          onClick={(id) => {
            reportWebData('click.btn', `tag.${id}`);
            setTag(id);
            filter({ tag: id });
          }}
        />
      </div>
    </div>
  );
};

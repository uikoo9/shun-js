// react
import React from 'react';

// css
import './cards.scss';

// models
import { store } from '@models';

// data
import { reportWebData } from '@util/data.js';

// constants
import { siteUrl } from '@util/constants.js';

/**
 * Cards
 */
export const Cards = () => {
  // state
  const { mcpServers } = store();

  return (
    <div className="content">
      {mcpServers &&
        mcpServers.map((item) => {
          return (
            <div
              className="card"
              key={item.id}
              onClick={() => {
                reportWebData('click.btn', `card.${item.mcp_item_code}`);
                window.open(`${siteUrl}detail/${item.mcp_item_code}`, '_blank');
              }}
            >
              <div className="title">{item.mcp_item_code}</div>
              <div className="desc">{item.mcp_item_desczh}</div>
            </div>
          );
        })}
    </div>
  );
};

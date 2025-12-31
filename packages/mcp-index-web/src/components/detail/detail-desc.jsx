// react
import React from 'react';

// ui
import { Link } from 'qiao-ui';

/**
 * DetailDesc
 */
export const DetailDesc = (props) => {
  // const
  const item = props.item;
  return !item ? null : (
    <>
      <div className="detail-title">{item.mcp_item_code}</div>
      <div className="detail-desc">
        {item.mcp_item_stars ? <div className="detail-desc-item">Stars：{item.mcp_item_stars}</div> : null}
        {item.mcp_item_author ? <div className="detail-desc-item">作者：{item.mcp_item_author}</div> : null}
        {item.mcp_item_language ? <div className="detail-desc-item">语言：{item.mcp_item_language}</div> : null}
        {item.mcp_item_homepage ? (
          <div className="detail-desc-item">
            网址：
            <Link url={item.mcp_item_homepage} txt={item.mcp_item_homepage} blank={true} />
          </div>
        ) : null}
        {item.mcp_item_license ? <div className="detail-desc-item">License：{item.mcp_item_license}</div> : null}
        {item.create_date ? <div className="detail-desc-item">创建时间：{item.create_date}</div> : null}
        {item.update_date ? <div className="detail-desc-item">更新时间：{item.update_date}</div> : null}
        <div className="detail-desc-item">简介：</div>
        <div className="detail-desc-item">{item.mcp_item_desczh}</div>
      </div>
    </>
  );
};

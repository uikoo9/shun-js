// react
import React, { useEffect } from 'react';

// artalk
import 'artalk/Artalk.css';
import Artalk from 'artalk';

/**
 * DetailArtalk
 */
export const DetailArtalk = (props) => {
  // effect
  useEffect(() => {
    if (!props.code) return;

    // artalk init
    Artalk.init({
      site: 'mcp-servers.online', // 站点名
      el: document.querySelector('#artalk'),
      server: 'https://artalk.vincentqiao.com', // 后端地址
      pageKey: `/detail/${props.code}`, // 固定链接
      pageTitle: props.code, // 页面标题
    });
  }, [props.code]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div id="artalk"></div>;
};

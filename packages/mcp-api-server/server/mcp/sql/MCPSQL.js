exports.mcpItemListCount = `
  SELECT 
    count(*) tcount 
  FROM 
    t_mcp_info t 
  WHERE 
    t.del_tag='0'
`;

exports.mcpItemListQuery = `
  SELECT 
    id,
    mcp_item_code,
    mcp_item_author,
    mcp_item_stars,
    mcp_item_language,
    mcp_item_license,
    mcp_item_homepage,
    mcp_item_desc,
    mcp_item_desczh,
    create_date,
    update_date
  FROM 
    t_mcp_info t 
  WHERE 
    t.del_tag='0'
`;

exports.addMCPSearchWord = `
insert into t_mcp_search values(null, '1', ?, now(), '0')
`;

exports.addMCPSearchTag = `
insert into t_mcp_search values(null, '2', ?, now(), '0')
`;

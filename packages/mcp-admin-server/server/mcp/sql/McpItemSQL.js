exports.mcpItemGetById = `
  select 
    * 
  from 
    t_mcp_item t 
  where 
    t.id=? 
  and 
    t.del_tag='0'
`;

exports.mcpItemAdd = `
  insert into 
    t_mcp_item(id, mcp_info_id, mcp_item_code, mcp_item_desczh, mcp_item_prompt, mcp_item_url, update_date, create_date, del_tag) 
  values
    (null, ?, ?, ?, ?, ?, ?,  now(), '0')
`;

exports.mcpItemEdit = `
  update 
    t_mcp_item t 
  set 
    t.mcp_info_id=?, 
    t.mcp_item_code=?, 
    t.mcp_item_desczh=?, 
    t.mcp_item_prompt=?, 
    t.mcp_item_url=?, 
    t.update_date=?, 
    
    t.del_tag='0' 
  where 
    t.id=? 
  and 
    t.del_tag='0'
`;

exports.mcpItemDel = `
  update 
    t_mcp_item t 
  set 
    t.del_tag='1' 
  where 
    t.id in (?)
`;

exports.mcpItemListCount = `
  SELECT 
    count(*) tcount 
  FROM 
    t_mcp_item t 
  WHERE 
    t.del_tag='0'
`;

exports.mcpItemListQuery = `
  SELECT 
    * 
  FROM 
    t_mcp_item t 
  WHERE 
    t.del_tag='0'
`;

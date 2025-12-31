exports.mcpInfoGetById = `
  select 
    * 
  from 
    t_mcp_info t 
  where 
    t.id=? 
  and 
    t.del_tag='0'
`;

exports.mcpInfoAdd = `
  insert into 
    t_mcp_info(id, mcp_item_code, mcp_item_author, mcp_item_stars, mcp_item_language, mcp_item_license, mcp_item_homepage, mcp_item_branch, mcp_item_tag, mcp_item_desc, mcp_item_desczh, mcp_item_content, mcp_item_contentzh, update_date, create_date, del_tag) 
  values
    (null, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  now(), '0')
`;

exports.mcpInfoEdit = `
  update 
    t_mcp_info t 
  set 
    t.mcp_item_code=?, 
    t.mcp_item_author=?, 
    t.mcp_item_stars=?, 
    t.mcp_item_language=?, 
    t.mcp_item_license=?, 
    t.mcp_item_homepage=?, 
    t.mcp_item_branch=?, 
    t.mcp_item_tag=?, 
    t.mcp_item_desc=?, 
    t.mcp_item_desczh=?, 
    t.mcp_item_content=?, 
    t.mcp_item_contentzh=?, 
    t.update_date=?, 
    
    t.del_tag='0' 
  where 
    t.id=? 
  and 
    t.del_tag='0'
`;

exports.mcpInfoDel = `
  update 
    t_mcp_info t 
  set 
    t.del_tag='1' 
  where 
    t.id in (?)
`;

exports.mcpInfoListCount = `
  SELECT 
    count(*) tcount 
  FROM 
    t_mcp_info t 
  WHERE 
    t.del_tag='0'
`;

exports.mcpInfoListQuery = `
  SELECT 
    * 
  FROM 
    t_mcp_info t 
  WHERE 
    t.del_tag='0'
`;

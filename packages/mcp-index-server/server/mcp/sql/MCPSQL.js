exports.getMCPDetailByCode = `
select
  id,
  mcp_item_code,
  mcp_item_author,
  mcp_item_stars,
  mcp_item_language,
  mcp_item_license,
  mcp_item_homepage,
  mcp_item_branch,
  mcp_item_tag,
  mcp_item_desc,
  mcp_item_desczh,
  mcp_item_contentzh,
  create_date,
  update_date
from 
  t_mcp_info
where
  mcp_item_code = ?
and 
  del_tag='0'
`;

exports.addMCPSearchDetail = `
insert into t_mcp_search values(null, '3', ?, now(), '0')
`;

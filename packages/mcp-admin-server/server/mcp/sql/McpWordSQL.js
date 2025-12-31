exports.mcpWordGetById = `
  select 
    * 
  from 
    t_mcp_word t 
  where 
    t.id=? 
  and 
    t.del_tag='0'
`;

exports.mcpWordAdd = `
  insert into 
    t_mcp_word(id, mcp_word_content, mcp_word_order, create_date, del_tag) 
  values
    (null, ?, ?,  now(), '0')
`;

exports.mcpWordEdit = `
  update 
    t_mcp_word t 
  set 
    t.mcp_word_content=?, 
    t.mcp_word_order=?, 
    
    t.del_tag='0' 
  where 
    t.id=? 
  and 
    t.del_tag='0'
`;

exports.mcpWordDel = `
  update 
    t_mcp_word t 
  set 
    t.del_tag='1' 
  where 
    t.id in (?)
`;

exports.mcpWordListCount = `
  SELECT 
    count(*) tcount 
  FROM 
    t_mcp_word t 
  WHERE 
    t.del_tag='0'
`;

exports.mcpWordListQuery = `
  SELECT 
    * 
  FROM 
    t_mcp_word t 
  WHERE 
    t.del_tag='0'
`;

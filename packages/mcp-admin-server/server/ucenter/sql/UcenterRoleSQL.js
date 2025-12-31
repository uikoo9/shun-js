exports.ucenterRoleGetById = `
  select 
    * 
  from 
    t_ucenter_role t 
  where 
    t.id=? 
  and 
    t.del_tag='0'
`;

exports.ucenterRoleAdd = `
  insert into 
    t_ucenter_role(id, ucenter_role_name, ucenter_role_url, create_date, del_tag) 
  values
    (null, ?, ?,  now(), '0')
`;

exports.ucenterRoleEdit = `
  update 
    t_ucenter_role t 
  set 
    t.ucenter_role_name=?, 
    t.ucenter_role_url=?, 
    
    t.del_tag='0' 
  where 
    t.id=? 
  and 
    t.del_tag='0'
`;

exports.ucenterRoleDel = `
  update 
    t_ucenter_role t 
  set 
    t.del_tag='1' 
  where 
    t.id in (?)
`;

exports.ucenterRoleListCount = `
  SELECT 
    count(*) tcount 
  FROM 
    t_ucenter_role t 
  WHERE 
    t.del_tag='0'
`;

exports.ucenterRoleListQuery = `
  SELECT 
    * 
  FROM 
    t_ucenter_role t 
  WHERE 
    t.del_tag='0'
`;

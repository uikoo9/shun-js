exports.ucenterRoleuserGetById = `
  select 
    * 
  from 
    t_ucenter_roleuser t 
  where 
    t.id=? 
  and 
    t.del_tag='0'
`;

exports.ucenterRoleuserAdd = `
  insert into 
    t_ucenter_roleuser(id, ucenter_role_id, ucenter_user_id, create_date, del_tag) 
  values
    (null, ?, ?,  now(), '0')
`;

exports.ucenterRoleuserEdit = `
  update 
    t_ucenter_roleuser t 
  set 
    t.ucenter_role_id=?, 
    t.ucenter_user_id=?, 
    
    t.del_tag='0' 
  where 
    t.id=? 
  and 
    t.del_tag='0'
`;

exports.ucenterRoleuserDel = `
  update 
    t_ucenter_roleuser t 
  set 
    t.del_tag='1' 
  where 
    t.id in (?)
`;

exports.ucenterRoleuserListCount = `
  SELECT 
    count(*) tcount 
  FROM 
    t_ucenter_roleuser t 
  WHERE 
    t.del_tag='0'
`;

exports.ucenterRoleuserListQuery = `
  SELECT 
    * 
  FROM 
    t_ucenter_roleuser t 
  WHERE 
    t.del_tag='0'
`;

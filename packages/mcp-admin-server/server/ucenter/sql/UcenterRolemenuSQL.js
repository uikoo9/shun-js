exports.ucenterRolemenuGetById = `
  select 
    * 
  from 
    t_ucenter_rolemenu t 
  where 
    t.id=? 
  and 
    t.del_tag='0'
`;

exports.ucenterRolemenuAdd = `
  insert into 
    t_ucenter_rolemenu(id, ucenter_role_id, ucenter_menu_id, create_date, del_tag) 
  values
    (null, ?, ?,  now(), '0')
`;

exports.ucenterRolemenuEdit = `
  update 
    t_ucenter_rolemenu t 
  set 
    t.ucenter_role_id=?, 
    t.ucenter_menu_id=?, 
    
    t.del_tag='0' 
  where 
    t.id=? 
  and 
    t.del_tag='0'
`;

exports.ucenterRolemenuDel = `
  update 
    t_ucenter_rolemenu t 
  set 
    t.del_tag='1' 
  where 
    t.id in (?)
`;

exports.ucenterRolemenuListCount = `
  SELECT 
    count(*) tcount 
  FROM 
    t_ucenter_rolemenu t 
  WHERE 
    t.del_tag='0'
`;

exports.ucenterRolemenuListQuery = `
  SELECT 
    * 
  FROM 
    t_ucenter_rolemenu t 
  WHERE 
    t.del_tag='0'
`;

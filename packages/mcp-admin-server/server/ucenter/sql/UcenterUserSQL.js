exports.ucenterUserGetById = `
  select 
    * 
  from 
    t_ucenter_user t 
  where 
    t.id=? 
  and 
    t.del_tag='0'
`;

exports.ucenterUserAdd = `
  insert into 
    t_ucenter_user(id, ucenter_user_name, ucenter_user_password, create_date, del_tag) 
  values
    (null, ?, ?,  now(), '0')
`;

exports.ucenterUserEdit = `
  update 
    t_ucenter_user t 
  set 
    t.ucenter_user_name=?, 
    t.ucenter_user_password=?, 
    
    t.del_tag='0' 
  where 
    t.id=? 
  and 
    t.del_tag='0'
`;

exports.ucenterUserDel = `
  update 
    t_ucenter_user t 
  set 
    t.del_tag='1' 
  where 
    t.id in (?)
`;

exports.ucenterUserListCount = `
  SELECT 
    count(*) tcount 
  FROM 
    t_ucenter_user t 
  WHERE 
    t.del_tag='0'
`;

exports.ucenterUserListQuery = `
  SELECT 
    * 
  FROM 
    t_ucenter_user t 
  WHERE 
    t.del_tag='0'
`;

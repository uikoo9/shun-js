exports.ucenterMenuGetById = `
  select 
    * 
  from 
    t_ucenter_menu t 
  where 
    t.id=? 
  and 
    t.del_tag='0'
`;

exports.ucenterMenuAdd = `
  insert into 
    t_ucenter_menu(id, ucenter_menu_parent, ucenter_menu_sn, ucenter_menu_title, ucenter_menu_url, create_date, del_tag) 
  values
    (null, ?, ?, ?, ?, now(), '0')
`;

exports.ucenterMenuEdit = `
  update 
    t_ucenter_menu t 
  set 
    t.ucenter_menu_parent=?, 
    t.ucenter_menu_sn=?, 
    t.ucenter_menu_title=?, 
    t.ucenter_menu_url=?, 
    
    t.del_tag='0' 
  where 
    t.id=? 
  and 
    t.del_tag='0'
`;

exports.ucenterMenuDel = `
  update 
    t_ucenter_menu t 
  set 
    t.del_tag='1' 
  where 
    t.id in (?)
`;

exports.ucenterMenuListCount = `
  SELECT 
    count(*) tcount 
  FROM 
    t_ucenter_menu t 
  WHERE 
    t.del_tag='0'
`;

exports.ucenterMenuListQuery = `
  SELECT 
    * 
  FROM 
    t_ucenter_menu t 
  WHERE 
    t.del_tag='0'
`;

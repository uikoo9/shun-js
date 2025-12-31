exports.userLogin = `
  SELECT 
    * 
  FROM 
    t_ucenter_user t 
  WHERE 
    t.del_tag='0' 
  AND 
    t.ucenter_user_name=? 
  AND 
    t.ucenter_user_password=?
`;

exports.userGetById = `
  select 
    * 
  from 
    t_ucenter_user 
  where 
    id=? 
  and 
    del_tag='0'
`;

exports.userMenus = `
  SELECT 
    t1.* 
  FROM 
    t_ucenter_menu t1 
  WHERE 
    t1.id IN
    (
      SELECT 
        DISTINCT(t2.ucenter_menu_id) 
      FROM 
        t_ucenter_rolemenu t2, 
        t_ucenter_roleuser t3 
      WHERE 
        t2.ucenter_role_id=t3.ucenter_role_id 
      AND 
        t3.ucenter_user_id=? 
      AND 
        t2.del_tag='0' 
      AND 
        t3.del_tag='0'
    ) 
  AND 
    t1.del_tag='0' 
  ORDER BY 
    t1.ucenter_menu_sn ASC
`;

exports.userMenusRoot = `
  SELECT 
    t1.* 
  FROM 
    t_ucenter_menu t1 
  WHERE 
    t1.id IN
    (
      SELECT 
        DISTINCT(t2.ucenter_menu_id) 
      FROM 
        t_ucenter_rolemenu t2, 
        t_ucenter_roleuser t3 
      WHERE 
        t2.ucenter_role_id=t3.ucenter_role_id 
      AND 
        t3.ucenter_user_id=? 
      AND 
        t2.del_tag='0' 
      AND 
        t3.del_tag='0'
    ) 
  AND 
    t1.ucenter_menu_parent = '0' 
  AND 
    t1.del_tag='0' 
  ORDER BY 
    t1.ucenter_menu_sn ASC
`;

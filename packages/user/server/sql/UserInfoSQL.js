exports.isUserInfoExists = `
select 
  1 
from 
  t_user_info 
where 
  user_item_id=?
and 
  del_tag='0'
LIMIT 1
`;

exports.addUserInfo = `
insert into 
  t_user_info 
values
  (null, ?, ?, ?, ?, now(), '0')
`;

exports.getUserInfoById = `
select 
  * 
from 
  t_user_info 
where 
  user_item_id=?
and 
  del_tag='0'
LIMIT 1
`;

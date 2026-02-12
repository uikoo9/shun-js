exports.getUserInfoById = `
select 
  * 
from 
  t_user_info 
where 
  user_item_id=1
and 
  del_tag='0'
`;

exports.addUserInfo = `
insert into 
  t_user_info 
values
  (null, ?, ?, ?, ?, now(), '0')
`;

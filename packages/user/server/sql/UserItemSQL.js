exports.getUserItemByName = `
select 
  * 
from 
  t_user_item 
where 
  user_item_name=? 
and 
  del_tag='0'
`;

exports.addUserItem = `
insert into 
  t_user_item 
values
  (null, ?, ?, ?, now(), '0')
`;

exports.getUserItemById = `
select 
  * 
from 
  t_user_item 
where 
  id=? 
and 
  del_tag='0'
`;

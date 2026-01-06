exports.pvTotal = `
select 
  count(id) as pvTotal 
from 
  t_data 
where 
  data_app_name='aitubiao.online' 
and 
  DATE(data_date)=? 
and 
  data_event_name like '%view.%'
`;

exports.uvTotal = `
select 
  COUNT(DISTINCT data_web_id) as uvTotal 
from 
  t_data 
where 
  data_app_name='aitubiao.online' 
and 
  DATE(data_date)=? 
and 
  data_event_name like '%view.%'
`;

exports.clickTotal = `
select 
  count(id) as clickTotal 
from 
  t_data 
where 
  data_app_name='aitubiao.online' 
and 
  DATE(data_date)=? 
and 
  data_event_name = 'click.btn' 
and 
  data_event_detail=?
`;

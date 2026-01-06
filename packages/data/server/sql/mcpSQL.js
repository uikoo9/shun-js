exports.pvTotal = `
select 
  count(id) as pvTotal 
from 
  t_data 
where 
  data_app_name='mcp-servers.online' 
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
  data_app_name='mcp-servers.online' 
and 
  DATE(data_date)=? 
and 
  data_event_name like '%view.%'
`;

exports.pvIndexTotal = `
select 
  count(id) as pvIndexTotal 
from 
  t_data 
where 
  data_app_name='mcp-servers.online' 
and 
  DATE(data_date)=? 
and 
  data_event_name = 'view.index'
`;

exports.uvIndexTotal = `
select 
  COUNT(DISTINCT data_web_id) as uvIndexTotal 
from 
  t_data 
where 
  data_app_name='mcp-servers.online' 
and 
  DATE(data_date)=? 
and 
  data_event_name = 'view.index'
`;

exports.pvDetailTotal = `
select 
  count(id) as pvDetailTotal 
from 
  t_data 
where 
  data_app_name='mcp-servers.online' 
and 
  DATE(data_date)=? 
and 
  data_event_name = 'view.detail'
`;

exports.uvDetailTotal = `
select 
  COUNT(DISTINCT data_web_id) as uvDetailTotal 
from 
  t_data 
where 
  data_app_name='mcp-servers.online' 
and 
  DATE(data_date)=? 
and 
  data_event_name = 'view.detail'
`;

exports.pvChatTotal = `
select 
  count(id) as pvChatTotal 
from 
  t_data 
where 
  data_app_name='mcp-servers.online' 
and 
  DATE(data_date)=? 
and 
  data_event_name = 'view.chat'
`;

exports.uvChatTotal = `
select 
  COUNT(DISTINCT data_web_id) as uvChatTotal 
from 
  t_data 
where 
  data_app_name='mcp-servers.online' 
and 
  DATE(data_date)=? 
and 
  data_event_name = 'view.chat'
`;

exports.tagClickTotal = `
select 
  count(id) as tagClickTotal 
from 
  t_data 
where 
  data_app_name='mcp-servers.online' 
and 
  DATE(data_date)=? 
and 
  data_event_name = 'click.btn' 
and 
  data_event_detail like 'tag%'
`;

exports.cardClickTotal = `
select 
  count(id) as cardClickTotal 
from 
  t_data 
where 
  data_app_name='mcp-servers.online' 
and 
  DATE(data_date)=? 
and 
  data_event_name = 'click.btn' 
and 
  data_event_detail like 'card%'
`;

exports.clickTotal = `
select 
  count(id) as clickTotal 
from 
  t_data 
where 
  data_app_name='mcp-servers.online' 
and 
  DATE(data_date)=? 
and 
  data_event_name = 'click.btn' 
and 
  data_event_detail=?
`;

CREATE DATABASE db_data CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `t_data`;
CREATE TABLE `t_data` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `data_app_name` text NOT NULL COMMENT '数据项目',
  `data_web_id` text NOT NULL COMMENT '数据网页id',
  `data_user_id` text NOT NULL COMMENT '数据用户id',
  `data_event_name` text NOT NULL COMMENT '数据事件名称',
  `data_event_detail` text NOT NULL COMMENT '数据事件详情',
  `data_date` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci;

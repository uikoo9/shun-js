CREATE DATABASE db_recommend CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `t_recommend`;
CREATE TABLE `t_recommend` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `recommend_user_id` text NOT NULL COMMENT '用户id',
  `recommend_newuser_id` text NOT NULL COMMENT '新用户id',
  `recommend_exchange` char(1) NOT NULL COMMENT '是否已经兑换，0否1是',
  `data_date` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci;

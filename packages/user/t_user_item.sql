CREATE DATABASE db_user CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

--
-- Table structure for table `t_user_item`
--
CREATE TABLE `t_user_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `user_item_name` varchar(200) NOT NULL COMMENT '用户名',
  `user_item_password` varchar(200) NOT NULL COMMENT '用户密码',
  `create_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `del_tag` char(1) NOT NULL COMMENT '是否删除，0否，1是',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci;

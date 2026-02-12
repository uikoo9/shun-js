CREATE DATABASE db_user CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

--
-- Table structure for table `t_user_info`
--
CREATE TABLE `t_user_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `user_item_id` int(11) NOT NULL COMMENT '用户id',
  `user_info_name` varchar(200) NOT NULL COMMENT '用户名',
  `user_info_avatar` varchar(200) NOT NULL COMMENT '用户头像',
  `user_info_email` varchar(200) NOT NULL COMMENT '用户邮箱',
  `create_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `del_tag` char(1) NOT NULL COMMENT '是否删除，0否，1是',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_user_item_id_del_tag ON t_user_info(user_item_id, del_tag);

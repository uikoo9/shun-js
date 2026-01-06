CREATE DATABASE db_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `t_app`;
CREATE TABLE `t_app` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `app_name` text NOT NULL COMMENT 'app名称',
  `app_version` text NOT NULL COMMENT 'app版本号',
  `app_zip` text NOT NULL COMMENT 'app更新包地址',
  `app_path` text NOT NULL COMMENT 'app本地包地址',
  `app_date` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci;

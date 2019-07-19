CREATE TABLE IF NOT EXISTS `user_corresp_log` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `action` enum('GET','PUT','DELETE') NOT NULL,
  `uid` binary(7) DEFAULT NULL,
  `student` varchar(127) DEFAULT NULL,
  `login` varchar(127) NOT NULL,
  `query_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
);
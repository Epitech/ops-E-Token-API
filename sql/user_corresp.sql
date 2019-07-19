CREATE TABLE IF NOT EXISTS `user_corresp` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` binary(7) NOT NULL,
  `login` varchar(127) NOT NULL,
  `last_modified` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`),
  UNIQUE KEY `uid` (`uid`)
);
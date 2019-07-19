CREATE TABLE IF NOT EXISTS `activities` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `activity_name` varchar(127) NOT NULL,
  `student_login` varchar(127) NOT NULL,
  `student_present` enum('present','absent') DEFAULT NULL,
  `query_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `activity_name` (`activity_name`,`student_login`)
);
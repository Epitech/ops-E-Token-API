CREATE TABLE IF NOT EXISTS `activities_log` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `activity_name` varchar(127) NOT NULL,
  `activity_action` enum('GET','PUT','DELETE') NOT NULL,
  `activity_action_student_login` varchar(127) DEFAULT NULL,
  `activity_action_student_present` enum('present','absent') DEFAULT NULL,
  `activity_action_login` varchar(127) NOT NULL,
  `query_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
);
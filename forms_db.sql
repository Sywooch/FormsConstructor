-- MySQL dump 10.13  Distrib 5.7.12, for Win32 (AMD64)
--
-- Host: localhost    Database: clockwor_forms_db
-- ------------------------------------------------------
-- Server version	5.7.19-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `dic_file_type`
--

DROP TABLE IF EXISTS `dic_file_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dic_file_type` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dic_file_type`
--

LOCK TABLES `dic_file_type` WRITE;
/*!40000 ALTER TABLE `dic_file_type` DISABLE KEYS */;
INSERT INTO `dic_file_type` VALUES (1,'image'),(2,'user_upload');
/*!40000 ALTER TABLE `dic_file_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dic_param_type`
--

DROP TABLE IF EXISTS `dic_param_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dic_param_type` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dic_param_type`
--

LOCK TABLES `dic_param_type` WRITE;
/*!40000 ALTER TABLE `dic_param_type` DISABLE KEYS */;
INSERT INTO `dic_param_type` VALUES (1,'form'),(2,'element'),(3,'setting');
/*!40000 ALTER TABLE `dic_param_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `folder`
--

DROP TABLE IF EXISTS `folder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `folder` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `folder`
--

LOCK TABLES `folder` WRITE;
/*!40000 ALTER TABLE `folder` DISABLE KEYS */;
INSERT INTO `folder` VALUES (1,1,'folder100',NULL),(14,1,'folder_99',1),(16,1,'folder_99',14),(17,1,'folder_100',16),(18,1,'folder_101',17),(19,1,'folder_66',14),(20,1,'folder_67',19),(21,1,'folder 22',NULL),(22,1,'ttest',29),(29,1,'another folder new',NULL),(30,1,'folder',NULL),(31,1,'fu folder',29),(35,3,'user folder',NULL),(36,3,'another user folder',NULL),(37,3,'folder inside folder',36),(40,1,'new folder',NULL),(41,1,'fff folder',29);
/*!40000 ALTER TABLE `folder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `folder_to_form`
--

DROP TABLE IF EXISTS `folder_to_form`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `folder_to_form` (
  `folder_id` int(11) NOT NULL,
  `form_id` int(11) NOT NULL,
  KEY `fk_folder_id_idx` (`folder_id`),
  KEY `fk_form_id_idx` (`form_id`),
  CONSTRAINT `fk_folder_id` FOREIGN KEY (`folder_id`) REFERENCES `folder` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_form_id` FOREIGN KEY (`form_id`) REFERENCES `form` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `folder_to_form`
--

LOCK TABLES `folder_to_form` WRITE;
/*!40000 ALTER TABLE `folder_to_form` DISABLE KEYS */;
INSERT INTO `folder_to_form` VALUES (1,9),(36,13),(37,14),(30,6),(36,38),(1,41),(29,3),(29,43);
/*!40000 ALTER TABLE `folder_to_form` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form`
--

DROP TABLE IF EXISTS `form`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `form` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `form_params` text CHARACTER SET utf8,
  `form_settings` text COLLATE utf8_unicode_ci,
  `form_elements` text CHARACTER SET utf8,
  `is_active` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form`
--

LOCK TABLES `form` WRITE;
/*!40000 ALTER TABLE `form` DISABLE KEYS */;
INSERT INTO `form` VALUES (1,1,'2017-08-22 21:11:16','!black and yellow','{\"2\":\"#ffff00\",\"3\":\"#000000\",\"4\":\"#ffffff\",\"5\":\"#111111\",\"6\":\"450px\",\"7\":\"15px\",\"8\":\"left\",\"9\":\"190px\",\"10\":\"Courier New, Courier, monospace\",\"11\":\"18px\",\"25\":\"#ffff00\",\"35\":\"#ff0000\",\"36\":\"\",\"38\":\"1\"}','{\"37\":\"<p style=\\\"text-align: center;\\\">Thank you!</p>\",\"40\":\"1\",\"41\":\"i.clockworktoy@gmail.com\",\"42\":1328}','[[{\"id\":3,\"number\":2,\"params\":{\"14\":\"Page#1\",\"15\":\"right\"}},{\"id\":5,\"number\":0,\"params\":{\"16\":\"<p style=\\\"text-align: center;\\\">Custom text content.</p>\\n<p style=\\\"text-align: center;\\\">Add form description here.</p>\"}},{\"id\":10,\"number\":1,\"params\":{\"21\":\"uploads/1/1/8630594bc8d19a1687.84136761.jpg\",\"22\":\"center\",\"23\":\"420px\",\"24\":\"315px\"}},{\"id\":1,\"number\":0,\"params\":{\"1\":\"Letters field\",\"34\":\"1\",\"39\":\"alphabetic\"}},{\"id\":1,\"number\":1,\"params\":{\"1\":\"Numbers field\",\"34\":\"1\",\"39\":\"numeric\"}},{\"id\":4,\"number\":0,\"params\":{\"1\":\"Textarea\",\"34\":\"0\",\"39\":\"\"}},{\"id\":11,\"number\":0,\"params\":{\"1\":\"Date\",\"26\":\"dd.mm.yyyy\",\"27\":\"1\",\"34\":\"1\"}},{\"id\":12,\"number\":0,\"params\":{\"1\":\"Time\",\"28\":\"AM/PM\",\"29\":\"5\",\"34\":\"1\"}},{\"id\":9,\"number\":0,\"params\":{\"20\":\"#ffff00\"}},{\"id\":3,\"number\":1,\"params\":{\"14\":\"Another Header\",\"15\":\"right\"}},{\"id\":6,\"number\":0,\"params\":{\"1\":\"Select Field\",\"17\":\"Option#1\\nOption#2\\nOption#3\",\"34\":\"0\"}},{\"id\":7,\"number\":0,\"params\":{\"1\":\"Radio Inputs\",\"18\":\"Button#1\\nButton#2\",\"34\":\"0\"}},{\"id\":8,\"number\":0,\"params\":{\"1\":\"Checkboxes\",\"19\":\"Box#1\\nBox#2\\nBox#3\\nBox#4\",\"34\":\"1\"}},{\"id\":5,\"number\":1,\"params\":{\"16\":\"<p style=\\\"text-align: right;\\\">Another custom text content</p>\"}},{\"id\":9,\"number\":1,\"params\":{\"20\":\"#ffff00\"}},{\"id\":13,\"number\":0,\"params\":{\"30\":\"Back\",\"31\":\"Next\",\"32\":\"1\",\"33\":\"distribute\"}}],[{\"id\":3,\"number\":3,\"params\":{\"14\":\"Page#2\",\"15\":\"right\"}},{\"id\":1,\"number\":4,\"params\":{\"1\":\"Label on p2\",\"34\":\"1\",\"39\":\"\"}},{\"id\":13,\"number\":1,\"params\":{\"30\":\"Back\",\"31\":\"Next\",\"32\":\"1\",\"33\":\"distribute\"}}],[{\"id\":3,\"number\":4,\"params\":{\"14\":\"Page#3\",\"15\":\"right\"}},{\"id\":1,\"number\":3,\"params\":{\"1\":\"Label on p3\",\"34\":\"1\",\"39\":\"\"}},{\"id\":13,\"number\":2,\"params\":{\"30\":\"Back\",\"31\":\"Next\",\"32\":\"1\",\"33\":\"distribute\"}},{\"id\":2,\"number\":0,\"params\":{\"12\":\"Submit\",\"13\":\"right\"}}]]',''),(2,1,'2017-08-22 21:11:16','second form','{\"2\":\"#f5f5f5\",\"3\":\"#d3d3d3\",\"4\":\"#333333\",\"5\":\"#ffffff\",\"6\":\"690px\",\"7\":\"12px\",\"8\":\"left\",\"9\":\"150px\",\"10\":\"Tahoma, Geneva, sans-serif\",\"11\":\"14px\",\"25\":\"#555555\",\"35\":\"#ff0000\",\"36\":\"#00ff00\",\"38\":\"1\"}','{\"37\":\"<p>Form submited</p>\",\"40\":\"1\",\"41\":\"i.clockworktoy@gmail.com\",\"42\":81}','[[{\"id\":1,\"number\":0,\"params\":{\"1\":\"Label\",\"34\":\"1\",\"39\":\"\"}}]]',''),(3,1,'2017-08-22 21:11:16','third form sdfsdfs sdfsdf','{}',NULL,'[[]]',''),(6,1,'2017-08-22 21:11:16','test form 123','{}',NULL,'[[]]',''),(7,1,'2017-08-22 21:11:16','form under main','{\"2\":\"#f5f5f5\",\"3\":\"#ffffff\",\"4\":\"#333333\",\"5\":\"#ffffff\",\"6\":\"500px\",\"7\":\"12px\",\"8\":\"left\",\"9\":\"150px\",\"10\":\"Tahoma, Geneva, sans-serif\",\"11\":\"14px\"}','{\"40\":\"1\"}','[[{\"id\":1,\"number\":0,\"params\":{\"1\":\"Label\"}},{\"id\":1,\"number\":1,\"params\":{\"1\":\"Label\"}},{\"id\":1,\"number\":2,\"params\":{\"1\":\"Label\"}},{\"id\":2,\"number\":0,\"params\":{\"12\":\"Submit\",\"13\":\"right\"}}]]',''),(9,1,'2017-08-22 21:11:16','new form in folder1','{}',NULL,'[[]]',''),(10,3,'2017-08-22 21:11:16','user form','{}',NULL,'[[]]',''),(11,3,'2017-08-22 21:11:16','form 2','{}',NULL,'[[]]',''),(12,3,'2017-08-22 21:11:16','form 33','{}',NULL,'[[]]',''),(13,3,'2017-08-22 21:11:16','form form form','{}',NULL,'[[]]',''),(14,3,'2017-08-22 21:11:16','another form','{}',NULL,'[[]]',''),(15,1,'2017-08-22 21:11:16','folder 33 form','{}','{\"40\":\"0\"}','[[]]',''),(16,1,'2017-08-22 21:11:16','folder 33 form #2','{}','{\"40\":\"0\"}','[[]]',''),(17,1,'2017-08-22 21:11:16','form under aaa','{}','{\"40\":\"0\"}','[[]]',''),(18,1,'2017-08-22 21:11:16','form under bbb','{}','{\"40\":\"0\"}','[[]]',''),(19,1,'2017-08-22 21:11:16','form under ccc','{}','{\"40\":\"0\"}','[[]]',''),(20,1,'2017-08-22 21:11:16','form under main','{}','{\"40\":\"0\"}','[[]]',''),(37,3,'2017-08-22 21:11:16','reg form','{}',NULL,'[[]]',''),(38,3,'2017-08-22 21:11:16','rrr','{}',NULL,'[[]]',''),(41,1,'2017-08-22 21:11:16','test123','{}',NULL,'[[]]',''),(43,1,'2017-08-22 21:11:16','form in another folder  3','{}',NULL,'[[]]',''),(45,1,'2017-08-22 21:11:16','last form','{}','{\"40\":\"0\"}','[[]]','');
/*!40000 ALTER TABLE `form` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_element`
--

DROP TABLE IF EXISTS `form_element`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `form_element` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `label` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `img` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `is_active` bit(1) NOT NULL DEFAULT b'1',
  `order` int(11) DEFAULT NULL,
  `is_system` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_element`
--

LOCK TABLES `form_element` WRITE;
/*!40000 ALTER TABLE `form_element` DISABLE KEYS */;
INSERT INTO `form_element` VALUES (1,'text_field','Text Field','edit','',1,0),(2,'submit_button','Submit','share','',99,0),(3,'header','Header','header','',0,0),(4,'text_area','Text Area','edit','',2,0),(5,'content_block','Content Block','comment','',8,0),(6,'select_field','Select Field','menu-hamburger','',3,0),(7,'radio_field','Radio Buttons','record','',4,0),(8,'checkbox_field','Checkboxes','check','',5,0),(9,'separator','Separator','minus','',10,0),(10,'image','Image','picture','',9,0),(11,'date_field','Date','calendar','',6,0),(12,'time_field','Time','time','',7,0),(13,'navigation_buttons','Navigation Buttons','resize-horizontal','',999,1);
/*!40000 ALTER TABLE `form_element` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_element_to_param`
--

DROP TABLE IF EXISTS `form_element_to_param`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `form_element_to_param` (
  `form_element_id` int(11) NOT NULL,
  `param_id` int(11) NOT NULL,
  `default_value` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  KEY `fk_form_element_id_idx` (`form_element_id`),
  KEY `fk_param_id_idx` (`param_id`),
  CONSTRAINT `fk_form_element_id` FOREIGN KEY (`form_element_id`) REFERENCES `form_element` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_param_id` FOREIGN KEY (`param_id`) REFERENCES `param` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_element_to_param`
--

LOCK TABLES `form_element_to_param` WRITE;
/*!40000 ALTER TABLE `form_element_to_param` DISABLE KEYS */;
INSERT INTO `form_element_to_param` VALUES (1,1,NULL),(2,12,'Submit'),(2,13,NULL),(3,14,NULL),(3,15,NULL),(4,1,NULL),(5,16,NULL),(6,1,NULL),(6,17,NULL),(7,1,NULL),(7,18,NULL),(8,1,NULL),(8,19,NULL),(9,20,NULL),(10,21,NULL),(10,22,NULL),(10,23,NULL),(10,24,NULL),(11,1,NULL),(11,26,NULL),(11,27,NULL),(12,1,NULL),(12,28,NULL),(12,29,NULL),(13,30,NULL),(13,31,NULL),(13,32,NULL),(13,33,NULL),(1,34,NULL),(4,34,NULL),(6,34,NULL),(7,34,NULL),(8,34,NULL),(11,34,NULL),(12,34,NULL),(1,39,NULL),(4,39,NULL);
/*!40000 ALTER TABLE `form_element_to_param` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_file`
--

DROP TABLE IF EXISTS `form_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `form_file` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `file_type` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_file`
--

LOCK TABLES `form_file` WRITE;
/*!40000 ALTER TABLE `form_file` DISABLE KEYS */;
INSERT INTO `form_file` VALUES (5,'8630594bc8d19a1687.84136761.jpg',1),(6,'25724594bc910dd2235.14004985.jpeg',1),(7,'3358594bcd3caadbd2.62136600.jpg',1),(8,'8731594bcd46dc5156.59748333.jpg',1),(9,'9915594bcd52665076.92071538.jpg',1),(10,'3777594bcd732e21a7.23888110.jpg',1),(11,'29420594bcd7cde0c69.95283177.jpg',1),(14,'31037594c6390c0df15.63168342.jpg',1),(17,'17761594c63d466fed8.93504895.jpg',1);
/*!40000 ALTER TABLE `form_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_submission`
--

DROP TABLE IF EXISTS `form_submission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `form_submission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `form_id` int(11) NOT NULL,
  `is_new` tinyint(1) NOT NULL DEFAULT '1',
  `sub_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `client_ip` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `form_submission` text CHARACTER SET utf8,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_submission`
--

LOCK TABLES `form_submission` WRITE;
/*!40000 ALTER TABLE `form_submission` DISABLE KEYS */;
INSERT INTO `form_submission` VALUES (12,1,1,'2017-08-08 17:05:34',NULL,'[{\"id\":1,\"number\":0,\"label\":\"Letters field\",\"value\":\"gfd\"},{\"id\":1,\"number\":1,\"label\":\"Numbers field\",\"value\":\"333\"},{\"id\":4,\"number\":0,\"label\":\"Textarea\",\"value\":\"sdfsdf\\nfgh\\n456\"},{\"id\":11,\"number\":0,\"label\":\"Date\",\"value\":\"31.08.2017\"},{\"id\":12,\"number\":0,\"label\":\"Time\",\"value\":\"09:35 AM\"},{\"id\":6,\"number\":0,\"label\":\"Select Field\",\"value\":\"Option#2\"},{\"id\":7,\"number\":0,\"label\":\"Radio Inputs\",\"value\":\"Button#2\"},{\"id\":8,\"number\":0,\"label\":\"Checkboxes\",\"value\":\"Box#1<br \\/>Box#2<br \\/>Box#3<br \\/>Box#4\"},{\"id\":1,\"number\":4,\"label\":\"Label on p2\",\"value\":\",nm,n,\"},{\"id\":1,\"number\":3,\"label\":\"Label on p3\",\"value\":\"ghjkhjk\"}]'),(13,1,1,'2017-08-09 20:53:36',NULL,'[{\"id\":1,\"number\":0,\"label\":\"Letters field\",\"value\":\"asd\"},{\"id\":1,\"number\":1,\"label\":\"Numbers field\",\"value\":\"23\"},{\"id\":4,\"number\":0,\"label\":\"Textarea\",\"value\":\"\"},{\"id\":11,\"number\":0,\"label\":\"Date\",\"value\":\"09.08.2017\"},{\"id\":12,\"number\":0,\"label\":\"Time\",\"value\":\"02:25 AM\"},{\"id\":6,\"number\":0,\"label\":\"Select Field\",\"value\":\"Option#1\"},{\"id\":7,\"number\":0,\"label\":\"Radio Inputs\",\"value\":\"Button#1\"},{\"id\":8,\"number\":0,\"label\":\"Checkboxes\",\"value\":\"Box#2<br \\/>Box#3<br \\/>Box#4\"},{\"id\":1,\"number\":4,\"label\":\"Label on p2\",\"value\":\"vvvv\"},{\"id\":1,\"number\":3,\"label\":\"Label on p3\",\"value\":\"jjjj\"}]'),(14,1,0,'2017-08-11 20:19:37',NULL,'[{\"id\":1,\"number\":0,\"label\":\"Letters field\",\"value\":\"asd\"},{\"id\":1,\"number\":1,\"label\":\"Numbers field\",\"value\":\"111\"},{\"id\":4,\"number\":0,\"label\":\"Textarea\",\"value\":\"111\\r\\ndfgssdfg\\r\\nhhh\"},{\"id\":11,\"number\":0,\"label\":\"Date\",\"value\":\"11.08.2017\"},{\"id\":12,\"number\":0,\"label\":\"Time\",\"value\":\"02:05 AM\"},{\"id\":6,\"number\":0,\"label\":\"Select Field\",\"value\":\"Option#1\"},{\"id\":7,\"number\":0,\"label\":\"Radio Inputs\",\"value\":\"Button#1\"},{\"id\":8,\"number\":0,\"label\":\"Checkboxes\",\"value\":\"Box#2\\r\\nBox#3\\r\\nBox#4\"},{\"id\":1,\"number\":4,\"label\":\"Label on p2\",\"value\":\"zzz\"},{\"id\":1,\"number\":3,\"label\":\"Label on p3\",\"value\":\"ooo\"}]'),(15,1,1,'2017-08-11 20:21:40',NULL,'[{\"id\":1,\"number\":0,\"label\":\"Letters field\",\"value\":\"aaa\"},{\"id\":1,\"number\":1,\"label\":\"Numbers field\",\"value\":\"333\"},{\"id\":4,\"number\":0,\"label\":\"Textarea\",\"value\":\"asdas\\r\\n567\"},{\"id\":11,\"number\":0,\"label\":\"Date\",\"value\":\"11.08.2017\"},{\"id\":12,\"number\":0,\"label\":\"Time\",\"value\":\"01:10 AM\"},{\"id\":6,\"number\":0,\"label\":\"Select Field\",\"value\":\"Option#1\"},{\"id\":7,\"number\":0,\"label\":\"Radio Inputs\",\"value\":\"Button#2\"},{\"id\":8,\"number\":0,\"label\":\"Checkboxes\",\"value\":\"Box#2\\r\\nBox#3\"},{\"id\":1,\"number\":4,\"label\":\"Label on p2\",\"value\":\"mmm\"},{\"id\":1,\"number\":3,\"label\":\"Label on p3\",\"value\":\"nnn\"}]'),(16,1,0,'2017-08-17 07:02:44','::1','[{\"id\":1,\"number\":0,\"label\":\"Letters field\",\"value\":\"letters\"},{\"id\":1,\"number\":1,\"label\":\"Numbers field\",\"value\":\"1234567890\"},{\"id\":4,\"number\":0,\"label\":\"Textarea\",\"value\":\"asdfg\\r\\ngjh ghjghj\\r\\nfgh 123\"},{\"id\":11,\"number\":0,\"label\":\"Date\",\"value\":\"18.08.2017\"},{\"id\":12,\"number\":0,\"label\":\"Time\",\"value\":\"08:00 PM\"},{\"id\":6,\"number\":0,\"label\":\"Select Field\",\"value\":\"Option#1\"},{\"id\":7,\"number\":0,\"label\":\"Radio Inputs\",\"value\":\"Button#2\"},{\"id\":8,\"number\":0,\"label\":\"Checkboxes\",\"value\":\"Box#1\\r\\nBox#2\"},{\"id\":1,\"number\":4,\"label\":\"Label on p2\",\"value\":\"p2\"},{\"id\":1,\"number\":3,\"label\":\"Label on p3\",\"value\":\"p3\"}]');
/*!40000 ALTER TABLE `form_submission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_to_form_file`
--

DROP TABLE IF EXISTS `form_to_form_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `form_to_form_file` (
  `form_id` int(11) NOT NULL,
  `form_file_id` int(11) NOT NULL,
  KEY `fk_form_to_file_form_id_idx` (`form_id`),
  KEY `fk_form_to_file_file_id_idx` (`form_file_id`),
  CONSTRAINT `fk_form_to_form_file_form_file_id` FOREIGN KEY (`form_file_id`) REFERENCES `form_file` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_form_to_form_file_form_id` FOREIGN KEY (`form_id`) REFERENCES `form` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_to_form_file`
--

LOCK TABLES `form_to_form_file` WRITE;
/*!40000 ALTER TABLE `form_to_form_file` DISABLE KEYS */;
INSERT INTO `form_to_form_file` VALUES (1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,14),(1,17);
/*!40000 ALTER TABLE `form_to_form_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_view`
--

DROP TABLE IF EXISTS `form_view`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `form_view` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `form_id` int(11) NOT NULL,
  `view_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `client_ip` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_view`
--

LOCK TABLES `form_view` WRITE;
/*!40000 ALTER TABLE `form_view` DISABLE KEYS */;
INSERT INTO `form_view` VALUES (1,1,'2017-08-17 07:18:21','::1'),(2,1,'2017-08-17 07:20:04','::1'),(3,1,'2017-08-17 07:20:14','::1'),(4,1,'2017-09-16 13:58:57','::1'),(5,1,'2017-09-16 14:01:23','::1');
/*!40000 ALTER TABLE `form_view` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migration`
--

DROP TABLE IF EXISTS `migration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migration` (
  `version` varchar(180) NOT NULL,
  `apply_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migration`
--

LOCK TABLES `migration` WRITE;
/*!40000 ALTER TABLE `migration` DISABLE KEYS */;
INSERT INTO `migration` VALUES ('m000000_000000_base',1492509758),('m140209_132017_init',1492509904),('m140403_174025_create_account_table',1492509906),('m140504_113157_update_tables',1492509911),('m140504_130429_create_token_table',1492509913),('m140830_171933_fix_ip_field',1492509914),('m140830_172703_change_account_table_name',1492509914),('m141222_110026_update_ip_field',1492509915),('m141222_135246_alter_username_length',1492509916),('m150614_103145_update_social_account_table',1492509918),('m150623_212711_fix_username_notnull',1492509919),('m151218_234654_add_timezone_to_profile',1492509919),('m160929_103127_add_last_login_at_to_user_table',1492509920);
/*!40000 ALTER TABLE `migration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `param`
--

DROP TABLE IF EXISTS `param`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `param` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `label` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `help_text` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `default_value` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `param_type` tinyint(4) NOT NULL,
  `order_group` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `is_active` bit(1) NOT NULL DEFAULT b'1',
  `is_system` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `param`
--

LOCK TABLES `param` WRITE;
/*!40000 ALTER TABLE `param` DISABLE KEYS */;
INSERT INTO `param` VALUES (1,'label_text','Label Text',NULL,'Label',2,NULL,'',0),(2,'page_color','Page Color',NULL,'#f5f5f5',1,'page_0','',0),(3,'form_color','Form Color',NULL,'#fff',1,'page_1','',0),(4,'font_color','Font Color',NULL,'#333',1,'page_font_2','',0),(5,'input_background','Input Background',NULL,'#fff',1,'page_input','',0),(6,'form_width','Form Width',NULL,'500px',1,'page_2','',0),(7,'question_spacing','Question Spacing',NULL,'12px',1,'page_3','',0),(8,'label_alignment','Label Alignment',NULL,'left',1,'page_label','',0),(9,'label_width','Label Width',NULL,'150px',1,'page_label','',0),(10,'font','Font',NULL,'Tahoma, Geneva, sans-serif',1,'page_font_0','',0),(11,'font_size','Font Size',NULL,'14px',1,'page_font_1','',0),(12,'button_text','Button Text',NULL,'Button',2,NULL,'',0),(13,'button_alignment','Button Alignment',NULL,'right',2,NULL,'',0),(14,'header_text','Header Text',NULL,'Header',2,NULL,'',0),(15,'header_alignment','Header Alignment',NULL,'left',2,NULL,'',0),(16,'html_content','Content',NULL,'<p>Edit content...</p>',2,NULL,'',0),(17,'options_list','Options','Each new line represents separate option.','Option#1\nOption#2\nOption#3',2,NULL,'',0),(18,'radios_list','Options','Each new line represents separate option.','Button#1\nButton#2\nButton#3',2,NULL,'',0),(19,'checkboxes_list','Options','Each new line represents separate option.','Box#1\nBox#2\nBox#3',2,NULL,'',0),(20,'separator_color','Color',NULL,'#ccc',2,NULL,'',0),(21,'upload_img','Image',NULL,'',2,NULL,'',0),(22,'img_alignment','Image Alignment',NULL,'center',2,NULL,'',0),(23,'img_width','Width',NULL,'128px',2,NULL,'',0),(24,'img_height','Height',NULL,'128px',2,NULL,'',0),(25,'input_text_color','Input Text Color',NULL,'#555',1,'page_input','',0),(26,'date_format','Date Format','d, dd: Numeric date, no leading zero and leading zero<br />D, DD: Abbreviated and full weekday names<br />m, mm: Numeric month, no leading zero and leading zero<br />M, MM: Abbreviated and full month names<br />yyyy: 4-digit years','dd.mm.yyyy',2,NULL,'',0),(27,'date_firstweekday','First Day of the Week',NULL,'1',2,NULL,'',0),(28,'time_format','Time Format',NULL,'24 hours',2,NULL,'',0),(29,'time_minute_stepping','Minute Stepping',NULL,'5',2,NULL,'',0),(30,'back_button_text','Back Button Text',NULL,'Back',2,NULL,'',0),(31,'next_button_text','Next Button Text',NULL,'Next',2,NULL,'',0),(32,'back_button_visible','Show Back Button',NULL,'1',2,NULL,'',0),(33,'nav_button_alignment','Button Alignment',NULL,'distribute',2,NULL,'',0),(34,'required','Required',NULL,'0',2,'validate_1','',0),(35,'error_color','On Error Color',NULL,'#ff0',1,'validate_style','',0),(36,'success_color','On Success Color',NULL,'#0f0',1,'validate_style','',0),(37,'submit_page','Submit Page Content',NULL,'',3,NULL,'',0),(38,'required_sign','Show Required Sign',NULL,'1',1,'validate','',0),(39,'input_validation','Field Validation',NULL,'',2,'validate_0','',0),(40,'form_active','Form Availability',NULL,'1',3,NULL,'',0),(41,'submit_email','Email to Send Results To','Leave empty to not receive emails','',3,NULL,'',0),(42,'form_height','Form Height',NULL,'500',3,NULL,'',1);
/*!40000 ALTER TABLE `param` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pattern`
--

DROP TABLE IF EXISTS `pattern`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pattern` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `img` varchar(255) CHARACTER SET utf8 NOT NULL,
  `form_params` text CHARACTER SET utf8 NOT NULL,
  `form_settings` text COLLATE utf8_unicode_ci NOT NULL,
  `form_elements` text CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pattern`
--

LOCK TABLES `pattern` WRITE;
/*!40000 ALTER TABLE `pattern` DISABLE KEYS */;
INSERT INTO `pattern` VALUES (1,'New Blank Form','_blank.png','{}','','[[]]'),(2,'Black & Yellow','b_and_y.png','{\"2\":\"#ffff00\",\"3\":\"#000000\",\"4\":\"#ffffff\",\"5\":\"#111111\",\"6\":\"500px\",\"7\":\"15px\",\"8\":\"top\",\"9\":\"180px\",\"10\":\"Comic Sans MS, cursive, sans-serif\",\"11\":\"18px\"}','','[[{\"id\":3,\"number\":0,\"params\":{\"14\":\"Black & Yellow\",\"15\":\"left\"}},{\"id\":1,\"number\":0,\"params\":{\"1\":\"Black\"}},{\"id\":1,\"number\":1,\"params\":{\"1\":\"Yellow\"}},{\"id\":2,\"number\":0,\"params\":{\"12\":\"Send\",\"13\":\"right\"}}]]');
/*!40000 ALTER TABLE `pattern` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile`
--

DROP TABLE IF EXISTS `profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profile` (
  `user_id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `timezone` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_user_profile` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile`
--

LOCK TABLES `profile` WRITE;
/*!40000 ALTER TABLE `profile` DISABLE KEYS */;
INSERT INTO `profile` VALUES (1,'name','Europe/Moscow'),(3,'reg user',NULL);
/*!40000 ALTER TABLE `profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `social_account`
--

DROP TABLE IF EXISTS `social_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `social_account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `provider` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `client_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `data` text COLLATE utf8_unicode_ci,
  `code` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` int(11) DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `username` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_unique` (`provider`,`client_id`),
  UNIQUE KEY `account_unique_code` (`code`),
  KEY `fk_user_account` (`user_id`),
  CONSTRAINT `fk_user_account` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `social_account`
--

LOCK TABLES `social_account` WRITE;
/*!40000 ALTER TABLE `social_account` DISABLE KEYS */;
/*!40000 ALTER TABLE `social_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token`
--

DROP TABLE IF EXISTS `token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `token` (
  `user_id` int(11) NOT NULL,
  `code` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` int(11) NOT NULL,
  `type` smallint(6) NOT NULL,
  UNIQUE KEY `token_unique` (`user_id`,`code`,`type`),
  CONSTRAINT `fk_user_token` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token`
--

LOCK TABLES `token` WRITE;
/*!40000 ALTER TABLE `token` DISABLE KEYS */;
INSERT INTO `token` VALUES (3,'UuDzqNWNLLWf7Eo8yjvTd_3d5Pot4kgi',1492541378,0);
/*!40000 ALTER TABLE `token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password_hash` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `auth_key` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `confirmed_at` int(11) DEFAULT NULL,
  `unconfirmed_email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `blocked_at` int(11) DEFAULT NULL,
  `registration_ip` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `updated_at` int(11) NOT NULL,
  `flags` int(11) NOT NULL DEFAULT '0',
  `last_login_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_unique_username` (`username`),
  UNIQUE KEY `user_unique_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','i.clockworktoy@gmail.com','$2y$10$yJj0wn.bORkmT.A4yAvyDeKdBveUx3O0mIFPwJ2baEHtuhKWz0Jom','v_zYd_56_XV5c7jT9fbN_g_C1fBb0xiE',1492514547,NULL,NULL,'::1',1492514179,1497641141,0,1508937107),(3,'reg_user','hello@clockworkdev.ru','$2y$10$i7mxKLvN.GDDhPJrbkZ37uU9J.BWzxovJglO2O.7HIAfkPkWSncae','avzci77hMgb21mUEZwxND2OLaLwaW2sx',NULL,NULL,NULL,'::1',1492541378,1492541378,0,1497641089);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'clockwor_forms_db'
--

--
-- Dumping routines for database 'clockwor_forms_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-10-26 17:22:47

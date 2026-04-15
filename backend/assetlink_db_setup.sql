-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: assetlink
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `assets` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `asset_code` varchar(50) NOT NULL,
  `category` varchar(100) NOT NULL,
  `condition` varchar(50) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `school_id` varchar(255) DEFAULT NULL,
  `school_name` varchar(255) DEFAULT NULL,
  `serial_number` varchar(255) DEFAULT NULL,
  `purchase_date` datetime DEFAULT NULL,
  `purchase_value` decimal(12,2) DEFAULT NULL,
  `photo_url` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_date` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `assets_asset_code_unique` (`asset_code`),
  KEY `assets_school_id_schools_id_fk` (`school_id`),
  CONSTRAINT `assets_school_id_schools_id_fk` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
INSERT INTO `assets` VALUES ('ast_001','Student Armchair (Monoblock)','CHR-001','Furniture','Good','Room 101','sch_001','Baliwasan Senior High School - Stand-Alone',NULL,NULL,NULL,NULL,'Standard student monoblock armchair',1,'2026-04-15 03:32:29'),('ast_002','Teacher\'s Desk (Wooden)','DSK-001','Furniture','Fair','Room 102','sch_001','Baliwasan Senior High School - Stand-Alone',NULL,NULL,NULL,NULL,'Wooden teacher desk with drawer',1,'2026-04-15 03:32:29'),('ast_003','LCD Projector (Epson)','PRJ-001','Electronics','Excellent','AVR','sch_001','Baliwasan Senior High School - Stand-Alone',NULL,NULL,NULL,NULL,'Epson EB-X51 LCD Projector',1,'2026-04-15 03:32:29');
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `audit_logs` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `entity_type` varchar(50) DEFAULT NULL,
  `entity_id` varchar(255) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `created_date` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance_tasks`
--

DROP TABLE IF EXISTS `maintenance_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `maintenance_tasks` (
  `id` varchar(255) NOT NULL,
  `repair_request_id` varchar(255) DEFAULT NULL,
  `request_number` varchar(50) DEFAULT NULL,
  `asset_name` varchar(255) DEFAULT NULL,
  `school_id` varchar(255) DEFAULT NULL,
  `school_name` varchar(255) DEFAULT NULL,
  `assigned_to_email` varchar(255) DEFAULT NULL,
  `assigned_to_name` varchar(255) DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `teacher_confirmation` tinyint(1) DEFAULT 0,
  `teacher_verification_notes` text DEFAULT NULL,
  `verified_by_email` varchar(255) DEFAULT NULL,
  `verified_date` datetime DEFAULT NULL,
  `priority` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `materials_used` text DEFAULT NULL,
  `actual_cost` decimal(12,2) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `reschedule_count` decimal(5,0) DEFAULT 0,
  `reschedule_notes` text DEFAULT NULL,
  `completed_date` datetime DEFAULT NULL,
  `created_date` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `maintenance_tasks_repair_request_id_repair_requests_id_fk` (`repair_request_id`),
  KEY `maintenance_tasks_school_id_schools_id_fk` (`school_id`),
  CONSTRAINT `maintenance_tasks_repair_request_id_repair_requests_id_fk` FOREIGN KEY (`repair_request_id`) REFERENCES `repair_requests` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `maintenance_tasks_school_id_schools_id_fk` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance_tasks`
--

LOCK TABLES `maintenance_tasks` WRITE;
/*!40000 ALTER TABLE `maintenance_tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `maintenance_tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `photos`
--

DROP TABLE IF EXISTS `photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photos` (
  `id` varchar(255) NOT NULL,
  `entity_id` varchar(255) NOT NULL,
  `entity_type` varchar(50) NOT NULL,
  `data` longblob NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `created_date` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photos`
--

LOCK TABLES `photos` WRITE;
/*!40000 ALTER TABLE `photos` DISABLE KEYS */;
/*!40000 ALTER TABLE `photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `repair_requests`
--

DROP TABLE IF EXISTS `repair_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `repair_requests` (
  `id` varchar(255) NOT NULL,
  `request_number` varchar(50) NOT NULL,
  `asset_id` varchar(255) DEFAULT NULL,
  `asset_name` varchar(255) DEFAULT NULL,
  `asset_code` varchar(50) DEFAULT NULL,
  `school_id` varchar(255) DEFAULT NULL,
  `school_name` varchar(255) DEFAULT NULL,
  `reported_by_email` varchar(255) DEFAULT NULL,
  `reported_by_name` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `photo_url` text DEFAULT NULL,
  `priority` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL,
  `assigned_to_email` varchar(255) DEFAULT NULL,
  `assigned_to_name` varchar(255) DEFAULT NULL,
  `principal_notes` text DEFAULT NULL,
  `maintenance_notes` text DEFAULT NULL,
  `teacher_confirmation` tinyint(1) DEFAULT 0,
  `escalated_reason` text DEFAULT NULL,
  `estimated_cost` decimal(12,2) DEFAULT NULL,
  `scheduled_start_date` datetime DEFAULT NULL,
  `sla_deadline` datetime DEFAULT NULL,
  `completed_date` datetime DEFAULT NULL,
  `created_date` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `repair_requests_request_number_unique` (`request_number`),
  KEY `repair_requests_asset_id_assets_id_fk` (`asset_id`),
  KEY `repair_requests_school_id_schools_id_fk` (`school_id`),
  CONSTRAINT `repair_requests_asset_id_assets_id_fk` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `repair_requests_school_id_schools_id_fk` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `repair_requests`
--

LOCK TABLES `repair_requests` WRITE;
/*!40000 ALTER TABLE `repair_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `repair_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schools`
--

DROP TABLE IF EXISTS `schools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schools` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `division` varchar(100) DEFAULT NULL,
  `principal_name` varchar(255) DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(50) DEFAULT NULL,
  `created_date` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schools`
--

LOCK TABLES `schools` WRITE;
/*!40000 ALTER TABLE `schools` DISABLE KEYS */;
INSERT INTO `schools` VALUES ('sch_001','Baliwasan Senior High School - Stand-Alone','San Jose Road, Baliwasan, Zamboanga City',NULL,'Zamboanga City','Principal Maria','principal@baliwasan-shs.edu.ph','0917-123-4444','2026-04-15 03:32:29');
/*!40000 ALTER TABLE `schools` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `role` varchar(50) NOT NULL,
  `school_id` varchar(255) DEFAULT NULL,
  `school_name` varchar(255) DEFAULT NULL,
  `created_date` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_school_id_schools_id_fk` (`school_id`),
  CONSTRAINT `users_school_id_schools_id_fk` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('user_admin_001','deped.supervisor@assetlink.ph','DepEd Supervisor Roberto','admin',NULL,NULL,'2026-04-15 03:32:29'),('user_barangay_001','barangay.official@baliwasan.gov.ph','Hon. Barangay Kagawad','supervisor','sch_001','Baliwasan Senior High School - Stand-Alone','2026-04-15 03:32:29'),('user_maintenance_001','maintenance@baliwasan-shs.edu.ph','Maintenance Staff Pedro','maintenance','sch_001','Baliwasan Senior High School - Stand-Alone','2026-04-15 03:32:29'),('user_principal_001','principal@baliwasan-shs.edu.ph','Principal Maria','principal','sch_001','Baliwasan Senior High School - Stand-Alone','2026-04-15 03:32:29'),('user_teacher_001','teacher@baliwasan-shs.edu.ph','Juan Dela Cruz','teacher','sch_001','Baliwasan Senior High School - Stand-Alone','2026-04-15 03:32:29');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-15  3:32:47

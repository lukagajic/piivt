-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.6.0-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for aplikacija
DROP DATABASE IF EXISTS `aplikacija`;
CREATE DATABASE IF NOT EXISTS `aplikacija` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `aplikacija`;

-- Dumping structure for table aplikacija.administrator
DROP TABLE IF EXISTS `administrator`;
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table aplikacija.administrator: ~4 rows (approximately)
/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`, `is_active`) VALUES
	(2, 'admin123', '$2b$11$1PznZspBd9o/IYE14UF0DuyRe5CGQNqYMAwu2F8z4fZucVQnsVBAS', 1),
	(4, 'administrator', '$2b$11$NKDI74yLIbJg14Cadrc6ger0N.Str4SfOBGarHvisU719UfQtf2rm', 1),
	(5, 'administrator1', '$2b$11$.C3fi2WIk3kqYmVqzSLKs.5b1Q..CDu9ln10wRK.Y2dgMY9xphbpK', 1),
	(7, 'administratorNovi', '$2b$11$8K2Adm2yyks.SoiSeDUbvOiaKYTLU/xraKcuTxkaMP/FL7cRnCham', 1);
/*!40000 ALTER TABLE `administrator` ENABLE KEYS */;

-- Dumping structure for table aplikacija.category
DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table aplikacija.category: ~17 rows (approximately)
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` (`category_id`, `name`, `is_active`) VALUES
	(1, 'Preventivna intervencija', 1),
	(2, 'Redovna intervencija', 1),
	(3, 'Hitna intervencija', 1),
	(4, 'Analize', 1),
	(5, 'Pregledi', 1),
	(6, 'Hirurgija', 1);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;

-- Dumping structure for table aplikacija.doctor
DROP TABLE IF EXISTS `doctor`;
CREATE TABLE IF NOT EXISTS `doctor` (
  `doctor_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `forename` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `born_at` date NOT NULL,
  `gender` enum('male','female') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` enum('magistar','specijalizant','doktor','docent','primarijus') COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(24) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`doctor_id`),
  UNIQUE KEY `uq_doctor_email` (`email`),
  UNIQUE KEY `uq_doctor_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table aplikacija.doctor: ~2 rows (approximately)
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
INSERT INTO `doctor` (`doctor_id`, `forename`, `surname`, `email`, `username`, `password_hash`, `born_at`, `gender`, `title`, `phone_number`, `is_active`) VALUES
	(2, 'Mirko', 'Ivanic', 'mirko@e-medic.local', 'mirko', '$2b$11$CHDpz6d4gdvo4fRIUDOvY.0pn7eN0lXjGP8wMkVfqSi3Jj/tQcOSu', '1992-11-15', 'male', 'docent', '+381114554433', 1),
	(4, 'Srdjan', 'Petrovic', 'srki@e-medic.local', 'srki', '$2b$11$5WX/Gv43AhVLl5yRuAf3le0j8e73UmPLOv3NgEkRloIaFELUGlmnu', '1992-11-15', 'male', 'docent', '+381114554432', 1);
/*!40000 ALTER TABLE `doctor` ENABLE KEYS */;

-- Dumping structure for table aplikacija.login_record
DROP TABLE IF EXISTS `login_record`;
CREATE TABLE IF NOT EXISTS `login_record` (
  `login_record_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_successful` tinyint(1) unsigned NOT NULL,
  `message` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attempted_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`login_record_id`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table aplikacija.login_record: ~79 rows (approximately)
/*!40000 ALTER TABLE `login_record` DISABLE KEYS */;
INSERT INTO `login_record` (`login_record_id`, `email`, `ip_address`, `user_agent`, `is_successful`, `message`, `attempted_at`) VALUES
	(5, 'iivanic@e-medic.local', '::1', 'PostmanRuntime/7.28.0', 1, 'Uspešno logovanje na sistem', '2021-06-01 15:14:43'),
	(6, 'iivanic@e-medic.local', '::1', 'PostmanRuntime/7.28.0', 1, 'Uspešno logovanje na sistem', '2021-06-01 15:14:50'),
	(7, 'iivanic@e-medic.local', '::1', 'PostmanRuntime/7.28.0', 0, 'Uspešno logovanje na sistem', '2021-06-01 15:20:18'),
	(8, 'iivanic@e-medic.local2', '::1', 'PostmanRuntime/7.28.0', 0, 'Loše uneto korisničko ime', '2021-06-01 15:20:24'),
	(9, 'iivanic@e-medic.local', '::1', 'PostmanRuntime/7.28.0', 0, 'Loše uneta lozinka', '2021-06-01 15:20:43'),
	(10, 'iivanic@e-medic.local', '::1', 'PostmanRuntime/7.28.0', 0, 'Loše uneta lozinka', '2021-06-01 20:01:37'),
	(11, 'iivanic@e-medic.local', '::1', 'PostmanRuntime/7.28.0', 1, 'Uspešno logovanje na sistem', '2021-06-01 20:01:43'),
	(12, 'iivanic@e-medic.local', '::1', 'PostmanRuntime/7.28.0', 1, 'Uspešno logovanje na sistem', '2021-06-01 20:05:50'),
	(13, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 0, 'Loše uneta lozinka', '2021-06-01 23:45:06'),
	(14, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 0, 'Loše uneta lozinka', '2021-06-01 23:45:09'),
	(15, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 0, 'Loše uneta lozinka', '2021-06-01 23:45:11'),
	(16, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 0, 'Loše uneta lozinka', '2021-06-01 23:46:26'),
	(17, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-01 23:49:31'),
	(18, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-01 23:51:04'),
	(19, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-01 23:54:03'),
	(20, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-01 23:54:54'),
	(21, 'iivanic@e-medic', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 0, 'Loše uneto korisničko ime', '2021-06-01 23:57:52'),
	(22, 'iivanic@e-medic.mail.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 0, 'Loše uneto korisničko ime', '2021-06-02 00:01:25'),
	(23, 'iivanic@e-medic.mail.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 0, 'Loše uneto korisničko ime', '2021-06-02 00:01:28'),
	(24, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-02 00:01:37'),
	(25, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-02 00:01:46'),
	(26, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-02 00:01:47'),
	(27, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-02 00:01:51'),
	(28, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-02 00:01:52'),
	(29, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-02 00:01:52'),
	(30, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-02 00:01:53'),
	(31, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-02 00:01:53'),
	(32, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-02 00:02:31'),
	(33, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-02 00:02:51'),
	(34, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-02 00:02:53'),
	(35, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-02 00:02:54'),
	(36, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-02 00:02:55'),
	(37, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-02 00:27:44'),
	(38, 'iivanic@e-medic.local', '::1', 'PostmanRuntime/7.28.0', 1, 'Uspešno logovanje na sistem', '2021-06-02 00:32:55'),
	(39, 'perica@mail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36', 0, 'Loše uneto korisničko ime', '2021-06-09 11:25:24'),
	(40, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-09 11:25:35'),
	(41, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-09 12:37:19'),
	(42, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-09 12:50:16'),
	(43, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-09 12:51:29'),
	(44, 'pperic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36', 0, 'Loše uneto korisničko ime', '2021-06-09 12:53:12'),
	(45, 'pperic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36', 0, 'Loše uneto korisničko ime', '2021-06-09 12:53:13'),
	(46, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-09 12:53:17'),
	(47, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-09 12:53:56'),
	(48, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-09 12:54:24'),
	(49, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-09 14:37:57'),
	(50, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-09 15:15:17'),
	(51, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-09 17:06:19'),
	(52, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-09 17:06:32'),
	(53, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-11 13:01:02'),
	(54, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 0, 'Loše uneta lozinka', '2021-06-11 13:02:05'),
	(55, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-11 13:02:09'),
	(56, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-11 15:14:35'),
	(57, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-11 15:24:59'),
	(58, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-11 15:28:47'),
	(59, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-11 18:49:49'),
	(60, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-11 23:15:27'),
	(61, 'iivanic@e-medic.local', '::1', 'PostmanRuntime/7.28.0', 1, 'Uspešno logovanje na sistem', '2021-06-12 00:29:45'),
	(62, 'iivanic@e-medic.local', '::1', 'PostmanRuntime/7.28.0', 1, 'Uspešno logovanje na sistem', '2021-06-12 00:31:23'),
	(63, 'iivanic@e-medic.local', '::1', 'PostmanRuntime/7.28.0', 1, 'Uspešno logovanje na sistem', '2021-06-12 00:33:45'),
	(64, 'iivanic@e-medic.local', '::1', 'PostmanRuntime/7.28.0', 1, 'Uspešno logovanje na sistem', '2021-06-12 00:36:02'),
	(65, 'iivanic@e-medic.local', '::1', 'PostmanRuntime/7.28.0', 1, 'Uspešno logovanje na sistem', '2021-06-12 00:39:52'),
	(66, 'iivanic@e-medic.local', '::1', 'PostmanRuntime/7.28.0', 1, 'Uspešno logovanje na sistem', '2021-06-12 14:13:15'),
	(67, 'iivanic@e-medic.local', '::1', 'PostmanRuntime/7.28.0', 1, 'Uspešno logovanje na sistem', '2021-06-12 14:15:13'),
	(68, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-12 15:24:55'),
	(69, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-12 15:32:02'),
	(70, 'iivanic@e-medic.local', '::1', 'PostmanRuntime/7.28.0', 1, 'Uspešno logovanje na sistem', '2021-06-12 22:05:25'),
	(71, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 0, 'Loše uneta lozinka', '2021-06-13 22:48:45'),
	(72, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-13 22:48:48'),
	(73, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-14 23:24:42'),
	(74, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-14 23:30:59'),
	(75, 'iivanic@e-medic.local', '::1', 'PostmanRuntime/7.28.0', 1, 'Uspešno logovanje na sistem', '2021-06-14 23:32:37'),
	(76, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-15 00:52:08'),
	(77, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-15 00:59:13'),
	(78, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-15 01:01:57'),
	(79, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-15 03:13:29'),
	(80, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-15 03:15:00'),
	(81, 'iivanic@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-15 03:16:47'),
	(82, 'iivanic@e-medic.local', '::1', 'PostmanRuntime/7.28.0', 1, 'Uspešno logovanje na sistem', '2021-06-15 15:56:58'),
	(83, 'iivanic@e-medic.local', '::1', 'PostmanRuntime/7.28.0', 1, 'Uspešno logovanje na sistem', '2021-06-15 15:58:36'),
	(84, 'mirko@e-medic.local', '::1', 'PostmanRuntime/7.28.0', 1, 'Uspešno logovanje na sistem', '2021-06-15 16:26:18'),
	(85, 'srki@e-medic.local', '::1', 'PostmanRuntime/7.28.0', 0, 'Loše uneto korisničko ime', '2021-06-15 17:07:40'),
	(86, 'srki@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 0, 'Loše uneto korisničko ime', '2021-06-15 17:56:09'),
	(87, 'srki@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-15 17:56:17'),
	(88, 'admin123', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 0, 'Loše uneto korisničko ime', '2021-06-15 18:05:50'),
	(89, 'admin123', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 0, 'Loše uneto korisničko ime', '2021-06-15 18:05:57'),
	(90, 'srki@e-medic.local', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 1, 'Uspešno logovanje na sistem', '2021-06-15 18:12:29'),
	(91, 'admin123', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 0, 'Loše uneto korisničko ime', '2021-06-15 18:19:14'),
	(92, 'admin123', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36', 0, 'Loše uneto korisničko ime', '2021-06-15 18:19:18');
/*!40000 ALTER TABLE `login_record` ENABLE KEYS */;

-- Dumping structure for table aplikacija.patient
DROP TABLE IF EXISTS `patient`;
CREATE TABLE IF NOT EXISTS `patient` (
  `patient_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `forename` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `born_at` date NOT NULL,
  `gender` enum('male','female') COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `personal_identity_number` varchar(13) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(24) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `doctor_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`patient_id`),
  UNIQUE KEY `uq_patient_personal_identity_number` (`personal_identity_number`),
  UNIQUE KEY `uq_patient_phone` (`phone_number`) USING BTREE,
  UNIQUE KEY `uq_patient_email` (`email`),
  KEY `fk_patient_doctor_id` (`doctor_id`),
  CONSTRAINT `fk_patient_doctor_id` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table aplikacija.patient: ~5 rows (approximately)
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
INSERT INTO `patient` (`patient_id`, `forename`, `surname`, `born_at`, `gender`, `email`, `personal_identity_number`, `phone_number`, `address`, `is_active`, `created_at`, `doctor_id`) VALUES
	(1, 'Slobodan', 'Zivkovic', '1960-05-04', 'male', 'sloba@mail.local', '0505960123456', '065123128', 'Ulica glavna BB, 11000 Beograd', 1, '2021-06-15 18:31:22', 4),
	(2, 'Milica', 'Aleksic', '1992-05-04', 'male', 'milicaaleksic@mail.local', '0505992123456', '065123123', 'Ulica sporedna 2, 11000 Beograd', 1, '2021-06-15 18:30:56', 2),
	(3, 'Aleksandra', 'Aleksic', '1991-05-23', 'female', 'alex1@mail.local', '0505991123456', '065123124', 'Ulica sporedna 3, 11000 Beograd', 1, '2021-06-15 18:30:51', 2),
	(15, 'Pera', 'Peric', '1990-01-01', 'male', 'peraperic1234@mail.local', '0101990711235', '065123125', 'Neka ulica sa brojem 15, 11000 Beograd', 1, '2021-06-15 18:31:12', 2),
	(16, 'Petar', 'Petrovic', '1990-01-24', 'male', 'petarpetrovic@mail.local', '2401990714423', '065123129', 'Adresa 15, 11000 Beograd', 0, '2021-06-15 18:31:17', 2),
	(19, 'Rade', 'Stevanovic', '1991-05-05', 'male', 'rade@mail.local', '0505991123127', '065123126', 'Ulica sporedna 5, 11000 Beograd', 1, '2021-06-15 18:31:01', 2),
	(23, 'Steva', 'Stevanovic', '1991-05-05', 'male', 'stevastevanovic@mail.local', '0505991123155', '065123127', 'Ulica sporedna 6, 11000 Beograd', 1, '2021-06-15 18:31:05', 2);
/*!40000 ALTER TABLE `patient` ENABLE KEYS */;

-- Dumping structure for table aplikacija.service
DROP TABLE IF EXISTS `service`;
CREATE TABLE IF NOT EXISTS `service` (
  `service_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `catalogue_code` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int(7) unsigned NOT NULL,
  `price_for_children` int(7) unsigned NOT NULL,
  `price_for_seniors` int(7) unsigned NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`service_id`),
  UNIQUE KEY `uq_service_name` (`name`),
  UNIQUE KEY `uq_service_catalogue_code` (`catalogue_code`),
  KEY `fk_service_category_id` (`category_id`),
  CONSTRAINT `fk_service_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table aplikacija.service: ~9 rows (approximately)
/*!40000 ALTER TABLE `service` DISABLE KEYS */;
INSERT INTO `service` (`service_id`, `name`, `description`, `catalogue_code`, `price`, `price_for_children`, `price_for_seniors`, `category_id`, `is_active`) VALUES
	(1, 'CRP - analiza krvi', 'Brzo i bezbolno vadjenje krvi i izrada CRP analize', 'EMCRP14', 2500, 1500, 1900, 4, 1),
	(2, 'Urologija', 'Vršimo urologiju', 'EMURO15', 900, 400, 650, 4, 1),
	(6, 'Plastična hirurgija', 'Vršimo različite vrste plastičnih operacija', 'EMPHI14', 250000, 10000, 50000, 6, 1),
	(9, 'Bris iz nosa', 'Bris iz nosa', 'EMUSL14', 1500, 1500, 1500, 4, 1),
	(11, 'Bris iz usta', 'Vadimo bris iz usta', 'EMBRI14', 1700, 500, 750, 4, 1),
	(14, 'Bris iz grla', 'Brzo i bezbolno vadjenje brisa iz grla', 'ABC1234', 900, 400, 650, 4, 1);
/*!40000 ALTER TABLE `service` ENABLE KEYS */;

-- Dumping structure for table aplikacija.visit
DROP TABLE IF EXISTS `visit`;
CREATE TABLE IF NOT EXISTS `visit` (
  `visit_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `visited_at` date NOT NULL,
  `patient_id` int(10) unsigned NOT NULL,
  `doctor_id` int(10) unsigned NOT NULL,
  `editor__doctor_id` int(10) unsigned NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`visit_id`),
  KEY `fk_visit_patient_id` (`patient_id`),
  KEY `fk_visit_doctor_id` (`doctor_id`),
  KEY `fk_visit_editor__doctor_id` (`editor__doctor_id`),
  CONSTRAINT `fk_visit_doctor_id` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_visit_editor__doctor_id` FOREIGN KEY (`editor__doctor_id`) REFERENCES `doctor` (`doctor_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_visit_patient_id` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`patient_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table aplikacija.visit: ~3 rows (approximately)
/*!40000 ALTER TABLE `visit` DISABLE KEYS */;
INSERT INTO `visit` (`visit_id`, `visited_at`, `patient_id`, `doctor_id`, `editor__doctor_id`, `is_active`) VALUES
	(1, '2021-05-27', 2, 2, 2, 1),
	(3, '2021-06-13', 2, 2, 2, 1),
	(4, '2021-06-13', 2, 2, 2, 1),
	(5, '2021-06-14', 3, 2, 2, 1),
	(6, '2021-06-15', 2, 2, 2, 1),
	(7, '2021-06-15', 1, 4, 4, 0),
	(8, '2021-06-15', 1, 4, 4, 0),
	(9, '2021-06-15', 1, 4, 4, 0),
	(10, '2021-06-15', 1, 4, 4, 0),
	(11, '2021-06-15', 1, 4, 4, 0),
	(12, '2021-06-15', 1, 4, 4, 1);
/*!40000 ALTER TABLE `visit` ENABLE KEYS */;

-- Dumping structure for table aplikacija.visit_service
DROP TABLE IF EXISTS `visit_service`;
CREATE TABLE IF NOT EXISTS `visit_service` (
  `visit_service_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `visit_id` int(10) unsigned NOT NULL,
  `service_id` int(10) unsigned NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`visit_service_id`),
  KEY `fk_visit_service_visit_id` (`visit_id`),
  KEY `fk_visit_service_service_id` (`service_id`),
  CONSTRAINT `fk_visit_service_service_id` FOREIGN KEY (`service_id`) REFERENCES `service` (`service_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_visit_service_visit_id` FOREIGN KEY (`visit_id`) REFERENCES `visit` (`visit_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table aplikacija.visit_service: ~4 rows (approximately)
/*!40000 ALTER TABLE `visit_service` DISABLE KEYS */;
INSERT INTO `visit_service` (`visit_service_id`, `visit_id`, `service_id`, `description`) VALUES
	(7, 1, 1, 'Uradjena analiza krvi pre operacije...'),
	(12, 4, 6, 'Izvrsena operacija usta...'),
	(13, 1, 2, 'Neka nova usluga'),
	(14, 5, 2, 'Pacijentu je uradjen osnovan internisticki pregled i sve je u redu.'),
	(15, 5, 1, 'Pacijentu je uradjena CRP analiza krvi i sve je u redu.'),
	(16, 6, 1, 'Pacijentu je uradjena kompletna CRP analiza.'),
	(21, 6, 1, 'Pacijentu je uradjena urologija.'),
	(22, 7, 6, 'Uradjena operacija nosa'),
	(24, 7, 1, 'Analiza krvi'),
	(25, 8, 9, 'Uradjen bris iz nosa'),
	(26, 8, 2, 'Uradjena urlogoija'),
	(28, 9, 14, 'Uradjen bris iz grla'),
	(29, 9, 6, 'Operacija jagodina'),
	(31, 10, 1, 'Uradjena CRP analiza'),
	(32, 11, 1, 'Analiza krvi'),
	(33, 11, 11, 'Bris is usta je uradjen'),
	(34, 12, 2, 'Uradjena urologija');
/*!40000 ALTER TABLE `visit_service` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

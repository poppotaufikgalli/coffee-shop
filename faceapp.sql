-- MySQL dump 10.13  Distrib 8.3.0, for macos14.4 (x86_64)
--
-- Host: localhost    Database: faceapp
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `karyawan`
--

DROP TABLE IF EXISTS `karyawan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `karyawan` (
  `id_karyawan` int NOT NULL AUTO_INCREMENT,
  `nama_karyawan` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `tanggal_mulai` date DEFAULT NULL,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `salt` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `hash` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `role` int NOT NULL DEFAULT '1',
  `foto` varchar(190) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `status` int DEFAULT '1',
  `created_uid` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_uid` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_uid` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_karyawan`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `karyawan`
--

LOCK TABLES `karyawan` WRITE;
/*!40000 ALTER TABLE `karyawan` DISABLE KEYS */;
INSERT INTO `karyawan` VALUES (1,'Administrator',NULL,'admin',NULL,'0TKyilds68eUNL/O80bvAvfV80HcHDF3G9FIds2KAuvEt0srmVW697BnN6e7+/mEbIVJTtPWtG7om+VhNcTqpKZhShw7ikjdOTeKppmUItuljOjGmZwycqIcZHymRGf4YM5eMYAAWL+D4bie39kf4/bWBohHB7y/lIfBWBw+TXk=','6281ddc4642ff16a0a0b91b38345de016b9ec4f12ad870acbdc4e0238dd9cc13dd6a27535f3191a9407ab09a24aa1c929a786c90bc8449441a596de07aec8604e6bfdcf820a451309ebf3c6b07d41fd7d96635c99a52144676f5d21025136aaa9d1de47305331bdd903ad731ccf097fb6cf3982c31ddbd2d1d8cd81c76bbe7032cc3ed423f6fdb87c9f001bd2b5af8028ea92aa80025f47b698d4fc9d15e0dfad9c45d2686522ebd06e065bf7c274e3a6c656b688731ff72859cf6a9398c0ed5248e35fa8ef41f890ccfa6258aa4534abc8845427bc588c34f914a3dda1c9b473b6580c2d0a1c4ae29132ee298210eaac1503229c827eef1d2cd9012f0a6ec445eb8bfdb09f2d1ac63e0d51fbd5135cfecf412b6b681fce651914db135a5341b0f52cd711c49d1fe69f1b0b01e218a328a4d26282dcd20260e7d9692548fa3bdd09181b0fca8c8f4cae9ff176b2d6537fb89cee2a513b94d61a21fdbdbb4b61c8639a0ce165bce7a392bca72ab0210039c7c3a0b744e2c449b5d8e3ebab52e103732207020d72072f797be1658c4acb9b856024fb1aaeb1e3d778d50dbc313052f268f4494fecc9263d887dd4475a5d52e240574cdc10858cf5dc23561f79807e1c8663e0ea18c2b728da9e0230765c39a519721de566456942eb09360d7d67f8a05770e0a5c04bffbc01a7977757b0c6c954083b252365cee1dd42ce5f9797a',1,NULL,1,NULL,'2024-12-23 12:23:32',NULL,'2025-01-01 16:09:24',NULL,NULL),(8,'jojo','2025-01-02','jojo',NULL,'bae79193040cc7d3bdcef835ea5a33b69e13687ff9344494f181bf53e1fe9872ff74e8215c9bf71a25548f55c5149810cf7cd1e43e3fbee5fb3d5eed1e78ad0ea880dce3dd2c6e26b172d6d0353d459ef498302ad4fa','',2,'WhatsApp Image 2024-12-31 at 10.56.19.jpeg',1,1,'2025-01-02 13:57:23',NULL,NULL,NULL,NULL),(10,'taufik','2025-01-02','taufik',NULL,'426fe047991eb6c247151e930d6f7391efafa6a86fcf6de8517f4f8d6165995c5d78e350c32f64298eae98df4add17aafaa9028ec1b038aa58edbde8268b556e5b5c3c9d5e7d221788f9057e928b2d504d2dbd4f4e3c','43e39cfb8eefa5f84e4c7f1fae6f5633f40bcd53652caa9b71b440c25600f41a501a79b18209ec382ed67ebc5d8ebbe230425c8de0b0671f85e141aa245e0a1e0d1cd22c28cf817bf0511b67fdaa661fe9c50eb6951625c23b03bc39c7a6adea41ef69aee34729c57b48063d3f2dd001add4a1cbde1f3ca82226454864ef23f71354f01af00e97313667194603eee857c441aaa4ecb0c00ed5e85bcd726fff333bcd35917da22f7e439ad788ff3f3b646a3cb48d1eae882d9fc28863e2959e304382d87a16a84bec22fe85b544a407552e7be152993ed8f5c7f1232068f5a93d805a80951b907c1dd0fcd5aee237bfcb4bfbd24f07efdd398d42d3136d1e90cac24f3f5bc19264cbc2e4752054924edaf59518ab033877265754bebfd2c4dd7eb48acfac1c8a380126f1b8de0fb63ab1486eac45efc0a5e45f487a640dc7f7096e49b48609df3e5f878aac13ff32ec96789736e8fd7ecfec522a220f9f0f43b31b91f12569a32e7db0c3e7279edf4975c14697fadcac36c9a166b461cf191617993b2fa337b3f004489a67b8b2b5c2e67e34dae212b16884f3dc056e261144d1886924672e659f714599e7d413a5edd6b916d93f30697a1495652ef5b6a344a7ee7be6b4d09578c4148de3f21465999a22d4bfd2e6e9ca7a33256c6ec86ce973768424498ead8054deb3861f56a54a75a9988c18942104888dca49c25f7ff306',1,'coming-soon.png',1,1,'2025-01-02 14:13:09',10,'2025-01-02 14:43:05',NULL,NULL);
/*!40000 ALTER TABLE `karyawan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loyalitas`
--

DROP TABLE IF EXISTS `loyalitas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loyalitas` (
  `id_loyalitas` int NOT NULL AUTO_INCREMENT,
  `priode_awal` date DEFAULT NULL,
  `priode_akhir` date DEFAULT NULL,
  `klasifikasi` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `diskon` int DEFAULT '1',
  `keterangan` text,
  `created_uid` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_uid` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_uid` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_loyalitas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loyalitas`
--

LOCK TABLES `loyalitas` WRITE;
/*!40000 ALTER TABLE `loyalitas` DISABLE KEYS */;
/*!40000 ALTER TABLE `loyalitas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_produk` varchar(100) DEFAULT NULL,
  `kategori` varchar(50) DEFAULT NULL,
  `harga` double DEFAULT NULL,
  `gambar` varchar(100) DEFAULT NULL,
  `status` int DEFAULT '1',
  `created_uid` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_uid` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_uid` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (1,'dsdasd','1',10000,'WhatsApp Image 2024-12-31 at 10.56.19.jpeg',1,1,'2025-01-01 04:11:53',1,'2025-01-03 11:40:23',1,'2025-01-01 04:18:58'),(2,'ssss sssssxxxx','2',1111,'32px-WhatsApp.svg.png',1,1,'2025-01-01 12:11:39',1,'2025-01-02 15:25:47',1,'2025-01-01 15:06:30'),(3,'1sdds2','2',23232,'bg1.jpeg',1,1,'2025-01-01 13:19:02',1,'2025-01-02 15:25:47',1,'2025-01-01 14:53:26');
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_kategori`
--

DROP TABLE IF EXISTS `menu_kategori`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_kategori` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_kategori` varchar(50) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `status` int DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_kategori`
--

LOCK TABLES `menu_kategori` WRITE;
/*!40000 ALTER TABLE `menu_kategori` DISABLE KEYS */;
INSERT INTO `menu_kategori` VALUES (1,'Makanan','fa fa-utensils fs-3',1),(2,'Minuman','fa fa-mug-hot fs-3',1);
/*!40000 ALTER TABLE `menu_kategori` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pelanggan`
--

DROP TABLE IF EXISTS `pelanggan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pelanggan` (
  `id_pelanggan` int NOT NULL AUTO_INCREMENT,
  `kode_pelanggan` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nama_pelanggan` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `foto_pelanggan` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `tgl_kunjungan` datetime DEFAULT NULL,
  `klasifikasi` int DEFAULT NULL,
  `created_uid` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `no_hp` varchar(50) DEFAULT NULL,
  `status` int DEFAULT '1',
  `updated_uid` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_uid` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_pelanggan`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pelanggan`
--

LOCK TABLES `pelanggan` WRITE;
/*!40000 ALTER TABLE `pelanggan` DISABLE KEYS */;
INSERT INTO `pelanggan` VALUES (1,'dasdas','dsad',NULL,NULL,NULL,1,NULL,'dsad',1,NULL,NULL,NULL,NULL),(2,'1','1',NULL,NULL,NULL,1,NULL,'1',1,NULL,NULL,NULL,NULL),(3,'23','ew',NULL,NULL,NULL,1,NULL,'dsa',1,NULL,NULL,NULL,NULL),(4,'dfsfsf','fdsfs',NULL,NULL,NULL,1,NULL,'fdsfs',1,NULL,NULL,NULL,NULL),(5,'1111','11112121',NULL,NULL,NULL,1,NULL,'sdadas',1,NULL,NULL,NULL,NULL),(6,'dsad','dsa',NULL,NULL,NULL,1,NULL,'dsa',1,NULL,NULL,NULL,NULL),(7,'sdsad','dsa',NULL,NULL,NULL,1,NULL,'dsa',1,NULL,NULL,NULL,NULL),(8,'444','dsa','444.jpeg',NULL,NULL,1,NULL,'121',1,NULL,NULL,NULL,NULL),(9,'112121','taufik','112121.jpeg',NULL,NULL,1,NULL,'111',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `pelanggan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_kategori` varchar(50) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `status` int DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'Administrator',NULL,1),(2,'Kasir',NULL,1);
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaksi`
--

DROP TABLE IF EXISTS `transaksi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaksi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_pelanggan` int DEFAULT NULL,
  `subtotal` double DEFAULT '0',
  `diskon` double DEFAULT '0',
  `total` double DEFAULT '0',
  `id_program_loyalitas` int DEFAULT NULL,
  `created_uid` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_uid` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_uid` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaksi`
--

LOCK TABLES `transaksi` WRITE;
/*!40000 ALTER TABLE `transaksi` DISABLE KEYS */;
/*!40000 ALTER TABLE `transaksi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaksi_detail`
--

DROP TABLE IF EXISTS `transaksi_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaksi_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_transaksi` int NOT NULL,
  `id_menu` int DEFAULT NULL,
  `jml` double DEFAULT '0',
  `total` double DEFAULT '0',
  `created_uid` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_uid` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_uid` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaksi_detail`
--

LOCK TABLES `transaksi_detail` WRITE;
/*!40000 ALTER TABLE `transaksi_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `transaksi_detail` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-04 10:21:42

-- MySQL dump 10.13  Distrib 8.0.30, for Linux (x86_64)
--
-- Host: itp4915m22gp24.mysql.database.azure.com    Database: fyp-db
-- ------------------------------------------------------
-- Server version	8.0.40-azure

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
-- Table structure for table `actionlog`
--

DROP TABLE IF EXISTS `actionlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actionlog` (
  `actionLogid` int NOT NULL,
  `userid` int NOT NULL,
  `logDate` date NOT NULL,
  `operationType` varchar(255) NOT NULL,
  `logMessage` varchar(255) NOT NULL,
  PRIMARY KEY (`actionLogid`),
  KEY `useid_idx` (`userid`),
  CONSTRAINT `ActionLog` FOREIGN KEY (`userid`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actionlog`
--

LOCK TABLES `actionlog` WRITE;
/*!40000 ALTER TABLE `actionlog` DISABLE KEYS */;
/*!40000 ALTER TABLE `actionlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `adminId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`adminId`),
  UNIQUE KEY `userId` (`userId`),
  CONSTRAINT `Admin_UserID` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1001,1007);
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aiservicemessage`
--

DROP TABLE IF EXISTS `aiservicemessage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aiservicemessage` (
  `messageId` int NOT NULL,
  `logId` int NOT NULL,
  `inputText` varchar(255) DEFAULT NULL,
  `responseText` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`messageId`),
  KEY `AiServiceMessage_LogId_idx` (`logId`),
  CONSTRAINT `AiServiceMessage_LogId` FOREIGN KEY (`logId`) REFERENCES `systemlog` (`logId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aiservicemessage`
--

LOCK TABLES `aiservicemessage` WRITE;
/*!40000 ALTER TABLE `aiservicemessage` DISABLE KEYS */;
/*!40000 ALTER TABLE `aiservicemessage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `customerId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  PRIMARY KEY (`customerId`),
  KEY `coustomerUserID_idx` (`userId`),
  CONSTRAINT `coustomer_UserID` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=1011 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1001,1001),(1002,1002),(1003,1003),(1004,1004),(1005,1005),(1006,1006),(1007,1007),(1008,1008),(1009,1009),(1010,1010);
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_points`
--

DROP TABLE IF EXISTS `customer_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_points` (
  `loyaltyId` int NOT NULL,
  `customerId` int NOT NULL,
  `points` int NOT NULL,
  `redemptionDate` date NOT NULL,
  PRIMARY KEY (`loyaltyId`),
  KEY `Loyalty_CustomerId_idx` (`customerId`),
  CONSTRAINT `CustomerPoints_CustomerId` FOREIGN KEY (`customerId`) REFERENCES `customer` (`customerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_points`
--

LOCK TABLES `customer_points` WRITE;
/*!40000 ALTER TABLE `customer_points` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_points` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_points_usage`
--

DROP TABLE IF EXISTS `customer_points_usage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_points_usage` (
  `usageId` int NOT NULL,
  `orderId` int NOT NULL,
  `loyaltyId` int NOT NULL,
  `usageDate` date NOT NULL,
  PRIMARY KEY (`usageId`),
  KEY `LoyaltyUsage_OrderId_idx` (`orderId`),
  KEY `LoyaltyUsage_LoyaltyId_idx` (`loyaltyId`),
  CONSTRAINT `CustomerPointsUsage_LoyaltyId` FOREIGN KEY (`loyaltyId`) REFERENCES `customer_points` (`loyaltyId`),
  CONSTRAINT `CustomerPointsUsage_OrderId` FOREIGN KEY (`orderId`) REFERENCES `order` (`orderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_points_usage`
--

LOCK TABLES `customer_points_usage` WRITE;
/*!40000 ALTER TABLE `customer_points_usage` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_points_usage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customerprofile`
--

DROP TABLE IF EXISTS `customerprofile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customerprofile` (
  `profileId` int NOT NULL AUTO_INCREMENT,
  `customerId` int NOT NULL,
  `height` double DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `allergy` varchar(255) DEFAULT NULL,
  `medicalConditions` varchar(255) DEFAULT NULL,
  `dietaryPreference` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`profileId`),
  KEY `CustomerProfile_CustomerId_idx` (`customerId`),
  CONSTRAINT `CustomerProfile_CustomerId` FOREIGN KEY (`customerId`) REFERENCES `customer` (`customerId`)
) ENGINE=InnoDB AUTO_INCREMENT=1010 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customerprofile`
--

LOCK TABLES `customerprofile` WRITE;
/*!40000 ALTER TABLE `customerprofile` DISABLE KEYS */;
INSERT INTO `customerprofile` VALUES (1001,1001,185,75,'Shellfish, Dairy','Diabetes, High Blood Pressure','Low - Carb, High - Fiber'),(1002,1002,188,70,'chicken','no','no'),(1003,1003,170,60,'no','no','no'),(1004,1004,170,60,'no','no','no'),(1005,1005,180,80,'no','no','no'),(1006,1006,183,80,'N/A','N/A','burger'),(1007,1008,190,99,'no','no','no'),(1008,1009,190,190,'no','no','no'),(1009,1010,188,89,'no','no','no');
/*!40000 ALTER TABLE `customerprofile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food`
--

DROP TABLE IF EXISTS `food`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` float NOT NULL,
  `image` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food`
--

LOCK TABLES `food` WRITE;
/*!40000 ALTER TABLE `food` DISABLE KEYS */;
/*!40000 ALTER TABLE `food` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredient`
--

DROP TABLE IF EXISTS `ingredient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredient` (
  `ingredientId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `unit` varchar(20) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `sensitiveSource` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ingredientId`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredient`
--

LOCK TABLES `ingredient` WRITE;
/*!40000 ALTER TABLE `ingredient` DISABLE KEYS */;
INSERT INTO `ingredient` VALUES (1,'Salmon','grams','Seafood','Fish'),(2,'Wagyu Beef','grams','Meat','Dairy (if marinated)'),(3,'Rice','grams','Staple','None'),(4,'Soy Sauce','ml','Condiment','Gluten'),(5,'Chili Paste','grams','Spice','Soy'),(6,'Kimchi','grams','Fermented','None'),(7,'Coconut Milk','ml','Liquid','Tree Nut'),(8,'Shrimp','pieces','Seafood','Shellfish'),(9,'Garlic','cloves','Vegetable','None'),(10,'Lemongrass','stalks','Herb','None'),(11,'Butter','grams','Dairy','Milk'),(12,'Flour','grams','Staple','Gluten'),(13,'Red Wine','ml','Liquid','Alcohol'),(14,'Fish Sauce','ml','Condiment','Fish'),(15,'Gochujang','grams','Fermented','Soy'),(16,'Egg Yolk','pieces','Dairy','Egg'),(17,'Carrot','grams','Vegetable','None'),(18,'Green Chili','grams','Spice','Capsaicin'),(19,'Beef Ribs','grams','Meat','None'),(20,'Spinach','grams','Vegetable','None'),(21,'Wasabi','grams','Condiment','Horseradish'),(22,'Hoisin Sauce','ml','Condiment','Soy'),(23,'Tamarind Paste','grams','Spice','None');
/*!40000 ALTER TABLE `ingredient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu` (
  `menuId` int NOT NULL,
  `restaurantId` int NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`menuId`),
  KEY `Menu_RestaurantId_idx` (`restaurantId`),
  CONSTRAINT `Menu_RestaurantId` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant` (`restaurantID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (1,1,'Japanese Cuisine'),(2,2,'Chinese Cuisine'),(3,3,'Western Cuisine'),(4,4,'Thai Cuisine'),(5,5,'Korean Cuisine'),(6,6,'Deserts');
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menuitem`
--

DROP TABLE IF EXISTS `menuitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menuitem` (
  `menuItemId` int NOT NULL,
  `menuID` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `calories` int NOT NULL,
  `carbohydrate` int NOT NULL,
  `sensitiveSource` varchar(255) DEFAULT NULL,
  `category` varchar(255) NOT NULL,
  PRIMARY KEY (`menuItemId`),
  KEY `Menu_MenuID_idx` (`menuID`),
  CONSTRAINT `MenuItem_MenuID` FOREIGN KEY (`menuID`) REFERENCES `menu` (`menuId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menuitem`
--

LOCK TABLES `menuitem` WRITE;
/*!40000 ALTER TABLE `menuitem` DISABLE KEYS */;
INSERT INTO `menuitem` VALUES (1,3,'Greek salad','Food provides essential nutrients for overall health and well - being',12,0,0,NULL,'Western Cuisine'),(2,3,'Veg salad','Food provides essential nutrients for overall health and well - being',18,0,0,NULL,'Western Cuisine'),(3,3,'Clover Salad','Food provides essential nutrients for overall health and well - being',16,0,0,NULL,'Western Cuisine'),(4,3,'Chicken Salad','Food provides essential nutrients for overall health and well - being',24,0,0,NULL,'Western Cuisine'),(5,3,'Lasagna Rolls','Food provides essential nutrients for overall health and well - being',14,0,0,NULL,'Western Cuisine'),(6,3,'Peri Peri Rolls','Food provides essential nutrients for overall health and well - being',12,0,0,NULL,'Western Cuisine'),(7,3,'Chicken Rolls','Food provides essential nutrients for overall health and well - being',20,0,0,NULL,'Western Cuisine'),(8,3,'Veg Rolls','Food provides essential nutrients for overall health and well - being',15,0,0,NULL,'Western Cuisine'),(9,6,'Ripple Ice Cream','Food provides essential nutrients for overall health and well - being',14,0,0,NULL,'Deserts'),(10,6,'Fruit Ice Cream','Food provides essential nutrients for overall health and well - being',22,0,0,NULL,'Deserts'),(11,6,'Jar Ice Cream','Food provides essential nutrients for overall health and well - being',10,0,0,NULL,'Deserts'),(12,6,'Vanilla Ice Cream','Food provides essential nutrients for overall health and well - being',12,0,0,NULL,'Deserts'),(13,3,'Chicken Sandwich','Food provides essential nutrients for overall health and well - being',12,0,0,NULL,'Western Cuisine'),(14,3,'Vegan Sandwich','Food provides essential nutrients for overall health and well - being',18,0,0,NULL,'Western Cuisine'),(15,3,'Grilled Sandwich','Food provides essential nutrients for overall health and well - being',16,0,0,NULL,'Western Cuisine'),(16,3,'Bread Sandwich','Food provides essential nutrients for overall health and well - being',24,0,0,NULL,'Western Cuisine'),(17,6,'Cup Cake','Food provides essential nutrients for overall health and well - being',14,0,0,NULL,'Deserts'),(18,6,'Vegan Cake','Food provides essential nutrients for overall health and well - being',12,0,0,NULL,'Deserts'),(19,6,'Butterscotch Cake','Food provides essential nutrients for overall health and well - being',20,0,0,NULL,'Deserts'),(20,6,'Sliced Cake','Food provides essential nutrients for overall health and well - being',15,0,0,NULL,'Deserts'),(21,3,'Garlic Mushroom ','Food provides essential nutrients for overall health and well - being',14,0,0,NULL,'Western Cuisine'),(22,3,'Fried Cauliflower','Food provides essential nutrients for overall health and well - being',22,0,0,NULL,'Western Cuisine'),(23,3,'Mix Veg Pulao','Food provides essential nutrients for overall health and well - being',10,0,0,NULL,'Western Cuisine'),(24,3,'Rice Zucchini','Food provides essential nutrients for overall health and well - being',12,0,0,NULL,'Western Cuisine'),(25,3,'Cheese Pasta','Food provides essential nutrients for overall health and well - being',12,0,0,NULL,'Western Cuisine'),(26,3,'Tomato Pasta','Food provides essential nutrients for overall health and well - being',18,0,0,NULL,'Western Cuisine'),(27,3,'Creamy Pasta','Food provides essential nutrients for overall health and well - being',16,0,0,NULL,'Western Cuisine'),(28,3,'Chicken Pasta','Food provides essential nutrients for overall health and well - being',24,0,0,NULL,'Western Cuisine'),(29,3,'Buttter Noodles','Food provides essential nutrients for overall health and well - being',14,0,0,NULL,'Western Cuisine'),(30,3,'Veg Noodles','Food provides essential nutrients for overall health and well - being',12,0,0,NULL,'Western Cuisine'),(31,3,'Somen Noodles','Food provides essential nutrients for overall health and well - being',20,0,0,NULL,'Western Cuisine'),(32,3,'Cooked Noodles','Food provides essential nutrients for overall health and well - being',15,0,0,NULL,'Western Cuisine'),(33,1,'Salmon Sashimi','Fresh Atlantic salmon slices',28,220,0,'Fish','Japanese Cuisine'),(34,1,'Wagyu Sushi Roll','Marbled beef with truffle sauce',45,380,55,'Dairy','Japanese Cuisine'),(35,2,'Peking Duck','Crispy skin with hoisin sauce',68,650,40,'Gluten','Chinese Cuisine'),(36,2,'Kung Pao Chicken','Szechuan style with peanuts',24,420,30,'Peanuts','Chinese Cuisine'),(37,3,'Beef Bourguignon','Red wine braised beef',52,580,25,'Alcohol','Western Cuisine'),(38,3,'Crème Br?lée','Vanilla bean custard',18,320,45,'Dairy','Dessert'),(39,4,'Tom Yum Goong','Spicy shrimp soup',22,280,15,'Shellfish','Thai Cuisine'),(40,4,'Green Curry Chicken','Coconut milk based curry',26,450,35,'Tree Nut','Thai Cuisine'),(41,5,'Galbi Short Ribs','Marinated beef ribs',38,520,20,'Soy','Korean Cuisine'),(42,5,'Bibimbap','Mixed rice with vegetables',20,480,60,'Egg','Korean Cuisine');
/*!40000 ALTER TABLE `menuitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menuitemingredient`
--

DROP TABLE IF EXISTS `menuitemingredient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menuitemingredient` (
  `menuItemIngredientId` int NOT NULL,
  `menuItemId` int NOT NULL,
  `ingredientId` int NOT NULL,
  `quantity` double NOT NULL,
  PRIMARY KEY (`menuItemIngredientId`),
  KEY `MenuItemIngredient_menuItemId_idx` (`menuItemId`),
  KEY `FK_Ingredient` (`ingredientId`),
  CONSTRAINT `FK_Ingredient` FOREIGN KEY (`ingredientId`) REFERENCES `ingredient` (`ingredientId`),
  CONSTRAINT `MenuItemIngredient_MenuItemId` FOREIGN KEY (`menuItemId`) REFERENCES `menuitem` (`menuItemId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menuitemingredient`
--

LOCK TABLES `menuitemingredient` WRITE;
/*!40000 ALTER TABLE `menuitemingredient` DISABLE KEYS */;
INSERT INTO `menuitemingredient` VALUES (1,33,1,200),(2,33,21,10),(3,34,2,150),(4,34,3,100),(5,34,4,20),(6,35,12,200),(7,35,22,50),(8,36,17,100),(9,36,5,20),(10,36,9,2),(11,37,19,300),(12,37,13,100),(13,37,11,30),(14,38,11,50),(15,38,16,2),(16,39,8,5),(17,39,10,2),(18,39,14,30),(19,40,7,200),(20,40,18,10),(21,40,23,20),(22,41,19,250),(23,41,15,30),(24,42,3,200),(25,42,20,50),(26,42,6,80);
/*!40000 ALTER TABLE `menuitemingredient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `notificationId` int NOT NULL,
  `customerId` int NOT NULL,
  `notificationTypeId` int NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `timestamp` date NOT NULL,
  PRIMARY KEY (`notificationId`),
  KEY `Notification_customerId_idx` (`customerId`),
  KEY `Notification_notificationTypeId_idx` (`notificationTypeId`),
  CONSTRAINT `Notification_customerId` FOREIGN KEY (`customerId`) REFERENCES `customer` (`customerId`),
  CONSTRAINT `Notification_notificationTypeId` FOREIGN KEY (`notificationTypeId`) REFERENCES `notificationtype` (`notificationTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificationtype`
--

DROP TABLE IF EXISTS `notificationtype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificationtype` (
  `notificationTypeId` int NOT NULL,
  `typeName` varchar(255) NOT NULL,
  PRIMARY KEY (`notificationTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificationtype`
--

LOCK TABLES `notificationtype` WRITE;
/*!40000 ALTER TABLE `notificationtype` DISABLE KEYS */;
/*!40000 ALTER TABLE `notificationtype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `orderId` int NOT NULL,
  `customerId` int NOT NULL,
  `orderDate` date NOT NULL,
  `orderStatus` varchar(255) NOT NULL,
  `totalAmount` decimal(10,0) NOT NULL,
  `paymentStatus` varchar(255) NOT NULL,
  PRIMARY KEY (`orderId`),
  KEY `Order_CustomerId_idx` (`customerId`),
  CONSTRAINT `Order_CustomerId` FOREIGN KEY (`customerId`) REFERENCES `customer` (`customerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderitem`
--

DROP TABLE IF EXISTS `orderitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderitem` (
  `orderItemId` int NOT NULL,
  `orderId` int NOT NULL,
  `menuItemId` int NOT NULL,
  `quantity` int NOT NULL,
  `unitPrice` decimal(10,0) NOT NULL,
  `totalPrice` decimal(10,0) NOT NULL,
  PRIMARY KEY (`orderItemId`),
  KEY `OrderItem_OrderId_idx` (`orderId`),
  KEY `OrderItem_MenuItemId_idx` (`menuItemId`),
  CONSTRAINT `OrderItem_MenuItemId` FOREIGN KEY (`menuItemId`) REFERENCES `menuitem` (`menuItemId`),
  CONSTRAINT `OrderItem_OrderId` FOREIGN KEY (`orderId`) REFERENCES `order` (`orderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderitem`
--

LOCK TABLES `orderitem` WRITE;
/*!40000 ALTER TABLE `orderitem` DISABLE KEYS */;
/*!40000 ALTER TABLE `orderitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `paymentId` int NOT NULL,
  `orderId` int NOT NULL,
  `paymentMethodId` int NOT NULL,
  `paymentDate` date NOT NULL,
  PRIMARY KEY (`paymentId`),
  KEY `Payment_OrderId_idx` (`orderId`),
  KEY `Payment_PaymentMethodId_idx` (`paymentMethodId`),
  CONSTRAINT `Payment_OrderId` FOREIGN KEY (`orderId`) REFERENCES `order` (`orderId`),
  CONSTRAINT `Payment_PaymentMethodId` FOREIGN KEY (`paymentMethodId`) REFERENCES `paymentmethod` (`paymentMethodId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paymentmethod`
--

DROP TABLE IF EXISTS `paymentmethod`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paymentmethod` (
  `paymentMethodId` int NOT NULL,
  `paymentMethodName` varchar(255) NOT NULL,
  PRIMARY KEY (`paymentMethodId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paymentmethod`
--

LOCK TABLES `paymentmethod` WRITE;
/*!40000 ALTER TABLE `paymentmethod` DISABLE KEYS */;
/*!40000 ALTER TABLE `paymentmethod` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission`
--

DROP TABLE IF EXISTS `permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission` (
  `permissionId` int NOT NULL,
  `permissionName` varchar(255) NOT NULL,
  PRIMARY KEY (`permissionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission`
--

LOCK TABLES `permission` WRITE;
/*!40000 ALTER TABLE `permission` DISABLE KEYS */;
INSERT INTO `permission` VALUES (1,'customer');
/*!40000 ALTER TABLE `permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `permissionId` int NOT NULL,
  `permissionName` varchar(255) NOT NULL,
  PRIMARY KEY (`permissionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recommendation`
--

DROP TABLE IF EXISTS `recommendation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommendation` (
  `recommendationId` int NOT NULL AUTO_INCREMENT,
  `customerId` int NOT NULL,
  `menuItemId` int NOT NULL,
  PRIMARY KEY (`recommendationId`),
  KEY `Recommendation_CustomerId_idx` (`customerId`),
  KEY `Recommendation_MenuItemId_idx` (`menuItemId`),
  CONSTRAINT `Recommendation_CustomerId` FOREIGN KEY (`customerId`) REFERENCES `customer` (`customerId`),
  CONSTRAINT `Recommendation_MenuItemId` FOREIGN KEY (`menuItemId`) REFERENCES `menuitem` (`menuItemId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommendation`
--

LOCK TABLES `recommendation` WRITE;
/*!40000 ALTER TABLE `recommendation` DISABLE KEYS */;
INSERT INTO `recommendation` VALUES (1,1002,5),(2,1002,6),(3,1002,7);
/*!40000 ALTER TABLE `recommendation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurant`
--

DROP TABLE IF EXISTS `restaurant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurant` (
  `restaurantID` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `contactinfo` varchar(255) NOT NULL,
  `rating` double NOT NULL,
  PRIMARY KEY (`restaurantID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurant`
--

LOCK TABLES `restaurant` WRITE;
/*!40000 ALTER TABLE `restaurant` DISABLE KEYS */;
INSERT INTO `restaurant` VALUES (1,'Sakura Arashi','+81-3-1234-0001',4.8),(2,'Dragon Phoenix Bistro','+86-21-8765-0202',4.7),(3,'Grand Horizon Grill','+33-1-9876-3303',4.6),(4,'Spice of Siam','+66-2-1122-4404',4.9),(5,'Hana Hearth','+82-2-5566-5505',4.7),(6,'Sugar Haven','+82-2-8866-5505',4.9);
/*!40000 ALTER TABLE `restaurant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `reviewId` int NOT NULL,
  `customerId` int NOT NULL,
  `restaurantID` int NOT NULL,
  `rating` int NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `reviewDate` date NOT NULL,
  PRIMARY KEY (`reviewId`),
  KEY `Review_CustomerId_idx` (`customerId`),
  KEY `Review_RestaurantId_idx` (`restaurantID`),
  CONSTRAINT `Review_CustomerId` FOREIGN KEY (`customerId`) REFERENCES `customer` (`customerId`),
  CONSTRAINT `Review_RestaurantId` FOREIGN KEY (`restaurantID`) REFERENCES `restaurant` (`restaurantID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `staffId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`staffId`),
  KEY `StaffUserID_idx` (`userId`),
  CONSTRAINT `Staff_UserID` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staffs`
--

DROP TABLE IF EXISTS `staffs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staffs` (
  `staffId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`staffId`),
  UNIQUE KEY `userId` (`userId`),
  CONSTRAINT `staffs_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staffs`
--

LOCK TABLES `staffs` WRITE;
/*!40000 ALTER TABLE `staffs` DISABLE KEYS */;
/*!40000 ALTER TABLE `staffs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `systemlog`
--

DROP TABLE IF EXISTS `systemlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `systemlog` (
  `logId` int NOT NULL,
  `customerId` int NOT NULL,
  `serviceId` int NOT NULL,
  `logDate` date NOT NULL,
  `operationType` varchar(255) NOT NULL,
  `logMessage` varchar(255) DEFAULT NULL,
  `logLevel` varchar(255) NOT NULL,
  PRIMARY KEY (`logId`),
  KEY `SystemLog_CustomerId_idx` (`customerId`),
  CONSTRAINT `SystemLog_CustomerId` FOREIGN KEY (`customerId`) REFERENCES `customer` (`customerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `systemlog`
--

LOCK TABLES `systemlog` WRITE;
/*!40000 ALTER TABLE `systemlog` DISABLE KEYS */;
/*!40000 ALTER TABLE `systemlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(45) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `permissionId` int NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `user_permissionId` (`permissionId`),
  CONSTRAINT `user_permissionId` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`permissionId`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=1011 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1001,'testuser','testpassword','test@example.com','123 Test St','1234567890',1),(1002,'tim','password','tim@tim.com','Hong Kong ','88888882',1),(1003,'test2','password','test2@example.com','Hong Kong','99999999',1),(1004,'test3','password','test3@example.com','Hong Kong','88888888',1),(1005,'test5','password','test5@example.com','Hong Kong','88888888',1),(1006,'hei','12345678','hei@hei.com','Room7A, 6/F, Test House, Test Road, TKO','12345678',1),(1007,'admin1','admin1','admin1@admin.com','hk','11111111',1),(1008,'tim2','password','tim2@tim2.com','Hong Kong','89898989',1),(1009,'tim3','password','tim3@tim3.com','Hong Kong ','19191919191',1),(1010,'tim5','password','tim5@tim5.com','Hong Kong','181818181818',1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-01 20:40:50


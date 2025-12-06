-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 31, 2024 at 12:46 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `web24`
DROP DATABASE web24;
CREATE DATABASE web24;
USE web24;

-- --------------------------------------------------------



CREATE TABLE `announcements` (
  `announcement_id` int(11) NOT NULL,
  `product_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `baseposition` (
  `lat` double DEFAULT NULL,
  `lon` double DEFAULT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `categories` (
  `category_id` int(255) NOT NULL,
  `category_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `details` (
  `detail_name` varchar(255) NOT NULL,
  `detail_value` varchar(255) NOT NULL,
  `product_id` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `offers` (
  `offer_id` int(255) NOT NULL,
  `user_id` int(255) NOT NULL,
  `product_id` int(255) NOT NULL,
  `product_quantity` int(255) NOT NULL,
  `assigned_vehicle` int(11) DEFAULT NULL,
  `initial_offer_date` datetime NOT NULL DEFAULT current_timestamp(),
  `accepted_date` datetime DEFAULT NULL,
  `completion_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `person` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` bigint(255) NOT NULL,
  `lat` double DEFAULT NULL,
  `lon` double DEFAULT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `products` (
  `product_id` int(255) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `category_id` int(255) NOT NULL,
  `quantity` int(255) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `requests` (
  `request_id` int(255) NOT NULL,
  `user_id` int(255) NOT NULL,
  `product_id` int(255) NOT NULL,
  `product_quantity` int(255) NOT NULL,
  `assigned_vehicle` int(11) DEFAULT NULL,
  `number_of_people` int(255) NOT NULL,
  `initial_request_date` datetime NOT NULL DEFAULT current_timestamp(),
  `accepted_date` datetime DEFAULT NULL,
  `completion_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `vehicleproducts` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `vehicles` (
  `vehicle_id` int(11) NOT NULL,
  `resquer_id` int(11) NOT NULL,
  `lat` double NOT NULL,
  `lon` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

INSERT INTO `announcements` (`announcement_id`, `product_ids`, `date`) VALUES
(1, '{\"product_ids\": [\"16\", \"17\", \"18\"]}', '2024-01-23'),
(2, '{\"product_ids\": [\"19\", \"20\", \"21\"]}', '2024-01-23'),
(3, '{\"product_ids\":[\"16\",\"17\",\"18\",\"19\",\"20\",\"21\",\"22\",\"23\",\"24\",\"25\"]}', '2024-01-29'),
(4, '{\"product_ids\":[\"101\",\"102\"]}', '2024-01-29'),
(5, '{\"product_ids\":[\"186\",\"187\"]}', '2024-01-29'),
(6, '{\"product_ids\":[\"65\",\"66\",\"67\"]}', '2024-01-29');

-- --------------------------------------------------------

INSERT INTO `baseposition` (`lat`, `lon`) VALUES
(38.246361, 21.734966);

-- --------------------------------------------------------

INSERT INTO `categories` (`category_id`, `category_name`) VALUES
(5, 'Food'),
(6, 'Beverages'),
(7, 'Clothing'),
(8, 'Hacker of class'),
(9, '2d hacker'),
(11, 'Test'),
(13, '-----'),
(14, 'Flood'),
(15, 'new cat'),
(16, 'Medical Supplies'),
(19, 'Shoes'),
(21, 'Personal Hygiene '),
(22, 'Cleaning Supplies'),
(23, 'Tools'),
(24, 'Kitchen Supplies'),
(25, 'Baby Essentials'),
(26, 'Insect Repellents'),
(27, 'Electronic Devices'),
(28, 'Cold weather'),
(29, 'Animal Food'),
(30, 'Financial support'),
(33, 'Cleaning Supplies.'),
(34, 'Hot Weather'),
(35, 'First Aid '),
(39, 'Test_0'),
(40, 'test1'),
(41, 'pet supplies'),
(42, 'Μedicines'),
(43, 'Energy Drinks');

-- --------------------------------------------------------

INSERT INTO `details` (`detail_name`, `detail_value`, `product_id`) VALUES
('volume', '1.5l', 16),
('pack size', '6', 16),
('volume', '250ml', 17),
('pack size', '12', 17),
('brand', 'Trata', 18),
('weight', '200g', 18),
('weight', '500g', 19),
('weight', '1kg', 20),
('type', 'white', 20),
('weight', '100g', 21),
('type', 'milk chocolate', 21),
('brand', 'ION', 21),
('size', '44', 22),
('weight', '500g', 23),
('pack size', '12', 23),
('expiry date', '13/12/1978', 23),
('Details', '600ml', 24),
('grams', '500', 25),
('calories', '200', 26),
('volume', '200mg', 35),
('size', '50\" x 60\"', 36),
('stock', '500', 38),
('size', '3', 38),
('stock', '500', 39),
('size', 'regular', 39),
('stock', '300', 40),
('ply', '3', 40),
('volume', '500gr', 41),
('stock ', '500', 41),
('scent', 'aloe', 41),
('stock', '500', 42),
('stock', '250', 43),
('stock', '200', 44),
('stock', '200', 45),
('stock', '2000', 46),
('dosage', '500mg', 46),
('stock ', '10', 47),
('dosage', '200mg', 47),
('wtwty', 'wytwty', 83),
('Volume', '500ml', 85),
('volume', '75ml', 86),
('duration', '7 hours', 87),
('volume', '250ml', 88),
('material', 'silicone', 89),
('weight', '400gr', 90),
('weight', '23,5gr', 91),
('Number of different tools', '3', 92),
('Tool', 'Knife', 92),
('Tool', 'Screwdriver', 92),
('Tool', 'Spoon', 92),
('Basic Ingredients', 'Iodine', 93),
('Suggested for', 'Everyone expept pregnant women', 93),
('Power', 'Batteries', 94),
('Frequencies Range', '3 kHz - 3000 GHz', 94),
('volume', '500ml', 100),
('volume', '500g', 101),
('volume', '500g', 102),
('volume', '500ml', 104),
('volume', '20pieces', 105),
('size', 'XL', 106),
('Adhesive', '2 meters', 125),
('Povidone iodine 10%', '240 ml', 126),
('100% Hydrofile', '70gr', 127),
('Quantity per package', '10', 128),
('Packages', '2', 128),
('piece', '10 pieces', 129),
('pank', '10 packs', 130),
('packet of pills', '20 pills', 131),
('packet of pills', '20 pills', 132),
('pieces', '1', 133),
('volume', '500ml', 134),
('rolls', '1 roll', 135),
('volume', '100ml', 136),
('packet', '1 packet', 137),
('pills', '10 pills', 138),
('weight', '105g', 140),
('weight', '45g', 146),
('pcs', '18', 147),
('weight', '100', 148),
('weight', '100', 149),
('weight', '100', 150),
('weight', '200g', 151),
('volume', '200g', 153),
('Potency', 'High', 154),
('ml', '500', 160),
('grams', '1000', 166),
('grams', '500', 167),
('pair', '10', 168),
('grams', '1000', 169),
('grams', '500', 170),
('grams', '1000', 171),
('grams', '500', 172),
('grams', '1000', 173),
('grams', '500', 175),
('10', '600ml', 186),
('67', '1000mg', 187),
('10', '330ml', 188),
('22', '330', 189),
('31', '500ml', 190),
('40', '330ml', 191),
('23', '500ml', 192),
('15', '500ml', 193),
('16', 'Mini', 194),
('5', 'Medium', 195),
('6', 'Large', 195),
('10', 'Small', 195),
('2', 'XL', 195);

-- --------------------------------------------------------

/*INSERT INTO `offers` (`offer_id`, `user_id`, `product_id`,`product_quantity`, `assigned_vehicle`, `initial_offer_date`, `accepted_date`, `completion_date`) VALUES
(1, 9, 18, 3, NULL, '2024-01-24', '2024-01-25', NULL),
(2, 3, 50, 10, NULL, '2024-01-26', '2024-01-27', NULL),
(3, 10, 34, 45, NULL, '2024-01-25', '2024-01-26', NULL),
(4, 6, 97, 20, NULL, '2024-01-25', '2024-01-26', NULL),
(5, 7, 130, 8, NULL, '2024-01-26', '2024-01-27', NULL),
(6, 7, 120, 5, NULL, '2024-01-26', '2024-01-27', NULL),
(7, 7, 84, 1, NULL, '2024-01-26', '2024-01-30', NULL),
(8, 12, 54, 17, NULL, '2024-01-28', NULL, NULL);*/

-- --------------------------------------------------------

INSERT INTO `person` (`user_id`, `first_name`, `last_name`, `email`, `password`, `phone`, `lat`, `lon`, `admin`) VALUES
(1, 'Ιωάννα', 'Παπαδοπούλου', 'ioanna@gmail.com', '123456789*aA', 6932345678, 38.2516, 21.7376, 2),
(2, 'Γιάννης', 'Δημητρίου', 'giannis@gmail.com', '123456789*aA', 6944567890, NULL, NULL, 1),
(3, 'Αλίκη', 'Σταματίου', 'alice@gmail.com', '123456789*aA', 6974567890, 38.2468, 21.7344, 0),
(4, 'Βασίλης', 'Γεωργίου', 'vasilis@gmail.com', '123456789*aA', 6912345678, 38.2549, 21.7347, 0),
(5, 'Eva', 'Miller', 'eva@gmail.com', '123456789*aA', 6977654321, NULL, NULL, 1),
(6, 'Maria', 'Papadopoulou', 'maria@gmail.com', '123456789*aA', 6955678901, 38.2355, 21.7462, 0),
(7, 'Nikos', 'Kouros', 'nikos@gmail.com', '123456789*aA', 6932345678, 38.2417, 21.7291, 0),
(8, 'Anna', 'Karagiannis', 'anna@gmail.com', '123456789*aA', 6955678901, NULL, NULL, 1),
(9, 'Dimitris', 'Pappas', 'dimitris@gmail.com', '123456789*aA', 6911234567, 38.2326, 21.7391, 0),
(10, 'Katerina', 'Stavrou', 'katerina@gmail.com', '123456789*aA', 6999876543, 38.2493, 21.7437, 0),
(11, 'Alex', 'Nikolopoulos', 'alex@gmail.com', '123456789*aA', 6988765432, NULL, NULL, 1),
(12, 'Sophia', 'Ralli', 'sophia@gmail.com', '123456789*aA', 6922345678, 38.2422, 21.7378, 0),
(13, 'Panos', 'Zachopoulos', 'panos@gmail.com', '123456789*aA', 6923456789, 38.2368, 21.7537, 0),
(14, 'Eleni', 'Makri', 'eleni@gmail.com', '123456789*aA', 6944567890, NULL, NULL, 1),
(15, 'Costas', 'Xenakis', 'costas@gmail.com', '123456789*aA', 6955678901, 38.2333, 21.7516, 0),
(18, 'Mihail', 'Laskaris', 'laskaris@gmail.com', '123456789*aA', 6912345678, 0, 0, 1);

-- --------------------------------------------------------

INSERT INTO `products` (`product_id`, `product_name`, `category_id`, `quantity`) VALUES
(16, 'Water', 6, 105),
(17, 'Orange juice', 6, 100),
(18, 'Sardines', 5, 5),
(19, 'Canned corn', 5, 6),
(20, 'Bread', 5, 0),
(21, 'Chocolate', 5, 3),
(22, 'Men Sneakers', 7, 0),
(23, 'Test Product', 9, 0),
(24, 'Test Val', 14, 0),
(25, 'Spaghetti', 5, 0),
(26, 'Croissant', 5, 0),
(29, 'Biscuits', 5, 0),
(30, 'Bandages', 16, 0),
(31, 'Disposable gloves', 16, 0),
(32, 'Gauze', 16, 0),
(33, 'Antiseptic', 16, 0),
(34, 'First Aid Kit', 16, 0),
(35, 'Painkillers', 16, 0),
(36, 'Blanket', 7, 0),
(37, 'Fakes', 5, 0),
(38, 'Menstrual Pads', 21, 0),
(39, 'Tampon', 21, 0),
(40, 'Toilet Paper', 21, 0),
(41, 'Baby wipes', 21, 0),
(42, 'Toothbrush', 21, 0),
(43, 'Toothpaste', 21, 0),
(44, 'Vitamin C', 16, 0),
(45, 'Multivitamines', 16, 0),
(46, 'Paracetamol', 16, 0),
(47, 'Ibuprofen', 16, 0),
(51, 'Cleaning rag', 22, 0),
(52, 'Detergent', 22, 0),
(53, 'Disinfectant', 22, 0),
(54, 'Mop', 22, 0),
(55, 'Plastic bucket', 22, 0),
(56, 'Scrub brush', 22, 0),
(57, 'Dust mask', 22, 0),
(58, 'Broom', 22, 0),
(59, 'Hammer', 23, 0),
(60, 'Skillsaw', 23, 0),
(61, 'Prybar', 23, 0),
(62, 'Shovel', 23, 0),
(63, 'Flashlight', 23, 0),
(64, 'Duct tape', 23, 0),
(65, 'Underwear', 7, 0),
(66, 'Socks', 7, 0),
(67, 'Warm Jacket', 7, 0),
(68, 'Raincoat', 7, 0),
(69, 'Gloves', 7, 0),
(70, 'Pants', 7, 0),
(71, 'Boots', 7, 0),
(72, 'Dishes', 24, 0),
(73, 'Pots', 24, 0),
(74, 'Paring knives', 24, 0),
(75, 'Pan', 24, 0),
(76, 'Glass', 24, 0),
(83, 't22', 9, 0),
(84, 'water ', 6, 0),
(85, 'Coca Cola', 6, 0),
(86, 'spray', 26, 0),
(87, 'Outdoor spiral', 26, 0),
(88, 'Baby bottle', 25, 0),
(89, 'Pacifier', 25, 0),
(90, 'Condensed milk', 5, 0),
(91, 'Cereal bar', 5, 0),
(92, 'Pocket Knife', 23, 0),
(93, 'Water Disinfection Tablets', 16, 0),
(94, 'Radio', 27, 0),
(95, 'Kitchen appliances', 14, 0),
(96, 'Winter hat', 28, 0),
(97, 'Winter gloves', 28, 0),
(98, 'Scarf', 28, 0),
(99, 'Thermos', 28, 0),
(100, 'Tea', 6, 0),
(101, 'Dog Food ', 29, 0),
(102, 'Cat Food', 29, 0),
(103, 'Canned', 5, 0),
(104, 'Chlorine', 22, 0),
(105, 'Medical gloves', 22, 0),
(106, 'T-Shirt', 7, 0),
(107, 'Cooling Fan', 34, 0),
(108, 'Cool Scarf', 34, 0),
(109, 'Whistle', 23, 0),
(110, 'Blankets', 28, 0),
(111, 'Sleeping Bag', 28, 0),
(112, 'Toothbrush', 21, 0),
(113, 'Toothpaste', 21, 0),
(114, 'Thermometer', 16, 0),
(115, 'Rice', 5, 0),
(116, 'Bread', 5, 0),
(117, 'Towels', 22, 0),
(118, 'Wet Wipes', 22, 0),
(119, 'Fire Extinguisher', 23, 0),
(120, 'Fruits', 5, 0),
(121, 'Duct Tape', 23, 0),
(123, 'Αθλητικά', 19, 0),
(124, 'Πασατέμπος', 5, 0),
(125, 'Bandages', 35, 0),
(126, 'Betadine', 35, 0),
(127, 'cotton wool', 35, 0),
(128, 'Crackers', 5, 0),
(129, 'Sanitary Pads', 21, 0),
(130, 'Sanitary wipes', 21, 0),
(131, 'Electrolytes', 16, 0),
(132, 'Pain killers', 16, 0),
(133, 'Flashlight', 23, 0),
(134, 'Juice', 6, 0),
(135, 'Toilet Paper', 21, 0),
(136, 'Sterilized Saline', 16, 0),
(137, 'Biscuits', 5, 0),
(138, 'Antihistamines', 16, 0),
(139, 'Instant Pancake Mix', 5, 0),
(140, 'Lacta', 5, 0),
(141, 'Canned Tuna', 5, 0),
(142, 'Batteries', 23, 0),
(143, 'Dust Mask', 35, 0),
(144, 'Can Opener', 23, 0),
(146, 'Πατατάκια', 5, 0),
(147, 'Σερβιέτες', 21, 0),
(148, 'Dry Cranberries', 5, 0),
(149, 'Dry Apricots', 5, 0),
(150, 'Dry Figs', 5, 0),
(151, 'Παξιμάδια', 5, 0),
(153, 'Test Item', 11, 0),
(154, 'Painkillers', 35, 0),
(155, 'Tampons', 16, 0),
(156, 'plaster set', 41, 0),
(157, 'elastic bandages', 41, 0),
(158, 'traumaplast', 41, 0),
(159, 'thermal blanket', 41, 0),
(160, 'burn gel', 41, 0),
(161, 'pet carrier', 41, 0),
(162, 'pet dishes', 41, 0),
(163, 'plastic bags', 41, 0),
(164, 'toys', 41, 0),
(165, 'burn pads', 41, 0),
(166, 'cheese', 5, 0),
(167, 'lettuce', 5, 0),
(168, 'eggs', 5, 0),
(169, 'steaks', 5, 0),
(170, 'beef burgers', 5, 0),
(171, 'tomatoes', 5, 0),
(172, 'onions', 5, 0),
(173, 'flour', 5, 0),
(174, 'pastel', 5, 0),
(175, 'nuts', 5, 0),
(176, 'dramamines', 42, 0),
(177, 'nurofen', 42, 0),
(178, 'imodium', 42, 0),
(179, 'emetostop', 42, 0),
(180, 'xanax', 42, 0),
(181, 'saflutan', 42, 0),
(182, 'sadolin', 42, 0),
(183, 'depon', 42, 0),
(184, 'panadol', 42, 0),
(185, 'ponstan ', 42, 0),
(186, 'algofren', 42, 0),
(187, 'effervescent depon', 42, 0),
(188, 'cold coffee', 6, 0),
(189, 'Hell', 43, 0),
(190, 'Monster', 43, 0),
(191, 'Redbull', 43, 0),
(192, 'Powerade', 43, 0),
(193, 'PRIME', 43, 0),
(194, 'Lighter', 23, 0),
(195, 'isothermally shirts', 28, 0);

-- --------------------------------------------------------

/*INSERT INTO `requests` (`request_id`, `user_id`, `product_id`, `product_quantity`, `assigned_vehicle`, `number_of_people`, `initial_request_date`, `accepted_date`, `completion_date`) VALUES
(1, 3, 16, 12, NULL, 2, '2024-01-24', '2024-01-31', '2024-01-31'),
(2, 6, 40, 41, NULL, 3, '2024-01-24', '2024-01-30', '2024-01-30'),
(3, 9, 85, 2, NULL , 2, '2024-01-25', '2024-01-26', NULL),
(4, 7, 130, 42, NULL, 5, '2024-01-25', '2024-01-27', '2024-01-27'),
(5, 12, 23, 5, NULL, 2, '2024-01-26', '2024-01-27', NULL),
(6, 15, 34, 15, NULL, 3, '2024-01-26', '2024-01-27', NULL),
(7, 3, 97, 2, NULL, 1, '2024-01-27', NULL, NULL),
(8, 9, 60, 23, NULL, 4, '2024-01-26', '2024-01-27', '2024-01-27'),
(9, 10, 45, 7, NULL, 2, '2024-01-27', '2024-01-27', NULL),
(10, 7, 75, 8, NULL, 1, '2024-01-27', NULL, NULL),
(11, 6, 105, 14, NULL, 3, '2024-01-24', '2024-01-25', NULL),
(12, 13, 88, 3, NULL, 2, '2024-01-24', '2024-01-25', '2024-01-28'),
(13, 3, 106, 32, NULL, 4, '2024-01-25', '2024-01-26', '2024-01-27'),
(14, 6, 93, 24, NULL, 3, '2024-01-26', NULL, NULL),
(15, 10, 16, 10, NULL, 2, '2024-01-26', '2024-01-27', '2024-01-28'),
(16, 15, 40, 19, NULL, 3, '2024-01-27', '2024-01-28', '2024-01-29'),
(17, 7, 85, 4, NULL, 1, '2024-01-28', NULL, NULL),
(18, 3, 130, 40, NULL, 5, '2024-01-28', '2024-01-29', NULL),
(19, 12, 23, 9, NULL, 2, '2024-01-28', '2024-01-29', NULL),
(20, 9, 34, 10, NULL, 3, '2024-01-29', '2024-01-30', NULL),
(21, 10, 97, 7, NULL, 1, '2024-01-29', '2024-01-30', NULL),
(22, 4, 46, 46, NULL, 5, '2024-01-28', NULL, NULL);*/

-- --------------------------------------------------------

/* INSERT INTO `vehicleproducts` (`product_id`, `product_name`, `vehicle_id`, `quantity`) VALUES
(16, 'Water', 1, 10),
(17, 'Orange juice', 1, 20),
(18, 'Sardines', 1, 30),
(19, 'Canned corn', 1, 40);*/

-- --------------------------------------------------------

INSERT INTO `vehicles` (`vehicle_id`, `resquer_id`, `lat`, `lon`) VALUES
(1, 2, 38.2305, 21.7532),
(2, 5, 38.2444, 21.7348),
(3, 8, 38.2379, 21.7583),
(4, 11, 38.248, 21.7575),
(5, 14, 38.2477, 21.7424),
(6, 18, 38.27371, 21.7681);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`announcement_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`offer_id`);

--
-- Indexes for table `person`
--
ALTER TABLE `person`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`request_id`);

--
-- Indexes for table `vehicleproducts`
--
ALTER TABLE `vehicleproducts`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`vehicle_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `announcement_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
  
--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `offers`
--
ALTER TABLE `offers`
  MODIFY `offer_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `person`
--
ALTER TABLE `person`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;


--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
  
--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `request_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `vehicle_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
);
CREATE TABLE `booking` (
  `date` date NOT NULL,
  `time` time NOT NULL,
  `type_court` varchar(20) NOT NULL,
  `num_court` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `type_pay` varchar(20) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `id` int(11) UNSIGNED NOT NULL
)
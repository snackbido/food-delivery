CREATE DATABASE IF NOT EXISTS auth;
CREATE DATABASE IF NOT EXISTS notifications;
CREATE DATABASE IF NOT EXISTS orders;
GRANT ALL PRIVILEGES ON auth.* TO 'food-delivery'@'%';
GRANT ALL PRIVILEGES ON notifications.* TO 'food-delivery'@'%';
GRANT ALL PRIVILEGES ON orders.* TO 'food-delivery'@'%';
FLUSH PRIVILEGES;
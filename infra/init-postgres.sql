-- Tạo database
CREATE DATABASE restaurant;
CREATE DATABASE payment;
CREATE DATABASE review;

-- Database: restaurant
\connect restaurant
GRANT CONNECT ON DATABASE restaurant TO "food-delivery";
GRANT USAGE ON SCHEMA public TO "food-delivery";
GRANT CREATE, SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "food-delivery";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "food-delivery";

-- Database: payment
\connect payment
GRANT CONNECT ON DATABASE payment TO "food-delivery";
GRANT USAGE ON SCHEMA public TO "food-delivery";
GRANT CREATE, SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "food-delivery";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "food-delivery";

-- Database: review
\connect review
GRANT CONNECT ON DATABASE review TO "food-delivery";
GRANT USAGE ON SCHEMA public TO "food-delivery";
GRANT CREATE, SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "food-delivery";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "food-delivery";
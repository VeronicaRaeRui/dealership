DROP DATABASE IF  EXISTS dealership_proj_db;
CREATE DATABASE IF NOT EXISTS dealership_proj_db;

USE dealership_proj_db;
-- Tables 

CREATE TABLE `User` (
  username varchar(200) NOT NULL,
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  password varchar(60) NOT NULL,
  PRIMARY KEY (username)
);

CREATE TABLE Sells (
  username varchar(200) NOT NULL,
  VIN varchar(60) NOT NULL,
  customer_id int NOT NULL,
  sold_price float(10) NOT NULL,
  sold_date date NOT NULL,
  PRIMARY KEY (VIN)
);

CREATE TABLE Customer (
  customer_id int NOT NULL AUTO_INCREMENT,
  first_name varchar(200) NOT NULL,
  last_name varchar(200) NOT NULL,
  phone varchar(15) NOT NULL,
  email varchar(250) UNIQUE NOT NULL,
  company varchar(250) DEFAULT NULL,
  street varchar(250) NOT NULL,
  apt_suite varchar(250) DEFAULT NULL,
  city varchar(250) NOT NULL,
  state varchar(250) NOT NULL,
  zip_code varchar(250) NOT NULL,
  note varchar(250) DEFAULT NULL,
  PRIMARY KEY (customer_id)
);

CREATE TABLE `Repair`(
  VIN varchar(60) NOT NULL,
  start_date date NOT NULL,
  customer_id int NOT NULL, 
  username varchar(200) NOT NULL,
  repair_description varchar(250) NOT NULL,
  odometer_reading int(16) NOT NULL, 
  completion_date date NULL,
  labor_charge float(16) NOT NULL,
  PRIMARY KEY (VIN, start_date)
);

CREATE TABLE Part (
  VIN varchar(60) NOT NULL,
  start_date date NOT NULL,
  part_num varchar(60) NOT NULL, 
  quantity float(16) NOT NULL,
  part_price float(16) NOT NULL,
  vendor varchar(200) NOT NULL,
  PRIMARY KEY (VIN, start_date, part_num)
);
/*change attributes back to NOT NULL once valid data loaded*/
CREATE TABLE Vehicle (
  VIN varchar(60) NOT NULL,
  username varchar(200) NOT NULL,
  invoice_price float(10) NOT NULL, 
  manufacturer varchar(250) NOT NULL,
  vehicle_type varchar(250) NOT NULL,
  model_name varchar(250) NOT NULL,
  model_year int(16) NOT NULL,  /*modelyear should be 4 digits*/
  style_body varchar(250) DEFAULT NULL,
  engine varchar(250) DEFAULT NULL,
  transmission varchar(250) DEFAULT NULL,
  ordermeter_reading int(10) DEFAULT NULL,
  trim varchar(250) DEFAULT NULL,
  drive_type varchar(250) DEFAULT NULL,
  seats int(10) DEFAULT NULL,
  color varchar(250) DEFAULT NULL,
  vehicle_description varchar(250) DEFAULT NULL,
  added_date date NOT NULL,
  vehicle_image varchar(250) DEFAULT NULL,
  PRIMARY KEY (VIN)
);

CREATE TABLE Car (
  VIN varchar(60) NOT NULL,
  trunk_type  varchar(250) NOT NULL,
  PRIMARY KEY (VIN)
);

CREATE TABLE Suv (
  VIN varchar(60) NOT NULL,
  suv_type  varchar(250) NOT NULL,
  chassis_type  varchar(250) NOT NULL,
  PRIMARY KEY (VIN)
);

CREATE TABLE Convertible (
  VIN varchar(60) NOT NULL,
  roof_type varchar(60) NOT NULL,
  back_seat_count int(16) NOT NULL,
  PRIMARY KEY (VIN)
);

CREATE TABLE Van (
  VIN varchar(60) NOT NULL,
  driver_side_door int NOT NULL,
  PRIMARY KEY (VIN)
);

CREATE TABLE Truck (
  VIN varchar(60) NOT NULL,
  cargo_capacity float(10) NOT NULL,
  cargo_cover_type varchar(60) NULL,
  num_rear_axles int(16) NOT NULL,
  PRIMARY KEY (VIN)
);

-- Constraints Foreign Keys: FK_ChildTable_childColumn_ParentTable_parentColumn 
ALTER TABLE Vehicle
ADD CONSTRAINT fk_Vehicle_username_User_username  FOREIGN KEY (username) REFERENCES User (username),
ADD FULLTEXT(vehicle_description);

ALTER TABLE Sells 
ADD CONSTRAINT fk_Sells_customer_id_Customer_customer_id  FOREIGN KEY (customer_id) REFERENCES `customer` (customer_id),
ADD CONSTRAINT fk_Sells_VIN_Vehicle_VIN  FOREIGN KEY (VIN) REFERENCES Vehicle (VIN),
ADD CONSTRAINT fk_Sells_username_sales_username  FOREIGN KEY (username) REFERENCES User (username); 
 
ALTER TABLE `Repair` 
ADD CONSTRAINT fk_Repair_username_User_username  FOREIGN KEY (username) REFERENCES User (username), 
ADD CONSTRAINT fk_Repair_VIN_Sells_VIN FOREIGN KEY (VIN) REFERENCES Sells (VIN), 
ADD CONSTRAINT fk_Repair_customer_id_Customer_customer_id FOREIGN KEY (customer_id) REFERENCES `Customer` (customer_id); 

ALTER TABLE Part 
ADD CONSTRAINT fk_Part_VIN_start_date_Repair_VIN_start_date FOREIGN KEY (VIN, start_date) REFERENCES `Repair` (VIN, start_date);

ALTER TABLE Car 
ADD CONSTRAINT fk_Car_VIN_Vehicle_VIN FOREIGN KEY (VIN) REFERENCES `Vehicle` (VIN); 

ALTER TABLE Suv 
ADD CONSTRAINT fk_suv_VIN_Vehicle_VIN FOREIGN KEY (VIN) REFERENCES `Vehicle` (VIN); 

ALTER TABLE Convertible 
ADD CONSTRAINT fk_Convertible_VIN_Vehicle_VIN FOREIGN KEY (VIN) REFERENCES `Vehicle` (VIN); 

ALTER TABLE Van
ADD CONSTRAINT fk_Van_VIN_Vehicle_VIN FOREIGN KEY (VIN) REFERENCES `Vehicle` (VIN); 

ALTER TABLE Truck 
ADD CONSTRAINT fk_Truck_VIN_Vehicle_VIN FOREIGN KEY (VIN) REFERENCES `Vehicle` (VIN);
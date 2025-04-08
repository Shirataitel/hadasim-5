CREATE TABLE `people` (
  `Person_Id` int NOT NULL,
  `Personal_Name` varchar(20) DEFAULT NULL,
  `Family_Name` varchar(25) DEFAULT NULL,
  `Gender` ENUM('זכר', 'נקבה') NOT NULL,
  `Father_Id` int DEFAULT NULL,
  `Mother_Id` int DEFAULT NULL,
  `Spouse_Id` int DEFAULT NULL,
  PRIMARY KEY (`Person_Id`)
  );

CREATE TABLE `familytree` (
  `Person_Id` int NOT NULL,
  `Relative_Id` int NOT NULL,
  `Connection_Type` varchar(10) DEFAULT NULL);
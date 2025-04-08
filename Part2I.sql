-- add conections
INSERT INTO familytree (Person_Id, Relative_Id, Connection_Type)
-- add conection father
SELECT Person_Id, Father_Id, 'אב' FROM people WHERE Father_Id IS NOT NULL
UNION ALL
-- add conection children by father
SELECT Father_Id, Person_Id, 
       CASE WHEN Gender = 'זכר' THEN 'בן' ELSE 'בת' END
FROM people WHERE Father_Id IS NOT NULL
UNION ALL
-- add conection mother
SELECT Person_Id, Mother_Id, 'אם' FROM people WHERE Mother_Id IS NOT NULL
UNION ALL
-- add conection children by mother
SELECT Mother_Id, Person_Id, 
       CASE WHEN Gender = 'זכר' THEN 'בן' ELSE 'בת' END
FROM people WHERE Mother_Id IS NOT NULL
UNION ALL
-- add conection spouse
SELECT Person_Id, Spouse_Id, 
       CASE WHEN Gender = 'זכר' THEN 'בת זוג' ELSE 'בן זוג' END
FROM people WHERE Spouse_Id IS NOT NULL
UNION ALL
-- add conection siblings
SELECT P1.Person_Id, P2.Person_Id,
       CASE WHEN P2.Gender = 'זכר' THEN 'אח' ELSE 'אחות' END
FROM people P1
JOIN people P2 ON P1.Father_Id = P2.Father_Id 
               AND P1.Mother_Id = P2.Mother_Id 
               AND P1.Person_Id <> P2.Person_Id;

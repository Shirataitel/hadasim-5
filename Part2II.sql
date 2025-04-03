INSERT INTO familytree (Person_Id, Relative_Id, Connection_Type)
SELECT P2.Person_Id, P1.Person_Id, 
       CASE WHEN P2.Gender = 'זכר' THEN 'בת זוג' ELSE 'בן זוג' END
FROM people P1
JOIN people P2 ON P1.Spouse_Id = P2.Person_Id
WHERE P2.Person_Id NOT IN (
    SELECT Person_Id FROM familytree WHERE Connection_Type IN ('בן זוג', 'בת זוג')
);
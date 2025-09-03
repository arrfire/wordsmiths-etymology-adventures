-- Delete duplicate challenges for today (2025-09-03)
DELETE FROM challenges 
WHERE date_assigned = '2025-09-03';
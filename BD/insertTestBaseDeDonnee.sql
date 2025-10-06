ALTER TABLE Staff
ADD COLUMN password VARCHAR(255) NOT NULL;

-- =======================
-- Remplissage des tables
-- =======================

-- Table Client
INSERT INTO Client (clientLastName, clientFirstName, clientEmail, clientPhone, companyName, clientAddress, clientCountry, siren, vatNumber, businessActivity, rcsNumber, shareCapital, socialNetworks, legalForm, logo)
VALUES
('Dupont', 'Jean', 'jean.dupont@email.com', '0601020304', 'Dupont SARL', '10 rue de Paris', 'France', '123456789', 'FR123456789', 'Informatique', 'RCS12345', 5000.00, '@dupont', 'SARL', NULL),
('Martin', 'Sophie', 'sophie.martin@email.com', '0605060708', 'Martin SAS', '25 avenue de Lyon', 'France', '987654321', 'FR987654321', 'Conseil', 'RCS54321', 15000.00, '@martin', 'SAS', NULL),
('Durand', 'Paul', 'paul.durand@email.com', '0611223344', 'Durand & Co', '5 place Victor Hugo', 'Belgique', '654321987', 'BE654321987', 'Comptabilité', 'RCS65432', 2000.00, '@durand', 'EURL', NULL),
('Lefevre', 'Julie', 'julie.lefevre@email.com', '0622334455', 'JL Consulting', '12 boulevard St-Michel', 'France', '112233445', 'FR112233445', 'Consulting', 'RCS11223', 10000.00, '@jlconsult', 'SASU', NULL),
('Petit', 'Luc', 'luc.petit@email.com', '0677889900', 'Petit Entreprise', '50 chemin des Fleurs', 'Suisse', '998877665', 'CH998877665', 'Commerce', 'RCS99887', 8000.00, '@petit', 'SA', NULL);

-- Table Audit
INSERT INTO Audit (auditName, creationDate, status) VALUES
('Audit Sécurité', '2024-01-15', 'En cours'),
('Audit Financier', '2023-11-20', 'Terminé'),
('Audit Qualité', '2024-05-10', 'En cours'),
('Audit RH', '2023-09-01', 'Annulé'),
('Audit IT', '2024-02-28', 'Prévu');

-- Table Theme
INSERT INTO Theme (themeName, status) VALUES
('Sécurité informatique', 'Actif'),
('Conformité légale', 'Actif'),
('Gestion financière', 'Inactif'),
('Ressources humaines', 'Actif'),
('Développement durable', 'Actif');

-- Table Type
INSERT INTO Type (typeName) VALUES
('Oui/Non'),
('Échelle 1-5'),
('Texte libre'),
('Choix multiple'),
('Nombre');

-- Table role
INSERT INTO Role (roleName) VALUES
('Administrateur'),
('Auditeur'),
('Manager'),
('Analyste');

-- Table User
INSERT INTO Staff (idUser, lastName, firstName, idRole)VALUES 
('ed30a7ac-7ad3-40de-a570-c52606ec13b8', 'summer', 'flamme', 1),
('d2be6ef6-16f5-4275-8f0a-e157f07b69c7', 'test', 'test', 2);

-- Table Question
INSERT INTO Question (label, status, idTheme) VALUES
('Le système est-il protégé par un pare-feu ?', 'Actif', 1),
('Toutes les factures sont-elles archivées ?', 'Actif', 2),
('Quelle est la satisfaction des employés ?', 'Actif', 4),
('L’entreprise respecte-t-elle la norme ISO ?', 'Inactif', 2),
('Y a-t-il un plan de réduction des déchets ?', 'Actif', 5);

-- Table OptionAnswer
INSERT INTO OptionAnswer (optionLabel, optionPoints, idType) VALUES
('Oui', 10, 1),
('Non', 0, 1),
('1 - Très faible', 1, 2),
('5 - Excellent', 5, 2),
('Texte libre', 0, 3);

-- Table ClientAnswer
INSERT INTO ClientAnswer (clientAnswer, clientAnswerPoints, idQuestion) VALUES
('Oui', 10, 1),
('Non', 0, 1),
('Toutes archivées', 5, 2),
('3 - Moyen', 3, 3),
('Réduction en cours', 4, 5);

-- Table Participate
INSERT INTO Participate (idClient, idAudit, participationDate) VALUES
(1, 1, '2024-01-16'),
(2, 2, '2023-11-21'),
(3, 3, '2024-05-11'),
(4, 4, '2023-09-02'),
(5, 5, '2024-02-29');

-- Table Own
INSERT INTO Own (idAudit, idTheme) VALUES
(1, 1),
(2, 3),
(3, 4),
(4, 2),
(5, 5);

-- Table Contain
INSERT INTO Contain (idQuestion, idOptAnswer) VALUES
(1, 1),
(1, 2),
(3, 3),
(3, 4),
(5, 5);

-- Table Modify
INSERT INTO Modify (idUser, idAudit, modificationDate, modificationTime) VALUES
('ed30a7ac-7ad3-40de-a570-c52606ec13b8', 1, '2024-01-20', '10:30'),
('ed30a7ac-7ad3-40de-a570-c52606ec13b8', 2, '2023-11-25', '14:15'),
('d2be6ef6-16f5-4275-8f0a-e157f07b69c7', 3, '2024-05-12', '09:00'),
('ed30a7ac-7ad3-40de-a570-c52606ec13b8', 4, '2023-09-03', '16:45'),
('d2be6ef6-16f5-4275-8f0a-e157f07b69c7', 5, '2024-03-01', '11:20');

-- =======================
--Partie commande de test
-- =======================

----------------------------------------------------------
-- Vérifier que les clients participent bien à des audits
----------------------------------------------------------

SELECT c.clientFirstName, c.clientLastName, a.auditName, p.participationDate
FROM Client c
JOIN Participate p ON c.idClient = p.idClient
JOIN Audit a ON p.idAudit = a.idAudit;


------------------------------------------------
-- Voir quels thèmes appartiennent à quel audit
------------------------------------------------

SELECT a.auditName, t.themeName
FROM Audit a
JOIN Own o ON a.idAudit = o.idAudit
JOIN Theme t ON o.idTheme = t.idTheme;


---------------------------------------------------------
-- Vérifier quelles questions appartiennent à quel thème
---------------------------------------------------------

SELECT q.label, t.themeName
FROM Question q
JOIN Theme t ON q.idTheme = t.idTheme;


---------------------------------------------------------------
-- Vérifier les options de réponse possibles pour une question
---------------------------------------------------------------

SELECT q.label, oa.optionLabel, oa.optionPoints
FROM Question q
JOIN Contain c ON q.idQuestion = c.idQuestion
JOIN OptionAnswer oa ON c.idOptAnswer = oa.idOptAnswer
WHERE q.idQuestion = 1;



-------------------------------------------------
-- Vérifier les réponses données par les clients
-------------------------------------------------

SELECT q.label, ca.clientAnswer, ca.clientAnswerPoints
FROM ClientAnswer ca
JOIN Question q ON ca.idQuestion = q.idQuestion;



----------------------------------------------------
-- Voir quels utilisateurs ont modifié quels audits
----------------------------------------------------

SELECT u.firstName, u.lastName, a.auditName, m.modificationDate, m.modificationTime
FROM Staff u
JOIN Modify m ON u.idUser = m.idUser
JOIN Audit a ON m.idAudit = a.idAudit;



---------------------------------------------------
-- Vérifier le type de réponses possibles par type
---------------------------------------------------

SELECT t.typeName, oa.optionLabel
FROM Type t
JOIN OptionAnswer oa ON t.idType = oa.idType;

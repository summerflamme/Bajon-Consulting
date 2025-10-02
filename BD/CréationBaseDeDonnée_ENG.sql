-- Drop association / dependent tables first
DROP TABLE IF EXISTS Modify CASCADE;
DROP TABLE IF EXISTS Contain CASCADE;
DROP TABLE IF EXISTS Own CASCADE;
DROP TABLE IF EXISTS Participate CASCADE;
DROP TABLE IF EXISTS ClientAnswer CASCADE;
DROP TABLE IF EXISTS OptionAnswer CASCADE;
DROP TABLE IF EXISTS Question CASCADE;

-- Drop independent tables
DROP TABLE IF EXISTS Type CASCADE;
DROP TABLE IF EXISTS Theme CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS Audit CASCADE;
DROP TABLE IF EXISTS Client CASCADE;


-- Table Client
CREATE TABLE Client (
    idClient SERIAL PRIMARY KEY,
    clientLastName VARCHAR(100),
    clientFirstName VARCHAR(100),
    clientEmail VARCHAR(255),
    clientPhone VARCHAR(20),
    companyName VARCHAR(150),
    clientAddress VARCHAR(255),
    clientCountry VARCHAR(100),
    siren VARCHAR(20),
    vatNumber VARCHAR(20),
    businessActivity VARCHAR(100),
    rcsNumber VARCHAR(50),
    shareCapital NUMERIC(15,2),
    socialNetworks VARCHAR(255),
    legalForm VARCHAR(100),
    logo BYTEA
);

-- Table Audit
CREATE TABLE Audit (
    idAudit SERIAL PRIMARY KEY,
    auditName VARCHAR(150),
    creationDate DATE,
    status VARCHAR(50)
);

-- Table User
CREATE TABLE "User" (
    idUser SERIAL PRIMARY KEY,
    lastName VARCHAR(100),
    firstName VARCHAR(100),
    role VARCHAR(50),
    -- pour test
    password VARCHAR(255) UNIQUE NOT NULL
    login VARCHAR(255) UNIQUE NOT NULL
);

-- Table Theme
CREATE TABLE Theme (
    idTheme SERIAL PRIMARY KEY,
    themeName VARCHAR(150),
    status VARCHAR(50)
);

-- Table Type
CREATE TABLE Type (
    idType SERIAL PRIMARY KEY,
    typeName VARCHAR(100)
);

-- Table Question
CREATE TABLE Question (
    idQuestion SERIAL PRIMARY KEY,
    label VARCHAR(255),
    status VARCHAR(50),
    idTheme INT NOT NULL,
    FOREIGN KEY (idTheme) REFERENCES Theme(idTheme)
);

-- Table OptionAnswer
CREATE TABLE OptionAnswer (
    idOptAnswer SERIAL PRIMARY KEY,
    optionLabel VARCHAR(255),
    optionPoints INT,
    idType INT NOT NULL,
    FOREIGN KEY (idType) REFERENCES Type(idType)
);

-- Table ClientAnswer
CREATE TABLE ClientAnswer (
    idClientAnswer SERIAL PRIMARY KEY,
    clientAnswer TEXT,
    clientAnswerPoints INT,
    idQuestion INT NOT NULL,
    FOREIGN KEY (idQuestion) REFERENCES Question(idQuestion)
);

-- Table Participate (relation Client - Audit)
CREATE TABLE Participate (
    idClient INT NOT NULL,
    idAudit INT NOT NULL,
    participationDate DATE,
    PRIMARY KEY (idClient, idAudit),
    FOREIGN KEY (idClient) REFERENCES Client(idClient),
    FOREIGN KEY (idAudit) REFERENCES Audit(idAudit)
);

-- Table Own (relation Audit - Theme)
CREATE TABLE Own (
    idAudit INT NOT NULL,
    idTheme INT NOT NULL,
    PRIMARY KEY (idAudit, idTheme),
    FOREIGN KEY (idAudit) REFERENCES Audit(idAudit),
    FOREIGN KEY (idTheme) REFERENCES Theme(idTheme)
);

-- Table Contain (relation Question - OptionAnswer)
CREATE TABLE Contain (
    idQuestion INT NOT NULL,
    idOptAnswer INT NOT NULL,
    PRIMARY KEY (idQuestion, idOptAnswer),
    FOREIGN KEY (idQuestion) REFERENCES Question(idQuestion),
    FOREIGN KEY (idOptAnswer) REFERENCES OptionAnswer(idOptAnswer)
);

-- Table Modify (relation User - Audit)
CREATE TABLE Modify (
    idUser INT NOT NULL,
    idAudit INT NOT NULL,
    modificationDate DATE,
    modificationTime TIME,
    PRIMARY KEY (idUser, idAudit),
    FOREIGN KEY (idUser) REFERENCES "User"(idUser),
    FOREIGN KEY (idAudit) REFERENCES Audit(idAudit)
);

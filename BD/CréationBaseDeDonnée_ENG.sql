-- Drop association / dependent tables first
DROP TABLE IF EXISTS Modify CASCADE;
DROP TABLE IF EXISTS Contain CASCADE;
DROP TABLE IF EXISTS Own CASCADE;
DROP TABLE IF EXISTS Participate CASCADE;
DROP TABLE IF EXISTS ClientAnswer CASCADE;
DROP TABLE IF EXISTS OptionAnswer CASCADE;
DROP TABLE IF EXISTS Question CASCADE;

-- Drop independent tables
DROP TABLE IF EXISTS Status CASCADE;
DROP TABLE IF EXISTS Type CASCADE;
DROP TABLE IF EXISTS Theme CASCADE;
DROP TABLE IF EXISTS Staff CASCADE;
DROP TABLE IF EXISTS Role CASCADE;
DROP TABLE IF EXISTS Audit CASCADE;
DROP TABLE IF EXISTS Client CASCADE;
DROP TABLE IF EXISTS AuditType CASCADE;
DROP TABLE IF EXISTS AuditOffer CASCADE;



-- Table Client
CREATE TABLE Client (
    id SERIAL PRIMARY KEY, -- pas besoin
    clientLastName VARCHAR(100), -- implémenté
    clientFirstName VARCHAR(100), -- implémenté
    clientEmail VARCHAR(255), -- implémenté
    clientPhone VARCHAR(20), -- implémenté
    companyName VARCHAR(150), -- implémenté
    clientAddress VARCHAR(255), -- implémenté
    clientCity VARCHAR(255), -- implémenté
    clientCountry VARCHAR(100), -- implémenté
    siren VARCHAR(20), -- implémenté
    vatNumber VARCHAR(20), -- implémenté
    businessActivity VARCHAR(100), -- implémenté
    rcsNumber VARCHAR(50), -- implémenté
    shareCapital NUMERIC(15,2), -- implémenté
    socialNetworks VARCHAR(255), -- implémenté
    legalForm VARCHAR(100), -- implémenté
    logo BYTEA -- implémenté
);

-- Table AuditType
CREATE TABLE AuditType (
    id SERIAL PRIMARY KEY,
    nameAuditType VARCHAR(100) NOT NULL
);

-- Table AuditOffer
CREATE TABLE AuditOffer (
    id SERIAL PRIMARY KEY,
    nameAuditOffer VARCHAR(100) NOT NULL
);

-- Table Status
CREATE TABLE Status(
    id SERIAL PRIMARY KEY,
    auditStatus VARCHAR(50)
);

-- Table role
CREATE TABLE Role  (
    id SERIAL PRIMARY KEY,
    roleName VARCHAR(150) NOT NULL
);

-- Table Theme
CREATE TABLE Theme (
    id SERIAL PRIMARY KEY,
    themeName VARCHAR(150)
);

-- Table Type
CREATE TABLE Type (
    id SERIAL PRIMARY KEY,
    typeName VARCHAR(100)
);

-- Table Audit
CREATE TABLE Audit (
    id SERIAL PRIMARY KEY,
    idAuditType INT NOT NULL,
    idAuditOffer INT NOT NULL,
    idStatus INT NOT NULL,
    auditName VARCHAR(150) NOT NULL,
    template BOOLEAN NOT NULL DEFAULT false,
    archived BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY (idAuditType) REFERENCES AuditType(id),
    FOREIGN KEY (idAuditOffer) REFERENCES AuditOffer(id),
    FOREIGN KEY (idStatus) REFERENCES Status(id)
);

-- Table Question
CREATE TABLE Question (
    id SERIAL PRIMARY KEY,
    label VARCHAR(255),
    idTheme INT NOT NULL,
    FOREIGN KEY (idTheme) REFERENCES Theme(id)
);

-- Table OptionAnswer
CREATE TABLE OptionAnswer (
    id SERIAL PRIMARY KEY,
    optionLabel VARCHAR(255),
    optionPoints INT,
    idType INT NOT NULL,
    FOREIGN KEY (idType) REFERENCES Type(id)
);

-- Table ClientAnswer
CREATE TABLE ClientAnswer (
    id SERIAL PRIMARY KEY,
    clientAnswer TEXT,
    clientAnswerPoints INT,
    idQuestion INT NOT NULL,
    FOREIGN KEY (idQuestion) REFERENCES Question(id)
);

-- Table Participate (relation Client - Audit)
CREATE TABLE Participate (
    idClient INT NOT NULL,
    idAudit INT NOT NULL,
    participationDate DATE,
    PRIMARY KEY (idClient, idAudit),
    FOREIGN KEY (idClient) REFERENCES Client(id),
    FOREIGN KEY (idAudit) REFERENCES Audit(id)
);

-- Table Own (relation Audit - Theme)
CREATE TABLE Own (
    idAudit INT NOT NULL,
    idTheme INT NOT NULL,
    PRIMARY KEY (idAudit, idTheme),
    FOREIGN KEY (idAudit) REFERENCES Audit(id),
    FOREIGN KEY (idTheme) REFERENCES Theme(id)
);

-- Table Contain (relation Question - OptionAnswer)
CREATE TABLE Contain (
    idQuestion INT NOT NULL,
    idOptAnswer INT NOT NULL,
    PRIMARY KEY (idQuestion, idOptAnswer),
    FOREIGN KEY (idQuestion) REFERENCES Question(id),
    FOREIGN KEY (idOptAnswer) REFERENCES OptionAnswer(id)
);

-- Table Modify (relation Users - Audit)
CREATE TABLE Modify (
    idmodify SERIAL,
    id UUID auth.users(id) ON DELETE CASCADE,
    idAudit INT NOT NULL,
    modificationDate DATE,
    modificationTime TIME,
    PRIMARY KEY (UUID, idAudit, idmodify),
    FOREIGN KEY (UUID) REFERENCES users(uid),
    FOREIGN KEY (idAudit) REFERENCES Audit(id)
);
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
    role VARCHAR(50)
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

-- Table OptionResponse
CREATE TABLE OptionResponse (
    idOptResponse SERIAL PRIMARY KEY,
    optionLabel VARCHAR(255),
    optionPoints INT,
    idType INT NOT NULL,
    FOREIGN KEY (idType) REFERENCES Type(idType)
);

-- Table ClientResponse
CREATE TABLE ClientResponse (
    idClientResponse SERIAL PRIMARY KEY,
    clientResponse TEXT,
    clientResponsePoints INT,
    idQuestion INT NOT NULL,
    FOREIGN KEY (idQuestion) REFERENCES OptionResponse(idQuestion)
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

-- Table Contain (relation Question - OptionResponse)
CREATE TABLE Contain (
    idQuestion INT NOT NULL,
    idOptResponse INT NOT NULL,
    PRIMARY KEY (idQuestion, idOptResponse),
    FOREIGN KEY (idQuestion) REFERENCES Question(idQuestion),
    FOREIGN KEY (idOptResponse) REFERENCES Type(idOptResponse)
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

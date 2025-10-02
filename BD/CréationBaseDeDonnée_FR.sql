-- Table Client
CREATE TABLE Client (
    idClient SERIAL PRIMARY KEY,
    nomClient VARCHAR(100),
    prenomClient VARCHAR(100),
    adresseMailClient VARCHAR(255),
    telephoneClient VARCHAR(20),
    nomEntrepriseClient VARCHAR(150),
    adrClient VARCHAR(255),
    paysClient VARCHAR(100),
    siren VARCHAR(20),
    numTVA VARCHAR(20),
    activite VARCHAR(100),
    leRCS VARCHAR(50),
    capitalSocial NUMERIC(15,2),
    reseauxSociaux VARCHAR(255),
    formeJuridique VARCHAR(100),
    logo BYTEA
);

-- Table Audit
CREATE TABLE Audit (
    idAudit SERIAL PRIMARY KEY,
    nomAudit VARCHAR(150),
    dateCreation DATE,
    statut VARCHAR(50)
);

-- Table Utilisateur
CREATE TABLE Utilisateur (
    idUser SERIAL PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    droit VARCHAR(50)
);

-- Table Thème
CREATE TABLE Theme (
    idTheme SERIAL PRIMARY KEY,
    nomTheme VARCHAR(150),
    statut VARCHAR(50)
);

-- Table Type
CREATE TABLE Type (
    idType SERIAL PRIMARY KEY,
    nomType VARCHAR(100)
);

-- Table Question
CREATE TABLE Question (
    idQuestion SERIAL PRIMARY KEY,
    intitule VARCHAR(255),
    statut VARCHAR(50),
    idTheme INT NOT NULL,
    FOREIGN KEY (idTheme) REFERENCES Theme(idTheme)
);

-- Table OptionRéponse
CREATE TABLE OptionReponse (
    idOptReponse SERIAL PRIMARY KEY,
    intituleOptReponse VARCHAR(255),
    nbPointOptReponse INT,
    idType INT NOT NULL,
    FOREIGN KEY (idType) REFERENCES Type(idType)
);

-- Table RéponseClient
CREATE TABLE ReponseClient (
    idReponseClient SERIAL PRIMARY KEY,
    reponseClient TEXT,
    nbPointReponseClient INT,
    idQuestion INT NOT NULL,
    FOREIGN KEY (idQuestion) REFERENCES OptionReponse(idQuestion)
);

-- Table Participer (relation Client - Audit)
CREATE TABLE Participer (
    idClient INT NOT NULL,
    idAudit INT NOT NULL,
    dateParticiper DATE,
    PRIMARY KEY (idClient, idAudit),
    FOREIGN KEY (idClient) REFERENCES Client(idClient),
    FOREIGN KEY (idAudit) REFERENCES Audit(idAudit)
);

-- Table Posséder (relation Audit - Thème)
CREATE TABLE Posseder (
    idAudit INT NOT NULL,
    idTheme INT NOT NULL,
    PRIMARY KEY (idAudit, idTheme),
    FOREIGN KEY (idAudit) REFERENCES Audit(idAudit),
    FOREIGN KEY (idTheme) REFERENCES Theme(idTheme)
);

-- Table Contenir (relation Question - option Réponse)
CREATE TABLE Contenir (
    idQuestion INT NOT NULL,
    idOptReponse INT NOT NULL,
    PRIMARY KEY (idQuestion, idOptReponse),
    FOREIGN KEY (idQuestion) REFERENCES Question(idQuestion),
    FOREIGN KEY (idOptReponse) REFERENCES Type(idOptReponse)
);

-- Table Modifier (relation Utilisateur - Audit)
CREATE TABLE Modifier (
    idUser INT NOT NULL,
    idAudit INT NOT NULL,
    dateModif DATE,
    heureModif TIME,
    PRIMARY KEY (idUser, idAudit),
    FOREIGN KEY (idUser) REFERENCES Utilisateur(idUser),
    FOREIGN KEY (idAudit) REFERENCES Audit(idAudit)
);

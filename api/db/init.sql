CREATE DATABASE GeekGames;
GRANT USAGE ON *.* TO GeekGames@localhost IDENTIFIED BY 'GeekGames';
GRANT ALL PRIVILEGES ON GeekGames.* TO GeekGames@localhost ;
USE GeekGames;

CREATE TABLE Consolas(
       id INT NOT NULL AUTO_INCREMENT,
       nombre VARCHAR(30) NOT NULL,
       precio FLOAT NOT NULL,
       PRIMARY KEY (id)
);

CREATE TABLE Juegos(
       id INT NOT NULL AUTO_INCREMENT,
       nombre VARCHAR(30) NOT NULL,
       precio FLOAT NOT NULL,
       consolas_id int not null,
       PRIMARY KEY (id),
       constraint fk_consola foreign key (consolas_id)
       references Consolas(id)
       on delete restrict
);

CREATE TABLE Usuarios(
       id INT NOT NULL AUTO_INCREMENT,
       usuario VARCHAR(30) NOT NULL,
       pass VARCHAR(30) NOT NULL,
       role INT NOT NULL,
       PRIMARY KEY (id)
);

insert into Consolas (nombre, precio) values ('Play Station 4', 10000);

insert into Juegos (nombre, precio, consolas_id) values ('GTA 5', 1500, 1);

INSERT INTO Usuarios (usuario,pass,role) VALUES ('admin','admin',1);
INSERT INTO Usuarios (usuario,pass,role) VALUES ('user','password',0);

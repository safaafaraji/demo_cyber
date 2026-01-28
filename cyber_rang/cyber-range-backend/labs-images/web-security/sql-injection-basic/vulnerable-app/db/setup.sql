CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50),
  password VARCHAR(50)
);

INSERT INTO users (username, password) VALUES ('admin', 'supersecretpassword');
INSERT INTO users (username, password) VALUES ('user', 'user123');

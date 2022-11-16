USE shdb;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'shpassroot';

FLUSH PRIVILEGES;

SELECT CONCAT('DATABESE IN USE: ', DATABASE());

SET GLOBAL time_zone = 'Europe/Lisbon';

SELECT CONCAT('TIMEZONE: ', @@global.time_zone);
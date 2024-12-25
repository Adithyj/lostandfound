
use lost_found_db;
ALTER TABLE USER
ADD COLUMN PASSWORD VARCHAR(255),
DROP COLUMN ROLL_NO_EMP_ID;

CREATE TABLE USER (
    USER_ID INT PRIMARY KEY AUTO_INCREMENT,
    FIRST_NAME VARCHAR(50),
    LAST_NAME VARCHAR(50),
    PHONE_NUMBER VARCHAR(15),
    EMAIL VARCHAR(100) UNIQUE,
    GENDER CHAR(1),
    ROLL_NO_EMP_ID VARCHAR(20)
);

-- Item Table
CREATE TABLE ITEM (
    ITEM_ID INT PRIMARY KEY AUTO_INCREMENT,
    NAME VARCHAR(100),
    BRAND VARCHAR(50),
    COLOR VARCHAR(20),
    CATEGORY VARCHAR(50),
    SIZE VARCHAR(10),
    IMAGE VARCHAR(255),
    STATUS ENUM('Lost', 'Found', 'Claimed') DEFAULT 'Lost',
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lost Item Table
CREATE TABLE LOST_ITEM (
    LOST_ID INT PRIMARY KEY AUTO_INCREMENT,
    ITEM_ID INT,
    LOST_BY_USER_ID INT,
    LOST_PLACE VARCHAR(100),
    LOST_TIME DATETIME DEFAULT NOW(),
    DETAILS VARCHAR(255),
    FOREIGN KEY (ITEM_ID) REFERENCES ITEM(ITEM_ID),
    FOREIGN KEY (LOST_BY_USER_ID) REFERENCES USER(USER_ID)
);

-- Found Item Table
CREATE TABLE FOUND_ITEM (
    FOUND_ID INT PRIMARY KEY AUTO_INCREMENT,
    ITEM_ID INT,
    FOUND_BY_USER_ID INT,
    FOUND_PLACE VARCHAR(100),
    FOUND_TIME DATETIME DEFAULT NOW(),
    DETAILS VARCHAR(255),
    FOREIGN KEY (ITEM_ID) REFERENCES ITEM(ITEM_ID),
    FOREIGN KEY (FOUND_BY_USER_ID) REFERENCES USER(USER_ID)
);

-- Admin Table
CREATE TABLE ADMIN (
    ADMIN_ID INT PRIMARY KEY AUTO_INCREMENT,
    USERNAME VARCHAR(50) UNIQUE,
    PASSWORD VARCHAR(255)
);

-- Admin Control Table
CREATE TABLE CONTROL (
    ADMIN_ID INT,
    ITEM_ID INT,
    PRIMARY KEY (ADMIN_ID, ITEM_ID),
    FOREIGN KEY (ADMIN_ID) REFERENCES ADMIN(ADMIN_ID),
    FOREIGN KEY (ITEM_ID) REFERENCES ITEM(ITEM_ID)
);

-- Notification Table
CREATE TABLE NOTIFICATION (
    NOTIF_ID INT PRIMARY KEY AUTO_INCREMENT,
    ITEM_ID INT,
    LOST_USER_ID INT,
    FOUND_USER_ID INT,
    MESSAGE VARCHAR(255),
    TIME TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (ITEM_ID) REFERENCES ITEM(ITEM_ID),
    FOREIGN KEY (LOST_USER_ID) REFERENCES USER(USER_ID),
    FOREIGN KEY (FOUND_USER_ID) REFERENCES USER(USER_ID)
);


DELIMITER $$

CREATE TRIGGER after_found_item_insert
AFTER INSERT ON FOUND_ITEM
FOR EACH ROW
BEGIN
    DECLARE LOST_USER INT;

    -- Match lost items based on similar location
    SELECT LOST_BY_USER_ID INTO LOST_USER
    FROM LOST_ITEM
    WHERE 
        LOST_PLACE = NEW.FOUND_PLACE
    LIMIT 1;

    -- Only insert notification if a matching lost report exists
    IF LOST_USER IS NOT NULL THEN
        INSERT INTO NOTIFICATION (ITEM_ID, LOST_USER_ID, FOUND_USER_ID, MESSAGE)
        VALUES (
            NEW.ITEM_ID, 
            LOST_USER, 
            NEW.FOUND_BY_USER_ID,
            CONCAT('An item you lost has been reported as found at ', NEW.FOUND_PLACE, '. Details: ', NEW.DETAILS)
        );
    END IF;
END $$

-- Insert a test user
INSERT INTO USER (FIRST_NAME, LAST_NAME, PHONE_NUMBER, EMAIL, GENDER, ROLL_NO_EMP_ID)
VALUES ('John', 'Doe', '1234567890', 'john.doe@example.com', 'M', 'EMP001');

-- Insert a test admin
INSERT INTO ADMIN (USERNAME, PASSWORD)
VALUES ('admin', 'password123');


DELIMITER ;
commit;
ALTER TABLE USER
DROP COLUMN ROLL_NO_EMP_ID;




use  lost_found_db;
ALTER TABLE LOST_ITEM DROP FOREIGN KEY LOST_ITEM_ibfk_1; -- Adjust constraint name as per your DB
ALTER TABLE LOST_ITEM DROP FOREIGN KEY LOST_ITEM_ibfk_2;

ALTER TABLE FOUND_ITEM DROP FOREIGN KEY FOUND_ITEM_ibfk_1;
ALTER TABLE FOUND_ITEM DROP FOREIGN KEY FOUND_ITEM_ibfk_2;

ALTER TABLE NOTIFICATION DROP FOREIGN KEY NOTIFICATION_ibfk_1;
ALTER TABLE NOTIFICATION DROP FOREIGN KEY NOTIFICATION_ibfk_2;
ALTER TABLE NOTIFICATION DROP FOREIGN KEY NOTIFICATION_ibfk_3;

ALTER TABLE CONTROL DROP FOREIGN KEY CONTROL_ibfk_1;
ALTER TABLE CONTROL DROP FOREIGN KEY CONTROL_ibfk_2;





-- LOST_ITEM Table
ALTER TABLE LOST_ITEM 
ADD CONSTRAINT fk_lost_item FOREIGN KEY (ITEM_ID) REFERENCES ITEM(ITEM_ID) ON DELETE CASCADE,
ADD CONSTRAINT fk_lost_user FOREIGN KEY (LOST_BY_USER_ID) REFERENCES USER(USER_ID) ON DELETE CASCADE;

-- FOUND_ITEM Table
ALTER TABLE FOUND_ITEM 
ADD CONSTRAINT fk_found_item FOREIGN KEY (ITEM_ID) REFERENCES ITEM(ITEM_ID) ON DELETE CASCADE,
ADD CONSTRAINT fk_found_user FOREIGN KEY (FOUND_BY_USER_ID) REFERENCES USER(USER_ID) ON DELETE CASCADE;

-- NOTIFICATION Table
ALTER TABLE NOTIFICATION 
ADD CONSTRAINT fk_notif_item FOREIGN KEY (ITEM_ID) REFERENCES ITEM(ITEM_ID) ON DELETE CASCADE,
ADD CONSTRAINT fk_notif_lost_user FOREIGN KEY (LOST_USER_ID) REFERENCES USER(USER_ID) ON DELETE CASCADE,
ADD CONSTRAINT fk_notif_found_user FOREIGN KEY (FOUND_USER_ID) REFERENCES USER(USER_ID) ON DELETE CASCADE;

-- CONTROL Table
ALTER TABLE CONTROL 
ADD CONSTRAINT fk_control_admin FOREIGN KEY (ADMIN_ID) REFERENCES ADMIN(ADMIN_ID) ON DELETE CASCADE,
ADD CONSTRAINT fk_control_item FOREIGN KEY (ITEM_ID) REFERENCES ITEM(ITEM_ID) ON DELETE CASCADE;

ALTER TABLE FOUND_ITEM
ADD COLUMN CONTACT_DETAILS VARCHAR(255);
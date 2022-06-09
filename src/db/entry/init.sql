DROP DATABASE IF EXISTS `Notifications`;
CREATE DATABASE IF NOT EXISTS `Notifications`;

USE `Notifications`;

create table IF NOT EXISTS `NOTIFICATION` (
    `uid` VARCHAR(255),
    msg VARCHAR(255),
    `channel_uid` VARCHAR(255), 
    primary key (`uid` )
);

create table IF NOT EXISTS CHANNEL (
    `uid` VARCHAR(255),
    `name` VARCHAR(255),
    primary key (`uid` )
);

CREATE TABLE USER_CHANNEL (
    `user_uid` VARCHAR(255),
    `channel_uid` VARCHAR(255),
    PRIMARY KEY(`user_uid`, `channel_uid`)
);

CREATE TABLE NOTIFICATION_QUEUE (
    `user_uid` VARCHAR(255),
    msg VARCHAR(255),
    PRIMARY KEY(`user_uid`, msg)
);

INSERT INTO `NOTIFICATION` (`uid` , msg) 
VALUES("1", "alo")
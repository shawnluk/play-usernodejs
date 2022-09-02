/*
 Navicat Premium Data Transfer

 Source Server         : shawnlu_program_navicat16
 Source Server Type    : MySQL
 Source Server Version : 80019
 Source Host           : localhost:3306
 Source Schema         : playwithusdb_test

 Target Server Type    : MySQL
 Target Server Version : 80019
 File Encoding         : 65001

 Date: 02/09/2022 16:17:18
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for team_activity
-- ----------------------------
DROP TABLE IF EXISTS `team_activity`;
CREATE TABLE `team_activity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `userID` int NOT NULL,
  `teamName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `teamID` int DEFAULT NULL,
  `newCaptain` varchar(255) DEFAULT NULL,
  `captainID` int DEFAULT NULL,
  `acti_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `acti_utc` datetime NOT NULL,
  `acti_date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `acti_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `acti_region` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `acti_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `acti_resource` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `acti_isOnApply` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of team_activity
-- ----------------------------
BEGIN;
INSERT INTO `team_activity` (`id`, `username`, `userID`, `teamName`, `teamID`, `newCaptain`, `captainID`, `acti_name`, `acti_utc`, `acti_date`, `acti_type`, `acti_region`, `acti_desc`, `acti_resource`, `acti_isOnApply`, `createTime`, `updateTime`) VALUES (1, 'admin1', 1, '皇家马德里', 1, NULL, NULL, '皇马第10冠', '2022-08-31 23:07:58', '2022-08-31 周三 23:07:58', '联赛或杯赛', '广州市荔湾区花地街道怡芳苑', 'come on\n', '线下租约场地', '1', NULL, NULL);
INSERT INTO `team_activity` (`id`, `username`, `userID`, `teamName`, `teamID`, `newCaptain`, `captainID`, `acti_name`, `acti_utc`, `acti_date`, `acti_type`, `acti_region`, `acti_desc`, `acti_resource`, `acti_isOnApply`, `createTime`, `updateTime`) VALUES (2, 'admin2', 2, '中华人民共和国', 2, NULL, NULL, '皇马第11冠', '2022-09-01 23:27:47', '2022-09-01 周四 23:27:47', '友谊赛', '广州市天河区', '来吧', '线上电竞比赛', '1', NULL, NULL);
INSERT INTO `team_activity` (`id`, `username`, `userID`, `teamName`, `teamID`, `newCaptain`, `captainID`, `acti_name`, `acti_utc`, `acti_date`, `acti_type`, `acti_region`, `acti_desc`, `acti_resource`, `acti_isOnApply`, `createTime`, `updateTime`) VALUES (3, 'admin6', 6, '广州恒大淘宝', 3, NULL, NULL, '广州2013年亚冠', '2022-09-30 21:35:45', '2022-09-30 周五 21:35:45', '自定义比赛', '广州市天河区', '天河体育场', '线下租约场地', '1', NULL, NULL);
INSERT INTO `team_activity` (`id`, `username`, `userID`, `teamName`, `teamID`, `newCaptain`, `captainID`, `acti_name`, `acti_utc`, `acti_date`, `acti_type`, `acti_region`, `acti_desc`, `acti_resource`, `acti_isOnApply`, `createTime`, `updateTime`) VALUES (4, 'admin9', 9, 'team9', 13, 'admin10', 10, 'acti9', '2022-09-30 15:47:20', '2022-09-30 周五 15:47:20', '自定义比赛', 'region9', '999', '线下租约场地', '0', NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for team_test
-- ----------------------------
DROP TABLE IF EXISTS `team_test`;
CREATE TABLE `team_test` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `teamName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '创建者',
  `userID` int DEFAULT NULL,
  `newCaptain` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '新队长',
  `CaptainID` int DEFAULT NULL,
  `teamSlogan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '球队口号',
  `teamPic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '球队头像保存路径',
  `teamDesc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '球队描述',
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  `isDelete` int DEFAULT NULL,
  `fkID` int DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `fkID` (`fkID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of team_test
-- ----------------------------
BEGIN;
INSERT INTO `team_test` (`id`, `teamName`, `username`, `userID`, `newCaptain`, `CaptainID`, `teamSlogan`, `teamPic`, `teamDesc`, `createTime`, `updateTime`, `isDelete`, `fkID`) VALUES (1, '皇家马德里', 'admin1', 1, 'admin1', 1, '欧冠之王', 'xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/10551/teamPic/1.png', '伯纳乌球场', NULL, NULL, 0, 1);
INSERT INTO `team_test` (`id`, `teamName`, `username`, `userID`, `newCaptain`, `CaptainID`, `teamSlogan`, `teamPic`, `teamDesc`, `createTime`, `updateTime`, `isDelete`, `fkID`) VALUES (2, '中华人民共和国', 'admin2', 2, 'admin2', 2, '中国队', 'uploads\\img\\c151593867d135c75c7e18e9e5038303.jpg', '中国队', NULL, NULL, 0, 2);
INSERT INTO `team_test` (`id`, `teamName`, `username`, `userID`, `newCaptain`, `CaptainID`, `teamSlogan`, `teamPic`, `teamDesc`, `createTime`, `updateTime`, `isDelete`, `fkID`) VALUES (3, '广州恒大淘宝', 'admin6', 6, 'admin6', 6, '冠军总归广州', '', '广州队', NULL, NULL, 0, 3);
INSERT INTO `team_test` (`id`, `teamName`, `username`, `userID`, `newCaptain`, `CaptainID`, `teamSlogan`, `teamPic`, `teamDesc`, `createTime`, `updateTime`, `isDelete`, `fkID`) VALUES (11, '巴塞罗那', 'admin7', 7, 'admin7', 7, '红蓝军团', 'xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/10551/teamPic/11.jpg', '诺坎普', NULL, NULL, 0, 11);
INSERT INTO `team_test` (`id`, `teamName`, `username`, `userID`, `newCaptain`, `CaptainID`, `teamSlogan`, `teamPic`, `teamDesc`, `createTime`, `updateTime`, `isDelete`, `fkID`) VALUES (12, '皇马', 'admin8', 8, 'admin3', 3, '皇家马德里', 'xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/10551/teamPic/12.png', '伯纳乌', NULL, NULL, 0, 12);
INSERT INTO `team_test` (`id`, `teamName`, `username`, `userID`, `newCaptain`, `CaptainID`, `teamSlogan`, `teamPic`, `teamDesc`, `createTime`, `updateTime`, `isDelete`, `fkID`) VALUES (13, 'team9', 'admin9', 9, 'admin10', 10, '99999', '', '', NULL, NULL, 0, 13);
COMMIT;

-- ----------------------------
-- Table structure for userjointeam
-- ----------------------------
DROP TABLE IF EXISTS `userjointeam`;
CREATE TABLE `userjointeam` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userID` int NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `teamID` int NOT NULL,
  `teamName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `joinStatusYes` int DEFAULT NULL,
  `joinStatusNo` int DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of userjointeam
-- ----------------------------
BEGIN;
INSERT INTO `userjointeam` (`id`, `userID`, `username`, `teamID`, `teamName`, `joinStatusYes`, `joinStatusNo`) VALUES (1, 4, 'admin4', 1, '皇家马德里', 0, NULL);
INSERT INTO `userjointeam` (`id`, `userID`, `username`, `teamID`, `teamName`, `joinStatusYes`, `joinStatusNo`) VALUES (2, 4, 'admin4', 1, '皇家马德里', 1, NULL);
COMMIT;

-- ----------------------------
-- Table structure for users_test
-- ----------------------------
DROP TABLE IF EXISTS `users_test`;
CREATE TABLE `users_test` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `userPic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `teamID` int DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  `lastLoginTime` datetime DEFAULT NULL,
  `isDelete` int DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `id` (`id`) USING BTREE,
  KEY `teamID_fk` (`teamID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='用户信息表 测试Beta';

-- ----------------------------
-- Records of users_test
-- ----------------------------
BEGIN;
INSERT INTO `users_test` (`id`, `username`, `password`, `nickname`, `email`, `userPic`, `teamID`, `createTime`, `updateTime`, `lastLoginTime`, `isDelete`) VALUES (1, 'admin1', '$2a$10$mMTQhQhARhbGb7XMnWCEcurwIal1YsyDjgrENEhuv3Ly3ySBIMZoi', 'nick1', '1@qq.com', 'xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/10551/userPic/admin1.png', 1, NULL, NULL, NULL, 0);
INSERT INTO `users_test` (`id`, `username`, `password`, `nickname`, `email`, `userPic`, `teamID`, `createTime`, `updateTime`, `lastLoginTime`, `isDelete`) VALUES (2, 'admin2', '$2a$10$BviQ4gqdO4NCrWo4rO8uyOnevFtfjB5HI0a6Zl68HkJLFQ3Sa9Fma', NULL, NULL, NULL, 2, NULL, NULL, NULL, 0);
INSERT INTO `users_test` (`id`, `username`, `password`, `nickname`, `email`, `userPic`, `teamID`, `createTime`, `updateTime`, `lastLoginTime`, `isDelete`) VALUES (3, 'admin3', '$2a$10$q/If7xPqUV75DXdhxfDXKO8JQALGL0RJfcShZJjkDvCRH0sutGw06', NULL, NULL, NULL, 1, NULL, NULL, NULL, 0);
INSERT INTO `users_test` (`id`, `username`, `password`, `nickname`, `email`, `userPic`, `teamID`, `createTime`, `updateTime`, `lastLoginTime`, `isDelete`) VALUES (4, 'admin4', '$2a$10$oOY2x3OVMHhCo2QDSyM5ruGS3EgZSUjyuX6HWcNJciRhmD9yNniNW', 'nick4', '4@gmail.com', 'xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/10551/userPic/admin4.png', NULL, NULL, NULL, NULL, 0);
INSERT INTO `users_test` (`id`, `username`, `password`, `nickname`, `email`, `userPic`, `teamID`, `createTime`, `updateTime`, `lastLoginTime`, `isDelete`) VALUES (5, 'admin5', '$2a$10$us3aR2B/vW0tTpvep7RBV.JFElHQTmuEeUYOQI./Df9d0CMHgKQOC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0);
INSERT INTO `users_test` (`id`, `username`, `password`, `nickname`, `email`, `userPic`, `teamID`, `createTime`, `updateTime`, `lastLoginTime`, `isDelete`) VALUES (6, 'admin6', '$2a$10$z7RbT.KpheitYV13UZl3s.C321tB/IoPRJzlviaFK09G572WE4XgC', NULL, NULL, 'xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/10551/userPic/admin6.jpg', 3, NULL, NULL, NULL, 0);
INSERT INTO `users_test` (`id`, `username`, `password`, `nickname`, `email`, `userPic`, `teamID`, `createTime`, `updateTime`, `lastLoginTime`, `isDelete`) VALUES (7, 'admin7', '$2a$10$O.5EX37vp2sebk0EspHt5.MbfosdzJKxi3q.eJT3LqPmYQimW0Bfy', NULL, NULL, NULL, 11, NULL, NULL, NULL, 0);
INSERT INTO `users_test` (`id`, `username`, `password`, `nickname`, `email`, `userPic`, `teamID`, `createTime`, `updateTime`, `lastLoginTime`, `isDelete`) VALUES (8, 'admin8', '$2a$10$aNnsIenDBrMcMXoNxWOfIutVDMSDrRytrMawkf1vduHQSGjNj7inS', NULL, NULL, 'xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/10551/userPic/admin8.png', 12, NULL, NULL, NULL, 0);
INSERT INTO `users_test` (`id`, `username`, `password`, `nickname`, `email`, `userPic`, `teamID`, `createTime`, `updateTime`, `lastLoginTime`, `isDelete`) VALUES (9, 'admin9', '$2a$10$/r2mYYFP/LKpcYDaHdpVEehUHsnzHCna27Bd46QQb3vCdqiH5QNfK', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0);
INSERT INTO `users_test` (`id`, `username`, `password`, `nickname`, `email`, `userPic`, `teamID`, `createTime`, `updateTime`, `lastLoginTime`, `isDelete`) VALUES (10, 'admin10', '$2a$10$2IMznVJg3zXevhiXA8fGSe10imDx8.sAa/jNRTb4fomBDawo4DWXm', NULL, NULL, NULL, 13, NULL, NULL, NULL, 0);
INSERT INTO `users_test` (`id`, `username`, `password`, `nickname`, `email`, `userPic`, `teamID`, `createTime`, `updateTime`, `lastLoginTime`, `isDelete`) VALUES (11, 'admin11', '$2a$10$D97ktlvfuiSp9Bsb5TKA7e97rn4PopqpVfvo/Xjw04OFR6YD7k2oq', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;

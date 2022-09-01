/*
 Navicat Premium Data Transfer

 Source Server         : shawn_MysqlDB_test
 Source Server Type    : MySQL
 Source Server Version : 80019
 Source Host           : localhost:3306
 Source Schema         : playwithusdb_test

 Target Server Type    : MySQL
 Target Server Version : 80019
 File Encoding         : 65001

 Date: 01/09/2022 22:25:58
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for team_activity
-- ----------------------------
DROP TABLE IF EXISTS `team_activity`;
CREATE TABLE `team_activity`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `userID` int(0) NOT NULL,
  `teamName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `teamID` int(0) NULL DEFAULT NULL,
  `acti_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `acti_utc` datetime(0) NOT NULL,
  `acti_date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `acti_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `acti_region` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `acti_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `acti_resource` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `acti_isOnApply` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `createTime` datetime(0) NULL DEFAULT NULL,
  `updateTime` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of team_activity
-- ----------------------------
INSERT INTO `team_activity` VALUES (1, 'admin1', 1, '皇家马德里', 1, '皇马第10冠', '2022-08-31 23:07:58', '2022-08-31 周三 23:07:58', '联赛或杯赛', '广州市荔湾区花地街道怡芳苑', 'come on\n', '线下租约场地', '1', NULL, NULL);
INSERT INTO `team_activity` VALUES (2, 'admin2', 2, '中华人民共和国', 2, '皇马第11冠', '2022-09-01 23:27:47', '2022-09-01 周四 23:27:47', '友谊赛', '广州市天河区', '来吧', '线上电竞比赛', '1', NULL, NULL);
INSERT INTO `team_activity` VALUES (3, 'admin6', 6, '广州恒大淘宝', 3, '广州2013年亚冠', '2022-09-30 21:35:45', '2022-09-30 周五 21:35:45', '自定义比赛', '广州市天河区', '天河体育场', '线下租约场地', '1', NULL, NULL);

-- ----------------------------
-- Table structure for team_test
-- ----------------------------
DROP TABLE IF EXISTS `team_test`;
CREATE TABLE `team_test`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `teamName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建者',
  `userID` int(0) NULL DEFAULT NULL,
  `newCaptain` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '新队长',
  `CaptainID` int(0) NULL DEFAULT NULL,
  `teamSlogan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '球队口号',
  `teamPic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '球队头像保存路径',
  `teamDesc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '球队描述',
  `createTime` datetime(0) NULL DEFAULT NULL,
  `updateTime` datetime(0) NULL DEFAULT NULL,
  `isDelete` int(0) NULL DEFAULT NULL,
  `fkID` int(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fkID`(`fkID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of team_test
-- ----------------------------
INSERT INTO `team_test` VALUES (1, '皇家马德里', 'admin1', 1, 'admin1', 1, '欧冠之王', 'xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/10551/teamPic/1.png', '伯纳乌球场', NULL, NULL, 0, 1);
INSERT INTO `team_test` VALUES (2, '中华人民共和国', 'admin2', 2, 'admin2', 2, '中国队', 'uploads\\img\\c151593867d135c75c7e18e9e5038303.jpg', '中国队', NULL, NULL, 0, 2);
INSERT INTO `team_test` VALUES (3, '广州恒大淘宝', 'admin6', 6, 'admin6', 6, '冠军总归广州', '', '广州队', NULL, NULL, 0, 3);
INSERT INTO `team_test` VALUES (11, '巴塞罗那', 'admin7', 7, 'admin7', 7, '红蓝军团', 'xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/10551/teamPic/11.jpg', '诺坎普', NULL, NULL, 0, 11);
INSERT INTO `team_test` VALUES (12, '皇马', 'admin8', 8, 'admin3', 3, '皇家马德里', 'xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/10551/teamPic/12.png', '伯纳乌', NULL, NULL, 0, 12);

-- ----------------------------
-- Table structure for userjointeam
-- ----------------------------
DROP TABLE IF EXISTS `userjointeam`;
CREATE TABLE `userjointeam`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `userID` int(0) NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `teamID` int(0) NOT NULL,
  `teamName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `joinStatusYes` int(0) NULL DEFAULT NULL,
  `joinStatusNo` int(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of userjointeam
-- ----------------------------
INSERT INTO `userjointeam` VALUES (1, 4, 'admin4', 1, '皇家马德里', 0, NULL);
INSERT INTO `userjointeam` VALUES (2, 4, 'admin4', 1, '皇家马德里', 1, NULL);

-- ----------------------------
-- Table structure for users_test
-- ----------------------------
DROP TABLE IF EXISTS `users_test`;
CREATE TABLE `users_test`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `userPic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `teamID` int(0) NULL DEFAULT NULL,
  `createTime` datetime(0) NULL DEFAULT NULL,
  `updateTime` datetime(0) NULL DEFAULT NULL,
  `lastLoginTime` datetime(0) NULL DEFAULT NULL,
  `isDelete` int(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id`(`id`) USING BTREE,
  INDEX `teamID_fk`(`teamID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户信息表 测试Beta' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users_test
-- ----------------------------
INSERT INTO `users_test` VALUES (1, 'admin1', '$2a$10$mMTQhQhARhbGb7XMnWCEcurwIal1YsyDjgrENEhuv3Ly3ySBIMZoi', 'nick1', '1@qq.com', 'xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/10551/userPic/admin1.png', 1, NULL, NULL, NULL, 0);
INSERT INTO `users_test` VALUES (2, 'admin2', '$2a$10$BviQ4gqdO4NCrWo4rO8uyOnevFtfjB5HI0a6Zl68HkJLFQ3Sa9Fma', NULL, NULL, NULL, 2, NULL, NULL, NULL, 0);
INSERT INTO `users_test` VALUES (3, 'admin3', '$2a$10$q/If7xPqUV75DXdhxfDXKO8JQALGL0RJfcShZJjkDvCRH0sutGw06', NULL, NULL, NULL, 1, NULL, NULL, NULL, 0);
INSERT INTO `users_test` VALUES (4, 'admin4', '$2a$10$oOY2x3OVMHhCo2QDSyM5ruGS3EgZSUjyuX6HWcNJciRhmD9yNniNW', 'nick4', '4@gmail.com', 'xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/10551/userPic/admin4.png', NULL, NULL, NULL, NULL, 0);
INSERT INTO `users_test` VALUES (5, 'admin5', '$2a$10$us3aR2B/vW0tTpvep7RBV.JFElHQTmuEeUYOQI./Df9d0CMHgKQOC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0);
INSERT INTO `users_test` VALUES (6, 'admin6', '$2a$10$z7RbT.KpheitYV13UZl3s.C321tB/IoPRJzlviaFK09G572WE4XgC', NULL, NULL, 'xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/10551/userPic/admin6.jpg', 3, NULL, NULL, NULL, 0);
INSERT INTO `users_test` VALUES (7, 'admin7', '$2a$10$O.5EX37vp2sebk0EspHt5.MbfosdzJKxi3q.eJT3LqPmYQimW0Bfy', NULL, NULL, NULL, 11, NULL, NULL, NULL, 0);
INSERT INTO `users_test` VALUES (8, 'admin8', '$2a$10$aNnsIenDBrMcMXoNxWOfIutVDMSDrRytrMawkf1vduHQSGjNj7inS', NULL, NULL, 'xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/10551/userPic/admin8.png', 12, NULL, NULL, NULL, 0);
INSERT INTO `users_test` VALUES (9, 'admin9', '$2a$10$/r2mYYFP/LKpcYDaHdpVEehUHsnzHCna27Bd46QQb3vCdqiH5QNfK', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0);
INSERT INTO `users_test` VALUES (10, 'admin10', '$2a$10$2IMznVJg3zXevhiXA8fGSe10imDx8.sAa/jNRTb4fomBDawo4DWXm', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0);
INSERT INTO `users_test` VALUES (11, 'admin11', '$2a$10$D97ktlvfuiSp9Bsb5TKA7e97rn4PopqpVfvo/Xjw04OFR6YD7k2oq', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0);

SET FOREIGN_KEY_CHECKS = 1;

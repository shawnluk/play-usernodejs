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

 Date: 09/09/2022 06:06:28
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for team_activity
-- ----------------------------
DROP TABLE IF EXISTS `team_activity`;
CREATE TABLE `team_activity`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建者',
  `userID` int(0) NOT NULL,
  `teamName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '活动所属的球队',
  `teamID` int(0) NOT NULL,
  `newCaptain` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '活动新管理者',
  `captainID` int(0) NOT NULL,
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
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of team_activity
-- ----------------------------
INSERT INTO `team_activity` VALUES (1, 'admin1', 1, '皇家马德里', 1, 'admin1', 1, '皇马第10冠', '2022-09-30 14:00:17', '2022-09-30 周五 14:00:17', '联赛或杯赛', '广州市天河区', 'come on', '线下租约场地', '1', '2022-09-05 14:00:24', NULL);
INSERT INTO `team_activity` VALUES (2, 'admin8', 8, '中华人民共和国', 3, 'admin8', 8, '中国世界杯', '2022-09-30 14:06:20', '2022-09-30 周五 14:06:20', '自定义比赛', '中国北京', '来', '线上电竞比赛', '1', '2022-09-05 14:06:25', NULL);

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
  `deleteTime` datetime(0) NULL DEFAULT NULL,
  `isDelete` int(0) NULL DEFAULT NULL,
  `fkID` int(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fkID`(`fkID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of team_test
-- ----------------------------
INSERT INTO `team_test` VALUES (1, '皇家马德里', 'admin1', 1, 'admin1', 1, '我执纯白', 'xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/10551/teamPic/1.png', '伯纳乌球场', '2022-09-05 13:57:21', NULL, NULL, 0, 1);
INSERT INTO `team_test` VALUES (2, '巴塞罗那', 'admin4', 4, 'admin4', 4, '红蓝军团', 'xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/10551/teamPic/2.png', '诺坎普', '2022-09-05 14:03:45', NULL, NULL, 0, 2);
INSERT INTO `team_test` VALUES (3, '中华人民共和国', 'admin8', 8, 'admin8', 8, '中国队', 'xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/10551/teamPic/3.png', '中国队加油', '2022-09-05 14:05:28', NULL, NULL, 0, 3);

-- ----------------------------
-- Table structure for time_test
-- ----------------------------
DROP TABLE IF EXISTS `time_test`;
CREATE TABLE `time_test`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `createTime` datetime(0) NULL DEFAULT NULL,
  `updateTime` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of time_test
-- ----------------------------
INSERT INTO `time_test` VALUES (1, '2022-09-04 00:00:00', NULL);
INSERT INTO `time_test` VALUES (2, '2022-09-04 00:00:00', NULL);
INSERT INTO `time_test` VALUES (3, '2022-09-04 12:07:33', NULL);
INSERT INTO `time_test` VALUES (4, '2022-09-04 12:07:46', NULL);
INSERT INTO `time_test` VALUES (5, '2022-09-04 12:07:47', NULL);
INSERT INTO `time_test` VALUES (6, '2022-09-04 12:08:07', NULL);
INSERT INTO `time_test` VALUES (7, '2022-09-04 12:08:10', NULL);
INSERT INTO `time_test` VALUES (8, '2022-09-04 12:08:11', NULL);
INSERT INTO `time_test` VALUES (9, '2022-09-04 12:08:30', NULL);
INSERT INTO `time_test` VALUES (10, '2022-09-04 12:08:32', NULL);
INSERT INTO `time_test` VALUES (11, '2022-09-04 12:09:04', NULL);
INSERT INTO `time_test` VALUES (12, '2022-09-04 12:11:02', NULL);
INSERT INTO `time_test` VALUES (13, '2022-09-04 12:12:12', NULL);
INSERT INTO `time_test` VALUES (14, '2022-09-04 12:13:38', NULL);
INSERT INTO `time_test` VALUES (15, '2022-09-04 12:13:38', NULL);
INSERT INTO `time_test` VALUES (16, '2022-09-04 14:55:12', NULL);
INSERT INTO `time_test` VALUES (17, '2022-09-04 14:56:02', NULL);
INSERT INTO `time_test` VALUES (18, '2022-09-04 14:56:04', NULL);
INSERT INTO `time_test` VALUES (19, '2022-09-04 14:56:19', NULL);
INSERT INTO `time_test` VALUES (20, '2022-09-04 14:56:58', NULL);
INSERT INTO `time_test` VALUES (21, '2022-09-04 14:57:00', NULL);
INSERT INTO `time_test` VALUES (22, '2022-09-04 14:57:09', NULL);
INSERT INTO `time_test` VALUES (23, '2022-09-04 14:57:55', NULL);
INSERT INTO `time_test` VALUES (24, '2022-09-04 14:58:22', NULL);
INSERT INTO `time_test` VALUES (25, '2022-09-04 14:58:24', NULL);
INSERT INTO `time_test` VALUES (26, '2022-09-04 14:58:57', NULL);
INSERT INTO `time_test` VALUES (27, '2022-09-04 14:58:59', NULL);
INSERT INTO `time_test` VALUES (28, '2022-09-04 14:59:41', NULL);
INSERT INTO `time_test` VALUES (29, '1970-01-01 08:00:00', NULL);
INSERT INTO `time_test` VALUES (30, '2022-09-04 00:00:00', NULL);
INSERT INTO `time_test` VALUES (31, '2022-09-04 00:00:00', NULL);

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
  `createTime` datetime(0) NULL DEFAULT NULL,
  `updateTime` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of userjointeam
-- ----------------------------
INSERT INTO `userjointeam` VALUES (1, 3, 'admin3', 1, '皇家马德里', 1, '2022-09-05 14:03:08', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户信息表 测试Beta' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users_test
-- ----------------------------
INSERT INTO `users_test` VALUES (1, 'admin1', '$2a$10$dIBzk6KZ8uehtGHZS18FOeSV6o3h.BtkI13IykOo2EXNw2G7kCa5S', 'nick1', '1@qq.com', 'xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/10551/userPic/admin1.png', 1, '2022-09-05 13:55:26', '2022-09-05 13:56:55', '2022-09-05 13:55:26', 0);
INSERT INTO `users_test` VALUES (2, 'admin2', '$2a$10$e6vY4BJe42hmJCzG4gnttOCbK3K6M.BcB93sfT7IZfo7pPH0A5.qu', NULL, NULL, NULL, 1, '2022-09-05 14:01:07', NULL, '2022-09-05 14:01:08', 0);
INSERT INTO `users_test` VALUES (3, 'admin3', '$2a$10$sN.j9yKtB9t10J7BzGU6HeohO079EWoq0riLwnA7MXbZfR/9DDbfW', NULL, NULL, NULL, NULL, '2022-09-05 14:02:59', NULL, '2022-09-05 14:02:59', 0);
INSERT INTO `users_test` VALUES (4, 'admin4', '$2a$10$YvUO260ibiC7aQobWazSc..Lvepy9jqlIoDKY996xxTISfYmdhvz6', NULL, NULL, NULL, 2, '2022-09-05 14:03:24', NULL, '2022-09-05 14:03:24', 0);
INSERT INTO `users_test` VALUES (5, 'admin5', '$2a$10$oeYU60Z3ydgmRyNlU35Pb.lJuwWs880uRo6p1XAeabMkK8SdB1yQ2', NULL, NULL, NULL, 1, '2022-09-05 14:04:17', NULL, '2022-09-05 14:04:17', 0);
INSERT INTO `users_test` VALUES (6, 'admin6', '$2a$10$QlZl3KZBty3sTr4oOYZJ4OIVoK3jhhP20ZgUjXR6LJq4fCxhOcNWq', NULL, NULL, NULL, NULL, '2022-09-05 14:04:34', NULL, '2022-09-05 14:04:34', 0);
INSERT INTO `users_test` VALUES (7, 'admin7', '$2a$10$Cl1tOJ8pbE.6/BC/kiE0puFdcXeYEC6uR6eYV6h6Q7Cs81/GUmZNS', NULL, NULL, NULL, NULL, '2022-09-05 14:04:48', NULL, '2022-09-05 14:04:48', 0);
INSERT INTO `users_test` VALUES (8, 'admin8', '$2a$10$bWen0CJ4ku8yh.AjtibXg.VXPwyuYT/psQcKjJg25K473q119eEqq', NULL, NULL, 'xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/10551/userPic/admin8.png', 3, '2022-09-05 14:05:07', NULL, '2022-09-08 21:26:54', 0);

SET FOREIGN_KEY_CHECKS = 1;

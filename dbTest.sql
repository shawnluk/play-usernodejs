/*
 Navicat Premium Data Transfer

 Source Server         : shawn_nodejs_test
 Source Server Type    : MongoDB
 Source Server Version : 60001
 Source Host           : localhost:27017
 Source Schema         : dbTest

 Target Server Type    : MongoDB
 Target Server Version : 60001
 File Encoding         : 65001

 Date: 08/10/2022 23:11:02
*/


// ----------------------------
// Collection structure for users
// ----------------------------
db.getCollection("users").drop();
db.createCollection("users");

// ----------------------------
// Documents of users
// ----------------------------
db.getCollection("users").insert([ {
    _id: ObjectId("633cee52912229105baeaa13"),
    username: "admin1",
    userID: "1",
    socketID: "Hhs8Q0iOqrQDwI27AAAN",
    chatContent: [
        {
            message: "已同意admin3申请加入您的球队",
            fromUser: "admin3",
            fromUserID: "3",
            time: "2022/10/5 12:11:15",
            isRead: NumberInt("1"),
            isVoid: NumberInt("0"),
            _id: ObjectId("633d03e318d39a48143c4449")
        },
        {
            message: "已同意admin8申请加入您的球队",
            fromUser: "admin8",
            fromUserID: "8",
            time: "2022/10/5 12:54:02",
            isRead: NumberInt("1"),
            isVoid: NumberInt("0"),
            _id: ObjectId("633d0dea1d8f8aef269c5602")
        },
        {
            message: "已同意admin8申请加入您的球队",
            fromUser: "admin8",
            fromUserID: "8",
            time: "2022/10/5 12:55:42",
            isRead: NumberInt("1"),
            isVoid: NumberInt("0"),
            _id: ObjectId("633d0e4ea1c1409e91c519f8")
        }
    ],
    isOnline: NumberInt("0"),
    createdAt: ISODate("2022-10-05T02:39:14.377Z"),
    updatedAt: ISODate("2022-10-08T04:05:01.325Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("633ceef9912229105baeaa18"),
    username: "admin8",
    userID: "8",
    socketID: "DC1ezi9Ey79sGFiNAAAF",
    chatContent: [ ],
    isOnline: NumberInt("1"),
    createdAt: ISODate("2022-10-05T02:42:01.696Z"),
    updatedAt: ISODate("2022-10-05T05:46:52.164Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("633cef59912229105baeaa28"),
    username: "admin3",
    userID: "3",
    socketID: "xZ6J0OYk4sDFGNJBAAAJ",
    chatContent: [ ],
    isOnline: NumberInt("0"),
    createdAt: ISODate("2022-10-05T02:43:37.34Z"),
    updatedAt: ISODate("2022-10-05T05:48:46.852Z"),
    __v: NumberInt("0")
} ]);

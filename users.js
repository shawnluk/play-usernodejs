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

 Date: 26/09/2022 22:36:16
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
    _id: ObjectId("6331626f944a4e7899318c6c"),
    username: "admin1",
    socketID: "tUs64-lHo16t4L_wAAAD",
    createdAt: ISODate("2022-09-26T08:27:27.969Z"),
    updatedAt: ISODate("2022-09-26T08:37:19.604Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("633164de7a718ddac1a647ae"),
    username: "admin8",
    socketID: "bT8Mn-fOzFKQ8ZhDAAAF",
    createdAt: ISODate("2022-09-26T08:37:50.516Z"),
    updatedAt: ISODate("2022-09-26T08:37:50.516Z"),
    __v: NumberInt("0")
} ]);

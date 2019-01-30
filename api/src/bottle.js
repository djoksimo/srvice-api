const Bottle = require("bottlejs");

const UserService = require("./services/user");
const CategoryService = require("./services/category");
const ServiceService = require("./services/service");
const RatingService = require("./services/rating");
const ChatService = require("./services/chat");
const UserManager = require("./managers/user");
const AuthManager = require("./managers/auth");
const CategoryManager = require("./managers/category");
const ServiceManager = require("./managers/service");
const RatingManager = require("./managers/rating");
const AdminManager = require("./managers/admin");
const SendManager = require("./managers/send");
const ChatManager = require("./managers/chat");

const bottle = new Bottle();

bottle.service("UserService", UserService);
bottle.service("CategoryService", CategoryService);
bottle.service("ServiceService", ServiceService);
bottle.service("RatingService", RatingService);
bottle.service("ChatService", ChatService);
bottle.service("UserManager", UserManager, "UserService", "RatingService");
bottle.service("AuthManager", AuthManager, "UserManager", "UserService");
bottle.service("CategoryManager", CategoryManager,  "CategoryService", "ServiceService");
bottle.service("ServiceManager", ServiceManager, "AuthManager", "ServiceService");
bottle.service("RatingManager", RatingManager, "AuthManager", "RatingService");
bottle.service("AdminManager", AdminManager, "AuthManager", "CategoryService");
bottle.service("SendManager", SendManager, "AuthManager");
bottle.service("ChatManager", ChatManager, "AuthManager", "ChatService");


module.exports = bottle.container;

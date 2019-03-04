const Bottle = require("bottlejs");

const {
  UserService,
  CategoryService,
  ServiceService,
  RatingService,
  ChatService,
} = require("./services");
const {
  UserManager,
  AuthenticationManager,
  CategoryManager,
  ServiceManager,
  RatingManager,
  AdminManager,
  SendManager,
  ChatManager,
} = require("./managers");

const bottle = new Bottle();

bottle.service("UserService", UserService);
bottle.service("CategoryService", CategoryService);
bottle.service("ServiceService", ServiceService);
bottle.service("RatingService", RatingService);
bottle.service("ChatService", ChatService);
bottle.service("UserManager", UserManager, "UserService", "RatingService");
bottle.service("AuthenticationManager", AuthenticationManager, "UserManager", "UserService");
bottle.service("CategoryManager", CategoryManager,  "CategoryService", "ServiceService");
bottle.service("ServiceManager", ServiceManager, "AuthenticationManager", "ServiceService");
bottle.service("RatingManager", RatingManager, "AuthenticationManager", "RatingService");
bottle.service("AdminManager", AdminManager, "AuthenticationManager", "CategoryService");
bottle.service("SendManager", SendManager, "AuthenticationManager");
bottle.service("ChatManager", ChatManager, "AuthenticationManager", "ChatService");


module.exports = bottle.container;

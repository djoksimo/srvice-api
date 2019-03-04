const Bottle = require("bottlejs");

const {
  CognitoService,
  AgentService,
  AgentPrivateService,
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
  SendManager,
  ChatManager,
} = require("./managers");

const bottle = new Bottle();

bottle.service("CognitoService", CognitoService);
bottle.service("AgentService", AgentService);
bottle.service("AgentPrivateService", AgentPrivateService);
bottle.service("UserService", UserService);
bottle.service("CategoryService", CategoryService);
bottle.service("ServiceService", ServiceService);
bottle.service("RatingService", RatingService);
bottle.service("ChatService", ChatService);
bottle.service("UserManager", UserManager, "UserService", "RatingService");
bottle.service("AuthenticationManager", AuthenticationManager, "UserManager", "CognitoService", "AgentService", "AgentPrivateService", "UserService");
bottle.service("CategoryManager", CategoryManager,  "CategoryService", "ServiceService");
bottle.service("ServiceManager", ServiceManager, "AuthenticationManager", "ServiceService", "CategoryService");
bottle.service("RatingManager", RatingManager, "AuthenticationManager", "RatingService");
bottle.service("SendManager", SendManager, "AuthenticationManager");
bottle.service("ChatManager", ChatManager, "AuthenticationManager", "ChatService");


module.exports = bottle.container;

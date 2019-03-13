const Bottle = require("bottlejs");

const {
  CognitoService,
  AgentService,
  AgentPrivateService,
  UserService,
  UserPrivateService,
  GoogleMapsService,
  CategoryService,
  ServiceService,
  RatingService,
  ChatService,
} = require("./services");
const {
  AuthenticationManager,
  AgentManager,
  UserManager,
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
bottle.service("UserPrivateService", UserPrivateService);
bottle.service("GoogleMapsService", GoogleMapsService);
bottle.service("CategoryService", CategoryService);
bottle.service("ServiceService", ServiceService);
bottle.service("RatingService", RatingService);
bottle.service("ChatService", ChatService);
bottle.service("AuthenticationManager", AuthenticationManager, "UserManager", "CognitoService", "AgentService", "AgentPrivateService", "UserService", "UserPrivateService");
bottle.service("AgentManager", AgentManager, "AgentService");
bottle.service("UserManager", UserManager, "UserService", "RatingService");
bottle.service("CategoryManager", CategoryManager,  "CategoryService", "ServiceService");
bottle.service("ServiceManager", ServiceManager, "AuthenticationManager", "ServiceService", "CategoryService", "AgentService", "GoogleMapsService");
bottle.service("RatingManager", RatingManager, "AuthenticationManager", "RatingService");
bottle.service("SendManager", SendManager, "AuthenticationManager");
bottle.service("ChatManager", ChatManager, "AuthenticationManager", "ChatService");


module.exports = bottle.container;

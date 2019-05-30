const Bottle = require("bottlejs");

const {
  CognitoService,
  AgentService,
  AgentPrivateService,
  UserService,
  UserPrivateService,
  JwtService,
  GoogleMapsService,
  CategoryService,
  ServiceService,
  BookingService,
  RequestService,
  RatingService,
  ChatService,
} = require("./services");
const {
  AuthenticationManager,
  AgentManager,
  UserManager,
  CategoryManager,
  ServiceManager,
  RequestManager,
  BookingManager,
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
bottle.service("JwtService", JwtService);
bottle.service("GoogleMapsService", GoogleMapsService);
bottle.service("CategoryService", CategoryService);
bottle.service("ServiceService", ServiceService);
bottle.service("BookingService", BookingService);
bottle.service("RequestService", RequestService);
bottle.service("RatingService", RatingService);
bottle.service("ChatService", ChatService);
bottle.service("AuthenticationManager", AuthenticationManager, "CognitoService", "AgentService", "AgentPrivateService", "UserService", "UserPrivateService", "JwtService");
bottle.service("AgentManager", AgentManager, "AgentService");
bottle.service("UserManager", UserManager, "UserService");
bottle.service("CategoryManager", CategoryManager, "CategoryService", "ServiceService");
bottle.service("ServiceManager", ServiceManager, "ServiceService", "AgentService");
bottle.service("RequestManager", RequestManager, "ServiceService", "BookingService", "AgentPrivateService", "RequestService", "UserPrivateService");
bottle.service("BookingManager", BookingManager, "BookingService", "UserPrivateService");
bottle.service("RatingManager", RatingManager, "AuthenticationManager", "RatingService");
bottle.service("SendManager", SendManager, "AuthenticationManager");
bottle.service("ChatManager", ChatManager, "AuthenticationManager", "ChatService");


module.exports = bottle.container;

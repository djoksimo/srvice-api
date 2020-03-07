const awilix = require("awilix");

const { createContainer, asClass, InjectionMode, Lifetime } = awilix;
const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

container.loadModules(["src/managers/*.js", "src/services/*.js"], {
  formatName: "camelCase",
  resolverOptions: {
    lifetime: Lifetime.SINGLETON,
    register: asClass,
    injectionMode: InjectionMode.CLASSIC,
  },
});

module.exports = {
  container,
  cradle: container.cradle,
};

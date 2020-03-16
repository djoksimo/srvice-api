import { createContainer, asClass, InjectionMode, Lifetime } from "awilix";

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

container.loadModules(["src/managers/*.js", "src/managers/*.ts", "src/managers/*.ts", "src/services/*.js"], {
  formatName: "camelCase",
  resolverOptions: {
    lifetime: Lifetime.SINGLETON,
    register: asClass,
    injectionMode: InjectionMode.CLASSIC,
  },
});

export const { cradle } = container;

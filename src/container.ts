import { createContainer, asClass, InjectionMode, Lifetime } from "awilix";

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

container.loadModules(["built/services/*.js", "built/managers/*.js"], {
  formatName: "camelCase",
  resolverOptions: {
    lifetime: Lifetime.SINGLETON,
    register: asClass,
    injectionMode: InjectionMode.CLASSIC,
  },
});

console.log(container);

export const { cradle } = container;

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

export const { cradle } = container;

export const configureContainer = () => {
  return container;
};

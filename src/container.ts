import { createContainer, asClass, InjectionMode, Lifetime } from "awilix";
import { Environment } from "./utilities";

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

const modulePaths = Environment.runningInProd
  ? ["built/services/*.js", "built/managers/*.js"]
  : ["src/services/*.ts", "src/managers/*.ts"];

container.loadModules(modulePaths, {
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

import { configureContainer } from "../../container";

const container = configureContainer();

export function getDependency(dependencyName: string) {
  return container.cradle[dependencyName];
}

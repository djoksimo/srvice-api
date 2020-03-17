import faker from "faker";
import { Offering } from "../../types";
import { mockAgentCredentials } from "./MockAgentCredentials";

export const HealthyOffering = {
  title: faker.lorem.words(3),
  description: faker.lorem.text(200),
  duration: faker.random.number(100),
  price: faker.random.number(1000),
  agent: mockAgentCredentials.agentId,
  isDeleted: false,
};

export const createMockOffering = (offering: Partial<Offering> = {}): Offering => ({
  ...HealthyOffering,
  ...offering,
});

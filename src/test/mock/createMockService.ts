import faker from "faker";

import { Service } from "../../types";
import { mockAgentCredentials } from "./MockAgentCredentials";

const HealthyService = {
  agent: String(mockAgentCredentials.agentId),
  category: "5d969ec1365ddec148ee5b0b",
  title: "GOOOD GOOD Service",
  description: faker.lorem.paragraph(10),
  pictureUrls: [
    "https://www.trilogyed.com/blog/wp-content/uploads/2018/05/columbia_coding_boot_camp2_brandon_colbert.jpg",
    "https://www.trilogyed.com/blog/wp-content/uploads/2018/05/columbia_coding_boot_camp2_brandon_colbert.jpg",
  ],
  phone: "4161234567",
  email: mockAgentCredentials.email,
  inCall: true,
  outCall: true,
  remoteCall: true,
  address: "3530 Atwater Ave, Montreal, QC H3H 1Y5",
  latitude: 50.304922,
  longitude: -73.589814,
  radius: 10,
  averageServiceRating: 0,
  serviceRatings: [],
  offerings: [],
  viewCount: 3,
};

export const createMockService = (service: Partial<Service> = {}) => ({
  ...HealthyService,
  ...service,
});

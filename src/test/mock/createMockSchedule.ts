import { Schedule } from "../../types/schedule";
import { mockAgentCredentials } from "./mockAgentCredentials";

const HealthySchedule = {
  agentId: mockAgentCredentials.agentId,
  availability: [
    {
      weekday: "Sunday",
      start: "0.00",
      end: "24.00",
    },
    {
      weekday: "Monday",
      start: "0.00",
      end: "24.00",
    },
    {
      weekday: "Tuesday",
      start: "0.00",
      end: "24.00",
    },
    {
      weekday: "Wednesday",
      start: "0.00",
      end: "24.00",
    },
    {
      weekday: "Thursday",
      start: "0.00",
      end: "24.00",
    },
    {
      weekday: "Friday",
      start: "0.00",
      end: "24.00",
    },
  ],
};

export const createMockSchedule = (schedule: Partial<Schedule> = {}) => ({
  ...HealthySchedule,
  ...schedule,
});

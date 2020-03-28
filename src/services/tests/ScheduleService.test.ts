import faker from "faker";

import { createMockSchedule } from "../../test/mock";
import { getDependency, MongoUtils } from "../../utilities/serverUtils";
import ScheduleService from "../ScheduleService";

afterEach(() => {
  return MongoUtils.clearDatabase();
});

describe("ScheduleService", () => {
  const scheduleService: ScheduleService = getDependency("scheduleService");

  describe("generateAvailabilityCandidates()", () => {
    describe("offeringDurationInMin is 5 minutes", () => {
      const availabilityCandidates = scheduleService.generateAvailabilityCandidates(
        5,
        new Date("June 11, 1999").toUTCString(),
        new Date("June 12, 1999").toUTCString(),
      );

      it("Each slot is SLOT_INTERVAL_IN_MIN minutes apart", () => {
        const startDiffInMinutes =
          new Date(availabilityCandidates[1].start).getUTCMinutes() -
          new Date(availabilityCandidates[0].start).getUTCMinutes();

        expect(startDiffInMinutes).toStrictEqual(5);
      });

      it("There are 288 slots", () => {
        expect(availabilityCandidates.length).toStrictEqual(288);
      });

      it("The start and end time difference matches the offeringDurationInMin", () => {
        const startAndEndDiffInMinutes =
          new Date(availabilityCandidates[0].end).getUTCMinutes() -
          new Date(availabilityCandidates[0].start).getUTCMinutes();

        expect(startAndEndDiffInMinutes).toStrictEqual(5);
      });
    });
  });

  describe("filterOutUnviableSlot()", () => {
    const availabilityCandidates = scheduleService.generateAvailabilityCandidates(
      5,
      new Date("June 11, 1999").toUTCString(),
      new Date("June 12, 1999").toUTCString(),
    );

    describe("schedule has some overlapping bookings", () => {
      const bookingStartString = "1999-06-11T14:00:35.918Z";
      const bookingEndString = "1999-06-11T18:00:35.918Z";
      const mockSchedule = createMockSchedule({
        bookings: [
          {
            start: bookingStartString,
            end: bookingEndString,
            offering: faker.random.uuid(),
            user: faker.random.uuid(),
          },
        ],
      });

      it("returns less candidates than the original availabilityCandidates", () => {
        const newCandidates = scheduleService.filterOutUnviableSlot(availabilityCandidates, mockSchedule);

        const hasLessCandidates = newCandidates.length < availabilityCandidates.length;

        expect(hasLessCandidates).toStrictEqual(true);
      });

      it("availability slots does not contain any overlapping times with bookings", () => {
        const newCandidates = scheduleService.filterOutUnviableSlot(availabilityCandidates, mockSchedule);

        const foundCandidate = newCandidates.some(
          (candidateSlot) =>
            (new Date(candidateSlot.end) <= new Date(bookingEndString) &&
              new Date(candidateSlot.start) >= new Date(bookingStartString)) ||
            new Date(candidateSlot.start).getUTCHours() === 15,
        );

        expect(foundCandidate).toStrictEqual(false);
      });
    });

    describe("schedule has no bookings", () => {
      const mockSchedule = createMockSchedule({
        bookings: [],
      });

      it("returns the same number of candidates as the original availabilityCandidates", () => {
        const newCandidates = scheduleService.filterOutUnviableSlot(availabilityCandidates, mockSchedule);

        const hasEqualCandidates = newCandidates.length === availabilityCandidates.length;

        expect(hasEqualCandidates).toStrictEqual(true);
      });
    });
  });
});

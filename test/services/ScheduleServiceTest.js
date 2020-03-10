process.env.NODE_ENV = "TEST";

const { assert } = require("chai");
const { describe } = require("mocha");
const faker = require("faker");

const {
  cradle: { scheduleService },
} = require("../../src/container");
const { createMockSchedule } = require("../utilities");

class ScheduleServiceTest {
  constructor() {
    this.scheduleService = scheduleService;
  }
  async start() {
    describe("ScheduleService tests", () => {
      this.testGenerateAvailabilityCandidates();
      this.testFilterOutUnviableSlot();
    });
  }

  testGenerateAvailabilityCandidates() {
    describe("#ScheduleService.generateAvailabilityCandidates()", () => {
      describe("offeringDurationInMin is 5 minutes", () => {
        const availabilityCandidates = this.scheduleService.generateAvailabilityCandidates(
          5,
          new Date("June 11, 1999").toUTCString(),
          new Date("June 12, 1999"),
        );

        it("Each slot is SLOT_INTERVAL_IN_MIN minutes apart", () => {
          const startDiffInMinutes =
            new Date(availabilityCandidates[1].start).getUTCMinutes() -
            new Date(availabilityCandidates[0].start).getUTCMinutes();

          assert.strictEqual(startDiffInMinutes, 5, "available slots are not 5 minutes apart");
        });

        it("There are 288 slots", () => {
          assert.strictEqual(availabilityCandidates.length, 288, "there should be 288 slots");
        });

        it("The start and end time difference matches the offeringDurationInMin", () => {
          const startAndEndDiffInMinutes =
            new Date(availabilityCandidates[0].end).getUTCMinutes() -
            new Date(availabilityCandidates[0].start).getUTCMinutes();

          assert.strictEqual(startAndEndDiffInMinutes, 5, "the difference between the start and end time should be 5");
        });
      });
    });
  }

  testFilterOutUnviableSlot() {
    describe("#ScheduleService.filterOutUnviableSlot()", () => {
      const availabilityCandidates = this.scheduleService.generateAvailabilityCandidates(
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
          const newCandidates = this.scheduleService.filterOutUnviableSlot(availabilityCandidates, mockSchedule);

          const hasLessCandidates = newCandidates.length < availabilityCandidates.length;

          assert.strictEqual(
            hasLessCandidates,
            true,
            "newCandidates does not have less candidates than availabilityCandidates",
          );
        });

        it("availability slots does not contain any overlapping times with bookings", () => {
          const newCandidates = this.scheduleService.filterOutUnviableSlot(availabilityCandidates, mockSchedule);

          const foundCandidate = newCandidates.find(
            (candidateSlot) =>
              (new Date(candidateSlot.end) <= new Date(bookingEndString) &&
                new Date(candidateSlot.start) >= new Date(bookingStartString)) ||
              new Date(candidateSlot.start).getUTCHours() === 15,
          );

          assert.strictEqual(foundCandidate, undefined, "newCandidates contains overlapping slots with bookings");
        });
      });

      describe("schedule has no bookings", () => {
        const mockSchedule = createMockSchedule({
          bookings: [],
        });

        it("returns the same number of candidates as the original availabilityCandidates", () => {
          const newCandidates = this.scheduleService.filterOutUnviableSlot(availabilityCandidates, mockSchedule);

          const hasEqualCandidates = newCandidates.length === availabilityCandidates.length;

          assert.strictEqual(
            hasEqualCandidates,
            true,
            "newCandidates does not have the same number of candidates as availabilityCandidates",
          );
        });
      });
    });
  }
}

module.exports = ScheduleServiceTest;

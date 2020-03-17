import mongodb from "mongodb";

import { NewOfferingPayload } from "../../types/payloads";
import { ServiceManager, OfferingManager } from "..";
import { apiHelper, getDependency } from "../../test/helpers/apiHelper";
import { createMockOffering, createMockService, mockAgentCredentials } from "../../test/mock";
import { AuthHeaders } from "../../types";
import { OfferingModel } from "../../models";

beforeAll(async () => {
  await apiHelper();
});

const getOfferingRequestBody = async (
  serviceManager: ServiceManager,
  mockOffering: Partial<NewOfferingPayload> | any,
): Promise<NewOfferingPayload> => {
  const mockService = createMockService();
  const serviceRes = await serviceManager.createService(mockService);

  return {
    serviceId: serviceRes.json.serviceId,
    ...mockOffering,
  };
};

describe("OfferingManager", () => {
  const offeringManager: OfferingManager = getDependency("offeringManager");
  const serviceManager: ServiceManager = getDependency("serviceManager");

  describe("createOffering()", () => {
    it("Should create an offering and return id", async () => {
      const reqBody = await getOfferingRequestBody(serviceManager, createMockOffering());
      const res = await offeringManager.createOffering(reqBody, mockAgentCredentials);
      expect(res.status).toStrictEqual(201);
      expect(mongodb.ObjectID.isValid(res.json.offeringId)).toBe(true);
    });

    it("Should fail creating the offering without serviceId and return an error", async () => {
      console.log = jest.fn();

      const offeringRequestBodyWithoutServiceId = {
        ...createMockOffering(),
        serviceId: null,
      } as NewOfferingPayload;

      const res = await offeringManager.createOffering(offeringRequestBodyWithoutServiceId, mockAgentCredentials);

      expect(res.status).toStrictEqual(500);
      expect(res.json.message).toStrictEqual("Could not find service");
      expect(console.log).toHaveBeenCalled();
    });

    it("Should fail creating the offering without credentials", async () => {
      console.log = jest.fn();

      const reqBody = await getOfferingRequestBody(serviceManager, createMockOffering());
      const res = await offeringManager.createOffering(reqBody, {} as AuthHeaders);

      expect(res.status).toStrictEqual(500);
      expect(res.json.message).toStrictEqual("NICE TRY ;)");
    });
  });

  describe("patchOffering()", () => {
    it("Should patch an offering successfully", async () => {
      const mockOffering = createMockOffering();

      const reqBody = await getOfferingRequestBody(serviceManager, mockOffering);
      const createRes = await offeringManager.createOffering(reqBody, mockAgentCredentials);

      const { offeringId } = createRes.json;

      const patchBody = {
        _id: offeringId,
        title: "New Title",
        agentId: mockOffering.agent,
      };

      const patchOfferingRes = await offeringManager.patchOffering(patchBody, mockAgentCredentials);

      expect(patchOfferingRes.status).toStrictEqual(200);

      const findOfferingResult: any = await OfferingModel.findById(offeringId).exec();

      expect(findOfferingResult.title).toStrictEqual(patchBody.title);
    });
  });

  // describe("#OfferingManager.deleteOffering()", () => {
  //   beforeEach((done) => {
  //     ServiceModel.deleteMany({}, (err) => {
  //       assert.ifError(err);
  //     });

  //     OfferingModel.deleteMany({}, (err) => {
  //       assert.ifError(err);
  //       done();
  //     });
  //   });

  //   afterEach((done) => {
  //     ServiceModel.deleteMany({}, (err) => {
  //       assert.ifError(err);
  //     });

  //     OfferingModel.deleteMany({}, (err) => {
  //       assert.ifError(err);
  //       done();
  //     });
  //   });

  //   it("Should delete an offering successfully", async () => {
  //     // TODO: make this test more independent of ServiceManager
  //     const serviceRes = await this.serviceManager.createService(HealthyService);
  //     const { serviceId } = serviceRes.json;

  //     // attach serviceId to offering
  //     const offeringBody = HealthyOffering;
  //     offeringBody.serviceId = serviceId;

  //     const createRes = await offeringManager.createOffering(offeringBody, MockAgentCredentials);

  //     const { offeringId } = createRes.json;

  //     const deleteRes = await offeringManager.deleteOffering(
  //       {
  //         offeringId,
  //         serviceId,
  //       },
  //       MockAgentCredentials,
  //     );

  //     assert.strictEqual(deleteRes.status, 200, "Fail: Status code should be 200");
  //     // TODO: add search for offering in service
  //     // and check if offering is accessible
  //   });
  // });
});

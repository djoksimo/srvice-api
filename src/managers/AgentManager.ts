import AgentService from "services/AgentService";
import { Agent } from "types";
import { ObjectID } from "mongodb";

export default class AgentManager {
  agentService: AgentService;

  constructor(agentService: AgentService) {
    this.agentService = agentService;
  }

  async getAgentById({ id }: { id: ObjectID }) {
    try {
      const agentDocument = await this.agentService.getAgentById(id);
      return { status: 200, json: agentDocument };
    } catch (error) {
      console.log(error);
      return { status: 500, json: error };
    }
  }

  async patchAgent(partialAgent: Partial<Agent>) {
    try {
      const result = await this.agentService.updateAgent(partialAgent);
      return { status: 200, json: result };
    } catch (error) {
      return { status: 500, json: { error: error.toString() } };
    }
  }
}

class AgentManager {

  constructor(AgentService) {
    this.agentService = AgentService;
  }

  async getAgentById({ id }) {
    try {
      const agentDocument = await this.agentService.getAgentById(id);
      return { status: 200, json: agentDocument };
    } catch (error) {
      console.log(error);
      return { status: 500, json: error };
    }
  }
}

module.exports = AgentManager;

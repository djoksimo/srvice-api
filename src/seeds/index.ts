import { httpUtils } from "./utilities";
import { apiHelper, getServer } from "../utils/apiUtils";

async function moss() {
  // TODO - better name
  await apiHelper();

  const res = await httpUtils.get("http://localhost:5002", "category/home");

  console.log(res);
}

moss();

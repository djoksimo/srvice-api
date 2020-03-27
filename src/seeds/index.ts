import { httpUtils } from "./utilities";

async function moss() {
  const res = await httpUtils.get("http://localhost:5000", "category/home");

  console.log(res);
}

moss();

import { v4 as uuidv4 } from "uuid";

 function generateTimeUuid() {
  const timestamp = Date.now();
  const uuid = uuidv4();
  const co = `${timestamp}-${uuid}`;
  console.log(co, "from gennnnnnnnnnnnnnnnnnnnnn", " \n\n\n ");
  return co;
}

export default generateTimeUuid;

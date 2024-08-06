import { v4 as uuidv4 } from "uuid";

function generateTimeUuid() {
  const timestamp = Date.now();
  const uuid = uuidv4();
  return `${timestamp}-${uuid}`;
}

export default generateTimeUuid;

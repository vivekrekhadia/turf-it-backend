import { mongodbConnect } from "../mongodb/mongodbConnect.mjs";

export const handler = async (event) => {
  await mongodbConnect();
  console.log("event", event);
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({ message: "Emails Sent Successfully" }),
  };
};

import userModel from "../models/userModel.mjs";
import { mongodbConnect } from "../mongodb/mongodbConnect.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const handler = async (event) => {
  console.log(event.body);
  const data = JSON.parse(event.body);
  console.log(data.email, "user");
  try {
    await mongodbConnect();
    const user2 = await userModel.find();
    console.log(user2, "user2");
    const user = await userModel.findOne({
      email: data.email,
    });
    console.log(user, "user");

    if (!user) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          message: "User with that email does not exist",
        }),
      };
    }
    console.log("validPassword1");

    const validPassword = await bcrypt.compare(data.password, user.password);

    console.log(validPassword, "validPassword");
    if (!validPassword) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          message: "Incorrect password",
        }),
      };
    }

    let token = jwt.sign({ _id: user._id }, "turf-it", { expiresIn: "1d" });
    console.log(token, "token");
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        token,
        user,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "Something went wrong", error }),
    };
  }
};

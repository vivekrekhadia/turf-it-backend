import { mongodbConnect } from "../mongodb/mongodbConnect.mjs";
import userModel from "../models/userModel.mjs";
import { z } from "zod";
import bcrypt from "bcryptjs";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(10),
});

export const handler = async (event) => {
  console.log(event.body);
  try {
    await mongodbConnect();
    const { name, email, password, phone } = await registerSchema.parse(
      JSON.parse(event.body)
    );

    const hashedPassword = await bcrypt.hashSync(password, 10);
    console.log(hashedPassword, "hashedPassword");
    const user = {
      name,
      email,
      password: hashedPassword,
      phone,
    };

    const data = new userModel(user);
    await data.save();

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "User created Successfully", data }),
    };
  } catch (error) {
    if (error.name == "ZodError") {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          message: "Validation error",
          details: error.issues,
        }),
      };
    } else {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ message: "Something went wrong", error }),
      };
    }
  }
};

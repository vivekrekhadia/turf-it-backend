import { mongodbConnect } from "../mongodb/mongodbConnect.mjs";
import userModel from "../models/userModel.mjs";
import { z } from "zod";

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
    const { name, email, password, phone } = registerSchema.parse(
      JSON.parse(event.body)
    );
    // const hashedPassword = await bcrypt.hash(password, 10);
    // co;
    const user = {
      name,
      email,
      password,
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
    console.log(error);
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation error", details: error.errors });
    }
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

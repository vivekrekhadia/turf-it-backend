import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(10),
});

const func = async () => {
  try {
    const { name, email, password, phone } = await registerSchema.parse({
      name: "John2 Doe",
      email: "john2.doe.com",
      password: "securePassword",
      phone: "1234567890",
    });
  } catch (error) {
    console.log(error, "error");
    if (error.name == "ZodError") {
      console.log(error, "error2");

      return {
        statusCode: 400,
        body: {
          message: "Validation error",
          details: JSON.stringify(error.issues),
        },
      };
    }
  }
};
console.log(await func());

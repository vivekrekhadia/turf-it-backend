import mongoose from "mongoose";

export const mongodbConnect = async () => {
  await mongoose
    .connect(process.env.mongoDbUrl, {
      dbName: "turf-it",
    })
    .then(() => console.log("connected"))
    .catch((err) => console.log(err));
};

import "dotenv/config";
import express from "express";
import { startDatabase } from "./database";
import logics from "./logics";
import middlewares from "./middlewares";

const app = express();
app.use(express.json());
app.use("/movies/:id", middlewares.idExists);

app.post("/movies", middlewares.nameExists, logics.create);
app.get("/movies", logics.read);
app.get("/movies/:id", logics.retrive);
app.patch("/movies/:id", middlewares.nameExists, logics.updateParcial);
app.delete("/movies/:id", logics.destroy);

const PORT: number = 3000;
app.listen(PORT, async (): Promise<void> => {
  await startDatabase();
  console.log(`App is running on port ${PORT}`);
});

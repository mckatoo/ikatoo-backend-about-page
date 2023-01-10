import "express-async-errors";

import express, { Request, Response } from "express";

import routes from "./routes";
import env from "./env";
import cors, { CorsOptions } from "cors";
import { errorMiddleware } from "./middlewares/error";

const app = express();
app.use(express.json());

if (env.NODE_ENV.includes("prod")) {
  const corsOptions: CorsOptions = {
    origin: /ikatoo\.com\.br$/,
    methods: "GET,PUT,PATCH,POST,DELETE",
  };
  app.use(cors(corsOptions));
} else {
  app.use(cors());
}

app.use(express.urlencoded({ extended: true }));

app.disable("x-powered-by").disable("etag");

app.use(routes);

// Status
app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

// Error Handling
app.use(errorMiddleware);

export default app;

import dotenv from "dotenv";

dotenv.config({
  path: `.env.${process.env.NODE_ENV ?? ""}`,
});

const env = (key: string) => {
  if (process.env[key] === undefined)
    console.error(`*** ${key} IS UNDEFINED. ***`);
  return `${process.env[key] ?? ""}`;
};

export default {
  POSTGRES_USER: env('POSTGRES_USER'),
  POSTGRES_PASSWORD: env('POSTGRES_PASSWORD'),
  POSTGRES_HOST: env('POSTGRES_HOST'),
  POSTGRES_PORT: env('POSTGRES_PORT'),
  POSTGRES_DB: env('POSTGRES_DB'),
  NODE_ENV: env('NODE_ENV'),
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import env from "@/helpers/env";
import pgPromise from "pg-promise";

const pgp = pgPromise({});

const postgres = pgp({
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  host: env.POSTGRES_HOST,
  port: parseInt(env.POSTGRES_PORT),
  database: env.POSTGRES_DB,
  idleTimeoutMillis: 100,
});

export default async () => {
  await postgres.none(`create table if not exists aboutPage (
    title varchar(100) NOT NULL,
    description text NOT NULL,
    avatar_url text,
    avatar_alt text
  )`);
  await postgres.none(`create table if not exists skills (
    id varchar(100) NOT NULL UNIQUE PRIMARY KEY,
    title varchar(100) NOT NULL
  )`);

  return postgres;
};

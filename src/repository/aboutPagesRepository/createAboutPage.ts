import database from "../database";
import { randomUUID } from "crypto";

export type AboutPageRepository = {
  title: string
  description: string
  avatarURL?: string
  avatarALT?: string
  userID: string
}

export default async (aboutPage: AboutPageRepository): Promise<void> => {
  const db = await database();
  await db.none("insert into aboutPages (id,title,description,avatar_url,avatar_alt,user_id) values ($1,$2,$3,$4,$5,$6)", [
    randomUUID(),
    aboutPage.title,
    aboutPage.description,
    aboutPage.avatarURL,
    aboutPage.avatarALT,
    aboutPage.userID,
  ]);
};

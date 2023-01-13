import { AboutPageProps } from "@/types/AboutPage";
import database from "./database";
import { randomUUID } from "crypto";

export default async (aboutPage: AboutPageProps): Promise<void> => {
  const db = await database();
  await db.none("insert into aboutPages (id,title,description,avatar_url,avatar_alt,user_id) values ($1,$2,$3,$4,$5,$6)", [
    aboutPage.id ?? randomUUID(),
    aboutPage.title,
    aboutPage.description,
    aboutPage.avatarURL,
    aboutPage.avatarALT,
    aboutPage.userId,
  ]);

  const { skills } = aboutPage;
  skills.forEach(async (skill) => {
    await db.none("insert into skills (id, title, user_id) values ($1,$2,$3)", [
      randomUUID(),
      skill,
      aboutPage.userId,
    ]);
  });
};

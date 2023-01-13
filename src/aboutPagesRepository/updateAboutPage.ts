import { AboutPageProps } from "@/types/AboutPage";
import database from "./database";
import { randomUUID } from "crypto";

export default async (aboutPage: AboutPageProps): Promise<void> => {
  const db = await database();
  await db.none(
    "update aboutPages set title = $1, description = $2, avatar_url = $3, avatar_alt = $4 where user_id = $5",
    [
      aboutPage.title,
      aboutPage.description,
      aboutPage.avatarURL,
      aboutPage.avatarALT,
      aboutPage.userId,
    ]
  );

  const { skills } = aboutPage;
  await db.none("delete from skills where user_id = $1", [aboutPage.userId]);
  skills.forEach(async (skill) => {
    await db.none("insert into skills values($1,$2,$3)", [
      randomUUID(),
      skill,
      aboutPage.userId,
    ]);
  });
};

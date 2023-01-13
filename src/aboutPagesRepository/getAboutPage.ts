import { AboutPageWithID } from "@/types/AboutPage";
import database from "./database";

export default async (userId: string): Promise<AboutPageWithID> => {
  const db = await database();
  const aboutPage = await db.one(
    "select * from aboutPages where user_id = $1",
    [userId]
  );
  const skills = await db.any(
    "select * from skills where user_id = $1 order by title",
    [userId]
  );

  return {
    id: aboutPage.id,
    title: aboutPage.title,
    description: aboutPage.description,
    skills: skills.map((skill) => skill.title),
    avatarURL: aboutPage.avatar_url,
    avatarALT: aboutPage.avatar_alt,
    userId: aboutPage.user_id,
  };
};

import { AboutPageRepository } from "./createAboutPage";
import database from "../database";

export type AboutPageWithID = AboutPageRepository & { id: string };

export default async (userID: string): Promise<AboutPageWithID> => {
  const db = await database();
  const aboutPage = await db.one(
    "select * from aboutPages where user_id = $1",
    [userID]
  );

  return {
    id: aboutPage.id,
    title: aboutPage.title,
    description: aboutPage.description,
    avatarURL: aboutPage.avatar_url,
    avatarALT: aboutPage.avatar_alt,
    userID: aboutPage.user_id,
  };
};

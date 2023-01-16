import database from "../database";
import { AboutPageRepository } from "./createAboutPage";

export default async (): Promise<AboutPageRepository> => {
  const db = await database();
  const aboutPage = await db.one("select * from aboutPage");

  return {
    title: aboutPage.title,
    description: aboutPage.description,
    avatarURL: aboutPage.avatar_url,
    avatarALT: aboutPage.avatar_alt,
  };
};

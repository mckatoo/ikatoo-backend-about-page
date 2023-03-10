import { AboutPageRepository } from "./createAboutPage";
import database from "../database";

export default async (aboutPage: AboutPageRepository): Promise<void> => {
  const db = await database();
  await db.none(
    "update aboutPage set title = $1, description = $2, avatar_url = $3, avatar_alt = $4",
    [
      aboutPage.title,
      aboutPage.description,
      aboutPage.avatarURL,
      aboutPage.avatarALT,
    ]
  );
};

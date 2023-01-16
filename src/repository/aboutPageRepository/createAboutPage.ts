import database from "../database";

export type AboutPageRepository = {
  title: string;
  description: string;
  avatarURL?: string;
  avatarALT?: string;
};

export default async (aboutPage: AboutPageRepository): Promise<void> => {
  const db = await database();
  await db.none("delete from aboutPage where title like '%'");
  await db.none(
    "insert into aboutPage (title,description,avatar_url,avatar_alt) values ($1,$2,$3,$4)",
    [
      aboutPage.title,
      aboutPage.description,
      aboutPage.avatarURL,
      aboutPage.avatarALT,
    ]
  );
};

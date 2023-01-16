import database from "../database";

export default async ():Promise<void> => {
  const db = await database();
  await db.none("delete from aboutPage");
}
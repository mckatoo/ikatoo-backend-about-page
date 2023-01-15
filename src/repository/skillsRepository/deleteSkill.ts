import database from "../database";

export default async (userID: string):Promise<void> => {
  const db = await database();
  await db.none("delete from skills where user_id = $1", [
    userID
  ]);
}
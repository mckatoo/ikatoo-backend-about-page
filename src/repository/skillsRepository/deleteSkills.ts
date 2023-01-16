import database from "../database";

export default async (id: string): Promise<void> => {
  const db = await database();
  await db.none("delete from skills where id = $1", [id]);
};

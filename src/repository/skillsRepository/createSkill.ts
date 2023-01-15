import database from "../database";
import { randomUUID } from "crypto";

export type SkillRepository = {
  title: string;
  userID: string;
};

export default async (skill: SkillRepository): Promise<void> => {
  const db = await database();
  const titleExist = await db.oneOrNone(
    "select * from skills where user_id = $1 and title = $2",
    [skill.userID, skill.title]
  );
  if (titleExist) throw new Error("This skill already exists for this user.");

  await db.none("insert into skills (id, title, user_id) values ($1,$2,$3)", [
    randomUUID(),
    skill.title,
    skill.userID,
  ]);
};

import database from "../database";
import { SkillWithID } from "./listSkill";

export default async (skill: SkillWithID): Promise<void> => {
  const db = await database();
  const titleExist = await db.oneOrNone(
    "select * from skills where title = $1",
    [skill.title]
  );
  if (titleExist) throw new Error("This skill already exists.");

  await db.none("update skills set title = $1 where id = $2", [
    skill.title,
    skill.id,
  ]);
};

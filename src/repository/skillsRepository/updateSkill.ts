import database from "../database";
import { SkillRepository } from "./createSkill";

export default async (skill: SkillRepository): Promise<void> => {
  const db = await database();
  const titleExist = await db.oneOrNone(
    "select * from skills where user_id = $1 and title = $2",
    [skill.userID, skill.title]
  );
  if(titleExist) throw new Error("This skill already exists for this user.");
  
  await db.none("update skills set title = $1 where user_id = $2", [
    skill.title,
    skill.userID,
  ]);
};

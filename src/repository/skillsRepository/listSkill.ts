import database from "../database";
import { SkillRepository } from "./createSkill";

export type SkillWithID = SkillRepository & { id: string };

export default async (userID: string): Promise<SkillWithID[]> => {
  const db = await database();
  const skills = await db.manyOrNone(
    "select * from skills where user_id = $1",
    [userID]
  );

  return skills.map((skill) => ({ 
    id: skill.id,
    title: skill.title,
    userID: skill.user_id }));
};

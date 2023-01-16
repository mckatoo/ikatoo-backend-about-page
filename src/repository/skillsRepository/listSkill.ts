import database from "../database";
import { SkillRepository } from "./createSkill";

export type SkillWithID = SkillRepository & { id: string };

export default async (): Promise<SkillWithID[]> => {
  const db = await database();
  const skills = await db.manyOrNone("select * from skills");

  return skills
};

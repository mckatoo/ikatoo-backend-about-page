import { randomUUID } from "crypto";
import database from "../database";

export type SkillRepository = {
  title: string;
};

export default async (skill: SkillRepository): Promise<void> => {
  const db = await database();
  const titleExist = await db.oneOrNone(
    "select * from skills where title = $1",
    [skill.title]
  );
  if (titleExist) throw new Error("This skill already exists.");

  await db.none("insert into skills (id, title) values ($1, $2)", [
    randomUUID(),
    skill.title,
  ]);
};

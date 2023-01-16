import { generateString } from "@/helpers/generate";
import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import database from "../database";
import createSkill from "./createSkill";
import deleteSkill from "./deleteSkills";
import listSkill, { SkillWithID } from "./listSkill";
import updateSkill from "./updateSkill";

describe("Skills repository", () => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  let db: IDatabase<{}, IClient>;

  beforeAll(async () => {
    db = await database();
  });

  afterAll(async () => {
    await db.$pool.end();
  });

  it("Should insert skill data", async () => {
    const skillMock = {
      title: generateString(),
    };
    await createSkill(skillMock);

    const skill = await db.oneOrNone("select * from skills where title = $1", [
      skillMock.title,
    ]);

    expect(skill).toEqual({
      id: skill.id,
      title: skillMock.title,
    });
  });

  it("Should not insert existent skill data", async () => {
    const skillMock = {
      title: generateString(),
    };
    await createSkill(skillMock);
    await expect(createSkill(skillMock)).rejects.toThrowError(
      /This skill already exists/i
    );
  });

  it("should list skills", async () => {
    await db.none("delete from skills");
    const skillsMock = [
      {
        title: generateString(),
      },
      {
        title: generateString(),
      },
      {
        title: generateString(),
      },
    ];

    for await (const skill of skillsMock) {
      await createSkill(skill);
    }

    const produced = await listSkill();

    produced.map((skill) => {
      expect(skill).toHaveProperty("id");
    });
    expect(skillsMock).toEqual(
      expect.arrayContaining(
        produced.map((skill) => ({
          title: skill.title,
        }))
      )
    );
  });

  it("should update skill data", async () => {
    const db = await database();
    const skillMock = {
      title: generateString(),
    };
    await createSkill(skillMock);
    const skill = await db.one("select * from skills where title = $1", [
      skillMock.title,
    ]);

    const newSkillMock: SkillWithID = {
      id: skill.id,
      title: `new title - ${generateString()}`,
    };
    await updateSkill(newSkillMock);
    const newSkill = await db.one("select * from skills where id = $1", [
      skill.id,
    ]);

    expect(newSkill).toEqual({
      id: skill.id,
      title: newSkillMock.title,
    });
  });

  it("should delete skill data data", async () => {
    // create a skill data for delete
    const skillMock = {
      title: generateString(),
    };
    await createSkill(skillMock);

    // verify created skill
    const createdSkill = await db.oneOrNone(
      "select * from skills where title = $1",
      [skillMock.title]
    );
    expect(createdSkill).toEqual({
      id: createdSkill.id,
      title: skillMock.title,
    });

    // delete skill
    await deleteSkill(createdSkill.id);

    // search skill
    const deletedSkill = await db.oneOrNone(
      "select * from skills where title = $1",
      [skillMock.title]
    );

    // search result to have been null
    expect(deletedSkill).toBeNull();
  });
});

import { generateString } from "@/helpers/generate";
import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import database from "../database";
import createSkill from "./createSkill";
import deleteSkill from "./deleteSkill";
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
      userID: generateString(),
    };
    await createSkill(skillMock);

    const skill = await db.oneOrNone(
      "select * from skills where user_id = $1",
      [skillMock.userID]
    );

    expect(skill).toEqual({
      id: skill.id,
      title: skillMock.title,
      user_id: skillMock.userID,
    });
  });

  it("Should not insert existent skill data", async () => {
    const skillMock = {
      title: generateString(),
      userID: generateString(),
    };
    await createSkill(skillMock);
    await expect(createSkill(skillMock)).rejects.toThrowError(
      /This skill already exists for this user/i
    );
  });

  it("should list skills from userID", async () => {
    const userID = generateString();
    const skillsMock = [
      {
        title: generateString(),
        userID,
      },
      {
        title: generateString(),
        userID,
      },
      {
        title: generateString(),
        userID,
      },
    ];

    for await (const skill of skillsMock) {
      await createSkill(skill);
    }

    const produced = await listSkill(userID);

    produced.map(skill => {
      expect(skill).toHaveProperty('id')
    })
    expect(skillsMock).toEqual(produced.map(skill => ({
      title: skill.title,
      userID: skill.userID
    })));
  });

  it("should update skill data", async () => {
    const db = await database();
    const skillMock = {
      title: generateString(),
      userID: generateString(),
    };
    await createSkill(skillMock);
    const skill = await db.one("select * from skills where user_id = $1", [
      skillMock.userID,
    ]);

    const newSkillMock: SkillWithID = {
      id: skill.id,
      title: `new title - ${generateString()}`,
      userID: skillMock.userID,
    };
    await updateSkill(newSkillMock);
    const newSkill = await db.one("select * from skills where user_id = $1", [
      skillMock.userID,
    ]);

    expect(newSkill).toEqual({
      id: skill.id,
      title: newSkillMock.title,
      user_id: skillMock.userID,
    });
  });

  it("should delete skill data data", async () => {
    // create a skill data for delete
    const skillMock = {
      title: generateString(),
      userID: generateString(),
    };
    await createSkill(skillMock);

    // verify created skill
    const createdSkill = await db.oneOrNone(
      "select * from skills where user_id = $1",
      [skillMock.userID]
    );
    expect(createdSkill).toEqual({
      id: createdSkill.id,
      title: skillMock.title,
      user_id: skillMock.userID,
    });

    // delete skill
    await deleteSkill(skillMock.userID);

    // search skill by user_id
    const deletedSkill = await db.oneOrNone(
      "select * from skills where user_id = $1",
      [skillMock.userID]
    );

    // search result to have been null
    expect(deletedSkill).toBeNull();
  });
});

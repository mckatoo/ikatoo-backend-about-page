import app from "@/app";
import { generateString } from "@/helpers/generate";
import createAboutPage, {
  AboutPageRepository,
} from "@/repository/aboutPagesRepository/createAboutPage";
import database from "@/repository/database";
import createSkill, {
  SkillRepository,
} from "@/repository/skillsRepository/createSkill";
import { randomUUID } from "crypto";
import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import request from "supertest";

describe("Express - About Page", () => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  let db: IDatabase<{}, IClient>;

  beforeAll(async () => {
    db = await database();
  });

  afterAll(async () => {
    await db.$pool.end();
  });

  it("should create about page", async () => {
    const aboutPageMock: AboutPageRepository = {
      title: generateString(),
      description: generateString(),
      avatarURL: generateString(),
      avatarALT: generateString(),
      userID: randomUUID(),
    };
    let skillsMock: SkillRepository[] = [];
    for (let index = 0; index < 5; index++) {
      skillsMock = [
        ...skillsMock,
        {
          title: generateString(),
          userID: aboutPageMock.userID,
        },
      ];
    }

    const response = await request(app)
      .post("/about")
      .send({ ...aboutPageMock, skills: skillsMock });
    expect(response.status).toBe(201);

    const createdAboutPage = await db.any(
      "select * from aboutPages where user_id = $1",
      [aboutPageMock.userID]
    );
    const createdSkills = await db.any(
      "select * from skills where user_id = $1",
      [aboutPageMock.userID]
    );

    expect(createdAboutPage).toEqual([
      {
        id: createdAboutPage[0].id,
        title: aboutPageMock.title,
        description: aboutPageMock.description,
        avatar_url: aboutPageMock.avatarURL,
        avatar_alt: aboutPageMock.avatarALT,
        user_id: aboutPageMock.userID,
      },
    ]);
    expect(
      createdSkills.map((skill) => ({
        title: skill.title,
        userID: skill.user_id,
      }))
    ).toEqual(skillsMock);
  });

  it("should get about page data by user id", async () => {
    const aboutPageMock: AboutPageRepository = {
      title: generateString(),
      description: generateString(),
      avatarURL: generateString(),
      avatarALT: generateString(),
      userID: randomUUID(),
    };
    await createAboutPage(aboutPageMock);

    let skillsMock: SkillRepository[] = [];
    for (let index = 0; index < 5; index++) {
      const skill = {
        title: generateString(),
        userID: aboutPageMock.userID,
      };
      skillsMock = [...skillsMock, skill];
      await createSkill(skill);
    }
    const createdSkills = (
      await db.manyOrNone("select * from skills where user_id = $1", [
        aboutPageMock.userID,
      ])
    ).map((skill) => ({
      id: skill.id,
      title: skill.title,
      userID: skill.user_id,
    }));

    const { body, status } = await request(app).get(
      `/about/user_id/${aboutPageMock.userID}`
    );

    expect(skillsMock).toEqual(
      createdSkills.map((skill) => ({
        title: skill.title,
        userID: skill.userID,
      }))
    );
    expect(status).toBe(200);
    expect(body).toEqual({
      id: body.id,
      title: body.title,
      description: body.description,
      skills: createdSkills,
      avatarURL: body.avatarURL,
      avatarALT: body.avatarALT,
      userID: body.userID,
    });
  });

  // it("should update about page", async () => {
  //   const aboutPageMock = {
  //     title: generateString(),
  //     description: generateString(),
  //     skills: [generateString(), generateString(), generateString()],
  //     userID: randomUUID(),
  //   };
  //   await createAboutPage(aboutPageMock);
  //   const { id } = await getAboutPage(aboutPageMock.userID);

  //   const newAboutPage = {
  //     id,
  //     title: `New Title ${generateString()}`,
  //     description: `New description ${generateString()}`,
  //     skills: [`a${generateString()}`, `b${generateString()}`],
  //     avatarURL: generateString(),
  //     avatarALT: generateString(),
  //     userID: aboutPageMock.userID,
  //   };

  //   const response = await request(app).put("/about").send(newAboutPage);

  //   expect(response.status).toBe(201);

  //   const updatedAboutPage = await getAboutPage(aboutPageMock.userID);
  //   expect(
  //     expect.objectContaining({
  //       ...updatedAboutPage,
  //       skills: expect.arrayContaining(updatedAboutPage.skills),
  //     })
  //   ).toEqual(
  //     expect.objectContaining({
  //       id,
  //       title: newAboutPage.title,
  //       description: newAboutPage.description,
  //       avatarURL: newAboutPage.avatarURL,
  //       avatarALT: newAboutPage.avatarALT,
  //       skills: expect.arrayContaining(newAboutPage.skills),
  //       userID: aboutPageMock.userID,
  //     })
  //   );
  // });
});

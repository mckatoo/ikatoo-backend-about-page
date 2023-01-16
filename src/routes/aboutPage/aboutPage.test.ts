import app from "@/app";
import { generateString } from "@/helpers/generate";
import createAboutPage, {
  AboutPageRepository,
} from "@/repository/aboutPageRepository/createAboutPage";
import database from "@/repository/database";
import createSkill, {
  SkillRepository,
} from "@/repository/skillsRepository/createSkill";
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
    await db.none("delete from aboutPage");
    await db.none("delete from skills");
    const aboutPageMock: AboutPageRepository = {
      title: generateString(),
      description: generateString(),
      avatarURL: generateString(),
      avatarALT: generateString(),
    };
    let skillsMock: SkillRepository[] = [];
    for (let index = 0; index < 5; index++) {
      skillsMock = [
        ...skillsMock,
        {
          title: generateString(),
        },
      ];
    }

    const response = await request(app)
      .post("/about")
      .send({ ...aboutPageMock, skills: skillsMock });
    expect(response.status).toBe(201);

    const createdAboutPage = await db.one("select * from aboutPage");
    const createdSkills = await db.manyOrNone("select * from skills");

    expect(createdAboutPage).toEqual({
      title: aboutPageMock.title,
      description: aboutPageMock.description,
      avatar_url: aboutPageMock.avatarURL,
      avatar_alt: aboutPageMock.avatarALT,
    });

    createdSkills.forEach((skill) => {
      expect(
        skillsMock.filter((_skill) => _skill.title === skill.title)
      ).toHaveLength(1);
    });
  });

  it("should get about page data", async () => {
    await db.none("delete from skills");

    const aboutPageMock: AboutPageRepository = {
      title: generateString(),
      description: generateString(),
      avatarURL: generateString(),
      avatarALT: generateString(),
    };
    await createAboutPage(aboutPageMock);

    let skillsMock: SkillRepository[] = [];
    for (let index = 0; index < 5; index++) {
      const skill = {
        title: generateString(),
      };
      skillsMock = [...skillsMock, skill];
      await createSkill(skill);
    }
    const createdSkills = await db.manyOrNone("select * from skills");

    const { body, status } = await request(app).get("/about");

    expect(status).toBe(200);
    createdSkills.forEach((skill) => {
      skillsMock.filter((_skill) => _skill.title === skill.title);
    });
    expect(body).toEqual({
      title: body.title,
      description: body.description,
      skills: createdSkills,
      avatarURL: body.avatarURL,
      avatarALT: body.avatarALT,
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

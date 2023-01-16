import app from "@/app";
import { generateString } from "@/helpers/generate";
import createAboutPage, {
  AboutPageRepository,
} from "@/repository/aboutPageRepository/createAboutPage";
import getAboutPage from "@/repository/aboutPageRepository/getAboutPage";
import database from "@/repository/database";
import createSkill, {
  SkillRepository,
} from "@/repository/skillsRepository/createSkill";
import listSkill from "@/repository/skillsRepository/listSkill";
import request from "supertest";

describe("Express - About Page", () => {
  it("should create about page", async () => {
    const db = await database();

    await db.none("delete from aboutPage where title like '%'");
    await db.none("delete from skills where id like '%'");
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
    const db = await database();

    await db.none("delete from skills where id like '%'");

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

  it("should update about page", async () => {
    const db = await database();

    // clear database
    await db.none("delete from aboutPage where title like '%'");
    await db.none("delete from skills where id like '%'");

    // prepare mock data
    const aboutPageMock: AboutPageRepository = {
      title: generateString(),
      description: generateString(),
      avatarURL: generateString(),
      avatarALT: generateString(),
    };
    let skillsMock: SkillRepository[] = [];
    for (let index = 0; index < 5; index++) {
      const skill = {
        title: generateString(),
      };
      skillsMock = [...skillsMock, skill];
      await createSkill(skill);
    }
    await createAboutPage(aboutPageMock);

    const newAboutPageMock: AboutPageRepository = {
      title: generateString(),
      description: generateString(),
      avatarURL: generateString(),
      avatarALT: generateString(),
    };
    const newSkillsMock: SkillRepository[] = [
      { title: "generateString() 1" },
      { title: "generateString() 2" },
    ];

    // should update data
    const response = await request(app)
      .put("/about")
      .send({
        ...newAboutPageMock,
        skills: [...skillsMock, ...newSkillsMock],
      });

    // expect result test
    expect(response.status).toBe(201);

    const updatedAboutPage = await getAboutPage();
    expect(updatedAboutPage).toEqual(newAboutPageMock);

    // const skills = await listSkill();
    expect(listSkill().then((skills) => skills.length)).resolves.toBe(7);
  });
});

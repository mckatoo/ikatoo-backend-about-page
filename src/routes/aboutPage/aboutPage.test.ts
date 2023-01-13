import createAboutPage from "@/aboutPagesRepository/createAboutPage";
import database from "@/aboutPagesRepository/database";
import getAboutPage from "@/aboutPagesRepository/getAboutPage";
import app from "@/app";
import { generateString } from "@/helpers/generate";
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
    const aboutPageMock = {
      title: generateString(),
      description: generateString(),
      skills: [
        generateString(),
        generateString(),
        generateString(),
        generateString(),
        generateString(),
      ],
      userId: generateString(),
    };

    const response = await request(app).post("/about").send(aboutPageMock);
    expect(response.status).toBe(201);

    const createdAboutPage = await db.any(
      "select * from aboutPages where user_id = $1",
      [aboutPageMock.userId]
    );
    expect(createdAboutPage).toEqual([
      {
        id: createdAboutPage[0].id,
        title: aboutPageMock.title,
        description: aboutPageMock.description,
        avatar_url: null,
        avatar_alt: null,
        user_id: aboutPageMock.userId,
      },
    ]);
  });

  it("should get about page data by user id", async () => {
    const aboutPageMock = {
      title: generateString(),
      description: generateString(),
      skills: [generateString(), generateString()].sort(),
      userId: randomUUID(),
    };
    await createAboutPage(aboutPageMock);

    const { body, status } = await request(app).get(
      `/about/user_id/${aboutPageMock.userId}`
    );

    expect(status).toBe(200);
    expect(body).toEqual({
      id: body.id,
      title: body.title,
      description: body.description,
      skills: expect.arrayContaining(aboutPageMock.skills),
      avatarURL: null,
      avatarALT: null,
      userId: body.userId,
    });
  });

  it("should update about page", async () => {
    const aboutPageMock = {
      title: generateString(),
      description: generateString(),
      skills: [generateString(), generateString(), generateString()],
      userId: randomUUID(),
    };
    await createAboutPage(aboutPageMock);
    const { id } = await getAboutPage(aboutPageMock.userId);

    const newAboutPage = {
      id,
      title: `New Title ${generateString()}`,
      description: `New description ${generateString()}`,
      skills: [`a${generateString()}`, `b${generateString()}`],
      avatarURL: generateString(),
      avatarALT: generateString(),
      userId: aboutPageMock.userId,
    };

    const response = await request(app).put("/about").send(newAboutPage);

    expect(response.status).toBe(201);

    const updatedAboutPage = await getAboutPage(aboutPageMock.userId);
    expect(updatedAboutPage).toEqual(
      expect.objectContaining({
        id,
        title: newAboutPage.title,
        description: newAboutPage.description,
        avatarURL: newAboutPage.avatarURL,
        avatarALT: newAboutPage.avatarALT,
        skills: expect.arrayContaining(newAboutPage.skills),
        userId: aboutPageMock.userId,
      })
    );
  });
});

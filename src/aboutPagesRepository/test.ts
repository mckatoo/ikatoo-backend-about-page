import { generateString } from "@/helpers/generate";
import { AboutPageProps, AboutPageWithID } from "@/types/AboutPage";
import { randomUUID } from "crypto";
import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import createAboutPage from "./createAboutPage";
import database from "./database";
import deleteAboutPage from "./deleteAboutPage";
import getAboutPage from "./getAboutPage";
import updateAboutPage from "./updateAboutPage";

describe("About Postgres repository", () => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  let db: IDatabase<{}, IClient>;

  beforeAll(async () => {
    db = await database();
  });

  afterAll(async () => {
    await db.$pool.end();
  });

  it("Should insert about page", async () => {
    const aboutPageMock = {
      title: generateString(),
      description: generateString(),
      skills: [
        generateString(),
        generateString(),
        generateString(),
        generateString(),
      ],
      userId: generateString(),
    };
    await createAboutPage(aboutPageMock);

    const user = await db.one<AboutPageWithID>(
      "select * from aboutPages where user_id = $1",
      [aboutPageMock.userId]
    );

    expect(user).toEqual({
      id: user?.id,
      title: aboutPageMock.title,
      description: aboutPageMock.description,
      avatar_url: null,
      avatar_alt: null,
      user_id: aboutPageMock.userId,
    });
  });

  it("Should insert about page with id", async () => {
    const aboutPageMock = {
      id: randomUUID(),
      title: generateString(),
      description: generateString(),
      skills: [generateString(), generateString(), generateString()],
      userId: generateString(),
    };
    await createAboutPage(aboutPageMock);

    const user = await db.one<AboutPageWithID>(
      "select * from aboutPages where id = $1",
      [aboutPageMock.id]
    );

    expect(user).toEqual({
      id: aboutPageMock.id,
      title: aboutPageMock.title,
      description: aboutPageMock.description,
      avatar_url: null,
      avatar_alt: null,
      user_id: aboutPageMock.userId,
    });
  });

  it("Should not insert about page with unique id", async () => {
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
    await createAboutPage(aboutPageMock);
    await expect(createAboutPage(aboutPageMock)).rejects.toThrowError(
      /unique/i
    );
  });

  it("Should not insert about page with unique userId", async () => {
    const userId = randomUUID();
    const aboutPageMock = {
      title: generateString(),
      description: generateString(),
      skills: [generateString()],
      userId,
    };
    await createAboutPage(aboutPageMock);
    await expect(createAboutPage(aboutPageMock)).rejects.toThrowError(
      /unique/i
    );
  });

  it("should get a about page by userId", async () => {
    const aboutPageMock = {
      title: generateString(),
      description: generateString(),
      skills: [`a${generateString()}`, `b${generateString()}`].sort(),
      userId: generateString(),
    };
    await createAboutPage(aboutPageMock);
    const produced = await getAboutPage(aboutPageMock.userId);
    const expected = {
      id: produced.id,
      avatarURL: null,
      avatarALT: null,
      ...aboutPageMock,
    };

    expect(expected).toEqual(produced);
  });

  it("should update about page and skills", async () => {
    const id = randomUUID();
    const aboutPageMock = {
      id,
      title: generateString(),
      description: generateString(),
      skills: [generateString(), generateString(), generateString()],
      userId: generateString(),
    };
    await createAboutPage(aboutPageMock);
    const newAboutPageMock: AboutPageProps = {
      id,
      title: `new title - ${generateString()}`,
      description: `new description - ${generateString()}`,
      skills: [
        generateString(),
        generateString(),
        generateString(),
        generateString(),
        generateString(),
      ],
      avatarURL: generateString(),
      avatarALT: generateString(),
      userId: aboutPageMock.userId,
    };
    await updateAboutPage(newAboutPageMock);
    const db = await database();
    const newAboutPage = await db.one(
      "select * from aboutPages where user_id = $1",
      [aboutPageMock.userId]
    );

    expect(newAboutPage).toEqual({
      id,
      title: newAboutPageMock.title,
      description: newAboutPageMock.description,
      avatar_url: newAboutPageMock.avatarURL,
      avatar_alt: newAboutPageMock.avatarALT,
      user_id: aboutPageMock.userId,
    });
  });

  it("should delete about page and skills", async () => {
    // create a abouPage for delete
    const aboutPageMock = {
      id: generateString(),
      title: generateString(),
      description: generateString(),
      skills: [generateString(), generateString(), generateString()],
      userId: generateString(),
    };
    await createAboutPage(aboutPageMock);

    // verify created aboutPage
    const createdAboutPage = await db.manyOrNone(
      "select * from aboutPages where user_id = $1",
      [aboutPageMock.userId]
    );
    expect(createdAboutPage).toEqual([
      {
        id: aboutPageMock.id,
        title: aboutPageMock.title,
        description: aboutPageMock.description,
        avatar_url: null,
        avatar_alt: null,
        user_id: aboutPageMock.userId,
      },
    ]);

    // verify created skills with the same user_id of the aboutPage
    const createdSkills = await db.any(
      "select * from skills where user_id = $1",
      [aboutPageMock.userId]
    );
    const skills = createdSkills.map(skill => skill.title)

    expect(skills.sort()).toEqual(aboutPageMock.skills.sort())

    // delete aboutPage
    await deleteAboutPage(aboutPageMock.userId);

    // search aboutPage by user_id
    const deletedAboutPage = await db.any(
      "select * from aboutPages where user_id = $1",
      [aboutPageMock.userId]
    );

    // search result to have been a zero length
    expect(deletedAboutPage).toHaveLength(0);

    // verify if skills dont have been deleted
    const skillsAfterDelete = await db.any(
      "select * from skills where user_id = $1",
      [aboutPageMock.userId]
    );
    expect(skillsAfterDelete).toHaveLength(3);
  });
});

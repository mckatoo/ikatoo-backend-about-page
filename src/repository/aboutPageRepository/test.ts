import { generateString } from "@/helpers/generate";
import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import database from "../database";
import createAboutPage, { AboutPageRepository } from "./createAboutPage";
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
    };
    await createAboutPage(aboutPageMock);

    const aboutPage = await db.one("select * from aboutPage");

    expect(aboutPage).toEqual({
      title: aboutPageMock.title,
      description: aboutPageMock.description,
      avatar_url: null,
      avatar_alt: null,
    });
  });

  it("should get the about page", async () => {
    const aboutPageMock = {
      title: generateString(),
      description: generateString(),
    };
    await createAboutPage(aboutPageMock);
    const produced = await getAboutPage();

    expect(aboutPageMock).toEqual({
      title: produced.title,
      description: produced.description,
    });
  });

  it("should update about page data", async () => {
    const db = await database();
    const aboutPageMock = {
      title: generateString(),
      description: generateString(),
    };
    await createAboutPage(aboutPageMock);
    const aboutPage = await db.one("select * from aboutPage");

    const newAboutPageMock: AboutPageRepository = {
      title: `new title - ${generateString()}`,
      description: `new description - ${generateString()}`,
      avatarURL: generateString(),
      avatarALT: generateString(),
    };
    await updateAboutPage(newAboutPageMock);
    const newAboutPage = await db.one("select * from aboutPage");

    expect(aboutPage).not.toEqual(newAboutPage);
    expect(aboutPage).toEqual({
      title: aboutPageMock.title,
      description: aboutPageMock.description,
      avatar_url: null,
      avatar_alt: null,
    });
    expect(newAboutPage).toEqual({
      title: newAboutPageMock.title,
      description: newAboutPageMock.description,
      avatar_url: newAboutPageMock.avatarURL,
      avatar_alt: newAboutPageMock.avatarALT,
    });
  });

  it("should delete about page data", async () => {
    // create a abouPage for delete
    const aboutPageMock = {
      title: generateString(),
      description: generateString(),
    };
    await createAboutPage(aboutPageMock);

    // verify created aboutPage
    const createdAboutPage = await db.oneOrNone("select * from aboutPage");

    expect(createdAboutPage).toEqual({
      title: aboutPageMock.title,
      description: aboutPageMock.description,
      avatar_url: null,
      avatar_alt: null,
    });

    // delete aboutPage
    await deleteAboutPage();

    // search aboutPage by user_id
    const deletedAboutPage = await db.oneOrNone("select * from aboutPage");

    // search result to have been a zero length
    expect(deletedAboutPage).toBeNull();
  });
});

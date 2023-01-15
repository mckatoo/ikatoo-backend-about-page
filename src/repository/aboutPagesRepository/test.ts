import { generateString } from "@/helpers/generate";
import { randomUUID } from "crypto";
import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import database from "../database";
import createAboutPage from "./createAboutPage";
import deleteAboutPage from "./deleteAboutPage";
import getAboutPage, { AboutPageWithID } from "./getAboutPage";
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
      userID: generateString(),
    };
    await createAboutPage(aboutPageMock);

    const aboutPage = await db.one(
      "select * from aboutPages where user_id = $1",
      [aboutPageMock.userID]
    );

    expect(aboutPage).toEqual({
      id: aboutPage.id,
      title: aboutPageMock.title,
      description: aboutPageMock.description,
      avatar_url: null,
      avatar_alt: null,
      user_id: aboutPageMock.userID,
    });
  });

  it("Should not insert about page with unique id", async () => {
    const aboutPageMock = {
      title: generateString(),
      description: generateString(),
      userID: generateString(),
    };
    await createAboutPage(aboutPageMock);
    await expect(createAboutPage(aboutPageMock)).rejects.toThrowError(
      /unique/i
    );
  });

  it("Should not insert about page with unique userID", async () => {
    const userID = randomUUID();
    const aboutPageMock = {
      title: generateString(),
      description: generateString(),
      userID,
    };
    await createAboutPage(aboutPageMock);
    await expect(createAboutPage(aboutPageMock)).rejects.toThrowError(
      /unique/i
    );
  });

  it("should get a about page by userID", async () => {
    const aboutPageMock = {
      title: generateString(),
      description: generateString(),
      userID: generateString(),
    };
    await createAboutPage(aboutPageMock);
    const produced = await getAboutPage(aboutPageMock.userID);
    const expected = {
      id: produced.id,
      avatarURL: null,
      avatarALT: null,
      ...aboutPageMock,
    };

    expect(expected).toEqual(produced);
  });

  it("should update about page data", async () => {
    const db = await database();
    const aboutPageMock = {
      title: generateString(),
      description: generateString(),
      userID: generateString(),
    };
    await createAboutPage(aboutPageMock);
    const aboutPage = await db.one(
      "select * from aboutPages where user_id = $1",
      [aboutPageMock.userID]
    );

    const newAboutPageMock: AboutPageWithID = {
      id: aboutPage.id,
      title: `new title - ${generateString()}`,
      description: `new description - ${generateString()}`,
      avatarURL: generateString(),
      avatarALT: generateString(),
      userID: aboutPageMock.userID,
    };
    await updateAboutPage(newAboutPageMock);
    const newAboutPage = await db.one(
      "select * from aboutPages where user_id = $1",
      [aboutPageMock.userID]
    );

    expect(newAboutPage).toEqual({
      id: aboutPage.id,
      title: newAboutPageMock.title,
      description: newAboutPageMock.description,
      avatar_url: newAboutPageMock.avatarURL,
      avatar_alt: newAboutPageMock.avatarALT,
      user_id: aboutPageMock.userID,
    });
  });

  it("should delete about page data", async () => {
    // create a abouPage for delete
    const aboutPageMock = {
      title: generateString(),
      description: generateString(),
      userID: generateString(),
    };
    await createAboutPage(aboutPageMock);
    const aboutPage = await db.one(
      "select * from aboutPages where user_id = $1",
      [aboutPageMock.userID]
    );

    // verify created aboutPage
    const createdAboutPage = await db.oneOrNone(
      "select * from aboutPages where user_id = $1",
      [aboutPageMock.userID]
    );
    expect(createdAboutPage).toEqual({
        id: aboutPage.id,
        title: aboutPageMock.title,
        description: aboutPageMock.description,
        avatar_url: null,
        avatar_alt: null,
        user_id: aboutPageMock.userID,
      });

    // delete aboutPage
    await deleteAboutPage(aboutPageMock.userID);

    // search aboutPage by user_id
    const deletedAboutPage = await db.oneOrNone(
      "select * from aboutPages where user_id = $1",
      [aboutPageMock.userID]
    );

    // search result to have been a zero length
    expect(deletedAboutPage).toBeNull()
  });
});

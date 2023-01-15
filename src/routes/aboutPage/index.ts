import createAboutPage from "@/repository/aboutPagesRepository/createAboutPage";
import getAboutPage, {
  AboutPageWithID,
} from "@/repository/aboutPagesRepository/getAboutPage";
import updateAboutPage from "@/repository/aboutPagesRepository/updateAboutPage";
import createSkill from "@/repository/skillsRepository/createSkill";
import getSkill, { SkillWithID } from "@/repository/skillsRepository/listSkill";
import { Request, Response, Router } from "express";

export type AboutPageResponse = AboutPageWithID & { skills: SkillWithID[] };

const aboutPageRoute = Router();

aboutPageRoute.post("/about", async (req: Request, res: Response) => {
  const aboutPage: AboutPageResponse = req.body;
  await createAboutPage(aboutPage);

  for await (const skill of aboutPage.skills) {
    await createSkill(skill);
  }

  res.status(201).send();
});

aboutPageRoute.put("/about", async (req: Request, res: Response) => {
  const aboutPage = req.body;
  await updateAboutPage(aboutPage);

  res.status(201).send();
});

aboutPageRoute.get(
  "/about/user_id/:userID",
  async (req: Request, res: Response) => {
    const { userID } = req.params;
    const aboutPage = await getAboutPage(userID);
    const skills = await getSkill(userID);
    const aboutPageResponse: AboutPageResponse = {
      ...aboutPage,
      skills,
    };

    res.status(200).json(aboutPageResponse);
  }
);

export default aboutPageRoute;

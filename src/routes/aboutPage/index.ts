import createAboutPage, {
  AboutPageRepository,
} from "@/repository/aboutPageRepository/createAboutPage";
import getAboutPage from "@/repository/aboutPageRepository/getAboutPage";
import updateAboutPage from "@/repository/aboutPageRepository/updateAboutPage";
import createSkill, {
  SkillRepository,
} from "@/repository/skillsRepository/createSkill";
import listSkill, {
  SkillWithID,
} from "@/repository/skillsRepository/listSkill";
import { Request, Response, Router } from "express";

export type AboutPageResponse = AboutPageRepository & { skills: SkillWithID[] };

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
  const skillsList = await listSkill();
  await updateAboutPage(aboutPage);

  aboutPage.skills.forEach(async (skill: SkillRepository) => {
    const skillExist = skillsList.find(
      (_skill) => _skill.title === skill.title
    );
    if(!skillExist) await createSkill(skill)
  });

  res.status(201).send();
});

aboutPageRoute.get("/about", async (_req: Request, res: Response) => {
  const aboutPage = await getAboutPage();
  const skills = await listSkill();
  const aboutPageResponse: AboutPageResponse = {
    ...aboutPage,
    skills,
  };

  res.status(200).json(aboutPageResponse);
});

export default aboutPageRoute;

import createAboutPage from "@/aboutPagesRepository/createAboutPage";
import getAboutPage from "@/aboutPagesRepository/getAboutPage";
import updateAboutPage from "@/aboutPagesRepository/updateAboutPage";
import { Request, Response, Router } from "express";

const aboutPageRoute = Router();

aboutPageRoute.post("/about", async (req: Request, res: Response) => {
  const aboutPage = req.body;
  await createAboutPage(aboutPage);

  res.status(201).send();
});

aboutPageRoute.put("/about", async (req: Request, res: Response) => {
  const aboutPage = req.body;
  await updateAboutPage(aboutPage);

  res.status(201).send();
});

aboutPageRoute.get(
  "/about/user_id/:userId",
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const aboutPage = await getAboutPage(userId);

    res.status(200).json(aboutPage);
  }
);

export default aboutPageRoute;

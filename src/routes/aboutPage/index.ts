import { Request, Response, Router } from "express";

const aboutPageRoute = Router();

aboutPageRoute.post("/about", async (req: Request, res: Response) => {
  res.status(201).json({ output: "create about page" });
});

aboutPageRoute.put("/about", async (req: Request, res: Response) => {
  res.status(201).json({ output: "update about page" });
});

aboutPageRoute.get(
  "/about/user_id/:userId",
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    res.status(200).json({ output: `get by user id: ${userId}` });
  }
);

export default aboutPageRoute;

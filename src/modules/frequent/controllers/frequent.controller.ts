import { Request, Response } from "express";
import { FrequentService } from "../services/frequent.service";

export class FrequentController {
  private frequentService: FrequentService;

  constructor() {
    this.frequentService = new FrequentService();
  }

  public getAllFrequent = async (req: Request, res: Response) => {
    try {
      const { defixId } = req.body;
      const frequentAll = this.frequentService.getAllFrequentByDefixId(defixId);
      return res.send(frequentAll);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };

  public deleteFrequent = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const resultDelete = await this.frequentService.deleteFrequentById(id);
      if (resultDelete.affected === 0)
        return res.status(400).send({ message: "Frequent not found" });
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };
}

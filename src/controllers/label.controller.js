import Label from "../models/label.model.js";

class LabelController {
  static async getById(req, res) {
    const user = req.user;
    const { id } = req.params;
    const label = await Label.findOne({
      organization_id: user.organization,
      packageId: id,
    });
    if (!label) return res.sendStatus(404);
    return res.json(label);
  }
}

export default LabelController;

import Appointment from "../models/appointment.model.js";

class AppointmentController {
  static async getAll(req, res) {
    const user = req.user;
    const appointments = await Appointment.find({
      organization_id: user.organization,
    });
    return res.json({ appointments });
  }

  static async create(req, res) {
    const user = req.user;
    const { operator, shipments } = req?.body;
    const appointment = await Appointment.create({
      organization_id: user.organization,
      operator,
      shipments,
    });
    await appointment.save();
    return res.sendStatus(201);
  }

  static async delete(req, res) {
    const user = req.user;
    const appointmentId = req?.params.id;
    await Appointment.deleteOne({
      _id: appointmentId,
      organization_id: user.organization,
    });

    return res.sendStatus(200);
  }
}

export default AppointmentController;

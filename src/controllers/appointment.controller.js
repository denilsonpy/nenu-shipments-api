import Appointment from "../models/appointment.model.js";

class AppointmentController {
  static async getAll(req, res) {
    const email = req.user;

    const appointments = await Appointment.find({
      user_email: email,
    });

    return res.json({ appointments });
  }

  static async create(req, res) {
    const email = req.user;
    const operator = req?.body?.operator;
    const shipments = req?.body?.shipments;

    const appointment = await Appointment.create({
      user_email: email,
      operator,
      shipments,
    });
    await appointment.save();

    return res.sendStatus(201);
  }

  static async delete(req, res) {
    const email = req.user;
    const appointmentId = req?.params.id;

    await Appointment.deleteOne({
      _id: appointmentId,
      user_email: email,
    });

    return res.sendStatus(200);
  }
}

export default AppointmentController;

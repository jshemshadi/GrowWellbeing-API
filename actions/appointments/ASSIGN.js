const appointmentModel = require("../../models/Appointment");
const userModel = require("../../models/User");

module.exports = {
  permissions: [permissions.isAdmin, permissions.isStaff],
  inputSchema: {
    appointmentId: {
      type: "string",
      required: true,
    },
    GPId: {
      type: "string",
      required: true,
    },
  },
  exec: async (params, req) => {
    let { user } = req;
    let { appointmentId, GPId } = params;
    const { appointments, users } = db;

    const targetAppointment = await appointments.findOne({
      guid: appointmentId,
    });
    if (!targetAppointment) {
      throw new Error(systemError.appointments.cannotFindAppointment);
    }

    const targetGP = await users.findOne({
      guid: GPId,
      role: userModel.statics.roles.GP,
    });
    if (!targetGP) {
      throw new Error(systemError.users.cannotFindUser);
    }

    // UPDATE THE APPOINTMENT IN DATA BASE
    const now = new Date();

    targetAppointment.updatedAt = now;
    targetAppointment.GPId = GPId;
    targetAppointment.status = appointmentModel.statics.statusType.Assigned;

    const result = await services.appointments.updateAppointment({
      appointment: targetAppointment,
    });
    if (result.modifiedCount === 0) {
      throw new Error(systemError.appointments.cannotUpdateAppointment);
    }

    const {
      createdAt: resultCreatedAt,
      schoolId: resultSchoolId,
      GPId: resultGPId,
      date: resultDate,
      guid: resultGuid,
      DoB: resultDoB,
      contactNumber: resultContactNumber,
      gardianName: resultGardianName,
      fullName: resultFullName,
      address: resultAddress,
      summary: resultSummary,
      status: resultStatus,
    } = targetAppointment;
    return {
      createdAt: resultCreatedAt,
      schoolId: resultSchoolId,
      GPId: resultGPId,
      date: resultDate,
      guid: resultGuid,
      DoB: resultDoB,
      contactNumber: resultContactNumber,
      gardianName: resultGardianName,
      fullName: resultFullName,
      address: resultAddress,
      summary: resultSummary,
      status: resultStatus,
    };
  },
};

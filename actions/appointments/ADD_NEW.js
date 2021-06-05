const appointmentModel = require("../../models/Appointment");

module.exports = {
  permissions: [permissions.isSchool],
  inputSchema: {
    date: {
      type: "date",
      required: true,
    },
    DoB: {
      type: "date",
      required: true,
    },
    contactNumber: {
      type: "string",
      required: true,
    },
    gardianName: {
      type: "string",
      required: true,
    },
    address: {
      type: "string",
      required: true,
    },
    summary: {
      type: "string",
    },
  },
  exec: async (params, req) => {
    let { user } = req;
    let {
      date,
      DoB,
      contactNumber,
      gardianName,
      address,
      summary = "",
    } = params;

    if (new Date(date).getTime() <= new Date().getTime()) {
      throw new Error(systemError.appointments.notValidDate);
    }
    if (new Date(DoB).getTime() >= new Date().getTime()) {
      throw new Error(systemError.appointments.notValidDoB);
    }

    // FIND DUPLICATE APPOINTMENT
    const duplicateAppointment = await services.appointments.findDuplicate({
      date: new Date(date),
      schoolId: user.guid,
    });
    if (duplicateAppointment) {
      throw new Error(systemError.appointments.duplicateAppointment);
    }

    // CREATE NEW APPOINTMENT OBJECT
    const now = new Date();
    const guid = utils.generateGUID();

    const newAppointment = {
      createdAt: now,
      updatedAt: now,
      schoolId: user.guid,
      GPId: "",
      date: new Date(date),
      guid,
      DoB: new Date(DoB),
      contactNumber,
      gardianName,
      address,
      summary,
      status: appointmentModel.statics.statusType.Pending,
    };

    // INSERT THE APPOINTMENT IN DATA BASE
    const result = await services.appointments.addNewAppointment({
      appointment: newAppointment,
    });
    if (result.insertedCount === 0) {
      throw new Error(systemError.appointments.cannotInsertNewAppointment);
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
      address: resultAddress,
      summary: resultSummary,
      status: resultStatus,
    } = result.ops[0];
    return {
      createdAt: resultCreatedAt,
      schoolId: resultSchoolId,
      GPId: resultGPId,
      date: resultDate,
      guid: resultGuid,
      DoB: resultDoB,
      contactNumber: resultContactNumber,
      gardianName: resultGardianName,
      address: resultAddress,
      summary: resultSummary,
      status: resultStatus,
    };
  },
};

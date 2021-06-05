module.exports = {
  // ADD NEW APPOINTMENT
  post_: {
    method: "post",
    action: async (req, res) => {
      const result = await actions.appointments.ADD_NEW.run(req);
      utils.checkStatus({ req, res, result });
    },
  },
  // ASSIGN AN APPOINTMENT
  post_assign: {
    method: "post",
    action: async (req, res) => {
      const result = await actions.appointments.ASSIGN.run(req);
      utils.checkStatus({ req, res, result });
    },
  },

  // GET USER APPOINTMENTS
  get_: {
    method: "get",
    action: async (req, res) => {
      const result = await actions.appointments.GET_APPOINTMENTS.run(req);
      utils.checkStatus({ req, res, result });
    },
  },
  get_getAllAppointments: {
    method: "get",
    action: async (req, res) => {
      const result = await actions.appointments.GET_ALL_APPOINTMENTS.run(req);
      utils.checkStatus({ req, res, result });
    },
  },
};

module.exports = {
  anonymouse: true,
  inputSchema: {
    email: {
      type: "string",
      required: true,
    },
  },
  exec: async (params, req) => {
    const { email } = params;
    const { users } = db;

    // FIND USER
    const targetUser = await users.findOne({ email });
    if (!targetUser) {
      throw new Error(systemError.users.cannotFindUser);
    }

    if (targetUser.status.isTrash) {
      throw new Error(systemError.users.accountWasTrashed);
    }

    if (targetUser.status.isSuspend) {
      throw new Error(systemError.users.accountWasSuspended);
    }

    if (!targetUser.status.isActive) {
      throw new Error(systemError.users.accountIsInActive);
    }

    // CREATE PASSWORD RESET CODE
    const now = new Date();
    const newVerification = utils.generateNewVerificationCode(4);

    targetUser.token.passwordReset.code = newVerification;
    targetUser.token.passwordReset.expiredAt = utils.addHours(
      now,
      Number(env.var.verificationExpireHours)
    );

    // UPDATE USER
    const result = await services.users.updateUser({ user: targetUser });
    if (result.modifiedCount === 0) {
      throw new Error(systemError.users.cannotUpdateUser);
    }

    await mailSender.sendEmail({
      type: "resetPassword",
      subject: "RESET PASSWORD - PASSWORD RESET CODE",
      data: targetUser,
      to: [targetUser.email],
      cc: [],
      bcc: [],
      attachments: [],
    });

    return null;
  },
};

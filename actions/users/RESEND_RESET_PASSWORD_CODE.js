module.exports = {
  anonymouse: true,
  inputSchema: {
    username: {
      type: "string",
      required: true,
    },
  },
  exec: async (params, req) => {
    const { username } = params;
    const { users } = db;

    // FIND USER
    const targetUser = await users.findOne({ username });
    if (!targetUser) {
      throw new Error(systemError.users.cannotFindUser);
    }

    if (targetUser.status.isTrash) {
      throw new Error(systemError.users.accountWasTrashed);
    }

    if (targetUser.status.isSuspend) {
      throw new Error(systemError.users.accountWasSuspended);
    }

    if (targetUser.status.isActive) {
      throw new Error(systemError.users.accountAlreadyActivated);
    }

    const now = new Date();
    const moreThanMaxResendMinutes =
      new Date().getTime() >=
      new Date(
        utils.addMinutes(
          new Date(targetUser.token.passwordReset.lastTry),
          Number(env.var.maxFailedLoginMinutes)
        )
      ).getTime();

    if (moreThanMaxResendMinutes) {
      targetUser.token.passwordReset.count = 1;
      targetUser.token.passwordReset.lastTry = now;
    } else {
      if (
        targetUser.token.passwordReset.count <
        Number(env.var.maxFailedLoginCount)
      ) {
        targetUser.token.passwordReset.count += 1;
        targetUser.token.passwordReset.lastTry = now;
      } else {
        throw new Error(systemError.users.tryAgainInAFewMinutes);
      }
    }

    // CREATE RESET PASSWORD CODE
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
      type: "passwordResetCode",
      subject: "RESET PASSWORD CODE",
      data: targetUser,
      to: [targetUser.email],
      cc: [],
      bcc: [],
      attachments: [],
    });

    return null;
  },
};

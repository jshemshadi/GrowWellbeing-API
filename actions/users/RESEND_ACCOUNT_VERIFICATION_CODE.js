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

    if (targetUser.status.isActive) {
      throw new Error(systemError.users.accountAlreadyActivated);
    }

    const now = new Date();
    const moreThanMaxResendMinutes =
      new Date().getTime() >=
      new Date(
        utils.addMinutes(
          new Date(targetUser.token.verification.lastTry),
          Number(env.var.maxFailedLoginMinutes)
        )
      ).getTime();

    if (moreThanMaxResendMinutes) {
      targetUser.token.verification.count = 1;
      targetUser.token.verification.lastTry = now;
    } else {
      if (
        targetUser.token.verification.count <
        Number(env.var.maxFailedLoginCount)
      ) {
        targetUser.token.verification.count += 1;
        targetUser.token.verification.lastTry = now;
      } else {
        throw new Error(systemError.users.tryAgainInAFewMinutes);
      }
    }

    // CREATE VERIFICATION ACCOUNT CODE
    const newVerification = utils.generateNewVerificationCode(4);

    targetUser.token.verification.code = newVerification;
    targetUser.token.verification.expiredAt = utils.addHours(
      now,
      Number(env.var.verificationExpireHours)
    );

    // UPDATE USER
    const result = await services.users.updateUser({ user: targetUser });
    if (result.modifiedCount === 0) {
      throw new Error(systemError.users.cannotUpdateUser);
    }

    await mailSender.sendEmail({
      type: "accountVerificationCode",
      subject: "ACCOUNT VERIFICATION CODE",
      data: targetUser,
      to: [targetUser.email],
      cc: [],
      bcc: [],
      attachments: [],
    });

    return null;
  },
};

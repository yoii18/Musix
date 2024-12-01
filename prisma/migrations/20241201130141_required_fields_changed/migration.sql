-- AlterTable
ALTER TABLE "UserSchema" ALTER COLUMN "isVerified" DROP NOT NULL,
ALTER COLUMN "verificationCode" DROP NOT NULL,
ALTER COLUMN "isResetPasswordInitiated" DROP NOT NULL,
ALTER COLUMN "resetPasswordOTP" DROP NOT NULL,
ALTER COLUMN "resetPasswordExpiration" DROP NOT NULL;

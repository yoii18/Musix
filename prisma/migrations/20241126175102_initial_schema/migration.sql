-- CreateTable
CREATE TABLE "LikedSongsSchema" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "songName" TEXT NOT NULL,
    "banner" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LikedSongsSchema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SongHistorySchema" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "songName" TEXT NOT NULL,
    "banner" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SongHistorySchema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSchema" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationCode" TEXT NOT NULL DEFAULT '',
    "isResetPasswordInitiated" BOOLEAN NOT NULL DEFAULT false,
    "resetPasswordOTP" TEXT NOT NULL DEFAULT '',
    "resetPasswordExpiration" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSchema_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSchema_username_key" ON "UserSchema"("username");

-- AddForeignKey
ALTER TABLE "LikedSongsSchema" ADD CONSTRAINT "LikedSongsSchema_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserSchema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongHistorySchema" ADD CONSTRAINT "SongHistorySchema_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserSchema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Paper" (
    "id" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "overallBand" DECIMAL(2,1) NOT NULL DEFAULT 0.0,
    "taBand" INTEGER NOT NULL DEFAULT 0,
    "ccBand" INTEGER NOT NULL DEFAULT 0,
    "lrBand" INTEGER NOT NULL DEFAULT 0,
    "grBand" INTEGER NOT NULL DEFAULT 0,
    "studentId" UUID NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student.email_unique" ON "Student"("email");

-- AddForeignKey
ALTER TABLE "Paper" ADD FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

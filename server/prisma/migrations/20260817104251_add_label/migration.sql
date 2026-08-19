/*
  Warnings:

  - You are about to drop the column `color` on the `TaskLabel` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `TaskLabel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[taskId,labelId]` on the table `TaskLabel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `labelId` to the `TaskLabel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaskLabel" DROP COLUMN "color",
DROP COLUMN "name",
ADD COLUMN     "labelId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ProjectLabel" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectLabel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectLabel_projectId_idx" ON "ProjectLabel"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectLabel_projectId_name_key" ON "ProjectLabel"("projectId", "name");

-- CreateIndex
CREATE INDEX "TaskLabel_labelId_idx" ON "TaskLabel"("labelId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskLabel_taskId_labelId_key" ON "TaskLabel"("taskId", "labelId");

-- AddForeignKey
ALTER TABLE "ProjectLabel" ADD CONSTRAINT "ProjectLabel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskLabel" ADD CONSTRAINT "TaskLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "ProjectLabel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "DepartmentEmbeddings" (
    "id" UUID NOT NULL,
    "departmentId" UUID NOT NULL,
    "embedding" vector(3072) NOT NULL,

    CONSTRAINT "DepartmentEmbeddings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentEmbeddings_departmentId_key" ON "DepartmentEmbeddings"("departmentId");

-- AddForeignKey
ALTER TABLE "DepartmentEmbeddings" ADD CONSTRAINT "DepartmentEmbeddings_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

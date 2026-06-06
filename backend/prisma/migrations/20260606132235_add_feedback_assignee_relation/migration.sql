-- AddForeignKey
ALTER TABLE "Feedbacks" ADD CONSTRAINT "Feedbacks_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

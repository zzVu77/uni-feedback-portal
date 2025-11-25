"use client";
import { Loading } from "@/components/common/Loading";
import CommentSection from "@/components/forum/CommentSection";
import FeedbackPostDetail from "@/components/forum/FeedbackPostDetail";
import OfficialResponse from "@/components/forum/OfficialResponse";
import Wrapper from "@/components/shared/Wrapper";
import { useGetForumPostById } from "@/hooks/queries/useForumPostQueries";
import { useIsClient } from "@/hooks/useIsClient";
import { useParams } from "next/navigation";
import React from "react";

const page = () => {
  const params = useParams();
  const id = params.id as string;

  const isClient = useIsClient();
  const { data: feedback, isLoading } = useGetForumPostById(id, {
    enabled: isClient,
  });
  if (isLoading || !feedback) return <Loading variant="spinner" />;
  return (
    <div className="w-full">
      <Wrapper>
        <FeedbackPostDetail data={feedback} />
        <OfficialResponse
          departmentName="Khoa đào tạo Quốc tế"
          responseContent="Cảm ơn bạn đã góp ý. Chúng tôi hiện đang đánh giá tính khả thi của việc kéo dài thời gian hoạt động trong tuần thi cuối kỳ. Chúng tôi đang xem xét một chương trình thí điểm sẽ giữ cho tầng trệt mở cửa 24 giờ trong khi đóng cửa các tầng trên. Chúng tôi sẽ cập nhật cho mọi người về quyết định của mình vào cuối tháng."
          responseDate="20/11/2023"
        />
        <CommentSection />
      </Wrapper>
    </div>
  );
};

export default page;

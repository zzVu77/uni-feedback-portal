import FeedbackPostDetail from "@/components/forum/FeedbackPostDetail";
import OfficialResponse from "@/components/forum/OfficialResponse";
import Wrapper from "@/components/shared/Wrapper";
import React from "react";

const page = () => {
  return (
    <Wrapper>
      <FeedbackPostDetail />
      <OfficialResponse
        departmentName="Khoa đào tạo Quốc tế"
        responseContent="Cảm ơn bạn đã góp ý. Chúng tôi hiện đang đánh giá tính khả thi của việc kéo dài thời gian hoạt động trong tuần thi cuối kỳ. Chúng tôi đang xem xét một chương trình thí điểm sẽ giữ cho tầng trệt mở cửa 24 giờ trong khi đóng cửa các tầng trên. Chúng tôi sẽ cập nhật cho mọi người về quyết định của mình vào cuối tháng."
        responseDate="20/11/2023"
      />
    </Wrapper>
  );
};

export default page;

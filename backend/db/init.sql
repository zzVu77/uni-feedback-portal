-- =================================================================
-- CLEAN UP (Xóa dữ liệu cũ nếu có để tránh lỗi trùng lặp)
-- =================================================================
TRUNCATE TABLE "FileAttachments",
"Messages",
"ClarificationConversations",
"CommentReports",
"Comments",
"Votes",
"ForumPosts",
"ForwardingLogs",
"FeedbackStatusHistory",
"Feedbacks",
"Announcements",
"Users",
"Departments",
"Categories",
"RefreshTokens",
"Notifications" CASCADE;

-- =================================================================
-- STEP 1: CATEGORIES & DEPARTMENTS (Giữ nguyên vì ID đã chuẩn Hex)
-- =================================================================
INSERT INTO
    "Categories" ("id", "name", "isActive")
VALUES (
        'c0000000-0000-0000-0000-000000000001',
        'Cơ sở vật chất',
        true
    ),
    (
        'c0000000-0000-0000-0000-000000000002',
        'Đào tạo & Học vụ',
        true
    ),
    (
        'c0000000-0000-0000-0000-000000000003',
        'Hoạt động ngoại khóa',
        true
    ),
    (
        'c0000000-0000-0000-0000-000000000004',
        'Tác phong giảng viên',
        true
    ),
    (
        'c0000000-0000-0000-0000-000000000005',
        'Học phí & Tài chính',
        true
    ),
    (
        'c0000000-0000-0000-0000-000000000006',
        'An ninh trật tự',
        true
    ),
    (
        'c0000000-0000-0000-0000-000000000007',
        'Góp ý khác',
        true
    );

INSERT INTO
    "Departments" (
        "id",
        "name",
        "email",
        "description",
        "location",
        "phone",
        "createdAt"
    )
VALUES
    -- 1. KHỐI PHÒNG BAN CHỨC NĂNG
    (
        'd0000000-0000-0000-0000-000000000001',
        'Phòng Thanh tra giáo dục',
        'pttgd@hcmute.edu.vn',
        'Thực hiện chức năng thanh tra và giám sát trong lĩnh vực giáo dục, bao gồm giải quyết khiếu nại, tố cáo và đảm bảo tuân thủ quy định. Đồng thời, phòng kiểm soát và ghi nhận thực tế hoạt động giảng dạy theo thời khóa biểu và công tác tổ chức thi, góp phần duy trì kỷ cương và chất lượng đào tạo của nhà trường.',
        'Phòng A1.1003 (tầng 10), Tòa nhà trung tâm',
        '028 3722 1223 ',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000002',
        'Phòng Quan hệ doanh nghiệp',
        'ero@hcmute.edu.vn',
        'Phụ trách các hoạt động hỗ trợ sinh viên trong kết nối với doanh nghiệp và phát triển nghề nghiệp. Đơn vị tư vấn, giới thiệu cơ hội thực tập, việc làm (trong và ngoài nước), việc làm bán thời gian và học bổng; tổ chức các hội thảo, chuyên đề về kỹ năng mềm và định hướng nghề nghiệp. Đồng thời, phòng kết nối sinh viên với doanh nghiệp và cựu sinh viên để chia sẻ kinh nghiệm, hỗ trợ nghiên cứu khoa học, tiếp cận môi trường thực tế, cũng như thực hiện một số thủ tục liên quan đến sinh viên như cấp giấy chứng nhận tốt nghiệp tạm thời.',
        'Phòng A1.402 (tầng 4), Tòa nhà trung tâm',
        '028 3722 5551',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000003',
        'Phòng Khoa học & Công nghệ',
        'khcn@hcmute.edu.vn',
        'Phụ trách các hoạt động liên quan đến nghiên cứu khoa học của sinh viên, bao gồm tư vấn, hướng dẫn tham gia các đề tài, hoạt động học thuật và các cuộc thi khoa học công nghệ trong và ngoài trường. Đồng thời, phòng tổ chức các hội thảo khoa học, sân chơi học thuật và hỗ trợ, giải đáp các vấn đề liên quan đến hoạt động nghiên cứu khoa học, góp phần phát triển năng lực nghiên cứu và sáng tạo của sinh viên.',
        'Phòng A1.902 (tầng 9), Tòa nhà trung tâm',
        '028 3722 1223',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000004',
        'Phòng Quan hệ quốc tế',
        'oia@hcmute.edu.vn',
        'Phụ trách hỗ trợ sinh viên trong các hoạt động hợp tác quốc tế, bao gồm cung cấp thông tin về học bổng, chương trình trao đổi học thuật, văn hóa và thực tập từ các đối tác nước ngoài. Đồng thời, phòng tư vấn và hỗ trợ sinh viên chuẩn bị hồ sơ, thủ tục pháp lý liên quan đến visa và yêu cầu của các cơ quan, đại sứ quán; thiết kế và triển khai các dịch vụ phù hợp với nhu cầu của sinh viên, góp phần thúc đẩy cơ hội học tập và trải nghiệm quốc tế.',
        'Phòng A1.705 (tầng 5), Tòa nhà trung tâm',
        '028 3896 1141 / 028 3722 1223',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000005',
        'Phòng Thiết bị – Vật tư',
        'ptbvt@hcmute.edu.vn',
        'Phụ trách đảm bảo cơ sở vật chất và trang thiết bị phục vụ học tập, bao gồm cung cấp vật tư thực tập cho sinh viên và quản lý, duy trì các thiết bị kỹ thuật trong phòng học như máy chiếu, âm thanh, điều hòa,… nhằm hỗ trợ hiệu quả cho hoạt động giảng dạy và học tập.',
        'Phòng A1.703, A1.704A (tầng 7), Tòa nhà trung tâm',
        '028 3722 1713 / 028 3722 1223',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000006',
        'Phòng hợp tác và phát triển đào tạo',
        'pdtkcq@hcmute.edu.vn và daotatuxa@hcmute.edu.vn ',
        'Phụ trách tổ chức và quản lý các chương trình đào tạo thuộc hệ vừa làm vừa học, đào tạo từ xa,…  ',
        'Phòng A1.406, A1.407 (tầng 4), Tòa nhà trung tâm',
        '028 3722 3504 / 07 0860 2467 / 07 0865 3327',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000007',
        'Phòng Đảm bảo chất lượng',
        'pdbcl@hcmute.edu.vn',
        'Phụ trách đánh giá và kiểm định chất lượng đào tạo trong nhà trường, bao gồm các chương trình đào tạo và hoạt động giảng dạy. Đồng thời, phòng tổ chức khảo sát, đánh giá giảng viên và môi trường học tập, làm việc nhằm nâng cao chất lượng đào tạo và cải tiến liên tục.',
        'Phòng A1.1102 (tầng 11), Tòa nhà trung tâm',
        '028 3722 1223',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000008',
        'Phòng Tổ chức Hành chính',
        'ptchc@hcmute.edu.vn',
        'Phụ trách đảm bảo trật tự, an ninh trong khuôn viên trường và hỗ trợ các công tác hành chính liên quan đến sinh viên. Đơn vị hướng dẫn sinh viên khi cần làm việc với Ban Giám hiệu, đồng thời giải quyết các yêu cầu về văn thư, góp phần duy trì môi trường học tập an toàn và hoạt động hành chính hiệu quả.',
        'Phòng A1.101 (tầng 1), Tòa nhà trung tâm',
        '028 3896 8641 / 028 3722 5142 / 028 3722 1223',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000009',
        'Phòng Quản trị cơ sở vật chất',
        'p.qtcsvc@hcmute.edu.vn',
        'Phụ trách quản lý và đảm bảo các điều kiện cơ sở hạ tầng trong nhà trường, bao gồm hệ thống điện, nước, cảnh quan và môi trường. Đồng thời, phòng hỗ trợ sinh viên trong việc mượn phòng học phục vụ học tập và các hoạt động ngoại khóa, góp phần tạo môi trường học tập thuận lợi và an toàn.',
        'Phòng A1.706; A1.707 (tầng 7), Tòa nhà trung tâm',
        '028 3722 3502 / 028 3722 1223',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000010',
        'Phòng Tuyển sinh và Cộng tác sinh viên',
        'p.cthssv@hcmute.edu.vn',
        'Tư vấn tuyển sinh và truyền thông tuyển sinh; quản lý hồ sơ và dữ liệu sinh viên; thực hiện các chế độ chính sách, học bổng, miễn giảm học phí; tổ chức tuần sinh hoạt công dân và giáo dục chính trị tư tưởng cho sinh viên.',
        'Phòng A1.203; A1.204 (tầng 2), Tòa nhà trung tâm',
        '028 3722 2764 / 028 3722 1223',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000011',
        'Phòng Kế hoạch – Tài chính',
        'phong.khtc@hcmute.edu.vn',
        'Phụ trách quản lý các vấn đề tài chính liên quan đến sinh viên, bao gồm tổ chức thu học phí, hướng dẫn đóng học phí, cấp hóa đơn và xác nhận thanh toán. Đồng thời, phòng thực hiện cấp phát học bổng, trợ cấp xã hội, hỗ trợ khó khăn và các khoản khen thưởng, đảm bảo quyền lợi tài chính cho sinh viên.',
        'Phòng A1.102 (tầng 1); A1.701, A1.702 (tầng 7), Tòa nhà trung tâm',
        '028 3896 2166 / 028 3722 1223',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000012',
        'Phòng Đào tạo',
        'pdt@hcmute.edu.vn',
        'Phụ trách quản lý và tổ chức toàn bộ hoạt động đào tạo của nhà trường, bao gồm xây dựng chương trình đào tạo, lập kế hoạch giảng dạy và quản lý quá trình học tập của sinh viên. Đơn vị tổ chức đăng ký môn học, xếp thời khóa biểu, lịch thi; quản lý điểm số, xử lý kết quả học tập và cấp các loại giấy tờ liên quan. Đồng thời, phòng thực hiện xét cảnh báo học tập, xét tốt nghiệp và tổ chức kiểm tra trình độ ngoại ngữ, đảm bảo quá trình đào tạo diễn ra hiệu quả và đúng quy định.',
        'Phòng A1.201; A1.202 (tầng 2) và A1.401 (tầng 4), Tòa nhà trung tâm',
        '028 3896 1333 / 028 3722 1223',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000013',
        'Phòng Truyền thông',
        'pmo@hcmute.edu.vn',
        'Phụ trách tổ chức và quản lý các hoạt động truyền thông, sự kiện của nhà trường. Đơn vị quản lý các kênh truyền thông như UTE-Studio, UTE-TV, fanpage và các nền tảng mạng xã hội; đồng thời thực hiện quảng bá và quản lý nhận diện thương hiệu, góp phần xây dựng hình ảnh và uy tín của nhà trường.',
        'Phòng A1.1106 (tầng 11), Tòa nhà trung tâm',
        '028 3722 1223',
        NOW()
    ),

-- 2. KHỐI KHOA CHUYÊN MÔN
(
    'd0000000-0000-0000-0000-000000000014',
    'Khoa Xây dựng',
    'fce@hcmute.edu.vn',
    'Đào tạo chuyên sâu các ngành như Kỹ thuật xây dựng (chuyên về thiết kế và thi công công trình dân dụng, công nghiệp), Kỹ thuật công trình giao thông (tập trung xây dựng cầu đường và hạ tầng giao thông), Quản lý xây dựng (đào tạo về quản lý dự án, tiến độ và chi phí công trình), Hệ thống kỹ thuật công trình (liên quan đến các hệ thống kỹ thuật trong tòa nhà như điện, nước, điều hòa không khí - HVAC), Quản lý & vận hành hạ tầng (quản lý, khai thác và bảo trì các hệ thống hạ tầng), Kiến trúc (thiết kế không gian và công trình kiến trúc), và Kiến trúc nội thất (thiết kế, sắp xếp và tổ chức không gian bên trong công trình).',
    'Văn phòng khoa tại Phòng A1.1004 (tầng 10), Tòa nhà trung tâm',
    '028 3897 2092 / 028 3722 1223 / 0837727679',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000015',
    'Khoa Công nghệ Hóa học và Thực phẩm',
    'kcnhtp@hcmute.edu.vn',
    'Đào tạo chuyên sâu các ngành như Công nghệ Kỹ thuật Môi trường (CNKT Môi trường), tập trung vào xử lý ô nhiễm nước, không khí, chất thải, bảo vệ môi trường và phát triển bền vững; Công nghệ Thực phẩm (CN Thực phẩm), chuyên về nghiên cứu chế biến, bảo quản, kiểm định chất lượng và đảm bảo an toàn thực phẩm; và Công nghệ Kỹ thuật Hóa học (CNKT Hóa học), ứng dụng kiến thức hóa học vào sản xuất công nghiệp như hóa chất, vật liệu, dược phẩm và năng lượng.',
    'Văn phòng khoa tại Phòng A1.802 (tầng 8), Tòa nhà trung tâm',
    '028 3722 1223',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000016',
    'Khoa Công nghệ Thông tin',
    'kcntt@hcmute.edu.vn',
    'Đào tạo chuyên sâu các ngành như Công nghệ thông tin (CNTT) với định hướng lập trình, phát triển phần mềm, xây dựng hệ thống web/mobile và ứng dụng; An toàn thông tin tập trung vào bảo mật hệ thống, dữ liệu, phòng chống tấn công mạng và đảm bảo an ninh thông tin; Kỹ thuật dữ liệu chuyên về xử lý, lưu trữ, phân tích dữ liệu lớn và xây dựng hệ thống dữ liệu; cùng với Trí tuệ nhân tạo (AI) hướng đến phát triển các hệ thống thông minh, học máy, nhận dạng và xử lý ngôn ngữ.',
    'Văn phòng khoa tại Phòng A1.304 (tầng 3), Tòa nhà trung tâm',
    '028 3722 1223',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000017',
    'Khoa Cơ khí động lực',
    'ckdl@hcmute.edu.vn',
    'Đào tạo chuyên sâu các ngành như Công nghệ Kỹ thuật Ô tô (CNKT Ô tô) với định hướng thiết kế, vận hành, bảo trì và sửa chữa các hệ thống ô tô; Công nghệ Kỹ thuật Nhiệt (CNKT Nhiệt) tập trung vào các hệ thống nhiệt – lạnh, điều hòa không khí và năng lượng nhiệt; cùng với Năng lượng tái tạo hướng đến khai thác, ứng dụng các nguồn năng lượng sạch như năng lượng mặt trời, gió và sinh khối.',
    'Văn phòng khoa tại Phòng F1.209 (tầng 2), Tòa nhà F1',
    '028 3896 4921 / 028 37221 223',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000018',
    'Khoa Thời trang và Du lịch',
    'fft@hcmute.edu.vn',
    'Đào tạo chuyên sâu các ngành như Công nghệ may với định hướng kỹ thuật may, sản xuất và quản lý quy trình trong ngành may mặc; Thiết kế thời trang tập trung vào sáng tạo, thiết kế trang phục và phát triển xu hướng thời trang; Quản trị Nhà hàng và Dịch vụ ăn uống chuyên về quản lý, vận hành nhà hàng, dịch vụ ẩm thực và chăm sóc khách hàng; Kinh tế gia đình / Kỹ thuật Nữ công hướng đến kỹ năng quản lý gia đình, dinh dưỡng, tiêu dùng và tổ chức đời sống; cùng với Công nghệ Vật liệu Dệt may tập trung nghiên cứu, sản xuất và ứng dụng các loại vật liệu, sợi, vải trong ngành dệt may.',
    'Văn phòng khoa tại Khu A (đối diện cửa Hội trường lớn)',
    '028 3896 6840 / 028 3722 1223',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000019',
    'Khoa Điện – Điện tử',
    'kddt@hcmute.edu.vn',
    'Đào tạo chuyên sâu các ngành như Công nghệ Kỹ thuật Điện, Điện tử (CNKT Điện, Điện tử) với định hướng thiết kế, vận hành hệ thống điện và các thiết bị điện – điện tử; Công nghệ Kỹ thuật Điện tử - Viễn thông (CNKT Điện tử - Viễn thông) tập trung vào hệ thống truyền thông, tín hiệu, mạng viễn thông và thiết bị điện tử; Công nghệ Kỹ thuật Máy tính (CNKT Máy tính) chuyên về phần cứng máy tính, hệ thống nhúng và tích hợp phần mềm – phần cứng; Công nghệ Kỹ thuật Điều khiển và Tự động hóa (CNKT Điều khiển và Tự động hóa) hướng đến điều khiển hệ thống tự động, robot và dây chuyền sản xuất; Kỹ thuật y sinh (Điện tử y sinh) tập trung ứng dụng điện tử trong thiết bị y tế và chăm sóc sức khỏe; cùng với Hệ thống nhúng và IoT chuyên về phát triển thiết bị thông minh, hệ thống nhúng và kết nối Internet vạn vật.',
    'Văn phòng khoa tại tầng trệt Khu D',
    '028 3896 0985 / 028 3722 1223',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000020',
    'Khoa Cơ khí Chế tạo máy',
    'kckctm@hcmute.edu.vn',
    'Đào tạo chuyên sâu các ngành như Công nghệ Chế tạo máy với định hướng gia công, chế tạo chi tiết máy và sản xuất cơ khí; Công nghệ Kỹ thuật Cơ điện tử (CNKT Cơ điện tử) tập trung tích hợp cơ khí, điện – điện tử và điều khiển tự động; Công nghệ Kỹ thuật Cơ khí (CNKT Cơ khí) chuyên về thiết kế, phân tích và vận hành các hệ thống cơ khí; Robot và Trí tuệ nhân tạo hướng đến phát triển robot thông minh và ứng dụng AI trong tự động hóa; Kỹ thuật công nghiệp tập trung tối ưu quy trình sản xuất, quản lý vận hành và nâng cao năng suất; cùng với Kỹ nghệ gỗ và nội thất chuyên về thiết kế, chế tạo các sản phẩm gỗ và nội thất.',
    'Văn phòng khoa tại E1.107 (tầng 1) Khu Công nghệ cao',
    '028 3896 0986 / 028 3722 1223',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000021',
    'Khoa Chính trị và Luật',
    'kctl@hcmute.edu.vn',
    'Đào tạo chuyên sâu các ngành như Ngành Luật, tập trung trang bị kiến thức pháp luật, hệ thống pháp lý và kỹ năng hành nghề luật; đồng thời đảm nhiệm quản lý và giảng dạy các môn Khoa học lý luận chính trị, Khoa học Xã hội và Nhân văn, góp phần bồi dưỡng nền tảng tư tưởng, nhận thức xã hội và kỹ năng học thuật cho người học.',
    'Văn phòng khoa tại Phòng A1.906 (tầng 9), Tòa nhà trung tâm',
    '028 3722 1223',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000022',
    'Khoa khoa học Ứng dụng',
    'kkhud@hcmute.edu.vn',
    'Đào tạo chuyên sâu các ngành như Công nghệ Vật liệu, tập trung nghiên cứu, chế tạo và ứng dụng các loại vật liệu trong công nghiệp và đời sống; đồng thời đảm nhiệm quản lý và giảng dạy các môn Khoa học cơ bản trong toàn trường, góp phần xây dựng nền tảng kiến thức khoa học cho sinh viên ở nhiều lĩnh vực đào tạo.',
    'Văn phòng khoa tại Phòng A1.404 (tầng 4), Tòa nhà trung tâm',
    '028 3722 1223',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000023',
    'Khoa In & Truyền thông',
    'kitt@hcmute.edu.vn',
    'Đào tạo chuyên sâu các ngành như Công nghệ Kỹ thuật In, tập trung vào kỹ thuật in ấn, công nghệ sản xuất và quản lý quy trình in; cùng với Thiết kế Đồ họa, hướng đến sáng tạo hình ảnh, truyền thông thị giác và thiết kế các sản phẩm đồ họa.',
    'Văn phòng khoa tại Phòng A1.903; A1.904 (tầng 9), Tòa nhà trung tâm',
    '028 3896 9339 / 028 3722 1223',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000024',
    'Khoa Ngoại ngữ',
    'knn@hcmute.edu.vn',
    'Đào tạo chuyên sâu các ngành như Sư phạm Tiếng Anh, tập trung vào giảng dạy tiếng Anh, phương pháp sư phạm và kỹ năng giáo dục; cùng với Ngôn ngữ Anh, hướng đến phát triển khả năng sử dụng tiếng Anh trong giao tiếp, biên – phiên dịch và làm việc trong môi trường quốc tế.',
    'Văn phòng khoa tại Phòng F1.308 (tầng 3), Tòa nhà F1',
    '028 38722 5550 / 028 3722 1223',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000025',
    'Khoa Kinh tế',
    'kkt@hcmute.edu.vn',
    'Đào tạo chuyên sâu các ngành như Quản lý công nghiệp, tập trung vào quản lý sản xuất, vận hành và tối ưu quy trình trong doanh nghiệp; Kế toán với định hướng ghi chép, phân tích tài chính và quản lý sổ sách kế toán; Thương mại điện tử chuyên về kinh doanh trực tuyến, marketing số và vận hành các nền tảng số; Logistics và Quản lý chuỗi cung ứng hướng đến vận chuyển, lưu kho và tối ưu dòng chảy hàng hóa; cùng với Kinh doanh Quốc tế tập trung vào hoạt động kinh doanh xuyên biên giới và thị trường toàn cầu.',
    'Văn phòng khoa tại Phòng A1.306 (tầng 3), Tòa nhà trung tâm',
    '028 3722 5551 / 028 3722 1223',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000026',
    'Khoa Đào tạo Quốc tế',
    'fie@hcmute.edu.vn',
    'Đào tạo chuyên sâu các ngành như Công nghệ Kỹ thuật Điện, Điện tử, Công nghệ Kỹ thuật Điện tử - Viễn thông, Công nghệ Kỹ thuật Máy tính, Công nghệ Kỹ thuật Điều khiển và Tự động hóa, Công nghệ Chế tạo máy, Công nghệ Kỹ thuật Cơ điện tử, Công nghệ Kỹ thuật Cơ khí, Công nghệ Kỹ thuật Công trình xây dựng, Công nghệ Kỹ thuật Ô tô, Công nghệ Kỹ thuật Nhiệt, Công nghệ Thông tin, Quản lý công nghiệp và Công nghệ Thực phẩm; các chương trình đều tập trung đào tạo kiến thức chuyên môn gắn với thực tiễn, phát triển kỹ năng nghề nghiệp và đặc biệt được giảng dạy bằng tiếng Anh, giúp sinh viên nâng cao năng lực hội nhập và đáp ứng tốt yêu cầu của thị trường lao động trong nước và quốc tế.',
    'Văn phòng khoa tại Phòng F1.707 (tầng 7), Tòa nhà F1',
    '028 3722 5221 / 028 3722 1223',
    NOW()
),

-- 3. TRUNG TÂM VÀ VIỆN NGHIÊN CỨU
(
    'd0000000-0000-0000-0000-000000000027',
    'Trung tâm Dịch vụ',
    'ttdvsv@hcmute.edu.vn',
    'Phụ trách quản lý các dịch vụ có thu trong nhà trường như bãi xe, căn tin…; Thường xuyên tổ chức kiểm tra chất lượng dịch vụ; Tiếp nhận, xử lý các phản hồi từ SV về các dịch vụ trong trường.',
    'Phòng A5.104 (tầng 1) Khu A5, Tòa nhà trung tâm',
    '0902 325 413',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000028',
    'Trung tâm Dạy học số',
    'dlc@hcmute.edu.vn',
    'Phụ trách tổ chức các khóa học trực tuyến và hỗ trợ SV tham gia các khóa học trực tuyến.',
    'Văn phòng: F1.607; Phòng học số: F1.608, F1.609 (tầng 6) Khu F1',
    '(+84 -028) 37221223 – 8425 / 0911 910489',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000029',
    'Trung tâm Thông tin – Máy tính',
    'ic@hcmute.edu.vn',
    'Phụ trách quản lý và hỗ trợ các hệ thống công nghệ thông tin phục vụ sinh viên, bao gồm cấp và quản lý email trường, tài khoản đăng nhập hệ thống trực tuyến, cũng như hỗ trợ cấp lại mật khẩu khi cần thiết. Đồng thời, trung tâm quản lý các phòng máy tính, đảm bảo phục vụ hiệu quả cho học tập và sử dụng công nghệ của sinh viên.',
    'Phòng A5.101 (tầng 1 – Khu A5); A1.1107 (tầng 11), Tòa nhà trung tâm',
    '028 3722 1223 / 0913 889 739 (T. Hà)',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000030',
    'Trung tâm Giáo dục thể chất',
    'ttgdtc@hcmute.edu.vn',
    'Phụ trách tổ chức giảng dạy các môn thể chất, hướng dẫn sinh viên thực hiện thủ tục miễn giảm khi cần thiết. Đồng thời, trung tâm quản lý các câu lạc bộ thể thao, tư vấn rèn luyện, cung cấp thông tin về các giải đấu và tổ chức các hội thao, hoạt động thi đấu trong trường, góp phần nâng cao sức khỏe và đời sống tinh thần cho sinh viên.',
    'Văn phòng: Khu E',
    '0903 624 005 / 0969 729 841',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000031',
    'Trung tâm Giáo dục Quốc phòng và An ninh',
    'ttgdqpan@hcmute.edu.vn',
    'Phụ trách xếp thời khóa biểu, tổ chức giảng dạy môn học, miễn giảm, xét cấp chứng chỉ, phát chứng chỉ cho môn học giáo dục quốc phòng và an ninh.',
    'Văn phòng:  
        + Cơ sở 1:  Phòng bảo vệ Khu A 
        + Cơ sở 2: Phòng Q101, Q105; 484 Lê Văn Việt, P. Tăng Nhơn Phú A, TP. Thủ Đức. TP. HCM. ',
    '0909 342 362',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000032',
    'Trung tâm Sáng tạo - Khởi nghiệp',
    'cis@hcmute.edu.vn',
    'Phụ trách hỗ trợ SV trong các hoạt động khởi nghiệp, tham gia các cuộc thi sáng tạo….',
    'Văn phòng tại Không gian sáng tạo Maker Space',
    '0989 558 076 (Thầy Chiến)',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000033',
    'Trung tâm Phát triển ngôn ngữ',
    'cell.svspkt@hcmute.edu.vn',
    'Phụ trách đào tạo và bồi dưỡng các chương trình ngoại ngữ và nghiệp vụ ngôn ngữ cho sinh viên và người học. Đơn vị tổ chức các kỳ thi đánh giá năng lực tiếng Anh, đồng thời triển khai và quản lý các chương trình ngôn ngữ khác theo nhu cầu, góp phần nâng cao năng lực ngoại ngữ cho người học.',
    'Tầng hầm - Tòa nhà Trung tâm',
    '028 3896 4575 / 0765 080 182',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000034',
    'Trung tâm Tin học',
    'ttth@hcmute.edu.vn',
    'Phụ trách đào tạo các khóa Tin học ứng dụng (Văn phòng, vẽ Kỹ thuật, vẽ Mỹ thuật), các khóa lập trình. Đào tạo, tổ chức thi và cấp chứng chỉ Ứng dụng CNTT quốc gia.',
    'Văn phòng Trung tâm tại Cổng khu E',
    '0908 277 911',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000035',
    'Trung tâm Việt Nhật',
    'vjec@hcmute.edu.vn',
    'Phụ trách đào tạo tiếng Nhật và các kỹ năng liên quan cho sinh viên, bao gồm cả chương trình theo nhu cầu doanh nghiệp. Đơn vị tổ chức đào tạo kỹ năng mềm, tác phong công nghiệp và văn hóa Nhật Bản; đồng thời tư vấn hướng nghiệp, giới thiệu việc làm, kết nối thực tập với doanh nghiệp Nhật và hỗ trợ tư vấn du học tại Nhật Bản, góp phần mở rộng cơ hội học tập và nghề nghiệp cho sinh viên.',
    'Tầng hầm - Tòa nhà Trung tâm',
    '0963 512 513 / 0934 1818 13',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000036',
    'Trung tâm Kỹ thuật tổng hợp',
    'ttkt@hcmute.edu.vn',
    'Phụ trách tổ chức các khóa bồi dưỡng và tổ chức sát hạch giấy phép lái xe mô tô, ô tô cho SV và cán bộ trường.',
    'Văn phòng Trung tâm tại Cổng khu E',
    '0913 74 84 04 (Thầy Quang)',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000037',
    'Văn phòng Đảng ủy trường',
    'danguytruong@hcmute.edu.vn',
    'Phụ trách quản lý công tác Đảng vụ; hồ sơ Đảng viên tại trường.',
    'Phòng A1.1001 (tầng 1), Tòa nhà trung tâm',
    '023 3722 1223 / 09 1406 7489',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000038',
    'Viện Sư phạm kỹ thuật',
    'vienspkt@hcmute.edu.vn',
    'Sư phạm Công nghệ: Tập trung giảng dạy kỹ thuật – công nghệ và phương pháp giáo dục trong lĩnh vực công nghệ. Tâm lý học Giáo dục: Tập trung nghiên cứu tâm lý người học và ứng dụng trong giảng dạy, giáo dục.',
    'Văn phòng tại ITE.105, Tòa nhà Đa năng - Số 484, đường Lê Văn Việt, P. Tăng Nhơn Phú A, TP. Thủ Đức, TP. Hồ Chí Minh',
    '09 7319 5051 (cô Như Khương) / 09 0368 6912 (thầy Bùi Văn Hồng)',
    NOW()
),

-- 4. ĐOÀN THỂ VÀ ĐƠN VỊ PHỤC VỤ
(
    'd0000000-0000-0000-0000-000000000039',
    'Đoàn trường & Hội Sinh viên trường',
    'doantruong@hcmute.edu.vn; hoisinhvien@hcmute.edu.vn',
    'Phụ trách tổ chức và quản lý các hoạt động phong trào, tình nguyện và hỗ trợ sinh viên trong toàn trường. Đơn vị quản lý hồ sơ Đoàn viên, Hội viên; tổ chức các chương trình rèn luyện, phát triển kỹ năng, hỗ trợ học tập và khởi nghiệp. Đồng thời, góp phần định hướng, bồi dưỡng và tạo điều kiện cho sinh viên phấn đấu, phát triển toàn diện và tham gia vào các hoạt động xã hội.',
    'Khu A, cạnh Thư viện',
    '028 3896 3043 / 028 3722 1223',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000040',
    'Trạm Y tế',
    'yte@hcmute.edu.vn',
    'Phụ trách chăm sóc sức khỏe ban đầu cho sinh viên, bao gồm khám, tư vấn và hỗ trợ các vấn đề y tế. Đơn vị hướng dẫn tham gia bảo hiểm y tế và đảm bảo quyền lợi liên quan, đồng thời tổ chức các hoạt động tuyên truyền về sức khỏe học đường. Bên cạnh đó, trạm phối hợp xử lý các vấn đề về vệ sinh và an toàn thực phẩm trong nhà trường.',
    'Văn phòng ở cuối Khu B; gần cổng B',
    '028 3722 1223 / 091 888 3925',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000041',
    'Thư viện',
    'thuvien@hcmute.edu.vn',
    'Phụ trách cung cấp và hỗ trợ khai thác nguồn tài nguyên học tập cho sinh viên, bao gồm giáo trình, tài liệu tham khảo và các nguồn học liệu khác. Đơn vị thực hiện dịch vụ mượn – trả tài liệu, đồng thời hướng dẫn sinh viên sử dụng hiệu quả các nguồn thông tin như sách, tiêu chuẩn, luận văn, luận án và đề tài nghiên cứu khoa học, phục vụ cho học tập và nghiên cứu.',
    'Thư viện khu A: Phòng Đọc, Phòng Mượn; Thư viện Tầng hầm tòa nhà trung tâm: Phòng Đọc Beehive (Reading Room Beehive); ',
    ' 028 3896 9920 / 028 3722 1223',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000042',
    'Ban Quản lý ký túc xá',
    'bqlktx@hcmute.edu.vn',
    'Phụ trách giải quyết các nhu cầu về nội trú cho SV, quản lý SV nội trú theo Quy chế SV nội trú,...',
    'Văn phòng tại tầng trệt Ký túc xá khu D (đường Lê Văn Chí) và tầng trệt Ký túc xá cơ sở 2 (484 Lê Văn Việt, P. Tăng Nhơn Phú A, TP. Thủ Đức) ',
    '028 3897 3082 / 028 3722 1223',
    NOW()
);

-- =================================================================
-- STEP 2: USERS (Admin, Staff, Students)
-- FIX: Dùng ID Hex hợp lệ (a... cho Admin, b... cho Staff, e... cho Student)
-- =================================================================

-- Admin (a000...)
INSERT INTO
    "Users" (
        "id",
        "fullName",
        "password",
        "email",
        "role",
        "departmentId",
        "createdAt"
    )
VALUES (
        'a0000000-0000-0000-0000-999999999999',
        'Quản Trị Viên Hệ Thống',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'admin@uni.edu.vn',
        'ADMIN',
        NULL,
        NOW()
    );

-- Staff (b000...)
INSERT INTO
    "Users" (
        "id",
        "fullName",
        "password",
        "email",
        "role",
        "departmentId",
        "createdAt"
    )
VALUES (
        'b0000000-0000-0000-0000-000000000001',
        'Cán bộ Thanh tra',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'staff.thanhtra@uni.edu.vn',
        'DEPARTMENT_STAFF',
        'd0000000-0000-0000-0000-000000000001',
        NOW()
    ),
    ('b0000000-0000-0000-0000-000000000002', 'Cán bộ Quan hệ Doanh nghiệp', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.qhdn@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000002', NOW()),
    ('b0000000-0000-0000-0000-000000000003', 'Cán bộ Khoa học Công nghệ',    '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.khcn@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000003', NOW()),
    ('b0000000-0000-0000-0000-000000000004', 'Cán bộ Quan hệ Quốc tế',       '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.qhqt@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000004', NOW()),
    ('b0000000-0000-0000-0000-000000000005', 'Cán bộ Thiết bị Vật tư',       '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.tbvt@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000005', NOW()),
    ('b0000000-0000-0000-0000-000000000006', 'Cán bộ Hợp tác Đào tạo',       '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.htdt@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000006', NOW()),
    ('b0000000-0000-0000-0000-000000000007', 'Cán bộ Đảm bảo Chất lượng',    '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.dbcl@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000007', NOW()),
    ('b0000000-0000-0000-0000-000000000008', 'Cán bộ Tổ chức Hành chính',    '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.tchc@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000008', NOW()),
    (
        'b0000000-0000-0000-0000-000000000009',
        'Cán bộ Quản trị CSVC',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'staff.qtcsvc@uni.edu.vn',
        'DEPARTMENT_STAFF',
        'd0000000-0000-0000-0000-000000000009',
        NOW()
    ),
    (
        'b0000000-0000-0000-0000-000000000010',
        'Chuyên viên CTSV',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'staff.ctsv@uni.edu.vn',
        'DEPARTMENT_STAFF',
        'd0000000-0000-0000-0000-000000000010',
        NOW()
    ),
    (
        'b0000000-0000-0000-0000-000000000011',
        'Kế toán viên',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'staff.khtc@uni.edu.vn',
        'DEPARTMENT_STAFF',
        'd0000000-0000-0000-0000-000000000011',
        NOW()
    ),
    (
        'b0000000-0000-0000-0000-000000000012',
        'Giáo vụ Đào tạo',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'staff.pdt@uni.edu.vn',
        'DEPARTMENT_STAFF',
        'd0000000-0000-0000-0000-000000000012',
        NOW()
    ),
    ('b0000000-0000-0000-0000-000000000013', 'Cán bộ Truyền thông',           '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.tt@uni.edu.vn',   'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000013', NOW()),
    ('b0000000-0000-0000-0000-000000000014', 'Giáo vụ Khoa Xây dựng',        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.xd@uni.edu.vn',   'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000014', NOW()),
    ('b0000000-0000-0000-0000-000000000015', 'Giáo vụ Khoa Hóa Thực phẩm',   '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.htp@uni.edu.vn',  'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000015', NOW()),
    (
        'b0000000-0000-0000-0000-000000000016',
        'Giáo vụ Khoa CNTT',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'staff.fit@uni.edu.vn',
        'DEPARTMENT_STAFF',
        'd0000000-0000-0000-0000-000000000016',
        NOW()
    ),
    ('b0000000-0000-0000-0000-000000000017', 'Giáo vụ Khoa Cơ khí Động lực', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.ckdl@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000017', NOW()),
    ('b0000000-0000-0000-0000-000000000018', 'Giáo vụ Khoa Thời trang Du lịch','$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC','staff.ttdl@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000018', NOW()),
    ('b0000000-0000-0000-0000-000000000019', 'Giáo vụ Khoa Điện Điện tử',    '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.ddt@uni.edu.vn',  'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000019', NOW()),
    ('b0000000-0000-0000-0000-000000000020', 'Giáo vụ Khoa Cơ khí CTM',      '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.ctm@uni.edu.vn',  'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000020', NOW()),
    ('b0000000-0000-0000-0000-000000000021', 'Giáo vụ Khoa Chính trị Luật',  '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.ctl@uni.edu.vn',  'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000021', NOW()),
    ('b0000000-0000-0000-0000-000000000022', 'Giáo vụ Khoa KH Ứng dụng',     '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.khud@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000022', NOW()),
    ('b0000000-0000-0000-0000-000000000023', 'Giáo vụ Khoa In Truyền thông', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',  'staff.itt@uni.edu.vn',  'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000023', NOW()),
    ('b0000000-0000-0000-0000-000000000024', 'Giáo vụ Khoa Ngoại ngữ',       '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.nn@uni.edu.vn',   'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000024', NOW()),
    ('b0000000-0000-0000-0000-000000000025', 'Giáo vụ Khoa Kinh tế',         '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.kt@uni.edu.vn',   'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000025', NOW()),
    ('b0000000-0000-0000-0000-000000000026', 'Giáo vụ Khoa Đào tạo QT',      '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.dtqt@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000026', NOW()),
    (
        'b0000000-0000-0000-0000-000000000027',
        'NV Dịch vụ sinh viên',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'staff.dvsv@uni.edu.vn',
        'DEPARTMENT_STAFF',
        'd0000000-0000-0000-0000-000000000027',
        NOW()
    ),
    (
        'b0000000-0000-0000-0000-000000000028',
        'NV Dạy học số',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'staff.elearning@uni.edu.vn',
        'DEPARTMENT_STAFF',
        'd0000000-0000-0000-0000-000000000028',
        NOW()
    ),
    (
        'b0000000-0000-0000-0000-000000000029',
        'Kỹ thuật viên TTMT',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'staff.ttmt@uni.edu.vn',
        'DEPARTMENT_STAFF',
        'd0000000-0000-0000-0000-000000000029',
        NOW()
    ),
    (
        'b0000000-0000-0000-0000-000000000030',
        'Giảng viên GDTC',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'staff.gdtc@uni.edu.vn',
        'DEPARTMENT_STAFF',
        'd0000000-0000-0000-0000-000000000030',
        NOW()
    ),
    ('b0000000-0000-0000-0000-000000000031', 'Cán bộ GDQP An ninh',          '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.gdqp@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000031', NOW()),
    ('b0000000-0000-0000-0000-000000000032', 'Cán bộ Sáng tạo Khởi nghiệp',  '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.stkn@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000032', NOW()),
    ('b0000000-0000-0000-0000-000000000033', 'Cán bộ Phát triển Ngôn ngữ',   '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.ptnn@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000033', NOW()),
    ('b0000000-0000-0000-0000-000000000034', 'Cán bộ Trung tâm Tin học',     '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.ttth@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000034', NOW()),
    ('b0000000-0000-0000-0000-000000000035', 'Cán bộ Trung tâm Việt Nhật',   '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.vn@uni.edu.vn',   'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000035', NOW()),
    ('b0000000-0000-0000-0000-000000000036', 'Cán bộ Kỹ thuật Tổng hợp',    '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.ktth@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000036', NOW()),
    ('b0000000-0000-0000-0000-000000000037', 'Cán bộ Đảng ủy',               '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.duy@uni.edu.vn',  'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000037', NOW()),
    ('b0000000-0000-0000-0000-000000000038', 'Cán bộ Viện SP Kỹ thuật',      '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.vspkt@uni.edu.vn','DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000038', NOW()),
    ('b0000000-0000-0000-0000-000000000039', 'Cán bộ Đoàn Hội SV',           '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.dhsv@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000039', NOW()),
    ('b0000000-0000-0000-0000-000000000040', 'Cán bộ Y tế',                  '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.yte@uni.edu.vn',  'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000040', NOW()),
    ('b0000000-0000-0000-0000-000000000041', 'Thủ thư Thư viện',             '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.thuvien@uni.edu.vn','DEPARTMENT_STAFF','d0000000-0000-0000-0000-000000000041', NOW()),
    ('b0000000-0000-0000-0000-000000000042', 'Quản lý KTX',                  '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.ktx@uni.edu.vn',  'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000042', NOW());

-- Students (e000... - viết tắt Education, vì 'stud' chứa s,t,u là sai hex)
INSERT INTO
    "Users" (
        "id",
        "fullName",
        "password",
        "email",
        "role",
        "departmentId",
        "createdAt"
    )
VALUES (
        'e0000000-0000-0000-0000-000000000001',
        'Nguyễn Văn An',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv01@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000002',
        'Trần Thị Bích',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv02@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000003',
        'Lê Hoàng Cường',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv03@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000004',
        'Phạm Minh Dũng',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv04@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000005',
        'Hoàng Thu Trang',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv05@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000006',
        'Vũ Văn Long',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv06@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000010',
        'Ngô Văn Kiên',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv10@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000011',
        'Dương Thị Lan',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv11@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000012',
        'Lý Văn Nam',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv12@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000013',
        'Trịnh Thu Nga',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv13@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000014',
        'Mai Văn Phúc',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv14@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000015',
        'Đinh Thị Quyên',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv15@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000016',
        'Lâm Văn Sơn',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv16@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000017',
        'Phan Thanh Tâm',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv17@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000020',
        'Hà Văn Tùng',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv20@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000021',
        'Trương Thị Uyên',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv21@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000022',
        'Nguyễn Đức Vinh',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv22@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000030',
        'Đỗ Văn Giang',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv30@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000031',
        'Ngô Thị Hà',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv31@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000032',
        'Dương Văn Hải',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv32@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000033',
        'Lý Thị Hạnh',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv33@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000040',
        'Vương Văn Lâm',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv40@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000041',
        'Hà Thị Linh',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv41@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000042',
        'Trương Văn Lộc',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv42@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000043',
        'Nguyễn Thị Lý',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'sv43@st.uni.edu.vn',
        'STUDENT',
        NULL,
        NOW()
    );

-- =================================================================
-- STEP 3: FEEDBACKS
-- Users refs: e000...
-- =================================================================
INSERT INTO
    "Feedbacks" (
        "id",
        "subject",
        "description",
        "location",
        "currentStatus",
        "isPrivate",
        "userId",
        "departmentId",
        "categoryId",
        "createdAt"
    )
VALUES (
        'f0000000-0000-0000-0000-000000000001',
        'Phản ánh tình trạng trang thiết bị phòng học ảnh hưởng đến giờ thanh tra',
        'Kính gửi Phòng Thanh tra, hiện nay hệ thống máy chiếu tại giảng đường A101 thường xuyên bị nhấp nháy và mất tín hiệu giữa chừng. Điều này không chỉ gây gián đoạn nghiêm trọng đến tiến độ bài giảng của giảng viên mà còn khiến việc kiểm tra, giám sát chất lượng giờ dạy của đoàn thanh tra gặp nhiều khó khăn. Kính mong nhà trường kiểm tra và nâng cấp sớm.',
        'Tòa nhà A - Phòng A101',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        '2025-11-01 09:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000002',
        'Kiếu nại việc thay đổi thời khóa biểu đột xuất không thông báo',
        'Tôi viết đơn này xin phản ánh về việc môn học Cơ sở dữ liệu đột ngột thay đổi lịch học và phòng học vào sáng nay mà không có bất kỳ thông báo nào trên hệ thống hay email. Nhiều sinh viên vẫn đến phòng cũ và bị lỡ mất buổi học. Kính đề nghị Phòng Thanh tra giáo dục vào cuộc làm rõ trách nhiệm quản lý và kiểm tra lại quy trình cập nhật thời khóa biểu này.',
        NULL,
        'PENDING',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-01 14:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000003',
        'Kiểm tra công tác tổ chức và phân bổ giờ cho hoạt động ngoại khóa',
        'Các hoạt động ngoại khóa hiện tại đang bị trùng lặp quá nhiều vào khung giờ học chính khóa của các khoa công nghệ, dẫn đến việc sinh viên phải phân vân giữa việc đi điểm danh học tập hoặc tham gia phong trào. Kính mong Phòng Thanh tra xem xét, kiểm tra lại việc phân bổ quỹ thời gian này để đảm bảo quyền lợi học tập của sinh viên.',
        'Sân trường',
        'VIOLATED_CONTENT',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-02 10:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000004',
        'Phản ánh tác phong sư phạm và tình trạng đi muộn của giảng viên',
        'Tôi xin phản ánh (ẩn danh) về tình trạng giảng viên phụ trách phòng B201 vào sáng thứ Hai thường xuyên đi trễ từ 15 đến 20 phút mà không có lý do chính đáng, đồng thời nội dung giảng dạy rất sơ sài, chủ yếu cho sinh viên tự đọc slide. Kính mong Phòng Thanh tra giáo dục tăng cường kiểm tra đột xuất khu vực này để chấn chỉnh kỷ cương giảng dạy.',
        'Phòng học B201',
        'RESOLVED',
        true,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000004',
        '2025-11-03 08:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000005',
        'Yêu cầu thanh tra tính minh bạch trong việc thu chi và hoàn trả học phí',
        'Quy trình giải quyết hoàn trả học phí khi sinh viên hủy học phần hiện tại rất mập mờ, thời gian kéo dài nhiều tháng và nhân viên không giải thích rõ ràng. Chúng tôi đề nghị Phòng Thanh tra giáo dục thực hiện chức năng giám sát, thanh tra lại quy trình làm việc của bộ phận tài chính để bảo vệ quyền lợi chính đáng và tài chính của người học.',
        NULL,
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-03 11:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000006',
        'Kiểm tra điều kiện môi trường tự học tại Thư viện Trung tâm',
        'Không gian tự học tại Thư viện Trung tâm đang bị xuống cấp nghiêm trọng, hệ thống điều hòa liên tục hỏng hóc trong thời tiết nắng nóng, sách chuyên khảo quá cũ không được cập nhật. Kính đề nghị bộ phận thanh tra khảo sát thực tế và có biên bản ghi nhận gửi Ban giám hiệu nhằm cải thiện môi trường học tập cho sinh viên.',
        'Thư viện Trung tâm',
        'IN_PROGRESS',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        '2025-11-03 15:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000007',
        'Phản ánh sự cố hệ thống đăng ký học phần gây bất công cho sinh viên',
        'Trong đợt đăng ký tín chỉ vừa qua, cổng thông tin trực tuyến bị sập liên tục khiến nhiều sinh viên năm cuối không thể đăng ký được các môn tiên quyết để ra trường. Đáng nói là có hiện tượng một số tài khoản vẫn vào được và đăng ký bình thường. Đề nghị Phòng Thanh tra tiến hành kiểm tra, rà soát lại tính công bằng và minh bạch của hệ thống này.',
        'Phòng Đào tạo',
        'VIOLATED_CONTENT',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-04 09:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000008',
        'Kiến nghị rà soát chất lượng quản lý của các CLB thể thao tại Nhà thi đấu',
        'Việc quản lý giờ giấc và cơ sở vật chất tại Nhà thi đấu dành cho các hoạt động ngoại khóa đang có dấu hiệu lạm quyền khi ưu tiên cho các đơn vị bên ngoài thuê sân vào giờ sinh hoạt của sinh viên. Kính đề nghị Phòng Thanh tra giáo dục kiểm tra lại hợp đồng và lịch phân bổ để trả lại không gian cho người học.',
        'Nhà Thi đấu',
        'AI_REVIEW_FAILED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-04 13:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000009',
        'Phản ánh thái độ thờ ơ, thiếu nhiệt tình của giảng viên trong giờ thảo luận',
        'Sinh viên phản ánh một số giảng viên trong các tiết bài tập/thảo luận chỉ giao đề bài rồi làm việc riêng, bấm điện thoại, không hề hướng dẫn hay giải đáp thắc mắc của người học. Kính mong Phòng Thanh tra tăng cường công tác giám sát camera phòng học để đánh giá đúng thực tế tác phong và trách nhiệm sư phạm này.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000004',
        '2025-11-05 10:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000010',
        'Đơn kiến nghị làm rõ căn cứ tăng học phí niên độ mới',
        'Nhà trường vừa công bố mức học phí mới tăng đột biến mà không có văn bản giải trình cụ thể về các hạng mục đầu tư tương xứng. Đứng dưới góc độ giám sát tuân thủ quy định pháp luật giáo dục, đề nghị Phòng Thanh tra yêu cầu các bên liên quan công khai minh bạch đề án định mức học phí để toàn thể sinh viên được rõ.',
        'Phòng Tài chính',
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-05 14:50:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000011',
        'Phản ánh lỗ hổng trong công tác kiểm soát an ninh tại Ký túc xá Khu A',
        'Thời gian gần đây tại Ký túc xá Khu A liên tục xảy ra các vụ mất trộm tài sản cá nhân giá trị cao vào ban ngày. Sinh viên nghi ngờ có sự buông lỏng trong khâu kiểm soát thẻ ra vào của lực lượng bảo vệ. Kính đề nghị Phòng Thanh tra thực hiện đợt giám sát đột xuất công tác trực ban và quy trình an ninh tại đây.',
        'Ký túc xá Khu A',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000006',
        '2025-11-05 16:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000012',
        'Kiến nghị kiểm tra cảnh quan môi trường sư phạm trong khuôn viên trường',
        'Khu vực sân trường hiện tại có một số khu vực rác thải sinh hoạt tồn đọng lâu ngày không được xử lý gây mùi hôi thối, ảnh hưởng nghiêm trọng đến mỹ quan học đường và sức khỏe của giảng viên, sinh viên. Đề nghị phòng thanh tra ghi nhận thực tế và đôn đốc bộ phận vệ sinh cảnh quan hoàn thành đúng trách nhiệm.',
        'Sân trường',
        'AI_REVIEW_FAILED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        '2025-11-06 08:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000013',
        'Kiến nghị thanh tra nội dung khung chương trình đào tạo bị lỗi thời',
        'Nhiều môn chuyên ngành thuộc khối kỹ thuật hiện tại vẫn dạy lý thuyết của thập kỷ trước, không có giá trị áp dụng thực tế và sai lệch so với chuẩn đầu ra đã công bố. Đề nghị Phòng Thanh tra Giáo dục tổ chức rà soát, kiểm tra độc lập đề cương chi tiết của các môn học này để đảm bảo chất lượng giáo dục đúng cam kết.',
        NULL,
        'VIOLATED_CONTENT',
        true,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-07 11:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000014',
        'Phản ánh việc ép buộc sinh viên tham gia các chuyến thực tế có thu phí',
        'Sinh viên phản ánh việc một số bộ phận liên kết với doanh nghiệp bên ngoài, đưa ra quy định bắt buộc phải tham gia chuyến đi thực tế có thu phí cao thì mới được công nhận điểm chuyên cần ngoại khóa. Đề nghị Phòng Thanh tra làm rõ dấu hiệu trục lợi và tính tự nguyện trong hoạt động này.',
        'Phòng Quan hệ doanh nghiệp',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-08 13:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000015',
        'Phản ánh giảng viên vi phạm quy chế, thiếu tương tác và bỏ tiết',
        'Tại phòng học C501, giảng viên môn Kỹ năng mềm thường xuyên bật video cho sinh viên tự xem rồi đi ra ngoài giải quyết việc riêng, cuối giờ vào điểm danh. Đây là hành vi thiếu trách nhiệm, vi phạm nghiêm trọng quy chế giảng dạy. Đề nghị Phòng Thanh tra giáo dục trích xuất camera giám sát để có hình thức xử lý thích đáng.',
        'Phòng học C501',
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000004',
        '2025-11-09 09:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000016',
        'Yêu cầu giám sát tính công bằng trong quy trình xét duyệt học bổng',
        'Danh sách sinh viên nhận học bổng hỗ trợ khó khăn vừa qua có nhiều điểm bất thường, một số trường hợp có gia cảnh tốt vẫn được duyệt trong khi nhiều sinh viên nghèo thực sự lại bị loại. Kính đề nghị Phòng Thanh tra giáo dục tiếp nhận hồ sơ, tiến hành rà soát lại toàn bộ quy trình chấm điểm và xét duyệt này.',
        NULL,
        'IN_PROGRESS',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-10 14:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000017',
        'Báo cáo phòng thực hành thí nghiệm không tuân thủ quy định an toàn',
        'Phòng thí nghiệm hóa sinh B201 hiện đang thiếu hụt nghiêm trọng các thiết bị bảo hộ, tủ hút khí độc bị hỏng từ lâu nhưng chưa sửa, đe dọa trực tiếp đến an toàn sức khỏe của giảng viên và sinh viên trong giờ thực hành. Đề nghị phòng thanh tra lập biên bản đình chỉ sử dụng cho đến khi khắc phục xong các lỗi an toàn.',
        'Phòng thí nghiệm B201',
        'VIOLATED_CONTENT',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        '2025-11-10 16:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000018',
        'Phản ánh tình trạng lỗi hệ thống khảo sát ý kiến giảng viên đầu ra',
        'Hệ thống đánh giá giảng viên trực tuyến vào cuối kỳ liên tục bị nghẽn mạng và tự động lưu kết quả mặc định "Tốt" khi sinh viên chưa kịp chọn. Điều này làm sai lệch hoàn toàn kết quả thanh tra chất lượng giảng dạy. Đề nghị Phòng Thanh tra phối hợp với bộ phận IT để kiểm tra và tổ chức đánh giá lại một cách trung thực.',
        'Phòng Đào tạo',
        'AI_REVIEW_FAILED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-11 10:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000019',
        'Phản ánh việc lạm dụng quỹ thời gian chính khóa cho tập duyệt văn nghệ',
        'Một số khoa đang có tình trạng ép sinh viên nghỉ học các tiết chính khóa để tham gia tập duyệt văn nghệ chuẩn bị cho ngày lễ lớn của trường, nếu không đi sẽ bị trừ điểm rèn luyện. Việc này vi phạm nghiêm trọng quy chế đào tạo. Kính mong Phòng Thanh tra giáo dục chấn chỉnh ngay tình trạng ép buộc sai quy định này.',
        'Nhà Văn hóa',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-12 12:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000020',
        'Khiếu nại giảng viên thường xuyên đi muộn về sớm làm cắt giảm giờ học',
        'Chúng tôi xin phản ánh tình trạng một số giảng viên lớp lý thuyết buổi tối thường xuyên đi muộn 30 phút và cho lớp về sớm trước 45 phút, làm ảnh hưởng nghiêm trọng đến lượng kiến thức truyền tải. Đề nghị Phòng Thanh tra giáo dục thực hiện việc điểm danh đột xuất các lớp học này để bảo vệ quyền lợi cho người học.',
        NULL,
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000004',
        '2025-11-13 08:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000021',
        'Kiến nghị công khai biên bản quyết toán các khoản thu ngoài học phí',
        'Sinh viên phải đóng nhiều khoản phụ phí như phí tài liệu, phí duy trì tài khoản thư viện nhưng không có hóa đơn chứng từ rõ ràng từ phòng tài chính. Đứng trên góc độ kiểm soát nội bộ, đề nghị Phòng Thanh tra làm rõ tính hợp pháp của các khoản thu phát sinh này để đảm bảo nhà trường thực hiện đúng pháp luật.',
        'Phòng Tài chính',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-13 11:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000022',
        'Kiến nghị bổ sung camera giám sát tại bãi đỗ xe phòng ngừa mất cắp',
        'Khu vực bãi đỗ xe sinh viên liên tục bị phản ánh về tình trạng bẻ gương, rạch yên xe và mất mũ bảo hiểm cao cấp nhưng khi lên làm việc với đội bảo vệ thì không có bằng chứng đối chiếu do thiếu camera. Kính mong Phòng Thanh tra giám sát đôn đốc ban quản lý tòa nhà triển khai lắp đặt ngay hệ thống camera an ninh.',
        'Bãi đỗ xe',
        'AI_REVIEW_FAILED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000006',
        '2025-11-14 15:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000023',
        'Phản ánh chất lượng mạng Wifi phục vụ học tập quá kém',
        'Mạng wifi nội bộ của trường tại các khu giảng đường liên tục bị mất kết nối, băng thông quá yếu khiến sinh viên không thể truy cập vào hệ thống LMS để làm bài kiểm tra trực tuyến ngay tại lớp. Điều này ảnh hưởng trực tiếp đến kết quả đánh giá học tập. Đề nghị Thanh tra có ý kiến bằng văn bản gửi phòng hạ tầng CNTT nâng cấp khẩn cấp.',
        NULL,
        'VIOLATED_CONTENT',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        '2025-11-15 09:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000024',
        'Kiểm tra việc cắt giảm thời lượng thực hành sai quy định tại xưởng kỹ thuật',
        'Theo khung chương trình môn Dung sai kỹ thuật có 5 buổi thực hành tại xưởng, tuy nhiên giảng viên phụ trách đã tự ý cắt giảm xuống còn 3 buổi và yêu cầu sinh viên tự làm báo cáo ở nhà cho đủ số tiết. Đề nghị Phòng Thanh tra giáo dục kiểm tra lại nhật ký giảng dạy và chấn chỉnh hành vi cắt xén chương trình này.',
        'Xưởng Thực hành',
        'IN_PROGRESS',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-15 13:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000025',
        'Yêu cầu thanh tra tài chính và phân bổ ngân sách cho hoạt động tình nguyện',
        'Chúng tôi nhận thấy có sự thiếu minh bạch trong khâu quyết toán ngân sách chiến dịch Mùa hè xanh vừa qua, nhiều khoản chi thực tế cho sinh viên tình nguyện bị cắt xén không rõ lý do. Đề nghị Phòng Thanh tra tiến hành kiểm tra chứng từ, hóa đơn của ban tổ chức để đảm bảo dòng tiền được sử dụng đúng mục đích.',
        'Đoàn trường',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-15 16:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000026',
        'Phản ánh thái độ làm việc hách dịch, chậm trễ của nhân viên hành chính',
        'Khi sinh viên đến phòng hành chính xin cấp bảng điểm để bổ sung hồ sơ xin việc, nhân viên tại đây có thái độ rất hách dịch, quát mắng sinh viên và kéo dài thời gian hẹn trả kết quả lên đến 3 tuần thay vì 3 ngày theo quy định. Kính đề nghị Phòng Thanh tra kiểm tra tác phong công sở và quy trình một cửa tại bộ phận này.',
        'Phòng Hành chính',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000004',
        '2025-11-16 10:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000027',
        'Kiến nghị giám sát hoạt động phân phối quỹ hỗ trợ sinh viên gặp thiên tai',
        'Nhà trường có kêu gọi đóng góp quỹ hỗ trợ cho sinh viên vùng lũ lụt, tuy nhiên đến nay đã qua kỳ học mới vẫn chưa thấy công bố danh sách giải ngân và tiêu chí xét duyệt nhận hỗ trợ. Để tránh tình trạng thất thoát quỹ, đề nghị Phòng Thanh tra giáo dục đứng ra giám sát rà soát lại tiến độ thực hiện của ban quản lý quỹ.',
        NULL,
        'AI_REVIEW_FAILED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-17 14:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000028',
        'Phản ánh tình trạng mất vệ sinh tại khu vực nhà vệ sinh tòa nhà A',
        'Khu vệ sinh nam nữ tại tòa nhà A thường xuyên bị tắc nghẽn, không có nước sạch và bốc mùi hôi thối nồng nặc lan vào tận các phòng học bên cạnh, ảnh hưởng trực tiếp tới môi trường sư phạm của trường. Đề nghị phòng thanh tra khảo sát, lập biên bản nhắc nhở đơn vị đấu thầu vệ sinh thực hiện đúng cam kết hợp đồng.',
        'Tòa nhà A',
        'VIOLATED_CONTENT',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        '2025-11-18 08:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000029',
        'Khiếu nại việc công bố lịch thi học kỳ quá muộn vi phạm quy chế',
        'Theo quy chế đào tạo, lịch thi kết thúc học phần phải được công bố trước ít nhất 2 tuần để sinh viên chuẩn bị kế hoạch ôn tập. Tuy nhiên hiện tại chỉ còn 3 ngày nữa là thi nhưng lịch thi cụ thể của một số môn vẫn chưa có trên hệ thống. Đề nghị Phòng Thanh tra kiểm tra quy trình làm việc của phòng Đào tạo và giải quyết gấp cho sinh viên.',
        'Phòng Đào tạo',
        'IN_PROGRESS',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-19 11:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000030',
        'Yêu cầu thanh tra chất lượng các buổi hội thảo hướng nghiệp bắt buộc',
        'Nhiều buổi hội thảo mang danh nghĩa hướng nghiệp nhưng nội dung thực chất lại là quảng cáo đa cấp hoặc bán các khóa học tiếng Anh kỹ năng ngoài trường với giá đắt đỏ, trong khi trường lại bắt buộc sinh viên đi để lấy điểm rèn luyện. Đề nghị Phòng Thanh tra giáo dục kiểm duyệt chặt chẽ nội dung trước khi cho phép tổ chức.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-20 15:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000031',
        'Phản ánh tình trạng chấm thi không công bằng, có dấu hiệu tiêu cực',
        'Chúng tôi làm đơn này xin phản ánh về việc chấm bài tập lớn môn Thiết kế máy của giảng viên tại phòng B501 có biểu hiện thiếu khách quan, trù dập điểm số của những sinh viên không đi học thêm tại trung tâm riêng của thầy. Đề nghị Phòng Thanh tra giáo dục thành lập hội đồng độc lập để chấm thẩm định lại toàn bộ bài thi lớp này.',
        'Phòng học B501',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000004',
        '2025-11-21 09:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000032',
        'Kiến nghị giám sát quy trình xét giảm học phí cho sinh viên xuất sắc',
        'Nghị định của Chính phủ có quy định rõ về mức miễn giảm học phí cho sinh viên đạt thành tích học tập loại xuất sắc, nhưng nhà trường lại tự ý chuyển đổi khoản này thành các voucher khóa học kỹ năng không có giá trị quy đổi tiền mặt. Đề nghị Phòng Thanh tra xem xét lại tính pháp lý của quy định nội bộ này.',
        'Phòng Tài chính',
        'AI_REVIEW_FAILED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-22 13:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000033',
        'Phản ánh lực lượng bảo vệ trực đêm lơ là nhiệm vụ phòng chống cháy nổ',
        'Vào khoảng 23h đêm qua, tôi có đi học nhóm về muộn và chứng kiến chốt bảo vệ khu trung tâm không có người trực, đi kiểm tra thì thấy họ đang tụ tập uống rượu bia tại góc khuất bãi xe. Đây là hành vi vi phạm kỷ luật lao động nghiêm trọng, đe dọa an toàn tài sản trường học. Đề nghị Phòng Thanh tra lập biên bản xử lý nghiêm.',
        'Khuôn viên trường',
        'VIOLATED_CONTENT',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000006',
        '2025-11-23 16:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000034',
        'Kiểm tra công tác đảm bảo an toàn vệ sinh thực phẩm tại Căn tin trường',
        'Nhiều sinh viên phản ánh tình trạng ngộ độc thực phẩm nhẹ sau khi ăn cơm trưa tại căn tin trường, đồng thời phát hiện có côn trùng trong thức ăn nhưng chủ hộ kinh doanh né tránh trách nhiệm. Kính đề nghị Phòng Thanh tra phối hợp cùng y tế trường kiểm tra đột xuất chứng nhận an toàn thực phẩm và nguồn gốc nguyên liệu tại đây.',
        'Căn tin',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000007',
        '2025-12-01 10:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000035',
        'Phản ánh dàn máy tính phòng thực hành tin học quá cũ gây lỗi khi thi',
        'Hệ thống máy tính tại phòng Máy tính khu B đã quá lạc hậu, chip xử lý yếu và thường xuyên bị treo máy ngẫu nhiên. Trong đợt thi vừa qua, nhiều sinh viên bị mất toàn bộ bài làm môn Lập trình nâng cao do máy sập nguồn giữa chừng mà không tự lưu. Đề nghị Phòng Thanh tra ghi nhận và yêu cầu trung tâm máy tính khắc phục hậu quả.',
        'Phòng Máy tính',
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        '2025-12-02 14:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000036',
        'Yêu cầu giám sát chất lượng và tính bảo mật của nền tảng thi trực tuyến',
        'Tôi xin phản ánh bảo mật (ẩn danh) về nền tảng thi trắc nghiệm trực tuyến mới triển khai có lỗ hổng lớn, cho phép sinh viên mở tab khác tra cứu tài liệu hoặc sử dụng tool hack mà không bị hệ thống cảnh báo đánh dấu vi phạm. Đề nghị Phòng Thanh tra khẩn cấp đình chỉ việc tổ chức thi trên hệ thống này cho đến khi thẩm định lại độ an toàn.',
        NULL,
        'IN_PROGRESS',
        true,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000002',
        '2025-12-03 09:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000037',
        'Kiến nghị rà soát quy trình thu tiền bắt buộc tham gia Hội quân mùa đông',
        'Ban cán sự một số lớp đang truyền đạt thông tin bắt buộc mọi đoàn viên phải nộp 200.000đ đóng phí tham gia chiến dịch tình nguyện mùa đông, nếu không tham gia sẽ bị hạ bậc hạnh kiểm cuối năm. Yêu cầu Phòng Thanh tra giáo dục kiểm tra tính đúng đắn của văn bản chỉ đạo này từ phía Đoàn thanh niên xem có đúng quy chế không.',
        'Sân trường',
        'VIOLATED_CONTENT',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000003',
        '2025-12-05 13:00:00'
    );

INSERT INTO
    "Feedbacks" (
        "id",
        "subject",
        "description",
        "location",
        "currentStatus",
        "isPrivate",
        "userId",
        "departmentId",
        "categoryId",
        "createdAt"
    )
VALUES
    -- Department thứ 2: Phòng Quan hệ doanh nghiệp (d000...002) → 33 feedbacks
    (
        'f0000000-0000-0000-0000-000000000038',
        'Mạng lưới doanh nghiệp liên kết còn hạn chế về quy mô và thương hiệu lớn',
        'Em nhận thấy số lượng các tập đoàn đa quốc gia và doanh nghiệp lớn đến trường để ký kết hợp tác hoặc tuyển dụng trực tiếp còn khá ít. Phần lớn là các công ty vừa và nhỏ với quy mô hạn chế, khiến cơ hội tiếp cận môi trường chuyên nghiệp của sinh viên bị thu hẹp. Kính mong Nhà trường và Phòng Quan hệ Doanh nghiệp chủ động mở rộng mạng lưới đối tác chiến lược sâu rộng hơn.',
        NULL,
        'AI_REVIEW_FAILED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-02 10:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000039',
        'Tần suất tổ chức Ngày hội việc làm (Job Fair) trong năm còn quá thưa thớt',
        'Hiện tại trường chúng ta chỉ tổ chức một Ngày hội việc làm lớn duy nhất trong năm tại Nhà thi đấu đa năng. Số lượng sinh viên tham gia quá đông dẫn đến tình trạng chen chúc, nghẽn mạng đăng ký trực tuyến và không có đủ thời gian phỏng vấn sâu với các HR. Em đề xuất phòng nên tăng tần suất tổ chức lên ít nhất là 2 đến 3 lần một năm hoặc chia nhỏ theo từng khối ngành nghề cụ thể.',
        'Nhà thi đấu đa năng',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-03 15:10:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000040',
        'Công tác hỗ trợ và giới thiệu đơn vị thực tập tốt nghiệp chưa đạt hiệu quả cao',
        'Nhiều sinh viên năm cuối gặp rất nhiều khó khăn trong việc tự liên hệ nơi thực tập đúng chuyên ngành học. Khi lên phòng xin hỗ trợ thì danh sách công ty giới thiệu đã quá hạn hoặc không còn nhận người. Kính đề xuất phòng cần có một bộ phận chuyên trách cập nhật liên tục vị trí thực tập chất lượng cao để kịp thời điều hướng và hỗ trợ sinh viên ứng tuyển thuận lợi.',
        NULL,
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-04 11:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000041',
        'Số lượng và giá trị học bổng tài trợ từ phía doanh nghiệp còn quá khiêm tốn',
        'Em thấy số suất học bổng đến từ các doanh nghiệp liên kết chỉ đếm trên đầu ngón tay và điều kiện xét duyệt lại quá khắt khe, đôi khi không thực tế với điều kiện của sinh viên nghèo vượt khó. Mong phòng Quan hệ doanh nghiệp tích cực đàm phán, kêu gọi các nguồn quỹ xã hội hóa để nâng cao số lượng cũng như giá trị các suất học bổng tài trợ này.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-05 09:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000042',
        'Nội dung các buổi hội thảo định hướng nghề nghiệp còn mang tính hình thức, lý thuyết',
        'Các chương trình workshop, talkshow hướng nghiệp do phòng phối hợp tổ chức tại hội trường thời gian qua có nội dung khá chung chung, chưa đi sâu vào thực tế thị trường lao động khốc liệt hiện nay. Diễn giả chủ yếu nói về lý thuyết kỹ năng mà thiếu đi các case study thực tế, khiến cho sinh viên cảm thấy không hứng thú và tham gia mang tính chất đối phó điểm rèn luyện.',
        'Hội trường A201',
        'AI_REVIEW_FAILED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-06 14:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000043',
        'Thiếu cổng thông tin công khai danh sách các đối tác doanh nghiệp chiến lược',
        'Sinh viên chúng em hoàn toàn mù mờ, không rõ nhà trường đang ký kết hợp tác (MOU) với những công ty nào để chủ động nộp hồ sơ xin thực tập hoặc xin tài trợ nghiên cứu khoa học. Kiến nghị phòng Quan hệ doanh nghiệp xây dựng một danh mục công khai rõ ràng trên website, đính kèm thông tin người liên hệ của từng doanh nghiệp để sinh viên tiện tra cứu.',
        NULL,
        'VIOLATED_CONTENT',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-07 16:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000044',
        'Đề xuất xây dựng mạng lưới Mentorship kết nối sâu sắc với mạng lưới Cựu sinh viên',
        'Mạng lưới cựu sinh viên thành đạt của trường chúng ta rất lớn nhưng chưa được khai thác hiệu quả. Em mong muốn phòng Quan hệ doanh nghiệp đứng ra thành lập một chương trình "Alumni Mentorship" dài hạn. Nơi mà mỗi cựu sinh viên đi trước có thể kèm cặp, chia sẻ trải nghiệm thực tế và định hướng trực tiếp 1-1 cho các bạn sinh viên năm 3, năm 4 trước khi ra trường.',
        NULL,
        'IN_PROGRESS',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-08 10:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000045',
        'Tốc độ cập nhật tin tức tuyển dụng trên các kênh truyền thông chính thức còn rất chậm',
        'Rất nhiều thông tin tuyển dụng, chương trình Quản trị viên tập sự của các tập đoàn lớn có hạn nộp hồ sơ rất gấp. Tuy nhiên, khi thông tin này được duyệt và đăng tải lên fanpage hay cổng thông tin của phòng thì thời hạn chỉ còn 1-2 ngày, khiến sinh viên không kịp chuẩn bị CV chỉn chu. Rất mong bộ phận truyền thông của phòng tối ưu hóa quy trình duyệt bài đăng.',
        NULL,
        'RESOLVED',
        true,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-09 13:40:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000046',
        'Cần mở thêm các workshop chuyên sâu về kỹ năng viết CV chuyên nghiệp và Mock Interview',
        'Hiện tại, sinh viên trường mình có thế mạnh về kỹ thuật và kiến thức chuyên môn nhưng kỹ năng viết CV tiếng Anh và trả lời phỏng vấn còn rất yếu. Em đề xuất phòng phối hợp với các chuyên gia nhân sự từ doanh nghiệp mở các lớp sửa CV trực tiếp và tổ chức các buổi phỏng vấn thử (Mock Interview) định kỳ hàng tháng để tăng tính cọ xát thực tế cho sinh viên.',
        'Phòng A102',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-10 11:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000047',
        'Chất lượng công việc từ các đối tác tuyển dụng chưa tương xứng với trình độ kỹ sư',
        'Em thấy một số doanh nghiệp đến trường tuyển dụng tại ngày hội việc làm đưa ra các vị trí công việc có tính chất như lao động phổ thông, công nhân kỹ thuật hoặc nhân viên bán hàng đại trà. Những vị trí này hoàn toàn không phù hợp với định hướng đào tạo kỹ sư chất lượng cao của nhà trường. Mong phòng có sự sàng lọc đối tác kỹ càng hơn trước khi cho phép tuyển dụng.',
        NULL,
        'AI_REVIEW_FAILED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-11 15:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000048',
        'Đề xuất vận động quỹ học bổng hỗ trợ chi phí Ký túc xá cho sinh viên hoàn cảnh khó khăn',
        'Chi phí lưu trú tại ký túc xá tuy không quá cao nhưng vẫn là gánh nặng với nhiều bạn sinh viên vùng sâu vùng xa. Thay vì chỉ nhận học bổng tiền mặt thông thường, phòng có thể làm việc với các doanh nghiệp lớn để họ tài trợ trực tiếp theo gói "Học bổng lưu trú", chi trả toàn bộ tiền phòng ký túc xá cho những sinh viên có hoàn cảnh đặc biệt khó khăn.',
        NULL,
        'VIOLATED_CONTENT',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-12 09:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000049',
        'Phần lớn các vị trí thực tập do trường giới thiệu đều không hỗ trợ lương/trợ cấp',
        'Khi tham gia thực tập tại các đơn vị do phòng Quan hệ doanh nghiệp giới thiệu, rất nhiều bạn phản ánh là phải làm việc toàn thời gian như một nhân viên chính thức nhưng không nhận được bất kỳ khoản hỗ trợ xăng xe hay ăn trưa nào. Kính mong phòng khi làm việc với doanh nghiệp cần đưa điều khoản hỗ trợ sinh viên thực tập tối thiểu vào thỏa thuận hợp tác.',
        NULL,
        'IN_PROGRESS',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-13 14:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000050',
        'Cần chủ động mời gọi các tập đoàn công nghệ hàng đầu (FPT, VNG, VinGroup) về trường',
        'Sinh viên khối ngành kỹ thuật và công nghệ rất mong muốn có cơ hội được thực tập và làm việc tại các tập đoàn lớn trong nước như FPT, VNG, Viettel hay VinGroup. Tuy nhiên hiện tại sự hiện diện của các đơn vị này tại trường khá mờ nhạt. Kính đề nghị phòng tăng cường các hoạt động ngoại giao, tiếp cận để đưa các "ông lớn" này về trường tuyển dụng thường niên.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-14 10:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000051',
        'Thiếu kênh thông tin kết nối và xác thực cho các công việc bán thời gian (part-time)',
        'Nhu cầu tìm việc làm thêm để trang trải cuộc sống của sinh viên năm 1, năm 2 là rất lớn. Do không có kênh thông tin chính thống từ nhà trường, nhiều bạn đã bị lừa đảo qua các hội nhóm Facebook đa cấp, lừa đảo việc làm. Mong phòng Quan hệ doanh nghiệp có thể thiết lập một chuyên mục "Việc làm bán thời gian an toàn" để bảo vệ và hỗ trợ sinh viên tối đa.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-15 16:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000052',
        'Các chương trình đào tạo kỹ năng mềm cốt lõi chưa đáp ứng được kỳ vọng của sinh viên',
        'Mặc dù phòng thường xuyên tổ chức các chuyên đề kỹ năng mềm tại hội trường lớn, nhưng quy mô tổ chức quá đông (hàng trăm sinh viên/buổi) khiến việc tương tác thực hành gần như bằng không. Sinh viên chỉ ngồi nghe thụ động nên hiệu quả tiếp thu rất thấp. Kính mong phòng chuyển đổi sang mô hình workshop quy mô nhỏ để sinh viên được thực hành kỹ năng trực tiếp.',
        'Hội trường lớn',
        'AI_REVIEW_FAILED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-16 11:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000053',
        'Danh sách dữ liệu doanh nghiệp nhận thực tập trên hệ thống website đã quá lỗi thời',
        'Em có lên website chính thức của phòng để tìm kiếm biểu mẫu thông tin và danh sách công ty nhận thực tập. Tuy nhiên, tệp dữ liệu đính kèm trên trang lại là danh sách từ năm học trước, nhiều công ty trong đó đã giải thể hoặc thay đổi địa chỉ và số điện thoại liên lạc. Kính mong thầy cô phụ trách quản trị trang web rà soát và cập nhật lại dữ liệu mới nhất.',
        NULL,
        'VIOLATED_CONTENT',
        true,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-17 13:50:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000054',
        'Cần đa dạng hóa mô hình Job Fair bằng các ngày hội việc làm chuyên sâu theo khoa',
        'Việc gộp chung tất cả các ngành nghề từ kinh tế, ngôn ngữ cho đến cơ khí, điện tử vào một ngày hội việc làm duy nhất khiến hiệu quả kết nối không cao. Các doanh nghiệp ngành kỹ thuật bị loãng giữa các gian hàng dịch vụ khác. Đề xuất phòng phối hợp chặt chẽ với Ban chỉ huy các khoa để tổ chức chuỗi "Mini Job Fair" chuyên biệt cho từng nhóm ngành cụ thể.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-18 09:40:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000055',
        'Đề xuất triển khai gói học bổng/quỹ đầu tư dành riêng cho các dự án khởi nghiệp sáng tạo',
        'Hiện tại, phong trào nghiên cứu khoa học và khởi nghiệp (Startup) trong sinh viên diễn ra rất sôi nổi, tuy nhiên khó khăn lớn nhất luôn là nguồn vốn mồi để làm sản phẩm thử nghiệm. Rất mong phòng Quan hệ doanh nghiệp kết nối với các quỹ đầu tư thiên thần hoặc các vườn ươm doanh nghiệp để tài trợ riêng các suất học bổng phát triển ý tưởng khởi nghiệp này.',
        NULL,
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-19 15:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000056',
        'Cơ hội ứng tuyển vào các doanh nghiệp nước ngoài (FDI) tại trường còn tương đối ít',
        'Xu hướng sinh viên hiện nay muốn làm việc tại các công ty FDI để rèn luyện ngoại ngữ và nhận mức lương tốt hơn. Thế nhưng các thông tin tuyển dụng từ các doanh nghiệp Nhật Bản, Hàn Quốc hay Âu Mỹ gửi về trường vẫn còn khá hạn chế. Đề xuất phòng tích cực ngoại giao với các hiệp hội doanh nghiệp nước ngoài (như Jetro, AmCham, EuroCham) để mang cơ hội về cho sinh viên.',
        NULL,
        'IN_PROGRESS',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-20 10:10:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000057',
        'Hoạt động của Mạng lưới cựu sinh viên còn mang tính bề nổi, chưa đi vào chiều sâu',
        'Em thấy hàng năm trường vẫn tổ chức họp mặt cựu sinh viên nhưng sau đó các hoạt động liên kết lại rơi vào im lặng, không có tính bền vững. Mong phòng thiết kế một nền tảng số riêng cho Cựu sinh viên để duy trì tương tác thường xuyên, làm cầu nối hỗ trợ học thuật, chuyển giao công nghệ và tạo cơ hội việc làm thực tế xuyên suốt cả năm cho khóa sau.',
        NULL,
        'VIOLATED_CONTENT',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-21 14:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000058',
        'Chậm trễ trong việc công bố kế hoạch chuẩn bị cho kỳ thực tập tốt nghiệp hè sắp tới',
        'Mặc dù đã bước sang cuối tháng 11 nhưng phía phòng Quan hệ doanh nghiệp vẫn chưa có bất kỳ thông báo hay lộ trình hướng dẫn cụ thể nào về việc chuẩn bị hồ sơ cho đợt thực tập lớn vào mùa hè năm sau. Điều này khiến sinh viên chúng em rất bị động và lo lắng trong việc tìm kiếm công ty thích hợp phù hợp với lịch trình học tập cá nhân.',
        NULL,
        'AI_REVIEW_FAILED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-22 11:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000059',
        'Đề xuất đa dạng hóa phương thức kết nối bằng việc tổ chức Ngày hội việc làm trực tuyến (Job Fair Online)',
        'Đối với những sinh viên đang đi thực tập xa hoặc lịch học quân sự dày đặc không thể tham gia Job Fair trực tiếp tại sân trường, các bạn sẽ chịu thiệt thòi rất lớn. Phòng nên nghiên cứu xây dựng thêm một nền tảng Ngày hội việc làm trực tuyến (Virtual Job Fair) chạy song song, cho phép sinh viên nộp CV và phỏng vấn sơ loại từ xa với doanh nghiệp.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-23 16:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000060',
        'Cần chủ động tìm kiếm các nguồn học bổng tài trợ từ các doanh nghiệp đổi mới sáng tạo',
        'Phần lớn học bổng hiện tại đến từ các công ty sản xuất truyền thống với giá trị cố định và thủ tục rườm rà. Em đề xuất phòng nên chủ động tiếp cận với các doanh nghiệp thuộc mảng công nghệ mới, thương mại điện tử hoặc các startup Fintech lớn. Họ luôn có quỹ ngân sách linh hoạt và sẵn sàng đầu tư mạnh tay cho nguồn nhân lực tài năng trẻ từ nhà trường.',
        NULL,
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-24 09:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000061',
        'Thiếu các chương trình và cơ hội thực tập, trao đổi sinh viên quốc tế (Global Internship)',
        'Xu hướng hội nhập toàn cầu đòi hỏi sinh viên phải có trải nghiệm làm việc quốc tế. Tuy nhiên hiện tại phòng chưa có nhiều chương trình liên kết đưa sinh viên đi thực tập tại nước ngoài (như Nhật Bản, Singapore, Đức...). Kính mong phòng tích cực đẩy mạnh hợp tác với các tổ chức phái cử quốc tế để mở rộng lộ trình "Global Internship" cho sinh viên trường.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-25 13:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000062',
        'Đề xuất xây dựng các group Zalo theo ngành để cập nhật nhanh chóng tin tức tuyển dụng khẩn cấp',
        'Phương thức đăng tin tuyển dụng lên website hiện tại đã không còn phù hợp với thói quen sử dụng mạng xã hội của giới trẻ, dẫn đến tỷ lệ tiếp cận thông tin cực kỳ thấp. Phòng nên thành lập và phân loại các cộng đồng/group Zalo, Telegram tuyển dụng chính thức theo từng khoa. Như vậy, tin tuyển dụng khẩn cấp từ doanh nghiệp sẽ được đẩy trực tiếp đến điện thoại của sinh viên ngay lập tức.',
        NULL,
        'AI_REVIEW_FAILED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-26 10:40:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000063',
        'Cần liên kết sâu rộng hơn với các doanh nghiệp thuộc lĩnh vực công nghệ lõi và sản xuất thông minh',
        'Là một trường đại học hàng đầu về kỹ thuật công nghệ, nhưng em thấy số lượng doanh nghiệp liên kết về mảng vi mạch bán dẫn, tự động hóa cấp cao hay AI còn rất ít. Phần lớn vẫn là các doanh nghiệp gia công truyền thống. Đề xuất phòng đổi mới chiến lược tiếp cận, bắt tay với các doanh nghiệp công nghệ lõi để sinh viên không bị tụt hậu so với sự phát triển toàn cầu.',
        NULL,
        'VIOLATED_CONTENT',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-27 15:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000064',
        'Đề xuất đàm phán ký kết các suất học bổng toàn phần cam kết đầu ra việc làm với doanh nghiệp',
        'Nhiều sinh viên giỏi có hoàn cảnh đặc biệt khó khăn luôn sống trong nỗi lo học phí tăng qua từng năm. Mong phòng đứng ra làm đầu mối đàm phán ký kết mô hình hợp tác ba bên: Doanh nghiệp tài trợ học bổng toàn phần – Sinh viên cam kết học tập tốt – Doanh nghiệp tiếp nhận làm việc ngay sau khi tốt nghiệp. Mô hình này sẽ giúp giải quyết triệt để bài toán kinh tế lẫn việc làm.',
        NULL,
        'IN_PROGRESS',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-28 11:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000065',
        'Tình trạng quá tải và thiếu chỗ thực tập bắt buộc cho sinh viên khối ngành Kinh tế',
        'Hiện tại đang vào cao điểm chuẩn bị hồ sơ thực tập nhưng số lượng công ty đối tác ngành quản trị, kế toán, logistics gửi về phòng quá ít so với quy mô sinh viên của trường. Nhiều bạn đang rơi vào tình thế tiến thoái lưỡng nan vì không tìm được nơi tiếp nhận đóng mộc báo cáo. Kính đề nghị phòng khẩn trương liên hệ các đơn vị vận tải, tài chính để mở thêm chỉ tiêu khẩn cấp.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000002',
        '2025-12-01 14:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000066',
        'Nguyện vọng tổ chức thêm một đợt Ngày hội việc làm cuối năm để giải quyết việc làm cho sinh viên tốt nghiệp muộn',
        'Đợt Job Fair chính thức thường rơi vào giữa năm, trong khi có một số lượng lớn sinh viên hoàn thành chương trình học và tốt nghiệp muộn vào đợt tháng 12. Giai đoạn này các bạn bơ vơ và rất khó tìm việc do thị trường cuối năm đóng băng. Mong muốn phòng tổ chức một ngày hội tuyển dụng quy mô vừa vào cuối tháng 12 để tiếp sức kịp thời cho các bạn ra trường muộn.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-12-02 10:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000067',
        'Chưa công khai danh mục thông tin học bổng doanh nghiệp cho học kỳ mới',
        'Đã bước sang tháng 12 nhưng trên cổng thông tin hỗ trợ sinh viên của phòng vẫn hoàn toàn trống trơn thông tin về các chương trình học bổng doanh nghiệp đồng hành cho kỳ tới. Sinh viên cần thông tin sớm để chuẩn bị bảng điểm, viết thư động lực chỉn chu nhằm gia tăng cơ hội đạt học bổng. Kính mong các thầy cô sớm đốc thúc các doanh nghiệp đối tác gửi thông tin thông báo.',
        NULL,
        'AI_REVIEW_FAILED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000005',
        '2025-12-03 16:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000068',
        'Đề xuất đẩy mạnh ký kết hợp tác chuyên sâu với hệ sinh thái các công ty Startup công nghệ',
        'Môi trường tại các công ty khởi nghiệp (Startup) tuy áp lực nhưng là nơi lý tưởng để sinh viên được cọ xát đa năng và thăng tiến nhanh. Hiện tại danh sách đối tác của phòng hầu như chỉ có các nhà máy, công ty truyền thống quy mô lớn cồng kềnh. Kính đề nghị phòng đa dạng hóa hệ sinh thái đối tác bằng cách liên kết với các vườn ươm doanh nghiệp thế hệ mới.',
        NULL,
        'VIOLATED_CONTENT',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-12-05 11:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000069',
        'Cần sớm ban hành cẩm nang định hướng và lộ trình tham gia chuỗi hội thảo tuyển dụng năm sau',
        'Để sinh viên chủ động sắp xếp thời gian học tập hợp lý tại trường không bị trùng lịch, em mong muốn phòng Quan hệ doanh nghiệp ban hành sớm khung kế hoạch hoặc cuốn cẩm nang số tổng hợp toàn bộ các chuỗi hội thảo định hướng, talkshow và các kỳ tuyển dụng lớn dự kiến diễn ra trong năm tới để sinh viên tiện theo dõi và chủ động chuẩn bị hồ sơ.',
        NULL,
        'IN_PROGRESS',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-12-06 09:50:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000070',
        'Thủ tục cấp Giấy chứng nhận tốt nghiệp tạm thời tại phòng còn rườm rà và mất nhiều thời gian chờ đợi',
        'Em xin phản ánh về quy trình làm thủ tục hành chính tại phòng. Khi sinh viên đã hoàn thành chương trình học và cần gấp Giấy chứng nhận tốt nghiệp tạm thời để nộp hồ sơ ứng tuyển cho doanh nghiệp theo thời hạn của họ, quy trình xử lý giấy tờ tại phòng kéo dài đến hơn một tuần và yêu cầu quá nhiều chữ ký xác nhận qua lại. Kính mong phòng số hóa quy trình này để rút ngắn thời gian trả kết quả cho sinh viên.',
        NULL,
        'RESOLVED',
        true,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-12-07 14:00:00'
    );

INSERT INTO
    "Feedbacks" (
        "id",
        "subject",
        "description",
        "location",
        "currentStatus",
        "isPrivate",
        "userId",
        "departmentId",
        "categoryId",
        "createdAt"
    )
VALUES
    -- Department thứ 3: Phòng Khoa học & Công nghệ (d000...003) → đúng 30 feedbacks
    (
        'f0000000-0000-0000-0000-000000000071',
        'Quy trình xét duyệt đề tài NCKH sinh viên kéo dài, thiếu minh bạch',
        'Em đã nộp hồ sơ đăng ký đề tài nghiên cứu khoa học cấp trường từ đầu tháng 9 năm 2025, tuy nhiên đến nay đã gần 2 tháng vẫn chưa nhận được bất kỳ phản hồi nào từ Phòng Khoa học & Công nghệ. Không có thông báo về tiến độ xét duyệt, không có email xác nhận đã tiếp nhận hồ sơ, và khi em trực tiếp đến phòng hỏi thì được yêu cầu chờ thêm mà không có mốc thời gian cụ thể. Điều này ảnh hưởng rất lớn đến kế hoạch nghiên cứu của nhóm, vì nhiều hoạt động cần triển khai song song nhưng phải chờ có quyết định phê duyệt mới được cấp kinh phí và tiếp cận thiết bị. Kính đề nghị Phòng KH&CN xây dựng quy trình xét duyệt rõ ràng với thời hạn cụ thể (ví dụ tối đa 30 ngày làm việc), đồng thời có hệ thống thông báo tự động hoặc portal tra cứu trạng thái hồ sơ để sinh viên chủ động theo dõi.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-01 11:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000072',
        'Mức kinh phí hỗ trợ đề tài NCKH sinh viên quá thấp, không đáp ứng nhu cầu thực tế',
        'Hiện tại mức hỗ trợ tối đa cho một đề tài NCKH sinh viên chỉ là 5 triệu đồng/đề tài. Con số này hoàn toàn không đủ để triển khai một đề tài nghiên cứu có chiều sâu, đặc biệt trong các lĩnh vực kỹ thuật, điện tử và tự động hóa – nơi chỉ riêng chi phí mua linh kiện, cảm biến, vi điều khiển và vật tư thực nghiệm đã vượt mức cho phép. Ví dụ, nhóm em đang thực hiện đề tài về robot tự hành, chi phí ước tính tối thiểu để có prototype hoạt động được là khoảng 12-15 triệu đồng. Phần thiếu hụt, nhóm phải tự bỏ tiền túi hoặc xin tài trợ từ doanh nghiệp bên ngoài, rất mất thời gian và không bền vững. Đề nghị Phòng KH&CN xem xét tăng mức hỗ trợ tối đa lên ít nhất 15-20 triệu đồng/đề tài, và có thêm các gói hỗ trợ bổ sung theo kết quả đánh giá giữa kỳ để khuyến khích các đề tài có tiềm năng.',
        NULL,
        'AI_REVIEW_FAILED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-02 14:10:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000073',
        'Hội nghị Nghiên cứu Khoa học Sinh viên năm 2025 chưa được tổ chức',
        'Theo thông lệ những năm trước, Hội nghị Nghiên cứu Khoa học Sinh viên cấp trường thường được tổ chức vào khoảng tháng 4 hằng năm, tạo cơ hội để sinh viên trình bày kết quả nghiên cứu, giao lưu học thuật và nhận phản hồi từ hội đồng chuyên môn. Tuy nhiên, tính đến tháng 11 năm 2025, vẫn chưa có bất kỳ thông báo chính thức nào từ Phòng KH&CN về việc tổ chức sự kiện này. Nhiều nhóm sinh viên đã hoàn thành đề tài và đang chờ cơ hội báo cáo, nhưng không có sân chơi chính thức. Điều này không chỉ làm giảm động lực nghiên cứu mà còn ảnh hưởng đến cơ hội được công nhận thành tích học thuật. Kính đề nghị Phòng sớm lên kế hoạch tổ chức hội nghị, thông báo lịch trình cụ thể và mở đăng ký cho sinh viên ít nhất 2 tháng trước ngày diễn ra.',
        'Hội trường A201',
        'VIOLATED_CONTENT',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-03 09:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000074',
        'Quy trình đăng ký bảo hộ sáng chế phức tạp, thiếu hỗ trợ từ phòng chức năng',
        'Nhóm nghiên cứu của em đã phát triển được một giải pháp kỹ thuật có tính mới và khả năng ứng dụng thực tiễn cao. Từ tháng 7/2025, nhóm đã liên hệ Phòng KH&CN để được hướng dẫn thủ tục đăng ký bảo hộ sáng chế, tuy nhiên đến nay vẫn chưa nhận được hướng dẫn đầy đủ. Hồ sơ đã nộp ban đầu bị trả lại với lý do thiếu tài liệu nhưng không có biểu mẫu mẫu hay checklist cụ thể. Chi phí thuê luật sư sở hữu trí tuệ bên ngoài để hoàn thiện hồ sơ lên đến 15-20 triệu đồng, hoàn toàn vượt khả năng của sinh viên. Kính mong Phòng KH&CN xây dựng quy trình chuẩn hóa, cung cấp tư vấn trực tiếp từ chuyên viên sở hữu trí tuệ, và hỗ trợ một phần hoặc toàn bộ chi phí nộp đơn cho các sáng chế xuất phát từ nghiên cứu của sinh viên trường.',
        NULL,
        'RESOLVED',
        true,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000001',
        '2025-11-04 16:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000075',
        'Thiếu không gian làm việc nhóm dành riêng cho các đề tài NCKH sinh viên',
        'Hiện nay các nhóm sinh viên đang thực hiện đề tài NCKH không có không gian làm việc riêng, cố định và được trang bị đầy đủ. Nhóm em và nhiều nhóm khác phải làm việc tại căng tin, hành lang hoặc phòng học trống vào cuối tuần – những nơi ồn ào, thiếu ổ cắm điện, không có bảng trắng và không an toàn để để thiết bị nghiên cứu qua đêm. Điều này làm giảm đáng kể hiệu suất làm việc và tiềm ẩn nguy cơ mất mát tài sản nghiên cứu. Đề nghị Phòng KH&CN phối hợp với Ban Quản lý Cơ sở Vật chất bố trí ít nhất 2-3 phòng co-working dành riêng cho NCKH sinh viên, có đầy đủ bàn ghế, máy chiếu, ổ cắm điện, tủ khóa cá nhân và kết nối mạng tốc độ cao, mở cửa ít nhất đến 22 giờ các ngày trong tuần.',
        'Tòa nhà A - Phòng A201',
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000001',
        '2025-11-05 10:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000076',
        'Nhà trường chưa có quỹ hỗ trợ khởi nghiệp dành cho sinh viên',
        'Trong khi nhiều trường đại học kỹ thuật và công nghệ đã thành lập quỹ hỗ trợ khởi nghiệp sinh viên với quy mô từ 1 đến 2 tỷ đồng, trường ta vẫn chưa có cơ chế tài chính chính thức nào dành cho các dự án startup của sinh viên. Các nhóm có ý tưởng tốt, sản phẩm khả thi nhưng không có vốn để phát triển prototype, đăng ký thương hiệu hay tiếp cận thị trường. Một số nhóm đã phải bỏ cuộc hoặc chuyển sang triển khai ở trường khác có hệ sinh thái khởi nghiệp tốt hơn. Đề nghị Phòng KH&CN phối hợp với Ban Giám hiệu và các đối tác doanh nghiệp để xây dựng quỹ hỗ trợ khởi nghiệp sinh viên, có thể bắt đầu với quy mô nhỏ (500 triệu – 1 tỷ đồng) và tăng dần theo từng năm, kèm theo tiêu chí xét duyệt rõ ràng và quy trình mentor chuyên nghiệp.',
        NULL,
        'IN_PROGRESS',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000007',
        '2025-11-06 13:40:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000077',
        'Hội thảo hướng dẫn viết bài báo khoa học quốc tế tổ chức quá ít',
        'Trong cả năm học 2024-2025, Phòng KH&CN chỉ tổ chức 1-2 buổi hội thảo hướng dẫn viết bài báo đăng tạp chí Scopus/ISI. Số lượng buổi này quá ít so với nhu cầu thực tế của sinh viên và giảng viên trẻ muốn tiếp cận công bố quốc tế. Các buổi hội thảo hiện tại cũng chủ yếu mang tính tổng quát, chưa đi sâu vào từng bước cụ thể như cách viết abstract chuẩn, chọn tạp chí phù hợp, xử lý phản biện, hay tránh các lỗi thường gặp dẫn đến bị từ chối. Đề nghị Phòng KH&CN tổ chức định kỳ ít nhất 1 buổi/tháng, mời chuyên gia có kinh nghiệm công bố quốc tế, và xây dựng chương trình theo lộ trình từ cơ bản đến nâng cao để sinh viên có thể theo học xuyên suốt.',
        NULL,
        'VIOLATED_CONTENT',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-07 15:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000078',
        'Đề nghị có chính sách hỗ trợ kinh phí tham dự hội nghị khoa học quốc tế',
        'Nhiều sinh viên và nhóm nghiên cứu đã có bài báo được chấp nhận đăng tại các hội nghị quốc tế uy tín, nhưng không có kinh phí để tham dự trực tiếp do chi phí đăng ký, vé máy bay và lưu trú rất cao (thường từ 30 đến 100 triệu đồng/người tùy địa điểm). Hiện tại nhà trường chưa có chính sách hỗ trợ rõ ràng cho trường hợp này, khiến nhiều sinh viên phải từ chối cơ hội quý giá để trình bày và mạng lưới với cộng đồng khoa học quốc tế. Kính đề nghị Phòng KH&CN xây dựng chính sách hỗ trợ từ 50% đến 100% chi phí tham dự hội nghị quốc tế cho sinh viên có bài báo được chấp nhận, ưu tiên các hội nghị thuộc danh sách ISI/Scopus, kèm theo nghĩa vụ báo cáo kết quả sau khi tham dự.',
        NULL,
        'AI_REVIEW_FAILED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-08 11:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000079',
        'Trường chưa có giải thưởng NCKH cấp trường để ghi nhận thành tích xuất sắc của sinh viên',
        'Tại nhiều trường đại học lớn, hằng năm đều tổ chức lễ trao giải thưởng NCKH với giá trị từ 20 đến 50 triệu đồng cho các đề tài xuất sắc nhất, cùng bằng khen của Ban Giám hiệu và các ưu đãi học thuật khác. Điều này tạo động lực rất lớn cho sinh viên đầu tư nghiêm túc vào nghiên cứu. Hiện tại trường ta chưa có giải thưởng tương tự, khiến không ít sinh viên cảm thấy thiếu sự ghi nhận và không có đủ động lực bỏ nhiều tháng công sức vào một đề tài NCKH. Đề nghị Phòng KH&CN tham mưu Ban Giám hiệu thành lập Giải thưởng NCKH Sinh viên Xuất sắc hằng năm, với các hạng mục rõ ràng theo lĩnh vực, và có giá trị giải thưởng đủ sức hấp dẫn để khuyến khích phong trào nghiên cứu trong toàn trường.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000007',
        '2025-11-09 14:50:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000080',
        'Phòng thí nghiệm nghiên cứu đóng cửa quá sớm, ảnh hưởng nghiêm trọng đến tiến độ đề tài',
        'Nhóm NCKH về robot tự hành của em hiện đang làm việc tại phòng Lab CNC, tuy nhiên phòng chỉ mở cửa đến 22 giờ mỗi ngày. Do đặc thù công việc nghiên cứu kỹ thuật, nhiều quy trình thử nghiệm cần thực hiện liên tục trong nhiều giờ mà không thể dừng giữa chừng (ví dụ: chạy thử nghiệm thuật toán điều hướng, hiệu chỉnh cảm biến, kiểm thử phần cứng). Việc phải dừng đột ngột lúc 22 giờ gây lãng phí công sức và làm chậm tiến độ đáng kể. Nhiều trường đại học kỹ thuật trên thế giới cho phép các nhóm NCKH đăng ký sử dụng phòng lab 24/7 với thẻ từ và camera giám sát. Đề nghị Phòng KH&CN nghiên cứu áp dụng mô hình này, ít nhất thí điểm cho các nhóm có đề tài đang trong giai đoạn thực nghiệm.',
        'Phòng Lab CNC',
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000001',
        '2025-11-10 16:10:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000081',
        'Phòng Machine Learning thiếu GPU hiệu năng cao, không đáp ứng yêu cầu huấn luyện mô hình AI',
        'Nhóm nghiên cứu AI của em đang thực hiện đề tài về mô hình nhận diện hình ảnh y tế sử dụng deep learning. Tuy nhiên, phòng Machine Learning hiện không có GPU đủ mạnh để huấn luyện các mô hình lớn – cụ thể là thiếu GPU RTX 4090 hoặc tương đương. Các máy hiện có chỉ trang bị GTX 1060, khiến thời gian train một epoch lên đến hàng chục giờ, không thực tế cho nghiên cứu. Nhóm phải sử dụng Google Colab miễn phí với giới hạn GPU hạn chế, thường xuyên bị ngắt kết nối giữa chừng và không thể lưu trạng thái. Việc đầu tư thêm 2-4 máy trạm AI với GPU RTX 4090 hoặc A100 sẽ phục vụ được nhiều nhóm nghiên cứu AI cùng lúc và nâng cao đáng kể chất lượng đề tài trong lĩnh vực này.',
        'Phòng Machine Learning',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000001',
        '2025-11-11 09:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000082',
        'Đề nghị hỗ trợ phí xuất bản bài báo Open Access (APC) cho sinh viên',
        'Nhiều tạp chí khoa học uy tín hiện nay chỉ tiếp nhận bài báo theo mô hình Open Access, yêu cầu tác giả trả phí APC (Article Processing Charge) từ 500 USD đến 3.000 USD tùy tạp chí. Đây là khoản chi hoàn toàn ngoài khả năng của sinh viên. Hiện tại nhà trường chưa có chính sách hỗ trợ khoản phí này, dẫn đến tình trạng nhiều bài báo chất lượng tốt không thể được công bố hoặc phải chọn tạp chí kém uy tín hơn chỉ vì lý do tài chính. Đề nghị Phòng KH&CN thiết lập quỹ hỗ trợ APC, ưu tiên các bài báo thuộc danh mục Q1/Q2 Scopus, với mức hỗ trợ tối thiểu 50% và tối đa 100% tùy chất lượng tạp chí và thành tích học tập của tác giả.',
        NULL,
        'AI_REVIEW_FAILED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-12 13:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000083',
        'Trường đã 2 năm không tổ chức Ngày hội Khởi nghiệp Sinh viên (Startup Day)',
        'Startup Day từng là sự kiện thường niên được sinh viên rất mong đợi, tạo cơ hội để các nhóm khởi nghiệp trình bày ý tưởng, gặp gỡ nhà đầu tư và kết nối cộng đồng. Tuy nhiên, đã 2 năm liên tiếp (2024-2025) sự kiện này không được tổ chức mà không có thông báo lý do hay kế hoạch tái tổ chức. Nhiều nhóm sinh viên đang có ý tưởng tốt, đã phát triển được MVP nhưng không có sân chơi để showcase và tìm kiếm nguồn hỗ trợ. Kính đề nghị Phòng KH&CN phục hồi và nâng cấp sự kiện Startup Day, tổ chức ít nhất 1 lần/năm, có sự tham gia của nhà đầu tư thiên thần, quỹ đầu tư mạo hiểm và doanh nghiệp công nghệ để tạo cơ hội thực sự cho sinh viên khởi nghiệp.',
        NULL,
        'VIOLATED_CONTENT',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000007',
        '2025-11-13 10:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000084',
        'Thiếu cơ chế hỗ trợ chuyển giao công nghệ từ đề tài NCKH sinh viên sang doanh nghiệp',
        'Nhóm nghiên cứu của em đã phát triển thành công một hệ thống giám sát năng lượng thông minh cho tòa nhà, được hội đồng đánh giá cao và có tiềm năng thương mại hóa rõ ràng. Tuy nhiên, khi muốn chuyển giao hoặc bán giải pháp cho doanh nghiệp, nhóm hoàn toàn không biết bắt đầu từ đâu: không có danh sách doanh nghiệp đối tác, không có mẫu hợp đồng chuyển giao công nghệ, không có tư vấn pháp lý và không có kênh kết nối chính thức. Đây là lãng phí lớn vì nhiều sản phẩm nghiên cứu tốt "chết" sau khi báo cáo nghiệm thu. Đề nghị Phòng KH&CN xây dựng sàn kết nối chuyển giao công nghệ, duy trì cơ sở dữ liệu doanh nghiệp có nhu cầu, và hỗ trợ pháp lý cho sinh viên trong quá trình thương mại hóa kết quả nghiên cứu.',
        NULL,
        'IN_PROGRESS',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000007',
        '2025-11-14 15:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000085',
        'Sinh viên nghiên cứu thiếu giảng viên hướng dẫn thường xuyên và chuyên sâu',
        'Phần lớn các nhóm NCKH sinh viên hiện nay chỉ được gặp giảng viên hướng dẫn 1-2 lần/tháng, và nhiều giảng viên do bận nhiều công việc giảng dạy và nghiên cứu riêng nên phản hồi email rất chậm. Thiếu sự hướng dẫn thường xuyên khiến sinh viên dễ đi lạc hướng, mất nhiều thời gian thử sai và kết quả cuối cùng kém chất lượng. Đề nghị Phòng KH&CN xây dựng chương trình Mentor NCKH chính thức, trong đó mỗi nhóm sinh viên có ít nhất 1 mentor cam kết họp định kỳ tối thiểu 2 lần/tháng và phản hồi trong vòng 48 giờ. Đồng thời, có thể mở rộng mạng lưới mentor bằng cách mời chuyên gia từ doanh nghiệp tham gia hướng dẫn các đề tài có tính ứng dụng cao.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-15 11:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000086',
        'Đề xuất thành lập không gian Innovation Hub trưng bày sản phẩm NCKH sinh viên',
        'Hiện tại các sản phẩm nghiên cứu của sinh viên sau khi nghiệm thu xong không có nơi trưng bày thường xuyên – chúng bị cất vào kho hoặc mang về nhà, không ai biết đến. Điều này rất lãng phí vì nhiều sản phẩm rất ấn tượng và có thể truyền cảm hứng cho các sinh viên khóa sau. Nhiều trường đại học đã xây dựng Innovation Hub – không gian trưng bày kết hợp co-working, nơi các sản phẩm được giới thiệu thường xuyên và khách tham quan, doanh nghiệp có thể tiếp cận. Đề nghị Phòng KH&CN phối hợp với trường dành một khu vực tại tầng trệt Tòa nhà A để xây dựng Innovation Hub, với tủ kính trưng bày, màn hình giới thiệu, và tổ chức open day định kỳ để giới thiệu sản phẩm NCKH đến cộng đồng.',
        'Tòa nhà A',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000001',
        '2025-11-16 14:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000087',
        'Sinh viên phải dùng phần mềm bản crack vì trường chưa cung cấp license bản quyền',
        'Nhiều sinh viên làm đề tài NCKH cần sử dụng các phần mềm chuyên ngành như Matlab, SolidWorks, AutoCAD, ANSYS, LabVIEW… nhưng phải dùng bản crack hoặc bản trial giới hạn vì giá license quá cao (hàng chục đến hàng trăm triệu đồng/năm). Điều này không chỉ vi phạm bản quyền phần mềm mà còn tiềm ẩn rủi ro bảo mật, kết quả nghiên cứu cũng không đảm bảo tính hợp lệ khi công bố. Nhiều trường đại học đã ký kết thỏa thuận campus license với nhà cung cấp để cung cấp miễn phí cho toàn bộ sinh viên và giảng viên. Đề nghị Phòng KH&CN chủ trì đàm phán campus license cho ít nhất các phần mềm phổ biến nhất trong nghiên cứu kỹ thuật, ưu tiên Matlab và SolidWorks trong năm học 2025-2026.',
        NULL,
        'AI_REVIEW_FAILED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000001',
        '2025-11-17 09:50:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000088',
        'Đầu tư cho các đội thi Robocon, CDIO và cuộc thi kỹ thuật quốc tế còn hạn chế',
        'Các cuộc thi như ABU Robocon, CDIO, VEX Robotics hay IEEE Student Branch Competition là cơ hội cực kỳ quý giá để sinh viên thể hiện năng lực kỹ thuật và xây dựng hồ sơ quốc tế. Tuy nhiên, kinh phí hỗ trợ từ trường cho các đội tuyển còn rất hạn chế, không đủ để mua nguyên vật liệu chế tạo robot và trang trải chi phí di chuyển, ăn ở khi thi đấu tại các địa điểm xa. Các đội tuyển phải tự xin tài trợ từ doanh nghiệp, rất bấp bênh và tốn nhiều thời gian. Kính đề nghị Phòng KH&CN xây dựng kế hoạch ngân sách bài bản hơn cho hoạt động thi đấu kỹ thuật quốc tế, đồng thời thiết lập mối quan hệ tài trợ dài hạn với doanh nghiệp thay vì để sinh viên tự lo từng năm.',
        NULL,
        'VIOLATED_CONTENT',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-18 16:40:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000089',
        'Đề xuất thành lập quỹ đầu tư hạt giống (seed fund) dành cho startup sinh viên',
        'Nhiều nhóm sinh viên có ý tưởng khởi nghiệp tiềm năng, đã qua giai đoạn ý tưởng và cần nguồn vốn nhỏ (từ 30 đến 100 triệu đồng) để phát triển sản phẩm thực tế và kiểm chứng thị trường. Hiện tại không có quỹ đầu tư mạo hiểm nào dành riêng cho sinh viên trường, khiến họ phải tìm đến các nguồn bên ngoài với rào cản lớn. Đề nghị Phòng KH&CN phối hợp với các đối tác doanh nghiệp và quỹ đầu tư để lập Seed Fund dành cho startup sinh viên, với quy mô ban đầu 500 triệu – 1 tỷ đồng, quy trình xét duyệt minh bạch, có mentor chuyên nghiệp đi kèm và cơ chế theo dõi sau đầu tư để tối đa hóa tỷ lệ thành công của các startup.',
        NULL,
        'IN_PROGRESS',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000007',
        '2025-11-19 10:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000090',
        'Đề nghị nhà trường hỗ trợ toàn bộ chi phí nộp đơn đăng ký sáng chế cho sinh viên',
        'Chi phí để đăng ký sáng chế tại Việt Nam, bao gồm phí nộp đơn, phí tra cứu, phí thẩm định và đặc biệt là phí dịch vụ luật sư sở hữu trí tuệ, lên đến 15-25 triệu đồng một trường hợp. Con số này hoàn toàn ngoài tầm với của sinh viên. Kết quả là nhiều giải pháp kỹ thuật sáng tạo bị bỏ ngỏ, không được bảo hộ, và có nguy cơ bị bên thứ ba đăng ký trước. Nhà trường sẽ được hưởng lợi trực tiếp từ số lượng sáng chế được bảo hộ – đây là chỉ số xếp hạng đại học quan trọng. Đề nghị Phòng KH&CN xây dựng chính sách hỗ trợ 100% chi phí đăng ký sáng chế cho sinh viên trường, kèm theo hỗ trợ pháp lý toàn trình từ soạn thảo đơn đến theo dõi kết quả thẩm định.',
        NULL,
        'RESOLVED',
        true,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-20 13:10:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000091',
        'Chưa có thông báo đăng ký đề tài NCKH cấp Bộ năm 2026',
        'Theo chu kỳ thông thường, thông báo đăng ký đề tài nghiên cứu khoa học cấp Bộ năm 2026 cần được phát hành vào quý 3 hoặc đầu quý 4 năm 2025 để giảng viên và sinh viên có đủ thời gian chuẩn bị hồ sơ. Tuy nhiên, đến nay (tháng 11/2025) vẫn chưa có bất kỳ thông báo nào từ Phòng KH&CN. Điều này gây khó khăn cho việc lập kế hoạch nghiên cứu dài hạn. Đề nghị Phòng KH&CN sớm cập nhật thông tin về kế hoạch đề tài cấp Bộ năm 2026, bao gồm lịch mở đăng ký, danh mục ưu tiên và hướng dẫn nộp hồ sơ, đồng thời tổ chức buổi tư vấn trực tiếp để hỗ trợ sinh viên và giảng viên trẻ lần đầu đăng ký.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-21 15:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000092',
        'Đề xuất tổ chức Hội nghị Khoa học Trẻ dành riêng cho sinh viên trình bày kết quả nghiên cứu',
        'Hiện nay sinh viên chủ yếu chỉ được báo cáo đề tài NCKH trong phòng kín trước hội đồng, thiếu cơ hội trình bày trước đông đảo khán giả và nhận phản hồi đa chiều từ cộng đồng học thuật. Đề nghị Phòng KH&CN tổ chức Hội nghị Khoa học Trẻ hằng năm – một sự kiện học thuật theo mô hình conference chuyên nghiệp, nơi sinh viên được trình bày poster và oral presentation, trao đổi với giảng viên, chuyên gia và sinh viên từ các trường bạn. Đây cũng là cơ hội để sinh viên rèn luyện kỹ năng trình bày khoa học bằng tiếng Anh – một năng lực ngày càng quan trọng trong bối cảnh hội nhập quốc tế. Nếu có thể, nên mời thêm đại diện từ các trường đại học quốc tế trong khu vực tham dự.',
        NULL,
        'AI_REVIEW_FAILED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-22 11:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000093',
        'Máy in 3D tại phòng Lab bị hỏng hơn 2 tháng chưa được sửa chữa',
        'Máy in 3D tại phòng Lab 3D đã bị hỏng từ khoảng đầu tháng 9/2025, tức là đã gần 3 tháng chưa hoạt động được. Đây là thiết bị quan trọng không thể thiếu đối với nhiều nhóm NCKH cần tạo prototype vật lý, đặc biệt trong các đề tài về cơ khí, tự động hóa và thiết kế sản phẩm. Tình trạng này khiến nhiều nhóm phải thuê dịch vụ in 3D bên ngoài với chi phí cao, hoặc phải thay đổi hướng thiết kế vì không có prototype để kiểm chứng. Đề nghị Phòng KH&CN phối hợp với bộ phận kỹ thuật ưu tiên sửa chữa hoặc thay thế máy in 3D trong thời gian sớm nhất, đồng thời xây dựng quy trình bảo trì định kỳ để tránh tình trạng tương tự tái diễn.',
        'Phòng Lab 3D',
        'VIOLATED_CONTENT',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000001',
        '2025-11-23 14:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000094',
        'Đội tuyển ABU Robocon 2026 cần kinh phí sớm để chuẩn bị từ giai đoạn đầu',
        'Cuộc thi ABU Robocon 2026 dự kiến diễn ra vào tháng 8/2026, nhưng để có robot thi đấu ở mức cạnh tranh, đội tuyển cần bắt đầu thiết kế và chế tạo từ ngay bây giờ (tháng 11/2025). Chi phí dự kiến cho toàn bộ quá trình chuẩn bị, bao gồm nguyên vật liệu, linh kiện điện tử, phần mềm và chi phí di chuyển đến vòng loại quốc gia, lên đến khoảng 80-120 triệu đồng. Năm ngoái kinh phí được phê duyệt quá muộn (tháng 3) khiến đội không có đủ thời gian hoàn thiện robot. Kính đề nghị Phòng KH&CN xem xét phê duyệt ngân sách sớm trong tháng 12/2025 để đội có thể triển khai kế hoạch chuẩn bị từ đầu năm 2026.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-25 09:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000095',
        'Đề xuất xây dựng chương trình tăng tốc khởi nghiệp (startup accelerator) 3-6 tháng tại trường',
        'Hiện tại các hoạt động hỗ trợ khởi nghiệp tại trường chủ yếu là các buổi workshop rời rạc, thiếu tính hệ thống và chiều sâu. Để thực sự tạo ra startup thành công, sinh viên cần được đào tạo bài bản theo lộ trình: từ phát triển ý tưởng, nghiên cứu thị trường, xây dựng MVP, đến pitching và gọi vốn. Mô hình startup accelerator 3-6 tháng đã được chứng minh hiệu quả tại nhiều trường đại học trên thế giới. Đề nghị Phòng KH&CN thiết kế chương trình accelerator chuyên nghiệp, có mentor từ cộng đồng startup thực tế, kết nối với hệ sinh thái đầu tư, và cấp chứng nhận hoàn thành được công nhận trong ngành, để tạo đòn bẩy thực sự cho phong trào khởi nghiệp sinh viên.',
        NULL,
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000007',
        '2025-11-27 16:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000096',
        'Đề nghị sớm công bố kế hoạch chi tiết đợt đề tài NCKH sinh viên năm 2026',
        'Để sinh viên có thể chuẩn bị tốt hồ sơ đề tài NCKH năm 2026 – từ chọn chủ đề, tìm giảng viên hướng dẫn, xây dựng nhóm nghiên cứu đến soạn thảo thuyết minh – cần có thông báo ít nhất 3 tháng trước thời điểm mở đăng ký. Hiện tại vẫn chưa có bất kỳ thông tin nào từ Phòng KH&CN về kế hoạch đợt NCKH 2026: không có lịch, không có danh mục chủ đề ưu tiên, không có thông tin về thay đổi quy định (nếu có). Đề nghị Phòng sớm ban hành kế hoạch chi tiết, bao gồm lịch mở đăng ký, tiêu chí chấm điểm, mức kinh phí dự kiến và danh sách giảng viên sẵn sàng hướng dẫn, để sinh viên chủ động lên kế hoạch từ học kỳ này.',
        NULL,
        'IN_PROGRESS',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000002',
        '2025-12-01 10:40:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000097',
        'Mong sớm có thông báo chính thức về Cuộc thi Ý tưởng Khởi nghiệp Sinh viên 2026',
        'Cuộc thi Ý tưởng Khởi nghiệp Sinh viên là hoạt động học thuật rất được sinh viên trường mong đợi, vì đây là cơ hội hiếm có để thử sức với môi trường kinh doanh thực tế và nhận phản hồi từ chuyên gia. Tuy nhiên, đến đầu tháng 12/2025 vẫn chưa có thông báo chính thức nào về phiên bản 2026 của cuộc thi: không biết khi nào mở đăng ký, thể lệ có thay đổi gì, và liệu cuộc thi năm tới có được tổ chức hay không. Nhiều nhóm đang có ý tưởng và muốn chuẩn bị từ sớm để có hồ sơ thuyết phục. Kính đề nghị Phòng KH&CN sớm công bố thông báo về cuộc thi ý tưởng 2026 ít nhất 3 tháng trước hạn nộp hồ sơ.',
        NULL,
        'VIOLATED_CONTENT',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000007',
        '2025-12-02 14:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000098',
        'Sinh viên có bài báo đăng tạp chí Q1 quốc tế chưa được thưởng xứng đáng',
        'Việc một sinh viên đại học có bài báo được chấp nhận đăng trên tạp chí Q1 quốc tế là thành tích xuất sắc, đòi hỏi nhiều tháng nghiên cứu nghiêm túc và đạt tiêu chuẩn phản biện quốc tế khắt khe. Tuy nhiên, chính sách khen thưởng hiện tại của trường chưa phản ánh đúng giá trị của thành tích này – mức thưởng còn thấp và chưa có cơ chế công nhận chính thức (ví dụ cộng điểm rèn luyện, miễn giảm học phí, hoặc ưu tiên trong xét học bổng). Đề nghị Phòng KH&CN đề xuất với Ban Giám hiệu xây dựng chính sách khen thưởng mới, trong đó mức thưởng cho bài báo Q1 ít nhất là 10-20 triệu đồng, cộng với các ưu đãi phi tài chính để tạo động lực cho sinh viên theo đuổi nghiên cứu chất lượng cao.',
        NULL,
        'AI_REVIEW_FAILED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000005',
        '2025-12-04 11:10:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000099',
        'Đề nghị đầu tư xây dựng phòng lab chuyên sâu về AI và IoT',
        'Trí tuệ nhân tạo (AI) và Internet of Things (IoT) đang là hai lĩnh vực công nghệ cốt lõi của cuộc cách mạng công nghiệp 4.0, thu hút rất nhiều sinh viên nghiên cứu và làm đề tài. Tuy nhiên, hiện tại trường chưa có phòng lab được trang bị chuyên biệt cho hai lĩnh vực này. Các nhóm nghiên cứu AI thiếu GPU mạnh và cơ sở hạ tầng điện toán hiệu năng cao, trong khi các nhóm IoT thiếu bo mạch, cảm biến, kit phát triển và môi trường thử nghiệm thực tế. Đề nghị Phòng KH&CN lập kế hoạch đầu tư phòng AI & IoT Lab với đầy đủ thiết bị hiện đại, có thể mở theo cơ chế đặt lịch linh hoạt cho tất cả sinh viên nghiên cứu, và cập nhật thiết bị định kỳ để theo kịp tốc độ phát triển của công nghệ.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000001',
        '2025-12-05 15:50:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000100',
        'Cần sớm lên kế hoạch Hội nghị NCKH Sinh viên 2026 để sinh viên chuẩn bị bài viết',
        'Hội nghị NCKH Sinh viên là sự kiện học thuật thường niên quan trọng nhất dành cho sinh viên nghiên cứu. Để sinh viên có thể chuẩn bị bài báo đạt chất lượng tốt – từ khâu thu thập dữ liệu, phân tích kết quả đến viết và chỉnh sửa theo phản hồi – cần có thông báo ít nhất 4-6 tháng trước ngày diễn ra. Tính đến tháng 12/2025, chưa có bất kỳ thông tin nào về Hội nghị NCKH Sinh viên 2026: không có ngày tổ chức, không có chủ đề định hướng, không có hướng dẫn định dạng bài viết. Kính đề nghị Phòng KH&CN sớm công bố kế hoạch tổ chức chi tiết, bao gồm lịch kêu gọi tóm tắt (call for abstract), hạn nộp bài, danh sách hội đồng phản biện và thể lệ trình bày, để sinh viên có đủ thời gian chuẩn bị bài báo chất lượng cao.',
        NULL,
        'REJECTED',
        true,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000003',
        '2025-12-07 09:30:00'
    );

INSERT INTO
    "Feedbacks" (
        "id",
        "subject",
        "description",
        "location",
        "currentStatus",
        "isPrivate",
        "userId",
        "departmentId",
        "categoryId",
        "createdAt"
    )
VALUES
    -- 4. Phòng Quan hệ quốc tế (d000...004) → 11 feedbacks
    (
        'f0000000-0000-0000-0000-000000000101',
        'Chương trình trao đổi sinh viên còn ít',
        'Chỉ có 2-3 trường đối tác, mong mở rộng sang Nhật, Hàn, Đức.',
        'NULL',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000004',
        'd0000000-0000-0000-0000-000000000004',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-04 10:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000102',
        'Học bổng du học toàn phần hiếm',
        'Hầu như chỉ có học bổng bán phần, sinh viên khó apply.',
        'NULL',
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000005',
        'd0000000-0000-0000-0000-000000000004',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-07 14:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000103',
        'Thông tin học bổng nước ngoài cập nhật chậm',
        'Nhiều học bổng deadline qua rồi mới đăng web.',
        'NULL',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000006',
        'd0000000-0000-0000-0000-000000000004',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-10 09:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000104',
        'Chưa có chương trình 2+2, 3+1',
        'Mong có liên kết cử nhân quốc tế chính quy.',
        'NULL',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000004',
        'd0000000-0000-0000-0000-000000000004',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-13 16:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000105',
        'Hỗ trợ visa du học chưa tốt',
        'Hướng dẫn thủ tục visa còn chung chung.',
        'NULL',
        'RESOLVED',
        true,
        'e0000000-0000-0000-0000-000000000010',
        'd0000000-0000-0000-0000-000000000004',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-16 11:10:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000106',
        'Thiếu hội thảo du học',
        'Cả năm chỉ có 1 buổi giới thiệu du học.',
        'NULL',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000011',
        'd0000000-0000-0000-0000-000000000004',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-19 13:25:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000107',
        'Chưa có lớp IELTS miễn phí',
        'Nhiều trường có lớp IELTS 7.0+ miễn phí cho sinh viên.',
        'NULL',
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000012',
        'd0000000-0000-0000-0000-000000000004',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-22 15:40:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000108',
        'Sinh viên quốc tế còn rất ít',
        'Trường chưa thu hút được sinh viên Lào, Campuchia, châu Phi.',
        'NULL',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000013',
        'd0000000-0000-0000-0000-000000000004',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-25 10:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000109',
        'Chương trình trao đổi ngắn hạn',
        'Mong có summer school 2-4 tuần ở nước ngoài.',
        'NULL',
        'PENDING',
        false,
        'e0000000-0000-0000-0000-000000000004',
        'd0000000-0000-0000-0000-000000000004',
        'c0000000-0000-0000-0000-000000000003',
        '2025-12-02 14:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000110',
        'Học bổng ASEAN',
        'Chưa thấy thông tin học bổng ASEAN năm 2026.',
        'NULL',
        'IN_PROGRESS',
        false,
        'e0000000-0000-0000-0000-000000000005',
        'd0000000-0000-0000-0000-000000000004',
        'c0000000-0000-0000-0000-000000000005',
        '2025-12-05 09:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000111',
        'Hỗ trợ chứng minh tài chính',
        'Nhiều sinh viên bị từ chối visa vì không có hướng dẫn rõ ràng.',
        'NULL',
        'PENDING',
        false,
        'e0000000-0000-0000-0000-000000000006',
        'd0000000-0000-0000-0000-000000000004',
        'c0000000-0000-0000-0000-000000000002',
        '2025-12-07 11:45:00'
    ),

-- 5. Phòng Thiết bị – Vật tư (d000...005) → 12 feedbacks
(
    'f0000000-0000-0000-0000-000000000112',
    'Máy chiếu phòng học hay hỏng',
    'Hơn 30% máy chiếu không hoạt động ổn định.',
    'Tòa nhà B',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000005',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-03 08:10:00'
),
(
    'f0000000-0000-0000-0000-000000000113',
    'Thiếu máy tính phòng thực hành',
    'Phòng máy chỉ có 25 máy cho lớp hơn 50 sinh viên.',
    'Phòng C301',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000011',
    'd0000000-0000-0000-0000-000000000005',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-06 13:20:00'
),
(
    'f0000000-0000-0000-0000-000000000114',
    'Quy trình mượn thiết bị phức tạp',
    'Phải qua 4 bước ký duyệt mới mượn được máy ảnh.',
    'NULL',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000012',
    'd0000000-0000-0000-0000-000000000005',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-09 10:40:00'
),
(
    'f0000000-0000-0000-0000-000000000115',
    'Máy lạnh phòng học không mát',
    'Nhiều phòng học nhiệt độ trên 30 độ.',
    'Tòa nhà A',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000013',
    'd0000000-0000-0000-0000-000000000005',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-12 15:15:00'
),
(
    'f0000000-0000-0000-0000-000000000116',
    'Thiếu linh kiện điện tử',
    'Kho linh kiện cho môn vi điều khiển thường xuyên hết.',
    'Lab Điện tử',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000014',
    'd0000000-0000-0000-0000-000000000005',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-15 11:30:00'
),
(
    'f0000000-0000-0000-0000-000000000117',
    'Bảng trắng bẩn, khó viết',
    'Nhiều lớp bảng bị ố vàng, viết không rõ.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000015',
    'd0000000-0000-0000-0000-000000000005',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-18 09:00:00'
),
(
    'f0000000-0000-0000-0000-000000000118',
    'Micro phòng học nhỏ yếu',
    'Giảng viên nói sinh viên cuối lớp không nghe rõ.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000016',
    'd0000000-0000-0000-0000-000000000005',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-21 14:50:00'
),
(
    'f0000000-0000-0000-0000-000000000119',
    'Thiếu ghế phòng học',
    'Có lớp phải ngồi ghế nhựa hoặc đứng.',
    'Tòa nhà E',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000017',
    'd0000000-0000-0000-0000-000000000005',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-24 10:20:00'
),
(
    'f0000000-0000-0000-0000-000000000120',
    'Máy in lab hỏng lâu',
    'Máy in A3 ở lab đồ họa hỏng hơn 1 tháng.',
    'Lab Đồ họa',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000020',
    'd0000000-0000-0000-0000-000000000005',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-27 16:10:00'
),
(
    'f0000000-0000-0000-0000-000000000121',
    'Cần mua thêm máy CNC',
    'Lab cơ khí chỉ có 1 máy CNC cho toàn trường.',
    'Xưởng Cơ khí',
    'PENDING',
    false,
    'e0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000005',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-01 13:40:00'
),
(
    'f0000000-0000-0000-0000-000000000122',
    'Thiết bị thực hành ô tô cũ',
    'Xe thực hành đã hơn 15 năm tuổi.',
    'Xưởng Ô tô',
    'IN_PROGRESS',
    false,
    'e0000000-0000-0000-0000-000000000011',
    'd0000000-0000-0000-0000-000000000005',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-04 09:25:00'
),
(
    'f0000000-0000-0000-0000-000000000123',
    'Cần nâng cấp wifi toàn trường',
    'Tốc độ wifi hiện tại chỉ 5-10 Mbps.',
    'NULL',
    'PENDING',
    false,
    'e0000000-0000-0000-0000-000000000012',
    'd0000000-0000-0000-0000-000000000005',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-06 15:30:00'
),

-- 6. Phòng Quản trị chiến lược (d000...006) → 13 feedbacks
(
    'f0000000-0000-0000-0000-000000000124',
    'Chưa công bố chiến lược 2026-2030',
    'Sinh viên muốn biết định hướng phát triển trường.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000013',
    'd0000000-0000-0000-0000-000000000006',
    'c0000000-0000-0000-0000-000000000007',
    '2025-11-05 11:15:00'
),
(
    'f0000000-0000-0000-0000-000000000125',
    'Chỉ tiêu tuyển sinh không thực tế',
    'Nhiều ngành tuyển vượt chỉ tiêu dẫn đến quá tải phòng học.',
    'NULL',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000014',
    'd0000000-0000-0000-0000-000000000006',
    'c0000000-0000-0000-0000-000000000002',
    '2025-11-08 14:20:00'
),
(
    'f0000000-0000-0000-0000-000000000126',
    'Chưa có khảo sát sinh viên định kỳ',
    'Không biết sinh viên nghĩ gì về chất lượng đào tạo.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000015',
    'd0000000-0000-0000-0000-000000000006',
    'c0000000-0000-0000-0000-000000000007',
    '2025-11-11 09:40:00'
),
(
    'f0000000-0000-0000-0000-000000000127',
    'Xếp hạng trường giảm',
    'Từ top 20 xuống top 35 trong bảng xếp hạng VN.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000016',
    'd0000000-0000-0000-0000-000000000006',
    'c0000000-0000-0000-0000-000000000007',
    '2025-11-14 13:10:00'
),
(
    'f0000000-0000-0000-0000-000000000128',
    'Chưa có kế hoạch tự chủ đại học',
    'Nhiều trường đã tự chủ, trường mình vẫn phụ thuộc ngân sách.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000017',
    'd0000000-0000-0000-0000-000000000006',
    'c0000000-0000-0000-0000-000000000007',
    '2025-11-17 16:30:00'
),
(
    'f0000000-0000-0000-0000-000000000129',
    'KPIs giảng viên chưa công khai',
    'Sinh viên không biết tiêu chí đánh giá giảng viên.',
    'NULL',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000020',
    'd0000000-0000-0000-0000-000000000006',
    'c0000000-0000-0000-0000-000000000004',
    '2025-11-20 10:50:00'
),
(
    'f0000000-0000-0000-0000-000000000130',
    'Chưa có báo cáo thường niên',
    'Muốn đọc báo cáo hoạt động và tài chính của trường.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000021',
    'd0000000-0000-0000-0000-000000000006',
    'c0000000-0000-0000-0000-000000000007',
    '2025-11-23 14:15:00'
),
(
    'f0000000-0000-0000-0000-000000000131',
    'Định hướng ngành mới',
    'Mong trường mở thêm ngành Trí tuệ nhân tạo, An ninh mạng.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000022',
    'd0000000-0000-0000-0000-000000000006',
    'c0000000-0000-0000-0000-000000000002',
    '2025-11-26 11:20:00'
),
(
    'f0000000-0000-0000-0000-000000000132',
    'Tỷ lệ sinh viên có việc làm',
    'Chưa công bố tỷ lệ việc làm sau 12 tháng tốt nghiệp.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000013',
    'd0000000-0000-0000-0000-000000000006',
    'c0000000-0000-0000-0000-000000000007',
    '2025-11-29 15:45:00'
),
(
    'f0000000-0000-0000-0000-000000000133',
    'Chiến lược quốc tế hóa',
    'Trường cần mục tiêu cụ thể về tỷ lệ sinh viên quốc tế.',
    'NULL',
    'PENDING',
    false,
    'e0000000-0000-0000-0000-000000000014',
    'd0000000-0000-0000-0000-000000000006',
    'c0000000-0000-0000-0000-000000000007',
    '2025-12-01 10:30:00'
),
(
    'f0000000-0000-0000-0000-000000000134',
    'Kế hoạch xây dựng cơ sở 2',
    'Chưa thấy lộ trình xây dựng campus mới.',
    'NULL',
    'IN_PROGRESS',
    false,
    'e0000000-0000-0000-0000-000000000015',
    'd0000000-0000-0000-0000-000000000006',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-03 14:00:00'
),
(
    'f0000000-0000-0000-0000-000000000135',
    'Chỉ tiêu nghiên cứu khoa học',
    'Mục tiêu bài báo Scopus của giảng viên quá thấp.',
    'NULL',
    'PENDING',
    false,
    'e0000000-0000-0000-0000-000000000016',
    'd0000000-0000-0000-0000-000000000006',
    'c0000000-0000-0000-0000-000000000007',
    '2025-12-05 09:15:00'
),
(
    'f0000000-0000-0000-0000-000000000136',
    'Chiến lược chuyển đổi số',
    'Trường cần lộ trình chuyển đổi số toàn diện 2026-2030.',
    'NULL',
    'IN_PROGRESS',
    false,
    'e0000000-0000-0000-0000-000000000017',
    'd0000000-0000-0000-0000-000000000006',
    'c0000000-0000-0000-0000-000000000007',
    '2025-12-07 13:40:00'
),

-- 7. Phòng Đảm bảo chất lượng (d000...007) → 14 feedbacks
(
    'f0000000-0000-0000-0000-000000000137',
    'Chưa công bố kết quả AUN-QA',
    'Nhiều ngành đã đánh giá ngoài nhưng không công khai báo cáo.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000020',
    'd0000000-0000-0000-0000-000000000007',
    'c0000000-0000-0000-0000-000000000002',
    '2025-11-06 10:20:00'
),
(
    'f0000000-0000-0000-0000-000000000138',
    'Khảo sát sinh viên ít quá',
    'Chỉ khảo sát 1 lần/năm, không đủ để cải tiến.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000021',
    'd0000000-0000-0000-0000-000000000007',
    'c0000000-0000-0000-0000-000000000002',
    '2025-11-09 13:30:00'
),
(
    'f0000000-0000-0000-0000-000000000139',
    'Chưa có kiểm định ABET',
    'Ngành CNTT, Điện tử cần kiểm định ABET để ra trường quốc tế.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000022',
    'd0000000-0000-0000-0000-000000000007',
    'c0000000-0000-0000-0000-000000000002',
    '2025-11-12 15:50:00'
),
(
    'f0000000-0000-0000-0000-000000000140',
    'Điểm chuẩn đánh giá giảng viên thấp',
    'Sinh viên chấm giảng viên trung bình 6.5/10 là không ổn.',
    'NULL',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000030',
    'd0000000-0000-0000-0000-000000000007',
    'c0000000-0000-0000-0000-000000000004',
    '2025-11-15 11:10:00'
),
(
    'f0000000-0000-0000-0000-000000000141',
    'Chưa có minh chứng chuẩn đầu ra',
    'Sinh viên không biết mình đã đạt CLO nào.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000031',
    'd0000000-0000-0000-0000-000000000007',
    'c0000000-0000-0000-0000-000000000002',
    '2025-11-18 14:20:00'
),
(
    'f0000000-0000-0000-0000-000000000142',
    'Tỷ lệ thôi học cao',
    'Ngành Xây dựng tỷ lệ thôi học trên 15%.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000032',
    'd0000000-0000-0000-0000-000000000007',
    'c0000000-0000-0000-0000-000000000002',
    '2025-11-21 09:40:00'
),
(
    'f0000000-0000-0000-0000-000000000143',
    'Chưa công khai báo cáo tự đánh giá',
    'Báo cáo tự đánh giá chu kỳ 2020-2025 chưa thấy.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000033',
    'd0000000-0000-0000-0000-000000000007',
    'c0000000-0000-0000-0000-000000000007',
    '2025-11-24 16:15:00'
),
(
    'f0000000-0000-0000-0000-000000000144',
    'Khảo sát doanh nghiệp',
    'Chưa thấy kết quả khảo sát nhà tuyển dụng về chất lượng sinh viên.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000040',
    'd0000000-0000-0000-0000-000000000007',
    'c0000000-0000-0000-0000-000000000002',
    '2025-11-27 10:30:00'
),
(
    'f0000000-0000-0000-0000-000000000145',
    'Chưa có hệ thống E-learning chuẩn',
    'Nền tảng học online còn lỗi, không đồng bộ.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000041',
    'd0000000-0000-0000-0000-000000000007',
    'c0000000-0000-0000-0000-000000000002',
    '2025-11-30 13:45:00'
),
(
    'f0000000-0000-0000-0000-000000000146',
    'Kiểm định chương trình đào tạo',
    'Ngành Kinh tế chưa đạt chuẩn AUN.',
    'NULL',
    'PENDING',
    false,
    'e0000000-0000-0000-0000-000000000042',
    'd0000000-0000-0000-0000-000000000007',
    'c0000000-0000-0000-0000-000000000002',
    '2025-12-02 11:20:00'
),
(
    'f0000000-0000-0000-0000-000000000147',
    'Chỉ số hài lòng sinh viên',
    'Mong công khai chỉ số hài lòng theo từng năm.',
    'NULL',
    'IN_PROGRESS',
    false,
    'e0000000-0000-0000-0000-000000000043',
    'd0000000-0000-0000-0000-000000000007',
    'c0000000-0000-0000-0000-000000000007',
    '2025-12-04 15:10:00'
),
(
    'f0000000-0000-0000-0000-000000000148',
    'Đánh giá ngoài định kỳ',
    'Chu kỳ đánh giá ngoài đã 6 năm chưa thực hiện lại.',
    'NULL',
    'PENDING',
    false,
    'e0000000-0000-0000-0000-000000000020',
    'd0000000-0000-0000-0000-000000000007',
    'c0000000-0000-0000-0000-000000000002',
    '2025-12-06 09:50:00'
),
(
    'f0000000-0000-0000-0000-000000000149',
    'Khảo sát cựu sinh viên',
    'Chưa có khảo sát cựu sinh viên sau 3-5 năm ra trường.',
    'NULL',
    'PENDING',
    false,
    'e0000000-0000-0000-0000-000000000021',
    'd0000000-0000-0000-0000-000000000007',
    'c0000000-0000-0000-0000-000000000007',
    '2025-12-07 14:30:00'
),
(
    'f0000000-0000-0000-0000-000000000150',
    'Chất lượng chương trình CLC',
    'Chương trình chất lượng cao chưa khác biệt nhiều so với đại trà.',
    'NULL',
    'IN_PROGRESS',
    false,
    'e0000000-0000-0000-0000-000000000022',
    'd0000000-0000-0000-0000-000000000007',
    'c0000000-0000-0000-0000-000000000002',
    '2025-12-07 16:45:00'
),

-- 8. Phòng Tổ chức Hành chính (d000...008) → 15 feedbacks
(
    'f0000000-0000-0000-0000-000000000151',
    'Xử lý hồ sơ chậm',
    'Làm giấy xác nhận sinh viên mất 2 tuần.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000030',
    'd0000000-0000-0000-0000-000000000008',
    'c0000000-0000-0000-0000-000000000002',
    '2025-11-05 09:30:00'
),
(
    'f0000000-0000-0000-0000-000000000152',
    'Thái độ nhân viên hành chính',
    'Một số cán bộ nói chuyện thiếu thân thiện.',
    'Phòng A402',
    'REJECTED',
    true,
    'e0000000-0000-0000-0000-000000000031',
    'd0000000-0000-0000-0000-000000000008',
    'c0000000-0000-0000-0000-000000000004',
    '2025-11-08 11:45:00'
),
(
    'f0000000-0000-0000-0000-000000000153',
    'Giờ làm việc hành chính bất tiện',
    'Chỉ làm đến 16h30, sinh viên học chiều không kịp.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000032',
    'd0000000-0000-0000-0000-000000000008',
    'c0000000-0000-0000-0000-000000000007',
    '2025-11-11 14:20:00'
),
(
    'f0000000-0000-0000-0000-000000000154',
    'An ninh trường lỏng lẻo',
    'Người ngoài tự do ra vào không kiểm soát.',
    'Cổng trường',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000033',
    'd0000000-0000-0000-0000-000000000008',
    'c0000000-0000-0000-0000-000000000006',
    '2025-11-14 10:10:00'
),
(
    'f0000000-0000-0000-0000-000000000155',
    'Làm xác nhận học phí chậm',
    'Cần gấp để vay ngân hàng nhưng chờ 10 ngày.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000040',
    'd0000000-0000-0000-0000-000000000008',
    'c0000000-0000-0000-0000-000000000005',
    '2025-11-17 13:30:00'
),
(
    'f0000000-0000-0000-0000-000000000156',
    'Chưa có dịch vụ hành chính online',
    'Vẫn phải xếp hàng nộp hồ sơ giấy.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000041',
    'd0000000-0000-0000-0000-000000000008',
    'c0000000-0000-0000-0000-000000000002',
    '2025-11-20 15:50:00'
),
(
    'f0000000-0000-0000-0000-000000000157',
    'Bảo vệ trường thái độ',
    'Bảo vệ hay gây khó dễ khi gửi xe.',
    'Cổng trường',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000042',
    'd0000000-0000-0000-0000-000000000008',
    'c0000000-0000-0000-0000-000000000006',
    '2025-11-23 09:20:00'
),
(
    'f0000000-0000-0000-0000-000000000158',
    'Làm lại thẻ sinh viên lâu',
    'Mất thẻ phải chờ 3 tuần mới có thẻ mới.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000043',
    'd0000000-0000-0000-0000-000000000008',
    'c0000000-0000-0000-0000-000000000007',
    '2025-11-26 11:40:00'
),
(
    'f0000000-0000-0000-0000-000000000159',
    'Không có bảng hướng dẫn hành chính',
    'Sinh viên mới không biết nộp hồ sơ ở đâu.',
    'Tòa nhà A',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000030',
    'd0000000-0000-0000-0000-000000000008',
    'c0000000-0000-0000-0000-000000000007',
    '2025-11-29 14:15:00'
),
(
    'f0000000-0000-0000-0000-000000000160',
    'Xử lý đơn khiếu nại chậm',
    'Đơn khiếu nại gửi từ tháng 9 đến nay chưa trả lời.',
    'NULL',
    'PENDING',
    false,
    'e0000000-0000-0000-0000-000000000031',
    'd0000000-0000-0000-0000-000000000008',
    'c0000000-0000-0000-0000-000000000007',
    '2025-12-01 10:30:00'
),
(
    'f0000000-0000-0000-0000-000000000161',
    'Hệ thống camera an ninh',
    'Nhiều khu vực chưa có camera giám sát.',
    'Khuôn viên',
    'IN_PROGRESS',
    false,
    'e0000000-0000-0000-0000-000000000032',
    'd0000000-0000-0000-0000-000000000008',
    'c0000000-0000-0000-0000-000000000006',
    '2025-12-03 13:20:00'
),
(
    'f0000000-0000-0000-0000-000000000162',
    'Quy trình ký túc xá',
    'Làm hồ sơ nội trú mất quá nhiều giấy tờ.',
    'NULL',
    'PENDING',
    false,
    'e0000000-0000-0000-0000-000000000033',
    'd0000000-0000-0000-0000-000000000008',
    'c0000000-0000-0000-0000-000000000007',
    '2025-12-05 15:45:00'
),
(
    'f0000000-0000-0000-0000-000000000163',
    'Lễ tân khánh tiết',
    'Lễ tân tiếp khách quốc tế còn thiếu chuyên nghiệp.',
    'Tòa nhà A',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000040',
    'd0000000-0000-0000-0000-000000000008',
    'c0000000-0000-0000-0000-000000000007',
    '2025-12-06 09:10:00'
),
(
    'f0000000-0000-0000-0000-000000000164',
    'Dịch vụ hành chính một cửa',
    'Mong có quầy một cửa để giải quyết nhanh.',
    'NULL',
    'PENDING',
    false,
    'e0000000-0000-0000-0000-000000000041',
    'd0000000-0000-0000-0000-000000000008',
    'c0000000-0000-0000-0000-000000000007',
    '2025-12-07 11:30:00'
),
(
    'f0000000-0000-0000-0000-000000000165',
    'Bảo vệ đêm',
    'Cần tăng cường bảo vệ trực đêm ở ký túc xá.',
    'Ký túc xá',
    'IN_PROGRESS',
    false,
    'e0000000-0000-0000-0000-000000000042',
    'd0000000-0000-0000-0000-000000000008',
    'c0000000-0000-0000-0000-000000000006',
    '2025-12-07 16:20:00'
),

-- 9. Phòng Quản trị cơ sở vật chất (d000...009) → 17 feedbacks
(
    'f0000000-0000-0000-0000-000000000166',
    'Tình trạng nhà vệ sinh xuống cấp và mất vệ sinh nghiêm trọng',
    'Hiện tại, hệ thống nhà vệ sinh tại khu vực tầng 3 và tầng 4 của Tòa nhà B thường xuyên rơi vào tình trạng bẩn thỉu do thiếu nhân viên lao công dọn dẹp định kỳ. Ngoài ra, các bồn rửa tay thường xuyên hết xà phòng, vòi nước bị rò rỉ gây ngập úng nhẹ trên sàn và hoàn toàn không có giấy vệ sinh, gây ảnh hưởng cực kỳ lớn đến sinh hoạt của sinh viên và giảng viên giữa các tiết học.',
    'Tòa nhà B',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-04 12:10:00'
),
(
    'f0000000-0000-0000-0000-000000000167',
    'Sự cố mất điện cục bộ đột ngột diễn ra liên tục ảnh hưởng giờ học',
    'Trong khoảng hai tuần trở lại đây, tình trạng mất điện đột ngột đã xảy ra từ 2 đến 3 lần mỗi tuần ngay trong khung giờ học cao điểm. Việc này không chỉ làm gián đoạn bài giảng của giảng viên, khiến các thiết bị như máy chiếu, máy tính thực hành tắt đột ngột nguy cơ gây hư hỏng phần cứng, mà còn làm phòng học trở nên rất ngột ngạt và nóng bức.',
    'Toàn trường',
    'AI_REVIEW_FAILED',
    false,
    'e0000000-0000-0000-0000-000000000011',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-07 15:30:00'
),
(
    'f0000000-0000-0000-0000-000000000168',
    'Đề xuất lắp đặt thêm hệ thống máy lọc nước uống nóng lạnh miễn phí',
    'Hiện số lượng cây nước uống miễn phí tại các khu vực giảng đường công cộng còn rất hạn chế, sinh viên phải di chuyển xa hoặc xuống căng tin mua nước đóng chai gây tốn kém và phát thải rác thải nhựa. Kính mong Nhà trường xem xét lắp đặt bổ sung thêm các máy lọc nước uống nóng lạnh tại hành lang các tòa nhà lớn để phục vụ nhu cầu thiết yếu của sinh viên.',
    'NULL',
    'VIOLATED_CONTENT',
    false,
    'e0000000-0000-0000-0000-000000000012',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-10 10:20:00'
),
(
    'f0000000-0000-0000-0000-000000000169',
    'Thiếu thốn hệ thống cây xanh bóng mát trong khuôn viên trường',
    'Khuôn viên trung tâm của trường hiện tại có diện tích bê tông hóa quá lớn nhưng lại có rất ít cây xanh tán rộng để che bóng mát. Vào mùa hè, ánh nắng chiếu trực tiếp xuống sân trường tạo ra hiện tượng bức xạ nhiệt rất lớn, khiến không khí oi bức, ngột ngạt, sinh viên không có không gian thoáng đãng để ôn bài hoặc nghỉ ngơi ngoài trời.',
    'Khuôn viên',
    'IN_PROGRESS',
    false,
    'e0000000-0000-0000-0000-000000000013',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-13 14:40:00'
),
(
    'f0000000-0000-0000-0000-000000000170',
    'Quá tải bãi giữ xe máy sinh viên và tình trạng chèo kéo bên ngoài',
    'Vào các khung giờ cao điểm đầu giờ sáng hoặc đầu giờ chiều, bãi xe máy bên trong trường luôn rơi vào trạng thái quá tải nghiêm trọng, bảo vệ đóng cửa không cho vào. Sinh viên buộc phải mang xe ra gửi tại các bãi tự phát bên ngoài khuôn viên trường với chi phí rất đắt đỏ, thường xuyên bị chèo kéo và không đảm bảo an toàn mất mát tài sản.',
    'Bãi xe',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000014',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-16 09:15:00'
),
(
    'f0000000-0000-0000-0000-000000000171',
    'Hệ thống đường nội bộ bị sụt lún và ngập úng cục bộ khi trời mưa',
    'Đoạn đường nội bộ dẫn từ cổng chính đi vào khu vực sảnh Tòa nhà A đang xuất hiện nhiều điểm sụt lún, tạo thành các hố sâu tích nước. Mỗi khi trời mưa lớn, khu vực này bị ngập úng cục bộ, nước bẩn bắn tung tóe khi có phương tiện di chuyển qua, gây nguy hiểm cho các bạn sinh viên đi bộ và làm mất đi mỹ quan chung của nhà trường.',
    'Đường nội bộ',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000015',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-19 11:50:00'
),
(
    'f0000000-0000-0000-0000-000000000172',
    'Hệ thống thang máy Tòa nhà C thường xuyên gặp sự cố kỹ thuật',
    'Thang máy số 2 tại Tòa nhà C liên tục gặp các sự cố kỹ thuật như kẹt cửa, không nhận tầng hoặc rung lắc mạnh trong quá trình vận hành, gây tâm lý hoang mang lo sợ cho sinh viên và thầy cô khi sử dụng. Rất mong bộ phận kỹ thuật của phòng quản trị kiểm tra toàn diện, bảo trì định kỳ hoặc thay thế linh kiện để đảm bảo an toàn tính mạng.',
    'Tòa nhà C',
    'AI_REVIEW_FAILED',
    false,
    'e0000000-0000-0000-0000-000000000016',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-22 13:20:00'
),
(
    'f0000000-0000-0000-0000-000000000173',
    'Công suất hệ thống điều hòa không đủ làm mát trong các phòng học lớn',
    'Một số phòng học lý thuyết diện tích lớn tại Tòa nhà E hiện tại chỉ được trang bị 2 máy lạnh công suất nhỏ, kết hợp với quạt trần đã cũ kỹ. Vào những ngày thời tiết nắng nóng đỉnh điểm, lượng sinh viên tập trung đông khiến nhiệt độ phòng cực kỳ oi bức, ngột ngạt, làm giảm khả năng tập trung tiếp thu bài vở của người học.',
    'Tòa nhà E',
    'VIOLATED_CONTENT',
    false,
    'e0000000-0000-0000-0000-000000000017',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-25 16:10:00'
),
(
    'f0000000-0000-0000-0000-000000000174',
    'Tồn đọng rác thải tại các khu vực công cộng không được thu gom trong ngày',
    'Tại khu vực ghế đá xung quanh khuôn viên trường, tình trạng rác thải sinh hoạt, ly nhựa và hộp thức ăn thừa bị tồn đọng qua 2-3 ngày mà không thấy nhân viên vệ sinh đi thu gom. Rác bốc mùi hôi thối khó chịu, thu hút ruồi muỗi, gây ô nhiễm môi trường nghiêm trọng và làm ảnh hưởng lớn đến không gian sinh hoạt chung ngoài trời.',
    'Khuôn viên',
    'IN_PROGRESS',
    false,
    'e0000000-0000-0000-0000-000000000020',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-28 10:30:00'
),
(
    'f0000000-0000-0000-0000-000000000175',
    'Đề xuất lắp đặt thêm hệ thống ghế đá phục vụ tự học ngoài trời',
    'Nhu cầu học nhóm và nghỉ ngơi của sinh viên sau các giờ học trên lớp là rất lớn, tuy nhiên số lượng ghế đá dưới các bóng cây ở khuôn viên hiện tại quá ít. Nhiều bạn phải ngồi vạ vật ở bậc thềm sảnh tòa nhà hoặc hành lang đi lại rất mất mỹ quan. Kính mong phòng cơ sở vật chất bổ sung thêm ghế đá tại khu vực râm mát.',
    'Khuôn viên',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000021',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-01 14:45:00'
),
(
    'f0000000-0000-0000-0000-000000000176',
    'Hệ thống phòng cháy chữa cháy (PCCC) có dấu hiệu hết hạn kiểm định',
    'Tôi có đi kiểm tra thử một số bình chữa cháy dạng bột được treo dọc hành lang các tầng của các tòa nhà thì phát hiện kim đồng hồ áp suất đã chỉ về vạch đỏ (hết áp lực) và hạn kiểm định ghi trên tem đã quá hạn từ lâu. Đây là mối nguy hiểm tiềm ẩn cực lớn nếu chẳng may có sự cố hỏa hoạn xảy ra trong trường.',
    'Các tòa nhà',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000022',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000006',
    '2025-12-02 09:20:00'
),
(
    'f0000000-0000-0000-0000-000000000177',
    'Sân bóng đá cỏ nhân tạo thuộc khu thể thao bị xuống cấp trầm trọng',
    'Mặt sân bóng đá cỏ nhân tạo hiện tại đã bị bong tróc phần lớn lớp cỏ mượt, trơ ra nền bê tông cứng và các hạt cao su bị dồn cục, tạo thành nhiều chỗ gồ ghề nguy hiểm. Sinh viên khi tham gia môn học Giáo dục thể chất hoặc đá bóng giao lưu thường xuyên bị trượt ngã, trầy xước và chấn thương khớp lật cổ chân.',
    'Sân thể thao',
    'AI_REVIEW_FAILED',
    false,
    'e0000000-0000-0000-0000-000000000030',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-03 15:10:00'
),
(
    'f0000000-0000-0000-0000-000000000178',
    'Mái che bãi giữ xe bị dột nát gây ướt phương tiện khi trời mưa',
    'Hệ thống mái tôn che chắn tại bãi giữ xe máy số 2 đã quá cũ kỹ, xuất hiện nhiều vết thủng lớn và hở ron nối. Khi trời mưa, nước mưa xối trực tiếp xuống làm ướt sũng yên xe, để lâu ngày nước lọt vào ổ khóa và các bộ phận máy móc gây hư hỏng, rỉ sét phương tiện đi lại của cán bộ công nhân viên lẫn sinh viên.',
    'Bãi xe',
    'VIOLATED_CONTENT',
    false,
    'e0000000-0000-0000-0000-000000000031',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-04 11:40:00'
),
(
    'f0000000-0000-0000-0000-000000000179',
    'Tường ngoài các tòa nhà bị bong tróc sơn, rêu mốc gây mất mỹ quan',
    'Mặt tường phía ngoài của Tòa nhà A trải qua nhiều năm mùa mưa bão hiện đã bị ố vàng, mọc rêu mốc đen kịt và nhiều mảng sơn lớn bị bong tróc rụng xuống sảnh. Điều này làm cho diện mạo tổng thể của nhà trường trông rất cũ kỹ, xuống cấp, không tương xứng với một môi trường giáo dục hiện đại, chuyên nghiệp.',
    'Tòa nhà A',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000032',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-05 13:25:00'
),
(
    'f0000000-0000-0000-0000-000000000180',
    'Khu vực hồ bơi sinh viên đã nghiệm thu lâu năm nhưng chưa mở cửa',
    'Dự án hồ bơi phục vụ môn bơi lội và rèn luyện thể chất cho sinh viên đã thấy hoàn thiện xây dựng, bơm nước hoàn chỉnh cách đây gần 2 năm nhưng đến nay vẫn đóng cửa im lìm, không thấy đưa vào hoạt động khai thác. Sinh viên mong muốn phòng chức năng giải thích rõ lý do và sớm mở cửa phục vụ nhu cầu thể thao.',
    'Khu thể thao',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000033',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-06 10:15:00'
),
(
    'f0000000-0000-0000-0000-000000000181',
    'Thiếu hụt trầm trọng thùng phân loại rác tại khuôn viên khu vực căng tin',
    'Tại khu vực căng tin tập trung ăn uống đông đúc của sinh viên, số lượng thùng rác bố trí quá ít và không có nhãn mác hướng dẫn phân loại rác vô cơ, rác hữu cơ. Do đó, rác thải thường bị vứt tràn lan ra mặt bàn, mặt đất xung quanh thùng rác, gây mất vệ sinh an toàn thực phẩm tại khu ăn uống.',
    'Căng tin',
    'IN_PROGRESS',
    false,
    'e0000000-0000-0000-0000-000000000040',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-07 12:30:00'
),
(
    'f0000000-0000-0000-0000-000000000182',
    'Hệ thống đèn cao áp chiếu sáng ban đêm tại các lối đi nội bộ bị hỏng',
    'Một số khu vực đường đi bộ góc khuất phía sau các tòa nhà nối liền ra bãi xe ban đêm rất tối do các bóng đèn cao áp chiếu sáng công cộng đã bị cháy từ lâu nhưng chưa được thay thế. Sinh viên học các ca tối muộn khi đi qua khu vực này cảm thấy rất bất an vì tiềm ẩn nguy cơ mất an ninh trật tự, trộm cắp tài sản.',
    'Khuôn viên',
    'VIOLATED_CONTENT',
    false,
    'e0000000-0000-0000-0000-000000000041',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000006',
    '2025-12-07 16:50:00'
),

-- BỔ SUNG THÊM 10 FEEDBACKS MỚI CHO PHÒNG QUẢN TRỊ CƠ SỞ VẬT CHẤT
(
    'f0000000-0000-0000-0000-000000000183',
    'Bàn ghế phòng học lý thuyết bị gãy hỏng rách nát nệm da gây chấn thương',
    'Tại các dãy phòng học tầng 5 tòa trung tâm, rất nhiều bộ bàn ghế liền kề bị lỏng ốc vít rơ lắc, một số ghế nệm da thì bị rách lòi lò xo sắt nhọn ra ngoài. Nhiều bạn sinh viên khi ngồi học sơ ý đã bị móc rách quần áo, thậm chí trầy xước da chảy máu. Đề xuất phòng quản trị rà soát và thu hồi sửa chữa gấp.',
    'Tòa nhà trung tâm',
    'AI_REVIEW_FAILED',
    false,
    'e0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-08 08:30:00'
),
(
    'f0000000-0000-0000-0000-000000000184',
    'Thủ tục mượn phòng học phục vụ hoạt động ngoại khóa còn quá rườm rà',
    'Mỗi khi các câu lạc bộ đội nhóm cần mượn phòng học trống để tổ chức họp tuần hoặc tập luyện văn nghệ, quy trình ký giấy tờ qua lại giữa các bên mất từ 3-5 ngày và bắt buộc phải lấy chữ ký trực tiếp rất mất thời gian. Đề xuất phòng QTCSVC chuyển đổi số, tích hợp tính năng đăng ký mượn phòng trực tuyến qua app trường.',
    'Phòng A1.706',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000011',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000003',
    '2025-12-08 10:15:00'
),
(
    'f0000000-0000-0000-0000-000000000185',
    'Hệ thống loa micro trong giảng đường bị rè và thường xuyên mất tín hiệu',
    'Hệ thống âm thanh trợ giảng bao gồm âm ly, micro không dây và hệ thống loa tại Giảng đường lớn tòa A bị lỗi kỹ thuật nghiêm trọng. Âm thanh phát ra thường xuyên bị rú rít chói tai hoặc bị rè tiếng không thể nghe rõ giảng viên nói gì, thỉnh thoảng đang nói lại mất tín hiệu hoàn toàn làm ngắt quãng mạch bài giảng.',
    'Tòa nhà A',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000012',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-08 14:20:00'
),
(
    'f0000000-0000-0000-0000-000000000186',
    'Hệ thống cửa kính cường lực ở sảnh chính bị xệ bản lề tiềm ẩn nguy cơ đổ vỡ',
    'Cánh cửa kính cường lực lớn phía bên tay trái sảnh ra vào Tòa nhà B hiện đang bị xệ bản lề thủy lực, mỗi khi đóng mở phát ra tiếng kêu cọ sát kèn kẹt rất lớn dưới sàn gạch. Nếu không được căn chỉnh hoặc thay thế bản lề sớm, cánh cửa này có nguy cơ bị nổ vỡ kính hoặc đổ sập trúng người qua lại bất cứ lúc nào.',
    'Tòa nhà B',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000013',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-09 09:00:00'
),
(
    'f0000000-0000-0000-0000-000000000187',
    'Tình trạng ngập nước tràn vào hành lang mỗi khi trời mưa bão lớn',
    'Do hệ thống ban công không có gờ chắn nước đủ cao và hệ thống ống thoát nước sàn quá nhỏ lại hay bị lá cây bít kín, mỗi khi trời mưa to kèm gió lớn là nước mưa tràn lê láng vào hành lang lớp học khu vực tòa D. Nước tràn sát vào cửa phòng học làm hư hại sàn gỗ kỹ thuật và gây trơn trượt nguy hiểm.',
    'Tòa nhà D',
    'AI_REVIEW_FAILED',
    false,
    'e0000000-0000-0000-0000-000000000014',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-09 11:45:00'
),
(
    'f0000000-0000-0000-0000-000000000188',
    'Máy chiếu phòng học bị mờ nhòe hình ảnh và sai lệch màu sắc nghiêm trọng',
    'Thiết bị máy chiếu tại phòng lý thuyết E302 có tuổi thọ bóng đèn hình đã quá già, dẫn đến hiện tượng hình ảnh trình chiếu bị mờ tối, nhòe chữ dù đã cố gắng điều chỉnh tiêu cự focus. Thêm vào đó màu sắc hiển thị bị lệch tông (bị ám xanh hoàn toàn) khiến sinh viên ngồi dưới không thể đọc được nội dung slide bài giảng.',
    'Tòa nhà E',
    'VIOLATED_CONTENT',
    false,
    'e0000000-0000-0000-0000-000000000015',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-09 15:30:00'
),
(
    'f0000000-0000-0000-0000-000000000189',
    'Đề xuất cải tạo khu nhà thi đấu đa năng do rách lưới chắn bóng và hỏng sàn',
    'Khu vực sàn gỗ của nhà thi đấu thể thao đa năng hiện tại có nhiều chỗ bị phồng rộp, bong tróc tạo khe hở sắc nhọn dễ gây vấp ngã. Đồng thời, hệ thống lưới chắn bóng xung quanh sân bóng chuyền, cầu lông cũng đã bị rách tả tơi khiến bóng thường xuyên bay thẳng vào khu vực khán đài gây nguy hiểm cho người xem.',
    'Khu thể thao',
    'IN_PROGRESS',
    false,
    'e0000000-0000-0000-0000-000000000016',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-10 08:10:00'
),
(
    'f0000000-0000-0000-0000-000000000190',
    'Mùi hôi bốc lên từ hệ thống hố ga thoát nước lộ thiên cạnh khu vực học tập',
    'Hệ thống mương thoát nước và các hố ga lộ thiên đoạn nằm giữa Tòa nhà C và Tòa nhà D hiện không có nắp đậy kín kẽ. Vào những ngày thời tiết oi bức hoặc sau mưa dông, mùi chất thải hôi thối nồng nặc bốc lên xộc thẳng vào các giảng đường xung quanh, tạo ra môi trường cực kỳ độc hại và khó chịu cho người học.',
    'Các tòa nhà',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000017',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-10 10:40:00'
),
(
    'f0000000-0000-0000-0000-000000000191',
    'Hệ thống rèm cửa che nắng tại các phòng học hướng Tây bị rách nát hoàn toàn',
    'Các phòng học dãy số chẵn của tòa B nằm ở hướng Tây chịu ánh nắng chiều chiếu trực tiếp cực kỳ gay gắt. Tuy nhiên, toàn bộ hệ thống rèm cuốn che nắng tại đây đã bị rách nát, rụng rơi chỉ còn trơ khung sắt. Ánh nắng chiếu thẳng vào mặt sinh viên và màn hình máy chiếu làm lóa mắt, phòng học nóng lên như lò thiêu.',
    'Tòa nhà B',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000020',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-10 13:15:00'
),
(
    'f0000000-0000-0000-0000-000000000192',
    'Bảng viết phấn ở nhiều phòng học bị mòn láng, không ăn phấn và khó lau sạch',
    'Bảng đen chống lóa tại một số phòng học khu vực tòa cổ kính đã sử dụng quá nhiều năm dẫn đến bề mặt bị mòn láng bóng. Giảng viên khi viết phấn rất khó ăn mực, nét chữ bị mờ nhạt, đồng thời khi lau bảng lại tạo thành một vệt trắng xóa nhòe nhẹ khiến sinh viên ngồi từ hàng ghế giữa trở xuống hoàn toàn không nhìn rõ chữ.',
    'Toàn trường',
    'AI_REVIEW_FAILED',
    false,
    'e0000000-0000-0000-0000-000000000021',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-10 16:00:00'
),

-- 10. Phòng Tuyển sinh và CTSV (d000...010) → 18 feedbacks
(
    'f0000000-0000-0000-0000-000000000193',
    'Phản ánh tình trạng vệ sinh xuống cấp nghiêm trọng tại khu nhà vệ sinh Tòa B',
    'Hệ thống nhà vệ sinh tại tầng 3 và tầng 4 của Tòa nhà B thường xuyên trong tình trạng hết giấy vệ sinh, nước rửa tay xà phòng không được châm mới. Ngoài ra, sàn nhà luôn ẩm ướt, bốc mùi hôi thối nồng nặc gây ảnh hưởng lớn đến sinh hoạt của sinh viên giữa các tiết học.',
    'Tòa nhà B',
    'VIOLATED_CONTENT',
    false,
    'e0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-04 12:10:00'
),
(
    'f0000000-0000-0000-0000-000000000194',
    'Sự cố mất điện đột ngột diễn ra liên tục trong giờ học chính khóa',
    'Trong khoảng 2 tuần trở lại đây, hệ thống điện tại các khu lớp học khuya và khu trung tâm thường xuyên bị ngắt đột ngột từ 2-3 lần mỗi tuần. Việc này làm gián đoạn bài giảng của giảng viên, tắt toàn bộ máy chiếu và máy lạnh, gây mất tập trung và ảnh hưởng nghiêm trọng đến chất lượng tiếp thu kiến thức.',
    'Toàn trường',
    'IN_PROGRESS',
    false,
    'e0000000-0000-0000-0000-000000000011',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-07 15:30:00'
),
(
    'f0000000-0000-0000-0000-000000000195',
    'Kiến nghị lắp đặt thêm hệ thống máy lọc nước uống nóng lạnh tại các tầng lầu',
    'Hiện tại số lượng cây nước uống miễn phí tại các tòa nhà là quá ít so với quy mô sinh viên. Kính mong Nhà trường và phòng Quản trị cơ sở vật chất xem xét khảo sát và lắp đặt bổ sung các trụ máy lọc nước nóng lạnh tại hành lang mỗi tầng để đảm bảo nhu cầu giải khát, phục vụ sinh hoạt thiết yếu.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000012',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-10 10:20:00'
),
(
    'f0000000-0000-0000-0000-000000000196',
    'Quy hoạch bổ sung cây xanh bóng mát giảm nhiệt mùa nắng nóng cho khuôn viên',
    'Khu vực sân trường xung quanh các khối nhà học hiện tại rất thưa thớt cây xanh, phần lớn là bê tông hóa. Vào mùa hè, nền nhiệt độ tăng cao khiến không gian ngoài trời cực kỳ oi bức, sinh viên không có bóng mát để nghỉ ngơi hay tự học sau giờ lên lớp. Kiến nghị trồng thêm cây thân gỗ tán rộng.',
    'Khuôn viên',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000013',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-13 14:40:00'
),
(
    'f0000000-0000-0000-0000-000000000197',
    'Tình trạng quá tải nghiêm trọng tại các bãi giữ xe máy của sinh viên',
    'Vào các khung giờ cao điểm (như tiết 1 và tiết 7), bãi xe máy sinh viên luôn trong tình trạng hết chỗ giữ. Nhiều bạn phải xếp hàng chờ rất lâu hoặc buộc phải mang xe ra các bãi tư nhân bên ngoài trường với chi phí đắt đỏ và không đảm bảo an toàn. Kính mong phòng ban tìm giải pháp mở rộng diện tích giữ xe.',
    'Bãi xe',
    'AI_REVIEW_FAILED',
    false,
    'e0000000-0000-0000-0000-000000000014',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-16 09:15:00'
),
(
    'f0000000-0000-0000-0000-000000000198',
    'Yêu cầu dặm vá, sửa chữa đoạn đường nội bộ bị sụt lún và ngập nước',
    'Đoạn đường nội bộ dẫn từ khu vực cổng chính đi vào Tòa nhà A hiện tại đã bị bong tróc lớp nhựa, xuất hiện nhiều ổ gà lún sâu. Mỗi khi trời mưa lớn, nước bị ứ đọng lại thành những vũng lớn gây trơn trượt, rất nguy hiểm cho các phương tiện giao thông di chuyển bên trong trường.',
    'Đường nội bộ',
    'VIOLATED_CONTENT',
    false,
    'e0000000-0000-0000-0000-000000000015',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-19 11:50:00'
),
(
    'f0000000-0000-0000-0000-000000000199',
    'Thang máy Tòa C liên tục gặp sự cố kỹ thuật và kẹt buồng cabin',
    'Hệ thống thang máy số 2 tại Tòa nhà C dạo gần đây hoạt động không ổn định, thường phát ra âm thanh lớn khi di chuyển và đã có 2 lần bị kẹt cabin khiến sinh viên hoảng loạn. Để đảm bảo an toàn tính mạng cho người sử dụng, đề nghị bộ phận kỹ thuật tiến hành bảo trì, kiểm tra tổng thể ngay lập tức.',
    'Tòa nhà C',
    'IN_PROGRESS',
    false,
    'e0000000-0000-0000-0000-000000000016',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-22 13:20:00'
),
(
    'f0000000-0000-0000-0000-000000000401',
    'Không khí ngột ngạt tại các phòng học Tòa E do thiếu máy điều hòa',
    'Các phòng học lý thuyết tại dãy Tòa nhà E có diện tích khá lớn nhưng chỉ được trang bị quạt trần cũ kỹ, gió rất yếu. Với số lượng sinh viên tập trung đông hơn 60 người/lớp, không khí trong phòng cực kỳ nóng bức, ngột ngạt làm giảm khả năng tiếp thu và ảnh hưởng sức khỏe của cả thầy lẫn trò.',
    'Tòa nhà E',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000017',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-25 16:10:00'
),
(
    'f0000000-0000-0000-0000-000000000402',
    'Tình trạng rác thải ùn ứ tại các thùng rác công cộng ngoài khuôn viên',
    'Tôi nhận thấy các thùng rác lớn đặt dọc lối đi khuôn viên xanh đôi khi bị bỏ quên từ 2-3 ngày không thấy đơn vị vệ sinh đến thu gom. Rác thải sinh hoạt tràn ra ngoài, thu hút ruồi nhặng và bốc mùi khó chịu, làm mất đi mỹ quan chung của không gian sư phạm nhà trường.',
    'Khuôn viên',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000020',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-28 10:30:00'
),
(
    'f0000000-0000-0000-0000-000000000403',
    'Đề xuất bố trí thêm ghế đá tại các khu vực râm mát ngoài sân trường',
    'Nhu cầu ngồi nghỉ ngơi, trao đổi bài học nhóm của sinh viên vào giờ giải lao là rất lớn nhưng số lượng ghế đá hiện tại xung quanh sân trường còn hạn chế. Kính mong phòng Quản trị cơ sở vật chất cấp kinh phí mua sắm và bố trí thêm một số băng ghế đá tại các khu vực có bóng cây mát.',
    'Khuôn viên',
    'VIOLATED_CONTENT',
    false,
    'e0000000-0000-0000-0000-000000000021',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-01 14:45:00'
),
(
    'f0000000-0000-0000-0000-000000000404',
    'Cảnh báo hệ thống phòng cháy chữa cháy (PCCC) có nhiều bình hết hạn',
    'Qua kiểm tra các tủ thiết bị an toàn dọc hành lang các tòa nhà, chúng em phát hiện rất nhiều bình chữa cháy dạng bột đã quá hạn kiểm định ghi trên tem, kim áp suất đều chỉ về vạch đỏ. Kính đề nghị phòng chức năng cho thu hồi, nạp sạc lại gas/bột để phòng hờ trường hợp khẩn cấp.',
    'Các tòa nhà',
    'AI_REVIEW_FAILED',
    false,
    'e0000000-0000-0000-0000-000000000022',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000006',
    '2025-12-02 09:20:00'
),
(
    'f0000000-0000-0000-0000-000000000405',
    'Mặt sân bóng đá cỏ nhân tạo bị bong tróc sâu, tiềm ẩn nguy cơ chấn thương',
    'Sân bóng đá mini thuộc khu tổ hợp thể thao trường hiện đã xuống cấp nghiêm trọng. Nhiều mảng cỏ nhân tạo bị trọc lóc trơ cả nền cát và đá dăm phía dưới, tạo thành các hố nhỏ lồi lõm khiến sinh viên rất dễ lật cổ chân hoặc trầy xước nặng khi tham gia hoạt động thể dục thể thao.',
    'Sân thể thao',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000030',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-03 15:10:00'
),
(
    'f0000000-0000-0000-0000-000000000406',
    'Mái tôn bãi để xe máy bị dột nát nghiêm trọng khi có mưa lớn',
    'Phần mái che bằng tôn tại bãi giữ xe máy số 2 đang bị rỉ sét và rách một mảng lớn. Mỗi khi trời mưa đổ xuống, nước chảy thành dòng trực tiếp xuống khu vực để xe khiến yên xe, đầu xe của sinh viên bị ướt sũng, gây hư hỏng tài sản cá nhân và chập điện xe.',
    'Bãi xe',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000031',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-04 11:40:00'
),
(
    'f0000000-0000-0000-0000-000000000407',
    'Đề xuất sơn sửa, khắc phục mảng tường ẩm mốc loang lổ tại mặt tiền Tòa A',
    'Mặt tiền phía trước của Tòa nhà A do chịu ảnh hưởng trực tiếp từ thời tiết nên lớp sơn tường bên ngoài đã bị bong tróc nặng, xuất hiện nhiều mảng ố vàng và rêu mốc đen kịt nhìn rất mất thẩm mỹ đối với một trường đại học. Cần có kế hoạch cạo rỉ và dặm lại lớp sơn mới.',
    'Tòa nhà A',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000032',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-05 13:25:00'
),
(
    'f0000000-0000-0000-0000-000000000408',
    'Thắc mắc về tiến độ bàn giao và mở cửa đưa vào sử dụng công trình hồ bơi',
    'Hồ bơi sinh viên của trường chúng ta theo thông tin đã hoàn thiện xây dựng phần thô từ lâu nhưng đến nay vẫn đóng cửa, khóa xích im lìm, nước bên trong bắt đầu chuyển sang màu xanh lục do tù đọng. Sinh viên rất muốn biết khi nào công trình này mới chính thức hoạt động phục vụ môn bơi lội.',
    'Khu thể thao',
    'AI_REVIEW_FAILED',
    false,
    'e0000000-0000-0000-0000-000000000033',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-06 10:15:00'
),
(
    'f0000000-0000-0000-0000-000000000409',
    'Bổ sung thùng phân loại rác tại khu vực sảnh căng tin ăn uống trung tâm',
    'Tại khu vực căng tin của trường, lượng rác thải nhựa và thức ăn thừa phát sinh hàng ngày là cực kỳ khổng lồ. Tuy nhiên ở đây lại đang thiếu trầm trọng các thùng rác có vách ngăn phân loại. Đề nghị đặt thêm bộ ba thùng rác phân loại hữu cơ - vô cơ - rác tái chế tại lối ra vào.',
    'Căng tin',
    'VIOLATED_CONTENT',
    false,
    'e0000000-0000-0000-0000-000000000040',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-07 12:30:00'
),
(
    'f0000000-0000-0000-0000-000000000410',
    'Hệ thống đèn cao áp chiếu sáng ban đêm ngoài khuôn viên bị hỏng',
    'Đoạn đường đi bộ nối liền giữa thư viện cũ và khu tự học vào buổi tối rất tăm tối do hai bóng đèn cao áp treo trên cột điện đã bị cháy từ tuần trước. Đoạn này có nhiều bụi rậm, việc thiếu ánh sáng làm dấy lên nỗi lo sợ về an ninh trật tự, trộm cắp hoặc tai nạn vấp ngã cho các bạn học đêm.',
    'Khuôn viên',
    'IN_PROGRESS',
    false,
    'e0000000-0000-0000-0000-000000000041',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000006',
    '2025-12-07 16:50:00'
),
-- TẠO THÊM 10 FEEDBACKS MỚI (Từ ID 411 đến 420)
(
    'f0000000-0000-0000-0000-000000000411',
    'Thủ tục mượn phòng học cho hoạt động CLB ngoại khóa còn rườm rà',
    'Hiện tại, mỗi khi các Câu lạc bộ muốn mượn phòng học trống vào buổi tối để sinh hoạt kỹ năng thì quy trình ký giấy tờ bản cứng chạy qua chạy lại giữa các bên rất mất thời gian. Kính mong phòng Quản trị cơ sở vật chất số hóa quy trình này, cho phép đăng ký trực tuyến qua hệ thống portal.',
    'Phòng A1.706',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000042',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-08 08:30:00'
),
(
    'f0000000-0000-0000-0000-000000000412',
    'Hệ thống micro tại giảng đường lớn X thường xuyên bị hú và mất tiếng',
    'Khi tham gia các buổi hội thảo và học tập tập trung tại giảng đường lớn X, hệ thống âm thanh ở đây cực kỳ tệ. Micro không dây thường xuyên bị mất tín hiệu kết nối hoặc phát ra tiếng hú rít chói tai, gây gián đoạn lớn đến quá trình lắng nghe thông tin của hàng trăm sinh viên ngồi phía dưới.',
    'Giảng đường X',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000043',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-08 14:15:00'
),
(
    'f0000000-0000-0000-0000-000000000413',
    'Cửa kính của phòng học lý thuyết Tòa B bị nứt vỡ nguy hiểm',
    'Em xin báo cáo tình trạng ô cửa kính phía sau của phòng học B402 đang bị một vết nứt rất lớn kéo dài, có thể đổ sập xuống bất cứ lúc nào nếu gặp gió to hoặc có bạn nào vô tình va chạm phải. Kính mong đội ngũ sửa chữa cơ sở vật chất xuống thay thế tấm kính mới để đảm bảo an toàn.',
    'Tòa nhà B',
    'AI_REVIEW_FAILED',
    false,
    'e0000000-0000-0000-0000-000000000043',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-09 09:00:00'
),
(
    'f0000000-0000-0000-0000-000000000414',
    'Bàn ghế học viên bị gãy tựa lưng và rỉ sắt gây rách trang phục',
    'Tại dãy phòng học lý thuyết khu C, cụ thể là phòng C105, có khoảng 4-5 bộ bàn ghế liền kề đã bị hỏng mất phần ốp gỗ tựa lưng, để lộ ra các thanh sắt nhọn hoắt bị rỉ sét. Một số bạn sinh viên khi ngồi đã vô tình bị quẹt trúng làm rách quần áo và trầy xước nhẹ da thịt.',
    'Tòa nhà C',
    'VIOLATED_CONTENT',
    false,
    'e0000000-0000-0000-0000-000000000043',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-09 11:20:00'
),
(
    'f0000000-0000-0000-0000-000000000415',
    'Áp lực nước tại vòi rửa tay nhà vệ sinh khu trung tâm quá yếu',
    'Hệ thống vòi nước cảm ứng tại khu vệ sinh chung tầng trệt tòa nhà trung tâm chảy cực kỳ yếu, thậm chí có vòi chỉ nhỏ giọt. Việc này khiến sinh viên mất rất nhiều thời gian xếp hàng chỉ để rửa tay sau khi đi vệ sinh, gây ùn ứ cục bộ. Đề nghị tăng áp lực bơm nước lên.',
    'Tòa nhà Trung tâm',
    'IN_PROGRESS',
    false,
    'e0000000-0000-0000-0000-000000000043',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-09 15:45:00'
),
(
    'f0000000-0000-0000-0000-000000000416',
    'Máy chiếu phòng học bị mờ nhòe và sai lệch màu sắc nghiêm trọng',
    'Thiết bị máy chiếu tại phòng học A204 hiện đã quá tuổi thọ, hình ảnh phát ra bị mờ căm và chuyển hẳn sang tông màu vàng xám, rất khó để đọc được các dòng chữ trên slide bài giảng của thầy cô dù đã kéo hết rèm cửa che nắng. Mong phòng kiểm tra đổi bóng đèn hình mới.',
    'Tòa nhà A',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000043',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-10 07:30:00'
),
(
    'f0000000-0000-0000-0000-000000000417',
    'Tình trạng ngập úng cục bộ tại khu vực lối vào hầm giữ xe khi mưa lớn',
    'Hệ thống cống thoát nước ngay trước dốc rẽ xuống hầm gửi xe tòa nhà trung tâm đang bị nghẹt do lá cây và rác lấp đầy. Cứ hễ có mưa lớn dồn dập khoảng 15 phút là nước dâng lên ngập quá nửa bánh xe, khiến xe máy của sinh viên dễ bị tắt máy và gây nguy cơ trơn trượt ngã xe.',
    'Bãi xe hầm',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000043',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-10 10:05:00'
),
(
    'f0000000-0000-0000-0000-000000000418',
    'Phản ánh rèm cửa che nắng tại các phòng học hướng Tây bị rách nát',
    'Các phòng học dãy số lẻ của Tòa nhà E nằm ở hướng Tây đón nắng chiều vô cùng gay gắt. Thế nhưng hệ thống rèm vải che nắng ở các ô cửa sổ đều đã rách bươm hoặc rớt thanh treo. Nắng chiếu thẳng vào bàn học làm chói mắt, khiến sinh viên không thể quan sát được bảng viết.',
    'Tòa nhà E',
    'VIOLATED_CONTENT',
    false,
    'e0000000-0000-0000-0000-000000000043',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-10 13:40:00'
),
(
    'f0000000-0000-0000-0000-000000000419',
    'Kiến nghị bảo trì hệ thống quạt hút thông gió tại khu vực xưởng thực hành',
    'Không gian bên trong khu xưởng thực hành cơ khí động lực tích tụ rất nhiều khí thải độc hại, mùi dầu nhớt và khói hàn trong quá trình làm việc. Tuy nhiên, hệ thống quạt hút thông gió gắn trên tường hoạt động lờ đờ và không đủ công suất giải nhiệt, không khí ngột ngạt dễ ngất xỉu.',
    'Khu xưởng thực hành',
    'IN_PROGRESS',
    false,
    'e0000000-0000-0000-0000-000000000043',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000006',
    '2025-12-10 16:15:00'
),
(
    'f0000000-0000-0000-0000-000000000420',
    'Sàn hành lang lớp học trơn trượt nguy hiểm do nước đọng từ máy lạnh rò rỉ',
    'Cục nóng và đường ống thoát nước thải của hệ thống điều hòa lắp dọc hành lang tầng 2 tòa nhà B đang gặp sự cố rò rỉ nước, xả trực tiếp ra lối đi chung. Nước đọng lâu ngày tạo thành rêu xanh trơn trượt, đã có trường hợp sinh viên đi lại nhanh bị trượt ngã va đập mạnh.',
    'Tòa nhà B',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000043',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-10 17:55:00'
);

INSERT INTO
    "Feedbacks" (
        "id",
        "subject",
        "description",
        "location",
        "currentStatus",
        "isPrivate",
        "userId",
        "departmentId",
        "categoryId",
        "createdAt"
    )
VALUES
    -- Tháng 1/2025 (20 feedbacks)
    (
        'f0000000-0000-0000-0000-000000000201',
        'Cơ sở vật chất lớp học cần sửa chữa',
        'Bàn ghế lớp học bị lung lay, ảnh hưởng đến việc ghi chép.',
        'Tòa nhà A',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000004',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        '2025-01-02 09:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000202',
        'Thời khóa biểu chưa ổn định',
        'Thay đổi lịch học đột ngột mà không thông báo sớm.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000005',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000002',
        '2025-01-03 14:10:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000203',
        'Hoạt động ngoại khóa ít',
        'Cần thêm sự kiện giao lưu giữa các khoa.',
        'Sân trường',
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000006',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000003',
        '2025-01-05 10:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000204',
        'Giảng viên giảng dạy thiếu nhiệt tình',
        'Một số thầy cô đọc slide mà không giải thích chi tiết.',
        'Phòng học B101',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000010',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000004',
        '2025-01-07 11:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000205',
        'Học phí cần minh bạch hơn',
        'Không rõ phí phụ thu cho các hoạt động ngoại khóa.',
        NULL,
        'RESOLVED',
        true,
        'e0000000-0000-0000-0000-000000000011',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000005',
        '2025-01-08 15:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000206',
        'Thư viện thiếu tài liệu mới',
        'Sách chuyên ngành cập nhật chậm, ảnh hưởng nghiên cứu.',
        'Thư viện',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000012',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        '2025-01-10 09:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000207',
        'Đăng ký học phần khó khăn',
        'Hệ thống online thường xuyên lỗi khi đăng ký.',
        'Phòng Đào tạo',
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000013',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000002',
        '2025-01-12 13:40:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000208',
        'Cần thêm CLB ngoại khóa',
        'Thiếu câu lạc bộ kỹ năng mềm cho sinh viên.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000014',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000003',
        '2025-01-14 10:50:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000209',
        'Giảng viên cần chuẩn bị bài kỹ',
        'Bài giảng có lỗi chính tả và thiếu ví dụ thực tế.',
        'Phòng học',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000015',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000004',
        '2025-01-15 14:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000210',
        'Học phí tăng đột biến',
        'Tăng 10% mà không có thông báo trước.',
        NULL,
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000016',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000005',
        '2025-01-17 11:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000211',
        'An ninh ký túc xá',
        'Cửa ra vào không khóa kỹ, dễ bị đột nhập.',
        'Ký túc xá',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000017',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000006',
        '2025-01-18 15:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000212',
        'Cải thiện khuôn viên',
        'Thêm ghế ngồi và cây xanh ở khu vực nghỉ ngơi.',
        'Sân trường',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000020',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        '2025-01-20 09:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000213',
        'Chương trình học cần cập nhật',
        'Môn học cũ kỹ, không liên quan đến công nghệ mới.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000021',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000002',
        '2025-01-22 13:10:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000214',
        'Tổ chức chuyến đi thực tế',
        'Cần thêm chuyến thăm doanh nghiệp để học hỏi.',
        'Phòng Quan hệ doanh nghiệp',
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000022',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000003',
        '2025-01-24 10:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000215',
        'Tương tác giảng viên - sinh viên',
        'Giảng viên ít hỏi đáp trong giờ học.',
        'Phòng học',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000030',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000004',
        '2025-01-25 14:40:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000216',
        'Học bổng cho sinh viên khó khăn',
        'Cần tăng số lượng học bổng hỗ trợ.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000031',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000005',
        '2025-01-27 09:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000217',
        'Thiết bị lab an toàn hơn',
        'Thiếu khẩu trang và găng tay bảo hộ.',
        'Phòng thí nghiệm',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000032',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        '2025-01-28 13:50:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000218',
        'Hệ thống đăng ký online',
        'Hay lỗi khi chọn học phần tự chọn.',
        'Phòng Đào tạo',
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000033',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000002',
        '2025-01-29 11:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000219',
        'Sự kiện văn nghệ',
        'Cần thêm đêm nhạc sinh viên.',
        'Nhà Văn hóa',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000040',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000003',
        '2025-01-30 15:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000220',
        'Đánh giá công bằng',
        'Phương pháp chấm thi chưa nhất quán.',
        'Phòng học',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000041',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000004',
        '2025-01-31 10:30:00'
    ),

-- Tháng 2/2025 (20 feedbacks)
(
    'f0000000-0000-0000-0000-000000000221',
    'Phòng học thiếu đèn',
    'Ánh sáng yếu vào buổi tối, khó đọc sách.',
    'Tòa nhà A',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000042',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-02-01 09:10:00'
),
(
    'f0000000-0000-0000-0000-000000000222',
    'Lịch thi thay đổi đột ngột',
    'Không thông báo trước khiến sinh viên hoang mang.',
    NULL,
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000043',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-02-03 13:20:00'
),
(
    'f0000000-0000-0000-0000-000000000223',
    'Hoạt động tình nguyện',
    'Cần thêm chiến dịch dọn vệ sinh trường.',
    'Sân trường',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000004',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-02-05 10:45:00'
),
(
    'f0000000-0000-0000-0000-000000000224',
    'Giảng viên hay nghỉ đột xuất',
    'Không có giáo viên thay thế kịp thời.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000005',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-02-07 14:00:00'
),
(
    'f0000000-0000-0000-0000-000000000225',
    'Học phí cho kỳ hè',
    'Thông tin học phí kỳ hè chưa rõ ràng.',
    NULL,
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000006',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-02-08 11:15:00'
),
(
    'f0000000-0000-0000-0000-000000000226',
    'Thư viện giờ mở muộn',
    'Chỉ mở đến 18h, sinh viên tối không học được.',
    'Thư viện',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-02-10 15:30:00'
),
(
    'f0000000-0000-0000-0000-000000000227',
    'Hệ thống học online',
    'Video bài giảng hay bị giật lag.',
    'Phòng Đào tạo',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000011',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-02-12 09:50:00'
),
(
    'f0000000-0000-0000-0000-000000000228',
    'CLB thể thao',
    'Thiếu dụng cụ cho bóng bàn và cầu lông.',
    NULL,
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000012',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-02-14 13:10:00'
),
(
    'f0000000-0000-0000-0000-000000000229',
    'Tương tác nhóm nhỏ',
    'Giảng viên nên chia nhóm thảo luận nhiều hơn.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000013',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-02-15 10:20:00'
),
(
    'f0000000-0000-0000-0000-000000000230',
    'Miễn giảm học phí',
    'Tiêu chí miễn giảm chưa công bằng.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000014',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-02-17 14:40:00'
),
(
    'f0000000-0000-0000-0000-000000000231',
    'An ninh bãi xe',
    'Xe máy hay bị trộm phụ tùng.',
    'Bãi xe',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000015',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000006',
    '2025-02-18 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000232',
    'Cây xanh và bóng mát',
    'Thêm mái che ở khu vực chờ xe buýt.',
    'Sân trường',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000016',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-02-19 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000233',
    'Nội dung môn học',
    'Thêm phần thực hành vào môn lý thuyết.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000017',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-02-20 09:30:00'
),
(
    'f0000000-0000-0000-0000-000000000234',
    'Thực tập ngoại khóa',
    'Hợp tác với doanh nghiệp địa phương.',
    'Phòng Quan hệ doanh nghiệp',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000020',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-02-21 13:50:00'
),
(
    'f0000000-0000-0000-0000-000000000235',
    'Phản hồi từ giảng viên',
    'Nên trả bài tập nhanh hơn.',
    'Phòng học',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000021',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-02-22 10:10:00'
),
(
    'f0000000-0000-0000-0000-000000000236',
    'Học bổng xuất sắc',
    'Tăng giá trị học bổng cho top đầu lớp.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000022',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-02-24 14:30:00'
),
(
    'f0000000-0000-0000-0000-000000000237',
    'An toàn lab',
    'Kiểm tra thiết bị định kỳ hơn.',
    'Phòng thí nghiệm',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000030',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-02-25 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000238',
    'Đăng ký môn phụ',
    'Cho phép đăng ký thêm môn tự do hơn.',
    'Phòng Đào tạo',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000031',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-02-26 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000239',
    'Sự kiện thể thao',
    'Tổ chức giải bóng đá nội bộ.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000032',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-02-27 09:45:00'
),
(
    'f0000000-0000-0000-0000-000000000240',
    'Đánh giá bài tập',
    'Cần tiêu chí chấm rõ ràng hơn.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000033',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-02-28 13:10:00'
),

-- Tháng 3/2025 (21 feedbacks)
(
    'f0000000-0000-0000-0000-000000000241',
    'Máy lạnh phòng học hỏng',
    'Phòng học nóng bức, sinh viên khó tập trung.',
    'Tòa nhà A',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000040',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-03-01 10:00:00'
),
(
    'f0000000-0000-0000-0000-000000000242',
    'Thông báo lịch học muộn',
    'Thông báo thay đổi chỉ trước 1 ngày.',
    NULL,
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000041',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-03-03 14:15:00'
),
(
    'f0000000-0000-0000-0000-000000000243',
    'Ngoại khóa hội thảo',
    'Tổ chức hội thảo kỹ năng mềm định kỳ.',
    'Hội trường',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000042',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-03-05 11:20:00'
),
(
    'f0000000-0000-0000-0000-000000000244',
    'Giảng viên sử dụng slide cũ',
    'Slide bài giảng không cập nhật theo năm học mới.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000043',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-03-07 15:30:00'
),
(
    'f0000000-0000-0000-0000-000000000245',
    'Chi tiết học phí',
    'Cần bảng phí chi tiết cho từng kỳ.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000004',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-03-08 09:45:00'
),
(
    'f0000000-0000-0000-0000-000000000246',
    'Tài liệu thư viện số',
    'Tăng sách điện tử để sinh viên truy cập dễ dàng.',
    'Thư viện',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000005',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-03-10 13:10:00'
),
(
    'f0000000-0000-0000-0000-000000000247',
    'Lỗi hệ thống đăng ký',
    'Không cho đăng ký khi quá tải server.',
    'Phòng Đào tạo',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000006',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-03-12 10:20:00'
),
(
    'f0000000-0000-0000-0000-000000000248',
    'CLB ngoại ngữ',
    'Thêm hoạt động luyện nghe nói tiếng Anh.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-03-14 14:40:00'
),
(
    'f0000000-0000-0000-0000-000000000249',
    'Hỏi đáp trong lớp',
    'Giảng viên nên dành thời gian Q&A nhiều hơn.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000011',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-03-15 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000250',
    'Học phí kỳ hè',
    'Giảm học phí cho sinh viên tham gia thực tập.',
    NULL,
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000012',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-03-17 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000251',
    'An ninh khu vực học',
    'Tăng camera ở hành lang tòa nhà.',
    'Tòa nhà A',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000013',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000006',
    '2025-03-18 09:30:00'
),
(
    'f0000000-0000-0000-0000-000000000252',
    'Khuôn viên sạch sẽ',
    'Dọn rác hàng ngày thay vì 2 ngày/lần.',
    'Sân trường',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000014',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-03-19 13:50:00'
),
(
    'f0000000-0000-0000-0000-000000000253',
    'Môn học cơ bản',
    'Cập nhật nội dung môn Toán, Lý cho phù hợp kỹ thuật.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000015',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-03-20 10:10:00'
),
(
    'f0000000-0000-0000-0000-000000000254',
    'Thăm quan doanh nghiệp',
    'Tổ chức chuyến đi thăm nhà máy sản xuất.',
    'Phòng Quan hệ doanh nghiệp',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000016',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-03-21 14:30:00'
),
(
    'f0000000-0000-0000-0000-000000000255',
    'Phản hồi bài tập',
    'Giảng viên nên comment chi tiết hơn.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000017',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-03-22 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000256',
    'Học bổng nghiên cứu',
    'Tăng hỗ trợ cho đề tài NCKH sinh viên.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000020',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-03-24 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000257',
    'Thiết bị lab',
    'Mua thêm máy đo cho phòng thí nghiệm.',
    'Phòng thí nghiệm',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000021',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-03-25 09:45:00'
),
(
    'f0000000-0000-0000-0000-000000000258',
    'Đăng ký học phần',
    'Cho phép chỉnh sửa sau khi đăng ký 1 tuần.',
    'Phòng Đào tạo',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000022',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-03-26 13:10:00'
),
(
    'f0000000-0000-0000-0000-000000000259',
    'Hoạt động văn nghệ',
    'Tổ chức festival âm nhạc sinh viên.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000030',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-03-27 10:30:00'
),
(
    'f0000000-0000-0000-0000-000000000260',
    'Chấm thi công bằng',
    'Sử dụng chấm chéo giữa các giảng viên.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000031',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-03-28 14:50:00'
),
(
    'f0000000-0000-0000-0000-000000000261',
    'Hỗ trợ tài chính',
    'Thêm quỹ vay không lãi cho sinh viên.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000032',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-03-29 11:15:00'
),

-- Tháng 4/2025 (20 feedbacks)
(
    'f0000000-0000-0000-0000-000000000262',
    'Bàn ghế cũ kỹ',
    'Thay bàn ghế mới cho lớp học.',
    'Tòa nhà A',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000033',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-04-01 09:00:00'
),
(
    'f0000000-0000-0000-0000-000000000263',
    'Lịch học chồng chéo',
    'Có môn học trùng giờ với môn khác.',
    NULL,
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000040',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-04-03 13:20:00'
),
(
    'f0000000-0000-0000-0000-000000000264',
    'Ngoại khóa du lịch',
    'Tổ chức chuyến đi Đà Lạt cho sinh viên.',
    'Sân trường',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000041',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-04-05 10:10:00'
),
(
    'f0000000-0000-0000-0000-000000000265',
    'Giảng viên giảng nhanh',
    'Giảng quá nhanh, sinh viên không theo kịp.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000042',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-04-07 14:30:00'
),
(
    'f0000000-0000-0000-0000-000000000266',
    'Phí phụ thu không rõ',
    'Phí tham gia ngoại khóa cần minh bạch.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000043',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-04-08 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000267',
    'Sách thư viện cũ',
    'Cập nhật sách mới cho năm học.',
    'Thư viện',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000004',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-04-10 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000268',
    'Đăng ký học lại',
    'Quy trình học lại môn cần đơn giản hóa.',
    'Phòng Đào tạo',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000005',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-04-12 09:45:00'
),
(
    'f0000000-0000-0000-0000-000000000269',
    'CLB âm nhạc',
    'Cung cấp phòng luyện tập cho CLB.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000006',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-04-14 13:10:00'
),
(
    'f0000000-0000-0000-0000-000000000270',
    'Thảo luận lớp học',
    'Tăng phần thảo luận nhóm.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-04-15 10:30:00'
),
(
    'f0000000-0000-0000-0000-000000000271',
    'Học phí kỳ II',
    'Thông báo sớm để sinh viên chuẩn bị.',
    NULL,
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000011',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-04-17 14:50:00'
),
(
    'f0000000-0000-0000-0000-000000000272',
    'An ninh ban đêm',
    'Tăng tuần tra ở ký túc xá.',
    'Ký túc xá',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000012',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000006',
    '2025-04-18 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000273',
    'Bóng mát khuôn viên',
    'Trồng thêm cây xanh quanh trường.',
    'Sân trường',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000013',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-04-19 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000274',
    'Cập nhật chương trình',
    'Thêm môn học về AI vào chương trình.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000014',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-04-20 09:30:00'
),
(
    'f0000000-0000-0000-0000-000000000275',
    'Thực tập hè',
    'Hỗ trợ tìm chỗ thực tập cho sinh viên năm 2.',
    'Phòng Quan hệ doanh nghiệp',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000015',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-04-21 13:50:00'
),
(
    'f0000000-0000-0000-0000-000000000276',
    'Phản hồi nhanh',
    'Trả bài kiểm tra trong 1 tuần.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000016',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-04-22 10:10:00'
),
(
    'f0000000-0000-0000-0000-000000000277',
    'Học bổng học kỳ',
    'Công bố sớm học bổng học kỳ II.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000017',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-04-24 14:30:00'
),
(
    'f0000000-0000-0000-0000-000000000278',
    'Lab sạch sẽ',
    'Dọn dẹp phòng lab hàng tuần.',
    'Phòng thí nghiệm',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000020',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-04-25 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000279',
    'Chỉnh sửa đăng ký',
    'Cho phép drop môn trong 2 tuần đầu.',
    'Phòng Đào tạo',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000021',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-04-26 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000280',
    'Hoạt động thiện nguyện',
    'Tổ chức quyên góp sách cho trẻ em.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000022',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-04-27 09:45:00'
),

-- Tháng 5/2025 (20 feedbacks)
(
    'f0000000-0000-0000-0000-000000000281',
    'Phòng học thiếu quạt',
    'Nóng bức vào mùa hè, cần thêm quạt.',
    'Tòa nhà A',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000030',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-05-01 09:00:00'
),
(
    'f0000000-0000-0000-0000-000000000282',
    'Lịch thi cuối kỳ',
    'Công bố lịch thi sớm hơn 1 tháng.',
    NULL,
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000031',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-05-03 13:20:00'
),
(
    'f0000000-0000-0000-0000-000000000283',
    'Ngoại khóa hè',
    'Tổ chức trại hè kỹ năng cho sinh viên.',
    'Sân trường',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000032',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-05-05 10:10:00'
),
(
    'f0000000-0000-0000-0000-000000000284',
    'Giảng viên thay đổi',
    'Thay giảng viên giữa chừng kỳ học.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000033',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-05-07 14:30:00'
),
(
    'f0000000-0000-0000-0000-000000000285',
    'Học phí hè',
    'Giảm phí cho môn học lại hè.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000040',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-05-08 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000286',
    'Thư viện đông đúc',
    'Mở thêm giờ vào cuối tuần.',
    'Thư viện',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000041',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-05-10 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000287',
    'Đăng ký hè',
    'Hệ thống đăng ký môn hè hay crash.',
    'Phòng Đào tạo',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000042',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-05-12 09:45:00'
),
(
    'f0000000-0000-0000-0000-000000000288',
    'CLB du lịch',
    'Tổ chức chuyến đi chơi nội bộ.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000043',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-05-14 13:10:00'
),
(
    'f0000000-0000-0000-0000-000000000289',
    'Bài giảng tương tác',
    'Sử dụng poll và quiz trong giờ học.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000004',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-05-15 10:30:00'
),
(
    'f0000000-0000-0000-0000-000000000290',
    'Học phí hỗ trợ',
    'Tăng học bổng cho sinh viên năm cuối.',
    NULL,
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000005',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-05-17 14:50:00'
),
(
    'f0000000-0000-0000-0000-000000000291',
    'An ninh hè',
    'Tăng bảo vệ khi sinh viên ở lại trường hè.',
    'Ký túc xá',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000006',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000006',
    '2025-05-18 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000292',
    'Vệ sinh khuôn viên',
    'Dọn dẹp thường xuyên hơn vào mùa mưa.',
    'Sân trường',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-05-19 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000293',
    'Môn học tự chọn',
    'Thêm nhiều lựa chọn môn tự chọn hơn.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000011',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-05-20 09:30:00'
),
(
    'f0000000-0000-0000-0000-000000000294',
    'Hợp tác doanh nghiệp',
    'Tìm thêm đối tác cho thực tập hè.',
    'Phòng Quan hệ doanh nghiệp',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000012',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-05-21 13:50:00'
),
(
    'f0000000-0000-0000-0000-000000000295',
    'Kiểm tra giữa kỳ',
    'Giảm số lượng kiểm tra để sinh viên ôn tập.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000013',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-05-22 10:10:00'
),
(
    'f0000000-0000-0000-0000-000000000296',
    'Học bổng hè',
    'Hỗ trợ học bổng cho sinh viên ở lại hè.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000014',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-05-24 14:30:00'
),
(
    'f0000000-0000-0000-0000-000000000297',
    'Lab mở cửa hè',
    'Mở lab cho sinh viên làm đồ án hè.',
    'Phòng thí nghiệm',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000015',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-05-25 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000298',
    'Đăng ký hè dễ dàng',
    'Giảm thủ tục đăng ký môn hè.',
    'Phòng Đào tạo',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000016',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-05-26 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000299',
    'Hoạt động hè',
    'Tổ chức lớp kỹ năng hè miễn phí.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000017',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-05-27 09:45:00'
),

-- Tháng 6/2025 (20 feedbacks)
(
    'f0000000-0000-0000-0000-000000000300',
    'Phòng học cần sơn lại',
    'Tường phòng học bong tróc.',
    'Tòa nhà A',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000020',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-06-01 09:00:00'
),
(
    'f0000000-0000-0000-0000-000000000301',
    'Lịch nghỉ hè',
    'Thông báo lịch nghỉ hè sớm.',
    NULL,
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000021',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-06-03 13:20:00'
),
(
    'f0000000-0000-0000-0000-000000000302',
    'Ngoại khóa cuối năm',
    'Tổ chức lễ bế giảng vui vẻ.',
    'Sân trường',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000022',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-06-05 10:10:00'
),
(
    'f0000000-0000-0000-0000-000000000303',
    'Ôn tập trước thi',
    'Giảng viên nên dành buổi cuối ôn tập.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000030',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-06-07 14:30:00'
),
(
    'f0000000-0000-0000-0000-000000000304',
    'Học phí năm sau',
    'Dự báo học phí năm 2025-2026.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000031',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-06-08 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000305',
    'Thư viện hè',
    'Giữ thư viện mở trong hè cho sinh viên ở lại.',
    'Thư viện',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000032',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-06-10 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000306',
    'Thi cuối kỳ',
    'Thi online để tránh ùn tắc.',
    'Phòng Đào tạo',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000033',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-06-12 09:45:00'
),
(
    'f0000000-0000-0000-0000-000000000307',
    'CLB hè',
    'Hoạt động CLB tiếp tục vào hè.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000040',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-06-14 13:10:00'
),
(
    'f0000000-0000-0000-0000-000000000308',
    'Hướng dẫn ôn thi',
    'Cung cấp tài liệu ôn thi đầy đủ.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000041',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-06-15 10:30:00'
),
(
    'f0000000-0000-0000-0000-000000000309',
    'Học phí hỗ trợ hè',
    'Miễn phí môn học lại hè cho sinh viên nghèo.',
    NULL,
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000042',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-06-17 14:50:00'
),
(
    'f0000000-0000-0000-0000-000000000310',
    'An ninh thi cử',
    'Tăng giám thị để tránh gian lận.',
    'Phòng thi',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000043',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000006',
    '2025-06-18 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000311',
    'Khuôn viên hè',
    'Tưới cây thường xuyên để xanh tươi.',
    'Sân trường',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000004',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-06-19 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000312',
    'Ôn tập online',
    'Tạo group chat cho từng môn để hỏi đáp.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000005',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-06-20 09:30:00'
),
(
    'f0000000-0000-0000-0000-000000000313',
    'Hỗ trợ thi cử',
    'Cho phép mang nước vào phòng thi.',
    'Phòng thi',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000006',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-06-21 13:50:00'
),
(
    'f0000000-0000-0000-0000-000000000314',
    'Kết quả thi nhanh',
    'Công bố kết quả trong 1 tuần sau thi.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-06-22 10:10:00'
),
(
    'f0000000-0000-0000-0000-000000000315',
    'Học bổng cuối năm',
    'Trao học bổng trước nghỉ hè.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000011',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-06-24 14:30:00'
),
(
    'f0000000-0000-0000-0000-000000000316',
    'Lab hè',
    'Cho mượn thiết bị lab về nhà hè.',
    'Phòng thí nghiệm',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000012',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-06-25 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000317',
    'Học lại hè',
    'Tổ chức lớp học lại online.',
    'Phòng Đào tạo',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000013',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-06-26 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000318',
    'Tiệc chia tay',
    'Tổ chức tiệc tốt nghiệp cho sinh viên năm cuối.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000014',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-06-27 09:45:00'
),

-- Tháng 7/2025 (20 feedbacks)
(
    'f0000000-0000-0000-0000-000000000319',
    'Cơ sở hè',
    'Mở thêm phòng học điều hòa cho sinh viên ở lại.',
    'Tòa nhà A',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000015',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-07-01 09:00:00'
),
(
    'f0000000-0000-0000-0000-000000000320',
    'Học hè online',
    'Nâng cấp server để tránh lag.',
    NULL,
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000016',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-07-03 13:20:00'
),
(
    'f0000000-0000-0000-0000-000000000321',
    'Ngoại khóa hè',
    'Tổ chức picnic cho sinh viên hè.',
    'Sân trường',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000017',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-07-05 10:10:00'
),
(
    'f0000000-0000-0000-0000-000000000322',
    'Giảng viên hè',
    'Giảng viên nhiệt tình hơn vào hè.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000020',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-07-07 14:30:00'
),
(
    'f0000000-0000-0000-0000-000000000323',
    'Học phí hè minh bạch',
    'Công khai phí hè chi tiết.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000021',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-07-08 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000324',
    'Thư viện hè',
    'Tăng giờ mở thư viện hè.',
    'Thư viện',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000022',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-07-10 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000325',
    'Đăng ký hè',
    'Cho phép đăng ký muộn hơn.',
    'Phòng Đào tạo',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000030',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-07-12 09:45:00'
),
(
    'f0000000-0000-0000-0000-000000000326',
    'CLB hè',
    'Hoạt động CLB online vào hè.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000031',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-07-14 13:10:00'
),
(
    'f0000000-0000-0000-0000-000000000327',
    'Ôn thi hè',
    'Tổ chức lớp ôn thi miễn phí.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000032',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-07-15 10:30:00'
),
(
    'f0000000-0000-0000-0000-000000000328',
    'Học phí hè hỗ trợ',
    'Giảm phí cho sinh viên ở lại làm đồ án.',
    NULL,
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000033',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-07-17 14:50:00'
),
(
    'f0000000-0000-0000-0000-000000000329',
    'An ninh hè',
    'Kiểm tra ID khi ra vào ký túc xá hè.',
    'Ký túc xá',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000040',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000006',
    '2025-07-18 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000330',
    'Khuôn viên hè',
    'Tổ chức sự kiện picnic hè.',
    'Sân trường',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000041',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-07-19 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000331',
    'Học hè thực hành',
    'Tăng giờ thực hành vào hè.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000042',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-07-20 09:30:00'
),
(
    'f0000000-0000-0000-0000-000000000332',
    'Hỗ trợ hè',
    'Mở quầy hỗ trợ sinh viên ở lại hè.',
    'Phòng Đào tạo',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000043',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-07-21 13:50:00'
),
(
    'f0000000-0000-0000-0000-000000000333',
    'Thi lại hè',
    'Công bố kết quả thi lại nhanh.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000004',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-07-22 10:10:00'
),
(
    'f0000000-0000-0000-0000-000000000334',
    'Học bổng hè',
    'Trao học bổng cho sinh viên xuất sắc hè.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000005',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-07-24 14:30:00'
),
(
    'f0000000-0000-0000-0000-000000000335',
    'Lab hè',
    'Cho sử dụng lab 24/7 vào hè.',
    'Phòng thí nghiệm',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000006',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-07-25 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000336',
    'Đăng ký hè muộn',
    'Mở đăng ký thêm cho sinh viên bận.',
    'Phòng Đào tạo',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-07-26 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000337',
    'Hoạt động hè vui',
    'Tổ chức xem phim ngoài trời.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000011',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-07-27 09:45:00'
),

-- Tháng 8/2025 (20 feedbacks)
(
    'f0000000-0000-0000-0000-000000000338',
    'Chuẩn bị năm học mới',
    'Sửa chữa phòng học trước khai giảng.',
    'Tòa nhà A',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000012',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-08-01 09:00:00'
),
(
    'f0000000-0000-0000-0000-000000000339',
    'Lịch học năm mới',
    'Công bố thời khóa biểu sớm.',
    NULL,
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000013',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-08-03 13:20:00'
),
(
    'f0000000-0000-0000-0000-000000000340',
    'Ngoại khóa năm mới',
    'Tổ chức tuần lễ chào đón sinh viên mới.',
    'Sân trường',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000014',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-08-05 10:10:00'
),
(
    'f0000000-0000-0000-0000-000000000341',
    'Giảng viên mới',
    'Đào tạo giảng viên mới để đảm bảo chất lượng.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000015',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-08-07 14:30:00'
),
(
    'f0000000-0000-0000-0000-000000000342',
    'Học phí năm mới',
    'Thông báo học phí năm học mới sớm.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000016',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-08-08 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000343',
    'Thư viện năm mới',
    'Bổ sung sách mới cho năm học.',
    'Thư viện',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000017',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-08-10 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000344',
    'Đăng ký năm mới',
    'Mở đăng ký sớm cho sinh viên cũ.',
    'Phòng Đào tạo',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000020',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-08-12 09:45:00'
),
(
    'f0000000-0000-0000-0000-000000000345',
    'CLB năm mới',
    'Tuyển thành viên mới cho CLB.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000021',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-08-14 13:10:00'
),
(
    'f0000000-0000-0000-0000-000000000346',
    'Hướng dẫn tân sinh viên',
    'Tổ chức buổi hướng dẫn chi tiết.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000022',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-08-15 10:30:00'
),
(
    'f0000000-0000-0000-0000-000000000347',
    'Học phí tân sinh viên',
    'Hỗ trợ học phí cho tân sinh viên khó khăn.',
    NULL,
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000030',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-08-17 14:50:00'
),
(
    'f0000000-0000-0000-0000-000000000348',
    'An ninh năm mới',
    'Kiểm tra ID tân sinh viên nghiêm ngặt.',
    'Cổng trường',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000031',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000006',
    '2025-08-18 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000349',
    'Khuôn viên chào đón',
    'Trang trí khuôn viên cho năm học mới.',
    'Sân trường',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000032',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-08-19 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000350',
    'Chương trình năm mới',
    'Giới thiệu chương trình học mới.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000033',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-08-20 09:30:00'
),
(
    'f0000000-0000-0000-0000-000000000351',
    'Hợp tác năm mới',
    'Mời doanh nghiệp đến giới thiệu việc làm.',
    'Phòng Quan hệ doanh nghiệp',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000040',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-08-21 13:50:00'
),
(
    'f0000000-0000-0000-0000-000000000352',
    'Hỏi đáp tân sinh viên',
    'Tổ chức Q&A cho tân sinh viên.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000041',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-08-22 10:10:00'
),
(
    'f0000000-0000-0000-0000-000000000353',
    'Học bổng tân sinh viên',
    'Công bố học bổng cho tân sinh viên sớm.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000042',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-08-24 14:30:00'
),
(
    'f0000000-0000-0000-0000-000000000354',
    'Lab năm mới',
    'Kiểm tra thiết bị lab trước năm học.',
    'Phòng thí nghiệm',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000043',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-08-25 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000355',
    'Đăng ký tân sinh viên',
    'Hỗ trợ đăng ký online cho tân sinh viên.',
    'Phòng Đào tạo',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000004',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-08-26 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000356',
    'Hoạt động chào đón',
    'Tổ chức đêm giao lưu tân sinh viên.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000005',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-08-27 09:45:00'
),

-- Tháng 9/2025 (20 feedbacks)
(
    'f0000000-0000-0000-0000-000000000357',
    'Bắt đầu năm học',
    'Sửa chữa bàn ghế trước khi học.',
    'Tòa nhà A',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000006',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-09-01 09:00:00'
),
(
    'f0000000-0000-0000-0000-000000000358',
    'Thời khóa biểu',
    'Tránh chồng chéo lịch học.',
    NULL,
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-09-03 13:20:00'
),
(
    'f0000000-0000-0000-0000-000000000359',
    'Ngoại khóa đầu năm',
    'Tổ chức hội trại đầu năm.',
    'Sân trường',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000011',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-09-05 10:10:00'
),
(
    'f0000000-0000-0000-0000-000000000360',
    'Giảng viên đầu năm',
    'Giảng viên giới thiệu syllabus rõ ràng.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000012',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-09-07 14:30:00'
),
(
    'f0000000-0000-0000-0000-000000000361',
    'Học phí đầu năm',
    'Cho trả góp học phí.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000013',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-09-08 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000362',
    'Thư viện đầu năm',
    'Hướng dẫn sử dụng thư viện cho tân sinh viên.',
    'Thư viện',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000014',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-09-10 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000363',
    'Đăng ký đầu năm',
    'Hỗ trợ đăng ký cho tân sinh viên.',
    'Phòng Đào tạo',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000015',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-09-12 09:45:00'
),
(
    'f0000000-0000-0000-0000-000000000364',
    'CLB đầu năm',
    'Ngày hội CLB để tuyển thành viên.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000016',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-09-14 13:10:00'
),
(
    'f0000000-0000-0000-0000-000000000365',
    'Học tập đầu năm',
    'Buổi học đầu giới thiệu mục tiêu môn học.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000017',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-09-15 10:30:00'
),
(
    'f0000000-0000-0000-0000-000000000366',
    'Học phí đầu năm',
    'Hỗ trợ vay học phí ngân hàng.',
    NULL,
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000020',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-09-17 14:50:00'
),
(
    'f0000000-0000-0000-0000-000000000367',
    'An ninh đầu năm',
    'Hướng dẫn tân sinh viên về an ninh trường.',
    'Cổng trường',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000021',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000006',
    '2025-09-18 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000368',
    'Khuôn viên đầu năm',
    'Trang trí chào mừng năm học mới.',
    'Sân trường',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000022',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-09-19 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000369',
    'Chương trình đầu năm',
    'Giới thiệu chương trình đào tạo mới.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000030',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-09-20 09:30:00'
),
(
    'f0000000-0000-0000-0000-000000000370',
    'Hợp tác đầu năm',
    'Hội thảo giới thiệu doanh nghiệp.',
    'Phòng Quan hệ doanh nghiệp',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000031',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-09-21 13:50:00'
),
(
    'f0000000-0000-0000-0000-000000000371',
    'Hỏi đáp đầu năm',
    'Buổi Q&A cho sinh viên năm nhất.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000032',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-09-22 10:10:00'
),
(
    'f0000000-0000-0000-0000-000000000372',
    'Học bổng đầu năm',
    'Trao học bổng cho sinh viên xuất sắc năm trước.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000033',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-09-24 14:30:00'
),
(
    'f0000000-0000-0000-0000-000000000373',
    'Lab đầu năm',
    'Hướng dẫn sử dụng lab cho tân sinh viên.',
    'Phòng thí nghiệm',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000040',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-09-25 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000374',
    'Đăng ký đầu năm',
    'Mở thêm slot cho môn phổ biến.',
    'Phòng Đào tạo',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000041',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-09-26 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000375',
    'Hoạt động đầu năm',
    'Ngày hội thể thao đầu năm.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000042',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-09-27 09:45:00'
),

-- Tháng 10/2025 (20 feedbacks)
(
    'f0000000-0000-0000-0000-000000000376',
    'Giữa kỳ học',
    'Kiểm tra sức khỏe sinh viên giữa kỳ.',
    'Tòa nhà A',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000043',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-10-01 09:00:00'
),
(
    'f0000000-0000-0000-0000-000000000377',
    'Lịch giữa kỳ',
    'Công bố lịch kiểm tra giữa kỳ sớm.',
    NULL,
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000004',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-10-03 13:20:00'
),
(
    'f0000000-0000-0000-0000-000000000378',
    'Ngoại khóa giữa kỳ',
    'Tổ chức sự kiện thư giãn giữa kỳ.',
    'Sân trường',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000005',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-10-05 10:10:00'
),
(
    'f0000000-0000-0000-0000-000000000379',
    'Ôn giữa kỳ',
    'Giảng viên dành buổi ôn tập.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000006',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-10-07 14:30:00'
),
(
    'f0000000-0000-0000-0000-000000000380',
    'Học phí giữa kỳ',
    'Nhắc nhở đóng học phí kỳ này.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-10-08 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000381',
    'Thư viện giữa kỳ',
    'Mở thêm giờ đọc giữa kỳ.',
    'Thư viện',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000011',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-10-10 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000382',
    'Kiểm tra giữa kỳ',
    'Thi online để tiện lợi.',
    'Phòng Đào tạo',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000012',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-10-12 09:45:00'
),
(
    'f0000000-0000-0000-0000-000000000383',
    'CLB giữa kỳ',
    'Sự kiện CLB giữa kỳ để giảm stress.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000013',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-10-14 13:10:00'
),
(
    'f0000000-0000-0000-0000-000000000384',
    'Học tập giữa kỳ',
    'Tư vấn học tập cho sinh viên yếu.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000014',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-10-15 10:30:00'
),
(
    'f0000000-0000-0000-0000-000000000385',
    'Học phí giữa kỳ',
    'Cho trả góp giữa kỳ.',
    NULL,
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000015',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-10-17 14:50:00'
),
(
    'f0000000-0000-0000-0000-000000000386',
    'An ninh giữa kỳ',
    'Tăng an ninh trong kỳ thi giữa kỳ.',
    'Phòng thi',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000016',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000006',
    '2025-10-18 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000387',
    'Khuôn viên giữa kỳ',
    'Tổ chức sự kiện thư giãn.',
    'Sân trường',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000017',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-10-19 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000388',
    'Ôn giữa kỳ',
    'Tài liệu ôn tập đầy đủ.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000020',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-10-20 09:30:00'
),
(
    'f0000000-0000-0000-0000-000000000389',
    'Hỗ trợ giữa kỳ',
    'Tư vấn tâm lý cho sinh viên stress.',
    'Phòng Đào tạo',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000021',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-10-21 13:50:00'
),
(
    'f0000000-0000-0000-0000-000000000390',
    'Kết quả giữa kỳ',
    'Công bố kết quả nhanh chóng.',
    'Phòng học',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000022',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-10-22 10:10:00'
),
(
    'f0000000-0000-0000-0000-000000000391',
    'Học bổng giữa kỳ',
    'Trao học bổng giữa kỳ cho sinh viên tiến bộ.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000030',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-10-24 14:30:00'
),
(
    'f0000000-0000-0000-0000-000000000392',
    'Lab giữa kỳ',
    'Mở lab thêm giờ ôn tập.',
    'Phòng thí nghiệm',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000031',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-10-25 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000393',
    'Học giữa kỳ',
    'Giảm tải bài tập giữa kỳ.',
    'Phòng Đào tạo',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000032',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-10-26 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000394',
    'Hoạt động giữa kỳ',
    'Ngày hội giữa kỳ để giao lưu.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000033',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '2025-10-27 09:45:00'
),
(
    'f0000000-0000-0000-0000-000000000395',
    'Hỗ trợ giữa kỳ',
    'Tăng giờ tư vấn học tập.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000040',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    '2025-10-28 13:10:00'
),
(
    'f0000000-0000-0000-0000-000000000396',
    'Kết thúc giữa kỳ',
    'Tổ chức tiệc nhỏ sau kỳ giữa.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000041',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000007',
    '2025-10-29 10:30:00'
),
(
    'f0000000-0000-0000-0000-000000000397',
    'Phản hồi giữa kỳ',
    'Khảo sát ý kiến sinh viên giữa kỳ.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000042',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000007',
    '2025-10-30 14:50:00'
),
(
    'f0000000-0000-0000-0000-000000000398',
    'Học bổng giữa kỳ',
    'Công bố học bổng giữa kỳ.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000043',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    '2025-10-31 11:00:00'
),
(
    'f0000000-0000-0000-0000-000000000399',
    'Lab giữa kỳ',
    'Bảo trì lab giữa kỳ.',
    'Phòng thí nghiệm',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000004',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2025-10-31 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000400',
    'Học giữa kỳ',
    'Tăng tài liệu hỗ trợ học tập.',
    NULL,
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000005',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2025-10-31 09:45:00'
);
-- ==================== Department 001 – Phòng Thanh tra giáo dục ====================
UPDATE "Feedbacks"
SET
    "subject" = 'Cải thiện dịch vụ căng tin trường học',
    "description" = 'Hiện tại chất lượng món ăn ở căng tin rất kém: cơm khô, thức ăn ít, giá lại cao (35–40k/phần). Nhiều ngày đồ ăn bị ôi thiu, nhà vệ sinh bẩn, không có chỗ ngồi vào giờ cao điểm. Mong Ban Quản lý dịch vụ sinh viên sớm có biện pháp cải thiện rõ rệt trong thời gian tới.'
WHERE
    "id" = 'f0000000-0000-0000-0000-000000000034';
-- 2025-12-01

UPDATE "Feedbacks"
SET
    "subject" = 'Máy tính phòng lab quá cũ, không đáp ứng được nhu cầu học tập',
    "description" = 'Các phòng lab máy tính (đặc biệt tòa C) vẫn đang dùng máy cấu hình thấp từ năm 2015–2016, chạy phần mềm đồ họa, lập trình nặng (AutoCAD, Android Studio, Visual Studio, v.v.) cực kỳ chậm và hay treo. Sinh viên ngành CNTT, Đồ họa phải mang laptop cá nhân vào lab mới làm được bài. Đề nghị Phòng Thiết bị – Vật tư sớm thay mới toàn bộ trong năm 2026.'
WHERE
    "id" = 'f0000000-0000-0000-0000-000000000035';
-- 2025-12-02

UPDATE "Feedbacks"
SET
    "subject" = 'Nền tảng học trực tuyến cần được nâng cấp gấp',
    "description" = 'Hệ thống LMS hiện tại thường xuyên bị lag, video bài giảng giật, nộp bài tập hay báo lỗi 502. Đặc biệt vào giờ cao điểm gần như không truy cập được. Mong Trung tâm Dạy học số nâng cấp server và chuyển sang nền tảng ổn định hơn (Moodle, Canvas, hoặc Google Classroom) ngay trong kỳ 2 năm học này.'
WHERE
    "id" = 'f0000000-0000-0000-0000-000000000036';
-- 2025-12-03

UPDATE "Feedbacks"
SET
    "subject" = 'Mong tổ chức sự kiện mùa đông/Noel hoành tráng hơn',
    "description" = 'Năm nay trường vẫn chưa có kế hoạch tổ chức đêm Noel hay countdown 2026. Sinh viên rất mong có cây thông lớn, sân khấu ngoài trời, bắn pháo hoa mini, hội chợ đồ ăn và biểu diễn âm nhạc như các năm trước dịch. Đề nghị Đoàn Thanh niên và Hội Sinh viên lên kế hoạch sớm.'
WHERE
    "id" = 'f0000000-0000-0000-0000-000000000037';
-- 2025-12-05

-- ==================== Department 002 – Phòng Quan hệ doanh nghiệp ====================
UPDATE "Feedbacks"
SET
    "subject" = 'Sinh viên năm cuối vẫn chưa có chỗ thực tập bắt buộc',
    "description" = 'Kỳ thực tập bắt buộc sắp tới (tháng 1–3/2026) nhưng đến nay Phòng Quan hệ doanh nghiệp vẫn chưa công bố danh sách công ty tiếp nhận. Nhiều bạn đang rất lo lắng vì phải tự tìm mà doanh nghiệp yêu cầu giấy giới thiệu của trường. Mong phòng hỗ trợ danh sách và thư giới thiệu sớm nhất có thể.'
WHERE
    "id" = 'f0000000-0000-0000-0000-000000000065';
-- 2025-12-01

UPDATE "Feedbacks"
SET
    "subject" = 'Cần thêm 1 đợt Job Fair lớn vào cuối tháng 12',
    "description" = 'Năm nay chỉ có 1 ngày hội việc làm vào tháng 4, quá ít. Sinh viên năm cuối đang cần cơ hội phỏng vấn gấp trước khi ra trường. Mong phòng mời thêm các tập đoàn lớn (FPT, VNG, VinGroup, Shopee, Tiki…) tổ chức Job Fair cuối năm.'
WHERE
    "id" = 'f0000000-0000-0000-0000-000000000066';
-- 2025-12-02

UPDATE "Feedbacks"
SET
    "subject" = 'Thông tin học bổng doanh nghiệp năm 2026 vẫn chưa có',
    "description" = 'Đã bước sang tháng 12 nhưng vẫn chưa thấy thông báo học bổng từ doanh nghiệp (FPT, Viettel, VinGroup, v.v.). Nhiều bạn đang cần để hoàn thành hồ sơ tài chính cho kỳ 2. Rất mong phòng sớm cập nhật danh sách và deadline.'
WHERE
    "id" = 'f0000000-0000-0000-0000-000000000067';
-- 2025-12-03

UPDATE "Feedbacks"
SET
    "subject" = 'Mong có thêm chương trình kết nối với startup',
    "description" = 'Nhiều sinh viên muốn thực tập/startup ở các công ty công nghệ mới (Fintech, AI, Blockchain) nhưng không biết liên hệ ở đâu. Đề nghị phòng làm cầu nối với các startup/incubator tại TP.HCM (ví dụ: Vietnam Silicon Valley, Saigon Innovation Hub…).'
WHERE
    "id" = 'f0000000-0000-0000-0000-000000000068';
-- 2025-12-05

UPDATE "Feedbacks"
SET
    "subject" = 'Cần sớm có kế hoạch hội thảo tuyển dụng & thực tập 2026',
    "description" = 'Tháng 12 rồi mà vẫn chưa thấy lịch hội thảo hướng nghiệp, workshop CV, mock interview cho năm 2026. Sinh viên năm 3–4 đang rất cần chuẩn bị hồ sơ sớm. Mong phòng lên kế hoạch và công bố trước Tết.'
WHERE
    "id" = 'f0000000-0000-0000-0000-000000000069';
-- 2025-12-06

UPDATE "Feedbacks"
SET
    "subject" = 'Mong có chương trình thực tập trao đổi quốc tế',
    "description" = 'Một số trường bạn đã có chương trình thực tập 3–6 tháng tại Singapore, Malaysia, Nhật Bản với hỗ trợ chi phí. Trường mình cũng nên triển khai để sinh viên có cơ hội trải nghiệm môi trường làm việc quốc tế.'
WHERE
    "id" = 'f0000000-0000-0000-0000-000000000070';
-- 2025-12-07

-- ==================== Department 003 – Phòng Khoa học & Công nghệ ====================
UPDATE "Feedbacks"
SET
    "subject" = 'Chưa có kế hoạch chi tiết cho đề tài NCKH sinh viên 2026',
    "description" = 'Tháng 12 rồi nhưng vẫn chưa thấy thông báo đợt đề tài NCKH sinh viên cấp trường năm 2026. Nhiều nhóm đã có ý tưởng và muốn đăng ký sớm để chuẩn bị kinh phí, mentor. Mong phòng sớm công bố thể lệ và lịch nộp hồ sơ.'
WHERE
    "id" = 'f0000000-0000-0000-0000-000000000096';
-- 2025-12-01

UPDATE "Feedbacks"
SET
    "subject" = 'Mong tổ chức lại cuộc thi Ý tưởng Khởi nghiệp sinh viên 2026',
    "description" = 'Hai năm nay trường chưa tổ chức Startup Day/Ý tưởng Khởi nghiệp. Nhiều nhóm có dự án tốt nhưng không có sân chơi để trình bày và gọi vốn. Đề nghị phòng KH&CN phối hợp Đoàn Thanh niên tổ chức lại trong năm 2026 với giải thưởng hấp dẫn.'
WHERE
    "id" = 'f0000000-0000-0000-0000-000000000097';
-- 2025-12-02

UPDATE "Feedbacks"
SET
    "subject" = 'Cần tăng mức thưởng cho sinh viên có bài báo Q1',
    "description" = 'Hiện tại mức thưởng cho bài báo Q1 chỉ 10–15 triệu, quá thấp so với công sức và chi phí bỏ ra. Các trường bạn thưởng 50–100 triệu/bài. Đề nghị phòng xem xét tăng mức thưởng để khuyến khích sinh viên công bố quốc tế.'
WHERE
    "id" = 'f0000000-0000-0000-0000-000000000098';
-- 2025-12-04

UPDATE "Feedbacks"
SET
    "subject" = 'Mong sớm có phòng lab chuyên sâu về AI & IoT',
    "description" = 'Ngành CNTT đang phát triển rất mạnh về AI, Machine Learning, IoT nhưng trường mình vẫn chưa có phòng lab riêng với GPU mạnh (RTX 4080/4090). Sinh viên phải dùng Colab hoặc tự mua máy. Rất cần đầu tư phòng lab chuyên sâu trong năm 2026.'
WHERE
    "id" = 'f0000000-0000-0000-0000-000000000099';
-- 2025-12-05

UPDATE "Feedbacks"
SET
    "subject" = 'Cần tổ chức lại Hội nghị NCKH sinh viên năm 2026',
    "description" = 'Đã 2 năm trường không tổ chức hội nghị NCKH sinh viên. Đây là cơ hội rất tốt để các nhóm trình bày kết quả nghiên cứu. Mong phòng KH&CN lên kế hoạch tổ chức vào tháng 4–5/2026 với sự tham gia của các trường bạn.'
WHERE
    "id" = 'f0000000-0000-0000-0000-000000000100';
-- 2025-12-07
-- =================================================================
-- STEP 4: FORUM POSTS
-- Fix ID: fp... -> 3000... (Số 3 đại diện cho Post)
-- =================================================================
INSERT INTO
    "ForumPosts" (
        "id",
        "feedbackId",
        "createdAt"
    )
VALUES
    -- Department 001 – Phòng Thanh tra giáo dục (4 cái)
    (
        '30000000-0000-0000-0000-000000000001',
        'f0000000-0000-0000-0000-000000000034',
        '2025-12-01 10:00:00'
    ),
    (
        '30000000-0000-0000-0000-000000000002',
        'f0000000-0000-0000-0000-000000000035',
        '2025-12-02 14:15:00'
    ),
    (
        '30000000-0000-0000-0000-000000000003',
        'f0000000-0000-0000-0000-000000000036',
        '2025-12-03 09:30:00'
    ),
    (
        '30000000-0000-0000-0000-000000000004',
        'f0000000-0000-0000-0000-000000000037',
        '2025-12-05 13:00:00'
    ),

-- Department 002 – Phòng Quan hệ doanh nghiệp (5 cái)
(
    '30000000-0000-0000-0000-000000000005',
    'f0000000-0000-0000-0000-000000000065',
    '2025-12-01 14:30:00'
),
(
    '30000000-0000-0000-0000-000000000006',
    'f0000000-0000-0000-0000-000000000066',
    '2025-12-02 10:15:00'
),
(
    '30000000-0000-0000-0000-000000000007',
    'f0000000-0000-0000-0000-000000000067',
    '2025-12-03 16:45:00'
),
(
    '30000000-0000-0000-0000-000000000008',
    'f0000000-0000-0000-0000-000000000068',
    '2025-12-05 11:20:00'
),
(
    '30000000-0000-0000-0000-000000000009',
    'f0000000-0000-0000-0000-000000000069',
    '2025-12-06 09:50:00'
),
(
    '30000000-0000-0000-0000-000000000010',
    'f0000000-0000-0000-0000-000000000070',
    '2025-12-07 14:00:00'
),

-- Department 003 – Phòng Khoa học & Công nghệ (3 cái)
(
    '30000000-0000-0000-0000-000000000011',
    'f0000000-0000-0000-0000-000000000096',
    '2025-12-01 10:40:00'
),
(
    '30000000-0000-0000-0000-000000000012',
    'f0000000-0000-0000-0000-000000000097',
    '2025-12-02 14:20:00'
),
(
    '30000000-0000-0000-0000-000000000013',
    'f0000000-0000-0000-0000-000000000098',
    '2025-12-04 11:10:00'
),
(
    '30000000-0000-0000-0000-000000000014',
    'f0000000-0000-0000-0000-000000000099',
    '2025-12-05 15:50:00'
),
(
    '30000000-0000-0000-0000-000000000015',
    'f0000000-0000-0000-0000-000000000100',
    '2025-12-07 09:30:00'
);

-- =================================================================
-- STEP 5: STATUS HISTORY
-- Fix ID: fh... -> 1000...
-- =================================================================
INSERT INTO
    "FeedbackStatusHistory" (
        "id",
        "feedbackId",
        "status",
        "message",
        "note",
        "createdAt"
    )
VALUES 
-- Feedback 1: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-01-02 08:00:00'),
    ('20000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-01-02 08:02:00'),
    ('30000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-01-02 08:05:00'),
    ('40000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.', NULL, '2025-01-02 10:30:00'),

    -- Feedback 2: AI_REVIEW_FAILED (Dừng lại, không có PENDING)
    ('10000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-01-03 14:00:00'),
    ('20000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, tạm dừng tiến trình để kiểm tra thủ công.', NULL, '2025-01-03 14:02:00'),

    -- Feedback 3: VIOLATED_CONTENT (Dừng lại, không có PENDING)
    ('10000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000003', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-01-05 10:10:00'),
    ('20000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000003', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm hoặc vi phạm tiêu chuẩn, khóa tiến trình chờ xử lý.', NULL, '2025-01-05 10:12:00'),

    -- Feedback 4: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000004', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-01-06 08:30:00'),
    ('20000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000004', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-01-06 08:32:00'),
    ('30000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000004', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-01-06 08:35:00'),
    ('40000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000004', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.', NULL, '2025-01-06 15:40:00'),

    -- Feedback 5: AI_REVIEW_SUCCESS -> PENDING -> REJECTED
    ('10000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000005', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-01-08 21:00:00'),
    ('20000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000005', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-01-08 21:02:00'),
    ('30000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000005', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-01-08 21:05:00'),
    ('40000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000005', 'REJECTED', 'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.', NULL, '2025-01-08 22:50:00'),

    -- Feedback 6: AI_REVIEW_SUCCESS -> PENDING -> IN_PROGRESS
    ('10000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000006', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-01-10 11:00:00'),
    ('20000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000006', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-01-10 11:02:00'),
    ('30000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000006', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-01-10 11:05:00'),
    ('40000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000006', 'IN_PROGRESS', 'Góp ý đang được bộ phận chuyên trách xử lý.', NULL, '2025-01-10 14:15:00'),

    -- Feedback 7: VIOLATED_CONTENT (Dừng lại, không có PENDING)
    ('10000000-0000-0000-0000-000000000007', 'f0000000-0000-0000-0000-000000000007', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-01-12 15:30:00'),
    ('20000000-0000-0000-0000-000000000007', 'f0000000-0000-0000-0000-000000000007', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm hoặc vi phạm tiêu chuẩn, khóa tiến trình chờ xử lý.', NULL, '2025-01-12 15:32:00'),

    -- Feedback 8: AI_REVIEW_FAILED (Dừng lại, không có PENDING)
    ('10000000-0000-0000-0000-000000000008', 'f0000000-0000-0000-0000-000000000008', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-01-14 09:00:00'),
    ('20000000-0000-0000-0000-000000000008', 'f0000000-0000-0000-0000-000000000008', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, tạm dừng tiến trình để kiểm tra thủ công.', NULL, '2025-01-14 09:02:00'),

    -- Feedback 9: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000009', 'f0000000-0000-0000-0000-000000000009', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-01-15 13:00:00'),
    ('20000000-0000-0000-0000-000000000009', 'f0000000-0000-0000-0000-000000000009', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-01-15 13:02:00'),
    ('30000000-0000-0000-0000-000000000009', 'f0000000-0000-0000-0000-000000000009', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-01-15 13:05:00'),
    ('40000000-0000-0000-0000-000000000009', 'f0000000-0000-0000-0000-000000000009', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.', NULL, '2025-01-15 16:20:00'),

    -- Feedback 10: AI_REVIEW_SUCCESS -> PENDING -> REJECTED
    ('10000000-0000-0000-0000-000000000010', 'f0000000-0000-0000-0000-000000000010', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-01-17 19:00:00'),
    ('20000000-0000-0000-0000-000000000010', 'f0000000-0000-0000-0000-000000000010', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-01-17 19:02:00'),
    ('30000000-0000-0000-0000-000000000010', 'f0000000-0000-0000-0000-000000000010', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-01-17 19:05:00'),
    ('40000000-0000-0000-0000-000000000010', 'f0000000-0000-0000-0000-000000000010', 'REJECTED', 'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.', NULL, '2025-01-17 21:15:00'),

    -- Feedback 11: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000011', 'f0000000-0000-0000-0000-000000000011', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-01-19 08:00:00'),
    ('20000000-0000-0000-0000-000000000011', 'f0000000-0000-0000-0000-000000000011', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-01-19 08:02:00'),
    ('30000000-0000-0000-0000-000000000011', 'f0000000-0000-0000-0000-000000000011', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-01-19 08:05:00'),
    ('40000000-0000-0000-0000-000000000011', 'f0000000-0000-0000-0000-000000000011', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.', NULL, '2025-01-19 11:00:00'),

    -- Feedback 12: AI_REVIEW_FAILED (Dừng lại, không có PENDING)
    ('10000000-0000-0000-0000-000000000012', 'f0000000-0000-0000-0000-000000000012', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-01-21 14:00:00'),
    ('20000000-0000-0000-0000-000000000012', 'f0000000-0000-0000-0000-000000000012', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, tạm dừng tiến trình để kiểm tra thủ công.', NULL, '2025-01-21 14:02:00'),

    -- Feedback 13: VIOLATED_CONTENT (Dừng lại, không có PENDING)
    ('10000000-0000-0000-0000-000000000013', 'f0000000-0000-0000-0000-000000000013', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-01-23 10:10:00'),
    ('20000000-0000-0000-0000-000000000013', 'f0000000-0000-0000-0000-000000000013', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm hoặc vi phạm tiêu chuẩn, khóa tiến trình chờ xử lý.', NULL, '2025-01-23 10:12:00'),

    -- Feedback 14: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000014', 'f0000000-0000-0000-0000-000000000014', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-01-24 08:30:00'),
    ('20000000-0000-0000-0000-000000000014', 'f0000000-0000-0000-0000-000000000014', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-01-24 08:32:00'),
    ('30000000-0000-0000-0000-000000000014', 'f0000000-0000-0000-0000-000000000014', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-01-24 08:35:00'),
    ('40000000-0000-0000-0000-000000000014', 'f0000000-0000-0000-0000-000000000014', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.', NULL, '2025-01-24 14:40:00'),

    -- Feedback 15: AI_REVIEW_SUCCESS -> PENDING -> REJECTED
    ('10000000-0000-0000-0000-000000000015', 'f0000000-0000-0000-0000-000000000015', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-01-26 21:00:00'),
    ('20000000-0000-0000-0000-000000000015', 'f0000000-0000-0000-0000-000000000015', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-01-26 21:02:00'),
    ('30000000-0000-0000-0000-000000000015', 'f0000000-0000-0000-0000-000000000015', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-01-26 21:05:00'),
    ('40000000-0000-0000-0000-000000000015', 'f0000000-0000-0000-0000-000000000015', 'REJECTED', 'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.', NULL, '2025-01-26 23:10:00'),

    -- Feedback 16: AI_REVIEW_SUCCESS -> PENDING -> IN_PROGRESS
    ('10000000-0000-0000-0000-000000000016', 'f0000000-0000-0000-0000-000000000016', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-01-28 11:00:00'),
    ('20000000-0000-0000-0000-000000000016', 'f0000000-0000-0000-0000-000000000016', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-01-28 11:02:00'),
    ('30000000-0000-0000-0000-000000000016', 'f0000000-0000-0000-0000-000000000016', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-01-28 11:05:00'),
    ('40000000-0000-0000-0000-000000000016', 'f0000000-0000-0000-0000-000000000016', 'IN_PROGRESS', 'Góp ý đang được bộ phận chuyên trách xử lý.', NULL, '2025-01-28 14:15:00'),

    -- Feedback 17: VIOLATED_CONTENT (Dừng lại, không có PENDING)
    ('10000000-0000-0000-0000-000000000017', 'f0000000-0000-0000-0000-000000000017', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-01-30 15:30:00'),
    ('20000000-0000-0000-0000-000000000017', 'f0000000-0000-0000-0000-000000000017', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm hoặc vi phạm tiêu chuẩn, khóa tiến trình chờ xử lý.', NULL, '2025-01-30 15:32:00'),

    -- Feedback 18: AI_REVIEW_FAILED (Dừng lại, không có PENDING)
    ('10000000-0000-0000-0000-000000000018', 'f0000000-0000-0000-0000-000000000018', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-02-01 09:00:00'),
    ('20000000-0000-0000-0000-000000000018', 'f0000000-0000-0000-0000-000000000018', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, tạm dừng tiến trình để kiểm tra thủ công.', NULL, '2025-02-01 09:02:00'),

    -- Feedback 19: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000019', 'f0000000-0000-0000-0000-000000000019', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-02-02 13:00:00'),
    ('20000000-0000-0000-0000-000000000019', 'f0000000-0000-0000-0000-000000000019', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-02-02 13:02:00'),
    ('30000000-0000-0000-0000-000000000019', 'f0000000-0000-0000-0000-000000000019', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-02-02 13:05:00'),
    ('40000000-0000-0000-0000-000000000019', 'f0000000-0000-0000-0000-000000000019', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.', NULL, '2025-02-02 15:45:00'),

    -- Feedback 20: AI_REVIEW_SUCCESS -> PENDING -> REJECTED
    ('10000000-0000-0000-0000-000000000020', 'f0000000-0000-0000-0000-000000000020', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-02-04 19:00:00'),
    ('20000000-0000-0000-0000-000000000020', 'f0000000-0000-0000-0000-000000000020', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-02-04 19:02:00'),
    ('30000000-0000-0000-0000-000000000020', 'f0000000-0000-0000-0000-000000000020', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-02-04 19:05:00'),
    ('40000000-0000-0000-0000-000000000020', 'f0000000-0000-0000-0000-000000000020', 'REJECTED', 'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.', NULL, '2025-02-04 21:00:00'),
    -- Feedback 21: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000021', 'f0000000-0000-0000-0000-000000000021', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-02-01 08:00:00'),
    ('20000000-0000-0000-0000-000000000021', 'f0000000-0000-0000-0000-000000000021', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-02-01 08:02:00'),
    ('30000000-0000-0000-0000-000000000021', 'f0000000-0000-0000-0000-000000000021', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-02-01 08:05:00'),
    ('40000000-0000-0000-0000-000000000021', 'f0000000-0000-0000-0000-000000000021', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.', NULL, '2025-02-01 10:20:00'),

    -- Feedback 22: AI_REVIEW_FAILED (Dừng lại, không vào PENDING)
    ('10000000-0000-0000-0000-000000000022', 'f0000000-0000-0000-0000-000000000022', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-02-02 11:00:00'),
    ('20000000-0000-0000-0000-000000000022', 'f0000000-0000-0000-0000-000000000022', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, tạm dừng tiến trình để xử lý thủ công.', NULL, '2025-02-02 11:02:00'),

    -- Feedback 23: VIOLATED_CONTENT (Dừng lại, không vào PENDING)
    ('10000000-0000-0000-0000-000000000023', 'f0000000-0000-0000-0000-000000000023', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-02-03 15:00:00'),
    ('20000000-0000-0000-0000-000000000023', 'f0000000-0000-0000-0000-000000000023', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm hoặc vi phạm tiêu chuẩn, khóa tiến trình chờ duyệt.', NULL, '2025-02-03 15:02:00'),

    -- Feedback 24: AI_REVIEW_SUCCESS -> PENDING -> IN_PROGRESS
    ('10000000-0000-0000-0000-000000000024', 'f0000000-0000-0000-0000-000000000024', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-02-05 09:30:00'),
    ('20000000-0000-0000-0000-000000000024', 'f0000000-0000-0000-0000-000000000024', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-02-05 09:32:00'),
    ('30000000-0000-0000-0000-000000000024', 'f0000000-0000-0000-0000-000000000024', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-02-05 09:35:00'),
    ('40000000-0000-0000-0000-000000000024', 'f0000000-0000-0000-0000-000000000024', 'IN_PROGRESS', 'Góp ý đang được bộ phận chuyên trách xử lý.', NULL, '2025-02-05 11:20:00'),

    -- Feedback 25: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000025', 'f0000000-0000-0000-0000-000000000025', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-02-06 14:00:00'),
    ('20000000-0000-0000-0000-000000000025', 'f0000000-0000-0000-0000-000000000025', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-02-06 14:02:00'),
    ('30000000-0000-0000-0000-000000000025', 'f0000000-0000-0000-0000-000000000025', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-02-06 14:05:00'),
    ('40000000-0000-0000-0000-000000000025', 'f0000000-0000-0000-0000-000000000025', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.', NULL, '2025-02-06 17:50:00'),

    -- Feedback 26: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000026', 'f0000000-0000-0000-0000-000000000026', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-02-08 10:00:00'),
    ('20000000-0000-0000-0000-000000000026', 'f0000000-0000-0000-0000-000000000026', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-02-08 10:02:00'),
    ('30000000-0000-0000-0000-000000000026', 'f0000000-0000-0000-0000-000000000026', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-02-08 10:05:00'),
    ('40000000-0000-0000-0000-000000000026', 'f0000000-0000-0000-0000-000000000026', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.', NULL, '2025-02-08 12:30:00'),

    -- Feedback 27: AI_REVIEW_FAILED (Dừng lại, không vào PENDING)
    ('10000000-0000-0000-0000-000000000027', 'f0000000-0000-0000-0000-000000000027', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-02-09 16:00:00'),
    ('20000000-0000-0000-0000-000000000027', 'f0000000-0000-0000-0000-000000000027', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, tạm dừng tiến trình để xử lý thủ công.', NULL, '2025-02-09 16:02:00'),

    -- Feedback 28: VIOLATED_CONTENT (Dừng lại, không vào PENDING)
    ('10000000-0000-0000-0000-000000000028', 'f0000000-0000-0000-0000-000000000028', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-02-11 11:15:00'),
    ('20000000-0000-0000-0000-000000000028', 'f0000000-0000-0000-0000-000000000028', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm hoặc vi phạm tiêu chuẩn, khóa tiến trình chờ duyệt.', NULL, '2025-02-11 11:17:00'),

    -- Feedback 29: AI_REVIEW_SUCCESS -> PENDING -> IN_PROGRESS
    ('10000000-0000-0000-0000-000000000029', 'f0000000-0000-0000-0000-000000000029', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-02-13 08:30:00'),
    ('20000000-0000-0000-0000-000000000029', 'f0000000-0000-0000-0000-000000000029', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-02-13 08:32:00'),
    ('30000000-0000-0000-0000-000000000029', 'f0000000-0000-0000-0000-000000000029', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-02-13 08:35:00'),
    ('40000000-0000-0000-0000-000000000029', 'f0000000-0000-0000-0000-000000000029', 'IN_PROGRESS', 'Góp ý đang được bộ phận chuyên trách xử lý.', NULL, '2025-02-13 10:00:00'),

    -- Feedback 30: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000030', 'f0000000-0000-0000-0000-000000000030', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-02-15 13:00:00'),
    ('20000000-0000-0000-0000-000000000030', 'f0000000-0000-0000-0000-000000000030', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-02-15 13:02:00'),
    ('30000000-0000-0000-0000-000000000030', 'f0000000-0000-0000-0000-000000000030', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-02-15 13:05:00'),
    ('40000000-0000-0000-0000-000000000030', 'f0000000-0000-0000-0000-000000000030', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.', NULL, '2025-02-15 16:20:00'),

    -- Feedback 31: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000031', 'f0000000-0000-0000-0000-000000000031', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-02-16 09:00:00'),
    ('20000000-0000-0000-0000-000000000031', 'f0000000-0000-0000-0000-000000000031', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-02-16 09:02:00'),
    ('30000000-0000-0000-0000-000000000031', 'f0000000-0000-0000-0000-000000000031', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-02-16 09:05:00'),
    ('40000000-0000-0000-0000-000000000031', 'f0000000-0000-0000-0000-000000000031', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.', NULL, '2025-02-16 11:40:00'),

    -- Feedback 32: AI_REVIEW_FAILED (Dừng lại, không vào PENDING)
    ('10000000-0000-0000-0000-000000000032', 'f0000000-0000-0000-0000-000000000032', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-02-17 14:00:00'),
    ('20000000-0000-0000-0000-000000000032', 'f0000000-0000-0000-0000-000000000032', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, tạm dừng tiến trình để xử lý thủ công.', NULL, '2025-02-17 14:02:00'),

    -- Feedback 33: VIOLATED_CONTENT (Dừng lại, không vào PENDING)
    ('10000000-0000-0000-0000-000000000033', 'f0000000-0000-0000-0000-000000000033', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-02-19 10:10:00'),
    ('20000000-0000-0000-0000-000000000033', 'f0000000-0000-0000-0000-000000000033', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm hoặc vi phạm tiêu chuẩn, khóa tiến trình chờ duyệt.', NULL, '2025-02-19 10:12:00'),

    -- Feedback 34: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000034', 'f0000000-0000-0000-0000-000000000034', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-02-20 08:30:00'),
    ('20000000-0000-0000-0000-000000000034', 'f0000000-0000-0000-0000-000000000034', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-02-20 08:32:00'),
    ('30000000-0000-0000-0000-000000000034', 'f0000000-0000-0000-0000-000000000034', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-02-20 08:35:00'),
    ('40000000-0000-0000-0000-000000000034', 'f0000000-0000-0000-0000-000000000034', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.', NULL, '2025-02-20 14:10:00'),

    -- Feedback 35: AI_REVIEW_SUCCESS -> PENDING -> REJECTED
    ('10000000-0000-0000-0000-000000000035', 'f0000000-0000-0000-0000-000000000035', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-02-22 21:00:00'),
    ('20000000-0000-0000-0000-000000000035', 'f0000000-0000-0000-0000-000000000035', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-02-22 21:02:00'),
    ('30000000-0000-0000-0000-000000000035', 'f0000000-0000-0000-0000-000000000035', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-02-22 21:05:00'),
    ('40000000-0000-0000-0000-000000000035', 'f0000000-0000-0000-0000-000000000035', 'REJECTED', 'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.', NULL, '2025-02-22 22:50:00'),

    -- Feedback 36: AI_REVIEW_SUCCESS -> PENDING -> IN_PROGRESS
    ('10000000-0000-0000-0000-000000000036', 'f0000000-0000-0000-0000-000000000036', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-02-23 11:00:00'),
    ('20000000-0000-0000-0000-000000000036', 'f0000000-0000-0000-0000-000000000036', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-02-23 11:02:00'),
    ('30000000-0000-0000-0000-000000000036', 'f0000000-0000-0000-0000-000000000036', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-02-23 11:05:00'),
    ('40000000-0000-0000-0000-000000000036', 'f0000000-0000-0000-0000-000000000036', 'IN_PROGRESS', 'Góp ý đang được bộ phận chuyên trách xử lý.', NULL, '2025-02-23 13:40:00'),

    -- Feedback 37: VIOLATED_CONTENT (Dừng lại, không vào PENDING)
    ('10000000-0000-0000-0000-000000000037', 'f0000000-0000-0000-0000-000000000037', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-02-25 15:30:00'),
    ('20000000-0000-0000-0000-000000000037', 'f0000000-0000-0000-0000-000000000037', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm hoặc vi phạm tiêu chuẩn, khóa tiến trình chờ duyệt.', NULL, '2025-02-25 15:32:00'),
    

    -- Feedback 38: AI_REVIEW_FAILED (Dừng lại, không vào PENDING)
    ('10000000-0000-0000-0000-000000000038', 'f0000000-0000-0000-0000-000000000038', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-02-26 09:00:00'),
    ('20000000-0000-0000-0000-000000000038', 'f0000000-0000-0000-0000-000000000038', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, tạm dừng tiến trình để xử lý thủ công.', NULL, '2025-02-26 09:02:00'),

    -- Feedback 39: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000039', 'f0000000-0000-0000-0000-000000000039', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-02-28 13:00:00'),
    ('20000000-0000-0000-0000-000000000039', 'f0000000-0000-0000-0000-000000000039', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-02-28 13:02:00'),
    ('30000000-0000-0000-0000-000000000039', 'f0000000-0000-0000-0000-000000000039', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-02-28 13:05:00'),
    ('40000000-0000-0000-0000-000000000039', 'f0000000-0000-0000-0000-000000000039', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.', NULL, '2025-02-28 15:30:00'),

    -- Feedback 40: AI_REVIEW_SUCCESS -> PENDING -> REJECTED
    ('10000000-0000-0000-0000-000000000040', 'f0000000-0000-0000-0000-000000000040', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-03-01 19:00:00'),
    ('20000000-0000-0000-0000-000000000040', 'f0000000-0000-0000-0000-000000000040', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-03-01 19:02:00'),
    ('30000000-0000-0000-0000-000000000040', 'f0000000-0000-0000-0000-000000000040', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-03-01 19:05:00'),
    ('40000000-0000-0000-0000-000000000040', 'f0000000-0000-0000-0000-000000000040', 'REJECTED', 'Góp ý đã bị bộ phận Phòng Quan hệ doanh nghiệp từ chối.', NULL, '2025-03-01 20:40:00'),

    -- Feedback 41: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000041', 'f0000000-0000-0000-0000-000000000041', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-03-02 08:00:00'),
    ('20000000-0000-0000-0000-000000000041', 'f0000000-0000-0000-0000-000000000041', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-03-02 08:02:00'),
    ('30000000-0000-0000-0000-000000000041', 'f0000000-0000-0000-0000-000000000041', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-03-02 08:05:00'),
    ('40000000-0000-0000-0000-000000000041', 'f0000000-0000-0000-0000-000000000041', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.', NULL, '2025-03-02 10:15:00'),

    -- Feedback 42: AI_REVIEW_FAILED (Dừng lại, không vào PENDING)
    ('10000000-0000-0000-0000-000000000042', 'f0000000-0000-0000-0000-000000000042', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-03-03 11:00:00'),
    ('20000000-0000-0000-0000-000000000042', 'f0000000-0000-0000-0000-000000000042', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, chuyển xử lý thủ công.', NULL, '2025-03-03 11:02:00'),

    -- Feedback 43: VIOLATED_CONTENT (Dừng lại, không vào PENDING)
    ('10000000-0000-0000-0000-000000000043', 'f0000000-0000-0000-0000-000000000043', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-03-04 15:00:00'),
    ('20000000-0000-0000-0000-000000000043', 'f0000000-0000-0000-0000-000000000043', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm, chuyển duyệt thủ công.', NULL, '2025-03-04 15:02:00'),

    -- Feedback 44: AI_REVIEW_SUCCESS -> PENDING -> IN_PROGRESS
    ('10000000-0000-0000-0000-000000000044', 'f0000000-0000-0000-0000-000000000044', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-03-06 09:30:00'),
    ('20000000-0000-0000-0000-000000000044', 'f0000000-0000-0000-0000-000000000044', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-03-06 09:32:00'),
    ('30000000-0000-0000-0000-000000000044', 'f0000000-0000-0000-0000-000000000044', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-03-06 09:35:00'),
    ('40000000-0000-0000-0000-000000000044', 'f0000000-0000-0000-0000-000000000044', 'IN_PROGRESS', 'Góp ý đang được bộ phận chuyên trách xử lý.', NULL, '2025-03-06 11:00:00'),

    -- Feedback 45: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000045', 'f0000000-0000-0000-0000-000000000045', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-03-07 14:00:00'),
    ('20000000-0000-0000-0000-000000000045', 'f0000000-0000-0000-0000-000000000045', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-03-07 14:02:00'),
    ('30000000-0000-0000-0000-000000000045', 'f0000000-0000-0000-0000-000000000045', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-03-07 14:05:00'),
    ('40000000-0000-0000-0000-000000000045', 'f0000000-0000-0000-0000-000000000045', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.', NULL, '2025-03-07 16:45:00'),

    -- Feedback 46: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000046', 'f0000000-0000-0000-0000-000000000046', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-03-09 10:00:00'),
    ('20000000-0000-0000-0000-000000000046', 'f0000000-0000-0000-0000-000000000046', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-03-09 10:02:00'),
    ('30000000-0000-0000-0000-000000000046', 'f0000000-0000-0000-0000-000000000046', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-03-09 10:05:00'),
    ('40000000-0000-0000-0000-000000000046', 'f0000000-0000-0000-0000-000000000046', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.', NULL, '2025-03-09 12:15:00'),

    -- Feedback 47: AI_REVIEW_FAILED (Dừng lại, không vào PENDING)
    ('10000000-0000-0000-0000-000000000047', 'f0000000-0000-0000-0000-000000000047', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-03-10 16:00:00'),
    ('20000000-0000-0000-0000-000000000047', 'f0000000-0000-0000-0000-000000000047', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, chuyển xử lý thủ công.', NULL, '2025-03-10 16:02:00'),

    -- Feedback 48: VIOLATED_CONTENT (Dừng lại, không vào PENDING)
    ('10000000-0000-0000-0000-000000000048', 'f0000000-0000-0000-0000-000000000048', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-03-12 11:15:00'),
    ('20000000-0000-0000-0000-000000000048', 'f0000000-0000-0000-0000-000000000048', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm, chuyển duyệt thủ công.', NULL, '2025-03-12 11:17:00'),

    -- Feedback 49: AI_REVIEW_SUCCESS -> PENDING -> IN_PROGRESS
    ('10000000-0000-0000-0000-000000000049', 'f0000000-0000-0000-0000-000000000049', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-03-14 08:30:00'),
    ('20000000-0000-0000-0000-000000000049', 'f0000000-0000-0000-0000-000000000049', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-03-14 08:32:00'),
    ('30000000-0000-0000-0000-000000000049', 'f0000000-0000-0000-0000-000000000049', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-03-14 08:35:00'),
    ('40000000-0000-0000-0000-000000000049', 'f0000000-0000-0000-0000-000000000049', 'IN_PROGRESS', 'Góp ý đang được bộ phận chuyên trách xử lý.', NULL, '2025-03-14 10:20:00'),

    -- Feedback 50: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000050', 'f0000000-0000-0000-0000-000000000050', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-03-15 13:00:00'),
    ('20000000-0000-0000-0000-000000000050', 'f0000000-0000-0000-0000-000000000050', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-03-15 13:02:00'),
    ('30000000-0000-0000-0000-000000000050', 'f0000000-0000-0000-0000-000000000050', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-03-15 13:05:00'),
    ('40000000-0000-0000-0000-000000000050', 'f0000000-0000-0000-0000-000000000050', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.', NULL, '2025-03-15 15:40:00'),

    -- Feedback 51: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000051', 'f0000000-0000-0000-0000-000000000051', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-03-16 09:00:00'),
    ('20000000-0000-0000-0000-000000000051', 'f0000000-0000-0000-0000-000000000051', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-03-16 09:02:00'),
    ('30000000-0000-0000-0000-000000000051', 'f0000000-0000-0000-0000-000000000051', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-03-16 09:05:00'),
    ('40000000-0000-0000-0000-000000000051', 'f0000000-0000-0000-0000-000000000051', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.', NULL, '2025-03-16 11:15:00'),

    -- Feedback 52: AI_REVIEW_FAILED (Dừng lại, không vào PENDING)
    ('10000000-0000-0000-0000-000000000052', 'f0000000-0000-0000-0000-000000000052', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-03-18 14:00:00'),
    ('20000000-0000-0000-0000-000000000052', 'f0000000-0000-0000-0000-000000000052', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, chuyển xử lý thủ công.', NULL, '2025-03-18 14:02:00'),

    -- Feedback 53: VIOLATED_CONTENT (Dừng lại, không vào PENDING)
    ('10000000-0000-0000-0000-000000000053', 'f0000000-0000-0000-0000-000000000053', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-03-19 10:10:00'),
    ('20000000-0000-0000-0000-000000000053', 'f0000000-0000-0000-0000-000000000053', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm, chuyển duyệt thủ công.', NULL, '2025-03-19 10:12:00'),

    -- Feedback 54: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000054', 'f0000000-0000-0000-0000-000000000054', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-03-21 08:30:00'),
    ('20000000-0000-0000-0000-000000000054', 'f0000000-0000-0000-0000-000000000054', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-03-21 08:32:00'),
    ('30000000-0000-0000-0000-000000000054', 'f0000000-0000-0000-0000-000000000054', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-03-21 08:35:00'),
    ('40000000-0000-0000-0000-000000000054', 'f0000000-0000-0000-0000-000000000054', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.', NULL, '2025-03-21 15:10:00'),

    -- Feedback 55: AI_REVIEW_SUCCESS -> PENDING -> REJECTED
    ('10000000-0000-0000-0000-000000000055', 'f0000000-0000-0000-0000-000000000055', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-03-22 21:00:00'),
    ('20000000-0000-0000-0000-000000000055', 'f0000000-0000-0000-0000-000000000055', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-03-22 21:02:00'),
    ('30000000-0000-0000-0000-000000000055', 'f0000000-0000-0000-0000-000000000055', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-03-22 21:05:00'),
    ('40000000-0000-0000-0000-000000000055', 'f0000000-0000-0000-0000-000000000055', 'REJECTED', 'Góp ý đã bị bộ phận Phòng Quan hệ doanh nghiệp từ chối.', NULL, '2025-03-22 23:45:00'),

    -- Feedback 56: AI_REVIEW_SUCCESS -> PENDING -> IN_PROGRESS
    ('10000000-0000-0000-0000-000000000056', 'f0000000-0000-0000-0000-000000000056', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-03-24 11:00:00'),
    ('20000000-0000-0000-0000-000000000056', 'f0000000-0000-0000-0000-000000000056', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-03-24 11:02:00'),
    ('30000000-0000-0000-0000-000000000056', 'f0000000-0000-0000-0000-000000000056', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-03-24 11:05:00'),
    ('40000000-0000-0000-0000-000000000056', 'f0000000-0000-0000-0000-000000000056', 'IN_PROGRESS', 'Góp ý đang được bộ phận chuyên trách xử lý.', NULL, '2025-03-24 14:00:00'),

    -- Feedback 57: VIOLATED_CONTENT (Dừng lại, không vào PENDING)
    ('10000000-0000-0000-0000-000000000057', 'f0000000-0000-0000-0000-000000000057', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-03-26 15:30:00'),
    ('20000000-0000-0000-0000-000000000057', 'f0000000-0000-0000-0000-000000000057', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm, chuyển duyệt thủ công.', NULL, '2025-03-26 15:32:00'),

    -- Feedback 58: AI_REVIEW_FAILED (Dừng lại, không vào PENDING)
    ('10000000-0000-0000-0000-000000000058', 'f0000000-0000-0000-0000-000000000058', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-03-28 09:00:00'),
    ('20000000-0000-0000-0000-000000000058', 'f0000000-0000-0000-0000-000000000058', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, chuyển xử lý thủ công.', NULL, '2025-03-28 09:02:00'),

    -- Feedback 59: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000059', 'f0000000-0000-0000-0000-000000000059', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-03-29 13:00:00'),
    ('20000000-0000-0000-0000-000000000059', 'f0000000-0000-0000-0000-000000000059', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-03-29 13:02:00'),
    ('30000000-0000-0000-0000-000000000059', 'f0000000-0000-0000-0000-000000000059', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-03-29 13:05:00'),
    ('40000000-0000-0000-0000-000000000059', 'f0000000-0000-0000-0000-000000000059', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.', NULL, '2025-03-29 14:50:00'),

    -- Feedback 60: AI_REVIEW_SUCCESS -> PENDING -> REJECTED
    ('10000000-0000-0000-0000-000000000060', 'f0000000-0000-0000-0000-000000000060', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-03-31 19:00:00'),
    ('20000000-0000-0000-0000-000000000060', 'f0000000-0000-0000-0000-000000000060', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-03-31 19:02:00'),
    ('30000000-0000-0000-0000-000000000060', 'f0000000-0000-0000-0000-000000000060', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-03-31 19:05:00'),
    ('40000000-0000-0000-0000-000000000060', 'f0000000-0000-0000-0000-000000000060', 'REJECTED', 'Góp ý đã bị bộ phận Phòng Quan hệ doanh nghiệp từ chối.', NULL, '2025-03-31 20:30:00'),

    -- Feedback 61: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000061', 'f0000000-0000-0000-0000-000000000061', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-04-02 08:00:00'),
    ('20000000-0000-0000-0000-000000000061', 'f0000000-0000-0000-0000-000000000061', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-04-02 08:02:00'),
    ('30000000-0000-0000-0000-000000000061', 'f0000000-0000-0000-0000-000000000061', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-04-02 08:05:00'),
    ('40000000-0000-0000-0000-000000000061', 'f0000000-0000-0000-0000-000000000061', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.', NULL, '2025-04-02 10:10:00'),

    -- Feedback 62: AI_REVIEW_FAILED (Dừng lại, không tạo trạng thái phía sau)
    ('10000000-0000-0000-0000-000000000062', 'f0000000-0000-0000-0000-000000000062', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-04-03 11:00:00'),
    ('20000000-0000-0000-0000-000000000062', 'f0000000-0000-0000-0000-000000000062', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, chuyển xử lý thủ công.', NULL, '2025-04-03 11:02:00'),

    -- Feedback 63: VIOLATED_CONTENT (Dừng lại, không tạo trạng thái phía sau)
    ('10000000-0000-0000-0000-000000000063', 'f0000000-0000-0000-0000-000000000063', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-04-05 15:00:00'),
    ('20000000-0000-0000-0000-000000000063', 'f0000000-0000-0000-0000-000000000063', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm, chuyển duyệt thủ công.', NULL, '2025-04-05 15:02:00'),

    -- Feedback 64: AI_REVIEW_SUCCESS -> PENDING -> IN_PROGRESS
    ('10000000-0000-0000-0000-000000000064', 'f0000000-0000-0000-0000-000000000064', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-04-06 09:30:00'),
    ('20000000-0000-0000-0000-000000000064', 'f0000000-0000-0000-0000-000000000064', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-04-06 09:32:00'),
    ('30000000-0000-0000-0000-000000000064', 'f0000000-0000-0000-0000-000000000064', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-04-06 09:35:00'),
    ('40000000-0000-0000-0000-000000000064', 'f0000000-0000-0000-0000-000000000064', 'IN_PROGRESS', 'Góp ý đang được bộ phận chuyên trách xử lý.', NULL, '2025-04-06 11:40:00'),

    -- Feedback 65: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000065', 'f0000000-0000-0000-0000-000000000065', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-04-07 14:00:00'),
    ('20000000-0000-0000-0000-000000000065', 'f0000000-0000-0000-0000-000000000065', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-04-07 14:02:00'),
    ('30000000-0000-0000-0000-000000000065', 'f0000000-0000-0000-0000-000000000065', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-04-07 14:05:00'),
    ('40000000-0000-0000-0000-000000000065', 'f0000000-0000-0000-0000-000000000065', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.', NULL, '2025-04-07 16:25:00'),

    -- Feedback 66: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000066', 'f0000000-0000-0000-0000-000000000066', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-04-09 10:00:00'),
    ('20000000-0000-0000-0000-000000000066', 'f0000000-0000-0000-0000-000000000066', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-04-09 10:02:00'),
    ('30000000-0000-0000-0000-000000000066', 'f0000000-0000-0000-0000-000000000066', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-04-09 10:05:00'),
    ('40000000-0000-0000-0000-000000000066', 'f0000000-0000-0000-0000-000000000066', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.', NULL, '2025-04-09 12:40:00'),

    -- Feedback 67: AI_REVIEW_FAILED (Dừng lại, không tạo trạng thái phía sau)
    ('10000000-0000-0000-0000-000000000067', 'f0000000-0000-0000-0000-000000000067', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-04-10 16:00:00'),
    ('20000000-0000-0000-0000-000000000067', 'f0000000-0000-0000-0000-000000000067', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, chuyển xử lý thủ công.', NULL, '2025-04-10 16:02:00'),

    -- Feedback 68: VIOLATED_CONTENT (Dừng lại, không tạo trạng thái phía sau)
    ('10000000-0000-0000-0000-000000000068', 'f0000000-0000-0000-0000-000000000068', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-04-12 11:15:00'),
    ('20000000-0000-0000-0000-000000000068', 'f0000000-0000-0000-0000-000000000068', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm, chuyển duyệt thủ công.', NULL, '2025-04-12 11:17:00'),

    -- Feedback 69: AI_REVIEW_SUCCESS -> PENDING -> IN_PROGRESS
    ('10000000-0000-0000-0000-000000000069', 'f0000000-0000-0000-0000-000000000069', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-04-14 08:30:00'),
    ('20000000-0000-0000-0000-000000000069', 'f0000000-0000-0000-0000-000000000069', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-04-14 08:32:00'),
    ('30000000-0000-0000-0000-000000000069', 'f0000000-0000-0000-0000-000000000069', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-04-14 08:35:00'),
    ('40000000-0000-0000-0000-000000000069', 'f0000000-0000-0000-0000-000000000069', 'IN_PROGRESS', 'Góp ý đang được bộ phận chuyên trách xử lý.', NULL, '2025-04-14 10:15:00'),

    -- Feedback 70: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000070', 'f0000000-0000-0000-0000-000000000070', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-04-15 13:00:00'),
    ('20000000-0000-0000-0000-000000000070', 'f0000000-0000-0000-0000-000000000070', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-04-15 13:02:00'),
    ('30000000-0000-0000-0000-000000000070', 'f0000000-0000-0000-0000-000000000070', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-04-15 13:05:00'),
    ('40000000-0000-0000-0000-000000000070', 'f0000000-0000-0000-0000-000000000070', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.', NULL, '2025-04-15 14:55:00'),

    -- Feedback 71: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000071', 'f0000000-0000-0000-0000-000000000071', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-04-16 09:00:00'),
    ('20000000-0000-0000-0000-000000000071', 'f0000000-0000-0000-0000-000000000071', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-04-16 09:02:00'),
    ('30000000-0000-0000-0000-000000000071', 'f0000000-0000-0000-0000-000000000071', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-04-16 09:05:00'),
    ('40000000-0000-0000-0000-000000000071', 'f0000000-0000-0000-0000-000000000071', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.', NULL, '2025-04-16 11:30:00'),

    -- Feedback 72: AI_REVIEW_FAILED (Dừng lại, không tạo trạng thái phía sau)
    ('10000000-0000-0000-0000-000000000072', 'f0000000-0000-0000-0000-000000000072', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-04-17 14:00:00'),
    ('20000000-0000-0000-0000-000000000072', 'f0000000-0000-0000-0000-000000000072', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, chuyển xử lý thủ công.', NULL, '2025-04-17 14:02:00'),

    -- Feedback 73: VIOLATED_CONTENT (Dừng lại, không tạo trạng thái phía sau)
    ('10000000-0000-0000-0000-000000000073', 'f0000000-0000-0000-0000-000000000073', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-04-19 10:10:00'),
    ('20000000-0000-0000-0000-000000000073', 'f0000000-0000-0000-0000-000000000073', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm, chuyển duyệt thủ công.', NULL, '2025-04-19 10:12:00'),

    -- Feedback 74: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000074', 'f0000000-0000-0000-0000-000000000074', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-04-21 08:30:00'),
    ('20000000-0000-0000-0000-000000000074', 'f0000000-0000-0000-0000-000000000074', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-04-21 08:32:00'),
    ('30000000-0000-0000-0000-000000000074', 'f0000000-0000-0000-0000-000000000074', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-04-21 08:35:00'),
    ('40000000-0000-0000-0000-000000000074', 'f0000000-0000-0000-0000-000000000074', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.', NULL, '2025-04-21 14:40:00'),

    -- Feedback 75: AI_REVIEW_SUCCESS -> PENDING -> REJECTED
    ('10000000-0000-0000-0000-000000000075', 'f0000000-0000-0000-0000-000000000075', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-04-22 21:00:00'),
    ('20000000-0000-0000-0000-000000000075', 'f0000000-0000-0000-0000-000000000075', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-04-22 21:02:00'),
    ('30000000-0000-0000-0000-000000000075', 'f0000000-0000-0000-0000-000000000075', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-04-22 21:05:00'),
    ('40000000-0000-0000-0000-000000000075', 'f0000000-0000-0000-0000-000000000075', 'REJECTED', 'Góp ý đã bị bộ phận Phòng Khoa học & Công nghệ từ chối.', NULL, '2025-04-22 23:10:00'),

    -- Feedback 76: AI_REVIEW_SUCCESS -> PENDING -> IN_PROGRESS
    ('10000000-0000-0000-0000-000000000076', 'f0000000-0000-0000-0000-000000000076', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-04-24 11:00:00'),
    ('20000000-0000-0000-0000-000000000076', 'f0000000-0000-0000-0000-000000000076', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-04-24 11:02:00'),
    ('30000000-0000-0000-0000-000000000076', 'f0000000-0000-0000-0000-000000000076', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-04-24 11:05:00'),
    ('40000000-0000-0000-0000-000000000076', 'f0000000-0000-0000-0000-000000000076', 'IN_PROGRESS', 'Góp ý đang được bộ phận chuyên trách xử lý.', NULL, '2025-04-24 14:15:00'),

    -- Feedback 77: VIOLATED_CONTENT (Dừng lại, không tạo trạng thái phía sau)
    ('10000000-0000-0000-0000-000000000077', 'f0000000-0000-0000-0000-000000000077', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-04-26 15:30:00'),
    ('20000000-0000-0000-0000-000000000077', 'f0000000-0000-0000-0000-000000000077', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm, chuyển duyệt thủ công.', NULL, '2025-04-26 15:32:00'),

    -- Feedback 78: AI_REVIEW_FAILED (Dừng lại, không tạo trạng thái phía sau)
    ('10000000-0000-0000-0000-000000000078', 'f0000000-0000-0000-0000-000000000078', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-04-28 09:00:00'),
    ('20000000-0000-0000-0000-000000000078', 'f0000000-0000-0000-0000-000000000078', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, chuyển xử lý thủ công.', NULL, '2025-04-28 09:02:00'),

    -- Feedback 79: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000079', 'f0000000-0000-0000-0000-000000000079', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-04-29 13:00:00'),
    ('20000000-0000-0000-0000-000000000079', 'f0000000-0000-0000-0000-000000000079', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-04-29 13:02:00'),
    ('30000000-0000-0000-0000-000000000079', 'f0000000-0000-0000-0000-000000000079', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-04-29 13:05:00'),
    ('40000000-0000-0000-0000-000000000079', 'f0000000-0000-0000-0000-000000000079', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.', NULL, '2025-04-29 15:45:00'),

    -- Feedback 80: AI_REVIEW_SUCCESS -> PENDING -> REJECTED
    ('10000000-0000-0000-0000-000000000080', 'f0000000-0000-0000-0000-000000000080', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-04-30 19:00:00'),
    ('20000000-0000-0000-0000-000000000080', 'f0000000-0000-0000-0000-000000000080', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-04-30 19:02:00'),
    ('30000000-0000-0000-0000-000000000080', 'f0000000-0000-0000-0000-000000000080', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-04-30 19:05:00'),
    ('40000000-0000-0000-0000-000000000080', 'f0000000-0000-0000-0000-000000000080', 'REJECTED', 'Góp ý đã bị bộ phận Phòng Khoa học & Công nghệ từ chối.', NULL, '2025-04-30 21:00:00'),

    -- Feedback 81: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000081', 'f0000000-0000-0000-0000-000000000081', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-05-02 08:00:00'),
    ('20000000-0000-0000-0000-000000000081', 'f0000000-0000-0000-0000-000000000081', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-05-02 08:02:00'),
    ('30000000-0000-0000-0000-000000000081', 'f0000000-0000-0000-0000-000000000081', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-05-02 08:05:00'),
    ('40000000-0000-0000-0000-000000000081', 'f0000000-0000-0000-0000-000000000081', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.', NULL, '2025-05-02 09:50:00'),

    -- Feedback 82: AI_REVIEW_FAILED (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000082', 'f0000000-0000-0000-0000-000000000082', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-05-03 11:00:00'),
    ('20000000-0000-0000-0000-000000000082', 'f0000000-0000-0000-0000-000000000082', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, chuyển xử lý thủ công.', NULL, '2025-05-03 11:02:00'),

    -- Feedback 83: VIOLATED_CONTENT (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000083', 'f0000000-0000-0000-0000-000000000083', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-05-05 15:00:00'),
    ('20000000-0000-0000-0000-000000000083', 'f0000000-0000-0000-0000-000000000083', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm, chuyển duyệt thủ công.', NULL, '2025-05-05 15:02:00'),

    -- Feedback 84: AI_REVIEW_SUCCESS -> PENDING -> IN_PROGRESS
    ('10000000-0000-0000-0000-000000000084', 'f0000000-0000-0000-0000-000000000084', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-05-06 09:30:00'),
    ('20000000-0000-0000-0000-000000000084', 'f0000000-0000-0000-0000-000000000084', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-05-06 09:32:00'),
    ('30000000-0000-0000-0000-000000000084', 'f0000000-0000-0000-0000-000000000084', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-05-06 09:35:00'),
    ('40000000-0000-0000-0000-000000000084', 'f0000000-0000-0000-0000-000000000084', 'IN_PROGRESS', 'Góp ý đang được bộ phận chuyên trách xử lý.', NULL, '2025-05-06 11:20:00'),

    -- Feedback 85: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000085', 'f0000000-0000-0000-0000-000000000085', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-05-07 14:00:00'),
    ('20000000-0000-0000-0000-000000000085', 'f0000000-0000-0000-0000-000000000085', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-05-07 14:02:00'),
    ('30000000-0000-0000-0000-000000000085', 'f0000000-0000-0000-0000-000000000085', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-05-07 14:05:00'),
    ('40000000-0000-0000-0000-000000000085', 'f0000000-0000-0000-0000-000000000085', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.', NULL, '2025-05-07 16:15:00'),

    -- Feedback 86: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000086', 'f0000000-0000-0000-0000-000000000086', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-05-09 10:00:00'),
    ('20000000-0000-0000-0000-000000000086', 'f0000000-0000-0000-0000-000000000086', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-05-09 10:02:00'),
    ('30000000-0000-0000-0000-000000000086', 'f0000000-0000-0000-0000-000000000086', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-05-09 10:05:00'),
    ('40000000-0000-0000-0000-000000000086', 'f0000000-0000-0000-0000-000000000086', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.', NULL, '2025-05-09 12:45:00'),

    -- Feedback 87: AI_REVIEW_FAILED (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000087', 'f0000000-0000-0000-0000-000000000087', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-05-10 16:00:00'),
    ('20000000-0000-0000-0000-000000000087', 'f0000000-0000-0000-0000-000000000087', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, chuyển xử lý thủ công.', NULL, '2025-05-10 16:02:00'),

    -- Feedback 88: VIOLATED_CONTENT (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000088', 'f0000000-0000-0000-0000-000000000088', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-05-12 11:15:00'),
    ('20000000-0000-0000-0000-000000000088', 'f0000000-0000-0000-0000-000000000088', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm, chuyển duyệt thủ công.', NULL, '2025-05-12 11:17:00'),

    -- Feedback 89: AI_REVIEW_SUCCESS -> PENDING -> IN_PROGRESS
    ('10000000-0000-0000-0000-000000000089', 'f0000000-0000-0000-0000-000000000089', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-05-14 08:30:00'),
    ('20000000-0000-0000-0000-000000000089', 'f0000000-0000-0000-0000-000000000089', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-05-14 08:32:00'),
    ('30000000-0000-0000-0000-000000000089', 'f0000000-0000-0000-0000-000000000089', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-05-14 08:35:00'),
    ('40000000-0000-0000-0000-000000000089', 'f0000000-0000-0000-0000-000000000089', 'IN_PROGRESS', 'Góp ý đang được bộ phận chuyên trách xử lý.', NULL, '2025-05-14 10:45:00'),

    -- Feedback 90: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000090', 'f0000000-0000-0000-0000-000000000090', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-05-15 13:00:00'),
    ('20000000-0000-0000-0000-000000000090', 'f0000000-0000-0000-0000-000000000090', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-05-15 13:02:00'),
    ('30000000-0000-0000-0000-000000000090', 'f0000000-0000-0000-0000-000000000090', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-05-15 13:05:00'),
    ('40000000-0000-0000-0000-000000000090', 'f0000000-0000-0000-0000-000000000090', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.', NULL, '2025-05-15 15:20:00'),

    -- Feedback 91: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000091', 'f0000000-0000-0000-0000-000000000091', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-05-16 09:00:00'),
    ('20000000-0000-0000-0000-000000000091', 'f0000000-0000-0000-0000-000000000091', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-05-16 09:02:00'),
    ('30000000-0000-0000-0000-000000000091', 'f0000000-0000-0000-0000-000000000091', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-05-16 09:05:00'),
    ('40000000-0000-0000-0000-000000000091', 'f0000000-0000-0000-0000-000000000091', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.', NULL, '2025-05-16 11:10:00'),

    -- Feedback 92: AI_REVIEW_FAILED (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000092', 'f0000000-0000-0000-0000-000000000092', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-05-17 14:00:00'),
    ('20000000-0000-0000-0000-000000000092', 'f0000000-0000-0000-0000-000000000092', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, chuyển xử lý thủ công.', NULL, '2025-05-17 14:02:00'),

    -- Feedback 93: VIOLATED_CONTENT (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000093', 'f0000000-0000-0000-0000-000000000093', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-05-19 10:10:00'),
    ('20000000-0000-0000-0000-000000000093', 'f0000000-0000-0000-0000-000000000093', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm, chuyển duyệt thủ công.', NULL, '2025-05-19 10:12:00'),

    -- Feedback 94: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000094', 'f0000000-0000-0000-0000-000000000094', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-05-21 08:30:00'),
    ('20000000-0000-0000-0000-000000000094', 'f0000000-0000-0000-0000-000000000094', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-05-21 08:32:00'),
    ('30000000-0000-0000-0000-000000000094', 'f0000000-0000-0000-0000-000000000094', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-05-21 08:35:00'),
    ('40000000-0000-0000-0000-000000000094', 'f0000000-0000-0000-0000-000000000094', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.', NULL, '2025-05-21 14:15:00'),

    -- Feedback 95: AI_REVIEW_SUCCESS -> PENDING -> REJECTED
    ('10000000-0000-0000-0000-000000000095', 'f0000000-0000-0000-0000-000000000095', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-05-22 21:00:00'),
    ('20000000-0000-0000-0000-000000000095', 'f0000000-0000-0000-0000-000000000095', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-05-22 21:02:00'),
    ('30000000-0000-0000-0000-000000000095', 'f0000000-0000-0000-0000-000000000095', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-05-22 21:05:00'),
    ('40000000-0000-0000-0000-000000000095', 'f0000000-0000-0000-0000-000000000095', 'REJECTED', 'Góp ý đã bị bộ phận Phòng Khoa học & Công nghệ từ chối.', NULL, '2025-05-22 22:50:00'),

    -- Feedback 96: AI_REVIEW_SUCCESS -> PENDING -> IN_PROGRESS
    ('10000000-0000-0000-0000-000000000096', 'f0000000-0000-0000-0000-000000000096', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-05-23 11:00:00'),
    ('20000000-0000-0000-0000-000000000096', 'f0000000-0000-0000-0000-000000000096', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-05-23 11:02:00'),
    ('30000000-0000-0000-0000-000000000096', 'f0000000-0000-0000-0000-000000000096', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-05-23 11:05:00'),
    ('40000000-0000-0000-0000-000000000096', 'f0000000-0000-0000-0000-000000000096', 'IN_PROGRESS', 'Góp ý đang được bộ phận chuyên trách xử lý.', NULL, '2025-05-23 13:30:00'),

    -- Feedback 97: VIOLATED_CONTENT (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000097', 'f0000000-0000-0000-0000-000000000097', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-05-25 15:30:00'),
    ('20000000-0000-0000-0000-000000000097', 'f0000000-0000-0000-0000-000000000097', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm, chuyển duyệt thủ công.', NULL, '2025-05-25 15:32:00'),

    -- Feedback 98: AI_REVIEW_FAILED (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000098', 'f0000000-0000-0000-0000-000000000098', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-05-26 09:00:00'),
    ('20000000-0000-0000-0000-000000000098', 'f0000000-0000-0000-0000-000000000098', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, chuyển xử lý thủ công.', NULL, '2025-05-26 09:02:00'),

    -- Feedback 99: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000099', 'f0000000-0000-0000-0000-000000000099', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-05-28 13:00:00'),
    ('20000000-0000-0000-0000-000000000099', 'f0000000-0000-0000-0000-000000000099', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-05-28 13:02:00'),
    ('30000000-0000-0000-0000-000000000099', 'f0000000-0000-0000-0000-000000000099', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-05-28 13:05:00'),
    ('40000000-0000-0000-0000-000000000099', 'f0000000-0000-0000-0000-000000000099', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.', NULL, '2025-05-28 15:20:00'),

    -- Feedback 100: AI_REVIEW_SUCCESS -> PENDING -> REJECTED
    ('10000000-0000-0000-0000-000000000100', 'f0000000-0000-0000-0000-000000000100', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-05-30 19:00:00'),
    ('20000000-0000-0000-0000-000000000100', 'f0000000-0000-0000-0000-000000000100', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-05-30 19:02:00'),
    ('30000000-0000-0000-0000-000000000100', 'f0000000-0000-0000-0000-000000000100', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-05-30 19:05:00'),
    ('40000000-0000-0000-0000-000000000100', 'f0000000-0000-0000-0000-000000000100', 'REJECTED', 'Góp ý đã bị bộ phận Phòng Khoa học & Công nghệ từ chối.', NULL, '2025-05-30 20:45:00'),

    -- Feedback 166: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000166', 'f0000000-0000-0000-0000-000000000166', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-06-01 08:30:00'),
    ('20000000-0000-0000-0000-000000000166', 'f0000000-0000-0000-0000-000000000166', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-06-01 08:32:00'),
    ('30000000-0000-0000-0000-000000000166', 'f0000000-0000-0000-0000-000000000166', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-06-01 08:35:00'),
    ('40000000-0000-0000-0000-000000000166', 'f0000000-0000-0000-0000-000000000166', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Quản trị cơ sở vật chất giải quyết.', NULL, '2025-06-01 10:40:00'),

    -- Feedback 167: AI_REVIEW_FAILED (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000167', 'f0000000-0000-0000-0000-000000000167', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-06-02 11:00:00'),
    ('20000000-0000-0000-0000-000000000167', 'f0000000-0000-0000-0000-000000000167', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, chuyển xử lý thủ công.', NULL, '2025-06-02 11:02:00'),

    -- Feedback 168: VIOLATED_CONTENT (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000168', 'f0000000-0000-0000-0000-000000000168', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-06-04 15:00:00'),
    ('20000000-0000-0000-0000-000000000168', 'f0000000-0000-0000-0000-000000000168', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm, chuyển duyệt thủ công.', NULL, '2025-06-04 15:02:00'),

    -- Feedback 169: AI_REVIEW_SUCCESS -> PENDING -> IN_PROGRESS
    ('10000000-0000-0000-0000-000000000169', 'f0000000-0000-0000-0000-000000000169', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-06-05 09:30:00'),
    ('20000000-0000-0000-0000-000000000169', 'f0000000-0000-0000-0000-000000000169', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-06-05 09:32:00'),
    ('30000000-0000-0000-0000-000000000169', 'f0000000-0000-0000-0000-000000000169', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-06-05 09:35:00'),
    ('40000000-0000-0000-0000-000000000169', 'f0000000-0000-0000-0000-000000000169', 'IN_PROGRESS', 'Góp ý đang được bộ phận Phòng Quản trị cơ sở vật chất xử lý.', NULL, '2025-06-05 11:15:00'),

    -- Feedback 170: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000170', 'f0000000-0000-0000-0000-000000000170', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-06-07 14:00:00'),
    ('20000000-0000-0000-0000-000000000170', 'f0000000-0000-0000-0000-000000000170', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-06-07 14:02:00'),
    ('30000000-0000-0000-0000-000000000170', 'f0000000-0000-0000-0000-000000000170', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-06-07 14:05:00'),
    ('40000000-0000-0000-0000-000000000170', 'f0000000-0000-0000-0000-000000000170', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Quản trị cơ sở vật chất giải quyết.', NULL, '2025-06-07 16:30:00'),

    -- Feedback 171: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000171', 'f0000000-0000-0000-0000-000000000171', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-06-08 10:00:00'),
    ('20000000-0000-0000-0000-000000000171', 'f0000000-0000-0000-0000-000000000171', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-06-08 10:02:00'),
    ('30000000-0000-0000-0000-000000000171', 'f0000000-0000-0000-0000-000000000171', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-06-08 10:05:00'),
    ('40000000-0000-0000-0000-000000000171', 'f0000000-0000-0000-0000-000000000171', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Quản trị cơ sở vật chất giải quyết.', NULL, '2025-06-08 12:20:00'),

    -- Feedback 172: AI_REVIEW_FAILED (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000172', 'f0000000-0000-0000-0000-000000000172', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-06-10 16:00:00'),
    ('20000000-0000-0000-0000-000000000172', 'f0000000-0000-0000-0000-000000000172', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, chuyển xử lý thủ công.', NULL, '2025-06-10 16:02:00'),

    -- Feedback 173: VIOLATED_CONTENT (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000173', 'f0000000-0000-0000-0000-000000000173', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-06-12 11:15:00'),
    ('20000000-0000-0000-0000-000000000173', 'f0000000-0000-0000-0000-000000000173', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm, chuyển duyệt thủ công.', NULL, '2025-06-12 11:17:00'),

    -- Feedback 174: AI_REVIEW_SUCCESS -> PENDING -> IN_PROGRESS
    ('10000000-0000-0000-0000-000000000174', 'f0000000-0000-0000-0000-000000000174', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-06-14 08:30:00'),
    ('20000000-0000-0000-0000-000000000174', 'f0000000-0000-0000-0000-000000000174', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-06-14 08:32:00'),
    ('30000000-0000-0000-0000-000000000174', 'f0000000-0000-0000-0000-000000000174', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-06-14 08:35:00'),
    ('40000000-0000-0000-0000-000000000174', 'f0000000-0000-0000-0000-000000000174', 'IN_PROGRESS', 'Góp ý đang được bộ phận Phòng Quản trị cơ sở vật chất xử lý.', NULL, '2025-06-14 10:40:00'),

    -- Feedback 175: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000175', 'f0000000-0000-0000-0000-000000000175', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-06-15 13:00:00'),
    ('20000000-0000-0000-0000-000000000175', 'f0000000-0000-0000-0000-000000000175', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-06-15 13:02:00'),
    ('30000000-0000-0000-0000-000000000175', 'f0000000-0000-0000-0000-000000000175', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-06-15 13:05:00'),
    ('40000000-0000-0000-0000-000000000175', 'f0000000-0000-0000-0000-000000000175', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Quản trị cơ sở vật chất giải quyết.', NULL, '2025-06-15 15:15:00'),

    -- Feedback 176: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000176', 'f0000000-0000-0000-0000-000000000176', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-06-16 09:00:00'),
    ('20000000-0000-0000-0000-000000000176', 'f0000000-0000-0000-0000-000000000176', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-06-16 09:02:00'),
    ('30000000-0000-0000-0000-000000000176', 'f0000000-0000-0000-0000-000000000176', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-06-16 09:05:00'),
    ('40000000-0000-0000-0000-000000000176', 'f0000000-0000-0000-0000-000000000176', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Quản trị cơ sở vật chất giải quyết.', NULL, '2025-06-16 11:25:00'),

    -- Feedback 177: AI_REVIEW_FAILED (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000177', 'f0000000-0000-0000-0000-000000000177', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-06-17 14:00:00'),
    ('20000000-0000-0000-0000-000000000177', 'f0000000-0000-0000-0000-000000000177', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, chuyển xử lý thủ công.', NULL, '2025-06-17 14:02:00'),

    -- Feedback 178: VIOLATED_CONTENT (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000178', 'f0000000-0000-0000-0000-000000000178', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-06-19 10:10:00'),
    ('20000000-0000-0000-0000-000000000178', 'f0000000-0000-0000-0000-000000000178', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm, chuyển duyệt thủ công.', NULL, '2025-06-19 10:12:00'),

    -- Feedback 179: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000179', 'f0000000-0000-0000-0000-000000000179', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-06-21 08:30:00'),
    ('20000000-0000-0000-0000-000000000179', 'f0000000-0000-0000-0000-000000000179', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-06-21 08:32:00'),
    ('30000000-0000-0000-0000-000000000179', 'f0000000-0000-0000-0000-000000000179', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-06-21 08:35:00'),
    ('40000000-0000-0000-0000-000000000179', 'f0000000-0000-0000-0000-000000000179', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Quản trị cơ sở vật chất giải quyết.', NULL, '2025-06-21 13:55:00'),

    -- Feedback 180: AI_REVIEW_SUCCESS -> PENDING -> REJECTED
    ('10000000-0000-0000-0000-000000000180', 'f0000000-0000-0000-0000-000000000180', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-06-22 21:00:00'),
    ('20000000-0000-0000-0000-000000000180', 'f0000000-0000-0000-0000-000000000180', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-06-22 21:02:00'),
    ('30000000-0000-0000-0000-000000000180', 'f0000000-0000-0000-0000-000000000180', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-06-22 21:05:00'),
    ('40000000-0000-0000-0000-000000000180', 'f0000000-0000-0000-0000-000000000180', 'REJECTED', 'Góp ý đã bị bộ phận Phòng Quản trị cơ sở vật chất từ chối.', NULL, '2025-06-22 22:40:00'),

    -- Feedback 181: AI_REVIEW_SUCCESS -> PENDING -> IN_PROGRESS
    ('10000000-0000-0000-0000-000000000181', 'f0000000-0000-0000-0000-000000000181', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-06-24 11:00:00'),
    ('20000000-0000-0000-0000-000000000181', 'f0000000-0000-0000-0000-000000000181', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-06-24 11:02:00'),
    ('30000000-0000-0000-0000-000000000181', 'f0000000-0000-0000-0000-000000000181', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-06-24 11:05:00'),
    ('40000000-0000-0000-0000-000000000181', 'f0000000-0000-0000-0000-000000000181', 'IN_PROGRESS', 'Góp ý đang được bộ phận Phòng Quản trị cơ sở vật chất xử lý.', NULL, '2025-06-24 14:10:00'),

    -- Feedback 182: VIOLATED_CONTENT (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000182', 'f0000000-0000-0000-0000-000000000182', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-06-26 15:30:00'),
    ('20000000-0000-0000-0000-000000000182', 'f0000000-0000-0000-0000-000000000182', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm, chuyển duyệt thủ công.', NULL, '2025-06-26 15:32:00'),

    -- Feedback 183: AI_REVIEW_FAILED (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000183', 'f0000000-0000-0000-0000-000000000183', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-06-28 09:00:00'),
    ('20000000-0000-0000-0000-000000000183', 'f0000000-0000-0000-0000-000000000183', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, chuyển xử lý thủ công.', NULL, '2025-06-28 09:02:00'),

    -- Feedback 184: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000184', 'f0000000-0000-0000-0000-000000000184', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-06-29 13:00:00'),
    ('20000000-0000-0000-0000-000000000184', 'f0000000-0000-0000-0000-000000000184', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-06-29 13:02:00'),
    ('30000000-0000-0000-0000-000000000184', 'f0000000-0000-0000-0000-000000000184', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-06-29 13:05:00'),
    ('40000000-0000-0000-0000-000000000184', 'f0000000-0000-0000-0000-000000000184', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Quản trị cơ sở vật chất giải quyết.', NULL, '2025-06-29 15:10:00'),

    -- Feedback 185: AI_REVIEW_SUCCESS -> PENDING -> REJECTED
    ('10000000-0000-0000-0000-000000000185', 'f0000000-0000-0000-0000-000000000185', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-06-30 19:00:00'),
    ('20000000-0000-0000-0000-000000000185', 'f0000000-0000-0000-0000-000000000185', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-06-30 19:02:00'),
    ('30000000-0000-0000-0000-000000000185', 'f0000000-0000-0000-0000-000000000185', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-06-30 19:05:00'),
    ('40000000-0000-0000-0000-000000000185', 'f0000000-0000-0000-0000-000000000185', 'REJECTED', 'Góp ý đã bị bộ phận Phòng Quản trị cơ sở vật chất từ chối.', NULL, '2025-06-30 20:35:00'),

    -- Feedback 186: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000186', 'f0000000-0000-0000-0000-000000000186', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-07-02 08:30:00'),
    ('20000000-0000-0000-0000-000000000186', 'f0000000-0000-0000-0000-000000000186', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-07-02 08:32:00'),
    ('30000000-0000-0000-0000-000000000186', 'f0000000-0000-0000-0000-000000000186', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-07-02 08:35:00'),
    ('40000000-0000-0000-0000-000000000186', 'f0000000-0000-0000-0000-000000000186', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Quản trị cơ sở vật chất giải quyết.', NULL, '2025-07-02 10:45:00'),

    -- Feedback 187: AI_REVIEW_FAILED (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000187', 'f0000000-0000-0000-0000-000000000187', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-07-03 11:00:00'),
    ('20000000-0000-0000-0000-000000000187', 'f0000000-0000-0000-0000-000000000187', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, chuyển xử lý thủ công.', NULL, '2025-07-03 11:02:00'),

    -- Feedback 188: VIOLATED_CONTENT (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000188', 'f0000000-0000-0000-0000-000000000188', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-07-05 15:00:00'),
    ('20000000-0000-0000-0000-000000000188', 'f0000000-0000-0000-0000-000000000188', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm, chuyển duyệt thủ công.', NULL, '2025-07-05 15:02:00'),

    -- Feedback 189: AI_REVIEW_SUCCESS -> PENDING -> IN_PROGRESS
    ('10000000-0000-0000-0000-000000000189', 'f0000000-0000-0000-0000-000000000189', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-07-06 09:30:00'),
    ('20000000-0000-0000-0000-000000000189', 'f0000000-0000-0000-0000-000000000189', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-07-06 09:32:00'),
    ('30000000-0000-0000-0000-000000000189', 'f0000000-0000-0000-0000-000000000189', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-7-06 09:35:00'),
    ('40000000-0000-0000-0000-000000000189', 'f0000000-0000-0000-0000-000000000189', 'IN_PROGRESS', 'Góp ý đang được bộ phận Phòng Quản trị cơ sở vật chất xử lý.', NULL, '2025-07-06 11:30:00'),

    -- Feedback 190: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000190', 'f0000000-0000-0000-0000-000000000190', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-07-07 14:00:00'),
    ('20000000-0000-0000-0000-000000000190', 'f0000000-0000-0000-0000-000000000190', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-07-07 14:02:00'),
    ('30000000-0000-0000-0000-000000000190', 'f0000000-0000-0000-0000-000000000190', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-07-07 14:05:00'),
    ('40000000-0000-0000-0000-000000000190', 'f0000000-0000-0000-0000-000000000190', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Quản trị cơ sở vật chất giải quyết.', NULL, '2025-07-07 16:10:00'),

    -- Feedback 191: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000191', 'f0000000-0000-0000-0000-000000000191', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-07-09 10:00:00'),
    ('20000000-0000-0000-0000-000000000191', 'f0000000-0000-0000-0000-000000000191', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-07-09 10:02:00'),
    ('30000000-0000-0000-0000-000000000191', 'f0000000-0000-0000-0000-000000000191', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-07-09 10:05:00'),
    ('40000000-0000-0000-0000-000000000191', 'f0000000-0000-0000-0000-000000000191', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Quản trị cơ sở vật chất giải quyết.', NULL, '2025-07-09 12:15:00'),

    -- Feedback 192: AI_REVIEW_FAILED (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000192', 'f0000000-0000-0000-0000-000000000192', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-07-10 16:00:00'),
    ('20000000-0000-0000-0000-000000000192', 'f0000000-0000-0000-0000-000000000192', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, chuyển xử lý thủ công.', NULL, '2025-07-10 16:02:00'),

    -- Feedback 128: VIOLATED_CONTENT (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000128', 'f0000000-0000-0000-0000-000000000193', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-07-12 11:15:00'),
    ('20000000-0000-0000-0000-000000000128', 'f0000000-0000-0000-0000-000000000193', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm, chuyển duyệt thủ công.', NULL, '2025-07-12 11:17:00'),

    -- Feedback 129: AI_REVIEW_SUCCESS -> PENDING -> IN_PROGRESS
    ('10000000-0000-0000-0000-000000000129', 'f0000000-0000-0000-0000-000000000194', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-07-14 08:30:00'),
    ('20000000-0000-0000-0000-000000000129', 'f0000000-0000-0000-0000-000000000194', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-07-14 08:32:00'),
    ('30000000-0000-0000-0000-000000000129', 'f0000000-0000-0000-0000-000000000194', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-07-14 08:35:00'),
    ('40000000-0000-0000-0000-000000000129', 'f0000000-0000-0000-0000-000000000194', 'IN_PROGRESS', 'Góp ý đang được bộ phận chuyên trách xử lý.', NULL, '2025-07-14 10:50:00'),

    -- Feedback 130: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000130', 'f0000000-0000-0000-0000-000000000195', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-07-15 13:00:00'),
    ('20000000-0000-0000-0000-000000000130', 'f0000000-0000-0000-0000-000000000195', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-07-15 13:02:00'),
    ('30000000-0000-0000-0000-000000000130', 'f0000000-0000-0000-0000-000000000195', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-07-15 13:05:00'),
    ('40000000-0000-0000-0000-000000000130', 'f0000000-0000-0000-0000-000000000195', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Tuyển sinh và Cộng tác sinh viên giải quyết.', NULL, '2025-07-15 15:30:00'),

    -- Feedback 131: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000131', 'f0000000-0000-0000-0000-000000000196', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-07-16 09:00:00'),
    ('20000000-0000-0000-0000-000000000131', 'f0000000-0000-0000-0000-000000000196', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-07-16 09:02:00'),
    ('30000000-0000-0000-0000-000000000131', 'f0000000-0000-0000-0000-000000000196', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-07-16 09:05:00'),
    ('40000000-0000-0000-0000-000000000131', 'f0000000-0000-0000-0000-000000000196', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Tuyển sinh và Cộng tác sinh viên giải quyết.', NULL, '2025-07-16 11:20:00'),

    -- Feedback 132: AI_REVIEW_FAILED (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000132', 'f0000000-0000-0000-0000-000000000197', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-07-18 14:00:00'),
    ('20000000-0000-0000-0000-000000000132', 'f0000000-0000-0000-0000-000000000197', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, chuyển xử lý thủ công.', NULL, '2025-07-18 14:02:00'),

    -- Feedback 133: VIOLATED_CONTENT (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000133', 'f0000000-0000-0000-0000-000000000198', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-07-20 10:10:00'),
    ('20000000-0000-0000-0000-000000000133', 'f0000000-0000-0000-0000-000000000198', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm, chuyển duyệt thủ công.', NULL, '2025-07-20 10:12:00'),

    -- Feedback 134: AI_REVIEW_SUCCESS -> PENDING -> IN_PROGRESS
    ('10000000-0000-0000-0000-000000000134', 'f0000000-0000-0000-0000-000000000199', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-07-22 08:30:00'),
    ('20000000-0000-0000-0000-000000000134', 'f0000000-0000-0000-0000-000000000199', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-07-22 08:32:00'),
    ('30000000-0000-0000-0000-000000000134', 'f0000000-0000-0000-0000-000000000199', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-07-22 08:35:00'),
    ('40000000-0000-0000-0000-000000000134', 'f0000000-0000-0000-0000-000000000199', 'IN_PROGRESS', 'Góp ý đang được bộ phận chuyên trách xử lý.', NULL, '2025-07-22 13:40:00'),

    -- Feedback 135: AI_REVIEW_SUCCESS -> PENDING -> REJECTED
    ('10000000-0000-0000-0000-000000000135', 'f0000000-0000-0000-0000-000000000401', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-07-24 21:00:00'),
    ('20000000-0000-0000-0000-000000000135', 'f0000000-0000-0000-0000-000000000401', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-07-24 21:02:00'),
    ('30000000-0000-0000-0000-000000000135', 'f0000000-0000-0000-0000-000000000401', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-07-24 21:05:00'),
    ('40000000-0000-0000-0000-000000000135', 'f0000000-0000-0000-0000-000000000401', 'REJECTED', 'Góp ý đã bị bộ phận Phòng Tuyển sinh và Cộng tác sinh viên từ chối.', NULL, '2025-07-24 22:45:00'),

    -- Feedback 136: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000136', 'f0000000-0000-0000-0000-000000000402', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-07-26 11:00:00'),
    ('20000000-0000-0000-0000-000000000136', 'f0000000-0000-0000-0000-000000000402', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-07-26 11:02:00'),
    ('30000000-0000-0000-0000-000000000136', 'f0000000-0000-0000-0000-000000000402', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-07-26 11:05:00'),
    ('40000000-0000-0000-0000-000000000136', 'f0000000-0000-0000-0000-000000000402', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Tuyển sinh và Cộng tác sinh viên giải quyết.', NULL, '2025-07-26 14:15:00'),

    -- Feedback 137: VIOLATED_CONTENT (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000137', 'f0000000-0000-0000-0000-000000000403', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-07-28 15:30:00'),
    ('20000000-0000-0000-0000-000000000137', 'f0000000-0000-0000-0000-000000000403', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm, chuyển duyệt thủ công.', NULL, '2025-07-28 15:32:00'),

    -- Feedback 138: AI_REVIEW_FAILED (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000138', 'f0000000-0000-0000-0000-000000000404', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-07-30 09:00:00'),
    ('20000000-0000-0000-0000-000000000138', 'f0000000-0000-0000-0000-000000000404', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, chuyển xử lý thủ công.', NULL, '2025-07-30 09:02:00'),

    -- Feedback 139: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000139', 'f0000000-0000-0000-0000-000000000405', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-07-31 13:00:00'),
    ('20000000-0000-0000-0000-000000000139', 'f0000000-0000-0000-0000-000000000405', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-07-31 13:02:00'),
    ('30000000-0000-0000-0000-000000000139', 'f0000000-0000-0000-0000-000000000405', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-07-31 13:05:00'),
    ('40000000-0000-0000-0000-000000000139', 'f0000000-0000-0000-0000-000000000405', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Tuyển sinh và Cộng tác sinh viên giải quyết.', NULL, '2025-07-31 15:20:00'),

    -- Feedback 140: AI_REVIEW_SUCCESS -> PENDING -> REJECTED
    ('10000000-0000-0000-0000-000000000140', 'f0000000-0000-0000-0000-000000000406', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-08-01 19:00:00'),
    ('20000000-0000-0000-0000-000000000140', 'f0000000-0000-0000-0000-000000000406', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-08-01 19:02:00'),
    ('30000000-0000-0000-0000-000000000140', 'f0000000-0000-0000-0000-000000000406', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-08-01 19:05:00'),
    ('40000000-0000-0000-0000-000000000140', 'f0000000-0000-0000-0000-000000000406', 'REJECTED', 'Góp ý đã bị bộ phận Phòng Tuyển sinh và Cộng tác sinh viên từ chối.', NULL, '2025-08-01 20:40:00'),

    -- Feedback 141: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000141', 'f0000000-0000-0000-0000-000000000407', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-08-03 08:30:00'),
    ('20000000-0000-0000-0000-000000000141', 'f0000000-0000-0000-0000-000000000407', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-08-03 08:32:00'),
    ('30000000-0000-0000-0000-000000000141', 'f0000000-0000-0000-0000-000000000407', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-08-03 08:35:00'),
    ('40000000-0000-0000-0000-000000000141', 'f0000000-0000-0000-0000-000000000407', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Tuyển sinh và Cộng tác sinh viên giải quyết.', NULL, '2025-08-03 11:00:00'),

    -- Feedback 142: AI_REVIEW_FAILED (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000142', 'f0000000-0000-0000-0000-000000000408', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-08-05 11:00:00'),
    ('20000000-0000-0000-0000-000000000142', 'f0000000-0000-0000-0000-000000000408', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, chuyển xử lý thủ công.', NULL, '2025-08-05 11:02:00'),

    -- Feedback 143: VIOLATED_CONTENT (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000143', 'f0000000-0000-0000-0000-000000000409', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-08-06 15:00:00'),
    ('20000000-0000-0000-0000-000000000143', 'f0000000-0000-0000-0000-000000000409', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm, chuyển duyệt thủ công.', NULL, '2025-08-06 15:02:00'),

    -- Feedback 144: AI_REVIEW_SUCCESS -> PENDING -> IN_PROGRESS
    ('10000000-0000-0000-0000-000000000144', 'f0000000-0000-0000-0000-000000000410', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-08-08 09:30:00'),
    ('20000000-0000-0000-0000-000000000144', 'f0000000-0000-0000-0000-000000000410', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-08-08 09:32:00'),
    ('30000000-0000-0000-0000-000000000144', 'f0000000-0000-0000-0000-000000000410', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-08-08 09:35:00'),
    ('40000000-0000-0000-0000-000000000144', 'f0000000-0000-0000-0000-000000000410', 'IN_PROGRESS', 'Góp ý đang được bộ phận chuyên trách xử lý.', NULL, '2025-08-08 11:50:00'),

    -- Feedback 145: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000145', 'f0000000-0000-0000-0000-000000000411', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-08-10 14:00:00'),
    ('20000000-0000-0000-0000-000000000145', 'f0000000-0000-0000-0000-000000000411', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-08-10 14:02:00'),
    ('30000000-0000-0000-0000-000000000145', 'f0000000-0000-0000-0000-000000000411', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-08-10 14:05:00'),
    ('40000000-0000-0000-0000-000000000145', 'f0000000-0000-0000-0000-000000000411', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Tuyển sinh và Cộng tác sinh viên giải quyết.', NULL, '2025-08-10 16:30:00'),

    -- Feedback 146: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000146', 'f0000000-0000-0000-0000-000000000412', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-08-12 10:00:00'),
    ('20000000-0000-0000-0000-000000000146', 'f0000000-0000-0000-0000-000000000412', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-08-12 10:02:00'),
    ('30000000-0000-0000-0000-000000000146', 'f0000000-0000-0000-0000-000000000412', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-08-12 10:05:00'),
    ('40000000-0000-0000-0000-000000000146', 'f0000000-0000-0000-0000-000000000412', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Tuyển sinh và Cộng tác sinh viên giải quyết.', NULL, '2025-08-12 12:45:00'),

    -- Feedback 147: AI_REVIEW_FAILED (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000147', 'f0000000-0000-0000-0000-000000000413', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-08-15 16:00:00'),
    ('20000000-0000-0000-0000-000000000147', 'f0000000-0000-0000-0000-000000000413', 'AI_REVIEW_FAILED', 'Hệ thống AI gặp sự cố kiểm định, chuyển xử lý thủ công.', NULL, '2025-08-15 16:02:00'),

    -- Feedback 148: VIOLATED_CONTENT (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000148', 'f0000000-0000-0000-0000-000000000414', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-08-17 11:15:00'),
    ('20000000-0000-0000-0000-000000000148', 'f0000000-0000-0000-0000-000000000414', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm, chuyển duyệt thủ công.', NULL, '2025-08-17 11:17:00'),

    -- Feedback 149: AI_REVIEW_SUCCESS -> PENDING -> IN_PROGRESS
    ('10000000-0000-0000-0000-000000000149', 'f0000000-0000-0000-0000-000000000415', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-08-19 08:30:00'),
    ('20000000-0000-0000-0000-000000000149', 'f0000000-0000-0000-0000-000000000415', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-08-19 08:32:00'),
    ('30000000-0000-0000-0000-000000000149', 'f0000000-0000-0000-0000-000000000415', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-08-19 08:35:00'),
    ('40000000-0000-0000-0000-000000000149', 'f0000000-0000-0000-0000-000000000415', 'IN_PROGRESS', 'Góp ý đang được bộ phận chuyên trách xử lý.', NULL, '2025-08-19 10:45:00'),

    -- Feedback 150: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000150', 'f0000000-0000-0000-0000-000000000416', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-08-20 13:00:00'),
    ('20000000-0000-0000-0000-000000000150', 'f0000000-0000-0000-0000-000000000416', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-08-20 13:02:00'),
    ('30000000-0000-0000-0000-000000000150', 'f0000000-0000-0000-0000-000000000416', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-08-20 13:05:00'),
    ('40000000-0000-0000-0000-000000000150', 'f0000000-0000-0000-0000-000000000416', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Tuyển sinh và Cộng tác sinh viên giải quyết.', NULL, '2025-08-20 15:40:00'),

    -- ==================== TẠO THÊM 5 FEEDBACK MỚI (151 - 155) ====================

    -- Feedback 151: AI_REVIEW_SUCCESS -> PENDING -> RESOLVED
    ('10000000-0000-0000-0000-000000000151', 'f0000000-0000-0000-0000-000000000417', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-08-22 09:00:00'),
    ('20000000-0000-0000-0000-000000000151', 'f0000000-0000-0000-0000-000000000417', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-08-22 09:02:00'),
    ('30000000-0000-0000-0000-000000000151', 'f0000000-0000-0000-0000-000000000417', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-08-22 09:05:00'),
    ('40000000-0000-0000-0000-000000000151', 'f0000000-0000-0000-0000-000000000417', 'RESOLVED', 'Góp ý đã được bộ phận Phòng Tuyển sinh và Cộng tác sinh viên giải quyết.', NULL, '2025-08-22 11:15:00'),

    -- Feedback 152: VIOLATED_CONTENT (Dừng luồng tự động)
    ('10000000-0000-0000-0000-000000000152', 'f0000000-0000-0000-0000-000000000418', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-08-23 14:20:00'),
    ('20000000-0000-0000-0000-000000000152', 'f0000000-0000-0000-0000-000000000418', 'VIOLATED_CONTENT', 'AI phát hiện từ ngữ nhạy cảm, chuyển duyệt thủ công.', NULL, '2025-08-23 14:22:00'),

    -- Feedback 153: AI_REVIEW_SUCCESS -> PENDING -> IN_PROGRESS
    ('10000000-0000-0000-0000-000000000153', 'f0000000-0000-0000-0000-000000000419', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-08-25 08:00:00'),
    ('20000000-0000-0000-0000-000000000153', 'f0000000-0000-0000-0000-000000000419', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-08-25 08:02:00'),
    ('30000000-0000-0000-0000-000000000153', 'f0000000-0000-0000-0000-000000000419', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-08-25 08:05:00'),
    ('40000000-0000-0000-0000-000000000153', 'f0000000-0000-0000-0000-000000000419', 'IN_PROGRESS', 'Góp ý đang được bộ phận chuyên trách xử lý.', NULL, '2025-08-25 10:30:00'),

    -- Feedback 154: AI_REVIEW_SUCCESS -> PENDING -> REJECTED
    ('10000000-0000-0000-0000-000000000154', 'f0000000-0000-0000-0000-000000000420', 'AI_REVIEWING', 'Hệ thống đang tự động kiểm tra nội dung góp ý.', NULL, '2025-08-26 16:00:00'),
    ('20000000-0000-0000-0000-000000000154', 'f0000000-0000-0000-0000-000000000420', 'AI_REVIEW_SUCCESS', 'Hệ thống AI đánh giá nội dung hợp lệ.', NULL, '2025-8-26 16:02:00'),
    ('30000000-0000-0000-0000-000000000154', 'f0000000-0000-0000-0000-000000000420', 'PENDING', 'Góp ý đang chờ tiếp nhận và xử lý.', NULL, '2025-08-26 16:05:00'),
    ('40000000-0000-0000-0000-000000000154', 'f0000000-0000-0000-0000-000000000420', 'REJECTED', 'Góp ý đã bị bộ phận Phòng Tuyển sinh và Cộng tác sinh viên từ chối.', NULL, '2025-08-26 17:50:00'),

    (
        '10000000-0000-0000-0000-000000000101',
        'f0000000-0000-0000-0000-000000000302',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-06-05 18:25:00'
    ),
    (
        '10000000-0000-0000-0000-000000000102',
        'f0000000-0000-0000-0000-000000000303',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-06-07 23:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000103',
        'f0000000-0000-0000-0000-000000000304',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-06-08 19:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000104',
        'f0000000-0000-0000-0000-000000000305',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-06-10 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000105',
        'f0000000-0000-0000-0000-000000000306',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-06-12 17:15:00'
    ),
    (
        '10000000-0000-0000-0000-000000000106',
        'f0000000-0000-0000-0000-000000000307',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-06-14 21:50:00'
    ),
    (
        '10000000-0000-0000-0000-000000000107',
        'f0000000-0000-0000-0000-000000000308',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-06-15 18:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000108',
        'f0000000-0000-0000-0000-000000000309',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-06-17 23:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000109',
        'f0000000-0000-0000-0000-000000000310',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-06-18 19:45:00'
    ),
    (
        '10000000-0000-0000-0000-000000000110',
        'f0000000-0000-0000-0000-000000000311',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-06-19 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000111',
        'f0000000-0000-0000-0000-000000000312',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-06-20 17:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000112',
        'f0000000-0000-0000-0000-000000000313',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-06-21 21:25:00'
    ),
    (
        '10000000-0000-0000-0000-000000000113',
        'f0000000-0000-0000-0000-000000000314',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-06-22 18:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000114',
        'f0000000-0000-0000-0000-000000000315',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-06-24 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000115',
        'f0000000-0000-0000-0000-000000000316',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-06-25 19:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000116',
        'f0000000-0000-0000-0000-000000000317',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-06-26 23:45:00'
    ),
    (
        '10000000-0000-0000-0000-000000000117',
        'f0000000-0000-0000-0000-000000000318',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-06-27 17:55:00'
    ),
    (
        '10000000-0000-0000-0000-000000000118',
        'f0000000-0000-0000-0000-000000000319',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-07-01 17:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000119',
        'f0000000-0000-0000-0000-000000000320',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-07-03 21:50:00'
    ),
    (
        '10000000-0000-0000-0000-000000000120',
        'f0000000-0000-0000-0000-000000000321',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-07-05 18:15:00'
    ),
    (
        '10000000-0000-0000-0000-000000000121',
        'f0000000-0000-0000-0000-000000000322',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-07-07 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000122',
        'f0000000-0000-0000-0000-000000000323',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-07-08 19:25:00'
    ),
    (
        '10000000-0000-0000-0000-000000000123',
        'f0000000-0000-0000-0000-000000000324',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-07-10 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000124',
        'f0000000-0000-0000-0000-000000000325',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-07-12 17:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000125',
        'f0000000-0000-0000-0000-000000000326',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-07-14 22:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000126',
        'f0000000-0000-0000-0000-000000000327',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-07-15 18:55:00'
    ),
    (
        '10000000-0000-0000-0000-000000000127',
        'f0000000-0000-0000-0000-000000000328',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-07-17 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000155',
        'f0000000-0000-0000-0000-000000000356',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-08-27 17:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000156',
        'f0000000-0000-0000-0000-000000000357',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-09-01 17:25:00'
    ),
    (
        '10000000-0000-0000-0000-000000000157',
        'f0000000-0000-0000-0000-000000000358',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-09-03 21:55:00'
    ),
    (
        '10000000-0000-0000-0000-000000000158',
        'f0000000-0000-0000-0000-000000000359',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-09-05 18:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000159',
        'f0000000-0000-0000-0000-000000000360',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-09-07 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000160',
        'f0000000-0000-0000-0000-000000000361',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-09-08 19:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000161',
        'f0000000-0000-0000-0000-000000000362',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-09-10 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000162',
        'f0000000-0000-0000-0000-000000000363',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-09-12 17:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000163',
        'f0000000-0000-0000-0000-000000000364',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-09-14 21:45:00'
    ),
    (
        '10000000-0000-0000-0000-000000000164',
        'f0000000-0000-0000-0000-000000000365',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-09-15 18:55:00'
    ),
    (
        '10000000-0000-0000-0000-000000000165',
        'f0000000-0000-0000-0000-000000000366',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-09-17 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000193',
        'f0000000-0000-0000-0000-000000000394',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-10-27 17:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000194',
        'f0000000-0000-0000-0000-000000000395',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-10-28 22:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000195',
        'f0000000-0000-0000-0000-000000000396',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-10-29 18:45:00'
    ),
    (
        '10000000-0000-0000-0000-000000000196',
        'f0000000-0000-0000-0000-000000000397',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-10-30 22:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000197',
        'f0000000-0000-0000-0000-000000000398',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-10-31 19:55:00'
    ),
    (
        '10000000-0000-0000-0000-000000000198',
        'f0000000-0000-0000-0000-000000000399',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-10-31 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000199',
        'f0000000-0000-0000-0000-000000000400',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-10-31 16:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000200',
        'f0000000-0000-0000-0000-000000000261',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-03-30 21:10:00'
    );
-- 37 feedbacks for Department d...010 (Phòng Thanh tra giáo dục)
INSERT INTO
    "FeedbackStatusHistory" (
        "id",
        "feedbackId",
        "status",
        "message",
        "note",
        "createdAt"
    )
VALUES
    -- Tháng 11/2025: chỉ 1 status RESOLVED/REJECTED
    -- (
    --     '10000000-0000-0000-0000-000000000201',
    --     'f0000000-0000-0000-0000-000000000001',
    --     'RESOLVED',
    --     'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
    --     NULL,
    --     '2025-11-01 15:40:00'
    -- ),
    (
        '10000000-0000-0000-0000-000000000202',
        'f0000000-0000-0000-0000-000000000002',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-11-01 22:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000204',
        'f0000000-0000-0000-0000-000000000004',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-11-03 14:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000206',
        'f0000000-0000-0000-0000-000000000006',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-11-03 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000208',
        'f0000000-0000-0000-0000-000000000008',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-11-04 20:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000210',
        'f0000000-0000-0000-0000-000000000010',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-11-05 22:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000212',
        'f0000000-0000-0000-0000-000000000012',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-11-06 15:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000214',
        'f0000000-0000-0000-0000-000000000014',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-11-08 21:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000216',
        'f0000000-0000-0000-0000-000000000016',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-11-10 21:50:00'
    ),
    (
        '10000000-0000-0000-0000-000000000218',
        'f0000000-0000-0000-0000-000000000018',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-11-11 17:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000220',
        'f0000000-0000-0000-0000-000000000020',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-11-13 15:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000222',
        'f0000000-0000-0000-0000-000000000022',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-11-14 22:45:00'
    ),
    (
        '10000000-0000-0000-0000-000000000224',
        'f0000000-0000-0000-0000-000000000024',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-11-15 21:55:00'
    ),
    (
        '10000000-0000-0000-0000-000000000226',
        'f0000000-0000-0000-0000-000000000026',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-11-16 18:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000228',
        'f0000000-0000-0000-0000-000000000028',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-11-18 15:50:00'
    ),
    (
        '10000000-0000-0000-0000-000000000230',
        'f0000000-0000-0000-0000-000000000030',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-11-20 23:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000232',
        'f0000000-0000-0000-0000-000000000032',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết',
        NULL,
        '2025-11-30 13:30:00'
    ),

-- Tháng 12/2025: tạo đầy đủ 3 trạng thái (hoặc ít hơn nếu chưa xong)
-- f...034 - RESOLVED
(
    '10000000-0000-0000-0000-000000000234',
    'f0000000-0000-0000-0000-000000000034',
    'PENDING',
    'Cảm ơn bạn đã gửi phản góp ý đến bộ phận Phòng Thanh tra giáo dục. Chúng tôi sẽ cố gắng xử lý góp ý của bạn trong thời gian sớm nhất.',
    NULL,
    '2025-12-01 10:00:00'
),
(
    '10000000-0000-0000-0000-000000000235',
    'f0000000-0000-0000-0000-000000000034',
    'IN_PROGRESS',
    'Góp ý đang được bộ phận Phòng Thanh tra giáo dục xử lý.',
    NULL,
    '2025-12-01 10:15:00'
),
(
    '10000000-0000-0000-0000-000000000236',
    'f0000000-0000-0000-0000-000000000034',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
    NULL,
    '2025-12-01 18:30:00'
),


-- f...036 - IN_PROGRESS (hiện tại vẫn đang xử lý)
(
    '10000000-0000-0000-0000-000000000240',
    'f0000000-0000-0000-0000-000000000036',
    'PENDING',
    'Cảm ơn bạn đã gửi phản góp ý đến bộ phận Phòng Thanh tra giáo dục. Chúng tôi sẽ cố gắng xử lý góp ý của bạn trong thời gian sớm nhất.',
    NULL,
    '2025-12-03 09:30:00'
),
(
    '10000000-0000-0000-0000-000000000241',
    'f0000000-0000-0000-0000-000000000036',
    'IN_PROGRESS',
    'Góp ý đang được bộ phận Phòng Thanh tra giáo dục xử lý.',
    NULL,
    '2025-12-05 11:00:00'
);
-- chưa có RESOLVED vì currentStatus = IN_PROGRESS


INSERT INTO
    "FeedbackStatusHistory" (
        "id",
        "feedbackId",
        "status",
        "message",
        "note",
        "createdAt"
    )
VALUES
    -- Phòng Quan hệ doanh nghiệp (d...002) – xử lý 20-23 tiếng
    (
        '10000000-0000-0000-0000-000000000243',
        'f0000000-0000-0000-0000-000000000038',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.',
        NULL,
        '2025-11-03 08:25:00'
    ),
    (
        '10000000-0000-0000-0000-000000000245',
        'f0000000-0000-0000-0000-000000000040',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Quan hệ doanh nghiệp từ chối.',
        NULL,
        '2025-11-05 09:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000246',
        'f0000000-0000-0000-0000-000000000041',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.',
        NULL,
        '2025-11-06 07:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000248',
        'f0000000-0000-0000-0000-000000000043',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Quan hệ doanh nghiệp từ chối.',
        NULL,
        '2025-11-08 14:35:00'
    ),
    (
        '10000000-0000-0000-0000-000000000249',
        'f0000000-0000-0000-0000-000000000044',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.',
        NULL,
        '2025-11-09 08:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000251',
        'f0000000-0000-0000-0000-000000000046',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.',
        NULL,
        '2025-11-11 09:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000252',
        'f0000000-0000-0000-0000-000000000047',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Quan hệ doanh nghiệp từ chối.',
        NULL,
        '2025-11-12 13:50:00'
    ),
    (
        '10000000-0000-0000-0000-000000000254',
        'f0000000-0000-0000-0000-000000000049',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.',
        NULL,
        '2025-11-14 12:55:00'
    ),
    (
        '10000000-0000-0000-0000-000000000256',
        'f0000000-0000-0000-0000-000000000051',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Quan hệ doanh nghiệp từ chối.',
        NULL,
        '2025-11-16 14:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000257',
        'f0000000-0000-0000-0000-000000000052',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.',
        NULL,
        '2025-11-17 09:25:00'
    ),
    (
        '10000000-0000-0000-0000-000000000259',
        'f0000000-0000-0000-0000-000000000054',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.',
        NULL,
        '2025-11-19 07:50:00'
    ),
    (
        '10000000-0000-0000-0000-000000000261',
        'f0000000-0000-0000-0000-000000000057',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.',
        NULL,
        '2025-11-22 12:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000263',
        'f0000000-0000-0000-0000-000000000059',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.',
        NULL,
        '2025-11-24 14:15:00'
    ),
    (
        '10000000-0000-0000-0000-000000000264',
        'f0000000-0000-0000-0000-000000000060',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.',
        NULL,
        '2025-11-25 07:35:00'
    ),
    (
        '10000000-0000-0000-0000-000000000265',
        'f0000000-0000-0000-0000-000000000062',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.',
        NULL,
        '2025-11-27 08:50:00'
    ),
    (
        '10000000-0000-0000-0000-000000000267',
        'f0000000-0000-0000-0000-000000000064',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.',
        NULL,
        '2025-11-29 09:10:00'
    ),

-- Phòng Khoa học & Công nghệ (d...003) – xử lý 20-23 tiếng
(
    '10000000-0000-0000-0000-000000000268',
    'f0000000-0000-0000-0000-000000000071',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.',
    NULL,
    '2025-11-02 09:25:00'
),
(
    '10000000-0000-0000-0000-000000000270',
    'f0000000-0000-0000-0000-000000000073',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.',
    NULL,
    '2025-11-04 07:50:00'
),
(
    '10000000-0000-0000-0000-000000000271',
    'f0000000-0000-0000-0000-000000000074',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.',
    NULL,
    '2025-11-05 14:40:00'
),
(
    '10000000-0000-0000-0000-000000000273',
    'f0000000-0000-0000-0000-000000000076',
    'REJECTED',
    'Góp ý đã bị bộ phận Phòng Khoa học & Công nghệ từ chối.',
    NULL,
    '2025-11-07 11:55:00'
),
(
    '10000000-0000-0000-0000-000000000274',
    'f0000000-0000-0000-0000-000000000077',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.',
    NULL,
    '2025-11-08 13:10:00'
), 
(
    '10000000-0000-0000-0000-000000000276',
    'f0000000-0000-0000-0000-000000000079',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.',
    NULL,
    '2025-11-10 12:45:00'
),
(
    '10000000-0000-0000-0000-000000000277',
    'f0000000-0000-0000-0000-000000000080',
    'REJECTED',
    'Góp ý đã bị bộ phận Phòng Khoa học & Công nghệ từ chối.',
    NULL,
    '2025-11-11 14:20:00'
),
(
    '10000000-0000-0000-0000-000000000279',
    'f0000000-0000-0000-0000-000000000082',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.',
    NULL,
    '2025-11-13 11:25:00'
),
(
    '10000000-0000-0000-0000-000000000280',
    'f0000000-0000-0000-0000-000000000083',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.',
    NULL,
    '2025-11-14 08:55:00'
),
(
    '10000000-0000-0000-0000-000000000282',
    'f0000000-0000-0000-0000-000000000085',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.',
    NULL,
    '2025-11-16 09:10:00'
),
(
    '10000000-0000-0000-0000-000000000283',
    'f0000000-0000-0000-0000-000000000086',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.',
    NULL,
    '2025-11-17 12:30:00'
),
(
    '10000000-0000-0000-0000-000000000285',
    'f0000000-0000-0000-0000-000000000089',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.',
    NULL,
    '2025-11-20 08:40:00'
),
(
    '10000000-0000-0000-0000-000000000287',
    'f0000000-0000-0000-0000-000000000091',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.',
    NULL,
    '2025-11-22 13:50:00'
),
(
    '10000000-0000-0000-0000-000000000288',
    'f0000000-0000-0000-0000-000000000092',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.',
    NULL,
    '2025-11-23 09:25:00'
),
(
    '10000000-0000-0000-0000-000000000290',
    'f0000000-0000-0000-0000-000000000094',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.',
    NULL,
    '2025-11-26 07:30:00'
);

INSERT INTO
    "FeedbackStatusHistory" (
        "id",
        "feedbackId",
        "status",
        "message",
        "note",
        "createdAt"
    )
VALUES
    -- Phòng Quan hệ quốc tế (d...004) – 24-72h
    (
        '10000000-0000-0000-0000-000000000291',
        'f0000000-0000-0000-0000-000000000101',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ quốc tế giải quyết.',
        NULL,
        '2025-11-06 14:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000292',
        'f0000000-0000-0000-0000-000000000102',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Quan hệ quốc tế từ chối.',
        NULL,
        '2025-11-10 09:45:00'
    ),
    (
        '10000000-0000-0000-0000-000000000293',
        'f0000000-0000-0000-0000-000000000103',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ quốc tế giải quyết.',
        NULL,
        '2025-11-13 16:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000294',
        'f0000000-0000-0000-0000-000000000104',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ quốc tế giải quyết.',
        NULL,
        '2025-11-16 11:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000295',
        'f0000000-0000-0000-0000-000000000105',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ quốc tế giải quyết.',
        NULL,
        '2025-11-19 15:50:00'
    ),
    (
        '10000000-0000-0000-0000-000000000296',
        'f0000000-0000-0000-0000-000000000106',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ quốc tế giải quyết.',
        NULL,
        '2025-11-22 10:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000297',
        'f0000000-0000-0000-0000-000000000107',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Quan hệ quốc tế từ chối.',
        NULL,
        '2025-11-25 13:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000298',
        'f0000000-0000-0000-0000-000000000108',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ quốc tế giải quyết.',
        NULL,
        '2025-11-28 14:15:00'
    ),

-- Phòng Thiết bị – Vật tư (d...005) – 24-72h
(
    '10000000-0000-0000-0000-000000000299',
    'f0000000-0000-0000-0000-000000000112',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Thiết bị – Vật tư giải quyết.',
    NULL,
    '2025-11-05 15:40:00'
),
(
    '10000000-0000-0000-0000-000000000300',
    'f0000000-0000-0000-0000-000000000113',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Thiết bị – Vật tư giải quyết.',
    NULL,
    '2025-11-09 10:20:00'
),
(
    '10000000-0000-0000-0000-000000000301',
    'f0000000-0000-0000-0000-000000000114',
    'REJECTED',
    'Góp ý đã bị bộ phận Phòng Thiết bị – Vật tư từ chối.',
    NULL,
    '2025-11-12 16:50:00'
),
(
    '10000000-0000-0000-0000-000000000302',
    'f0000000-0000-0000-0000-000000000115',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Thiết bị – Vật tư giải quyết.',
    NULL,
    '2025-11-15 12:30:00'
),
(
    '10000000-0000-0000-0000-000000000303',
    'f0000000-0000-0000-0000-000000000116',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Thiết bị – Vật tư giải quyết.',
    NULL,
    '2025-11-18 14:10:00'
),
(
    '10000000-0000-0000-0000-000000000304',
    'f0000000-0000-0000-0000-000000000117',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Thiết bị – Vật tư giải quyết.',
    NULL,
    '2025-11-21 11:45:00'
),
(
    '10000000-0000-0000-0000-000000000305',
    'f0000000-0000-0000-0000-000000000118',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Thiết bị – Vật tư giải quyết.',
    NULL,
    '2025-11-24 16:20:00'
),
(
    '10000000-0000-0000-0000-000000000306',
    'f0000000-0000-0000-0000-000000000119',
    'REJECTED',
    'Góp ý đã bị bộ phận Phòng Thiết bị – Vật tư từ chối.',
    NULL,
    '2025-11-27 09:30:00'
),
(
    '10000000-0000-0000-0000-000000000307',
    'f0000000-0000-0000-0000-000000000120',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Thiết bị – Vật tư giải quyết.',
    NULL,
    '2025-11-30 13:50:00'
),

-- Phòng Quản trị chiến lược (d...006) – 24-72h
(
    '10000000-0000-0000-0000-000000000308',
    'f0000000-0000-0000-0000-000000000124',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Quản trị chiến lược giải quyết.',
    NULL,
    '2025-11-07 14:40:00'
),
(
    '10000000-0000-0000-0000-000000000309',
    'f0000000-0000-0000-0000-000000000125',
    'REJECTED',
    'Góp ý đã bị bộ phận Phòng Quản trị chiến lược từ chối.',
    NULL,
    '2025-11-11 10:15:00'
),
(
    '10000000-0000-0000-0000-000000000310',
    'f0000000-0000-0000-0000-000000000126',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Quản trị chiến lược giải quyết.',
    NULL,
    '2025-11-14 16:30:00'
),
(
    '10000000-0000-0000-0000-000000000311',
    'f0000000-0000-0000-0000-000000000127',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Quản trị chiến lược giải quyết.',
    NULL,
    '2025-11-17 12:20:00'
),
(
    '10000000-0000-0000-0000-000000000312',
    'f0000000-0000-0000-0000-000000000128',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Quản trị chiến lược giải quyết.',
    NULL,
    '2025-11-20 15:45:00'
),
(
    '10000000-0000-0000-0000-000000000313',
    'f0000000-0000-0000-0000-000000000129',
    'REJECTED',
    'Góp ý đã bị bộ phận Phòng Quản trị chiến lược từ chối.',
    NULL,
    '2025-11-23 14:10:00'
),
(
    '10000000-0000-0000-0000-000000000314',
    'f0000000-0000-0000-0000-000000000130',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Quản trị chiến lược giải quyết.',
    NULL,
    '2025-11-26 11:30:00'
),
(
    '10000000-0000-0000-0000-000000000315',
    'f0000000-0000-0000-0000-000000000131',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Quản trị chiến lược giải quyết.',
    NULL,
    '2025-11-29 13:50:00'
),
(
    '10000000-0000-0000-0000-000000000316',
    'f0000000-0000-0000-0000-000000000132',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Quản trị chiến lược giải quyết.',
    NULL,
    '2025-12-02 15:20:00'
),

-- Phòng Đảm bảo chất lượng (d...007) – 24-72h
(
    '10000000-0000-0000-0000-000000000317',
    'f0000000-0000-0000-0000-000000000137',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Đảm bảo chất lượng giải quyết.',
    NULL,
    '2025-11-08 15:40:00'
),
(
    '10000000-0000-0000-0000-000000000318',
    'f0000000-0000-0000-0000-000000000138',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Đảm bảo chất lượng giải quyết.',
    NULL,
    '2025-11-12 10:20:00'
),
(
    '10000000-0000-0000-0000-000000000319',
    'f0000000-0000-0000-0000-000000000139',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Đảm bảo chất lượng giải quyết.',
    NULL,
    '2025-11-15 14:50:00'
),
(
    '10000000-0000-0000-0000-000000000320',
    'f0000000-0000-0000-0000-000000000140',
    'REJECTED',
    'Góp ý đã bị bộ phận Phòng Đảm bảo chất lượng từ chối.',
    NULL,
    '2025-11-18 09:30:00'
),
(
    '10000000-0000-0000-0000-000000000321',
    'f0000000-0000-0000-0000-000000000141',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Đảm bảo chất lượng giải quyết.',
    NULL,
    '2025-11-21 16:10:00'
),
(
    '10000000-0000-0000-0000-000000000322',
    'f0000000-0000-0000-0000-000000000142',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Đảm bảo chất lượng giải quyết.',
    NULL,
    '2025-11-24 12:45:00'
),
(
    '10000000-0000-0000-0000-000000000323',
    'f0000000-0000-0000-0000-000000000143',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Đảm bảo chất lượng giải quyết.',
    NULL,
    '2025-11-27 14:20:00'
),
(
    '10000000-0000-0000-0000-000000000324',
    'f0000000-0000-0000-0000-000000000144',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Đảm bảo chất lượng giải quyết.',
    NULL,
    '2025-11-30 11:50:00'
),
(
    '10000000-0000-0000-0000-000000000325',
    'f0000000-0000-0000-0000-000000000145',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Đảm bảo chất lượng giải quyết.',
    NULL,
    '2025-12-03 15:30:00'
),

-- Phòng Tổ chức Hành chính (d...008) – 24-72h
(
    '10000000-0000-0000-0000-000000000326',
    'f0000000-0000-0000-0000-000000000151',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Tổ chức Hành chính giải quyết.',
    NULL,
    '2025-11-07 14:50:00'
),
(
    '10000000-0000-0000-0000-000000000327',
    'f0000000-0000-0000-0000-000000000152',
    'REJECTED',
    'Góp ý đã bị bộ phận Phòng Tổ chức Hành chính từ chối.',
    NULL,
    '2025-11-11 10:15:00'
),
(
    '10000000-0000-0000-0000-000000000328',
    'f0000000-0000-0000-0000-000000000153',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Tổ chức Hành chính giải quyết.',
    NULL,
    '2025-11-14 16:30:00'
),
(
    '10000000-0000-0000-0000-000000000329',
    'f0000000-0000-0000-0000-000000000154',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Tổ chức Hành chính giải quyết.',
    NULL,
    '2025-11-17 13:40:00'
),
(
    '10000000-0000-0000-0000-000000000330',
    'f0000000-0000-0000-0000-000000000155',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Tổ chức Hành chính giải quyết.',
    NULL,
    '2025-11-20 11:20:00'
),
(
    '10000000-0000-0000-0000-000000000331',
    'f0000000-0000-0000-0000-000000000156',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Tổ chức Hành chính giải quyết.',
    NULL,
    '2025-11-23 15:10:00'
),
(
    '10000000-0000-0000-0000-000000000332',
    'f0000000-0000-0000-0000-000000000157',
    'REJECTED',
    'Góp ý đã bị bộ phận Phòng Tổ chức Hành chính từ chối.',
    NULL,
    '2025-11-26 12:45:00'
),
(
    '10000000-0000-0000-0000-000000000333',
    'f0000000-0000-0000-0000-000000000158',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Tổ chức Hành chính giải quyết.',
    NULL,
    '2025-11-29 14:30:00'
),
(
    '10000000-0000-0000-0000-000000000334',
    'f0000000-0000-0000-0000-000000000159',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Tổ chức Hành chính giải quyết.',
    NULL,
    '2025-12-02 10:20:00'
),

-- Phòng Quản trị cơ sở vật chất (d...009) – 24-72h
(
    '10000000-0000-0000-0000-000000000336',
    'f0000000-0000-0000-0000-000000000167',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Quản trị cơ sở vật chất giải quyết.',
    NULL,
    '2025-11-10 12:40:00'
),
(
    '10000000-0000-0000-0000-000000000337',
    'f0000000-0000-0000-0000-000000000168',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Quản trị cơ sở vật chất giải quyết.',
    NULL,
    '2025-11-13 14:15:00'
),
(
    '10000000-0000-0000-0000-000000000341',
    'f0000000-0000-0000-0000-000000000172',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Quản trị cơ sở vật chất giải quyết.',
    NULL,
    '2025-11-25 15:40:00'
),
(
    '10000000-0000-0000-0000-000000000342',
    'f0000000-0000-0000-0000-000000000173',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Quản trị cơ sở vật chất giải quyết.',
    NULL,
    '2025-11-28 12:10:00'
),

-- Phòng Tuyển sinh và CTSV (d...010) – 24-72h
(
    '10000000-0000-0000-0000-000000000347',
    'f0000000-0000-0000-0000-000000000183',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Tuyển sinh và CTSV giải quyết.',
    NULL,
    '2025-11-05 15:40:00'
),
(
    '10000000-0000-0000-0000-000000000351',
    'f0000000-0000-0000-0000-000000000187',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Tuyển sinh và CTSV giải quyết.',
    NULL,
    '2025-11-18 16:30:00'
),
(
    '10000000-0000-0000-0000-000000000352',
    'f0000000-0000-0000-0000-000000000188',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Tuyển sinh và CTSV giải quyết.',
    NULL,
    '2025-11-21 12:45:00'
),
(
    '10000000-0000-0000-0000-000000000356',
    'f0000000-0000-0000-0000-000000000192',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Tuyển sinh và CTSV giải quyết.',
    NULL,
    '2025-12-03 12:30:00'
),
(
    '10000000-0000-0000-0000-000000000357',
    'f0000000-0000-0000-0000-000000000198',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Tuyển sinh và CTSV giải quyết.',
    NULL,
    '2025-12-09 14:20:00'
);
-- =================================================================
-- STEP 6: FORWARDING LOGS
-- Fix ID: fl... -> 2000...
-- Staff User ID: b000...
-- =================================================================
INSERT INTO
    "ForwardingLogs" (
        "id",
        "feedbackId",
        "fromDepartmentId",
        "toDepartmentId",
        "userId",
        "message",
        "note",
        "createdAt"
    )
VALUES (
        '20000000-0000-0000-0000-000000000001',
        'f0000000-0000-0000-0000-000000000011',
        'd0000000-0000-0000-0000-000000000010',
        'd0000000-0000-0000-0000-000000000011',
        'b0000000-0000-0000-0000-000000000010',
        'Chuyển phòng KHTC xử lý.',
        'Nộp nhầm',
        '2025-10-28 09:30:00'
    );

-- =================================================================
-- STEP 7: COMMENTS
-- Fix ID: cmt... -> 4000...
-- Target ID: 3000... (ForumPost)
-- =================================================================
INSERT INTO
    "Comments" (
        "id",
        "targetId",
        "targetType",
        "userId",
        "content",
        "createdAt"
    )
VALUES
    -- ==================== ForumPost p...001 (f034) – 21 comments ====================
    (
        '50000000-0000-0000-0000-000000000001',
        '30000000-0000-0000-0000-000000000001',
        'FORUM_POST',
        'e0000000-0000-0000-0000-000000000004',
        'Mình đồng ý, căng tin cần cải thiện chất lượng món ăn và vệ sinh lắm rồi!',
        '2025-12-01 10:25:00'
    ),
    (
        '50000000-0000-0000-0000-000000000002',
        '30000000-0000-0000-0000-000000000001',
        'FORUM_POST',
        'e0000000-0000-0000-0000-000000000010',
        '+1, giá cũng cao nữa chứ không rẻ đâu',
        '2025-12-01 10:28:00'
    ),
    (
        '50000000-0000-0000-0000-000000000003',
        '30000000-0000-0000-0000-000000000001',
        'FORUM_POST',
        'e0000000-0000-0000-0000-000000000011',
        'Cơm phần 35k mà toàn cơm không, rau có 2 lá',
        '2025-12-01 10:30:00'
    ),
    (
        '50000000-0000-0000-0000-000000000004',
        '30000000-0000-0000-0000-000000000001',
        'FORUM_POST',
        'e0000000-0000-0000-0000-000000000012',
        'Mình thấy dạo này có thêm món mới, nhưng vẫn chưa ngon lắm',
        '2025-12-01 10:35:00'
    ),
    (
        '50000000-0000-0000-0000-000000000005',
        '30000000-0000-0000-0000-000000000001',
        'FORUM_POST',
        'e0000000-0000-0000-0000-000000000013',
        'Cần thêm chỗ ngồi nữa, giờ trưa đông quá',
        '2025-12-01 10:40:00'
    ),
    (
        '50000000-0000-0000-0000-000000000006',
        '30000000-0000-0000-0000-000000000001',
        'FORUM_POST',
        'e0000000-0000-0000-0000-000000000014',
        'Đúng rồi, phải đứng ăn luôn',
        '2025-12-01 10:42:00'
    ),
    (
        '50000000-0000-0000-0000-000000000007',
        '30000000-0000-0000-0000-000000000001',
        'FORUM_POST',
        'e0000000-0000-0000-0000-000000000015',
        'Ai tag phòng CTSV vào đây đi',
        '2025-12-01 10:45:00'
    ),
    (
        '50000000-0000-0000-0000-000000000008',
        '30000000-0000-0000-0000-000000000001',
        'FORUM_POST',
        'e0000000-0000-0000-0000-000000000016',
        'Mình thấy cô bán cơm hay cáu gắt nữa',
        '2025-12-01 10:50:00'
    ),
    (
        '50000000-0000-0000-0000-000000000009',
        '30000000-0000-0000-0000-000000000001',
        'FORUM_POST',
        'e0000000-0000-0000-0000-000000000017',
        'Căng tin trường mình thua xa trường bên cạnh',
        '2025-12-01 10:55:00'
    ),
    (
        '50000000-0000-0000-0000-000000000010',
        '30000000-0000-0000-0000-000000000001',
        'FORUM_POST',
        'e0000000-0000-0000-0000-000000000020',
        'Cho mình hỏi bên ngoài cổng có quán nào ngon không ạ?',
        '2025-12-01 11:00:00'
    ),
    (
        '50000000-0000-0000-0000-000000000011',
        '30000000-0000-0000-0000-000000000001',
        'FORUM_POST',
        'e0000000-0000-0000-0000-000000000021',
        'Quán cô Ba đối diện cổng chính ngon lắm',
        '2025-12-01 11:02:00'
    ),
    (
        '50000000-0000-0000-0000-000000000012',
        '30000000-0000-0000-0000-000000000001',
        'FORUM_POST',
        'e0000000-0000-0000-0000-000000000022',
        'Spam quảng cáo sẽ bị report nhé',
        '2025-12-01 11:10:00'
    ),
    (
        '50000000-0000-0000-0000-000000000013',
        '30000000-0000-0000-0000-000000000001',
        'FORUM_POST',
        'e0000000-0000-0000-0000-000000000030',
        'Bán trà sữa giá sinh viên 10k thôi ạ, inbox mình nhé ^^',
        '2025-12-01 11:15:00'
    ), -- spam
    (
        '50000000-0000-0000-0000-000000000014',
        '30000000-0000-0000-0000-000000000001',
        'FORUM_POST',
        'e0000000-0000-0000-0000-000000000031',
        'Report spam',
        '2025-12-01 11:16:00'
    ),
    (
        '50000000-0000-0000-0000-000000000015',
        '30000000-0000-0000-0000-000000000001',
        'FORUM_POST',
        'e0000000-0000-0000-0000-000000000032',
        'Mình thấy dạo này có thêm món Hàn Quốc rồi',
        '2025-12-01 11:20:00'
    ),
    (
        '50000000-0000-0000-0000-000000000016',
        '30000000-0000-0000-0000-000000000001',
        'FORUM_POST',
        'e0000000-0000-0000-0000-000000000033',
        'Cần thêm quạt máy nữa, nóng quá',
        '2025-12-01 11:25:00'
    ),
    (
        '50000000-0000-0000-0000-000000000017',
        '30000000-0000-0000-0000-000000000001',
        'FORUM_POST',
        'e0000000-0000-0000-0000-000000000040',
        'Hy vọng năm sau sẽ cải thiện',
        '2025-12-01 11:30:00'
    ),
    (
        '50000000-0000-0000-0000-000000000018',
        '30000000-0000-0000-0000-000000000001',
        'FORUM_POST',
        'e0000000-0000-0000-0000-000000000041',
        'Ai còn ảnh chụp món ăn dở thì up lên cho mọi người thấy',
        '2025-12-01 11:40:00'
    ),
    (
        '50000000-0000-0000-0000-000000000019',
        '30000000-0000-0000-0000-000000000001',
        'FORUM_POST',
        'e0000000-0000-0000-0000-000000000042',
        'Nhận ship cơm hộp giá rẻ liên hệ mình nha',
        '2025-12-01 11:45:00'
    ), -- spam
    (
        '50000000-0000-0000-0000-000000000020',
        '30000000-0000-0000-0000-000000000001',
        'FORUM_POST',
        'e0000000-0000-0000-0000-000000000043',
        'Lại spam nữa rồi',
        '2025-12-01 11:46:00'
    ),
    (
        '50000000-0000-0000-0000-000000000021',
        '30000000-0000-0000-0000-000000000001',
        'FORUM_POST',
        'e0000000-0000-0000-0000-000000000004',
        'Cảm ơn mọi người đã góp ý, mình sẽ chuyển lên phòng CTSV',
        '2025-12-01 12:00:00'
    ),

-- ==================== ForumPost p...002 (f035) – 20 comments ====================
(
    '50000000-0000-0000-0000-000000000022',
    '30000000-0000-0000-0000-000000000002',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000005',
    'Máy tính lab cũ quá, chạy AutoCAD lag kinh khủng',
    '2025-12-02 14:30:00'
),
(
    '50000000-0000-0000-0000-000000000023',
    '30000000-0000-0000-0000-000000000002',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000006',
    'Mình học đồ họa mà mở Photoshop mất 5 phút',
    '2025-12-02 14:32:00'
),
(
    '50000000-0000-0000-0000-000000000024',
    '30000000-0000-0000-0000-000000000002',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000010',
    'Cần nâng cấp lên i7 + SSD gấp',
    '2025-12-02 14:35:00'
),
(
    '50000000-0000-0000-0000-000000000025',
    '30000000-0000-0000-0000-000000000002',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000011',
    'Máy lab 2015 rồi còn gì',
    '2025-12-02 14:38:00'
),
(
    '50000000-0000-0000-0000-000000000026',
    '30000000-0000-0000-0000-000000000002',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000012',
    'Mình phải mang laptop cá nhân vào lab',
    '2025-12-02 14:40:00'
),
(
    '50000000-0000-0000-0000-000000000027',
    '30000000-0000-0000-0000-000000000002',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000013',
    'Mình cũng vậy',
    '2025-12-02 14:41:00'
),
(
    '50000000-0000-0000-0000-000000000028',
    '30000000-0000-0000-0000-000000000002',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000014',
    'Hy vọng năm sau được thay mới',
    '2025-12-02 14:45:00'
),
(
    '50000000-0000-0000-0000-000000000029',
    '30000000-0000-0000-0000-000000000002',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000015',
    'Bán laptop gaming giá sinh viên, inbox mình',
    '2025-12-02 14:50:00'
), -- spam
(
    '50000000-0000-0000-0000-000000000030',
    '30000000-0000-0000-0000-000000000002',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000016',
    'Spam',
    '2025-12-02 14:51:00'
),
(
    '50000000-0000-0000-0000-000000000031',
    '30000000-0000-0000-0000-000000000002',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000017',
    'Máy lab còn chạy Win7 nữa',
    '2025-12-02 14:55:00'
),
(
    '50000000-0000-0000-0000-000000000032',
    '30000000-0000-0000-0000-000000000002',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000020',
    'Cần SSD + RAM 16GB minimum',
    '2025-12-02 15:00:00'
),
(
    '50000000-0000-0000-0000-000000000033',
    '30000000-0000-0000-0000-000000000002',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000021',
    'Mình học CNTT mà còn phải code trên Notepad',
    '2025-12-02 15:05:00'
),
(
    '50000000-0000-0000-0000-000000000034',
    '30000000-0000-0000-0000-000000000002',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000022',
    'Tag thầy trưởng phòng Thiết bị đi',
    '2025-12-02 15:10:00'
),
(
    '50000000-0000-0000-0000-000000000035',
    '30000000-0000-0000-0000-000000000002',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000030',
    'Cho thuê laptop học tập giá rẻ',
    '2025-12-02 15:15:00'
), -- spam
(
    '50000000-0000-0000-0000-000000000036',
    '30000000-0000-0000-0000-000000000002',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000031',
    'Mong năm sau được nâng cấp thật',
    '2025-12-02 15:20:00'
),
(
    '50000000-0000-0000-0000-000000000037',
    '30000000-0000-0000-0000-000000000002',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000032',
    'Máy lab còn dùng chuột bi',
    '2025-12-02 15:25:00'
),
(
    '50000000-0000-0000-0000-000000000038',
    '30000000-0000-0000-0000-000000000002',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000033',
    'Mình vote thay mới toàn bộ',
    '2025-12-02 15:30:00'
),
(
    '50000000-0000-0000-0000-000000000039',
    '30000000-0000-0000-0000-000000000002',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000040',
    'Ai có laptop cũ bán lại không?',
    '2025-12-02 15:35:00'
),
(
    '50000000-0000-0000-0000-000000000040',
    '30000000-0000-0000-0000-000000000002',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000041',
    'Cần thay máy mạnh hơn để học AI',
    '2025-12-02 15:40:00'
),
(
    '50000000-0000-0000-0000-000000000041',
    '30000000-0000-0000-0000-000000000002',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000042',
    'Hy vọng lãnh đạo đọc được',
    '2025-12-02 15:45:00'
),

-- ==================== ForumPost p...003 (f036) – 19 comments ====================
(
    '50000000-0000-0000-0000-000000000042',
    '30000000-0000-0000-0000-000000000003',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000043',
    'Nền tảng học online lag kinh khủng',
    '2025-12-03 09:45:00'
),
(
    '50000000-0000-0000-0000-000000000043',
    '30000000-0000-0000-0000-000000000003',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000004',
    'Mình xem video bài giảng bị giật suốt',
    '2025-12-03 09:48:00'
),
(
    '50000000-0000-0000-0000-000000000044',
    '30000000-0000-0000-0000-000000000003',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000005',
    'Cần nâng cấp server gấp',
    '2025-12-03 09:50:00'
),
(
    '50000000-0000-0000-0000-000000000045',
    '30000000-0000-0000-0000-000000000003',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000006',
    'Mấy trường khác dùng Moodle ngon hơn',
    '2025-12-03 09:55:00'
),
(
    '50000000-0000-0000-0000-000000000046',
    '30000000-0000-0000-0000-000000000003',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000010',
    'Nộp bài tập cũng hay bị lỗi',
    '2025-12-03 10:00:00'
),
(
    '50000000-0000-0000-0000-000000000047',
    '30000000-0000-0000-0000-000000000003',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000011',
    'Tag trung tâm dạy học số vào',
    '2025-12-03 10:05:00'
),
(
    '50000000-0000-0000-0000-000000000048',
    '30000000-0000-0000-0000-000000000003',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000012',
    'Mình phải dùng VPN mới xem được',
    '2025-12-03 10:10:00'
),
(
    '50000000-0000-0000-0000-000000000049',
    '30000000-0000-0000-0000-000000000003',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000013',
    'Cần thêm tính năng ghi chú trên video',
    '2025-12-03 10:15:00'
),
(
    '50000000-0000-0000-0000-000000000050',
    '30000000-0000-0000-0000-000000000003',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000014',
    'Cho thuê tài khoản Zoom Pro giá rẻ',
    '2025-12-03 10:20:00'
), -- spam
(
    '50000000-0000-0000-0000-000000000051',
    '30000000-0000-0000-0000-000000000003',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000015',
    'Spam',
    '2025-12-03 10:21:00'
),
(
    '50000000-0000-0000-0000-000000000052',
    '30000000-0000-0000-0000-000000000003',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000016',
    'Hy vọng sớm được sửa',
    '2025-12-03 10:25:00'
),
(
    '50000000-0000-0000-0000-000000000053',
    '30000000-0000-0000-0000-000000000003',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000017',
    'Mấy hôm nay còn không vào được',
    '2025-12-03 10:30:00'
),
(
    '50000000-0000-0000-0000-000000000054',
    '30000000-0000-0000-0000-000000000003',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000020',
    'Cần thêm tính năng chat với giảng viên',
    '2025-12-03 10:35:00'
),
(
    '50000000-0000-0000-0000-000000000055',
    '30000000-0000-0000-0000-000000000003',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000021',
    'Mình vote đổi nền tảng',
    '2025-12-03 10:40:00'
),
(
    '50000000-0000-0000-0000-000000000056',
    '30000000-0000-0000-0000-000000000003',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000022',
    'Cần thêm app mobile',
    '2025-12-03 10:45:00'
),
(
    '50000000-0000-0000-0000-000000000057',
    '30000000-0000-0000-0000-000000000003',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000030',
    'Dùng Google Classroom ngon hơn',
    '2025-12-03 10:50:00'
),
(
    '50000000-0000-0000-0000-000000000058',
    '30000000-0000-0000-0000-000000000003',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000031',
    'Mình phải tải video về xem offline',
    '2025-12-03 10:55:00'
),
(
    '50000000-0000-0000-0000-000000000059',
    '30000000-0000-0000-0000-000000000003',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000032',
    'Cần thêm tính năng quiz tự động',
    '2025-12-03 11:00:00'
),
(
    '50000000-0000-0000-0000-000000000060',
    '30000000-0000-0000-0000-000000000003',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000033',
    'Hy vọng sớm được cải thiện',
    '2025-12-03 11:05:00'
),

-- ==================== ForumPost p...004 (f037) – 20 comments ====================
(
    '50000000-0000-0000-0000-000000000061',
    '30000000-0000-0000-0000-000000000004',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000040',
    'Sự kiện mùa đông cần hoành tráng hơn',
    '2025-12-05 13:15:00'
),
(
    '50000000-0000-0000-0000-000000000062',
    '30000000-0000-0000-0000-000000000004',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000041',
    'Năm ngoái chỉ có văn nghệ nhỏ thôi',
    '2025-12-05 13:18:00'
),
(
    '50000000-0000-0000-0000-000000000063',
    '30000000-0000-0000-0000-000000000004',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000042',
    'Cần có Giáng sinh countdown',
    '2025-12-05 13:20:00'
),
(
    '50000000-0000-0000-0000-000000000064',
    '30000000-0000-0000-0000-000000000004',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000043',
    'Mình muốn có hội chợ Noel',
    '2025-12-05 13:25:00'
),
(
    '50000000-0000-0000-0000-000000000065',
    '30000000-0000-0000-0000-000000000004',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000004',
    'Tag Đoàn Thanh niên vào',
    '2025-12-05 13:30:00'
),
(
    '50000000-0000-0000-0000-000000000066',
    '30000000-0000-0000-0000-000000000004',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000005',
    'Cần cây thông Noel to to',
    '2025-12-05 13:35:00'
),
(
    '50000000-0000-0000-0000-000000000067',
    '30000000-0000-0000-0000-000000000004',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000006',
    'Mình muốn có fireworks',
    '2025-12-05 13:40:00'
),
(
    '50000000-0000-0000-0000-000000000068',
    '30000000-0000-0000-0000-000000000004',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000010',
    'Nhận chụp ảnh Noel giá sinh viên',
    '2025-12-05 13:45:00'
), -- spam
(
    '50000000-0000-0000-0000-000000000069',
    '30000000-0000-0000-0000-000000000004',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000011',
    'Spam',
    '2025-12-05 13:46:00'
),
(
    '50000000-0000-0000-0000-000000000070',
    '30000000-0000-0000-0000-000000000004',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000012',
    'Cần thêm trò chơi teambuilding',
    '2025-12-05 13:50:00'
),
(
    '50000000-0000-0000-0000-000000000071',
    '30000000-0000-0000-0000-000000000004',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000013',
    'Mình muốn có ông già Noel phát quà',
    '2025-12-05 13:55:00'
),
(
    '50000000-0000-0000-0000-000000000072',
    '30000000-0000-0000-0000-000000000004',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000014',
    'Cần sân khấu lớn hơn',
    '2025-12-05 14:00:00'
),
(
    '50000000-0000-0000-0000-000000000073',
    '30000000-0000-0000-0000-000000000004',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000015',
    'Mời ca sĩ về biểu diễn đi',
    '2025-12-05 14:05:00'
),
(
    '50000000-0000-0000-0000-000000000074',
    '30000000-0000-0000-0000-000000000004',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000016',
    'Cần thêm gian hàng đồ ăn',
    '2025-12-05 14:10:00'
),
(
    '50000000-0000-0000-0000-000000000075',
    '30000000-0000-0000-0000-000000000004',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000017',
    'Mình muốn có countdown 2026',
    '2025-12-05 14:15:00'
),
(
    '50000000-0000-0000-0000-000000000076',
    '30000000-0000-0000-0000-000000000004',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000020',
    'Nhận trang trí backdrop Noel',
    '2025-12-05 14:20:00'
), -- spam
(
    '50000000-0000-0000-0000-000000000077',
    '30000000-0000-0000-0000-000000000004',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000021',
    'Cần thêm ánh sáng và âm thanh',
    '2025-12-05 14:25:00'
),
(
    '50000000-0000-0000-0000-000000000078',
    '30000000-0000-0000-0000-000000000004',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000022',
    'Mình vote có sự kiện',
    '2025-12-05 14:30:00'
),
(
    '50000000-0000-0000-0000-000000000079',
    '30000000-0000-0000-0000-000000000004',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000030',
    'Hy vọng Đoàn Thanh niên tổ chức',
    '2025-12-05 14:35:00'
),
(
    '50000000-0000-0000-0000-000000000080',
    '30000000-0000-0000-0000-000000000004',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000031',
    'Mình muốn có bắn pháo hoa',
    '2025-12-05 14:40:00'
),

-- ==================== ForumPost p...005 (f065) – 19 comments ====================
(
    '50000000-0000-0000-0000-000000000081',
    '30000000-0000-0000-0000-000000000005',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000032',
    'Thực tập vẫn chưa có chỗ',
    '2025-12-01 14:45:00'
),
(
    '50000000-0000-0000-0000-000000000082',
    '30000000-0000-0000-0000-000000000005',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000033',
    'Mình cũng đang tìm chỗ thực tập',
    '2025-12-01 14:48:00'
),
(
    '50000000-0000-0000-0000-000000000083',
    '30000000-0000-0000-0000-000000000005',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000040',
    'Phòng QHDN cần hỗ trợ gấp',
    '2025-12-01 14:50:00'
),
(
    '50000000-0000-0000-0000-000000000084',
    '30000000-0000-0000-0000-000000000005',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000041',
    'Nhiều bạn năm 3 đã có chỗ',
    '2025-12-01 14:55:00'
),
(
    '50000000-0000-0000-0000-000000000085',
    '30000000-0000-0000-0000-000000000005',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000042',
    'Mình cần chỗ thực tập có lương',
    '2025-12-01 15:00:00'
),
(
    '50000000-0000-0000-0000-000000000086',
    '30000000-0000-0000-0000-000000000005',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000043',
    'Ai có list công ty nhận thực tập share mình với',
    '2025-12-01 15:05:00'
),
(
    '50000000-0000-0000-0000-000000000087',
    '30000000-0000-0000-0000-000000000005',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000004',
    'Mình có file list công ty, để lại gmail mình gửi',
    '2025-12-01 15:10:00'
),
(
    '50000000-0000-0000-0000-000000000088',
    '30000000-0000-0000-0000-000000000005',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000005',
    'Cảm ơn bạn nhiều',
    '2025-12-01 15:12:00'
),
(
    '50000000-0000-0000-0000-000000000089',
    '30000000-0000-0000-0000-000000000005',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000006',
    'Nhận làm CV thực tập giá rẻ',
    '2025-12-01 15:15:00'
), -- spam
(
    '50000000-0000-0000-0000-000000000090',
    '30000000-0000-0000-0000-000000000005',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000010',
    'Spam',
    '2025-12-01 15:16:00'
),
(
    '50000000-0000-0000-0000-000000000091',
    '30000000-0000-0000-0000-000000000005',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000011',
    'Mình cần chỗ thực tập IT',
    '2025-12-01 15:20:00'
),
(
    '50000000-0000-0000-0000-000000000092',
    '30000000-0000-0000-0000-000000000005',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000012',
    'Có nhóm thực tập FPT không?',
    '2025-12-01 15:25:00'
),
(
    '50000000-0000-0000-0000-000000000093',
    '30000000-0000-0000-0000-000000000005',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000013',
    'Mình cần chỗ thực tập cơ khí',
    '2025-12-01 15:30:00'
),
(
    '50000000-0000-0000-0000-000000000094',
    '30000000-0000-0000-0000-000000000005',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000014',
    'Hy vọng phòng QHDN hỗ trợ sớm',
    '2025-12-01 15:35:00'
),
(
    '50000000-0000-0000-0000-000000000095',
    '30000000-0000-0000-0000-000000000005',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000015',
    'Mình có chỗ thực tập rồi, cảm ơn mọi người',
    '2025-12-01 15:40:00'
),
(
    '50000000-0000-0000-0000-000000000096',
    '30000000-0000-0000-0000-000000000005',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000016',
    'Ai cần giới thiệu công ty thì inbox mình',
    '2025-12-01 15:45:00'
),
(
    '50000000-0000-0000-0000-000000000097',
    '30000000-0000-0000-0000-000000000005',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000017',
    'Cần chỗ thực tập part-time',
    '2025-12-01 15:50:00'
),
(
    '50000000-0000-0000-0000-000000000098',
    '30000000-0000-0000-0000-000000000005',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000020',
    'Mình có list 50 công ty nhận thực tập',
    '2025-12-01 15:55:00'
),
(
    '50000000-0000-0000-0000-000000000099',
    '30000000-0000-0000-0000-000000000005',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000021',
    'Cảm ơn mọi người đã chia sẻ',
    '2025-12-01 16:00:00'
),

-- ==================== Các ForumPost còn lại (3-4 comment mỗi post) ====================
(
    '50000000-0000-0000-0000-000000000100',
    '30000000-0000-0000-0000-000000000006',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000022',
    'Job fair cuối năm cần hoành tráng hơn',
    '2025-12-02 10:30:00'
),
(
    '50000000-0000-0000-0000-000000000101',
    '30000000-0000-0000-0000-000000000006',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000030',
    'Mình đồng ý',
    '2025-12-02 10:32:00'
),
(
    '50000000-0000-0000-0000-000000000102',
    '30000000-0000-0000-0000-000000000006',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000031',
    'Cần mời thêm công ty lớn',
    '2025-12-02 10:35:00'
),
(
    '50000000-0000-0000-0000-000000000103',
    '30000000-0000-0000-0000-000000000007',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000032',
    'Học bổng năm sau vẫn chưa có thông tin',
    '2025-12-03 17:00:00'
),
(
    '50000000-0000-0000-0000-000000000104',
    '30000000-0000-0000-0000-000000000007',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000033',
    'Mình cũng đang chờ',
    '2025-12-03 17:05:00'
),
(
    '50000000-0000-0000-0000-000000000105',
    '30000000-0000-0000-0000-000000000007',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000040',
    'Hy vọng sớm có thông báo',
    '2025-12-03 17:10:00'
),
(
    '50000000-0000-0000-0000-000000000106',
    '30000000-0000-0000-0000-000000000007',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000041',
    'Cần thêm học bổng doanh nghiệp',
    '2025-12-03 17:15:00'
),
(
    '50000000-0000-0000-0000-000000000107',
    '30000000-0000-0000-0000-000000000008',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000042',
    'Kết nối startup hay đấy',
    '2025-12-05 11:35:00'
),
(
    '50000000-0000-0000-0000-000000000108',
    '30000000-0000-0000-0000-000000000008',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000043',
    'Mình muốn tham gia',
    '2025-12-05 11:38:00'
),
(
    '50000000-0000-0000-0000-000000000109',
    '30000000-0000-0000-0000-000000000008',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000004',
    'Ủng hộ',
    '2025-12-05 11:40:00'
),
(
    '50000000-0000-0000-0000-000000000110',
    '30000000-0000-0000-0000-000000000009',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000005',
    'Cần kế hoạch sớm hơn',
    '2025-12-06 10:05:00'
),
(
    '50000000-0000-0000-0000-000000000111',
    '30000000-0000-0000-0000-000000000009',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000006',
    'Đồng ý',
    '2025-12-06 10:08:00'
),
(
    '50000000-0000-0000-0000-000000000112',
    '30000000-0000-0000-0000-000000000009',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000010',
    'Hy vọng có nhiều hội thảo',
    '2025-12-06 10:10:00'
),
(
    '50000000-0000-0000-0000-000000000113',
    '30000000-0000-0000-0000-000000000010',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000011',
    'Thực tập nước ngoài hay quá',
    '2025-12-07 14:15:00'
),
(
    '50000000-0000-0000-0000-000000000114',
    '30000000-0000-0000-0000-000000000010',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000012',
    'Mình muốn đi',
    '2025-12-07 14:18:00'
),
(
    '50000000-0000-0000-0000-000000000115',
    '30000000-0000-0000-0000-000000000010',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000013',
    'Chi phí thế nào ạ?',
    '2025-12-07 14:20:00'
),
(
    '50000000-0000-0000-0000-000000000116',
    '30000000-0000-0000-0000-000000000010',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000014',
    'Hy vọng có học bổng hỗ trợ',
    '2025-12-07 14:25:00'
),
(
    '50000000-0000-0000-0000-000000000117',
    '30000000-0000-0000-0000-000000000011',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000015',
    'Cần sớm có kế hoạch đề tài',
    '2025-12-01 10:55:00'
),
(
    '50000000-0000-0000-0000-000000000118',
    '30000000-0000-0000-0000-000000000011',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000016',
    'Mình đồng ý',
    '2025-12-01 11:00:00'
),
(
    '50000000-0000-0000-0000-000000000119',
    '30000000-0000-0000-0000-000000000011',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000017',
    'Mong phòng KH&CN hỗ trợ',
    '2025-12-01 11:05:00'
),
(
    '50000000-0000-0000-0000-000000000120',
    '30000000-0000-0000-0000-000000000012',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000020',
    'Cuộc thi ý tưởng cần tổ chức lại',
    '2025-12-02 14:35:00'
),
(
    '50000000-0000-0000-0000-000000000121',
    '30000000-0000-0000-0000-000000000012',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000021',
    'Mình muốn tham gia',
    '2025-12-02 14:38:00'
),
(
    '50000000-0000-0000-0000-000000000122',
    '30000000-0000-0000-0000-000000000012',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000022',
    'Hy vọng có giải thưởng lớn',
    '2025-12-02 14:40:00'
),
(
    '50000000-0000-0000-0000-000000000123',
    '30000000-0000-0000-0000-000000000012',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000030',
    'Cần thêm mentor',
    '2025-12-02 14:45:00'
),
(
    '50000000-0000-0000-0000-000000000124',
    '30000000-0000-0000-0000-000000000013',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000031',
    'Cần thưởng xứng đáng cho bài báo Q1',
    '2025-12-04 11:25:00'
),
(
    '50000000-0000-0000-0000-000000000125',
    '30000000-0000-0000-0000-000000000013',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000032',
    'Đồng ý',
    '2025-12-04 11:28:00'
),
(
    '50000000-0000-0000-0000-000000000126',
    '30000000-0000-0000-0000-000000000013',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000033',
    'Hiện tại thưởng quá thấp',
    '2025-12-04 11:30:00'
),
(
    '50000000-0000-0000-0000-000000000127',
    '30000000-0000-0000-0000-000000000014',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000040',
    'Cần phòng lab AI riêng',
    '2025-12-05 16:05:00'
),
(
    '50000000-0000-0000-0000-000000000128',
    '30000000-0000-0000-0000-000000000014',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000041',
    'Mình ủng hộ',
    '2025-12-05 16:08:00'
),
(
    '50000000-0000-0000-0000-000000000129',
    '30000000-0000-0000-0000-000000000014',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000042',
    'Cần GPU mạnh hơn',
    '2025-12-05 16:10:00'
),
(
    '50000000-0000-0000-0000-000000000130',
    '30000000-0000-0000-0000-000000000014',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000043',
    'Hy vọng sớm có',
    '2025-12-05 16:15:00'
),
(
    '50000000-0000-0000-0000-000000000131',
    '30000000-0000-0000-0000-000000000015',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000004',
    'Cần hội nghị NCKH sinh viên',
    '2025-12-07 09:45:00'
),
(
    '50000000-0000-0000-0000-000000000132',
    '30000000-0000-0000-0000-000000000015',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000005',
    'Mình muốn đăng ký',
    '2025-12-07 09:48:00'
),
(
    '50000000-0000-0000-0000-000000000133',
    '30000000-0000-0000-0000-000000000015',
    'FORUM_POST',
    'e0000000-0000-0000-0000-000000000006',
    'Hy vọng có giải thưởng',
    '2025-12-07 09:50:00'
);

INSERT INTO
    "Votes" ("userId", "postId")
VALUES
    -- p000...001 – 30 votes
    (
        'e0000000-0000-0000-0000-000000000001',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000002',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000003',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000005',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000012',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000013',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000014',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000015',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000016',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000017',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000020',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000021',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000022',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000030',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000031',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000032',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000033',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000040',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000041',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000042',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000043',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000004',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000006',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000010',
        '30000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000011',
        '30000000-0000-0000-0000-000000000001'
    ),

-- p000...002 – 28 votes
(
    'e0000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000002'
),
(
    'e0000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000002'
),
(
    'e0000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000002'
),
(
    'e0000000-0000-0000-0000-000000000010',
    '30000000-0000-0000-0000-000000000002'
),
(
    'e0000000-0000-0000-0000-000000000011',
    '30000000-0000-0000-0000-000000000002'
),
(
    'e0000000-0000-0000-0000-000000000012',
    '30000000-0000-0000-0000-000000000002'
),
(
    'e0000000-0000-0000-0000-000000000013',
    '30000000-0000-0000-0000-000000000002'
),
(
    'e0000000-0000-0000-0000-000000000014',
    '30000000-0000-0000-0000-000000000002'
),
(
    'e0000000-0000-0000-0000-000000000015',
    '30000000-0000-0000-0000-000000000002'
),
(
    'e0000000-0000-0000-0000-000000000016',
    '30000000-0000-0000-0000-000000000002'
),
(
    'e0000000-0000-0000-0000-000000000017',
    '30000000-0000-0000-0000-000000000002'
),
(
    'e0000000-0000-0000-0000-000000000020',
    '30000000-0000-0000-0000-000000000002'
),
(
    'e0000000-0000-0000-0000-000000000021',
    '30000000-0000-0000-0000-000000000002'
),
(
    'e0000000-0000-0000-0000-000000000022',
    '30000000-0000-0000-0000-000000000002'
),
(
    'e0000000-0000-0000-0000-000000000030',
    '30000000-0000-0000-0000-000000000002'
),
(
    'e0000000-0000-0000-0000-000000000031',
    '30000000-0000-0000-0000-000000000002'
),
(
    'e0000000-0000-0000-0000-000000000032',
    '30000000-0000-0000-0000-000000000002'
),
(
    'e0000000-0000-0000-0000-000000000033',
    '30000000-0000-0000-0000-000000000002'
),
(
    'e0000000-0000-0000-0000-000000000040',
    '30000000-0000-0000-0000-000000000002'
),
(
    'e0000000-0000-0000-0000-000000000041',
    '30000000-0000-0000-0000-000000000002'
),
(
    'e0000000-0000-0000-0000-000000000042',
    '30000000-0000-0000-0000-000000000002'
),
(
    'e0000000-0000-0000-0000-000000000043',
    '30000000-0000-0000-0000-000000000002'
),
(
    'e0000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000002'
),
(
    'e0000000-0000-0000-0000-000000000005',
    '30000000-0000-0000-0000-000000000002'
),

-- p000...003 – 26 votes
(
    'e0000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000003'
),
(
    'e0000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000003'
),
(
    'e0000000-0000-0000-0000-000000000005',
    '30000000-0000-0000-0000-000000000003'
),
(
    'e0000000-0000-0000-0000-000000000006',
    '30000000-0000-0000-0000-000000000003'
),
(
    'e0000000-0000-0000-0000-000000000010',
    '30000000-0000-0000-0000-000000000003'
),
(
    'e0000000-0000-0000-0000-000000000011',
    '30000000-0000-0000-0000-000000000003'
),
(
    'e0000000-0000-0000-0000-000000000012',
    '30000000-0000-0000-0000-000000000003'
),
(
    'e0000000-0000-0000-0000-000000000013',
    '30000000-0000-0000-0000-000000000003'
),
(
    'e0000000-0000-0000-0000-000000000014',
    '30000000-0000-0000-0000-000000000003'
),
(
    'e0000000-0000-0000-0000-000000000015',
    '30000000-0000-0000-0000-000000000003'
),
(
    'e0000000-0000-0000-0000-000000000016',
    '30000000-0000-0000-0000-000000000003'
),
(
    'e0000000-0000-0000-0000-000000000017',
    '30000000-0000-0000-0000-000000000003'
),
(
    'e0000000-0000-0000-0000-000000000020',
    '30000000-0000-0000-0000-000000000003'
),
(
    'e0000000-0000-0000-0000-000000000021',
    '30000000-0000-0000-0000-000000000003'
),
(
    'e0000000-0000-0000-0000-000000000022',
    '30000000-0000-0000-0000-000000000003'
),
(
    'e0000000-0000-0000-0000-000000000030',
    '30000000-0000-0000-0000-000000000003'
),
(
    'e0000000-0000-0000-0000-000000000031',
    '30000000-0000-0000-0000-000000000003'
),
(
    'e0000000-0000-0000-0000-000000000032',
    '30000000-0000-0000-0000-000000000003'
),
(
    'e0000000-0000-0000-0000-000000000033',
    '30000000-0000-0000-0000-000000000003'
),
(
    'e0000000-0000-0000-0000-000000000040',
    '30000000-0000-0000-0000-000000000003'
),
(
    'e0000000-0000-0000-0000-000000000041',
    '30000000-0000-0000-0000-000000000003'
),
(
    'e0000000-0000-0000-0000-000000000042',
    '30000000-0000-0000-0000-000000000003'
),
(
    'e0000000-0000-0000-0000-000000000043',
    '30000000-0000-0000-0000-000000000003'
),

-- p000...004 – 27 votes
(
    'e0000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000004'
),
(
    'e0000000-0000-0000-0000-000000000005',
    '30000000-0000-0000-0000-000000000004'
),
(
    'e0000000-0000-0000-0000-000000000006',
    '30000000-0000-0000-0000-000000000004'
),
(
    'e0000000-0000-0000-0000-000000000010',
    '30000000-0000-0000-0000-000000000004'
),
(
    'e0000000-0000-0000-0000-000000000011',
    '30000000-0000-0000-0000-000000000004'
),
(
    'e0000000-0000-0000-0000-000000000012',
    '30000000-0000-0000-0000-000000000004'
),
(
    'e0000000-0000-0000-0000-000000000013',
    '30000000-0000-0000-0000-000000000004'
),
(
    'e0000000-0000-0000-0000-000000000014',
    '30000000-0000-0000-0000-000000000004'
),
(
    'e0000000-0000-0000-0000-000000000015',
    '30000000-0000-0000-0000-000000000004'
),
(
    'e0000000-0000-0000-0000-000000000016',
    '30000000-0000-0000-0000-000000000004'
),
(
    'e0000000-0000-0000-0000-000000000017',
    '30000000-0000-0000-0000-000000000004'
),
(
    'e0000000-0000-0000-0000-000000000020',
    '30000000-0000-0000-0000-000000000004'
),
(
    'e0000000-0000-0000-0000-000000000021',
    '30000000-0000-0000-0000-000000000004'
),
(
    'e0000000-0000-0000-0000-000000000022',
    '30000000-0000-0000-0000-000000000004'
),
(
    'e0000000-0000-0000-0000-000000000030',
    '30000000-0000-0000-0000-000000000004'
),
(
    'e0000000-0000-0000-0000-000000000031',
    '30000000-0000-0000-0000-000000000004'
),
(
    'e0000000-0000-0000-0000-000000000032',
    '30000000-0000-0000-0000-000000000004'
),
(
    'e0000000-0000-0000-0000-000000000033',
    '30000000-0000-0000-0000-000000000004'
),
(
    'e0000000-0000-0000-0000-000000000040',
    '30000000-0000-0000-0000-000000000004'
),
(
    'e0000000-0000-0000-0000-000000000041',
    '30000000-0000-0000-0000-000000000004'
),
(
    'e0000000-0000-0000-0000-000000000042',
    '30000000-0000-0000-0000-000000000004'
),
(
    'e0000000-0000-0000-0000-000000000043',
    '30000000-0000-0000-0000-000000000004'
),

-- p000...005 – 25 votes

(
    'e0000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000005'
),
(
    'e0000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000005'
),
(
    'e0000000-0000-0000-0000-000000000005',
    '30000000-0000-0000-0000-000000000005'
),
(
    'e0000000-0000-0000-0000-000000000006',
    '30000000-0000-0000-0000-000000000005'
),
(
    'e0000000-0000-0000-0000-000000000010',
    '30000000-0000-0000-0000-000000000005'
),
(
    'e0000000-0000-0000-0000-000000000011',
    '30000000-0000-0000-0000-000000000005'
),
(
    'e0000000-0000-0000-0000-000000000012',
    '30000000-0000-0000-0000-000000000005'
),
(
    'e0000000-0000-0000-0000-000000000013',
    '30000000-0000-0000-0000-000000000005'
),
(
    'e0000000-0000-0000-0000-000000000014',
    '30000000-0000-0000-0000-000000000005'
),
(
    'e0000000-0000-0000-0000-000000000015',
    '30000000-0000-0000-0000-000000000005'
),
(
    'e0000000-0000-0000-0000-000000000016',
    '30000000-0000-0000-0000-000000000005'
),
(
    'e0000000-0000-0000-0000-000000000017',
    '30000000-0000-0000-0000-000000000005'
),
(
    'e0000000-0000-0000-0000-000000000020',
    '30000000-0000-0000-0000-000000000005'
),
(
    'e0000000-0000-0000-0000-000000000021',
    '30000000-0000-0000-0000-000000000005'
),
(
    'e0000000-0000-0000-0000-000000000022',
    '30000000-0000-0000-0000-000000000005'
),
(
    'e0000000-0000-0000-0000-000000000030',
    '30000000-0000-0000-0000-000000000005'
),
(
    'e0000000-0000-0000-0000-000000000031',
    '30000000-0000-0000-0000-000000000005'
),
(
    'e0000000-0000-0000-0000-000000000032',
    '30000000-0000-0000-0000-000000000005'
),
(
    'e0000000-0000-0000-0000-000000000033',
    '30000000-0000-0000-0000-000000000005'
),
(
    'e0000000-0000-0000-0000-000000000040',
    '30000000-0000-0000-0000-000000000005'
),
(
    'e0000000-0000-0000-0000-000000000041',
    '30000000-0000-0000-0000-000000000005'
),
(
    'e0000000-0000-0000-0000-000000000042',
    '30000000-0000-0000-0000-000000000005'
),
(
    'e0000000-0000-0000-0000-000000000043',
    '30000000-0000-0000-0000-000000000005'
),

-- Các post còn lại: 6–10 votes mỗi post
(
    'e0000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000006'
),
(
    'e0000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000006'
),
(
    'e0000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000006'
),
(
    'e0000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000006'
),
(
    'e0000000-0000-0000-0000-000000000005',
    '30000000-0000-0000-0000-000000000006'
),
(
    'e0000000-0000-0000-0000-000000000006',
    '30000000-0000-0000-0000-000000000006'
),
(
    'e0000000-0000-0000-0000-000000000010',
    '30000000-0000-0000-0000-000000000006'
),
(
    'e0000000-0000-0000-0000-000000000011',
    '30000000-0000-0000-0000-000000000006'
),
(
    'e0000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000007'
),
(
    'e0000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000007'
),
(
    'e0000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000007'
),
(
    'e0000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000007'
),
(
    'e0000000-0000-0000-0000-000000000005',
    '30000000-0000-0000-0000-000000000007'
),
(
    'e0000000-0000-0000-0000-000000000006',
    '30000000-0000-0000-0000-000000000007'
),
(
    'e0000000-0000-0000-0000-000000000010',
    '30000000-0000-0000-0000-000000000007'
),
(
    'e0000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000008'
),
(
    'e0000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000008'
),
(
    'e0000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000008'
),
(
    'e0000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000008'
),
(
    'e0000000-0000-0000-0000-000000000005',
    '30000000-0000-0000-0000-000000000008'
),
(
    'e0000000-0000-0000-0000-000000000006',
    '30000000-0000-0000-0000-000000000008'
),
(
    'e0000000-0000-0000-0000-000000000010',
    '30000000-0000-0000-0000-000000000008'
),
(
    'e0000000-0000-0000-0000-000000000011',
    '30000000-0000-0000-0000-000000000008'
),
(
    'e0000000-0000-0000-0000-000000000012',
    '30000000-0000-0000-0000-000000000008'
),
(
    'e0000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000009'
),
(
    'e0000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000009'
),
(
    'e0000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000009'
),
(
    'e0000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000009'
),
(
    'e0000000-0000-0000-0000-000000000005',
    '30000000-0000-0000-0000-000000000009'
),
(
    'e0000000-0000-0000-0000-000000000006',
    '30000000-0000-0000-0000-000000000009'
),
(
    'e0000000-0000-0000-0000-000000000010',
    '30000000-0000-0000-0000-000000000009'
),
(
    'e0000000-0000-0000-0000-000000000011',
    '30000000-0000-0000-0000-000000000009'
),
(
    'e0000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000010'
),
(
    'e0000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000010'
),
(
    'e0000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000010'
),
(
    'e0000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000010'
),
(
    'e0000000-0000-0000-0000-000000000005',
    '30000000-0000-0000-0000-000000000010'
),
(
    'e0000000-0000-0000-0000-000000000006',
    '30000000-0000-0000-0000-000000000010'
),
(
    'e0000000-0000-0000-0000-000000000010',
    '30000000-0000-0000-0000-000000000010'
),
(
    'e0000000-0000-0000-0000-000000000011',
    '30000000-0000-0000-0000-000000000010'
),
(
    'e0000000-0000-0000-0000-000000000012',
    '30000000-0000-0000-0000-000000000010'
),
(
    'e0000000-0000-0000-0000-000000000013',
    '30000000-0000-0000-0000-000000000010'
),
(
    'e0000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000011'
),
(
    'e0000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000011'
),
(
    'e0000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000011'
),
(
    'e0000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000011'
),
(
    'e0000000-0000-0000-0000-000000000005',
    '30000000-0000-0000-0000-000000000011'
),
(
    'e0000000-0000-0000-0000-000000000006',
    '30000000-0000-0000-0000-000000000011'
),
(
    'e0000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000012'
),
(
    'e0000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000012'
),
(
    'e0000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000012'
),
(
    'e0000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000012'
),
(
    'e0000000-0000-0000-0000-000000000005',
    '30000000-0000-0000-0000-000000000012'
),
(
    'e0000000-0000-0000-0000-000000000006',
    '30000000-0000-0000-0000-000000000012'
),
(
    'e0000000-0000-0000-0000-000000000010',
    '30000000-0000-0000-0000-000000000012'
),
(
    'e0000000-0000-0000-0000-000000000011',
    '30000000-0000-0000-0000-000000000012'
),
(
    'e0000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000013'
),
(
    'e0000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000013'
),
(
    'e0000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000013'
),
(
    'e0000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000013'
),
(
    'e0000000-0000-0000-0000-000000000005',
    '30000000-0000-0000-0000-000000000013'
),
(
    'e0000000-0000-0000-0000-000000000006',
    '30000000-0000-0000-0000-000000000013'
),
(
    'e0000000-0000-0000-0000-000000000010',
    '30000000-0000-0000-0000-000000000013'
),
(
    'e0000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000014'
),
(
    'e0000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000014'
),
(
    'e0000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000014'
),
(
    'e0000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000014'
),
(
    'e0000000-0000-0000-0000-000000000005',
    '30000000-0000-0000-0000-000000000014'
),
(
    'e0000000-0000-0000-0000-000000000006',
    '30000000-0000-0000-0000-000000000014'
),
(
    'e0000000-0000-0000-0000-000000000010',
    '30000000-0000-0000-0000-000000000014'
),
(
    'e0000000-0000-0000-0000-000000000011',
    '30000000-0000-0000-0000-000000000014'
),
(
    'e0000000-0000-0000-0000-000000000012',
    '30000000-0000-0000-0000-000000000014'
),
(
    'e0000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000015'
),
(
    'e0000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000015'
),
(
    'e0000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000015'
),
(
    'e0000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000015'
),
(
    'e0000000-0000-0000-0000-000000000005',
    '30000000-0000-0000-0000-000000000015'
),
(
    'e0000000-0000-0000-0000-000000000006',
    '30000000-0000-0000-0000-000000000015'
),
(
    'e0000000-0000-0000-0000-000000000010',
    '30000000-0000-0000-0000-000000000015'
),
(
    'e0000000-0000-0000-0000-000000000011',
    '30000000-0000-0000-0000-000000000015'
);
-- =================================================================
-- STEP 10: ANNOUNCEMENTS
-- Fix ID: ann... -> 6000...
-- Staff User ID: b000...
-- ================================================================
INSERT INTO
    "Announcements" (
        "id",
        "title",
        "content",
        "createdAt",
        "userId",
        "departmentId"
    )
VALUES
-- 1. Thông báo ID 01
(
    '60000000-0000-0000-0000-000000000001',
    'Thông báo lịch thanh tra định kỳ học kỳ I năm học 2025-2026',
    'Kính gửi quý thầy cô giáo và toàn thể sinh viên,

Căn cứ Kế hoạch công tác năm học 2025-2026, Phòng Thanh tra giáo dục sẽ tiến hành thanh tra định kỳ việc thực hiện quy chế đào tạo, đánh giá người học và đạo đức nhà giáo tại tất cả các khoa từ ngày 10/12/2025 đến ngày 28/12/2025. 
Đoàn thanh tra sẽ kiểm tra hồ sơ giảng dạy, biên bản chấm thi, bảng điểm và các tài liệu liên quan. 
Đề nghị lãnh đạo các khoa chỉ đạo giảng viên chuẩn bị đầy đủ hồ sơ theo phụ lục đính kèm. 
Thông tin chi tiết vui lòng liên hệ trực tiếp tại Phòng A1.1003 (tầng 10), Tòa nhà trung tâm hoặc qua email pttgd@hcmute.edu.vn.

Trân trọng thông báo.',
    '2025-12-04 09:00:00',
    'b0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001'
),

-- 2. Thông báo ID 02
(
    '60000000-0000-0000-0000-000000000002',
    'Hướng dẫn tiếp nhận và xử lý tố giác vi phạm đạo đức nhà giáo',
    'Kính gửi toàn thể cán bộ, giảng viên và sinh viên,

Phòng Thanh tra giáo dục tiếp nhận mọi thông tin tố giác hành vi vi phạm đạo đức nhà giáo qua các kênh chính thức: hộp thư điện tử pttgd@hcmute.edu.vn, hộp thư góp ý tại các tòa nhà, hoặc gặp trực tiếp lãnh đạo phòng tại Phòng A1.1003 (tầng 10), Tòa nhà trung tâm. 
Mọi thông tin tiếp nhận đều được bảo mật tuyệt đối danh tính người cung cấp, được tiến hành xác minh độc lập, khách quan và xử lý nghiêm theo quy định pháp luật. 
Kính mong quý thầy cô và các em sinh viên tích cực tham gia giám sát, góp phần xây dựng môi trường giáo dục lành mạnh.

Trân trọng!',
    '2025-11-18 14:30:00',
    'b0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001'
),

-- 3. Thông báo ID 03
(
    '60000000-0000-0000-0000-000000000003',
    'Công bố kết quả xử lý khiếu nại học kỳ hè 2025',
    'Kính gửi toàn thể sinh viên,

Phòng Thanh tra giáo dục đã hoàn tất công tác xác minh và làm việc đối với 15 vụ việc khiếu nại liên quan đến quy trình chấm thi và điểm số trong học kỳ hè 2025. 
Kết quả xử lý chi tiết đã được gửi trực tiếp đến các cá nhân liên quan, đồng thời niêm yết công khai tại bảng tin văn phòng Phòng A1.1003 (tầng 10), Tòa nhà trung tâm. Các trường hợp phát hiện sai sót hoặc vi phạm quy chế đều đã bị xử lý nghiêm túc, đảm bảo quyền lợi chính đáng cho người học.

Trân trọng thông báo.',
    '2025-10-15 10:00:00',
    'b0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001'
),

-- 4. Thông báo ID 04
(
    '60000000-0000-0000-0000-000000000004',
    'Tập huấn quy chế thi và đạo đức nhà giáo',
    'Kính gửi toàn thể giảng viên,

Phòng Thanh tra giáo dục tổ chức buổi tập huấn chuyên đề “Quy chế thi, công tác coi thi/chấm thi và đạo đức nhà giáo” vào lúc 09h00 ngày 15/09/2025 tại Hội trường A. 
Đây là buổi sinh hoạt chuyên môn bắt buộc đối với toàn bộ giảng viên cơ hữu và giảng viên thỉnh giảng. Giảng viên vắng mặt không có lý do chính đáng sẽ được ghi nhận biên bản gửi về Hội đồng thi đua. Mọi thắc mắc và đơn xin nghỉ vui lòng nộp về Phòng A1.1003 (tầng 10) trước ngày diễn ra tập huấn.

Trân trọng thông báo.',
    '2025-09-10 11:00:00',
    'b0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001'
),

-- 5. Thông báo ID 05
(
    '60000000-0000-0000-0000-000000000005',
    'Kế hoạch thanh tra nội bộ năm học 2025-2026',
    'Kính gửi lãnh đạo các đơn vị, Khoa và Trung tâm,

Phòng Thanh tra giáo dục chính thức công bố kế hoạch thanh tra nội bộ toàn diện đối với hoạt động đào tạo, quản lý phôi bằng và kiểm tra tiến độ giảng dạy năm học 2025-2026. 
Lịch thanh tra chi tiết cho từng đơn vị cụ thể sẽ được gửi bằng văn bản giấy và email trước 15 ngày làm việc. Đề nghị các đơn vị phân công đầu mối hỗ trợ, chuẩn bị hồ sơ minh chứng đầy đủ tại văn phòng làm việc để phối hợp cùng đoàn thanh tra trường.

Trân trọng.',
    '2025-08-20 09:30:00',
    'b0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001'
),

-- 6. Thông báo ID 06
(
    '60000000-0000-0000-0000-000000000006',
    'Thông báo kiểm tra đột xuất việc chấp hành giờ giấc giảng dạy học kỳ II',
    'Kính gửi lãnh đạo các đơn vị và quý thầy cô giảng viên,

Nhằm tăng cường kỷ cương học đường và nâng cao chất lượng đào tạo, Phòng Thanh tra giáo dục sẽ phối hợp cùng các bên liên quan tiến hành kiểm tra đột xuất giờ giấc ra vào lớp, việc chấp hành thời khóa biểu và thực hiện giảng dạy theo đề cương chi tiết tại các giảng đường trong suốt học kỳ II.
Mọi trường hợp đi muộn, về sớm hoặc tự ý thay đổi lịch học/phòng học mà không thông qua Giáo vụ Khoa sẽ được ban thanh tra lập biên bản tại chỗ và tổng hợp báo cáo gửi Ban Giám hiệu. Kính mong quý thầy cô lưu ý và thực hiện nghiêm túc.

Trân trọng thông báo.',
    '2026-01-12 08:00:00',
    'b0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001'
),

-- 7. Thông báo ID 07
(
    '60000000-0000-0000-0000-000000000007',
    'Thông báo gia hạn thời gian nộp đơn phúc khảo và khiếu nại điểm thi',
    'Kính gửi các bạn sinh viên toàn trường,

Do sự cố kỹ thuật trong quá trình đồng bộ hệ thống quản lý điểm vừa qua, Phòng Thanh tra giáo dục quyết định gia hạn thời gian tiếp nhận đơn phúc khảo bài thi và khiếu nại điểm số của học kỳ I năm học 2025-2026.
- Thời gian gia hạn: Đến hết ngày 15/02/2026.
- Quy trình thực hiện: Sinh viên điền form trực tuyến trên cổng thông tin, sau đó nộp biên nhận cùng các minh chứng kèm theo trực tiếp tại văn phòng Phòng Thanh tra giáo dục (Phòng A1.1003, tầng 10, Tòa nhà trung tâm). Sau thời gian trên, hệ thống sẽ tự động đóng và không giải quyết thêm bất kỳ trường hợp ngoại lệ nào.

Thân ái.',
    '2026-02-05 15:00:00',
    'b0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001'
),

-- 8. Thông báo ID 08
(
    '60000000-0000-0000-0000-000000000008',
    'Thông báo thanh tra chuyên đề công tác xét tốt nghiệp và cấp phát văn bằng',
    'Kính gửi Phòng Đào tạo và Ban chủ nhiệm các Khoa,

Thực hiện theo quyết định của Hiệu trưởng, Phòng Thanh tra giáo dục sẽ triển khai đợt thanh tra chuyên đề về "Công tác kiểm tra hồ sơ xét công nhận tốt nghiệp và quy trình cấp phát văn bằng tốt nghiệp năm 2026".
Thời gian làm việc trực tiếp: Từ ngày 10/04/2026 đến ngày 25/04/2026.
Đoàn thanh tra sẽ tiến hành rà soát ngẫu nhiên hồ sơ sinh viên đủ điều kiện tốt nghiệp, đối chiếu chứng chỉ đầu ra (ngoại ngữ, tin học) và kiểm tra việc ghi sổ gốc cấp phát bằng. Đề nghị các đơn vị chuẩn bị sẵn sàng không gian làm việc và tài liệu liên quan tại văn phòng Phòng A1.1003 (tầng 10).

Trân trọng.',
    '2026-04-02 10:15:00',
    'b0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001'
),

-- 9. Thông báo ID 09
(
    '60000000-0000-0000-0000-000000000009',
    'V/v Giám sát và thanh tra công tác tổ chức kỳ thi kết thúc học kỳ II',
    'Kính gửi Hội đồng thi và Ban coi thi trường,

Để bảo đảm tính nghiêm túc, khách quan và đúng quy chế của kỳ thi kết thúc học kỳ II năm học 2025-2026, Phòng Thanh tra giáo dục yêu cầu các cán bộ thanh tra được phân công cắm chốt tại các khu vực thi thực hiện đúng, đủ nhiệm vụ được giao.
- Đối với Giám thị: Yêu cầu kiểm tra kỹ thẻ sinh viên, tuyệt đối không cho phép mang tài liệu, thiết bị thông tin trái phép vào phòng thi. 
- Đối với Sinh viên: Tuyệt đối tuân thủ quy chế phòng thi. Mọi trường hợp gian lận, sử dụng công nghệ cao sẽ bị lập biên bản đình chỉ thi ngay lập tức và chuyển hồ sơ về Phòng A1.1003 để hội đồng kỷ luật xử lý ở mức đình chỉ học tập có thời hạn.

Chúc các bạn sinh viên làm bài tốt.',
    '2026-05-18 07:30:00',
    'b0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001'
),

-- 10. Thông báo ID 10
(
    '60000000-0000-0000-0000-000000000010',
    'Kế hoạch rà soát và lấy ý kiến phản hồi của người học về hoạt động giảng dạy',
    'Kính gửi toàn thể sinh viên trường,

Hoạt động đánh giá chất lượng giảng dạy thông qua phiếu khảo sát trực tuyến là kênh thông tin đặc biệt quan trọng giúp nhà trường điều chỉnh, cải tiến phương pháp và nâng cao chất lượng đào tạo. 
Phòng Thanh tra giáo dục phối hợp với Phòng Đảm bảo chất lượng mở cổng khảo sát học kỳ II từ ngày 01/06/2026 đến ngày 15/06/2026. Đề nghị tất cả sinh viên đăng nhập hệ thống Portal và hoàn thành đầy đủ phiếu đánh giá trước khi xem điểm thi chính thức. Nhà trường cam kết bảo mật tuyệt đối danh tính của sinh viên tham gia khảo sát. Mọi phản ánh về kỹ thuật xin gửi về văn phòng Phòng A1.1003 (tầng 10).

Trân trọng cảm ơn sự hợp tác của các em.',
    '2026-05-28 11:20:00',
    'b0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001'
);

INSERT INTO "Announcements" (
    "id",
    "title",
    "content",
    "createdAt",
    "userId",
    "departmentId"
)
VALUES
-- =========================================================================
-- CHỈNH SỬA 5 THÔNG BÁO GỐC PHÙ HỢP VỚI PHÒNG QUAN HỆ DOANH NGHIỆP (ID: 11 - 15)
-- =========================================================================
(
    '60000000-0000-0000-0000-000000000011',
    'Thông báo chương trình Thực tập sinh tiềm năng tại các Tập đoàn đối tác',
    'Kính gửi toàn thể sinh viên năm 3 và năm cuối,

Phòng Quan hệ doanh nghiệp triển khai chương trình tuyển dụng Thực tập sinh tiềm năng đợt 1 năm 2026 phối hợp cùng các tập đoàn công nghệ và sản xuất lớn. 
Sinh viên tham gia sẽ được đào tạo thực tế và có cơ hội nhận học bổng hoặc ký hợp đồng chính thức sau thực tập. Lịch phỏng vấn chi tiết đã gửi qua email sinh viên.

Trân trọng thông báo.',
    '2026-03-01 08:00:00',
    'b0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000002'
),
(
    '60000000-0000-0000-0000-000000000012',
    'Thông báo Ngày hội Việc làm và Tuyển dụng HCMUTE Career Day 2026',
    'Kính gửi toàn thể sinh viên,

Phòng Quan hệ doanh nghiệp tổ chức Ngày hội Việc làm lớn nhất năm tại sân trường và khu trung tâm vào các ngày 15–16/05/2026. 
Sự kiện quy tụ hơn 50 doanh nghiệp trong và ngoài nước tham gia phỏng vấn trực tiếp. Kính mời các em sinh viên chuẩn bị CV và đăng ký tham gia tại văn phòng Đoàn trường trước 12/05/2026. 
Tham gia đầy đủ được tính điểm rèn luyện ngoại khóa.

Trân trọng kính mời!',
    '2026-04-20 10:00:00',
    'b0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000002'
),
(
    '60000000-0000-0000-0000-000000000013',
    'Thông báo nộp hồ sơ xét nhận Học bổng Doanh nghiệp tài trợ đợt 2',
    'Kính gửi giảng viên chủ nhiệm và sinh viên các khoa,

Phòng Quan hệ doanh nghiệp tiếp nhận hồ sơ xét duyệt Học bổng vượt khó và tài năng từ quỹ đối tác doanh nghiệp năm học 2025–2026 từ ngày 10–20/04/2026. 
Các lớp tiến hành bình bầu và gửi danh sách tổng hợp về phòng theo quy định. Không chấp nhận hồ sơ nộp trễ hạn sau thời gian trên.

Trân trọng.',
    '2026-03-28 09:00:00',
    'b0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000002'
),
(
    '60000000-0000-0000-0000-000000000014',
    'Thông báo Khóa đào tạo Kỹ năng viết CV và Phỏng vấn chinh phục nhà tuyển dụng',
    'Kính gửi toàn thể sinh viên,

Phòng Quan hệ doanh nghiệp phối hợp với chuyên gia nhân sự tổ chức chuỗi chuyên đề huấn luyện kỹ năng mềm miễn phí trong tháng 04/2026. 
Kính mời các em đăng ký tham gia trực tuyến qua cổng thông tin phòng trước ngày 10/04/2026 để ban tổ chức sắp xếp phòng học.

Trân trọng kính mời!',
    '2026-03-30 14:00:00',
    'b0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000002'
),
(
    '60000000-0000-0000-0000-000000000015',
    'Thông báo quy trình tiếp nhận và xử lý cấp Giấy chứng nhận tốt nghiệp tạm thời',
    'Kính gửi toàn thể sinh viên đủ điều kiện tốt nghiệp đợt tháng 5/2026,

Phòng Quan hệ doanh nghiệp sẽ phối hợp với Phòng Đào tạo tiến hành tiếp nhận thông tin và cấp Giấy chứng nhận tốt nghiệp tạm thời hỗ trợ các em đi xin việc từ ngày 18/05/2026. 
Đề nghị các bạn kiểm tra kỹ thông tin cá nhân trên hệ thống, chuẩn bị đầy đủ các phiếu khảo sát việc làm trước khi đến lấy chứng nhận.

Trân trọng thông báo.',
    '2026-05-10 08:30:00',
    'b0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000002'
),

-- =========================================================================
-- TẠO THÊM 5 THÔNG BÁO MỚI CHO ĐỦ SỐ LƯỢNG 10 THÔNG BÁO (ID: 16 - 20)
-- =========================================================================
(
    '60000000-0000-0000-0000-000000000016',
    'Thông báo chương trình Giao lưu và Chia sẻ kinh nghiệm cùng Cựu sinh viên thành đạt',
    'Kính gửi toàn thể sinh viên trường,

Nhằm giúp sinh viên định hướng lộ trình nghề nghiệp rõ ràng hơn, Phòng Quan hệ doanh nghiệp tổ chức buổi tọa đàm "Hành trang lập nghiệp" vào lúc 08:00 ngày 22/05/2026 tại Hội trường lớn.
Khách mời là các anh chị cựu sinh viên hiện là Giám đốc kỹ thuật, Quản lý tại các công ty đa quốc gia.

Thân mời các em tham gia đăng ký.',
    '2026-05-15 09:00:00',
    'b0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000002'
),
(
    '60000000-0000-0000-0000-000000000017',
    'Thông báo khảo sát tình hình việc làm của sinh viên sau tốt nghiệp',
    'Kính gửi các Anh/Chị cựu sinh viên vừa tốt nghiệp đợt cuối năm 2025,

Để phục vụ công tác kiểm định chất lượng giáo dục và cải tiến chương trình đào tạo, Phòng Quan hệ doanh nghiệp triển khai đợt khảo sát tình hình việc làm. 
Rất mong các Anh/Chị dành ra 3 phút để hoàn thành form khảo sát trực tuyến được gửi qua email cá nhân trước ngày 30/06/2026.

Xin chân thành cảm ơn.',
    '2026-06-01 07:30:00',
    'b0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000002'
),
(
    '60000000-0000-0000-0000-000000000018',
    'Thông báo tham quan thực tế nhà máy sản xuất (Company Tour 2026)',
    'Kính gửi sinh viên các khoa Cơ khí, Điện - Điện tử, và CNTT,

Phòng Quan hệ doanh nghiệp tổ chức chuyến đi thực tế (Company Tour) tại nhà máy Intel Products Vietnam và Esoteric Robotic vào ngày 12/06/2026. 
Số lượng giới hạn 80 sinh viên đăng ký sớm nhất. Link đăng ký sẽ mở vào lúc 12:00 ngày 08/06/2026 trên trang fanpage của phòng. Trường hỗ trợ xe đưa đón miễn phí.

Trân trọng thông báo.',
    '2026-06-05 15:00:00',
    'b0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000002'
),
(
    '60000000-0000-0000-0000-000000000019',
    'Thông báo Tuyển dụng bán thời gian (Part-time) phục vụ dự án hè từ doanh nghiệp',
    'Kính gửi các bạn sinh viên muốn tìm việc làm thêm,

Phòng Quan hệ doanh nghiệp vừa tiếp nhận thông tin từ các đối tác thương mại và dịch vụ quanh khu vực Thủ Đức đang cần tuyển hơn 200 vị trí nhân viên bán thời gian, hỗ trợ kỹ thuật và cộng tác viên dự án hè 2026. 
Mức lương hấp dẫn và thời gian linh hoạt phù hợp với lịch học học kỳ hè. Chi tiết mô tả công việc xem tại bảng tin tầng 4 tòa nhà trung tâm.

Chúc các bạn tìm được công việc phù hợp.',
    '2026-05-25 11:00:00',
    'b0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000002'
),
(
    '60000000-0000-0000-0000-000000000020',
    'Thông báo chương trình Học bổng Toàn phần Tu nghiệp ngắn hạn tại Nhật Bản',
    'Kính gửi sinh viên năm cuối xuất sắc,

Đối tác chiến lược của trường thông báo tài trợ 5 suất học bổng toàn phần khóa tu nghiệp kỹ sư chất lượng cao ngắn hạn (3 tháng) tại Tokyo, Nhật Bản khởi hành vào tháng 09/2026. 
Tiêu chí xét tuyển: Đang làm đồ án tốt nghiệp, tiếng Anh hoặc tiếng Nhật giao tiếp tốt. Hạn chót nộp hồ sơ trực tiếp tại phòng A1.402 là ngày 20/06/2026.

Trân trọng kính mời các bạn ứng tuyển.',
    '2026-06-02 14:30:00',
    'b0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000002'
);


INSERT INTO "Announcements" (
    "id",
    "title",
    "content",
    "createdAt",
    "userId",
    "departmentId"
)
VALUES
-- =========================================================================
-- KHỐI THÔNG BÁO PHÒNG KHOA HỌC & CÔNG NGHỆ (ID: 21 -> 30)
-- Người đăng: Cán bộ Phòng KH&CN (b0000000-0000-0000-0000-000000000003)
-- Phòng ban: Phòng Khoa học & Công nghệ (d0000000-0000-0000-0000-000000000003)
-- =========================================================================

-- 21. Thông báo ID 21
(
    '60000000-0000-0000-0000-000000000021',
    'Thông báo phát động và tiếp nhận đề xuất Đề tài Nghiên cứu khoa học sinh viên năm học 2026 - 2027',
    'Kính gửi toàn thể sinh viên và quý thầy cô hướng dẫn,

Phòng Khoa học & Công nghệ chính thức phát động phong trào Nghiên cứu khoa học sinh viên năm học 2026 - 2027. Đây là cơ hội lớn để các em sinh viên phát triển tư duy sáng tạo, ứng dụng lý thuyết vào thực tiễn và khẳng định năng lực bản thân.
Hệ thống sẽ mở cổng tiếp nhận thuyết minh đề tài trực tuyến từ ngày 15/07/2026 đến hết ngày 30/08/2026. Sinh viên có nhu cầu tư vấn chọn đề tài hoặc tìm giảng viên hướng dẫn có thể đến trao đổi trực tiếp tại Phòng A1.902 (tầng 9), Tòa nhà trung tâm hoặc gửi mail về địa chỉ khcn@hcmute.edu.vn.

Trân trọng thông báo.',
    '2026-06-01 08:00:00',
    'b0000000-0000-0000-0000-000000000003',
    'd0000000-0000-0000-0000-000000000003'
),

-- 22. Thông báo ID 22
(
    '60000000-0000-0000-0000-000000000022',
    'Thông báo Lịch nghiệm thu các đề tài Nghiên cứu khoa học sinh viên cấp trường năm 2025 - 2026 (Chính thức)',
    'Kính gửi các nhóm sinh viên nghiên cứu và Hội đồng khoa học,

Phòng Khoa học & Công nghệ thông báo lịch tổ chức hội đồng nghiệm thu chính thức cho các đề tài nghiên cứu khoa học của sinh viên năm học 2025 - 2026.
Thời gian diễn ra các phiên hội đồng từ ngày 22/06/2026 đến ngày 10/07/2026 tại các phòng hội thảo chuyên dụng. Các nhóm sinh viên lưu ý nộp 05 bản in báo cáo tổng kết và file thuyết trình (Slide) về văn phòng phòng tại Phòng A1.902 trước ngày 15/06/2026 để gửi tới các thành viên hội đồng phản biện.

Chúc các nhóm đạt kết quả cao.',
    '2026-06-05 09:30:00',
    'b0000000-0000-0000-0000-000000000003',
    'd0000000-0000-0000-0000-000000000003'
),

-- 23. Thông báo ID 23
(
    '60000000-0000-0000-0000-000000000023',
    'Thông báo xét chọn Đề tài xuất sắc tham dự giải thưởng sinh viên nghiên cứu khoa học cấp Bộ 2026',
    'Kính gửi Ban chủ nhiệm các Khoa và các nhóm nghiên cứu,

Phòng Khoa học & Công nghệ thông báo kế hoạch tiếp nhận hồ sơ xét chọn các công trình nghiên cứu xuất sắc nhất tham gia giải thưởng cấp Bộ năm 2026. Sinh viên nộp đơn đăng ký kèm toàn bộ hồ sơ minh chứng, bài báo đã công bố (nếu có) trực tiếp tại quầy tiếp nhận Phòng A1.902 (tầng 9), Tòa nhà trung tâm.
Thời gian tiếp nhận hồ sơ từ ngày 10/06/2026 đến hết ngày 20/06/2026. Mọi hồ sơ thiếu minh chứng hoặc nộp trễ hạn sẽ bị loại khỏi danh mục xét duyệt.

Trân trọng.',
    '2026-06-08 14:00:00',
    'b0000000-0000-0000-0000-000000000003',
    'd0000000-0000-0000-0000-000000000003'
),

-- 24. Thông báo ID 24
(
    '60000000-0000-0000-0000-000000000024',
    'Thông báo nhắc nhở tiến độ và dự kiến thu hồi kinh phí các đề tài NCKH chậm tiến độ',
    'Kính gửi các chủ nhiệm đề tài sinh viên và Giảng viên hướng dẫn,

Qua công tác kiểm tra, rà soát tiến độ định kỳ, Phòng Khoa học & Công nghệ công bố danh sách các đề tài nghiên cứu khoa học sinh viên đang bị chậm tiến độ nghiêm trọng so với hợp đồng đã ký kết.
Đề nghị các chủ nhiệm đề tài có tên trong danh sách khẩn trương nộp báo cáo giải trình kèm theo xác nhận của giảng viên hướng dẫn về văn phòng Phòng KH&CN tại Phòng A1.902 trước 17:00 ngày 25/06/2026. Quá thời hạn trên, phòng sẽ tham mưu ban hành quyết định dừng thực hiện và thu hồi kinh phí tạm ứng.

Trân trọng thông báo.',
    '2026-06-10 10:00:00',
    'b0000000-0000-0000-0000-000000000003',
    'd0000000-0000-0000-0000-000000000003'
),

-- 25. Thông báo ID 25
(
    '60000000-0000-0000-0000-000000000025',
    'Thông báo tổ chức Chuỗi bài giảng tập huấn Phương pháp nghiên cứu khoa học và Viết bài báo quốc tế',
    'Kính gửi toàn thể sinh viên yêu thích nghiên cứu,

Nhằm trang bị các kiến thức nền tảng về tư duy nghiên cứu, cách tra cứu tài liệu trong các cơ sở dữ liệu lớn (Scopus, Web of Science) và kỹ năng viết báo cáo học thuật, Phòng Khoa học & Công nghệ tổ chức khóa tập huấn chuyên đề hè 2026.
Thời gian học: Các ngày thứ Bảy từ 20/07/2026 đến 25/08/2026. Sinh viên có nhu cầu tham gia vui lòng điền form đăng ký trực tuyến hoặc nộp đơn trực tiếp về phòng tại Phòng A1.902 trước ngày 30/06/2026 để ban tổ chức chuẩn bị tài liệu và phòng máy thực hành.

Trân trọng.',
    '2026-06-09 11:15:00',
    'b0000000-0000-0000-0000-000000000003',
    'd0000000-0000-0000-0000-000000000003'
),

-- 26. Thông báo ID 26
(
    '60000000-0000-0000-0000-000000000026',
    'Thông báo tiếp nhận hồ sơ hỗ trợ kinh phí công bố bài báo khoa học quốc tế (ISI/Scopus)',
    'Kính gửi các nhà khoa học trẻ và sinh viên trường,

Nhà trường tiếp tục triển khai chính sách khuyến khích, hỗ trợ tài chính đối với các công bố khoa học có sự tham gia của sinh viên làm tác giả chính hoặc đồng tác giả.
Phòng Khoa học & Công nghệ thông báo lịch tiếp nhận đơn xin hỗ trợ kinh phí đăng bài trên các tạp chí thuộc danh mục ISI/Scopus danh tiếng. Người nộp đơn tải biểu mẫu trên website, kèm theo minh chứng bài báo đã xuất bản thành công và nộp trực tiếp tại Phòng A1.902 (tầng 9) từ ngày 12/06/2026 đến hết ngày 26/06/2026.

Trân trọng.',
    '2026-06-10 08:30:00',
    'b0000000-0000-0000-0000-000000000003',
    'd0000000-0000-0000-0000-000000000003'
),

-- 27. Thông báo ID 27
(
    '60000000-0000-0000-0000-000000000027',
    'Thông báo kết quả thẩm định và phê duyệt kinh phí bổ sung cho các đề tài nghiên cứu trọng điểm',
    'Kính gửi các chủ nhiệm đề tài nghiên cứu tiềm năng,

Phòng Khoa học & Công nghệ đã hoàn tất công tác thẩm định nội dung và phê duyệt danh sách bổ sung kinh phí đối với các đề tài nghiên cứu công nghệ có tính ứng dụng cao và có khả năng thương mại hóa sản phẩm.
Các nhóm nghiên cứu có tên trong danh sách phê duyệt sẽ nhận nguồn vốn bổ sung phục vụ mua sắm vật tư, linh kiện đặc thù. Sinh viên tra cứu trạng thái giải quyết hồ sơ trên cổng thông tin trực tuyến hoặc liên hệ trực tiếp bộ phận kế toán khoa học qua hòm thư khcn@hcmute.edu.vn để hoàn thiện thủ tục giải ngân.

Trân trọng thông báo.',
    '2026-06-07 16:00:00',
    'b0000000-0000-0000-0000-000000000003',
    'd0000000-0000-0000-0000-000000000003'
),

-- 28. Thông báo ID 28
(
    '60000000-0000-0000-0000-000000000028',
    'Thông báo kiểm tra và chuẩn hóa thông tin dữ liệu lý lịch khoa học trên hệ thống nội bộ',
    'Kính gửi các thành viên mạng lưới nghiên cứu viên và sinh viên toàn trường,

Để chuẩn bị cho công tác thống kê số liệu phục vụ kiểm định chất lượng trường và đánh giá xếp hạng đại học, Phòng Khoa học & Công nghệ yêu cầu tất cả sinh viên từng tham gia đề tài nghiên cứu thực hiện rà soát thông tin cá nhân bao gồm: Mã số sinh viên, Số ORCID, danh mục các bài báo và sở hữu trí tuệ đã khai báo.
Hạn chót phản hồi, bổ sung thông tin chỉnh sửa sai sót trực tiếp tại văn phòng Phòng KH&CN (Phòng A1.902) là trước 11:30 ngày 18/06/2026 để làm cơ sở tính điểm cộng học thuật.

Trân trọng thông báo.',
    '2026-06-04 14:20:00',
    'b0000000-0000-0000-0000-000000000003',
    'd0000000-0000-0000-0000-000000000003'
),

-- 29. Thông báo ID 29
(
    '60000000-0000-0000-0000-000000000029',
    'Thông báo mở cổng khảo sát nhu cầu cơ sở vật chất và phòng thí nghiệm phục vụ NCKH năm 2026',
    'Kính gửi toàn thể sinh viên và các nhóm nghiên cứu,

Nhằm cải thiện điều kiện làm việc, nâng cấp trang thiết bị máy móc tại các phòng thí nghiệm trọng điểm và khu vực làm việc chung (Co-working space), Phòng Khoa học & Công nghệ tổ chức đợt lấy ý kiến phản hồi quy mô toàn trường.
Ý kiến đóng góp của các em là cơ sở quan trọng để nhà trường phê duyệt danh mục đầu tư thiết bị công nghệ mới. Thời gian thực hiện khảo sát trực tuyến từ ngày 12/06/2026 đến ngày 30/06/2026. Mọi ý kiến đóng góp chi tiết xin gửi về hòm thư khcn@hcmute.edu.vn.

Phòng Khoa học & Công nghệ mong nhận được sự cộng tác của các em.',
    '2026-06-03 09:00:00',
    'b0000000-0000-0000-0000-000000000003',
    'd0000000-0000-0000-0000-000000000003'
),

-- 30. Thông báo ID 30
(
    '60000000-0000-0000-0000-000000000030',
    'Thông báo bổ sung, điều chỉnh thể lệ Cuộc thi Ý tưởng Sáng tạo Khoa học Công nghệ trẻ 2026',
    'Kính gửi các đội thi và sinh viên quan tâm,

Do có sự thay đổi từ Hội đồng cố vấn công nghệ của các tập đoàn tài trợ, Ban tổ chức cuộc thi quyết định điều chỉnh cơ cấu giải thưởng nâng cao và bổ sung thêm tiêu chí đánh giá giải pháp chuyển đổi xanh, phát triển bền vững vào vòng Chung kết.
Chi tiết thể lệ cập nhật mới và danh sách các chuyên gia hướng dẫn (Mentor) đồng hành cùng các đội thi đã được đăng tải trực tiếp trên fanpage và website của phòng. Đề nghị các nhóm trưởng lưu ý theo dõi để chuẩn bị sản phẩm demo tốt nhất. Mọi thắc mắc xin vui lòng liên hệ trực tiếp tại Phòng A1.902.

Trân trọng cảm ơn.',
    '2026-06-02 10:45:00',
    'b0000000-0000-0000-0000-000000000003',
    'd0000000-0000-0000-0000-000000000003'
);

INSERT INTO "Announcements" (
    "id",
    "title",
    "content",
    "createdAt",
    "userId",
    "departmentId"
)
VALUES
-- =========================================================================
-- KHỐI THÔNG BÁO PHÒNG QUẢN TRỊ CƠ SỞ VẬT CHẤT (ID: 81 -> 90)
-- Người đăng: Cán bộ Phòng QTCSVC (b0000000-0000-0000-0000-000000000009)
-- Phòng ban: Phòng Quản trị cơ sở vật chất (d0000000-0000-0000-0000-000000000009)
-- =========================================================================

-- 81. Thông báo ID 81
(
    '60000000-0000-0000-0000-000000000081',
    'Thông báo quy trình đăng ký mượn phòng học, giảng đường phục vụ hoạt động ôn tập nhóm và sinh hoạt ngoại khóa của sinh viên',
    'Nhằm quản lý hiệu quả tài nguyên giảng đường và tạo điều kiện không gian tốt nhất cho sinh viên tổ chức các buổi học nhóm, ôn thi cuối kỳ hoặc sinh hoạt câu lạc bộ, Phòng Quản trị cơ sở vật chất thông báo hướng dẫn quy trình mượn phòng học áp dụng từ ngày 15/06/2026:

1. Điều kiện và đối tượng được cấp phép: Tất cả các tập thể lớp chính quy, nhóm sinh viên nghiên cứu khoa học hoặc các Ban điều hành Câu lạc bộ/Đội/Nhóm trực thuộc trường có nhu cầu sử dụng phòng học ngoài giờ giảng dạy chính khóa. Người đại diện đăng ký bắt buộc phải là Lớp trưởng, Bí thư hoặc Chủ nhiệm CLB và phải chịu trách nhiệm hoàn toàn về tài sản trong phòng suốt thời gian mượn.

2. Quy trình nộp đơn đăng ký trực tuyến và trực tiếp: 
- Bước 1: Sinh viên truy cập hệ thống quản lý cơ sở vật chất trực tuyến để kiểm tra lịch trống của các phòng học tại các khu A, B, C, E.
- Bước 2: Điền mẫu đơn xin mượn phòng (ghi rõ mục đích, số lượng người tham gia, danh sách thiết bị cần sử dụng như máy chiếu, âm thanh, micro) và lấy xác nhận của Giáo viên chủ nhiệm hoặc Đoàn trường.
- Bước 3: Nộp đơn giấy trực tiếp tại quầy số 1, Phòng A1.706 (tầng 7), Tòa nhà trung tâm hoặc gửi file scan có ký số về email p.qtcsvc@hcmute.edu.vn trước tối thiểu 03 ngày làm việc.

3. Quy định khi bàn giao và hoàn trả: Sau khi đơn được phê duyệt, người đăng ký mang thẻ sinh viên đến gặp bộ phận kỹ thuật trực tòa nhà để nhận chìa khóa. Khi kết thúc buổi sinh hoạt, sinh viên có trách nhiệm tắt toàn bộ hệ thống đèn, máy lạnh, máy chiếu, thu dọn rác thải, kê lại bàn ghế đúng vị trí ban đầu và bàn giao khóa về văn phòng phòng tại tầng 7.

Trân trọng thông báo.',
    '2026-06-01 08:00:00',
    'b0000000-0000-0000-0000-000000000009',
    'd0000000-0000-0000-0000-000000000009'
),

-- 82. Thông báo ID 82
(
    '60000000-0000-0000-0000-000000000082',
    'Thông báo kế hoạch tạm ngưng cấp điện toàn diện tại Khu bài tập thực hành chất lượng cao phục vụ công tác bảo trì định kỳ hệ thống trạm biến áp',
    'Để đảm bảo hệ thống lưới điện toàn trường vận hành an toàn, ổn định, phòng chống các nguy cơ chập cháy trong mùa cao điểm nắng nóng và thực hiện công tác kiểm tra kỹ thuật định kỳ hệ thống điện thông minh, Phòng Quản trị cơ sở vật chất thông báo kế hoạch tạm cắt điện để bảo dưỡng thiết bị như sau:

1. Phạm vi ảnh hưởng: Toàn bộ hệ thống điện chiếu sáng, điện động lực, máy điều hòa không khí và mạng lưới internet nội bộ tại tất cả các phòng thí nghiệm, xưởng thực hành thuộc Khu nhà X xưởng cơ khí, Khu giảng đường chất lượng cao và hệ thống chiếu sáng hành lang phụ cận.

2. Thời gian triển khai chi tiết: Công tác cắt điện bảo trì sẽ diễn ra liên tục từ 07:30 đến 17:30 ngày Chủ Nhật (21/06/2026). Hệ thống điện có thể được tái cấp sớm hơn dự kiến nếu các kỹ sư hoàn thành hạng mục thử tải nghiệm thu trước thời hạn.

3. Khuyến cáo đối với các đơn vị: Đề nghị các Khoa chủ quản nhà xưởng bố trí cán bộ kỹ thuật sao lưu toàn bộ dữ liệu máy tính chuyên dụng, ngắt áp-tô-mát (CB) tổng của các thiết bị máy móc CNC, cánh tay robot để tránh hiện tượng sốc điện khi hệ thống được cấp điện trở lại. Trong thời gian này, nghiêm cấm sinh viên tự ý vào khu vực xưởng thực hành để làm đồ án nhằm đảm bảo an toàn lao động tối đa. Mọi thông tin khẩn cấp liên quan đến kỹ thuật điện, quý thầy cô liên hệ hotline phòng qua số 028 3722 3502.

Kính mong quý thầy cô và các em sinh viên thông cảm vì sự bất tiện này.',
    '2026-06-02 09:30:00',
    'b0000000-0000-0000-0000-000000000009',
    'd0000000-0000-0000-0000-000000000009'
),

-- 83. Thông báo ID 83
(
    '60000000-0000-0000-0000-000000000083',
    'Thông báo triển khai chiến dịch "Giảng đường xanh": Tiết kiệm năng lượng, bảo vệ tài sản công và phân loại rác thải tại nguồn năm 2026',
    'Nhằm mục đích xây dựng một không gian đại học xanh, văn minh, sạch đẹp, đồng thời nâng cao ý thức trách nhiệm của người học trong việc sử dụng tiết kiệm tài nguyên quốc gia, Phòng Quản trị cơ sở vật chất phát động chương trình hành động "Giảng đường xanh" với các nội dung cốt lõi sau:

1. Quy định sử dụng thiết bị điện trong lớp học: Sinh viên và giảng viên chỉ bật hệ thống điều hòa không khí khi nhiệt độ phòng trên 26 độ C và phòng có trên 15 người; chỉ mở hệ thống đèn tại những khu vực thiếu ánh sáng tự nhiên. Yêu cầu bắt buộc đối với người rời phòng học cuối cùng (hoặc lớp trưởng) phải thực hiện kiểm tra, ngắt hoàn toàn công tắc đèn, máy quạt, rút phích cắm máy chiếu và đóng kín hệ thống cửa sổ để phòng tránh mưa giông hắt làm hỏng thiết bị điện tử.

2. Triển khai phân loại rác thải tại nguồn: Kể từ ngày 18/06/2026, phòng tiến hành lắp đặt hệ thống thùng rác ba màu chuyên dụng tại sảnh trệt của tất cả các khu giảng đường. Sinh viên có trách nhiệm phân loại rác đúng quy định: Thùng màu xanh chứa rác hữu cơ dễ phân hủy; thùng màu vàng chứa rác tái chế (chai nhựa, lon nước, giấy vụn); thùng màu đỏ chứa rác thải sinh hoạt còn lại.

3. Biện pháp giám sát kỷ luật: Đội tự quản cơ sở vật chất phối hợp cùng lực lượng lao công sẽ tăng cường đi kiểm tra ngẫu nhiên các phòng học sau mỗi ca học. Những tập thể lớp cố tình ra về không tắt điện, để rác bừa bãi trên bàn học sẽ bị lập biên bản, gửi danh sách về Khoa chủ quản xử lý trừ điểm rèn luyện và tạm thời thu hồi quyền mượn phòng tự học trong 1 tháng. Mọi đóng góp về cảnh quan, sinh viên gửi về email p.qtcsvc@hcmute.edu.vn.

Hành động nhỏ của mỗi sinh viên sẽ góp phần tạo nên một môi trường học tập bền vững.',
    '2026-06-03 14:00:00',
    'b0000000-0000-0000-0000-000000000009',
    'd0000000-0000-0000-0000-000000000009'
),

-- 84. Thông báo ID 84
(
    '60000000-0000-0000-0000-000000000084',
    'Thông báo quy trình tiếp nhận và xử lý thông tin phản ánh sự cố kỹ thuật về thiết bị cơ sở vật chất (máy chiếu, mic, bóng đèn, điện nước) tại các giảng đường',
    'Để đảm bảo các điều kiện phục vụ công tác giảng dạy và học tập luôn trong trạng thái tốt nhất, không làm gián đoạn tiến độ truyền đạt kiến thức của thầy cô và tiếp thu của sinh viên, Phòng Quản trị cơ sở vật chất thông báo chuẩn hóa quy trình tiếp nhận thông tin phản ánh sự cố hỏng hóc thiết bị:

1. Các kênh tiếp nhận phản ánh khẩn cấp: Khi phát hiện các sự cố phát sinh trực tiếp tại phòng học như: Máy chiếu bị mờ/mất màu; micro không có tín hiệu âm thanh; máy lạnh chảy nước/không lạnh; hệ thống cửa kính, rèm cửa bị hỏng; hoặc nhà vệ sinh mất nước, sinh viên và giảng viên phản ánh qua 2 cách:
- Cách 1: Quét mã QR code được dán cố định tại góc bàn giáo viên của mỗi phòng học để điền nhanh form báo lỗi tự động (Hệ thống sẽ đẩy thông báo trực tiếp đến điện thoại của kỹ sư trực tầng).
- Cách 2: Liên hệ hotline đường dây nóng phản ứng nhanh kỹ thuật tại số 028 3722 1223.

2. Cam kết thời gian khắc phục sự cố: Đối với các lỗi kỹ thuật cơ bản liên quan đến micro, đường dây kết nối máy chiếu, bóng đèn cháy, đội ngũ kỹ thuật viên thường trực tại tầng 7 tòa nhà trung tâm có trách nhiệm có mặt tại phòng học trong vòng tối đa 10 phút kể từ khi nhận thông tin để sửa chữa hoặc thay thế thiết bị dự phòng, đảm bảo ca học tiếp tục mượt mà.

3. Xử lý các hạng mục hỏng hóc lớn: Đối với các hư hỏng kết cấu nặng cần thời gian sửa chữa trên 1 tiếng, phòng sẽ phối hợp với Phòng Đào tạo để tiến hành điều chuyển lớp học sang một phòng học dự phòng khác và phát thông báo đổi phòng khẩn cấp qua app sinh viên. Mọi văn bản đề xuất nâng cấp thiết bị dài hạn của các Khoa, kính gửi về văn phòng Phòng A1.707 hoặc email p.qtcsvc@hcmute.edu.vn.

Trân trọng thông báo.',
    '2026-06-04 10:00:00',
    'b0000000-0000-0000-0000-000000000009',
    'd0000000-0000-0000-0000-000000000009'
),

-- 85. Thông báo ID 85
(
    '60000000-0000-0000-0000-000000000085',
    'Thông báo kế hoạch tổng kiểm kê, đánh giá hiện trạng tài sản công và trang thiết bị giảng đường cuối năm học 2025 - 2026',
    'Căn cứ vào quy chế quản lý tài sản công của Nhà nước và quy định nội bộ của nhà trường, nhằm chuẩn bị cơ sở dữ liệu vật chất cho việc mua sắm bổ sung thiết bị phục vụ năm học mới, Phòng Quản trị cơ sở vật chất phối hợp cùng Phòng Kế hoạch Tài chính thành lập đoàn kiểm kê tài sản cuối năm học:

1. Nội dung và đối tượng kiểm kê: Tiến hành rà soát, đối chiếu số hiệu thẻ tài sản, kiểm tra số lượng và đánh giá chất lượng sử dụng thực tế của toàn bộ các danh mục bao gồm: Bàn ghế học sinh, bảng từ, hệ thống tủ tài liệu văn phòng, máy tính để bàn phòng lab, máy chiếu, màn chiếu, hệ thống loa âm thanh trần, tivi tương tác thông minh và các thiết bị đo đạc chuyên dụng tại tất cả các phòng ban, khoa, trung tâm trực thuộc.

2. Thời gian triển khai chi tiết: Đoàn kiểm kê sẽ làm việc liên tục từ ngày 22/06/2026 đến ngày 30/06/2026 theo lịch trình cụ thể gửi đính kèm văn bản này. Kính đề nghị các đơn vị cử cán bộ thanh lý/quản lý tài sản của đơn vị mình túc trực tại phòng làm việc để phối hợp đối soát sổ sách và ký biên bản xác nhận tại chỗ.

3. Xử lý tài sản hư hỏng, thất thoát: Đối với các thiết bị đã hết niên hạn sử dụng, hỏng hóc không thể sửa chữa, đoàn sẽ lập danh mục đề xuất thanh lý theo đúng quy trình pháp luật. Các trường hợp mất mát thiết bị không rõ lý do, đơn vị chủ quản phải làm văn bản giải trình chi tiết gửi về Phòng Quản trị cơ sở vật chất (Phòng A1.706) trước ngày 05/07/2026.

Trân trọng kính báo.',
    '2026-06-05 11:15:00',
    'b0000000-0000-0000-0000-000000000009',
    'd0000000-0000-0000-0000-000000000009'
),

-- 86. Thông báo ID 86
(
    '60000000-0000-0000-0000-000000000086',
    'Thông báo kế hoạch súc rửa hệ thống bể chứa nước ngầm, khử khuẩn mạng lưới đường ống cấp nước sinh hoạt toàn trường đợt hè 2026',
    'Để đảm bảo tiêu chuẩn vệ sinh an toàn nguồn nước sinh hoạt trực tiếp phục vụ cho cán bộ, giảng viên và sinh viên toàn trường, phòng ngừa các nguy cơ dịch bệnh lây truyền qua đường nước, Phòng Quản trị cơ sở vật chất thông báo kế hoạch thau rửa, súc xả định kỳ toàn bộ hệ thống lưu trữ nước toàn khuôn viên trường:

1. Nội dung công việc triển khai: Lực lượng công nhân kỹ thuật môi trường sẽ tiến hành xả cạn, đánh rửa cặn bẩn cơ học và phun hóa chất Cloramin B khử khuẩn đối với hệ thống bể chứa nước ngầm trung tâm, các bồn chứa nước inox đặt trên mái các tòa nhà khu A, B, C, D, E và súc xả hệ thống đường ống dẫn nước đến các khu nhà vệ sinh, vòi uống nước công cộng.

2. Thời gian tạm ngưng cấp nước: Để giảm thiểu tối đa ảnh hưởng đến sinh hoạt, công tác súc rửa bể nước sẽ được chia làm hai đợt và thực hiện vào các ngày cuối tuần:
- Đợt 1: Khu vực tòa nhà trung tâm và khu giảng đường A, B (Ngắt nước từ 13:00 ngày Thứ Bảy 20/06/2026 đến 17:00 ngày Chủ Nhật 21/06/2026).
- Đợt 2: Khu giảng đường C, D, E và khu xưởng (Ngắt nước vào tuần kế tiếp).

3. Hướng dẫn chuẩn bị đối với các đơn vị: Các căng-tin trường học, các phòng thí nghiệm có sử dụng nguồn nước liên tục cần chủ động tích trữ nước dự phòng trong xô, chậu phục vụ nhu cầu tối thiểu. Sau khi hệ thống cấp nước trở lại, nguồn nước trong 5 phút đầu tiên có thể có mùi clo nhẹ hoặc cặn sẫm màu do súc ống, đề nghị mọi người xả bỏ nước đầu trước khi sử dụng trực tiếp. Mọi thông tin phản ánh xin gửi về email p.qtcsvc@hcmute.edu.vn.

Trân trọng thông báo.',
    '2026-06-06 08:30:00',
    'b0000000-0000-0000-0000-000000000009',
    'd0000000-0000-0000-0000-000000000009'
),

-- 87. Thông báo ID 87
(
    '60000000-0000-0000-0000-000000000087',
    'Thông báo quy định nghiêm ngặt về việc bảo quản trang thiết bị và giữ gìn an toàn phòng cháy tại các không gian tự học (Co-working space) khu C',
    'Không gian tự học khu C (Co-working space) là công trình tiện ích hiện đại do nhà trường đầu tư dành riêng cho sinh viên học tập, nghiên cứu và thảo luận đồ án. Tuy nhiên, thời gian gần đây bộ phận quản lý giảng đường ghi nhận tình trạng một số nhóm sinh viên có hành vi sử dụng sai mục đích, gây hỏng hóc tài sản công. Phòng Quản trị cơ sở vật chất chấn chỉnh quy định sử dụng như sau:

1. Quy định về bảo quản thiết bị công nghệ: Sinh viên được tự do sử dụng hệ thống ổ cắm điện thông minh, cổng sạc USB và đường truyền wifi tốc độ cao tại các bàn học. Tuy nhiên, nghiêm cấm tuyệt đối các hành vi tự ý cạy phá, thay đổi cấu trúc ổ cắm, viết vẽ bậy lên mặt bàn gỗ, tường cách âm hoặc di chuyển bàn ghế cố định ra khỏi khu vực thiết kế ban đầu.

2. Quy định về an toàn cháy nổ và vệ sinh: Nghiêm cấm mang các chất dễ cháy, dung môi độc hại, các thiết bị nấu nướng mini hoặc đồ ăn có mùi nồng vào không gian tự học. Sinh viên không được phép nằm ngủ trên các dãy ghế sofa dài, không làm mất trật tự ảnh hưởng đến người xung quanh. Trước khi rời khỏi vị trí học tập, học viên phải tự giác thu dọn ly nước, khăn giấy bỏ vào thùng rác quy định.

3. Biện pháp xử lý vi phạm: Hệ thống camera an ninh AI tại khu vực tự học sẽ liên tục ghi hình và phát hiện các hành vi phá hoại tài sản. Sinh viên vi phạm sẽ bị khóa tài khoản đăng nhập thẻ từ vào không gian này vĩnh viễn, đồng thời phải bồi thường thiệt hại tài chính theo giá trị thị trường của thiết bị bị hỏng. Mọi phản ánh về tình trạng thiết bị lỗi, sinh viên đến Phòng A1.706 để báo cán bộ kỹ thuật xử lý.

Phòng Quản trị cơ sở vật chất đề nghị tất cả các em sinh viên nâng cao tinh thần tự giác.',
    '2026-06-07 16:00:00',
    'b0000000-0000-0000-0000-000000000009',
    'd0000000-0000-0000-0000-000000000009'
),

-- 88. Thông báo ID 88
(
    '60000000-0000-0000-0000-000000000088',
    'Thông báo kế hoạch cải tạo cảnh quan sư phạm, cắt tỉa cây xanh cổ thụ phòng chống gãy đổ trong mùa mưa bão năm 2026',
    'Để chủ động phòng tránh các sự cố mất an toàn do cây xanh bật gốc, gãy cành đè trúng phương tiện giao thông hoặc gây nguy hiểm cho tính mạng của cán bộ giảng viên và sinh viên trong khuôn viên trường khi bước vào cao điểm mùa mưa bão có dông lốc mạnh, Phòng Quản trị cơ sở vật chất thông báo kế hoạch cắt tỉa nhánh cây cụ thể:

1. Nội dung triển khai: Phòng phối hợp cùng công ty công viên cây xanh tiến hành khảo sát, hạ độ cao ngọn cây, cắt tỉa bớt các cành nhánh bị sâu bệnh, mục rỗng, có nguy cơ gãy đổ cao của các cây cổ thụ (như cây xà cừ, cây phượng, cây điệp) dọc theo các tuyến đường nội bộ xung quanh khu giảng đường lớn, khu vực bãi giữ xe sinh viên khu A và sân bóng đá trung tâm.

2. Thời gian và khu vực phong tỏa tạm thời: Công tác thi công dọn dẹp cành cây sẽ diễn ra từ ngày 15/06/2026 đến ngày 22/06/2026. Trong quá trình công nhân vận hành xe cẩu cắt cành, một số đoạn đường nội bộ sẽ bị phong tỏa tạm thời để tránh cành cây rơi trúng người di chuyển phía dưới.

3. Khuyến cáo an toàn đối với sinh viên: Trong thời gian thi công, sinh viên tuyệt đối không đậu đỗ xe máy ngoài phạm vi nhà xe có mái che, không đi vào các khu vực đã căng dây cảnh báo nguy hiểm. Khi trời có mưa to, gió lớn, tuyệt đối không đứng trú mưa dưới các tán cây lớn hoặc di chuyển gần khu vực có lưới điện trần. Sự hợp tác của mọi người là cơ sở để đảm bảo an toàn. Email tiếp nhận thông tin phản ánh cây xanh có nguy cơ đổ: p.qtcsvc@hcmute.edu.vn.

Trân trọng thông báo.',
    '2026-06-08 14:20:00',
    'b0000000-0000-0000-0000-000000000009',
    'd0000000-0000-0000-0000-000000000009'
),

-- 89. Thông báo ID 89
(
    '60000000-0000-0000-0000-000000000089',
    'Thông báo tiến độ thi công nâng cấp hệ thống thang máy trục chính tòa nhà trung tâm và hướng dẫn phân luồng di chuyển đối với cán bộ, sinh viên',
    'Nằm trong dự án hiện đại hóa hạ tầng kỹ thuật và nâng cao năng lực vận chuyển hành khách theo chiều đứng của Tòa nhà trung tâm, Phòng Quản trị cơ sở vật chất thông báo về việc triển khai thi công thay thế, nâng cấp bo mạch điều khiển thông minh và hệ thống cáp tải của cụm thang máy số 3 và số 4 tòa nhà trung tâm:

1. Tiến độ và kế hoạch thi công: Công trình chính thức khởi công từ ngày 12/06/2026 và dự kiến hoàn thành nghiệm thu đưa vào khai thác trở lại vào ngày 26/06/2026. Trong suốt thời gian này, cụm thang máy số 3 và số 4 sẽ ngừng hoạt động hoàn toàn để công nhân tháo dỡ thiết bị cũ trong giếng thang.

2. Phương án phân luồng di chuyển dự phòng: Để giải quyết nhu cầu di chuyển lên các tầng cao của cán bộ và học viên, nhà trường vẫn duy trì vận hành tối đa công suất của cụm thang máy số 1 và số 2. Ưu tiên tuyệt đối quyền sử dụng thang máy cho các giảng viên lớn tuổi, phụ nữ mang thai và các bạn sinh viên bị khuyết tật vận động di chuyển khó khăn.

3. Khuyến khích sử dụng thang bộ: Đối với sinh viên học tập tại các tầng thấp (từ tầng 1 đến tầng 4), nhà trường khuyến khích các em di chuyển bằng hệ thống thang bộ hành lang rộng rãi để rèn luyện sức khỏe, đồng thời giảm tải áp lực chờ đợi thang máy giờ cao điểm. Kính đề nghị các đơn vị lưu ý điều chỉnh thời gian di chuyển để không bị trễ giờ ca học. Cán bộ và sinh viên có thể đến trực tiếp Phòng A1.706 để được hướng dẫn sơ đồ phân luồng chi tiết.

Trân trọng cảm ơn sự phối hợp của quý thầy cô và các em.',
    '2026-06-09 09:00:00',
    'b0000000-0000-0000-0000-000000000009',
    'd0000000-0000-0000-0000-000000000009'
),

-- 90. Thông báo ID 90
(
    '60000000-0000-0000-0000-000000000090',
    'Thông báo quy trình đăng ký thuê mặt bằng, tổ chức gian hàng dịch vụ thương mại ngắn hạn trong khuôn viên ngày hội việc làm năm 2026',
    'Để chuẩn bị cơ sở hạ tầng mặt bằng đồng bộ, an toàn và đảm bảo tính thẩm mỹ, trật tự chung phục vụ cho sự kiện "Ngày hội việc làm và kết nối doanh nghiệp năm 2026" sắp diễn ra, Phòng Quản trị cơ sở vật chất thông báo đến ban tổ chức chương trình, các đơn vị tài trợ và các nhóm sinh viên khởi nghiệp về quy định đăng ký vị trí dựng gian hàng hội chợ như sau:

1. Quy trình đăng ký và phân bổ mặt bằng: Các đơn vị doanh nghiệp đối tác hoặc các nhóm sinh viên có nhu cầu thuê đất trống để dựng gian hàng (booth), treo bạt quảng cáo tại khu vực sân trung tâm phải nộp bản vẽ chi tiết kích thước gian hàng và sơ đồ bố trí thiết bị tải điện về Phòng Quản trị cơ sở vật chất xử lý thẩm định. Thời gian tiếp nhận hồ sơ kéo dài từ ngày 15/06/2026 đến hết ngày 25/06/2026 trực tiếp tại văn phòng Phòng A1.707 (tầng 7) hoặc qua hòm thư điện tử chính thức p.qtcsvc@hcmute.edu.vn. Phòng sẽ tiến hành bốc thăm vị trí công khai dựa trên phân nhóm ngành hàng dịch vụ.

2. Quy chuẩn kỹ thuật về đấu nối điện và an toàn: Toàn bộ hệ thống dây dẫn điện cấp cho các gian hàng phải sử dụng dây bọc cách điện đôi lõi đồng chịu tải tốt, bắt buộc lắp đặt cầu dao chống rò điện (ELCB) riêng biệt cho từng gian hàng, tuyệt đối không được tự ý đấu nối trực tiếp vào tủ điện tổng của trường khi chưa có sự giám sát của kỹ sư phòng. Các gian hàng có sử dụng thiết bị phát nhiệt hoặc trình diễn công nghệ cao phải chuẩn bị sẵn tối thiểu 01 bình chữa cháy xách tay dạng bột đặt tại vị trí dễ thấy để chủ động ứng phó sự cố tại chỗ.

3. Quy định về dọn dẹp vệ sinh môi trường: Sau khi sự kiện bế mạc, các đơn vị có thời gian tối đa là 12 tiếng để tiến hành tháo dỡ toàn bộ kết cấu khung sắt, bạt hiflex và thu gom toàn bộ rác thải công nghiệp phát sinh trong quá trình vận hành gian hàng. Đơn vị phải ký biên bản nghiệm thu bàn giao lại mặt bằng nguyên trạng sạch sẽ cho nhà trường thì mới được hoàn trả tiền quỹ cọc vệ sinh ban đầu theo hợp đồng kinh tế đã ký kết. Mọi thắc mắc kỹ thuật mặt bằng, liên hệ số máy bàn phòng 028 3722 3502 để gặp cán bộ phụ trách điều phối trực tiếp hướng dẫn mượt mà.

Phòng Quản trị cơ sở vật chất kính chúc các đơn vị chuẩn bị tốt gian hàng sự kiện.',
    '2026-06-10 10:45:00',
    'b0000000-0000-0000-0000-000000000009',
    'd0000000-0000-0000-0000-000000000009'
),
-- 91. Thông báo ID 91
(
    '60000000-0000-0000-0000-000000000091',
    'Thông báo triển khai kế hoạch xét duyệt Học bổng Khuyến khích học tập và hỗ trợ chi phí phương tiện cho sinh viên chính quy trong học kỳ vừa qua',
    'Nhằm kịp thời động viên, khuyến khích các cá nhân có thành tích xuất sắc trong học tập cũng như hỗ trợ một phần gánh nặng chi phí sinh hoạt cho người học, Phòng Tuyển sinh và Cộng tác sinh viên phối hợp cùng Ban Giám hiệu nhà trường chính thức khởi động quy trình xét duyệt Học bổng Khuyến khích học tập (HB KKHT) với các nội dung trọng tâm như sau:

1. Điều kiện xét tuyển và phân cấp học bổng: Đối tượng áp dụng là toàn bộ sinh viên hệ chính quy đang theo học tại trường có kết quả học tập đạt từ loại Khá trở lên và điểm rèn luyện (ĐRL) đạt từ 70 điểm trở lên trong học kỳ xét duyệt. Học bổng sẽ được phân chia thành 3 mức: Xuất sắc, Giỏi và Khá dựa trên quỹ học bổng được phân bổ riêng cho từng Khoa/Ngành. Lưu ý, những sinh viên bị điểm F ở bất kỳ môn học nào trong học kỳ hoặc đang trong thời gian bị kỷ luật từ mức khiển trách trở lên sẽ không được đưa vào danh sách xét duyệt.

2. Quy trình kiểm tra rà soát dữ liệu: Hệ thống dữ liệu đồng bộ từ Phòng Đào tạo và cổng quản lý sinh viên sẽ tự động kết xuất danh sách dự kiến dựa trên bộ lọc tiêu chí. Toàn bộ sinh viên có trách nhiệm đăng nhập trực tiếp vào tài khoản cá nhân để đối soát các thông tin về: Điểm trung bình học kỳ, số tín chỉ tích lũy, phân loại ĐRL. Mọi thắc mắc, khiếu nại về sai lệch thông tin dữ liệu phải được gửi bằng văn bản trực tiếp tại văn phòng Phòng A1.203 trước ngày 20/06/2026, quá thời hạn trên nhà trường sẽ chốt cổng dữ liệu để tiến hành lập danh sách chi trả ngân hàng.

3. Hình thức và thời gian giải ngân: Sau khi Hội đồng xét duyệt cấp trường ký quyết định ban hành chính thức, tiền học bổng sẽ được chuyển khoản trực tiếp 100% vào tài khoản ngân hàng liên kết của sinh viên đã đăng ký trên hệ thống quản lý. Sinh viên lưu ý không tự ý khóa hoặc hủy thẻ ngân hàng trong thời gian này để tránh sự cố lỗi giao dịch. Mọi thông tin chi tiết liên quan đến định mức chi trả của từng khóa ngành, sinh viên vui lòng liên hệ hotline phòng 028 3722 2764 để nhận được sự tư vấn và hướng dẫn cụ thể từ cán bộ phụ trách.

Phòng Tuyển sinh và Cộng tác sinh viên kính chúc các bạn sinh viên đạt kết quả cao.',
    '2026-06-11 08:00:00',
    'b0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000010'
),

-- 92. Thông báo ID 92
(
    '60000000-0000-0000-0000-000000000092',
    'Thông báo hướng dẫn quy trình tiếp nhận và thẩm định hồ sơ chính sách miễn, giảm học phí, trợ cấp xã hội học kỳ mới dành cho đối tượng đặc thù',
    'Thực hiện theo các nghị định hành chính hiện hành của Chính phủ về chính sách hỗ trợ chi phí học tập cho người học, Phòng Tuyển sinh và Cộng tác sinh viên thông báo đến toàn thể sinh viên thuộc các diện ưu tiên, hộ nghèo, cận nghèo về việc nộp hồ sơ gia hạn và mở mới chế độ miễn giảm học phí như sau:

1. Phân loại đối tượng và hồ sơ chứng thực bắt buộc: Sinh viên thuộc nhóm được miễn 100% học phí (con thương binh liệt sỹ, sinh viên khuyết tật nặng, người dân tộc thiểu số thuộc hộ nghèo/cận nghèo) và nhóm giảm 70% hoặc 50% học phí cần chuẩn bị đầy đủ các giấy tờ pháp lý bao gồm: Đơn xin miễn giảm học phí theo mẫu quy định của nhà trường, bản sao chứng thực Căn cước công dân, và Giấy chứng nhận hộ nghèo/cận nghèo năm 2026 hoặc sổ lĩnh tiền trợ cấp hàng tháng (có công chứng không quá 6 tháng). Các trường hợp thiếu giấy tờ minh chứng từ cơ quan có thẩm quyền ở địa phương sẽ bị từ chối tiếp nhận.

2. Phương thức và thời hạn nộp hồ sơ trực tiếp: Để phục vụ công tác đối soát dữ liệu tài chính kịp thời trước khi cổng đóng học phí của học kỳ tiếp theo bắt đầu, toàn bộ hồ sơ bản giấy phải được sắp xếp ngăn nắp trong túi đựng hồ sơ, ghi rõ họ tên, mã số sinh viên bên ngoài và nộp trực tiếp tại bàn tiếp nhận số 2 - Phòng A1.203 (tầng 2 tòa nhà trung tâm). Thời gian làm việc liên tục từ ngày 16/06/2026 đến hết ngày 30/06/2026 (trừ các ngày Thứ Bảy và Chủ Nhật). Nhà trường tuyệt đối không giải quyết các trường hợp nộp trễ hạn với lý do cá nhân.

3. Quy định xử lý tài chính liên quan: Những sinh viên đã nộp hồ sơ đầy đủ và được phòng thẩm định phê duyệt trạng thái hợp lệ trên hệ thống tạm thời sẽ không phải đóng phần học phí được miễn giảm trong đợt quét học phí tự động. Trường hợp sinh viên đã lỡ hoàn tất đóng toàn bộ học phí trước đó, nhà trường sẽ làm thủ tục quyết toán hoàn trả lại số tiền thừa vào tài khoản cá nhân vào cuối học kỳ. Mọi vướng mắc về thủ tục pháp lý, vui lòng liên hệ qua hòm thư điện tử chính thức p.cthssv@hcmute.edu.vn để được giải đáp.

Phòng Tuyển sinh và Cộng tác sinh viên thông báo để sinh viên chủ động thực hiện.',
    '2026-06-11 08:45:00',
    'b0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000010'
),

-- 93. Thông báo ID 93
(
    '60000000-0000-0000-0000-000000000093',
    'Thông báo về việc tổ chức Tuần sinh hoạt công dân - Giáo dục chính trị và quy chế rèn luyện giữa khóa dành cho toàn thể sinh viên năm thứ hai và năm thứ ba',
    'Căn cứ theo kế hoạch đào tạo toàn diện và định hướng tư tưởng, đạo đức lối sống cho người học trong môi trường giáo dục đại học, Phòng Tuyển sinh và Cộng tác sinh viên thông báo lịch học tập tập trung cho chuyên đề "Tuần sinh hoạt công dân - Giáo dục chính trị" năm học 2026 cụ thể như sau:

1. Nội dung chương trình và giảng viên chuyên trách: Chuỗi chuyên đề đợt này sẽ tập trung phổ biến các nội dung cốt lõi bao gồm: Cập nhật các sửa đổi mới nhất trong quy chế đào tạo và chuẩn đầu ra ngoại ngữ, tin học; giáo dục phòng chống tội phạm công nghệ cao và các tệ nạn xã hội xâm nhập học đường; định hướng tư duy khởi nghiệp sáng tạo. Bài giảng sẽ do đại diện Ban Giám hiệu, đại diện các cơ quan ban ngành pháp luật và các chuyên gia tâm lý, doanh nghiệp trực tiếp điều phối, chia sẻ.

2. Hình thức triển khai và lịch phân bổ theo Khoa: Chương trình được tổ chức theo hình thức kết hợp giữa học trực tiếp tại Hội trường lớn tòa nhà Trung tâm và làm bài kiểm tra trắc nghiệm thu hoạch trực tuyến trên hệ thống quản lý học tập (LMS). Sinh viên theo dõi lịch phân bổ ca học chi tiết theo từng Khoa chuyên môn được đính kèm dưới thông báo này để đi học đúng giờ, đúng trang phục quy định (áo đồng phục trường hoặc áo sơ mi lịch sự), nghiêm túc chấp hành việc quét mã QR điểm danh tại cửa ra vào.

3. Đánh giá kết quả và chế tài xử lý vi phạm: Việc tham gia đầy đủ và hoàn thành bài đánh giá thu hoạch đạt điểm từ Trung bình trở lên là điều kiện bắt buộc để tính điểm rèn luyện ở mục Điểm nhận thức chính trị (tối đa 10 điểm). Những sinh viên vắng mặt không có lý do chính đáng hoặc không hoàn thành bài thi trắc nghiệm trên hệ thống LMS đúng hạn sẽ bị nhận mức ĐRL loại Yếu cho hạng mục tương ứng, đồng thời bị đưa vào danh sách nhắc nhở xem xét tư cách khen thưởng cuối năm.

Phòng Tuyển sinh và Cộng tác sinh viên yêu cầu các lớp trưởng đôn đốc thành viên tham gia nghiêm túc.',
    '2026-06-11 09:30:00',
    'b0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000010'
),

-- 94. Thông báo ID 94
(
    '60000000-0000-0000-0000-000000000094',
    'Thông báo tuyển dụng Đại sứ sinh viên tham gia Đội ngũ tư vấn tuyển sinh và truyền thông hướng nghiệp đại học năm học 2026 - 2027',
    'Để chuẩn bị cho chiến dịch quảng bá hình ảnh, tư vấn hướng nghiệp và hỗ trợ công tác tuyển sinh đại học hệ chính quy cho mùa tuyển sinh mới đạt hiệu quả tối ưu, Phòng Tuyển sinh và Cộng tác sinh viên thông báo phát động chương trình tuyển chọn thành viên Đội hình Đại sứ sinh viên (Student Ambassadors) với thông tin chi tiết như sau:

1. Tiêu chí tuyển chọn ứng viên: Chương trình chào đón tất cả sinh viên từ năm nhất đến năm cuối có tinh thần trách nhiệm cao, năng nổ, nhiệt huyết. Ưu tiên những ứng viên sở hữu các kỹ năng mềm tốt như giao tiếp tự tin trước đám đông, xử lý tình huống linh hoạt, có khả năng nói tiếng Anh giao tiếp hoặc có năng khiếu nghệ thuật, quay dựng video ngắn, quản trị fanpage. Sinh viên tham gia phải đảm bảo có kết quả học tập kỳ gần nhất đạt loại Khá trở lên và điểm rèn luyện từ 80 điểm.

2. Mô tả nhiệm vụ và quyền lợi được hưởng: Các đại sứ sinh viên sau khi trúng tuyển sẽ được tập huấn chuyên sâu về cẩm nang quy chế tuyển sinh, sơ đồ ngành nghề của trường. Nhiệm vụ chính bao gồm: Tham gia hỗ trợ trực tiếp tại các gian hàng tư vấn ở các trường THPT; tiếp đón phụ huynh học sinh đến tham quan trường; trực tổng đài giải đáp thắc mắc trực tuyến. Quyền lợi nhận được gồm có: Được cấp trang phục đại sứ riêng biệt, hỗ trợ phụ cấp đi lại, ăn trưa theo ngày công tác, và được cộng điểm rèn luyện ưu tiên ở mục Hoạt động đóng góp cho cộng đồng.

3. Quy trình đăng ký và phỏng vấn trực tiếp: Sinh viên có nhu cầu thử sức vui lòng điền đầy đủ thông tin cá nhân và tải lên CV tóm tắt năng lực qua liên kết form trực tuyến của phòng trước 17h00 ngày 22/06/2026. Vòng phỏng vấn trực tiếp đánh giá tác phong và phản xạ ứng biến sẽ được tổ chức vào cuối tuần tại phòng họp A1.204. Danh sách các bạn vượt qua vòng sơ loại sẽ được gửi qua email trường cấp để thông báo mốc thời gian cụ thể.

Phòng Tuyển sinh và Cộng tác sinh viên rất mong chờ những gương mặt đại diện năng động.',
    '2026-06-11 10:15:00',
    'b0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000010'
),

-- 95. Thông báo ID 95
(
    '60000000-0000-0000-0000-000000000095',
    'Thông báo về việc rà soát, chuẩn hóa dữ liệu hồ sơ cá nhân và cập nhật thông tin cư trú bắt buộc trên cổng thông tin sinh viên toàn trường',
    'Nhằm mục đích hoàn thiện cơ sở dữ liệu quốc gia về giáo dục đại học, đồng thời phục vụ cho công tác quản lý thông tin cư trú, tạm trú, cấp phát thẻ sinh viên tích hợp và xác nhận hồ sơ vay vốn tín dụng, Phòng Tuyển sinh và Cộng tác sinh viên đề nghị toàn thể sinh viên tiến hành kiểm tra, chuẩn hóa dữ liệu cá nhân theo các quy định sau:

1. Các trường dữ liệu cần rà soát và bổ sung: Sinh viên bắt buộc phải đăng nhập vào hệ thống quản lý dữ liệu trực tuyến bằng tài khoản nội bộ và truy cập vào mục "Cập nhật hồ sơ". Tại đây, cần rà soát chính xác các mục thông tin cốt lõi bao gồm: Số định danh cá nhân (CCCD), ngày cấp, nơi cấp; địa chỉ thường trú theo sổ hộ khẩu cũ hoặc cơ sở dữ liệu cư trú mới; địa chỉ tạm trú hiện tại (ghi rõ tên nhà trọ, số phòng, tên đường, phường/xã, quận/huyện); và số điện thoại liên lạc của phụ huynh trong trường hợp khẩn cấp.

2. Quy định tải lên ảnh minh chứng pháp lý: Hệ thống yêu cầu sinh viên phải đính kèm bản quét (scan) hoặc ảnh chụp rõ nét hai mặt của Căn cước công dân (định dạng file .jpg hoặc .pdf, dung lượng không quá 2MB, không bị mờ góc hoặc lóa sáng). Đối với những sinh viên thuộc diện nam công dân trong độ tuổi thực hiện nghĩa vụ quân sự, bắt buộc phải bổ sung ảnh chụp "Giấy chứng nhận đăng ký nghĩa vụ quân sự" do Ban chỉ huy quân sự cấp huyện nơi cư trú cấp để nhà trường làm căn cứ xuất văn bản tạm hoãn nghĩa vụ theo quy định.

3. Thời hạn thực hiện và hình thức chế tài: Thời gian dành cho việc cập nhật trực tuyến bắt đầu từ ngày thông báo đến hết 23h59 ngày 28/06/2026. Sau thời gian này, hệ thống sẽ tự động khóa chức năng chỉnh sửa. Những cá nhân không hoàn thành hoặc cố tình khai báo thông tin sai sự thật sẽ phải chịu hoàn toàn trách nhiệm khi xảy ra sai sót trong việc cấp phát văn bằng tốt nghiệp, đồng thời phòng sẽ tạm đóng quyền đăng ký các dịch vụ hành chính công trực tuyến tại trường đối với các tài khoản vi phạm này.

Phòng Tuyển sinh và Cộng tác sinh viên yêu cầu sinh viên nghiêm túc thực hiện để bảo vệ quyền lợi cá nhân.',
    '2026-06-11 11:00:00',
    'b0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000010'
),

-- 96. Thông báo ID 96
(
    '60000000-0000-0000-0000-000000000096',
    'Thông báo về việc gia hạn thời gian đóng kinh phí và bổ sung hồ sơ tham gia Bảo hiểm y tế bắt buộc đối với sinh viên chưa hoàn thành nghĩa vụ năm học',
    'Bảo hiểm y tế (BHYT) là hình thức bảo hiểm bắt buộc được luật pháp quy định nhằm chăm sóc sức khỏe ban đầu cho học sinh, sinh viên tại các cơ sở giáo dục. Qua số liệu rà soát phối hợp cùng Cơ quan Bảo hiểm xã hội quận, Phòng Tuyển sinh và Cộng tác sinh viên nhận thấy hiện vẫn còn một bộ phận lớn sinh viên chưa hoàn tất việc tham gia. Do đó phòng thông báo đợt gia hạn cuối cùng như sau:

1. Đối tượng áp dụng và mức phí đóng gia hạn: Toàn bộ sinh viên chưa thực hiện gia hạn thẻ BHYT tại trường hoặc chưa cập nhật mã thẻ BHYT thuộc diện hộ nghèo, cận nghèo, hoặc thân nhân quân đội (được địa phương cấp thẻ miễn phí) đều phải thực hiện đợt rà soát này. Số tiền đóng bảo hiểm được tính theo quy định chung của nhà nước cho số tháng còn lại của niên độ. Phương thức đóng tiền được thực hiện hoàn toàn qua cổng thanh toán trực tuyến của ngân hàng đối tác hoặc quét mã QR tĩnh của nhà trường, tuyệt đối không thu tiền mặt tại văn phòng.

2. Quy trình minh chứng đối với sinh viên đã có thẻ tại địa phương: Đối với các bạn sinh viên đã được cấp thẻ BHYT theo các nhóm đối tượng đặc thù tại quê nhà và còn giá trị sử dụng đến hết năm, yêu cầu bắt buộc phải chụp ảnh thẻ BHYT rõ mã số BHXH và tải lên phân hệ "Khai báo Bảo hiểm y tế" trên trang cá nhân của mình. Việc này giúp nhà trường loại bỏ tên sinh viên khỏi danh sách nợ bảo hiểm, tránh việc hệ thống tiếp tục gửi thông báo nhắc nhở đôn đốc làm ảnh hưởng đến quá trình học tập.

3. Thời hạn cuối và hình thức kỷ luật quy chế: Cổng tiếp nhận hồ sơ minh chứng và thanh toán kinh phí sẽ mở đến trước 16h30 ngày 25/06/2026. Những sinh viên cố tình trốn tránh, không tham gia BHYT bắt buộc mà không có lý do chính đáng sẽ bị phòng lập danh sách gửi về các Khoa chuyên trách để hạ một bậc phân loại điểm rèn luyện tại mục "Chấp hành pháp luật và nội quy nhà trường", đồng thời tạm dừng xét duyệt mọi danh hiệu thi đua, khen thưởng hoặc học bổng tài trợ trong học kỳ hiện tại.

Phòng Tuyển sinh và Cộng tác sinh viên đề nghị sinh viên khẩn trương hoàn thành.',
    '2026-06-11 13:30:00',
    'b0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000010'
),

-- 97. Thông báo ID 97
(
    '60000000-0000-0000-0000-000000000097',
    'Thông báo chương trình học bổng doanh nghiệp đối tác và cơ hội thực tập, phát triển nghề nghiệp toàn diện năm 2026 dành cho sinh viên khối kỹ thuật',
    'Nằm trong chuỗi chiến lược hợp tác toàn diện giữa nhà trường và các tập đoàn công nghệ, doanh nghiệp sản xuất đa quốc gia hàng đầu, Phòng Tuyển sinh và Cộng tác sinh viên vinh hạnh làm đầu mối kết nối, chính thức công bố chương trình Học bổng Doanh nghiệp đối tác năm 2026 với cơ cấu giải thưởng và lộ trình cam kết tuyển dụng hấp dẫn:

1. Cơ cấu số lượng và giá trị học bổng tài trợ: Trong đợt này, các đơn vị đối tác chiến lược ký kết tài trợ tổng cộng 30 suất học bổng toàn phần (trị giá tương đương 100% học phí một năm học) và 50 suất học bổng bán phần (hỗ trợ chi phí nghiên cứu và sinh hoạt phí). Đi kèm với phần thưởng tiền mặt, những sinh viên nhận học bổng xuất sắc sẽ được đặc cách tham gia trực tiếp vào các dự án nghiên cứu và phát triển sản phẩm thực tế của doanh nghiệp dưới sự dẫn dắt của các kỹ sư trưởng giàu kinh nghiệm.

2. Tiêu chuẩn nộp hồ sơ dành cho ứng viên tiềm năng: Chương trình hướng đến đối tượng là sinh viên năm thứ ba và năm cuối thuộc các chuyên ngành công nghệ, kỹ thuật. Yêu cầu có điểm trung bình tích lũy (GPA) tính đến thời điểm hiện tại đạt từ 3.2/4.0 trở lên, có khả năng đọc hiểu tài liệu kỹ thuật bằng tiếng Anh tốt (ưu tiên ứng viên có chứng chỉ TOEIC từ 650 hoặc IELTS từ 5.5 trở lên). Những sinh viên từng đạt giải thưởng tại các cuộc thi học thuật, nghiên cứu khoa học cấp khoa/trường hoặc các cuộc thi lập trình là một lợi thế cạnh tranh rất lớn.

3. Bộ hồ sơ đăng ký và quy trình thẩm định hai vòng: Hồ sơ bản mềm (softcopy) bao gồm: CV bằng tiếng Anh, bảng điểm học tập có xác nhận điện tử của phòng đào tạo, và một bài luận ngắn (không quá 500 từ) trình bày về mục tiêu phát triển nghề nghiệp tương lai. Toàn bộ tài liệu gửi về địa chỉ email phòng trước ngày 24/06/2026. Các hồ sơ vượt qua vòng thẩm định lý lịch sẽ được phòng liên hệ trực tiếp để tham gia vòng phỏng vấn chuyên sâu cùng hội đồng chuyên gia của doanh nghiệp tổ chức tại phòng họp tòa trung tâm.

Phòng Tuyển sinh và Cộng tác sinh viên chúc các bạn tự tin nắm bắt cơ hội nâng tầm bản thân.',
    '2026-06-11 14:15:00',
    'b0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000010'
),

-- 98. Thông báo ID 98
(
    '60000000-0000-0000-0000-000000000098',
    'Thông báo mở cổng hệ thống tự đánh giá và nộp minh chứng Điểm rèn luyện trực tuyến của sinh viên áp dụng cho học kỳ hiện tại',
    'Điểm rèn luyện là một trong những chỉ số pháp lý quan trọng phản ánh kết quả rèn luyện đạo đức, tư tưởng và kỹ năng xã hội của sinh viên, được sử dụng làm căn cứ xét học bổng, xét tốt nghiệp và khen thưởng. Phòng Tuyển sinh và Cộng tác sinh viên thông báo quy trình và các mốc mốc mốc thời gian bắt buộc cho việc tự đánh giá điểm rèn luyện trực tuyến cụ thể như sau:

1. Quy trình thực hiện đánh giá ba cấp: Quy trình gồm 3 bước tuần tự bắt buộc. Đầu tiên, sinh viên đăng nhập vào hệ thống quản lý tích hợp, tiến hành tích chọn tự chấm điểm cho bản thân ở từng mục tiêu chí dựa trên khung quy định. Bước hai, ban cán sự lớp phối hợp cùng thầy cô Cố vấn học tập tổ chức họp lớp họp trực tuyến hoặc trực tiếp để xem xét, thông qua bảng điểm rèn luyện của từng thành viên, tiến hành bỏ phiếu thống nhất. Bước ba, Hội đồng đánh giá cấp Khoa rà soát và phê duyệt dữ liệu cuối cùng gửi về phòng.

2. Quy chuẩn về việc chuẩn bị và tải lên file minh chứng: Đối với các hạng mục điểm được cộng thêm ngoài khung học tập cố định (như tham gia hoạt động tình nguyện, đạt giải cuộc thi, hiến máu nhân đạo, tham gia hội thảo khoa học), sinh viên bắt buộc phải chụp ảnh rõ nét hoặc quét giấy chứng nhận, giấy khen và tải lên hệ thống tại mục tương ứng. Hệ thống chỉ công nhận điểm cộng khi có file minh chứng đi kèm hợp lệ. Các trường hợp khai khống thông tin mà không có giấy tờ đối soát sẽ bị hệ thống tự động loại bỏ điểm cộng mà không thông báo trước.

3. Thời hạn đóng cổng dữ liệu và xử lý chậm trễ: Cổng tự đánh giá dành cho sinh viên sẽ chính thức mở từ ngày 15/06/2026 và tự động đóng vào lúc 17h00 ngày 25/06/2026 để chuyển giao dữ liệu cho cấp lớp và khoa đánh giá. Những sinh viên không thực hiện tự chấm điểm trên hệ thống đúng thời hạn quy định sẽ bị mặc định nhận mức điểm rèn luyện loại Trung bình hoặc Yếu tùy thuộc vào lịch sử vi phạm, đồng thời mất quyền khiếu nại về sau. Mọi thắc mắc kỹ thuật hệ thống, vui lòng liên hệ bàn trực tại phòng A1.204 để được hỗ trợ kỹ thuật trực tiếp.

Phòng Tuyển sinh và Cộng tác sinh viên đề nghị ban cán sự các lớp đôn đốc thực hiện nghiêm túc.',
    '2026-06-11 15:00:00',
    'b0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000010'
),

-- 99. Thông báo ID 99
(
    '60000000-0000-0000-0000-000000000099',
    'Thông báo phát động phong trào đề cử, xét chọn danh hiệu "Sinh viên tiêu biểu" và gương mặt trẻ xuất sắc trong hoạt động cộng đồng năm học 2025 - 2026',
    'Nhằm mục đích tôn vinh các cá nhân có thành tích xuất sắc, có đóng góp tích cực và tầm ảnh hưởng sâu rộng trong công tác phong trào, hoạt động tình nguyện vì cộng đồng cũng như đạt kết quả cao trong nghiên cứu khoa học, Phòng Tuyển sinh và Cộng tác sinh viên phối hợp cùng Ban Chấp hành Đoàn Thanh niên - Hội Sinh viên trường chính thức phát động phong trào xét chọn danh hiệu "Sinh viên tiêu biểu" cấp trường với nội dung chi tiết như sau:

1. Tiêu chuẩn xét duyệt danh hiệu cao quý: Ứng viên tham gia xét chọn phải đạt được sự cân bằng xuất sắc giữa học tập và rèn luyện. Cụ thể: Điểm trung bình học tập cả năm học đạt từ 3.2/4.0 trở lên (đối với khối ngành Kinh tế, Ngôn ngữ) hoặc từ 3.0/4.0 trở lên (đối với khối ngành Kỹ thuật); Điểm rèn luyện đạt từ 85 điểm trở lên (loại Xuất sắc). Ngoài ra, ứng viên bắt buộc phải là nhân tố nòng cốt tham gia tổ chức tối thiểu 02 chiến dịch tình nguyện lớn (như Tiếp sức mùa thi, Mùa hè xanh) hoặc có đề tài nghiên cứu khoa học được nghiệm thu cấp trường trở lên.

2. Cấu trúc hồ sơ đề cử và tài liệu đính kèm: Sinh viên tự nguyện nộp hồ sơ hoặc được tập thể lớp, Khoa đề cử chuẩn bị bộ tài liệu bao gồm: Đơn đăng ký xét chọn danh hiệu theo mẫu đính kèm; Bản khai thành tích chi tiết cá nhân có chữ ký xác nhận của Ban chủ nhiệm Khoa quản lý; Bảng điểm học tập và rèn luyện chính thức có đóng dấu đỏ mộc; Bản sao các loại bằng khen, giấy chứng nhận thành tích đạt được trong năm học. Toàn bộ hồ sơ bản giấy được xếp gọn gàng trong bì đựng hồ sơ chuyên dụng và nộp về phòng A1.203.

3. Lộ trình thẩm định và lễ tuyên dương chính thức: Thời gian tiếp nhận hồ sơ kéo dài từ ngày 18/06/2026 đến hết ngày 30/06/2026. Hội đồng thi đua khen thưởng cấp trường sẽ tiến hành họp rà soát, thẩm định hồ sơ công khai và công bố danh sách đạt danh hiệu trên trang chủ nhà trường. Những cá nhân xuất sắc được vinh danh sẽ nhận được Bằng khen của Hiệu trưởng, kỷ niệm chương cùng phần thưởng tiền mặt giá trị cao tại Đêm hội tuyên dương Sinh viên tiêu biểu tổ chức vào dịp khai giảng năm học mới.

Phòng Tuyển sinh và Cộng tác sinh viên khuyến khích các cá nhân có thành tích xuất sắc mạnh dạn tự tin nộp hồ sơ đăng ký.',
    '2026-06-11 15:45:00',
    'b0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000010'
),

-- 100. Thông báo ID 100
(
    '60000000-0000-0000-0000-000000000100',
    'Thông báo phân công nhiệm vụ phối hợp và chuẩn bị cơ sở vật chất phục vụ công tác tiếp nhận hồ sơ nhập học tập trung dành cho Tân sinh viên khóa mới',
    'Để chuẩn bị chu đáo, chuyên nghiệp và khoa học cho công tác tiếp đón, hướng dẫn thủ tục nhập học trực tiếp cho hàng ngàn tân sinh viên trúng tuyển vào trường trong kỳ tuyển sinh đại học hệ chính quy sắp tới, Phòng Tuyển sinh và Cộng tác sinh viên thông báo kế hoạch phân công nhân sự và điều phối hạ tầng cơ sở phục vụ chuỗi ngày hội nhập học như sau:

1. Bố trí không gian và sơ đồ dây chuyền tiếp nhận: Toàn bộ quy trình nhập học trực tiếp sẽ được tổ chức tập trung tại khu vực Sảnh lớn tòa nhà Trung tâm hành chính. Không gian được chia cắt thành các phân khu chức năng riêng biệt theo mô hình khép kín một chiều bao gồm: Khu vực tra cứu danh sách trúng tuyển; Khu vực phát và hướng dẫn ghi tờ khai lý lịch; Khu vực bàn thu hồ sơ gốc (phân chia theo từng Khoa); Khu vực ngân hàng thu học phí và các khoản bảo hiểm; Khu vực đo may đồng phục và đăng ký ký túc xá. Yêu cầu các đơn vị phụ trách lắp đặt đầy đủ biển chỉ dẫn rõ ràng.

2. Phân công nhân sự và thành lập tổ hỗ trợ: Phòng thiết lập 5 tổ công tác chuyên trách hoạt động liên tục dưới sự điều phối trực tiếp của Trưởng phòng. Lực lượng nòng cốt bao gồm các chuyên viên của phòng phối hợp cùng 100 tình nguyện viên thuộc Đội ngũ Đại sứ sinh viên. Nhiệm vụ chính là túc trực tại các bàn kỹ thuật để giải quyết các hồ sơ bị lỗi thông tin, hỗ trợ phụ huynh làm thủ tục nhanh chóng, phân luồng giao thông tránh ùn tắc cục bộ tại sảnh chính tòa nhà vào các khung giờ cao điểm sáng và chiều.

3. Chế độ thông tin trực hotline hỗ trợ từ xa: Song song với công tác chuẩn bị tại hiện trường, bộ phận truyền thông của phòng có nhiệm vụ duy trì vận hành ổn định các kênh tư vấn trực tuyến bao gồm hệ thống chatbox fanpage và hai số điện thoại máy bàn đường dây nóng: 028 3722 2764 và 028 3722 1223. Cán bộ trực hotline có trách nhiệm giải đáp tận tình, mượt mà mọi thắc mắc của thí sinh về quy trình rút nộp hồ sơ, giấy chứng nhận kết quả thi, và các giấy tờ xác nhận đối tượng ưu tiên để bảo đảm không có thí sinh nào bị bỏ lại phía sau do thiếu thông tin.

Phòng Tuyển sinh và Cộng tác sinh viên đề nghị toàn thể cán bộ, chuyên viên và các đội hình phối hợp nghiêm túc triển khai nhiệm vụ.',
    '2026-06-11 16:30:00',
    'b0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000010'
);
-- 1. Giáo vụ Khoa CNTT (b000...016) – Khoa Công nghệ Thông tin

-- =================================================================
-- COMMENTS CHO 3 ANNOUNCEMENT NGÀY 20/12/2025
-- Mỗi cái 10 comments + 1 comment vi phạm (spam/quảng cáo)
-- =================================================================

-- Announcement 60000000-0000-0000-0000-000000000007 (Quản trị CSVC - Tổng vệ sinh khuôn viên)
INSERT INTO
    "Comments" (
        "id",
        "targetId",
        "targetType",
        "userId",
        "content",
        "createdAt"
    )
VALUES (
        '40000000-0000-0000-0000-000000000001',
        '60000000-0000-0000-0000-000000000007',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000001',
        'Em đăng ký tham gia dọn vệ sinh ạ, tính giờ ngoại khóa đúng không anh/chị?',
        '2025-12-20 10:15:00'
    ),
    (
        '40000000-0000-0000-0000-000000000002',
        '60000000-0000-0000-0000-000000000007',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000002',
        'Cả trường cùng dọn đẹp quá, năm nào cũng mong hoạt động này!',
        '2025-12-20 10:40:00'
    ),
    (
        '40000000-0000-0000-0000-000000000003',
        '60000000-0000-0000-0000-000000000007',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000005',
        'Đăng ký ở Đoàn trường hay ở phòng CSVC vậy ạ?',
        '2025-12-20 11:20:00'
    ),
    (
        '40000000-0000-0000-0000-000000000004',
        '60000000-0000-0000-0000-000000000007',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000010',
        'Em mang theo găng tay và túi rác được không ạ?',
        '2025-12-20 12:05:00'
    ),
    (
        '40000000-0000-0000-0000-000000000005',
        '60000000-0000-0000-0000-000000000007',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000011',
        'Hoạt động ý nghĩa lắm, vừa sạch trường vừa gắn kết mọi người.',
        '2025-12-20 13:30:00'
    ),
    (
        '40000000-0000-0000-0000-000000000006',
        '60000000-0000-0000-0000-000000000007',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000013',
        'Có phát nước uống và khẩu trang không ạ?',
        '2025-12-20 14:10:00'
    ),
    (
        '40000000-0000-0000-0000-000000000007',
        '60000000-0000-0000-0000-000000000007',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000020',
        'Em sẽ rủ cả lớp cùng tham gia cho đông vui.',
        '2025-12-20 15:45:00'
    ),
    (
        '40000000-0000-0000-0000-000000000008',
        '60000000-0000-0000-0000-000000000007',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000030',
        'Chụp ảnh check-in xong đăng story nha mọi người ',
        '2025-12-20 17:20:00'
    ),
    (
        '40000000-0000-0000-0000-000000000009',
        '60000000-0000-0000-0000-000000000007',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000031',
        'Cảm ơn Phòng CSVC luôn quan tâm môi trường trường.',
        '2025-12-20 19:00:00'
    ),
    -- Comment vi phạm (spam quảng cáo)
    (
        '40000000-0000-0000-0000-000000000010',
        '60000000-0000-0000-0000-000000000007',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000040',
        'Cần dọn vệ sinh nhà cửa, văn phòng giá rẻ liên hệ em nha Zalo 0368xxx999 dịch vụ uy tín nhanh gọn!!!',
        '2025-12-21 00:30:00'
    );

-- Announcement 60000000-0000-0000-0000-000000000017 (DVSV - Lịch hoạt động căng tin dịp Tết)
INSERT INTO
    "Comments" (
        "id",
        "targetId",
        "targetType",
        "userId",
        "content",
        "createdAt"
    )
VALUES (
        '40000000-0000-0000-0000-000000000011',
        '60000000-0000-0000-0000-000000000017',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000003',
        'Nghỉ Tết sớm vậy em còn chưa kịp mua đồ ăn dự trữ ',
        '2025-12-20 09:10:00'
    ),
    (
        '40000000-0000-0000-0000-000000000012',
        '60000000-0000-0000-0000-000000000017',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000006',
        'Căng tin nghỉ 4 ngày hơi buồn, không có chỗ ăn trưa.',
        '2025-12-20 09:45:00'
    ),
    (
        '40000000-0000-0000-0000-000000000013',
        '60000000-0000-0000-0000-000000000017',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000012',
        'Cảm ơn Trung tâm đã thông báo trước, em sẽ mua đồ ăn sẵn.',
        '2025-12-20 10:30:00'
    ),
    (
        '40000000-0000-0000-0000-000000000014',
        '60000000-0000-0000-0000-000000000017',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000015',
        'Siêu thị mini còn mở đến 30/12 là ổn rồi ạ.',
        '2025-12-20 11:15:00'
    ),
    (
        '40000000-0000-0000-0000-000000000015',
        '60000000-0000-0000-0000-000000000017',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000021',
        'Có bán bánh chưng, giò chả Tết không anh/chị?',
        '2025-12-20 12:40:00'
    ),
    (
        '40000000-0000-0000-0000-000000000016',
        '60000000-0000-0000-0000-000000000017',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000022',
        'Năm ngoái cũng nghỉ vậy, em quen rồi.',
        '2025-12-20 14:00:00'
    ),
    (
        '40000000-0000-0000-0000-000000000017',
        '60000000-0000-0000-0000-000000000017',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000030',
        'Cảm ơn thông báo chi tiết, chúc anh chị nghỉ lễ vui vẻ!',
        '2025-12-20 15:30:00'
    ),
    (
        '40000000-0000-0000-0000-000000000018',
        '60000000-0000-0000-0000-000000000017',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000031',
        'Mai đi mua mì gói dự trữ đây ',
        '2025-12-20 17:10:00'
    ),
    (
        '40000000-0000-0000-0000-000000000019',
        '60000000-0000-0000-0000-000000000017',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000033',
        'Căng tin nghỉ thì tụi em nấu ăn trong KTX được không ạ?',
        '2025-12-20 19:20:00'
    ),
    -- Comment vi phạm (spam)
    (
        '40000000-0000-0000-0000-000000000020',
        '60000000-0000-0000-0000-000000000017',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000040',
        'BÁN BÁNH CHƯNG GIÒ CHẢ TẾT GIÁ SỈ – SHIP TOÀN QUỐC – LIÊN HỆ NGAY 090xxxxxxx',
        '2025-12-21 01:45:00'
    );

-- Announcement 60000000-0000-0000-0000-000000000032 (Quản lý KTX - Tổng vệ sinh ký túc xá cuối năm)
INSERT INTO
    "Comments" (
        "id",
        "targetId",
        "targetType",
        "userId",
        "content",
        "createdAt"
    )
VALUES (
        '40000000-0000-0000-0000-000000000021',
        '60000000-0000-0000-0000-000000000032',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000004',
        'Dọn vệ sinh KTX cuối năm là truyền thống rồi, em tham gia liền!',
        '2025-12-20 10:30:00'
    ),
    (
        '40000000-0000-0000-0000-000000000022',
        '60000000-0000-0000-0000-000000000032',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000016',
        'Phòng em sẽ dọn sạch sẽ trước 28/12 luôn ạ.',
        '2025-12-20 11:00:00'
    ),
    (
        '40000000-0000-0000-0000-000000000023',
        '60000000-0000-0000-0000-000000000032',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000017',
        'Có phát chổi, xô, nước lau nhà không anh/chị?',
        '2025-12-20 11:45:00'
    ),
    (
        '40000000-0000-0000-0000-000000000024',
        '60000000-0000-0000-0000-000000000032',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000020',
        'Năm ngoái dọn xong còn được phát quà, năm nay có không ạ?',
        '2025-12-20 12:30:00'
    ),
    (
        '40000000-0000-0000-0000-000000000025',
        '60000000-0000-0000-0000-000000000032',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000030',
        'Cảm ơn Ban Quản lý luôn quan tâm môi trường sống của sinh viên.',
        '2025-12-20 13:15:00'
    ),
    (
        '40000000-0000-0000-0000-000000000026',
        '60000000-0000-0000-0000-000000000032',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000031',
        'Phòng em sẽ phân công lịch trực dọn dẹp.',
        '2025-12-20 14:20:00'
    ),
    (
        '40000000-0000-0000-0000-000000000027',
        '60000000-0000-0000-0000-000000000032',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000032',
        'Chụp ảnh trước sau khi dọn xong đăng nhóm KTX nha mọi người ',
        '2025-12-20 15:50:00'
    ),
    (
        '40000000-0000-0000-0000-000000000028',
        '60000000-0000-0000-0000-000000000032',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000033',
        'Hoạt động ý nghĩa lắm, vừa sạch vừa vui.',
        '2025-12-20 17:30:00'
    ),
    (
        '40000000-0000-0000-0000-000000000029',
        '60000000-0000-0000-0000-000000000032',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000041',
        'Chúc Ban Quản lý và các bạn dọn vệ sinh vui vẻ!',
        '2025-12-20 19:10:00'
    ),
    -- Comment vi phạm (quảng cáo)
    (
        '40000000-0000-0000-0000-000000000030',
        '60000000-0000-0000-0000-000000000032',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000040',
        'DỊCH VỤ DỌN PHÒNG KTX GIÁ RẺ – UY TÍN – NHANH CHÓNG – INBOX NGAY ZALO 035xxxx888',
        '2025-12-21 03:15:00'
    );
-- =================================================================
-- 3 ADDITIONAL COMMENT VI PHẠM CHO 3 ANNOUNCEMENT
-- =================================================================

-- Announcement 60000000-0000-0000-0000-000000000007 (Tổng vệ sinh khuôn viên)
INSERT INTO
    "Comments" (
        "id",
        "targetId",
        "targetType",
        "userId",
        "content",
        "createdAt"
    )
VALUES (
        '40000000-0000-0000-0000-000000000031',
        '60000000-0000-0000-0000-000000000007',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000040',
        'NHẬN DỌN VỆ SINH KÝ TÚC XÁ – NHÀ TRỌ – VĂN PHÒNG GIÁ RẺ CHỈ 30K 200K/BUỔI
Liên hệ ngay Zalo: 0388.666.888 – làm sạch trong 2h – bảo hành 7 ngày!!!',
        '2025-12-21 08:20:00'
    );

-- Announcement 60000000-0000-0000-0000-000000000017 (Lịch nghỉ căng tin dịp Tết)
INSERT INTO
    "Comments" (
        "id",
        "targetId",
        "targetType",
        "userId",
        "content",
        "createdAt"
    )
VALUES (
        '40000000-0000-0000-0000-000000000032',
        '60000000-0000-0000-0000-000000000017',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000040',
        'BÁN BÁNH CHƯNG GIÒ CHẢ TẾT GIÁ SỈ SIÊU RẺ
Ship toàn quốc – freeship nội thành – đặt 50 cái tặng 5 cái
Inbox ngay Zalo 0909.xxx.999 nhận báo giá tốt nhất!!!',
        '2025-12-21 11:45:00'
    );

-- Announcement 60000000-0000-0000-0000-000000000032 (Tổng vệ sinh KTX cuối năm)
INSERT INTO
    "Comments" (
        "id",
        "targetId",
        "targetType",
        "userId",
        "content",
        "createdAt"
    )
VALUES (
        '40000000-0000-0000-0000-000000000033',
        '60000000-0000-0000-0000-000000000032',
        'ANNOUNCEMENT',
        'e0000000-0000-0000-0000-000000000040',
        'DỊCH VỤ DỌN DẸP KÝ TÚC XÁ CHUYÊN NGHIỆP – GIẶT THẢM – GIẶT RÈM – DIỆT GIÁN CHỈ 250K/PHÒNG
Làm trong ngày – bảo hành 30 ngày – tặng kèm nước lau sàn
Call/Zalo ngay: 0377.xxx.888.999 để được tư vấn miễn phí!!!',
        '2025-12-21 15:30:00'
    );
-- -- =================================================================
-- -- COMMENT REPORTS CHO 3 COMMENT VI PHẠM (SPAM/QUẢNG CÁO)
-- -- =================================================================

-- INSERT INTO
--     "CommentReports" (
--         "id",
--         "commentId",
--         "userId",
--         "reason",
--         "status",
--         "createdAt"
--     )
-- VALUES
--     -- 1. Report comment dọn vệ sinh quảng cáo (commentId 4000...031)
--     (
--         '70000000-0000-0000-0000-000000000001',
--         '40000000-0000-0000-0000-0000-000000000031',
--         'e0000000-0000-0000-0000-000000000001', -- Nguyễn Văn An báo cáo
--         'Quảng cáo dịch vụ dọn vệ sinh không liên quan, spam rác',
--         'PENDING',
--         '2025-12-21 08:45:00'
--     ),

-- -- 2. Report comment bán bánh chưng giò chả (commentId 4000...032)
-- (
--     '70000000-0000-0000-0000-000000000002',
--     '40000000-0000-0000-0000-000000000032',
--     'e0000000-0000-0000-0000-000000000005', -- Hoàng Thu Trang báo cáo
--     'Spam quảng cáo thực phẩm, bán hàng trong bài thông báo chính thức của trường',
--     'PENDING',
--     '2025-12-21 12:10:00'
-- ),

-- -- 3. Report comment dịch vụ dọn KTX + giặt thảm (commentId 4000...033)
-- (
--     '70000000-0000-0000-0000-000000000003',
--     '40000000-0000-0000-0000-000000000033',
--     'e0000000-0000-0000-0000-000000000011', -- Dương Thị Lan báo cáo
--     'Quảng cáo dịch vụ thương mại trá hình, làm bẩn bài thông báo của Ban Quản lý KTX',
--     'PENDING',
--     '2025-12-21 16:05:00'
-- );
-- =================================================================
-- STEP 11: CONVERSATIONS & MESSAGES
-- Fix Conv ID: conv... -> 7000...
-- Fix Msg ID: msg... -> 8000...
-- =================================================================
-- =================================================================
-- 1. ClarificationConversations (10 cái – đã sửa đúng userId)
-- =================================================================
-- =================================================================
-- ClarificationConversations – CHỈ STAFF MỞ CONVERSATION
-- -- =================================================================
-- INSERT INTO
--     "ClarificationConversations" (
--         "id",
--         "subject",
--         "feedbackId",
--         "isClosed",
--         "userId",
--         "createdAt"
--     )
-- VALUES
--     -- 1. Căng tin → Phòng Dịch vụ sinh viên
--     (
--         '70000000-0000-0000-0000-000000000001',
--         'Yêu cầu bổ sung ảnh căng tin',
--         'f0000000-0000-0000-0000-000000000034',
--         true,
--         'b0000000-0000-0000-0000-000000000027',
--         '2025-12-02 09:00:00'
--     ),

-- -- 2. Máy lab cũ → Phòng Quản trị CSVC
-- (
--     '70000000-0000-0000-0000-000000000002',
--     'Xác nhận cấu hình máy lab',
--     'f0000000-0000-0000-0000-000000000035',
--     true,
--     'b0000000-0000-0000-0000-000000000009',
--     '2025-12-03 10:30:00'
-- ),

-- -- 3. Lỗi LMS → Trung tâm Dạy học số
-- (
--     '70000000-0000-0000-0000-000000000003',
--     'Yêu cầu video minh chứng lỗi LMS',
--     'f0000000-0000-0000-0000-000000000036',
--     true,
--     'b0000000-0000-0000-0000-000000000028',
--     '2025-12-04 14:00:00'
-- ),

-- -- -- 4. Chỗ thực tập → Phòng Quan hệ doanh nghiệp
-- -- (
-- --     '70000000-0000-0000-0000-000000000004',
-- --     'Gửi danh sách công ty mong muốn thực tập',
-- --     'f0000000-0000-0000-0000-000000000065',
-- --     true,
-- --     'b0000000-0000-0000-0000-000000000002',
-- --     '2025-12-02 11:15:00'
-- -- ),

-- -- 5. Job Fair → Phòng Quan hệ doanh nghiệp
-- -- (
-- --     '70000000-0000-0000-0000-000000000005',
-- --     'Gợi ý công ty tham gia Job Fair',
-- --     'f0000000-0000-0000-0000-000000000066',
-- --     true,
-- --     'b0000000-0000-0000-0000-000000000002',
-- --     '2025-12-03 09:45:00'
-- -- ),

-- -- 6. Đề tài NCKH → Phòng Khoa học & Công nghệ (giả sử dùng staff chung KH&CN)
-- (
--     '70000000-0000-0000-0000-000000000006',
--     'Gửi đề cương đề tài NCKH',
--     'f0000000-0000-0000-0000-000000000096',
--     true,
--     'b0000000-0000-0000-0000-000000000005',
--     '2025-12-02 15:20:00'
-- ),

-- -- 7. Bài báo Q1 → Phòng Khoa học & Công nghệ
-- (
--     '70000000-0000-0000-0000-000000000007',
--     'Gửi link bài báo Q1',
--     'f0000000-0000-0000-0000-000000000098',
--     true,
--     'b0000000-0000-0000-0000-000000000005',
--     '2025-12-05 10:10:00'
-- ),

-- -- 8. Lab AI → Phòng Khoa học & Công nghệ
-- (
--     '70000000-0000-0000-0000-000000000008',
--     'Gửi ảnh hiện trạng lab AI',
--     'f0000000-0000-0000-0000-000000000099',
--     true,
--     'b0000000-0000-0000-0000-000000000005',
--     '2025-12-06 11:30:00'
-- ),

-- -- 9. Hội nghị NCKH → Phòng Khoa học & Công nghệ
-- (
--     '70000000-0000-0000-0000-000000000009',
--     'Gửi ảnh sự kiện NCKH cũ',
--     'f0000000-0000-0000-0000-000000000100',
--     true,
--     'b0000000-0000-0000-0000-000000000005',
--     '2025-12-07 14:00:00'
-- ),

-- -- 10. Sự kiện Noel → Phòng CTSV
-- (
--     '70000000-0000-0000-0000-000000000010',
--     'Gửi ảnh Noel năm ngoái',
--     'f0000000-0000-0000-0000-000000000037',
--     true,
--     'b0000000-0000-0000-0000-000000000010',
--     '2025-12-06 09:00:00'
-- );
-- -- =================================================================
-- -- 2. Messages (đúng staff + student)
-- -- =================================================================
-- INSERT INTO
--     "Messages" (
--         "id",
--         "conversationId",
--         "userId",
--         "content",
--         "createdAt"
--     )
-- VALUES
--     -- Conv 001 – Căng tin (staff DVSV)
--     (
--         '80000000-0000-0000-0000-000000000001',
--         '70000000-0000-0000-0000-000000000001',
--         'b0000000-0000-0000-0000-000000000027',
--         'Chào bạn, bạn gửi thêm ảnh chụp tình trạng căng tin giúp mình nhé?',
--         '2025-12-02 09:05:00'
--     ),
--     (
--         '80000000-0000-0000-0000-000000000002',
--         '70000000-0000-0000-0000-000000000001',
--         'e0000000-0000-0000-0000-000000000004',
--         'Dạ đây ạ, chụp giờ trưa hôm qua.',
--         '2025-12-02 09:10:00'
--     ),
--     (
--         '80000000-0000-0000-0000-000000000003',
--         '70000000-0000-0000-0000-000000000001',
--         'b0000000-0000-0000-0000-000000000027',
--         'Cảm ơn em, mình đã chuyển lên Ban Quản lý dịch vụ.',
--         '2025-12-02 09:30:00'
--     ),

-- -- Conv 002 – Máy lab (staff Thiết bị CSVC)
-- (
--     '80000000-0000-0000-0000-000000000004',
--     '70000000-0000-0000-0000-000000000002',
--     'b0000000-0000-0000-0000-000000000009',
--     'Bạn cho mình biết cấu hình máy hiện tại (CPU/RAM/VGA) nhé.',
--     '2025-12-03 10:35:00'
-- ),
-- (
--     '80000000-0000-0000-0000-000000000005',
--     '70000000-0000-0000-0000-000000000002',
--     'e0000000-0000-0000-0000-000000000005',
--     'Dạ em gửi ảnh chụp thông số ạ.',
--     '2025-12-03 10:40:00'
-- ),
-- (
--     '80000000-0000-0000-0000-000000000006',
--     '70000000-0000-0000-0000-000000000002',
--     'b0000000-0000-0000-0000-000000000009',
--     'Cảm ơn, mình sẽ đề xuất thay mới quý 1/2026.',
--     '2025-12-03 11:00:00'
-- ),

-- -- Conv 003 – LMS (staff Dạy học số)
-- (
--     '80000000-0000-0000-0000-000000000007',
--     '70000000-0000-0000-0000-000000000003',
--     'b0000000-0000-0000-0000-000000000028',
--     'Bạn gửi video hoặc ảnh lỗi LMS giúp mình được không?',
--     '2025-12-04 14:05:00'
-- ),
-- (
--     '80000000-0000-0000-0000-000000000008',
--     '70000000-0000-0000-0000-000000000003',
--     'e0000000-0000-0000-0000-000000000043',
--     'Dạ đây video quay màn hình lúc bị lỗi ạ.',
--     '2025-12-04 14:10:00'
-- ),
-- (
--     '80000000-0000-0000-0000-000000000009',
--     '70000000-0000-0000-0000-000000000003',
--     'b0000000-0000-0000-0000-000000000028',
--     'Cảm ơn bạn, đã chuyển đội kỹ thuật xử lý gấp.',
--     '2025-12-04 14:30:00'
-- ),

-- -- -- Conv 004 – Thực tập (staff QHDN)
-- -- (
-- --     '80000000-0000-0000-0000-000000000010',
-- --     '70000000-0000-0000-0000-000000000004',
-- --     'b0000000-0000-0000-0000-000000000002',
-- --     'Bạn gửi danh sách công ty mong muốn thực tập giúp mình nhé.',
-- --     '2025-12-02 11:20:00'
-- -- ),
-- -- (
-- --     '80000000-0000-0000-0000-000000000011',
-- --     '70000000-0000-0000-0000-000000000004',
-- --     'e0000000-0000-0000-0000-000000000032',
-- --     'Dạ em gửi file Excel ạ.',
-- --     '2025-12-02 11:25:00'
-- -- ),
-- -- (
-- --     '80000000-0000-0000-0000-000000000012',
-- --     '70000000-0000-0000-0000-000000000004',
-- --     'b0000000-0000-0000-0000-000000000002',
-- --     'OK, mình sẽ gửi thư giới thiệu trong tuần này.',
-- --     '2025-12-02 11:45:00'
-- -- ),

-- -- Conv 005 – Job Fair (staff QHDN)
-- -- (
-- --     '80000000-0000-0000-0000-000000000013',
-- --     '70000000-0000-0000-0000-000000000005',
-- --     'b0000000-0000-0000-0000-000000000002',
-- --     'Bạn muốn mời thêm công ty nào tham gia Job Fair cuối năm?',
-- --     '2025-12-03 09:50:00'
-- -- ),
-- (
--     '80000000-0000-0000-0000-000000000014',
--     '70000000-0000-0000-0000-000000000005',
--     'e0000000-0000-0000-0000-000000000022',
--     'Em muốn có FPT, VNG, Shopee, Tiki ạ.',
--     '2025-12-03 09:55:00'
-- ),
-- -- (
-- --     '80000000-0000-0000-0000-000000000015',
-- --     '70000000-0000-0000-0000-000000000005',
-- --     'b0000000-0000-0000-0000-000000000002',
-- --     'Đã ghi nhận, cảm ơn góp ý!',
-- --     '2025-12-03 10:10:00'
-- -- ),

-- -- Conv 006 – Đề tài NCKH (staff KH&CN)
-- (
--     '80000000-0000-0000-0000-000000000016',
--     '70000000-0000-0000-0000-000000000006',
--     'b0000000-0000-0000-0000-000000000005',
--     'Bạn gửi đề cương đề tài giúp mình nhé.',
--     '2025-12-02 15:25:00'
-- ),
-- (
--     '80000000-0000-0000-0000-000000000017',
--     '70000000-0000-0000-0000-000000000006',
--     'e0000000-0000-0000-0000-000000000015',
--     'Dạ đây file PDF ạ.',
--     '2025-12-02 15:30:00'
-- ),
-- (
--     '80000000-0000-0000-0000-000000000018',
--     '70000000-0000-0000-0000-000000000006',
--     'b0000000-0000-0000-0000-000000000005',
--     'Cảm ơn, mình duyệt và phản hồi sớm.',
--     '2025-12-02 15:45:00'
-- ),

-- -- Conv 007 – Bài báo Q1 (staff KH&CN)
-- (
--     '80000000-0000-0000-0000-000000000019',
--     '70000000-0000-0000-0000-000000000007',
--     'b0000000-0000-0000-0000-000000000005',
--     'Chúc mừng bài Q1! Gửi link DOI và file PDF nhé.',
--     '2025-12-05 10:15:00'
-- ),
-- (
--     '80000000-0000-0000-0000-000000000020',
--     '70000000-0000-0000-0000-000000000007',
--     'e0000000-0000-0000-0000-000000000031',
--     'Dạ đây ạ, cảm ơn thầy/cô.',
--     '2025-12-05 10:20:00'
-- ),

-- -- Conv 008 – Lab AI (staff KH&CN)
-- (
--     '80000000-0000-0000-0000-000000000021',
--     '70000000-0000-0000-0000-000000000008',
--     'b0000000-0000-0000-0000-000000000005',
--     'Bạn chụp ảnh lab hiện tại gửi mình giúp nhé.',
--     '2025-12-06 11:35:00'
-- ),
-- (
--     '80000000-0000-0000-0000-000000000022',
--     '70000000-0000-0000-0000-000000000008',
--     'e0000000-0000-0000-0000-000000000040',
--     'Dạ đây 2 ảnh chụp lab ạ.',
--     '2025-12-06 11:40:00'
-- ),
-- (
--     '80000000-0000-0000-0000-000000000023',
--     '70000000-0000-0000-0000-000000000008',
--     'b0000000-0000-0000-0000-000000000005',
--     'Cảm ơn, mình sẽ đề xuất mua thêm GPU.',
--     '2025-12-06 12:00:00'
-- ),

-- -- Conv 009 – Hội nghị NCKH (staff KH&CN)
-- (
--     '80000000-0000-0000-0000-000000000024',
--     '70000000-0000-0000-0000-000000000009',
--     'b0000000-0000-0000-0000-000000000005',
--     'Bạn gửi ảnh hội nghị NCKH năm trước giúp mình nhé.',
--     '2025-12-07 14:05:00'
-- ),
-- (
--     '80000000-0000-0000-0000-000000000025',
--     '70000000-0000-0000-0000-000000000009',
--     'e0000000-0000-0000-0000-000000000004',
--     'Dạ đây ảnh chụp năm 2023 ạ.',
--     '2025-12-07 14:10:00'
-- ),
-- (
--     '80000000-0000-0000-0000-000000000026',
--     '70000000-0000-0000-0000-000000000009',
--     'b0000000-0000-0000-0000-000000000005',
--     'Cảm ơn, mình sẽ lên kế hoạch tổ chức lại 2026.',
--     '2025-12-07 14:30:00'
-- ),

-- -- Conv 010 – Sự kiện Noel (staff CTSV)
-- (
--     '80000000-0000-0000-0000-000000000027',
--     '70000000-0000-0000-0000-000000000010',
--     'b0000000-0000-0000-0000-000000000010',
--     'Bạn gửi ảnh cây thông Noel năm ngoái giúp mình nhé.',
--     '2025-12-06 09:05:00'
-- ),
-- (
--     '80000000-0000-0000-0000-000000000028',
--     '70000000-0000-0000-0000-000000000010',
--     'e0000000-0000-0000-0000-000000000040',
--     'Dạ đây ạ, năm ngoái đẹp lắm.',
--     '2025-12-06 09:10:00'
-- ),
-- (
--     '80000000-0000-0000-0000-000000000029',
--     '70000000-0000-0000-0000-000000000010',
--     'b0000000-0000-0000-0000-000000000010',
--     'Cảm ơn, mình sẽ cố gắng làm hoành tráng hơn năm nay!',
--     '2025-12-06 09:30:00'
-- );

-- -- =================================================================
-- -- 3. FileAttachments (đính kèm vào đúng message của sinh viên)
-- -- =================================================================
-- INSERT INTO
--     "FileAttachments" (
--         "id",
--         "targetId",
--         "targetType",
--         "fileName",
--         "fileUrl",
--         "fileType",
--         "fileSize",
--         "createdAt"
--     )
-- VALUES (
--         '90000000-0000-0000-0000-000000000001',
--         '80000000-0000-0000-0000-000000000002',
--         'MESSAGE',
--         'cantin_dirty_01.jpg',
--         '/uploads/cantin_dirty_01.jpg',
--         'image/jpeg',
--         1859421,
--         '2025-12-02 09:10:00'
--     ),
--     (
--         '90000000-0000-0000-0000-000000000002',
--         '80000000-0000-0000-0000-000000000002',
--         'MESSAGE',
--         'cantin_dirty_02.jpg',
--         '/uploads/cantin_dirty_02.jpg',
--         'image/jpeg',
--         2048156,
--         '2025-12-02 09:10:00'
--     ),
--     (
--         '90000000-0000-0000-0000-000000000003',
--         '80000000-0000-0000-0000-000000000005',
--         'MESSAGE',
--         'lab_config_2025.png',
--         '/uploads/lab_config_2025.png',
--         'image/png',
--         892341,
--         '2025-12-03 10:40:00'
--     ),
--     (
--         '90000000-0000-0000-0000-000000000004',
--         '80000000-0000-0000-0000-000000000008',
--         'MESSAGE',
--         'lms_error_recording.mp4',
--         '/uploads/lms_error_20251204.mp4',
--         'video/mp4',
--         12456789,
--         '2025-12-04 14:10:00'
--     ),
--     (
--         '90000000-0000-0000-0000-000000000005',
--         '80000000-0000-0000-0000-000000000011',
--         'MESSAGE',
--         'danh_sach_cong_ty_thuc_tap.xlsx',
--         '/uploads/danh_sach_cong_ty.xlsx',
--         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
--         45678,
--         '2025-12-02 11:25:00'
--     ),
--     (
--         '90000000-0000-0000-0000-000000000006',
--         '80000000-0000-0000-0000-000000000017',
--         'MESSAGE',
--         'de_cuong_nckh_2026.pdf',
--         '/uploads/de_cuong_nckh_2026.pdf',
--         'application/pdf',
--         1876543,
--         '2025-12-02 15:30:00'
--     ),
--     (
--         '90000000-0000-0000-0000-000000000007',
--         '80000000-0000-0000-0000-000000000020',
--         'MESSAGE',
--         'bai_bao_Q1_2025.pdf',
--         '/uploads/bai_bao_Q1_2025.pdf',
--         'application/pdf',
--         3456789,
--         '2025-12-05 10:20:00'
--     ),
--     (
--         '90000000-0000-0000-0000-000000000008',
--         '80000000-0000-0000-0000-000000000022',
--         'MESSAGE',
--         'lab_ai_hien_trang_01.jpg',
--         '/uploads/lab_ai_01.jpg',
--         'image/jpeg',
--         2154321,
--         '2025-12-06 11:40:00'
--     ),
--     (
--         '90000000-0000-0000-0000-000000000009',
--         '80000000-0000-0000-0000-000000000022',
--         'MESSAGE',
--         'lab_ai_hien_trang_02.jpg',
--         '/uploads/lab_ai_02.jpg',
--         'image/jpeg',
--         1987654,
--         '2025-12-06 11:40:00'
--     ),
--     (
--         '90000000-0000-0000-0000-000000000010',
--         '80000000-0000-0000-0000-000000000025',
--         'MESSAGE',
--         'hoi_nghi_nckh_2023.jpg',
--         '/uploads/hoi_nghi_nckh_2023.jpg',
--         'image/jpeg',
--         2876543,
--         '2025-12-07 14:10:00'
--     ),
--     (
--         '90000000-0000-0000-0000-000000000011',
--         '80000000-0000-0000-0000-000000000028',
--         'MESSAGE',
--         'noel_2024_cay_thong.jpg',
--         '/uploads/noel_2024_1.jpg',
--         'image/jpeg',
--         3987654,
--         '2025-12-06 09:10:00'
--     ),
--     (
--         '90000000-0000-0000-0000-000000000012',
--         '80000000-0000-0000-0000-000000000028',
--         'MESSAGE',
--         'noel_2024_san_khau.jpg',
--         '/uploads/noel_2024_2.jpg',
--         'image/jpeg',
--         4123456,
--         '2025-12-06 09:10:00'
--     );

INSERT INTO dashboard_trending_issues (
    post_id,
    author,
    content,
    post_link,
    posted_at,
    reaction_count,
    comment_count,
    engagement_score,
    topic,
    sentiment_score,
    ai_summary,
    sentiment_label,
    analyzed_at
) VALUES
(
    '45a536403ed63ff7b781e93fa36eae0c', 'Người tham gia ẩn danh', 'Anh chị giúp em cách fix với ạ,nó k hiện chỗ wifi ạ', 'https://www.facebook.com/groups/utethacmachoctap/posts/2175201173304378/', '2026-04-28 13:26:05', 
    14, 45, 104, 'Cơ sở vật chất & Bãi xe', 0.0, 'Sinh viên đang gặp vấn đề không kết nối được wifi và cần hỗ trợ khắc phục sự cố này để đảm bảo trải nghiệm học tập tốt hơn.', 'Trung lập', '2026-04-28 17:26:13.403'
),
(
    '30f6086fe5863e055fff712b29dc878a', 'MotivatedPapaya1825', 'Lễ trường có mở cửa không mọi người, mình kh về quê nên mình định vô ngồi học làm bài', 'https://www.facebook.com/groups/utethacmachoctap/posts/2176165993207896/', '2026-04-29 16:02:04', 
    5, 6, 17, 'Cơ sở vật chất & Bãi xe', 0.0, 'Sinh viên hỏi liệu trường có mở cửa trong dịp lễ không để có thể vào học bài, cần thông tin về lịch hoạt động của cơ sở vật chất.', 'Trung lập', '2026-04-29 17:11:03.287'
),
(
    '9d218cbd76eda133fa71949675bf9490', 'LavenderFirefly8798', 'Trường cho đề công bằng vãi đề toán 2 buổi chiều ko học hì cũng qua còn buổi sáng ...', 'https://www.facebook.com/groups/utethacmachoctap/posts/2165585674265928/', '2026-04-17 10:53:24', 
    28, 59, 146, 'Giảng viên & Đào tạo', -1.0, 'Sinh viên châm biếm về sự thiếu công bằng nghiêm trọng trong đề thi Toán 2, chỉ ra rằng đề thi buổi chiều quá dễ đến mức không cần học cũng qua, trong khi đề thi buổi sáng lại rất khó. Điều này gây bức xúc sâu sắc về sự chênh lệch chất lượng đề thi.', 'Tiêu cực', '2026-04-19 05:05:33.904'
),
(
    '6a075f7395b29ca01a7e771778e53ac7', 'CharmingYuzu1146', 'Thứ 7 này mình bảo vệ khoá luận tốt nghiệp ngành Quản lý Công nghiệp. Cho mình hỏi hội đồng 5 ai biết có hắc ám không? Mất ngủ mấy đêm rồi.', 'https://www.facebook.com/groups/utethacmachoctap/posts/2170791843745311/', '2026-04-23 14:02:59', 
    3, 2, 7, 'Giảng viên & Đào tạo', -0.7, 'Sinh viên bày tỏ sự lo lắng và mất ngủ kéo dài về buổi bảo vệ khóa luận tốt nghiệp sắp tới, đặc biệt là nỗi sợ hãi về hội đồng chấm thi ''hắc ám'', cho thấy áp lực tâm lý rất lớn.', 'Tiêu cực', '2026-04-23 14:41:23.083'
),
(
    '5940f3ca9114445420ebafeeebd41654', 'conchồncute', 'Thi mạch điện ai cũng nói số đẹp có mình tôi số xấu thôi hả', 'https://www.facebook.com/groups/utethacmachoctap/posts/2169698303854665/', '2026-04-22 07:52:47', 
    12, 16, 44, 'Giảng viên & Đào tạo', -0.3, 'Sinh viên bày tỏ sự thất vọng và cảm thấy không may mắn sau kỳ thi Mạch điện, khi ''ai cũng nói số đẹp'' (đề dễ hoặc kết quả tốt) nhưng bản thân lại gặp ''số xấu'' (đề khó hoặc kết quả không như ý).', 'Trung lập', '2026-04-23 14:41:23.083'
),
(
    'fdefff546182e5e5d84a7153dd28d52c', 'Người tham gia ẩn danh', 'Xin cánh tay của những bạn 8+ toán 2 ạ, đề khê quá huhu', 'https://www.facebook.com/groups/utethacmachoctap/posts/2175209119970250/', '2026-04-28 13:37:03', 
    9, 22, 53, 'Giảng viên & Đào tạo', -0.2, 'Sinh viên bày tỏ sự thất vọng và khó khăn với đề thi môn toán 2 quá phức tạp, tìm kiếm sự hỗ trợ từ những bạn học tốt hơn.', 'Trung lập', '2026-04-28 17:26:13.403'
),
(
    '26f823082f216770c14e380f349bf415', 'Người tham gia ẩn danh', 'A/c nào học môn công nghệ kim loại của thầy Nguyễn Thanh Tân rồi cho e hỏi, bữa đầu thầy có điểm danh hay làm bài test nào k các anh chị', 'https://www.facebook.com/groups/utethacmachoctap/posts/2173590736798755/', '2026-04-26 17:21:58', 
    2, 3, 8, 'Giảng viên & Đào tạo', 0.0, 'Sinh viên hỏi về phương pháp điểm danh hoặc bài kiểm tra đầu tiên của giảng viên môn công nghệ kim loại để chuẩn bị cho buổi học.', 'Trung lập', '2026-04-28 17:26:13.403'
),
(
    '754e5da373a7edc38f80299935e4d7d6', 'Người tham gia ẩn danh', 'Ai có đáp án lí 2 cho em xin với ạ.Làm bài rất ok nhưng điểm rất khê ạ.Em cảm ơn', 'https://www.facebook.com/groups/utethacmachoctap/posts/2175340013290494/', '2026-04-28 16:44:07', 
    0, 0, 0, 'Giảng viên & Đào tạo', -0.2, 'Sinh viên bày tỏ sự không hài lòng với kết quả điểm môn lí 2, cho rằng điểm số thấp hơn so với nỗ lực làm bài. Đây là một điểm đau về tính công bằng hoặc minh bạch trong đánh giá.', 'Trung lập', '2026-04-28 17:26:13.403'
),
(
    'aa8e4430636a36939ea452531fd0bea0', 'Lê Tùng Dương', 'Cảm ơn thầy Khương vì con điểm này. Dù là học mooc và gặp các bạn một cách rất tình cờ, nhưng mọi người đều đồng lòng và chung sức làm bài\nShout out đến:\nĐức Khang\nLê Bùi Thanh Danh\nPhạm Gia Tuệ\nTrương Tấn Sang\nCảm ơn các bạn rất nhiều', 'https://www.facebook.com/groups/utethacmachoctap/posts/2175334263291069/', '2026-04-28 16:35:06', 
    20, 4, 28, 'Giảng viên & Đào tạo', 0.6, 'Sinh viên bày tỏ lòng biết ơn thầy Khương về kết quả học tập và khen ngợi sự hợp tác hiệu quả của nhóm bạn trong quá trình làm bài học mooc, thể hiện môi trường học tập tích cực.', 'Tích cực', '2026-04-28 17:26:13.403'
),
(
    '9010e20c067fef08d727fb2e82f6cc0f', 'EmpatheticBison8003', 'Học lại lần 2 rồi k qua nản quá mn. Giảng vin nào buff qt 7 thi 3 chia sẽ em vs ạ 😭', 'https://www.facebook.com/groups/utethacmachoctap/posts/2176143709876791/', '2026-04-29 15:47:28', 
    11, 26, 63, 'Giảng viên & Đào tạo', -0.3, 'Sinh viên đang rất nản lòng vì đã thi trượt môn học lần thứ hai và đang tìm kiếm giảng viên được cho là dễ tính hoặc có cách ra đề ôn tập giúp sinh viên qua môn dễ hơn, phản ánh áp lực học tập.', 'Trung lập', '2026-04-29 17:11:03.287'
),
(
    '02971db010648d7b1b2403b3d6782199', 'Người tham gia ẩn danh', 'Dạ anh chị có tài liệu toán ứng dụng kỹ sư và mạch điện bản tiếng việt cho e xin với ạ ,sách tiếng anh đọc lú quá😭😭. Dạ e cảm ơn nhiều 💓', 'https://www.facebook.com/groups/utethacmachoctap/posts/2175792466578582/', '2026-04-29 07:11:41', 
    1, 6, 13, 'Giảng viên & Đào tạo', -0.3, 'Sinh viên gặp khó khăn khi học tài liệu toán ứng dụng kỹ sư và mạch điện bằng tiếng Anh và mong muốn tìm tài liệu tiếng Việt. Đây là một điểm yếu về hỗ trợ tài liệu học tập.', 'Trung lập', '2026-04-29 17:14:25.838'
),
(
    '7e3a825d61686835420558674a608411', 'Người tham gia ẩn danh', 'Bạn nào học buổi đầu ngày hôm nay cho mình hỏi thầy có gr zalo hay có hay dặn dò gì hong ạ. Mình cảm ơn.', 'https://www.facebook.com/groups/utethacmachoctap/posts/2175951323229363/', '2026-04-29 10:53:26', 
    0, 3, 6, 'Giảng viên & Đào tạo', 0.0, 'Sinh viên hỏi về thông tin liên lạc (nhóm Zalo) hoặc dặn dò từ giảng viên trong buổi học đầu tiên để không bỏ lỡ thông báo quan trọng.', 'Trung lập', '2026-04-29 17:14:25.838'
),
(
    'ae299209db55e6a97f9489d83f91d831', 'Người tham gia ẩn danh', 'Dạ là Em có đăng kí học lại 1 môn 3tc mà học phí lại vẫn để 18 triệu.Vậy số tiền học lại mình đóng sao ạ😭😭😭', 'https://www.facebook.com/groups/utethacmachoctap/posts/2125700394921123/', '2026-03-01 09:58:51', 
    0, 1, 2, 'Học phí & Hành chính', -0.2, 'Sinh viên đăng ký học lại 1 môn 3 tín chỉ nhưng hệ thống hiển thị tổng học phí là 18 triệu đồng, gây hoang mang về cách tính và đóng tiền. Nhà trường cần kiểm tra lại hệ thống tính toán học phí cho các môn học lại và cung cấp hướng dẫn rõ ràng để tránh nhầm lẫn cho sinh viên.', 'Trung lập', '2026-03-31 15:29:45.402'
),
(
    '5c8ee2245d31c1a60ae20cb0e4d9557d', 'Người tham gia ẩn danh', 'Cho mik hỏi mng đủ điều kiện, có nhận được hoàn trả số tiền BHYT để trừ vào học phí chưa ạ, trước tết đã khai báo ở trạm y tế trường r ạ', 'https://www.facebook.com/groups/utethacmachoctap/posts/2167095264114969/', '2026-04-19 04:51:21', 
    0, 1, 2, 'Học phí & Hành chính', -0.1, 'Sinh viên thắc mắc về việc chưa nhận được hoàn trả số tiền Bảo hiểm Y tế (BHYT) để trừ vào học phí, mặc dù đã khai báo. Nhà trường cần rà soát quy trình và tiến độ hoàn trả BHYT.', 'Trung lập', '2026-04-19 05:05:33.904'
),
(
    '3cb84a39d49e36a8553ad758dde50144', 'Người tham gia ẩn danh', 'Dạ anh chị cho em hỏi. Em đóng học phí HK II vào đợt 2 được không ạ. Em nhớ là đóng muộn vào đợt 2 chỉ bị trừ đrl mà sao em đọc thông tin thì bị Khiển Trách ạ, huhu.', 'https://www.facebook.com/groups/utethacmachoctap/posts/2166596684164827/', '2026-04-18 13:30:00', 
    2, 4, 10, 'Học phí & Hành chính', -0.3, 'Sinh viên bối rối và lo lắng (''huhu'') về thông tin đóng học phí muộn, có sự không nhất quán giữa ''trừ điểm rèn luyện'' và ''bị khiển trách''. Cần rà soát và làm rõ chính sách để tránh gây hoang mang cho sinh viên.', 'Trung lập', '2026-04-23 14:41:23.083'
),
(
    '01421ffb2d1312c6462e3016cff30583', 'toiiuute', 'Có bạn nào chuyển ngành ngành thành công đợt này chưa, mình đợi thông báo thấy lâu quá', 'https://www.facebook.com/groups/utethacmachoctap/posts/2174003423424153/', '2026-04-27 05:03:31', 
    1, 0, 1, 'Học phí & Hành chính', -0.2, 'Sinh viên đang bày tỏ sự sốt ruột vì chờ đợi thông báo kết quả chuyển ngành quá lâu, cho thấy thủ tục hành chính về chuyển ngành còn chậm trễ, gây ảnh hưởng tâm lý và kế hoạch học tập của sinh viên.', 'Trung lập', '2026-04-27 05:15:38.684'
),
(
    '2d8d00d825e317f68c3f0fd49f98cbc8', 'Người tham gia ẩn danh', 'Mng cho em hỏi trường mình có nhận đầu ra bằng chứng chỉ Aptis kh ạ.', 'https://www.facebook.com/groups/utethacmachoctap/posts/1934604494030715/', '2025-07-18 10:59:23', 
    3, 7, 17, 'Học phí & Hành chính', 0.0, 'Sinh viên hỏi về việc trường có chấp nhận chứng chỉ Aptis làm điều kiện đầu ra ngoại ngữ hay không, cần thông tin rõ ràng về quy định chứng chỉ.', 'Trung lập', '2026-04-29 17:11:03.287'
),
(
    '549bb2406df9f2b789a650a63a0749da', 'T.Hehehe.M', 'Mn cho em hỏi về qui trình xin cấp lại thẻ sinh viên có tích hợp thẻ ngân hàng, làm như thế nào và làm ở đâu ạ.', 'https://www.facebook.com/groups/utethacmachoctap/posts/2176198636537965/', '2026-04-29 16:49:29', 
    0, 1, 2, 'Học phí & Hành chính', 0.0, 'Sinh viên cần biết quy trình và địa điểm để xin cấp lại thẻ sinh viên có tích hợp thẻ ngân hàng, yêu cầu hướng dẫn thủ tục chi tiết.', 'Trung lập', '2026-04-29 17:11:03.287'
),
(
    '1059e8b3eb8ba22154558a81fe08ce72', 'Người tham gia ẩn danh', 'Dạ ac cho em hỏi em k25 đóng hp qp12( hk1) vào đợt 2 này thì có bị ảnh hưởng hbkkht của hk1 năm 2 ko ạ', 'https://www.facebook.com/groups/utethacmachoctap/posts/2176204733204022/', '2026-04-29 16:58:43', 
    0, 0, 0, 'Học phí & Hành chính', 0.0, 'Sinh viên khóa K25 hỏi liệu việc đóng học phí quốc phòng học kỳ 1 vào đợt 2 có ảnh hưởng đến học bổng khuyến khích học tập của học kỳ 1 năm 2 hay không.', 'Trung lập', '2026-04-29 17:11:03.287'
),
(
    'e97a14f9918540427c89002e5348f9fe', 'Người tham gia ẩn danh', 'Cho mình hỏi nợ hp quốc phòng với thể chất bao h mới hết hạn đóng v ạ', 'https://www.facebook.com/groups/utethacmachoctap/posts/2176165436541285/', '2026-04-29 16:01:14', 
    1, 1, 3, 'Học phí & Hành chính', 0.0, 'Sinh viên hỏi về thời hạn đóng học phí các môn quốc phòng và thể chất.', 'Trung lập', '2026-04-29 17:14:25.838'
),
(
    '519d650b32b2ce084eb0f6e4c1ae4679', '10p GG', 'E k23 học quốc phòng kì 2, bây giờ đã có thể lấy chứng chỉ đc chưa ạ?', 'https://www.facebook.com/groups/utethacmachoctap/posts/2175727956585033/', '2026-04-29 04:22:26', 
    10, 16, 42, 'Học phí & Hành chính', 0.0, 'Sinh viên khóa K23 hỏi về thời điểm có thể nhận chứng chỉ giáo dục quốc phòng kỳ 2. Cần cung cấp thông tin rõ ràng về quy trình và lịch trả chứng chỉ.', 'Trung lập', '2026-04-29 17:14:25.838'
),
(
    'a01835389bbba081cbbe0d1f78c7ca74', 'Người tham gia ẩn danh', 'Cầu mong mn vt review nhiều hơn ạ 😔😔😔 ko chỉ tích đức mà còn cứu rỗi bt bao tầm hồn vụn vỡ vì gpa sắp đát như em 😭😭😭', 'https://www.facebook.com/groups/utethacmachoctap/posts/2166426580848504/', '2026-04-18 12:48:22', 
    23, 20, 63, 'Học vụ & Đăng ký môn', -0.4, 'Sinh viên bày tỏ sự tuyệt vọng vì điểm GPA thấp, tha thiết mong muốn có thêm các bài review (về môn học/giảng viên/kinh nghiệm học) từ cộng đồng để cải thiện tình hình học tập. Đây là một vấn đề về nhu cầu hỗ trợ học thuật và chia sẻ kinh nghiệm giữa sinh viên.', 'Trung lập', '2026-04-19 05:05:33.904'
),
(
    'a6364b3efb34c7669200214ced3a68e9', 'Mass Queue', '[THẮC MẮC] Link tra cứu Kho Học Liệu Số hỗ trợ học tập - Ôn tập mùa thi\nCho mình hỏi có ai nhận được mail này và truy cập được liên kết không? Mình truy cập tới bước login Mail của trường xong thì bị chặn.\n\nXin cám ơn!', 'https://www.facebook.com/groups/utethacmachoctap/posts/2167094180781744/', '2026-04-19 04:49:20', 
    0, 0, 0, 'Học vụ & Đăng ký môn', -0.2, 'Sinh viên gặp lỗi kỹ thuật khi cố gắng truy cập Kho Học Liệu Số hỗ trợ học tập của trường, bị chặn sau khi đăng nhập bằng email. Nhà trường cần kiểm tra lại hệ thống truy cập tài liệu để đảm bảo sinh viên có thể sử dụng.', 'Trung lập', '2026-04-19 05:05:33.904'
),
(
    'b183f3ccab53897e614c2b0f48e1b7c3', 'Người tham gia ẩn danh', 'Sao toán 2 chưa có điểm vậy mọi người ơi, mình chữ K :((', 'https://www.facebook.com/groups/utethacmachoctap/posts/2170704490420713/', '2026-04-23 12:01:26', 
    2, 6, 14, 'Học vụ & Đăng ký môn', -0.2, 'Sinh viên đang lo lắng về việc môn Toán 2 chưa có điểm và bày tỏ sự hoang mang về khả năng nhận điểm ''K'', cần nhà trường đẩy nhanh việc công bố kết quả để giảm bớt sự bất an cho sinh viên.', 'Trung lập', '2026-04-23 14:41:23.083'
),
(
    '02eea46dff6d8ad72cfe239a1cbc4846', 'Người tham gia ẩn danh', 'Tha thiết xin slot ạ kì sau em có đồ án mà không vô được. Ai có nhường cho em xin với ạ.', 'https://www.facebook.com/groups/utethacmachoctap/posts/2170514637106365/', '2026-04-23 07:09:27', 
    1, 3, 7, 'Học vụ & Đăng ký môn', -0.3, 'Sinh viên đang tha thiết xin slot môn học cho đồ án vì không đăng ký được, cho thấy vấn đề về số lượng chỗ hoặc hệ thống đăng ký môn cần được cải thiện.', 'Trung lập', '2026-04-23 14:43:43.214'
),
(
    'fae2a613483ca624efd5f4bbacebb69a', 'SilverCaterpillar3243', 'Mn ơi giúp mình với. Mình nhớ đã hủy môn xstk rồi mà sao ở phần kết quả học tập vẫn còn hiện môn đó', 'https://www.facebook.com/groups/utethacmachoctap/posts/2173989266758902/', '2026-04-27 04:40:54', 
    1, 2, 5, 'Học vụ & Đăng ký môn', -0.2, 'Sinh viên bày tỏ sự khó hiểu và lo lắng khi môn học đã hủy nhưng vẫn xuất hiện trong kết quả học tập. Điều này chỉ ra một lỗi tiềm ẩn trong hệ thống hoặc quy trình học vụ cần được nhà trường xem xét và điều chỉnh.', 'Trung lập', '2026-04-27 04:50:02.482'
),
(
    'd6c118c5ecede1deb9ed6714ed6975a1', 'Người tham gia ẩn danh', 'Tình hình là em mới học lại thấy làm ổn lắm mà điểm như này thì phúc khảo đâu ạ🥹🥹', 'https://www.facebook.com/groups/utethacmachoctap/posts/2173860706771758/', '2026-04-27 03:46:05', 
    1, 3, 7, 'Học vụ & Đăng ký môn', -0.3, 'Sinh viên bày tỏ sự thất vọng và không hài lòng về điểm thi môn học lại, cảm thấy kết quả không xứng đáng với nỗ lực và tìm hiểu về thủ tục phúc khảo.', 'Trung lập', '2026-04-27 05:15:38.684'
),
(
    '025eb61e4df5bdf2cefe4b5703927769', 'Đức Mạnh', 'Mọi người cho em hỏi em đăng kí anh văn 4 sao mà nó ra 3 vậy ạ', 'https://www.facebook.com/groups/utethacmachoctap/posts/2173998150091347/', '2026-04-27 04:54:45', 
    1, 1, 3, 'Học vụ & Đăng ký môn', -0.2, 'Sinh viên gặp vấn đề trong quá trình đăng ký môn học khi hệ thống hiển thị sai kết quả đăng ký môn Anh văn 4 thành Anh văn 3, cần hỗ trợ kiểm tra và khắc phục lỗi hệ thống.', 'Trung lập', '2026-04-27 05:15:38.684'
),
(
    'fd66c3e48f0d1209ceafcf2ac41e3ded', 'Người tham gia ẩn danh', 'Có ní nào có điểm lý 1 chưa ạ,các môn đại cương khác có điểm vèo vèo hết r sao mỗi môn này chưa có 🥲', 'https://www.facebook.com/groups/utethacmachoctap/posts/2173999493424546/', '2026-04-27 04:56:40', 
    0, 0, 0, 'Học vụ & Đăng ký môn', -0.3, 'Sinh viên không hài lòng vì môn Lý 1 chưa có điểm trong khi các môn đại cương khác đã có, gây ra sự chậm trễ và thắc mắc về quy trình công bố điểm.', 'Trung lập', '2026-04-27 05:17:53.265'
),
(
    'f164c09a3957d4e2e39d007b58f136b7', 'Người tham gia ẩn danh', 'Cho em hỏi môn này em cúp 1 buổi có sao không mọi người🥲', 'https://www.facebook.com/groups/utethacmachoctap/posts/2173972756760553/', '2026-04-27 04:16:34', 
    0, 2, 4, 'Học vụ & Đăng ký môn', -0.1, 'Sinh viên hỏi về hậu quả của việc vắng mặt một buổi học trong một môn cụ thể, thể hiện sự lo lắng về quy định điểm danh và ảnh hưởng đến kết quả học tập.', 'Trung lập', '2026-04-27 05:17:53.265'
),
(
    '50ade1715d3a5e5ce87d88a4ad5f2b54', 'MrBeastUTE', 'Bữa đầu học thực tập đo lường cảm biến cô Nguyễn Thị Ngọc Thảo cúp có sao khong v moi nguoi😭', 'https://www.facebook.com/groups/utethacmachoctap/posts/2173997896758039/', '2026-04-27 04:54:31', 
    0, 0, 0, 'Học vụ & Đăng ký môn', -0.1, 'Sinh viên lo lắng về việc vắng mặt trong buổi học thực tập đầu tiên môn đo lường cảm biến với cô Nguyễn Thị Ngọc Thảo và muốn biết liệu có ảnh hưởng đến kết quả học tập hay không.', 'Trung lập', '2026-04-27 05:17:53.265'
),
(
    '90376ffb780787b89861a35ad2d0e7c7', 'Người tham gia ẩn danh', 'Em đăng kí học mooc môn pldc, nhưng mà giờ vẫn chưa nhận được link group zalo thì có sao không ạ. Em cảm ơn', 'https://www.facebook.com/groups/utethacmachoctap/posts/2174459766711852/', '2026-04-27 16:10:02', 
    0, 3, 6, 'Học vụ & Đăng ký môn', 0.0, 'Sinh viên đăng ký học MOOC môn pldc nhưng chưa nhận được link nhóm Zalo, lo lắng không biết có ảnh hưởng gì đến việc học. Nhà trường cần đảm bảo gửi thông tin đầy đủ và kịp thời sau khi sinh viên đăng ký.', 'Trung lập', '2026-04-28 17:26:13.403'
),
(
    '5a3fafff1d15afe5ae9935cb07529f98', 'Người tham gia ẩn danh', 'Mn cho e hỏi e hc triết học rồi giờ e đki học tthcm được ko ạ hay phải học kte triết trc ạ em cảm ơn', 'https://www.facebook.com/groups/utethacmachoctap/posts/2175337776624051/', '2026-04-28 16:40:47', 
    0, 1, 2, 'Học vụ & Đăng ký môn', 0.0, 'Sinh viên cần tư vấn về trình tự đăng ký các môn học Triết học và Tư tưởng Hồ Chí Minh, mong muốn được hướng dẫn rõ ràng về quy tắc học phần tiên quyết.', 'Trung lập', '2026-04-28 17:26:13.403'
),
(
    '7ebb57cfb90c1f2d6f8ca24a63e6f850', 'ExcitingKangaroo8981', 'Dạ môn này nếu nghỉ buổi đầu có sao hong ạ tại em ở quê sợ vào hong kịp', 'https://www.facebook.com/groups/utethacmachoctap/posts/2175277359963426/', '2026-04-28 15:15:53', 
    1, 1, 3, 'Học vụ & Đăng ký môn', 0.0, 'Sinh viên hỏi liệu việc nghỉ buổi học đầu tiên của một môn có ảnh hưởng gì không vì lý do ở quê chưa thể vào kịp. Cần thông tin về quy định điểm danh và việc học bù/theo kịp bài.', 'Trung lập', '2026-04-28 17:26:13.403'
),
(
    '7d0b44e1f8a60cd6436ef5c8f59d3641', 'Người tham gia ẩn danh', 'Đợt xét tốt nghiệp tháng 5 này nhà trường xét tự động nên sốt ruột quá huhu 🥺 \nRáng 10 - 15 ngày nữa có kq\nHy vọng 🙂‍↕️', 'https://www.facebook.com/groups/utethacmachoctap/posts/2173940120097150/', '2026-04-27 03:46:03', 
    4, 14, 32, 'Học vụ & Đăng ký môn', -0.2, 'Sinh viên bày tỏ sự sốt ruột và lo lắng về quy trình xét tốt nghiệp tự động, mong chờ kết quả sớm để giảm bớt căng thẳng.', 'Trung lập', '2026-04-28 17:26:13.403'
),
(
    '48fc02cd3f317e51b504c90d8beea937', 'Người tham gia ẩn danh', 'Em có đăng ký Mooc_nhóm 35 pldc cô Hương mà sao em chưa thấy thông báo gì hết vậy ạ? Lần đầu em học Mooc nên hơi bỡ ngỡ mong anh chị giúp', 'https://www.facebook.com/groups/utethacmachoctap/posts/2175012023323293/', '2026-04-28 08:33:18', 
    0, 1, 2, 'Học vụ & Đăng ký môn', 0.0, 'Sinh viên thắc mắc về việc chưa nhận được thông báo cho môn học Mooc đã đăng ký, cần nhà trường hoặc giảng viên cung cấp thông tin kịp thời về khóa học.', 'Trung lập', '2026-04-28 17:26:13.403'
),
(
    'aec3f6bf01d739166ad20e944c2f1bc0', 'Dừa dằm sữa đặc', 'Mn ơi có ai học moc nhóm 4 tư tưởng Hồ Chí Minh đợt 2 này, do cô Phượng dạy mà chưa có nhóm hông mn, với lại đăng kí nhóm ở đâu ấy:,))) đọc thông báo thấy rối quá', 'https://www.facebook.com/groups/utethacmachoctap/posts/2175327663291729/', '2026-04-28 16:25:01', 
    0, 3, 6, 'Học vụ & Đăng ký môn', -0.2, 'Sinh viên học MOOC nhóm 4 môn tư tưởng Hồ Chí Minh gặp khó khăn trong việc tìm nhóm và không biết cách đăng ký nhóm vì thông báo của trường quá rối. Nhà trường cần cải thiện sự rõ ràng và chi tiết của các thông báo quy trình học tập.', 'Trung lập', '2026-04-28 17:26:13.403'
),
(
    '2229c0813f50580f5c333e9ddc3aba4b', 'Người tham gia ẩn danh', 'Không biết trong group mình có bạn nào nhận kèm Lý 1 và xstk không ạ? Nếu có mọi người cứ cmt thông tin phía dưới mình sẽ chủ động liên hệ ạ. Cảm ơn add đã duyệt bài.', 'https://www.facebook.com/groups/utethacmachoctap/posts/2174791600012002/', '2026-04-28 02:05:30', 
    0, 3, 6, 'Học vụ & Đăng ký môn', 0.0, 'Sinh viên đang tìm kiếm bạn nhận kèm môn Lý 1 và XSTK để cải thiện kết quả học tập. Đây là nhu cầu tìm kiếm hỗ trợ học thuật từ cộng đồng sinh viên.', 'Trung lập', '2026-04-28 17:26:13.403'
),
(
    '88712d0255f9a77d798a364127191a31', 'Người tham gia ẩn danh', 'mình lần đầu học khóa MOOC, mình tìm nhóm kiểu j thế mn, không thể xem danh sách sinh viên trong nhóm zalo', 'https://www.facebook.com/groups/utethacmachoctap/posts/2175328089958353/', '2026-04-28 16:35:08', 
    0, 1, 2, 'Học vụ & Đăng ký môn', 0.0, 'Sinh viên lần đầu học MOOC gặp khó khăn trong việc tìm nhóm và không thể xem danh sách thành viên trong nhóm Zalo. Nhà trường cần cung cấp hướng dẫn rõ ràng hơn về quy trình tham gia và quản lý nhóm học cho sinh viên mới.', 'Trung lập', '2026-04-28 17:26:13.403'
),
(
    '1cfb939eb57447c273d3261ba185a7e4', 'Người tham gia ẩn danh', 'Mình làm đơn xin nhận điểm I trêng trang online r thì có cần nộp trực tiếp giấy tờ j nữa ko ạ, nếu có thì thời gian nộp là khi nào vậy', 'https://www.facebook.com/groups/utethacmachoctap/posts/2175314513293044/', '2026-04-28 16:06:05', 
    0, 4, 8, 'Học vụ & Đăng ký môn', 0.0, 'Sinh viên hỏi về quy trình nộp giấy tờ sau khi đăng ký xin điểm I online, muốn biết có cần nộp bản cứng và thời hạn nộp nếu có. Đây là một câu hỏi về thủ tục hành chính học vụ.', 'Trung lập', '2026-04-28 17:26:13.403'
),
(
    '85dd063468c2c807a0377019efa83ee5', 'Hướng nội thích MXH', 'Lớp Mooc LSĐ thầy Chung có vào gr zalo hay có thông báo gì chưa mn?', 'https://www.facebook.com/groups/utethacmachoctap/posts/2175337663290729/', '2026-04-28 16:40:40', 
    0, 1, 2, 'Học vụ & Đăng ký môn', 0.0, 'Sinh viên hỏi về thông báo hoặc nhóm Zalo cho lớp Mooc Lịch sử Đảng thầy Chung, thể hiện nhu cầu thông tin rõ ràng và kênh liên lạc chính thức.', 'Trung lập', '2026-04-28 17:26:13.403'
),
(
    '1cc3fb0d545fd4f9a77dad5bff8178c0', 'Người tham gia ẩn danh', 'Em chào mn.Em có đăng kí 1 môn xong em hủy nhưng trong phần kết quả học tập vẫn có.Còn trong phần thanh toán học phí và thời khó biểu ko có thì môn đó em đã hủy thành công chưa ạ.Em cảm ơn ạ.', 'https://www.facebook.com/groups/utethacmachoctap/posts/2175333096624519/', '2026-04-28 16:33:16', 
    0, 1, 2, 'Học vụ & Đăng ký môn', 0.0, 'Sinh viên thắc mắc về trạng thái hủy môn học, vì môn đó vẫn hiển thị trong kết quả học tập nhưng không có trong thanh toán hay thời khóa biểu, gây bối rối về việc hủy thành công.', 'Trung lập', '2026-04-28 17:26:13.403'
),
(
    '8f5f455e8f8ec2a6a16f0459831271d2', 'Người tham gia ẩn danh', 'Cho mình hỏi là nếu mình cần nộp phúc khảo điểm mà bị vướng lịch hc quốc phòng thì làm như nào để có thể nộp đơn đc v ạ', 'https://www.facebook.com/groups/utethacmachoctap/posts/2176193203205175/', '2026-04-29 16:41:19', 
    0, 1, 2, 'Học vụ & Đăng ký môn', 0.0, 'Sinh viên hỏi về cách nộp đơn phúc khảo điểm khi bị trùng lịch học quốc phòng, cần hướng dẫn quy trình giải quyết tình huống đặc biệt này.', 'Trung lập', '2026-04-29 17:11:03.287'
),
(
    'da63ceafcaacde622b0824c6edc47c13', 'Người tham gia ẩn danh', 'Dạ a/c cho e hỏi môn thí nghiệm vật lý 1 sẽ học những gì và kiểm tra ntn ạ, dạ với lại dễ lấy điểm cao k ạ', 'https://www.facebook.com/groups/utethacmachoctap/posts/2176184349872727/', '2026-04-29 16:27:54', 
    2, 2, 6, 'Học vụ & Đăng ký môn', 0.0, 'Sinh viên cần thông tin chi tiết về nội dung môn thí nghiệm Vật lý 1, cách thức kiểm tra và khả năng đạt điểm cao để chuẩn bị tốt cho việc học.', 'Trung lập', '2026-04-29 17:11:03.287'
),
(
    '5112aed04af424c5cc46c6bd92ccbaf6', 'Người tham gia ẩn danh', 'Mọi người cho em hỏi chứng chỉ tiếng Anh aptis có được miễn avdr không mn', 'https://www.facebook.com/groups/utethacmachoctap/posts/2148446855979810/', '2026-03-27 17:37:22', 
    0, 2, 4, 'Học vụ & Đăng ký môn', 0.0, 'Sinh viên hỏi về quy định miễn học phần tiếng Anh đầu vào bằng chứng chỉ Aptis để nắm rõ thủ tục và điều kiện.', 'Trung lập', '2026-04-29 17:11:03.287'
),
(
    '22a1ebf738fcc6b5c34e1c0339514af3', 'Người tham gia ẩn danh', 'anh chị ơi cứu e sao nó cứ báo lỗi có cách nào khắc phục không ạ', 'https://www.facebook.com/groups/utethacmachoctap/posts/2176187383205757/', '2026-04-29 16:32:34', 
    0, 2, 4, 'Học vụ & Đăng ký môn', -0.3, 'Sinh viên đang gặp lỗi khi sử dụng một hệ thống hoặc thực hiện một thao tác nào đó và cần được hỗ trợ khắc phục. Cần xác định lỗi cụ thể để hỗ trợ.', 'Trung lập', '2026-04-29 17:14:25.838'
),
(
    '5bc05d0e015bb7b38d6952670bd394ad', 'Người tham gia ẩn danh', 'utex sập rồi hả mọi người, bao giờ vào lại được vậy ạa', 'https://www.facebook.com/groups/utethacmachoctap/posts/2176144716543357/', '2026-04-29 15:47:28', 
    0, 1, 2, 'Học vụ & Đăng ký môn', -0.3, 'Hệ thống utex đang gặp sự cố và không thể truy cập, gây gián đoạn cho sinh viên. Cần thông báo thời gian khắc phục và khôi phục hoạt động.', 'Trung lập', '2026-04-29 17:14:25.838'
),
(
    'e17124a8272d191463f53b9d083ab8ce', 'Người tham gia ẩn danh', 'anh chị cho em hỏi e chưa học avgt1-2 có đk thi avdr được k ạ', 'https://www.facebook.com/groups/utethacmachoctap/posts/2176134236544405/', '2026-04-29 15:15:52', 
    1, 6, 13, 'Học vụ & Đăng ký môn', 0.0, 'Sinh viên hỏi về điều kiện dự thi chứng chỉ ngoại ngữ AVDR khi chưa hoàn thành các môn AVGT1-2, cần được giải đáp về quy định học vụ.', 'Trung lập', '2026-04-29 17:19:07.868'
),
(
    '794fc61a9365415615a9f168231a4a91', 'Người tham gia ẩn danh', 'Dạ cho em hỏi mình đăng ký thi avdr xong thì coi lịch thi ở đâu ạ', 'https://www.facebook.com/groups/utethacmachoctap/posts/2173241440167018/', '2026-04-26 08:36:12', 
    2, 3, 8, 'Học vụ & Đăng ký môn', 0.0, 'Sinh viên hỏi về cách tra cứu lịch thi sau khi đã đăng ký thi chứng chỉ AVDR, cho thấy có thể thông tin về lịch thi chưa được hiển thị rõ ràng.', 'Trung lập', '2026-04-29 17:19:07.868'
),
(
    'e673f96684c7c1711ebdc83709725c57', 'Người tham gia ẩn danh', 'Cho em hỏi bằng b1 Aptis có pass đầu ra và pass avgt 0,1,2 không ạ', 'https://www.facebook.com/groups/utethacmachoctap/posts/2058413104983186/', '2025-12-09 13:37:28', 
    2, 3, 8, 'Học vụ & Đăng ký môn', 0.0, 'Sinh viên thắc mắc về việc chứng chỉ B1 Aptis có được công nhận để đạt chuẩn đầu ra và các môn AVGT 0,1,2 hay không, cần thông tin rõ ràng về quy đổi tín chỉ ngoại ngữ.', 'Trung lập', '2026-04-29 17:19:07.868'
),
(
    '666075d6939ec84ce64a1875b420423f', 'BrilliantLynx2509', 'Cho em hỏi chứng chỉ aptis cho khóa k23 chỉ cần B1 thôi phải không ạ? Có yêu cầu là B1 nhưng tổng điểm phải trên bao nhiêu điểm mới được xét không ạ?', 'https://www.facebook.com/groups/utethacmachoctap/posts/2155015325322963/', '2026-04-04 09:47:32', 
    2, 3, 8, 'Học vụ & Đăng ký môn', 0.0, 'Sinh viên thắc mắc về tiêu chuẩn chứng chỉ Aptis B1 cho khóa K23, cụ thể là liệu có yêu cầu điểm tổng tối thiểu nào kèm theo hay không, cần nhà trường làm rõ quy định.', 'Trung lập', '2026-04-29 17:19:07.868'
),
(
    '521824a6ae3a2ead33564166d62a9739', 'keoconhocute', 'Em vừa mới rớt môn mạch điện ạ, theo mọi người thì em nên trả nợ môn này vào năm 2 hay 3 là ổn nhất mà không bị quá nặng kiến thức ạ.', 'https://www.facebook.com/groups/utethacmachoctap/posts/2176171133207382/', '2026-04-29 16:08:38', 
    1, 6, 13, 'Học vụ & Đăng ký môn', 0.0, 'Sinh viên vừa rớt môn mạch điện và đang tìm lời khuyên về thời điểm thích hợp để học lại môn này nhằm tránh quá tải kiến thức. Đây là một câu hỏi học vụ thông thường.', 'Trung lập', '2026-04-29 17:19:07.868'
),
(
    'd8e9ff366058cfcd2be593d49ac13f73', 'Hướng nội thích MXH', 'mọi người ơi sao hội thao em không thấy Bóng đá Nữ ạ? em nghe bảo mấy năm trước có mà ạ 😭 đừng bỏ đá bóng nữ mà em mong chờ từ đầu năm tới giờ, help me plsssss', 'https://www.facebook.com/groups/utethacmachoctap/posts/2126293278195168/', '2026-03-01 09:56:46', 
    1, 1, 3, 'Đời sống sinh viên', -0.6, 'Sinh viên bày tỏ sự thất vọng sâu sắc và đề nghị nhà trường xem xét lại quyết định bỏ môn Bóng đá Nữ trong hội thao, vì đây là hoạt động được nhiều sinh viên mong chờ và quan tâm.', 'Tiêu cực', '2026-03-31 15:29:45.402'
),
(
    'e30a7fc4daafacd37fff926c21d2daad', 'Khầy Kụt nè coăn 🐧🐧🐧', 'Tiến ơi Tiến, chơi tiktok lịch sự tí đi e. Cán bộ lụm đó e', 'https://www.facebook.com/groups/utethacmachoctap/posts/2126209124870250/', '2026-03-01 09:56:45', 
    32, 14, 60, 'Đời sống sinh viên', -0.2, 'Một sinh viên đang nhắc nhở bạn cùng trường về việc sử dụng TikTok không lịch sự, cảnh báo hành vi này có thể bị cán bộ nhà trường xử lý. Vấn đề liên quan đến ý thức và hành vi cá nhân của sinh viên trong môi trường chung cần được lưu ý.', 'Trung lập', '2026-03-31 15:29:45.402'
),
(
    '8ef7a9a2f8f4715c0fb92417d30dd7c7', 'thangthatbai123', 'ac ơi em hối hận quá!em mới năm nhất thôi đã rớt hơn 8 tín và bị hạ bằng chỉ vì ham chơi em sợ cầm tấm bằng khá sẽ không có tương lai quá g em phải làm sao ạ😞', 'https://www.facebook.com/groups/utethacmachoctap/posts/2166681710822991/', '2026-04-19 03:47:10', 
    33, 55, 143, 'Đời sống sinh viên', -0.7, 'Sinh viên năm nhất bày tỏ sự hối hận và lo lắng sâu sắc vì đã rớt nhiều tín chỉ và bị hạ bằng do ham chơi. Sinh viên sợ tấm bằng khá sẽ ảnh hưởng đến tương lai và đang tìm kiếm lời khuyên để khắc phục tình hình học tập và định hướng nghề nghiệp.', 'Tiêu cực', '2026-04-19 05:05:33.904'
),
(
    '60641a516d6575684c159710fcd1bd38', 'Người tham gia ẩn danh', 'rớt mạch điện có phải là quá tệ ko ạ, em lần đầu rớt môn, giờ buồn và stress quá ạ😔', 'https://www.facebook.com/groups/utethacmachoctap/posts/2175215486636280/', '2026-04-28 14:01:45', 
    7, 10, 27, 'Đời sống sinh viên', -0.3, 'Sinh viên bày tỏ nỗi buồn và căng thẳng vì lần đầu rớt môn mạch điện, tìm kiếm sự đồng cảm và lời khuyên từ cộng đồng.', 'Trung lập', '2026-04-28 17:26:13.403'
),
(
    '4eccfff654fda67c1c8a8ca996b376f0', 'Người tham gia ẩn danh', 'Dạ cho em hỏi là nếu học TOEIC hoặc IELTS thì em nên học ở đâu, em ở khu vực gần trường mình ạ', 'https://www.facebook.com/groups/utethacmachoctap/posts/2175288569962305/', '2026-04-28 15:28:41', 
    3, 8, 19, 'Đời sống sinh viên', 0.0, 'Sinh viên hỏi cộng đồng về các trung tâm học TOEIC hoặc IELTS uy tín ở khu vực gần trường.', 'Trung lập', '2026-04-28 17:26:13.403'
),
(
    '290b60a806f91dc5161d3941ca6264fa', 'Người tham gia ẩn danh', 'Mình học tư tưởng hcm cô phượng(mooc-nhóm 4).Hiện nhóm mình còn thiếu 3 bạn,bạn nào chưa có nhóm để lại zalo mình ib rồi vào nhóm nhaaa', 'https://www.facebook.com/groups/utethacmachoctap/posts/2175316289959533/', '2026-04-28 16:35:12', 
    1, 3, 7, 'Đời sống sinh viên', 0.0, 'Sinh viên tìm kiếm 3 thành viên cho nhóm môn Tư tưởng Hồ Chí Minh (MOOC) của cô Phượng, yêu cầu các bạn chưa có nhóm để lại Zalo để liên hệ.', 'Trung lập', '2026-04-28 17:26:13.403'
),
(
    '16f712b75470cd82d9edfa5b20e09d3a', 'Người tham gia ẩn danh', 'Mấy anh chị bạn bè nào có học môn vẽ kỹ thuật rồi thì cho em xin phép hỏi muốn mua mấy cái dụng cụ để vẽ thì nên mua ở chỗ nào gần trường ạ', 'https://www.facebook.com/groups/utethacmachoctap/posts/2176176029873559/', '2026-04-29 16:15:46', 
    0, 2, 4, 'Đời sống sinh viên', 0.0, 'Sinh viên hỏi tìm địa điểm mua dụng cụ vẽ kỹ thuật gần trường, cần thông tin về các cửa hàng cung cấp vật tư học tập cho môn học.', 'Trung lập', '2026-04-29 17:11:03.287'
),
(
    '764b4a71b7e0fe25b64ef0a2e5a5b0b0', 'Người tham gia ẩn danh', 'Có bạn nào học lớp chiều thứ 7 cô Huyền Châu được tham gia gr zalo hông , cho mình xin vô với ạ .', 'https://www.facebook.com/groups/utethacmachoctap/posts/2174454683379027/', '2026-04-27 18:14:35', 
    1, 1, 3, 'Đời sống sinh viên', 0.0, 'Sinh viên tìm kiếm link nhóm Zalo của lớp học chiều thứ 7 cô Huyền Châu để tham gia.', 'Trung lập', '2026-04-29 17:14:25.838'
),
(
    '2d10da37cf33a6fd4e8293a1a7dec96c', 'Người tham gia ẩn danh', 'nhận học bù cho mọi người về quê chơi lễ, mình là nam, ai cần thì để lại sđt dưới BL nhé', 'https://www.facebook.com/groups/utethacmachoctap/posts/2176205403203955/', '2026-04-29 16:59:40', 
    4, 3, 10, 'Đời sống sinh viên', 0.0, 'Sinh viên đăng bài nhận học bù hộ bạn bè về quê chơi lễ, cho thấy tiềm ẩn rủi ro gian lận trong điểm danh.', 'Trung lập', '2026-04-29 17:14:25.838'
),
(
    '6bff6adbd5f8b19696e484b212749323', 'Người tham gia ẩn danh', 'Dạ k biết trường mình có tổ chức các sự kiện giống như ghép đối đường phố k ạ, chứ e cô đơn quá huhu', 'https://www.facebook.com/groups/utethacmachoctap/posts/2176098976547931/', '2026-04-29 14:26:53', 
    60, 66, 192, 'Đời sống sinh viên', -0.1, 'Sinh viên hỏi liệu trường có tổ chức các sự kiện ghép đôi hoặc hoạt động xã hội tương tự không vì cảm thấy cô đơn, mong muốn trường tăng cường các hoạt động kết nối cho sinh viên.', 'Trung lập', '2026-04-29 17:14:25.838'
),
(
    '3dccc867867a572e4736e42a8f4b58f4', 'Người tham gia ẩn danh', 'có bạn nào học av4 lớp cô Thanh Hằng ngày t4 không ạ, mình có việc phải nghỉ nên cho mình hỏi ít việc với ạ', 'https://www.facebook.com/groups/utethacmachoctap/posts/2070556787102151/', '2025-12-25 01:59:33', 
    1, 8, 17, 'Đời sống sinh viên', 0.0, 'Sinh viên tìm kiếm thông tin bài học từ bạn học do nghỉ buổi học AV4 lớp cô Thanh Hằng.', 'Trung lập', '2026-04-29 17:14:25.838'
);
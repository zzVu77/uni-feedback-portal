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
        'thanhtra@uni.edu.vn',
        'Chủ trì công tác thanh tra, kiểm tra nội bộ; giám sát việc thực hiện chính sách, pháp luật, quy chế đào tạo và nề nếp giảng dạy; tiếp nhận và giải quyết khiếu nại, tố cáo; thực hiện công tác phòng chống tham nhũng và đảm bảo kỷ cương trong nhà trường.',
        'Tòa nhà A - Phòng A101',
        '028 3896 1001',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000002',
        'Phòng Quan hệ doanh nghiệp',
        'qhdn@uni.edu.vn',
        'Xây dựng chiến lược hợp tác doanh nghiệp; tổ chức các hoạt động kết nối, ngày hội việc làm và hội thảo hướng nghiệp; tìm kiếm và phát triển nguồn học bổng tài trợ; hỗ trợ sinh viên tìm kiếm địa điểm thực tập và việc làm sau tốt nghiệp.',
        'Tòa nhà A - Phòng A102',
        '028 3896 1002',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000003',
        'Phòng Khoa học & Công nghệ',
        'khcn@uni.edu.vn',
        'Tham mưu và quản lý hoạt động nghiên cứu khoa học, chuyển giao công nghệ; quản lý các đề tài, dự án khoa học các cấp; tổ chức các hội nghị, hội thảo khoa học; thúc đẩy hoạt động sở hữu trí tuệ và khởi nghiệp đổi mới sáng tạo.',
        'Tòa nhà A - Phòng A201',
        '028 3896 1003',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000004',
        'Phòng Quan hệ quốc tế',
        'qhqt@uni.edu.vn',
        'Đầu mối quản lý các hoạt động hợp tác quốc tế; xây dựng và triển khai các chương trình trao đổi giảng viên, sinh viên; quản lý các dự án liên kết đào tạo với đối tác nước ngoài; thực hiện công tác lễ tân đối ngoại và tiếp đón đoàn khách quốc tế.',
        'Tòa nhà A - Phòng A202',
        '028 3896 1004',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000005',
        'Phòng Thiết bị – Vật tư',
        'tbvt@uni.edu.vn',
        'Lập kế hoạch và thực hiện mua sắm, cấp phát tài sản, trang thiết bị, vật tư phục vụ đào tạo và nghiên cứu; quản lý, theo dõi và tổ chức bảo trì, bảo dưỡng định kỳ hệ thống máy móc, thiết bị kỹ thuật toàn trường.',
        'Tòa nhà A - Phòng A301',
        '028 3896 1005',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000006',
        'Phòng Quản trị chiến lược',
        'chienluoc@uni.edu.vn',
        'Nghiên cứu, xây dựng và rà soát chiến lược phát triển Trường trung hạn và dài hạn; xây dựng hệ thống chỉ số đánh giá hiệu quả hoạt động (KPIs); phân tích dữ liệu và tư vấn cho Ban Giám hiệu về định hướng phát triển.',
        'Tòa nhà A - Phòng A302',
        '028 3896 1006',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000007',
        'Phòng Đảm bảo chất lượng',
        'qa@uni.edu.vn',
        'Xây dựng và vận hành hệ thống đảm bảo chất lượng bên trong; tổ chức tự đánh giá và đánh giá ngoài cơ sở giáo dục và chương trình đào tạo; thực hiện khảo sát ý kiến các bên liên quan để cải tiến liên tục chất lượng giáo dục.',
        'Tòa nhà A - Phòng A401',
        '028 3896 1007',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000008',
        'Phòng Tổ chức Hành chính',
        'tchc@uni.edu.vn',
        'Tham mưu về cơ cấu tổ chức, nhân sự, quy hoạch cán bộ; thực hiện chế độ chính sách, bảo hiểm xã hội; quản lý công tác văn thư, lưu trữ, hành chính, lễ tân khánh tiết và đảm bảo an ninh trật tự trong khuôn viên Trường.',
        'Tòa nhà A - Phòng A402',
        '028 3896 1008',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000009',
        'Phòng Quản trị cơ sở vật chất',
        'qtcsvc@uni.edu.vn',
        'Quản lý quy hoạch đất đai và đầu tư xây dựng cơ bản; quản lý, sửa chữa cơ sở hạ tầng, giảng đường, phòng làm việc; đảm bảo cung cấp điện, nước và vệ sinh môi trường, cảnh quan xanh - sạch - đẹp.',
        'Tòa nhà A - Phòng A501',
        '028 3896 1009',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000010',
        'Phòng Tuyển sinh và CTSV',
        'ctsv@uni.edu.vn',
        'Tư vấn tuyển sinh và truyền thông tuyển sinh; quản lý hồ sơ và dữ liệu sinh viên; thực hiện các chế độ chính sách, học bổng, miễn giảm học phí; tổ chức tuần sinh hoạt công dân và giáo dục chính trị tư tưởng cho sinh viên.',
        'Tòa nhà A - Tầng trệt',
        '028 3896 1010',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000011',
        'Phòng Kế hoạch – Tài chính',
        'khtc@uni.edu.vn',
        'Xây dựng kế hoạch tài chính và dự toán ngân sách hàng năm; quản lý nguồn thu, thực hiện chi trả lương và các khoản chi hoạt động; thực hiện công tác kế toán, kiểm soát chi tiêu và báo cáo tài chính theo quy định nhà nước.',
        'Tòa nhà A - Phòng A105',
        '028 3896 1011',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000012',
        'Phòng Đào tạo',
        'pdt@uni.edu.vn',
        'Tham mưu xây dựng và quản lý chương trình đào tạo; lập thời khóa biểu, kế hoạch giảng dạy; tổ chức đăng ký học phần, thi kết thúc học phần; xét công nhận tốt nghiệp và quản lý cấp phát văn bằng, chứng chỉ.',
        'Tòa nhà A - Phòng A106',
        '028 3896 1012',
        NOW()
    ),
    (
        'd0000000-0000-0000-0000-000000000013',
        'Phòng Truyền thông',
        'pr@uni.edu.vn',
        'Xây dựng và quản trị nhận diện thương hiệu Nhà trường; quản lý vận hành website, mạng xã hội chính thức; tổ chức sự kiện truyền thông, quan hệ báo chí và xử lý khủng hoảng truyền thông.',
        'Tòa nhà A - Phòng A205',
        '028 3896 1013',
        NOW()
    ),

-- 2. KHỐI KHOA CHUYÊN MÔN
(
    'd0000000-0000-0000-0000-000000000014',
    'Khoa Xây dựng',
    'khoaxaydung@uni.edu.vn',
    'Đào tạo kỹ sư và cử nhân các chuyên ngành xây dựng dân dụng, cầu đường, kiến trúc; nghiên cứu các giải pháp kết cấu, vật liệu mới và quy hoạch đô thị bền vững; tổ chức thực hành, thực tập công trình cho sinh viên.',
    'Tòa nhà B - Phòng B101',
    '028 3896 2014',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000015',
    'Khoa CN Hóa học & Thực phẩm',
    'khoahoa@uni.edu.vn',
    'Đào tạo chuyên sâu về công nghệ hóa học, công nghệ thực phẩm, công nghệ sinh học; nghiên cứu phát triển sản phẩm thực phẩm, quy trình chế biến và kiểm nghiệm an toàn vệ sinh thực phẩm.',
    'Tòa nhà B - Phòng B201',
    '028 3896 2015',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000016',
    'Khoa Công nghệ Thông tin',
    'fit@uni.edu.vn',
    'Đào tạo nhân lực chất lượng cao lĩnh vực Công nghệ phần mềm, Hệ thống thông tin, Mạng máy tính và Trí tuệ nhân tạo; nghiên cứu ứng dụng chuyển đổi số và phát triển các giải pháp phần mềm thông minh.',
    'Tòa nhà C - Phòng C501',
    '028 3896 2016',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000017',
    'Khoa Cơ khí động lực',
    'ckdl@uni.edu.vn',
    'Đào tạo kỹ sư công nghệ kỹ thuật ô tô, máy động lực, xe điện; nghiên cứu cải tiến hiệu suất động cơ và công nghệ ô tô thông minh; quản lý hệ thống xưởng thực hành động cơ hiện đại.',
    'Xưởng Thực hành Ô tô',
    '028 3896 2017',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000018',
    'Khoa CN May & Thời trang',
    'maythoitrang@uni.edu.vn',
    'Đào tạo lĩnh vực thiết kế thời trang, công nghệ may và kinh doanh thời trang; tổ chức các show diễn thời trang sinh viên; nghiên cứu xu hướng và kỹ thuật may mặc tiên tiến.',
    'Tòa nhà F - Phòng F101',
    '028 3896 2018',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000019',
    'Khoa Điện – Điện tử',
    'feee@uni.edu.vn',
    'Đào tạo kỹ sư điện, điện tử viễn thông, tự động hóa và điều khiển; nghiên cứu về năng lượng tái tạo, vi mạch bán dẫn và hệ thống nhúng; quản lý các phòng thí nghiệm điện hiện đại.',
    'Tòa nhà C - Phòng C301',
    '028 3896 2019',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000020',
    'Khoa Cơ khí Chế tạo máy',
    'ckm@uni.edu.vn',
    'Đào tạo chuyên ngành kỹ thuật cơ khí, chế tạo máy, cơ điện tử và robot công nghiệp; nghiên cứu công nghệ CAD/CAM/CNC và thiết kế máy; vận hành xưởng cơ khí trung tâm phục vụ thực hành.',
    'Xưởng Cơ khí Trung tâm',
    '028 3896 2020',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000021',
    'Khoa Lý luận chính trị',
    'llct@uni.edu.vn',
    'Giảng dạy các môn lý luận chính trị (Triết học, Kinh tế chính trị...), Pháp luật đại cương; tuyên truyền đường lối chính sách của Đảng và Nhà nước; giáo dục đạo đức cách mạng cho sinh viên.',
    'Tòa nhà B - Phòng B501',
    '028 3896 2021',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000022',
    'Khoa Khoa học cơ bản',
    'khcb@uni.edu.vn',
    'Giảng dạy các môn khoa học cơ sở (Toán, Vật lý, Hóa đại cương) làm nền tảng cho các ngành kỹ thuật; tổ chức các kỳ thi Olympic sinh viên; nghiên cứu khoa học cơ bản và ứng dụng.',
    'Tòa nhà B - Phòng B601',
    '028 3896 2022',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000023',
    'Khoa In & Truyền thông',
    'inbaochi@uni.edu.vn',
    'Đào tạo kỹ sư công nghệ in, thiết kế đồ họa và truyền thông đa phương tiện; nghiên cứu công nghệ in ấn hiện đại và quy trình xuất bản số; hợp tác với các nhà xuất bản và công ty bao bì.',
    'Tòa nhà F - Phòng F201',
    '028 3896 2023',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000024',
    'Khoa Ngoại ngữ',
    'kngoangu@uni.edu.vn',
    'Đào tạo cử nhân Ngôn ngữ Anh và Tiếng Anh chuyên ngành kỹ thuật; giảng dạy Tiếng Anh không chuyên cho toàn trường; tổ chức các hoạt động ngoại khóa, câu lạc bộ tiếng Anh và thi chứng chỉ quốc tế.',
    'Tòa nhà E - Phòng E101',
    '028 3896 2024',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000025',
    'Khoa Kinh tế',
    'kinhte@uni.edu.vn',
    'Đào tạo các ngành Quản trị kinh doanh, Kế toán, Thương mại điện tử và Logistics; nghiên cứu về kinh tế học, quản trị doanh nghiệp và khởi nghiệp; kết nối thực tập tại các tập đoàn kinh tế.',
    'Tòa nhà E - Phòng E201',
    '028 3896 2025',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000026',
    'Khoa Đào tạo chất lượng cao',
    'clc@uni.edu.vn',
    'Quản lý và vận hành các chương trình đào tạo Chất lượng cao, Tiên tiến và Liên kết quốc tế; cung cấp môi trường học tập tiêu chuẩn quốc tế; tăng cường đào tạo ngoại ngữ và kỹ năng mềm chuyên sâu.',
    'Tòa nhà A - Phòng A601',
    '028 3896 2026',
    NOW()
),

-- 3. TRUNG TÂM VÀ VIỆN NGHIÊN CỨU
(
    'd0000000-0000-0000-0000-000000000027',
    'Trung tâm Dịch vụ sinh viên',
    'dichvusv@uni.edu.vn',
    'Cung cấp và quản lý các dịch vụ tiện ích hỗ trợ đời sống sinh viên: Căng tin, siêu thị tiện lợi, giữ xe, dịch vụ văn phòng phẩm; đảm bảo vệ sinh an toàn thực phẩm và chất lượng dịch vụ trong khuôn viên.',
    'Khu Dịch vụ - Canteen',
    '028 3896 3027',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000028',
    'Trung tâm Dạy học số',
    'elearning@uni.edu.vn',
    'Xây dựng và phát triển hệ thống quản lý học tập (LMS); số hóa học liệu và bài giảng; hỗ trợ giảng viên và sinh viên ứng dụng công nghệ thông tin trong dạy và học; triển khai đào tạo trực tuyến.',
    'Tòa nhà Thông minh - Tầng 3',
    '028 3896 3028',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000029',
    'Trung tâm Thông tin – Máy tính',
    'ttmt@uni.edu.vn',
    'Quản trị hệ thống mạng, máy chủ (Server) và trung tâm dữ liệu; đảm bảo an ninh mạng và an toàn thông tin; hỗ trợ kỹ thuật phần cứng, phần mềm và vận hành các phần mềm quản lý của Nhà trường.',
    'Tòa nhà C - Phòng Server',
    '028 3896 3029',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000030',
    'TT GD Thể chất và Quốc phòng',
    'gdtcqp@uni.edu.vn',
    'Tổ chức giảng dạy các học phần Giáo dục thể chất và Giáo dục Quốc phòng - An ninh; quản lý nhà thi đấu, sân bãi thể thao; tổ chức các giải đấu thể thao và phong trào rèn luyện sức khỏe cho sinh viên.',
    'Nhà Thi đấu Đa năng',
    '028 3896 3030',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000031',
    'Viện Sư phạm kỹ thuật',
    'spkt@uni.edu.vn',
    'Nghiên cứu khoa học về giáo dục nghề nghiệp; đào tạo, bồi dưỡng nghiệp vụ sư phạm cho giảng viên và giáo viên dạy nghề; tư vấn đổi mới phương pháp giảng dạy và kiểm tra đánh giá theo hướng tiếp cận năng lực.',
    'Tòa nhà A - Phòng A701',
    '028 3896 3031',
    NOW()
),

-- 4. ĐOÀN THỂ VÀ ĐƠN VỊ PHỤC VỤ
(
    'd0000000-0000-0000-0000-000000000032',
    'Đoàn trường & Hội Sinh viên',
    'doanthanhnien@uni.edu.vn',
    'Tổ chức và chỉ đạo các hoạt động phong trào Đoàn, Hội; giáo dục kỹ năng thực hành xã hội; tổ chức các chiến dịch tình nguyện, văn hóa văn nghệ, hỗ trợ sinh viên trong học tập và đời sống.',
    'Nhà Văn hóa Sinh viên',
    '028 3896 4032',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000033',
    'Trạm Y tế',
    'yte@uni.edu.vn',
    'Thực hiện chăm sóc sức khỏe ban đầu, sơ cấp cứu cho cán bộ và sinh viên; tổ chức khám sức khỏe định kỳ; tuyên truyền phòng chống dịch bệnh và kiểm tra vệ sinh an toàn thực phẩm trong trường học.',
    'Khu Y tế',
    '028 3896 4033',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000034',
    'Thư viện',
    'thuvien@uni.edu.vn',
    'Thu thập, xử lý và cung cấp tài nguyên thông tin, sách, báo, tạp chí chuyên ngành; quản lý cơ sở dữ liệu số; tổ chức không gian đọc và tự học hiện đại; hướng dẫn người dùng tin và phát triển văn hóa đọc.',
    'Tòa nhà Thư viện Trung tâm',
    '028 3896 4034',
    NOW()
),
(
    'd0000000-0000-0000-0000-000000000035',
    'Ban Quản lý ký túc xá',
    'ktx@uni.edu.vn',
    'Quản lý toàn diện khu nội trú sinh viên; bố trí chỗ ở, đảm bảo an ninh trật tự, vệ sinh môi trường; tổ chức các hoạt động văn hóa, thể thao và hỗ trợ đời sống tinh thần cho sinh viên nội trú.',
    'Văn phòng KTX Khu A',
    '028 3896 4035',
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
    (
        'b0000000-0000-0000-0000-000000000016',
        'Giáo vụ Khoa CNTT',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'staff.fit@uni.edu.vn',
        'DEPARTMENT_STAFF',
        'd0000000-0000-0000-0000-000000000016',
        NOW()
    ),
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
    (
        'b0000000-0000-0000-0000-000000000034',
        'Thủ thư Thư viện',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'staff.thuvien@uni.edu.vn',
        'DEPARTMENT_STAFF',
        'd0000000-0000-0000-0000-000000000034',
        NOW()
    ),
    (
        'b0000000-0000-0000-0000-000000000035',
        'Quản lý KTX',
        '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC',
        'staff.ktx@uni.edu.vn',
        'DEPARTMENT_STAFF',
        'd0000000-0000-0000-0000-000000000035',
        NOW()
    );

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
        "userId",
        "departmentId",
        "categoryId",
        "subject",
        "description",
        "location",
        "currentStatus",
        "isPrivate",
        "createdAt"
    )
VALUES (
        'f0000000-0000-0000-0000-000000000001',
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000009',
        'c0000000-0000-0000-0000-000000000001',
        'Máy lạnh phòng A302 chảy nước',
        'Máy lạnh phía trên bảng chảy nước tong tỏng xuống bàn giáo viên.',
        'Phòng A302',
        'RESOLVED',
        false,
        '2025-09-05 08:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000002',
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000009',
        'c0000000-0000-0000-0000-000000000001',
        'Bàn ghế gãy chân tại sảnh C',
        'Có 2 cái ghế đá ở sảnh C bị gãy chân.',
        'Sảnh C',
        'RESOLVED',
        false,
        '2025-09-06 09:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000003',
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000009',
        'c0000000-0000-0000-0000-000000000001',
        'Đèn hành lang khu B tối om',
        'Buổi tối đi học về khu B rất tối.',
        'Hành lang B2',
        'RESOLVED',
        false,
        '2025-09-10 18:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000004',
        'e0000000-0000-0000-0000-000000000004',
        'd0000000-0000-0000-0000-000000000035',
        'c0000000-0000-0000-0000-000000000001',
        'Ký túc xá mất nước liên tục',
        'Phòng 405 KTX khu A mất nước 2 ngày nay chưa có lại.',
        'KTX Khu A',
        'RESOLVED',
        false,
        '2025-09-12 07:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000005',
        'e0000000-0000-0000-0000-000000000005',
        'd0000000-0000-0000-0000-000000000009',
        'c0000000-0000-0000-0000-000000000001',
        'Thang máy tòa nhà Trung tâm bị kẹt',
        'Thang máy số 2 hay bị rung lắc.',
        'Tòa nhà Trung tâm',
        'IN_PROGRESS',
        false,
        '2025-09-20 10:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000006',
        'e0000000-0000-0000-0000-000000000010',
        'd0000000-0000-0000-0000-000000000012',
        'c0000000-0000-0000-0000-000000000002',
        'Không đăng ký được môn Lập trình Web',
        'Hệ thống báo lớp đầy dù sĩ số mới 30/60.',
        'Hệ thống Đăng ký',
        'RESOLVED',
        false,
        '2025-10-01 08:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000007',
        'e0000000-0000-0000-0000-000000000011',
        'd0000000-0000-0000-0000-000000000012',
        'c0000000-0000-0000-0000-000000000002',
        'Trùng lịch thi môn Toán cao cấp',
        'Em bị trùng lịch thi môn Toán và môn Triết.',
        NULL,
        'IN_PROGRESS',
        true,
        '2025-10-05 09:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000008',
        'e0000000-0000-0000-0000-000000000012',
        'd0000000-0000-0000-0000-000000000012',
        'c0000000-0000-0000-0000-000000000002',
        'Xin mở thêm lớp Tiếng Anh 3',
        'Hiện tại các lớp Anh 3 đã full.',
        NULL,
        'REJECTED',
        false,
        '2025-10-10 14:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000011',
        'e0000000-0000-0000-0000-000000000020',
        'd0000000-0000-0000-0000-000000000011',
        'c0000000-0000-0000-0000-000000000005',
        'Học phí bị tính sai',
        'Em đã đóng tiền nhưng hệ thống vẫn báo nợ.',
        NULL,
        'IN_PROGRESS',
        true,
        '2025-10-28 09:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000014',
        'e0000000-0000-0000-0000-000000000030',
        'd0000000-0000-0000-0000-000000000029',
        'c0000000-0000-0000-0000-000000000001',
        'Wifi thư viện không kết nối được',
        'Tầng 4 thư viện wifi rất yếu.',
        'Thư viện Tầng 4',
        'PENDING',
        false,
        '2025-11-20 14:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000016',
        'e0000000-0000-0000-0000-000000000032',
        'd0000000-0000-0000-0000-000000000028',
        'c0000000-0000-0000-0000-000000000002',
        'Lỗi nộp bài trên LMS',
        'Hệ thống LMS báo lỗi 500 khi upload file.',
        'Hệ thống LMS',
        'PENDING',
        false,
        '2025-11-25 20:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000017',
        'e0000000-0000-0000-0000-000000000040',
        'd0000000-0000-0000-0000-000000000027',
        'c0000000-0000-0000-0000-000000000006',
        'Mất mũ bảo hiểm ở nhà xe',
        'Em gửi xe ở bãi xe sinh viên bị mất mũ bảo hiểm.',
        'Nhà xe SV',
        'REJECTED',
        false,
        '2025-11-10 16:00:00'
    );

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
VALUES (
        '30000000-0000-0000-0000-000000000001',
        'f0000000-0000-0000-0000-000000000001',
        '2025-09-05 08:30:00'
    ),
    (
        '30000000-0000-0000-0000-000000000014',
        'f0000000-0000-0000-0000-000000000014',
        '2025-11-20 14:00:00'
    ),
    (
        '30000000-0000-0000-0000-000000000016',
        'f0000000-0000-0000-0000-000000000016',
        '2025-11-25 20:00:00'
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
VALUES (
        '10000000-0000-0000-0000-000000000001',
        'f0000000-0000-0000-0000-000000000001',
        'IN_PROGRESS',
        'Đã tiếp nhận phản ánh.',
        NULL,
        '2025-09-05 10:00:00'
    ),
    (
        '10000000-0000-0000-0000-000000000002',
        'f0000000-0000-0000-0000-000000000001',
        'RESOLVED',
        'Đã vệ sinh máy lạnh.',
        'Hoàn thành',
        '2025-09-07 14:00:00'
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
-- INSERT INTO
--     "Comments" (
--         "id",
--         "targetId",
--         "targetType",
--         "userId",
--         "parentId",
--         "content",
--         "createdAt"
--     )
-- VALUES

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
        "userId"
    )
VALUES

-- 1. Cán bộ Thanh tra (b...001) – 5 thông báo
(
    '60000000-0000-0000-0000-000000000001',
    'Thông báo lịch thanh tra định kỳ học kỳ I năm học 2025-2026',
    'Kính gửi quý thầy cô giáo và toàn thể sinh viên,

Căn cứ Kế hoạch công tác năm học 2025-2026, Phòng Thanh tra giáo dục sẽ tiến hành thanh tra định kỳ việc thực hiện quy chế đào tạo, đánh giá người học và đạo đức nhà giáo tại tất cả các khoa từ ngày 10/12/2025 đến ngày 28/12/2025. 
Đoàn thanh tra sẽ kiểm tra hồ sơ giảng dạy, biên bản chấm thi, bảng điểm và các tài liệu liên quan. 
Đề nghị lãnh đạo các khoa chỉ đạo giảng viên chuẩn bị đầy đủ hồ sơ theo phụ lục đính kèm. 
Thông tin chi tiết vui lòng liên hệ phòng A101 hoặc email thanhtra@uni.edu.vn.

Trân trọng thông báo.',
    '2025-12-04 09:00:00',
    'b0000000-0000-0000-0000-000000000001'
),
(
    '60000000-0000-0000-0000-000000000002',
    'Hướng dẫn tiếp nhận và xử lý tố giác vi phạm đạo đức nhà giáo',
    'Kính gửi toàn thể cán bộ, giảng viên và sinh viên,

Phòng Thanh tra giáo dục tiếp nhận mọi thông tin tố giác hành vi vi phạm đạo đức nhà giáo qua các kênh: hộp thư thanhtra@uni.edu.vn, hộp thư góp ý tại các tòa nhà, hoặc trực tiếp tại phòng A101. 
Mọi thông tin được bảo mật tuyệt đối danh tính người cung cấp, được xác minh khách quan và xử lý nghiêm theo quy định. 
Kính mong quý thầy cô và các em sinh viên tích cực tham gia giám sát, góp phần xây dựng môi trường giáo dục lành mạnh.

Trân trọng!',
    '2025-11-18 14:30:00',
    'b0000000-0000-0000-0000-000000000001'
),
(
    '60000000-0000-0000-0000-000000000003',
    'Công bố kết quả xử lý khiếu nại học kỳ hè 2025',
    'Kính gửi toàn thể sinh viên,

Phòng Thanh tra giáo dục đã hoàn tất xác minh 15 vụ khiếu nại liên quan đến chấm thi học kỳ hè 2025. 
Kết quả xử lý đã được gửi đến các bên liên quan và công bố công khai trên cổng thông tin điện tử. 
Các trường hợp vi phạm đã bị xử lý kỷ luật theo đúng quy định.

Trân trọng thông báo.',
    '2025-10-15 10:00:00',
    'b0000000-0000-0000-0000-000000000001'
),
(
    '60000000-0000-0000-0000-000000000004',
    'Tập huấn quy chế thi và đạo đức nhà giáo',
    'Kính gửi toàn thể giảng viên,

Phòng Thanh tra giáo dục tổ chức tập huấn “Quy chế thi và đạo đức nhà giáo” vào lúc 09h00 ngày 15/09/2025 tại Hội trường A. 
Sự có mặt đầy đủ là bắt buộc. 
Giảng viên vắng mặt cần có xác nhận của Trưởng khoa và tham gia buổi học bù.

Trân trọng thông báo.',
    '2025-09-10 11:00:00',
    'b0000000-0000-0000-0000-000000000001'
),
(
    '60000000-0000-0000-0000-000000000005',
    'Kế hoạch thanh tra nội bộ năm học 2025-2026',
    'Kính gửi lãnh đạo các đơn vị,

Phòng Thanh tra giáo dục công bố kế hoạch thanh tra nội bộ toàn diện năm học 2025-2026. 
Lịch thanh tra chi tiết sẽ được gửi trước 15 ngày làm việc. 
Đề nghị chuẩn bị đầy đủ hồ sơ theo phụ lục.

Trân trọng.',
    '2025-08-20 09:30:00',
    'b0000000-0000-0000-0000-000000000001'
),

-- 2. Cán bộ Quản trị CSVC (b...009) – 5 thông báo
(
    '60000000-0000-0000-0000-000000000006',
    'Thông báo bảo trì hệ thống điện toàn trường',
    'Kính gửi toàn thể cán bộ, giảng viên và sinh viên,

Phòng Quản trị cơ sở vật chất sẽ bảo trì hệ thống điện tòa nhà A, B, C từ ngày 20–25/12/2025. 
Có thể tạm cắt điện cục bộ trong một số khung giờ. 
Lịch chi tiết đã gửi qua email đơn vị.

Trân trọng thông báo.',
    '2025-12-01 08:00:00',
    'b0000000-0000-0000-0000-000000000009'
),
(
    '60000000-0000-0000-0000-000000000007',
    'Thông báo tổng vệ sinh khuôn viên cuối năm',
    'Kính gửi toàn thể sinh viên,

Phòng Quản trị cơ sở vật chất tổ chức tổng vệ sinh khuôn viên và khu ký túc xá ngày 28–29/12/2025. 
Kính mời các em sinh viên đăng ký tham gia tại Đoàn trường trước 25/12/2025. 
Tham gia đầy đủ được tính giờ hoạt động ngoại khóa.

Trân trọng kính mời!',
    '2025-12-20 10:00:00',
    'b0000000-0000-0000-0000-000000000009'
),
(
    '60000000-0000-0000-0000-000000000008',
    'Thông báo sửa chữa giảng đường tầng 5 nhà B',
    'Kính gửi giảng viên và sinh viên,

Phòng Quản trị cơ sở vật chất sửa chữa giảng đường tầng 5 nhà B từ 10–20/12/2025. 
Các lớp học sẽ được chuyển địa điểm (thông báo riêng). 
Không để lại tài sản cá nhân tại khu vực thi công.

Trân trọng.',
    '2025-11-28 09:00:00',
    'b0000000-0000-0000-0000-000000000009'
),
(
    '60000000-0000-0000-0000-000000000009',
    'Thông báo trồng cây xanh khuôn viên trường',
    'Kính gửi toàn thể sinh viên,

Phòng Quản trị cơ sở vật chất phối hợp Đoàn Thanh niên trồng mới 300 cây xanh trong tháng 11/2025. 
Kính mời các em đăng ký tham gia tại Đoàn trường trước 10/11/2025.

Trân trọng kính mời!',
    '2025-10-30 14:00:00',
    'b0000000-0000-0000-0000-000000000009'
),
(
    '60000000-0000-0000-0000-000000000010',
    'Thông báo kiểm tra an toàn PCCC toàn trường',
    'Kính gửi toàn thể cán bộ, giảng viên, sinh viên,

Phòng Quản trị cơ sở vật chất phối hợp Cảnh sát PCCC kiểm tra an toàn phòng cháy chữa cháy ngày 18/12/2025. 
Đề nghị các đơn vị đảm bảo lối thoát hiểm thông thoáng, không để vật cản.

Trân trọng thông báo.',
    '2025-12-10 08:30:00',
    'b0000000-0000-0000-0000-000000000009'
),

-- 3. Chuyên viên CTSV (b...010) – 2 thông báo
(
    '60000000-0000-0000-0000-000000000011',
    'Học bổng khuyến khích học tập học kỳ I 2025-2026',
    'Kính gửi toàn thể sinh viên,

Phòng Tuyển sinh và CTSV nhận hồ sơ xét học bổng khuyến khích học tập học kỳ I (GPA ≥ 3.6/4.0). 
Hồ sơ nộp trước 20/12/2025 tại phòng Tầng trệt tòa A. 
Kết quả công bố ngày 30/12/2025.

Trân trọng!',
    '2025-12-04 10:00:00',
    'b0000000-0000-0000-0000-000000000010'
),
(
    '60000000-0000-0000-0000-000000000012',
    'Tuần sinh hoạt công dân đầu khóa 2025',
    'Kính gửi tân sinh viên khóa 2025,

Phòng Tuyển sinh và CTSV tổ chức Tuần sinh hoạt công dân từ 25–30/08/2025. 
Nội dung: quy chế, nội quy, kỹ năng mềm, giao lưu văn nghệ. 
Sự có mặt đầy đủ là bắt buộc.

Trân trọng thông báo.',
    '2025-08-15 09:00:00',
    'b0000000-0000-0000-0000-000000000010'
),

-- 1. Giáo vụ Khoa CNTT (b000...016) – Khoa Công nghệ Thông tin
(
    '60000000-0000-0000-0000-000000000013',
    'Cuộc thi lập trình sinh viên vòng trường 2025',
    'Kính gửi toàn thể sinh viên Khoa Công nghệ Thông tin và các bạn yêu thích lập trình,

Khoa Công nghệ Thông tin tổ chức vòng trường cuộc thi lập trình sinh viên quốc gia ACM-ICPC năm 2025 vào lúc 08h00 ngày 25/11/2025 tại phòng lab C501. 
Thể thức thi theo đội (tối đa 3 thành viên), giải nhất 30 triệu đồng kèm suất tham dự vòng khu vực Đông Nam Á. 
Đăng ký đội thi trước ngày 15/11/2025 tại phòng C501 hoặc qua link https://fit.uni.edu.vn/acm2025. 
Đây là cơ hội tuyệt vời để các em rèn luyện kỹ năng và khẳng định năng lực lập trình.

Trân trọng kính mời!',
    '2025-11-10 09:00:00',
    'b0000000-0000-0000-0000-000000000016'
),
(
    '60000000-0000-0000-0000-000000000014',
    'Thông báo tuyển sinh chương trình chất lượng cao ngành CNTT khóa 2025',
    'Kính gửi thí sinh và phụ huynh,

Khoa Công nghệ Thông tin thông báo tuyển sinh chương trình chất lượng cao (giảng dạy 100% bằng tiếng Anh, giáo trình Mỹ) khóa 2025. 
Học phí: 75 triệu đồng/năm. 
Sinh viên tốt nghiệp được cấp bằng chính quy và có cơ hội chuyển tiếp sang các trường đối tác tại Mỹ, Úc, Singapore. 
Hạn nộp hồ sơ: 31/12/2025 tại phòng C501.

Trân trọng thông báo!',
    '2025-12-02 10:00:00',
    'b0000000-0000-0000-0000-000000000016'
),
(
    '60000000-0000-0000-0000-000000000015',
    'Hội thảo “Ứng dụng trí tuệ nhân tạo trong y tế”',
    'Kính gửi toàn thể sinh viên và giảng viên,

Khoa Công nghệ Thông tin phối hợp với FPT AI và Google tổ chức hội thảo “Ứng dụng trí tuệ nhân tạo trong y tế” vào lúc 13h30 ngày 15/10/2025 tại Hội trường C. 
Diễn giả là các chuyên gia hàng đầu trong lĩnh vực AI Healthcare. 
Sinh viên tham dự được cấp chứng nhận và có cơ hội thực tập tại các tập đoàn công nghệ lớn.

Trân trọng kính mời!',
    '2025-09-25 14:00:00',
    'b0000000-0000-0000-0000-000000000016'
),

-- 2. NV Dịch vụ sinh viên (b000...027) – Trung tâm Dịch vụ sinh viên
(
    '60000000-0000-0000-0000-000000000016',
    'Khuyến mãi dịch vụ in ấn – photocopy – văn phòng phẩm tháng 12',
    'Kính gửi toàn thể sinh viên,

Trung tâm Dịch vụ sinh viên triển khai chương trình khuyến mãi cuối năm: giảm 25% tất cả dịch vụ in ấn, photocopy màu/đen trắng, đóng luận văn, mua văn phòng phẩm từ ngày 01–20/12/2025. 
Tặng thêm 200 tờ A4 miễn phí cho hóa đơn từ 300.000 đồng. 
Địa điểm: Khu dịch vụ Canteen và tầng trệt tòa A.

Trân trọng thông báo!',
    '2025-11-28 10:00:00',
    'b0000000-0000-0000-0000-000000000027'
),
(
    '60000000-0000-0000-0000-000000000017',
    'Thông báo lịch hoạt động căng tin và siêu thị mini dịp Tết',
    'Kính gửi toàn thể sinh viên,

Trung tâm Dịch vụ sinh viên thông báo lịch hoạt động dịp Tết Dương lịch 2026:  
- Căng tin chính: mở cửa đến 17h00 ngày 31/12/2025, nghỉ từ 01–04/01/2026, mở lại từ 05/01/2026.  
- Siêu thị mini: mở cửa 07h00–22h00 đến hết ngày 30/12/2025.  
Đề nghị các em chủ động mua sắm trước khi nghỉ lễ.

Trân trọng thông báo!',
    '2025-12-20 09:00:00',
    'b0000000-0000-0000-0000-000000000027'
),
(
    '60000000-0000-0000-0000-000000000018',
    'Tuyển dụng nhân viên phục vụ bán thời gian',
    'Kính gửi sinh viên có nhu cầu làm thêm,

Trung tâm Dịch vụ sinh viên tuyển 20 nhân viên phục vụ bán thời gian tại căng tin và siêu thị mini.  
Thu nhập: 35.000 đồng/giờ, làm việc linh hoạt theo ca.  
Ứng tuyển trực tiếp tại quầy thông tin Khu dịch vụ Canteen trước ngày 15/09/2025.

Trân trọng thông báo!',
    '2025-08-30 11:00:00',
    'b0000000-0000-0000-0000-000000000027'
),

-- 3. NV Dạy học số (b000...028) – Trung tâm Dạy học số
(
    '60000000-0000-0000-0000-000000000019',
    'Tập huấn sử dụng LMS phiên bản mới 2025',
    'Kính gửi toàn thể giảng viên và sinh viên,

Trung tâm Dạy học số tổ chức các buổi tập huấn sử dụng Hệ thống quản lý học tập (LMS) phiên bản 2025 vào ngày 20–22/08/2025.  
Phiên bản mới tích hợp AI hỗ trợ học tập, chấm bài tự động và theo dõi tiến độ cá nhân.  
Lịch tập huấn chi tiết đã được gửi qua email giảng viên và lớp trưởng.  
Buổi tập huấn là bắt buộc đối với giảng viên chủ nhiệm học phần.

Trân trọng thông báo.',
    '2025-08-18 09:00:00',
    'b0000000-0000-0000-0000-000000000028'
),
(
    '60000000-0000-0000-0000-000000000020',
    'Thông báo bảo trì hệ thống E-learning',
    'Kính gửi toàn thể giảng viên và sinh viên,

Trung tâm Dạy học số sẽ bảo trì hệ thống E-learning từ 22h00 ngày 10/12/2025 đến 06h00 ngày 11/12/2025.  
Trong thời gian này, hệ thống sẽ tạm ngừng hoạt động.  
Đề nghị quý thầy cô và các em hoàn tất nộp bài, điểm danh trước thời gian bảo trì.

Trân trọng thông báo!',
    '2025-12-05 16:00:00',
    'b0000000-0000-0000-0000-000000000028'
),
(
    '60000000-0000-0000-0000-000000000021',
    'Khóa học miễn phí “Kỹ năng học trực tuyến hiệu quả”',
    'Kính gửi toàn thể sinh viên,

Trung tâm Dạy học số mở khóa học miễn phí “Kỹ năng học trực tuyến hiệu quả” khai giảng ngày 10/10/2025.  
Nội dung: quản lý thời gian, ghi chú thông minh, sử dụng công cụ hỗ trợ học tập.  
Đăng ký tại https://elearning.uni.edu.vn/kynang2025.  
Hoàn thành khóa học được cấp chứng nhận và tính 10 giờ hoạt động ngoại khóa.

Trân trọng kính mời!',
    '2025-09-25 10:00:00',
    'b0000000-0000-0000-0000-000000000028'
),

-- 4. Kỹ thuật viên TTMT (b000...029) – Trung tâm Thông tin – Máy tính
(
    '60000000-0000-0000-0000-000000000022',
    'Chính thức nâng cấp băng thông Internet lên 3Gbps',
    'Kính gửi toàn thể cán bộ, giảng viên và sinh viên,

Trung tâm Thông tin – Máy tính trân trọng thông báo từ ngày 01/12/2025, băng thông Internet toàn trường được nâng cấp lên 3Gbps, đồng thời triển khai Wi-Fi 6 tại tất cả các tòa nhà và ký túc xá.  
Tốc độ tải xuống dự kiến tăng gấp 3 lần, đáp ứng tốt nhu cầu học tập trực tuyến, nghiên cứu và giải trí.  
Hệ thống Eduroam cũng được kích hoạt toàn trường.

Trân trọng thông báo!',
    '2025-11-30 09:00:00',
    'b0000000-0000-0000-0000-000000000029'
),
(
    '60000000-0000-0000-0000-000000000023',
    'Thông báo bảo trì phòng máy tính C301–C305',
    'Kính gửi giảng viên và sinh viên,

Trung tâm Thông tin – Máy tính sẽ bảo trì, nâng cấp phòng máy tính C301–C305 từ ngày 25–27/08/2025.  
Trong thời gian này, các phòng sẽ tạm ngừng hoạt động.  
Đề nghị quý thầy cô chuyển lịch thực hành sang các phòng khác (thông tin chi tiết đã gửi qua email).

Trân trọng thông báo!',
    '2025-08-20 11:00:00',
    'b0000000-0000-0000-0000-000000000029'
),
(
    '60000000-0000-0000-0000-000000000024',
    'Hướng dẫn sử dụng Wi-Fi Eduroam',
    'Kính gửi toàn thể sinh viên và giảng viên,

Trung tâm Thông tin – Máy tính hướng dẫn sử dụng Wi-Fi Eduroam – hệ thống kết nối miễn phí tại hơn 10.000 trường đại học trên toàn thế giới.  
Chỉ cần đăng nhập một lần bằng tài khoản sinh viên/giảng viên là có thể sử dụng ở bất kỳ đâu có Eduroam.  
Hướng dẫn chi tiết tại https://ttmt.uni.edu.vn/eduroam.

Trân trọng thông báo!',
    '2025-10-10 14:00:00',
    'b0000000-0000-0000-0000-000000000029'
),

-- 5. Giảng viên GDTC (b000...030) – TT GD Thể chất và Quốc phòng
(
    '60000000-0000-0000-0000-000000000025',
    'Giải bóng đá sinh viên cúp “Mùa thu 2025”',
    'Kính gửi các câu lạc bộ bóng đá sinh viên,

Trung tâm GD Thể chất và Quốc phòng phối hợp Hội Sinh viên tổ chức Giải bóng đá sinh viên cúp “Mùa thu 2025” khai mạc ngày 15/10/2025 tại sân trung tâm.  
Thể thức: sân 7 người, giải nhất 50 triệu đồng + cúp luân lưu.  
Đăng ký đội bóng trước ngày 30/09/2025 tại Nhà Thi đấu Đa năng.

Trân trọng kính mời!',
    '2025-09-20 10:00:00',
    'b0000000-0000-0000-0000-000000000030'
),
(
    '60000000-0000-0000-0000-000000000026',
    'Thông báo kiểm tra thể lực học kỳ I 2025-2026',
    'Kính gửi toàn thể sinh viên,

Trung tâm GD Thể chất và Quốc phòng tổ chức kiểm tra thể lực học kỳ I từ ngày 01–15/12/2025.  
Nội dung: chạy 1.500m (nam), 800m (nữ), hít đất, gập bụng.  
Sinh viên đạt chuẩn được cộng 10% điểm môn GDTC.  
Lịch kiểm tra chi tiết đã gửi qua lớp trưởng.

Trân trọng thông báo!',
    '2025-11-28 08:00:00',
    'b0000000-0000-0000-0000-000000000030'
),
(
    '60000000-0000-0000-0000-000000000027',
    'Lớp học bơi lội miễn phí cho sinh viên năm nhất',
    'Kính gửi sinh viên năm nhất,

Trung tâm GD Thể chất và Quốc phòng mở lớp học bơi lội miễn phí dành cho sinh viên năm nhất, khai giảng ngày 10/09/2025 tại bể bơi trong nhà.  
Mỗi lớp 20 học viên, học 12 buổi.  
Đăng ký tại Nhà Thi đấu Đa năng trước ngày 05/09/2025.

Trân trọng kính mời!',
    '2025-08-28 14:00:00',
    'b0000000-0000-0000-0000-000000000030'
),

-- 6. Thủ thư Thư viện (b000...034)
(
    '60000000-0000-0000-0000-000000000028',
    'Thư viện mở cửa 24/7 dịp ôn thi học kỳ I',
    'Kính gửi toàn thể sinh viên,

Thư viện Trung tâm mở cửa 24/7 từ ngày 20/12/2025 đến hết ngày 15/01/2026 phục vụ nhu cầu ôn thi và làm đồ án cuối kỳ.  
Khu vực tự học tầng 5 được trang bị thêm 200 chỗ ngồi, ổ cắm điện và Wi-Fi tốc độ cao.  
Dịch vụ mượn tài liệu qua đêm và hỗ trợ tra cứu trực tuyến 24/7.

Trân trọng thông báo!',
    '2025-12-10 10:00:00',
    'b0000000-0000-0000-0000-000000000034'
),
(
    '60000000-0000-0000-0000-000000000029',
    'Triển lãm sách kỷ niệm 70 năm thành lập Trường',
    'Kính gửi toàn thể cán bộ, giảng viên, sinh viên,

Thư viện tổ chức Triển lãm sách “70 năm một chặng đường” từ ngày 10–20/11/2025 tại sảnh chính Thư viện Trung tâm.  
Trưng bày hơn 1.000 tư liệu quý, sách cổ và hình ảnh lịch sử Nhà trường.  
Lễ khai mạc: 18h00 ngày 10/11/2025.

Trân trọng kính mời!',
    '2025-11-01 09:00:00',
    'b0000000-0000-0000-0000-000000000034'
),
(
    '60000000-0000-0000-0000-000000000030',
    'Hội thảo “Kỹ năng tìm tài liệu học thuật hiệu quả”',
    'Kính gửi sinh viên năm 3–4 và học viên cao học,

Thư viện tổ chức hội thảo “Kỹ năng tìm tài liệu học thuật hiệu quả” vào lúc 14h00 ngày 15/09/2025.  
Nội dung: sử dụng Scopus, Web of Science, Google Scholar, tránh đạo văn.  
Đăng ký tại quầy thông tin Thư viện.

Trân trọng kính mời!',
    '2025-09-05 14:00:00',
    'b0000000-0000-0000-0000-000000000034'
),

-- 7. Quản lý KTX (b000...035)
(
    '60000000-0000-0000-0000-000000000031',
    'Đăng ký ở nội trú học kỳ I năm học 2025-2026',
    'Kính gửi tân sinh viên và sinh viên các khóa,

Ban Quản lý ký túc xá nhận hồ sơ đăng ký ở nội trú học kỳ I từ ngày 01/12 đến 31/12/2025.  
Phí nội trú: 1.200.000 đồng/học kỳ (đã bao gồm điện nước).  
Ưu tiên sinh viên chính sách, hoàn cảnh khó khăn và sinh viên nữ.  
Nộp hồ sơ tại https://ktx.uni.edu.vn/dangky2025.

Trân trọng thông báo!',
    '2025-12-05 08:00:00',
    'b0000000-0000-0000-0000-000000000035'
),
(
    '60000000-0000-0000-0000-000000000032',
    'Thông báo tổng vệ sinh ký túc xá cuối năm',
    'Kính gửi sinh viên nội trú,

Ban Quản lý ký túc xá tổ chức tổng vệ sinh toàn bộ khu nội trú vào ngày 28–30/12/2025.  
Yêu cầu các phòng dọn dẹp vệ sinh, phân loại rác đúng quy định.  
Sinh viên không hợp tác sẽ bị nhắc nhở kỷ luật.

Trân trọng thông báo!',
    '2025-12-20 10:00:00',
    'b0000000-0000-0000-0000-000000000035'
),
(
    '60000000-0000-0000-0000-000000000033',
    'Thông báo sửa chữa hệ thống nước nóng KTX khu B',
    'Kính gửi sinh viên nội trú khu B,

Ban Quản lý ký túc xá sẽ sửa chữa hệ thống nước nóng khu B từ ngày 15–20/11/2025.  
Trong thời gian này, nước nóng sẽ tạm ngừng cung cấp.  
Nhà trường sẽ bố trí xe đưa đón miễn phí đến khu tắm công cộng.

Trân trọng thông báo!',
    '2025-11-10 09:00:00',
    'b0000000-0000-0000-0000-000000000035'
),

-- Kế toán viên
(
    '60000000-0000-0000-0000-000000000034',
    'Thông báo đóng học phí học kỳ I năm học 2025-2026',
    'Kính gửi toàn thể sinh viên,

Phòng Kế hoạch – Tài chính thông báo thời hạn đóng học phí học kỳ I năm học 2025-2026 là ngày 31/12/2025. 
Sinh viên có thể thanh toán qua chuyển khoản ngân hàng, ví điện tử Momo/ZaloPay hoặc trực tiếp tại quầy thu ngân (tầng trệt tòa A). 
Trường hợp chậm nộp sẽ bị tính phạt 0,05%/ngày theo quy định tại Quyết định 125/QĐ-ĐH. 
Thông tin tài khoản thụ hưởng và hướng dẫn chi tiết đã được gửi qua email sinh viên và đăng tải trên cổng thông tin. 
Mọi thắc mắc vui lòng liên hệ phòng A105 hoặc email khtc@uni.edu.vn.

Trân trọng thông báo.',
    '2025-12-05 08:00:00',
    'b0000000-0000-0000-0000-000000000011'
),
(
    '60000000-0000-0000-0000-000000000035',
    'Kế hoạch tài chính năm 2026',
    'Kính gửi lãnh đạo các đơn vị,

Phòng Kế hoạch – Tài chính đang lấy ý kiến xây dựng dự toán ngân sách năm 2026 với tổng kinh phí 500 tỷ đồng. 
Đề nghị các đơn vị nộp báo cáo nhu cầu chi tiêu trước ngày 15/11/2025. 
Dự toán được phê duyệt sẽ là căn cứ phân bổ ngân sách và kiểm soát chi tiêu trong năm. 
Mọi góp ý vui lòng gửi về email khtc@uni.edu.vn.

Trân trọng!',
    '2025-11-10 10:00:00',
    'b0000000-0000-0000-0000-000000000011'
),
(
    '60000000-0000-0000-0000-000000000036',
    'Báo cáo quyết toán ngân sách năm 2025',
    'Kính gửi toàn thể cán bộ,

Phòng Kế hoạch – Tài chính yêu cầu các đơn vị nộp báo cáo quyết toán ngân sách năm 2025 trước ngày 30/09/2025. 
Nội dung bao gồm thu chi chi tiết, hóa đơn chứng từ và báo cáo tài chính. 
Báo cáo sẽ được kiểm toán độc lập và trình Ban Giám hiệu phê duyệt.

Trân trọng thông báo.',
    '2025-09-15 14:00:00',
    'b0000000-0000-0000-0000-000000000011'
),
(
    '60000000-0000-0000-0000-000000000037',
    'Hướng dẫn nộp báo cáo chi tiêu hàng quý',
    'Kính gửi lãnh đạo các phòng ban,

Phòng Kế hoạch – Tài chính hướng dẫn nộp báo cáo chi tiêu quý III năm 2025 trước ngày 15/10/2025. 
Báo cáo bao gồm biểu mẫu Excel đính kèm, hóa đơn và biên lai. 
Mọi sai sót sẽ ảnh hưởng đến phân bổ ngân sách quý IV.

Trân trọng.',
    '2025-10-01 09:30:00',
    'b0000000-0000-0000-0000-000000000011'
),
(
    '60000000-0000-0000-0000-000000000038',
    'Thông báo kiểm toán nội bộ tài chính',
    'Kính gửi toàn thể đơn vị,

Phòng Kế hoạch – Tài chính sẽ kiểm toán nội bộ tài chính từ ngày 20/08/2025. 
Đề nghị chuẩn bị đầy đủ sổ sách, chứng từ. 
Kết quả kiểm toán sẽ được công bố vào tháng 09/2025.

Trân trọng thông báo.',
    '2025-08-10 11:00:00',
    'b0000000-0000-0000-0000-000000000011'
),

-- 2. Giáo vụ Đào tạo (b...012) – Phòng Đào tạo – 5 thông báo
(
    '60000000-0000-0000-0000-000000000039',
    'Lịch thi kết thúc học kỳ I năm học 2025-2026',
    'Kính gửi toàn thể sinh viên,

Phòng Đào tạo công bố lịch thi kết thúc học kỳ I từ ngày 05/01/2026 đến 20/01/2026. 
Lịch thi chi tiết theo lớp, phòng thi đã đăng tải trên cổng thông tin sinh viên và gửi qua email lớp trưởng. 
Sinh viên vui lòng kiểm tra kỹ thông tin và mang theo thẻ sinh viên khi dự thi. 
Mọi thắc mắc liên hệ phòng A106.

Trân trọng thông báo.',
    '2025-12-02 09:00:00',
    'b0000000-0000-0000-0000-000000000012'
),
(
    '60000000-0000-0000-0000-000000000040',
    'Hướng dẫn đăng ký học phần học kỳ II 2025-2026',
    'Kính gửi toàn thể sinh viên,

Phòng Đào tạo mở đăng ký học phần học kỳ II từ ngày 10–20/12/2025 qua cổng thông tin sinh viên. 
Sinh viên kiểm tra số tín chỉ, điều kiện tiên quyết trước khi đăng ký. 
Hệ thống hỗ trợ 24/7, thắc mắc liên hệ email pdt@uni.edu.vn.

Trân trọng!',
    '2025-11-28 14:00:00',
    'b0000000-0000-0000-0000-000000000012'
),
(
    '60000000-0000-0000-0000-000000000041',
    'Thông báo xét tốt nghiệp đợt tháng 01/2026',
    'Kính gửi sinh viên sắp tốt nghiệp,

Phòng Đào tạo thông báo nhận hồ sơ xét tốt nghiệp đợt tháng 01/2026 trước ngày 15/12/2025. 
Hồ sơ bao gồm bảng điểm, chứng chỉ tiếng Anh, xác nhận hoàn thành nghĩa vụ. 
Lễ tốt nghiệp dự kiến ngày 25/01/2026.

Trân trọng.',
    '2025-11-10 10:00:00',
    'b0000000-0000-0000-0000-000000000012'
),
(
    '60000000-0000-0000-0000-000000000042',
    'Cập nhật chương trình đào tạo năm học 2025-2026',
    'Kính gửi toàn thể giảng viên và sinh viên,

Phòng Đào tạo cập nhật chương trình đào tạo năm học 2025-2026 với thêm 5 môn tự chọn mới. 
Chi tiết đăng tải tại https://pdt.uni.edu.vn/ctdt2025. 
Đề nghị các khoa điều chỉnh thời khóa biểu theo.

Trân trọng thông báo.',
    '2025-10-20 09:30:00',
    'b0000000-0000-0000-0000-000000000012'
),
(
    '60000000-0000-0000-0000-000000000043',
    'Lịch thi lại các môn học kỳ hè 2025',
    'Kính gửi sinh viên thi lại,

Phòng Đào tạo tổ chức thi lại các môn học kỳ hè 2025 từ ngày 15–20/09/2025. 
Lịch thi chi tiết gửi qua email sinh viên. 
Phí thi lại 500.000 đồng/môn, nộp trước 10/09/2025.

Trân trọng.',
    '2025-08-25 11:00:00',
    'b0000000-0000-0000-0000-000000000012'
);
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
-- =================================================================
-- COMMENT REPORTS CHO 3 COMMENT VI PHẠM (SPAM/QUẢNG CÁO)
-- =================================================================

INSERT INTO
    "CommentReports" (
        "id",
        "commentId",
        "userId",
        "reason",
        "status",
        "createdAt"
    )
VALUES
    -- 1. Report comment dọn vệ sinh quảng cáo (commentId 4000...031)
    (
        '70000000-0000-0000-0000-000000000001',
        '40000000-0000-0000-0000-0000-000000000031',
        'e0000000-0000-0000-0000-000000000001', -- Nguyễn Văn An báo cáo
        'Quảng cáo dịch vụ dọn vệ sinh không liên quan, spam rác',
        'PENDING',
        '2025-12-21 08:45:00'
    ),

-- 2. Report comment bán bánh chưng giò chả (commentId 4000...032)
(
    '70000000-0000-0000-0000-000000000002',
    '40000000-0000-0000-0000-000000000032',
    'e0000000-0000-0000-0000-000000000005', -- Hoàng Thu Trang báo cáo
    'Spam quảng cáo thực phẩm, bán hàng trong bài thông báo chính thức của trường',
    'PENDING',
    '2025-12-21 12:10:00'
),

-- 3. Report comment dịch vụ dọn KTX + giặt thảm (commentId 4000...033)
(
    '70000000-0000-0000-0000-000000000003',
    '40000000-0000-0000-0000-000000000033',
    'e0000000-0000-0000-0000-000000000011', -- Dương Thị Lan báo cáo
    'Quảng cáo dịch vụ thương mại trá hình, làm bẩn bài thông báo của Ban Quản lý KTX',
    'PENDING',
    '2025-12-21 16:05:00'
);
-- =================================================================
-- STEP 11: CONVERSATIONS & MESSAGES
-- Fix Conv ID: conv... -> 7000...
-- Fix Msg ID: msg... -> 8000...
-- =================================================================
INSERT INTO
    "ClarificationConversations" (
        "id",
        "subject",
        "feedbackId",
        "isClosed",
        "userId",
        "createdAt"
    )
VALUES (
        '70000000-0000-0000-0000-000000000001',
        'Yêu cầu minh chứng',
        'f0000000-0000-0000-0000-000000000007',
        true,
        'e0000000-0000-0000-0000-000000000011',
        '2025-10-05 10:00:00'
    );

INSERT INTO
    "Messages" (
        "id",
        "conversationId",
        "userId",
        "content",
        "createdAt"
    )
VALUES (
        '80000000-0000-0000-0000-000000000001',
        '70000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000012',
        'Gửi ảnh minh chứng đi em.',
        '2025-10-05 10:00:00'
    ),
    (
        '80000000-0000-0000-0000-000000000002',
        '70000000-0000-0000-0000-000000000001',
        'e0000000-0000-0000-0000-000000000011',
        'Dạ đây ạ.',
        '2025-10-05 10:15:00'
    );

-- =================================================================
-- STEP 12: FILE ATTACHMENTS
-- Fix ID: fa... -> 9000...
-- =================================================================
INSERT INTO
    "FileAttachments" (
        "id",
        "targetId",
        "targetType",
        "fileName",
        "fileUrl",
        "fileType",
        "fileSize",
        "createdAt"
    )
VALUES (
        '90000000-0000-0000-0000-000000000001',
        'f0000000-0000-0000-0000-000000000001',
        'FEEDBACK',
        'may-lanh.jpg',
        'https://storage.u.edu/1.jpg',
        'image/jpeg',
        204800,
        '2025-09-05 08:30:00'
    ),
    (
        '90000000-0000-0000-0000-000000000020',
        '60000000-0000-0000-0000-000000000001',
        'ANNOUNCEMENT',
        'ke-hoach.pdf',
        'https://storage.u.edu/2.pdf',
        'application/pdf',
        2000,
        '2025-11-01 08:00:00'
    ),
    (
        '90000000-0000-0000-0000-000000000030',
        '80000000-0000-0000-0000-000000000002',
        'MESSAGE',
        'anh.jpg',
        'https://storage.u.edu/3.jpg',
        'image/jpeg',
        102400,
        '2025-10-05 10:15:00'
    );
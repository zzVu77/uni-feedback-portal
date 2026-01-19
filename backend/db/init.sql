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
        'Cải thiện cơ sở vật chất phòng học',
        'Phòng học ở tòa A thiếu máy chiếu hiện đại, ảnh hưởng đến chất lượng giảng dạy.',
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
        'Vấn đề đào tạo học vụ',
        'Thời khóa biểu thường xuyên thay đổi mà không thông báo kịp thời.',
        NULL,
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-01 14:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000003',
        'Hoạt động ngoại khóa cần đa dạng hơn',
        'Các sự kiện ngoại khóa ít và không hấp dẫn sinh viên tham gia.',
        'Sân trường',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-02 10:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000004',
        'Tác phong giảng viên chưa chuyên nghiệp',
        'Một số giảng viên đến muộn và không chuẩn bị bài giảng kỹ.',
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
        'Học phí và tài chính cần minh bạch',
        'Thông tin học phí không rõ ràng, gây khó khăn cho sinh viên.',
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
        'Cơ sở vật chất thư viện',
        'Thư viện thiếu sách mới và không gian học tập chật hẹp.',
        'Thư viện Trung tâm',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        '2025-11-03 15:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000007',
        'Đào tạo học vụ cải thiện',
        'Quy trình đăng ký học phần phức tạp và hay lỗi hệ thống.',
        'Phòng Đào tạo',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-04 09:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000008',
        'Hoạt động ngoại khóa thiếu',
        'Cần thêm các câu lạc bộ thể thao cho sinh viên.',
        'Nhà Thi đấu',
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-04 13:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000009',
        'Tác phong giảng viên',
        'Giảng viên cần nhiệt tình hơn trong giờ học.',
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
        'Học phí cao',
        'Học phí tăng mà không có lý do rõ ràng.',
        'Phòng Tài chính',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-05 14:50:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000011',
        'An ninh trật tự kém',
        'Khu ký túc xá hay mất đồ.',
        'Ký túc xá Khu A',
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000006',
        '2025-11-05 16:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000012',
        'Góp ý khác về cơ sở',
        'Cần thêm cây xanh trong khuôn viên trường.',
        'Sân trường',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        '2025-11-06 08:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000013',
        'Đào tạo cần cập nhật',
        'Chương trình học lỗi thời so với thực tế.',
        NULL,
        'RESOLVED',
        true,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-07 11:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000014',
        'Hoạt động ngoại khóa',
        'Tổ chức thêm chuyến đi thực tế.',
        'Phòng Quan hệ doanh nghiệp',
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-08 13:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000015',
        'Tác phong cần cải thiện',
        'Giảng viên nên tương tác nhiều hơn với sinh viên.',
        'Phòng học C501',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000004',
        '2025-11-09 09:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000016',
        'Tài chính học phí',
        'Cần hỗ trợ học bổng cho sinh viên nghèo.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-10 14:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000017',
        'Cơ sở vật chất lab',
        'Phòng thí nghiệm thiếu thiết bị an toàn.',
        'Phòng thí nghiệm B201',
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        '2025-11-10 16:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000018',
        'Học vụ đăng ký',
        'Hệ thống đăng ký online chậm và hay crash.',
        'Phòng Đào tạo',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-11 10:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000019',
        'Ngoại khóa văn nghệ',
        'Cần thêm sự kiện văn nghệ cho sinh viên.',
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
        'Giảng viên muộn giờ',
        'Giảng viên thường xuyên muộn giờ học.',
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
        'Học phí minh bạch',
        'Yêu cầu công khai chi tiết sử dụng học phí.',
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
        'An ninh camera',
        'Cần lắp thêm camera ở khu đỗ xe.',
        'Bãi đỗ xe',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000006',
        '2025-11-14 15:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000023',
        'Góp ý cơ sở wifi',
        'Wifi trường yếu, cần nâng cấp.',
        NULL,
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        '2025-11-15 09:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000024',
        'Đào tạo thực hành',
        'Tăng giờ thực hành cho các môn kỹ thuật.',
        'Xưởng Thực hành',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-15 13:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000025',
        'Ngoại khóa tình nguyện',
        'Tổ chức thêm hoạt động tình nguyện.',
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
        'Tác phong phục vụ',
        'Nhân viên hành chính chậm trễ trong xử lý giấy tờ.',
        'Phòng Hành chính',
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000004',
        '2025-11-16 10:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000027',
        'Tài chính hỗ trợ',
        'Cần thêm quỹ hỗ trợ sinh viên khó khăn.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-17 14:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000028',
        'Cơ sở vệ sinh',
        'Nhà vệ sinh cần sạch sẽ hơn.',
        'Tòa nhà A',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        '2025-11-18 08:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000029',
        'Học vụ thi cử',
        'Lịch thi cần công bố sớm hơn.',
        'Phòng Đào tạo',
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-19 11:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000030',
        'Ngoại khóa hội thảo',
        'Tổ chức hội thảo việc làm thường xuyên.',
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
        'Giảng viên đánh giá',
        'Phương pháp đánh giá chưa công bằng.',
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
        'Học phí giảm',
        'Giảm học phí cho sinh viên xuất sắc.',
        'Phòng Tài chính',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-22 13:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000033',
        'An ninh đêm khuya',
        'Tăng cường an ninh vào ban đêm.',
        'Khuôn viên trường',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000006',
        '2025-11-23 16:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000034',
        'Góp ý khác',
        'Cải thiện dịch vụ căn tin.',
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
        'Cơ sở thiết bị',
        'Thiết bị máy tính cũ kỹ.',
        'Phòng Máy tính',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        '2025-12-02 14:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000036',
        'Đào tạo trực tuyến',
        'Nâng cấp nền tảng học trực tuyến.',
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
        'Hoạt động ngoại khóa mùa đông',
        'Tổ chức sự kiện mùa đông cho sinh viên.',
        'Sân trường',
        'PENDING',
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
        'Kết nối doanh nghiệp còn hạn chế',
        'Rất ít công ty lớn đến tuyển dụng, cần mở rộng mạng lưới đối tác.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-02 10:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000039',
        'Ngày hội việc làm quá ít',
        'Chỉ có 1 ngày hội việc làm trong năm, cần tổ chức ít nhất 3 lần.',
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
        'Hỗ trợ thực tập chưa hiệu quả',
        'Sinh viên khó tìm được chỗ thực tập chất lượng, phòng cần hỗ trợ nhiều hơn.',
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
        'Học bổng doanh nghiệp quá ít',
        'Số lượng học bổng từ doanh nghiệp chỉ đếm trên đầu ngón tay.',
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
        'Hội thảo hướng nghiệp không hấp dẫn',
        'Diễn giả ít tên tuổi, nội dung chung chung, sinh viên không hứng thú.',
        'Hội trường A201',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-06 14:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000043',
        'Chưa có danh sách đối tác công khai',
        'Sinh viên không biết liên hệ công ty nào để xin thực tập.',
        NULL,
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-07 16:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000044',
        'Cần thêm chương trình mentorship',
        'Mong có cựu sinh viên hoặc nhân sự doanh nghiệp mentor 1-1.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-08 10:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000045',
        'Thông tin việc làm cập nhật chậm',
        'Tin tuyển dụng đăng lên fanpage trễ, sinh viên bỏ lỡ cơ hội.',
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
        'Hỗ trợ CV và phỏng vấn',
        'Cần tổ chức workshop viết CV và mock interview thường xuyên.',
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
        'Doanh nghiệp nhỏ quá nhiều',
        'Hầu hết công ty đến trường chỉ tuyển lao động phổ thông.',
        NULL,
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-11 15:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000048',
        'Học bổng ký túc xá từ doanh nghiệp',
        'Mong có thêm học bổng hỗ trợ tiền ký túc xá từ doanh nghiệp.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-12 09:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000049',
        'Thực tập có lương rất ít',
        'Hầu hết chỗ thực tập không trả lương hoặc trả rất thấp.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-13 14:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000050',
        'Cần mời FPT, VNG, VinGroup',
        'Mong phòng mời các tập đoàn lớn về tuyển dụng thường xuyên.',
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
        'Thiếu thông tin việc làm part-time',
        'Sinh viên năm 1-2 rất cần việc làm thêm nhưng không có kênh thông tin.',
        NULL,
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-15 16:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000052',
        'Hội thảo kỹ năng mềm',
        'Cần nhiều hội thảo kỹ năng mềm hơn, hiện tại quá ít.',
        'Hội trường lớn',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-16 11:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000053',
        'Danh sách thực tập chưa cập nhật',
        'File danh sách chỗ thực tập năm ngoái vẫn còn treo trên web.',
        NULL,
        'RESOLVED',
        true,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-17 13:50:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000054',
        'Cần job fair chuyên ngành',
        'Mỗi khoa nên có job fair riêng thay vì chung chung.',
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
        'Học bổng khởi nghiệp',
        'Cần học bổng dành riêng cho sinh viên có dự án khởi nghiệp.',
        NULL,
        'PENDING',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-19 15:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000056',
        'Doanh nghiệp nước ngoài',
        'Mong có thêm công ty nước ngoài đến tuyển dụng.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-20 10:10:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000057',
        'Chương trình Alumni',
        'Cần kết nối mạnh hơn với cựu sinh viên đang làm ở doanh nghiệp lớn.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-21 14:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000058',
        'Thực tập hè 2026',
        'Đã đến tháng 11 nhưng chưa có thông tin thực tập hè năm sau.',
        NULL,
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-22 11:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000059',
        'Job fair online',
        'Nên tổ chức thêm job fair online để sinh viên ở xa tham gia.',
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
        'Học bổng doanh nghiệp mới',
        'Cần tìm thêm nguồn học bổng từ các công ty khởi nghiệp.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-24 09:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000061',
        'Thực tập quốc tế',
        'Mong có chương trình thực tập trao đổi quốc tế.',
        NULL,
        'PENDING',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-25 13:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000062',
        'Cần group Zalo việc làm',
        'Hiện tại thông tin việc làm chỉ đăng trên web, rất ít sinh viên biết.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-26 10:40:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000063',
        'Doanh nghiệp công nghệ cao',
        'Mong mời thêm các công ty công nghệ cao về tuyển dụng.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-27 15:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000064',
        'Học bổng toàn phần',
        'Cần thêm học bổng toàn phần từ doanh nghiệp cho sinh viên giỏi.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-28 11:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000065',
        'Thực tập bắt buộc',
        'Nhiều sinh viên chưa có chỗ thực tập bắt buộc kỳ tới.',
        NULL,
        'IN_PROGRESS',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000002',
        '2025-12-01 14:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000066',
        'Job fair cuối năm',
        'Mong có thêm 1 job fair lớn vào cuối tháng 12.',
        NULL,
        'PENDING',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-12-02 10:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000067',
        'Học bổng năm 2026',
        'Chưa thấy thông báo học bổng doanh nghiệp cho năm học mới.',
        NULL,
        'IN_PROGRESS',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000005',
        '2025-12-03 16:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000068',
        'Kết nối startup',
        'Mong phòng kết nối sinh viên với các startup để thực tập.',
        NULL,
        'PENDING',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        '2025-12-05 11:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000069',
        'Hội thảo tuyển dụng 2026',
        'Cần sớm có kế hoạch các hội thảo tuyển dụng năm 2026.',
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
        'Thực tập nước ngoài',
        'Mong có thêm cơ hội thực tập tại nước ngoài.',
        NULL,
        'PENDING',
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
        'Hỗ trợ đăng ký đề tài NCKH rất chậm',
        'Nộp hồ sơ đề tài từ tháng 9 nhưng đến nay vẫn chưa được duyệt.',
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
        'Kinh phí nghiên cứu sinh viên quá thấp',
        'Mức hỗ trợ tối đa chỉ 5 triệu/đề tài, không đủ mua linh kiện.',
        NULL,
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-02 14:10:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000073',
        'Chưa có hội nghị NCKH sinh viên năm 2025',
        'Năm ngoái tổ chức tháng 4, năm nay chưa thấy thông báo gì.',
        'Hội trường A201',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-03 09:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000074',
        'Quy trình bảo hộ sáng chế quá phức tạp',
        'Hồ sơ nộp từ tháng 7 vẫn chưa được hướng dẫn tiếp.',
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
        'Thiếu không gian co-working cho nhóm NCKH',
        'Phải làm đồ án ở căng tin vì không có phòng riêng.',
        'Tòa nhà A - Phòng A201',
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000001',
        '2025-11-05 10:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000076',
        'Chưa có quỹ khởi nghiệp sinh viên',
        'Nhiều trường đã có quỹ 1-2 tỷ hỗ trợ startup sinh viên.',
        NULL,
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000007',
        '2025-11-06 13:40:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000077',
        'Hội thảo công bố quốc tế ít quá',
        'Cả năm chỉ có 1-2 buổi hướng dẫn viết paper Scopus.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000002',
        '2025-11-07 15:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000078',
        'Hỗ trợ đăng ký hội nghị quốc tế',
        'Mong phòng tài trợ 50-100% chi phí tham gia hội nghị nước ngoài.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-08 11:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000079',
        'Chưa có giải thưởng NCKH cấp trường',
        'Nhiều trường có giải thưởng 20-50 triệu cho đề tài xuất sắc.',
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
        'Phòng thí nghiệm nghiên cứu chưa mở cửa 24/7',
        'Chỉ mở đến 22h, nhóm NCKH robot phải về sớm.',
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
        'Thiếu thiết bị cho đề tài AI',
        'Không có GPU RTX 4090 để train mô hình.',
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
        'Hỗ trợ công bố bài báo',
        'Mong phòng hỗ trợ phí APC cho bài báo Open Access.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000005',
        '2025-11-12 13:15:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000083',
        'Cuộc thi ý tưởng khởi nghiệp chưa có',
        'Đã 2 năm trường không tổ chức Startup Day.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000007',
        '2025-11-13 10:45:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000084',
        'Hỗ trợ chuyển giao công nghệ',
        'Đề tài có sản phẩm nhưng không biết bán cho doanh nghiệp nào.',
        NULL,
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000007',
        '2025-11-14 15:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000085',
        'Thiếu mentor nghiên cứu',
        'Nhóm sinh viên không có giảng viên hướng dẫn thường xuyên.',
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
        'Không gian Innovation Hub',
        'Cần khu vực riêng để trưng bày sản phẩm NCKH sinh viên.',
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
        'Hỗ trợ phần mềm bản quyền',
        'Sinh viên phải dùng bản crack vì không có license Matlab, SolidWorks.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000001',
        '2025-11-17 09:50:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000088',
        'Cuộc thi Robocon, CDIO',
        'Nhà trường cần đầu tư mạnh hơn cho các cuộc thi quốc tế.',
        NULL,
        'PENDING',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-18 16:40:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000089',
        'Quỹ hạt giống cho startup',
        'Mong có quỹ đầu tư mạo hiểm dành riêng cho sinh viên.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000007',
        '2025-11-19 10:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000090',
        'Hỗ trợ nộp đơn patent',
        'Chi phí luật sư quá cao, mong phòng hỗ trợ 100%.',
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
        'Đề tài NCKH cấp bộ',
        'Chưa thấy thông báo đăng ký đề tài cấp Bộ năm 2026.',
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
        'Hội nghị khoa học trẻ',
        'Mong tổ chức hội nghị riêng cho sinh viên trình bày kết quả.',
        NULL,
        'RESOLVED',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000003',
        '2025-11-22 11:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000093',
        'Máy in 3D hỏng lâu ngày',
        'Máy in 3D ở lab bị hỏng hơn 2 tháng chưa sửa.',
        'Phòng Lab 3D',
        'REJECTED',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000001',
        '2025-11-23 14:00:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000094',
        'Hỗ trợ tham gia ABU Robocon 2026',
        'Đội tuyển cần kinh phí sớm để chuẩn bị từ bây giờ.',
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
        'Chương trình tăng tốc khởi nghiệp',
        'Mong có chương trình 3-6 tháng đào tạo startup chuyên sâu.',
        NULL,
        'PENDING',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000007',
        '2025-11-27 16:30:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000096',
        'Đề tài NCKH 2026',
        'Chưa có kế hoạch chi tiết cho đợt đề tài NCKH năm tới.',
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
        'Cuộc thi ý tưởng 2026',
        'Mong sớm có thông báo cuộc thi ý tưởng khởi nghiệp 2026.',
        NULL,
        'PENDING',
        false,
        'e0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000007',
        '2025-12-02 14:20:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000098',
        'Hỗ trợ công bố Q1',
        'Sinh viên có bài báo Q1 nhưng chưa được thưởng xứng đáng.',
        NULL,
        'IN_PROGRESS',
        false,
        'e0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000005',
        '2025-12-04 11:10:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000099',
        'Phòng lab mới',
        'Mong sớm có phòng lab chuyên sâu về AI và IoT.',
        NULL,
        'PENDING',
        false,
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000001',
        '2025-12-05 15:50:00'
    ),
    (
        'f0000000-0000-0000-0000-000000000100',
        'Hội nghị NCKH sinh viên 2026',
        'Cần lên kế hoạch sớm để sinh viên chuẩn bị bài báo.',
        NULL,
        'IN_PROGRESS',
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
    'Nhà vệ sinh bẩn',
    'Nhiều nhà vệ sinh thiếu giấy, xà phòng và rất bẩn.',
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
    'Điện hay mất',
    'Mất điện giữa giờ học 2-3 lần/tuần.',
    'Toàn trường',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000011',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-07 15:30:00'
),
(
    'f0000000-0000-0000-0000-000000000168',
    'Nước uống miễn phí',
    'Cần lắp thêm máy lọc nước nóng lạnh ở các tòa nhà.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000012',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-10 10:20:00'
),
(
    'f0000000-0000-0000-0000-000000000169',
    'Cây xanh ít',
    'Khuôn viên trường ít cây xanh, rất nóng vào mùa hè.',
    'Khuôn viên',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000013',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-13 14:40:00'
),
(
    'f0000000-0000-0000-0000-000000000170',
    'Bãi xe chật',
    'Bãi xe máy đầy, phải gửi ngoài tốn thêm tiền.',
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
    'Đường nội bộ hỏng',
    'Đường từ cổng chính vào tòa A lún, ngập nước mưa.',
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
    'Thang máy hay hỏng',
    'Thang máy tòa C thường xuyên kẹt.',
    'Tòa nhà C',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000016',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-22 13:20:00'
),
(
    'f0000000-0000-0000-0000-000000000173',
    'Phòng học nóng',
    'Nhiều phòng không đủ máy lạnh.',
    'Tòa nhà E',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000017',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-25 16:10:00'
),
(
    'f0000000-0000-0000-0000-000000000174',
    'Rác không được dọn',
    'Có ngày rác để 2-3 ngày mới dọn.',
    'Khuôn viên',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000020',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-28 10:30:00'
),
(
    'f0000000-0000-0000-0000-000000000175',
    'Cần thêm ghế đá',
    'Khuôn viên ít ghế cho sinh viên nghỉ ngơi.',
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
    'Hệ thống PCCC',
    'Nhiều bình chữa cháy hết hạn sử dụng.',
    'Các tòa nhà',
    'IN_PROGRESS',
    false,
    'e0000000-0000-0000-0000-000000000022',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000006',
    '2025-12-02 09:20:00'
),
(
    'f0000000-0000-0000-0000-000000000177',
    'Sân thể thao xuống cấp',
    'Sân bóng đá mặt cỏ bị trọc, nguy hiểm.',
    'Sân thể thao',
    'PENDING',
    false,
    'e0000000-0000-0000-0000-000000000030',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-03 15:10:00'
),
(
    'f0000000-0000-0000-0000-000000000178',
    'Nhà để xe mưa dột',
    'Xe máy bị ướt khi trời mưa.',
    'Bãi xe',
    'IN_PROGRESS',
    false,
    'e0000000-0000-0000-0000-000000000031',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-04 11:40:00'
),
(
    'f0000000-0000-0000-0000-000000000179',
    'Cần sơn lại tường',
    'Nhiều tòa nhà tường bong tróc, cũ kỹ.',
    'Tòa nhà A',
    'PENDING',
    false,
    'e0000000-0000-0000-0000-000000000032',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-05 13:25:00'
),
(
    'f0000000-0000-0000-0000-000000000180',
    'Hồ bơi chưa hoạt động',
    'Hồ bơi xây xong 2 năm nhưng chưa mở cửa.',
    'Khu thể thao',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000033',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-06 10:15:00'
),
(
    'f0000000-0000-0000-0000-000000000181',
    'Cần thêm thùng rác',
    'Khu vực căng tin thiếu thùng rác.',
    'Căng tin',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000040',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000001',
    '2025-12-07 12:30:00'
),
(
    'f0000000-0000-0000-0000-000000000182',
    'Khuôn viên thiếu đèn',
    'Ban đêm một số khu vực tối, không an toàn.',
    'Khuôn viên',
    'IN_PROGRESS',
    false,
    'e0000000-0000-0000-0000-000000000041',
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000006',
    '2025-12-07 16:50:00'
),

-- 10. Phòng Tuyển sinh và CTSV (d000...010) → 18 feedbacks
(
    'f0000000-0000-0000-0000-000000000183',
    'Thông tin tuyển sinh 2026 chưa có',
    'Đến tháng 12 vẫn chưa thấy đề án tuyển sinh.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000002',
    '2025-11-03 10:30:00'
),
(
    'f0000000-0000-0000-0000-000000000184',
    'Học bổng tân sinh viên ít',
    'Chỉ có 10 suất học bổng 100% cho thí sinh cao điểm.',
    'NULL',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000005',
    '2025-11-06 13:45:00'
),
(
    'f0000000-0000-0000-0000-000000000185',
    'Tư vấn tuyển sinh online kém',
    'Chatbot trả lời không đúng, nhân viên ít phản hồi.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000003',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000002',
    '2025-11-09 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000186',
    'Tuần sinh hoạt công dân dài',
    '1 tuần toàn học chính trị, sinh viên rất chán.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000004',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000002',
    '2025-11-12 11:10:00'
),
(
    'f0000000-0000-0000-0000-000000000187',
    'Hỗ trợ miễn giảm học phí chậm',
    'Hồ sơ nộp từ tháng 9 đến nay chưa giải quyết.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000005',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000005',
    '2025-11-15 14:30:00'
),
(
    'f0000000-0000-0000-0000-000000000188',
    'Chưa có ký túc xá cho tân sinh viên',
    'Tân sinh viên ở xa phải thuê trọ giá cao.',
    'Ký túc xá',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000006',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    '2025-11-18 09:50:00'
),
(
    'f0000000-0000-0000-0000-000000000189',
    'Chương trình định hướng nghề nghiệp',
    'Tuần sinh hoạt công dân thiếu nội dung hướng nghiệp.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000010',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000003',
    '2025-11-21 13:15:00'
),
(
    'f0000000-0000-0000-0000-000000000190',
    'Học bổng khuyến khích học tập',
    'Tiêu chí quá cao, ít sinh viên đạt được.',
    'NULL',
    'REJECTED',
    false,
    'e0000000-0000-0000-0000-000000000011',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000005',
    '2025-11-24 16:40:00'
),
(
    'f0000000-0000-0000-0000-000000000191',
    'Hỗ trợ vay học phí',
    'Chưa có thông tin vay học phí lãi suất 0%.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000012',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000005',
    '2025-11-27 10:20:00'
),
(
    'f0000000-0000-0000-0000-000000000192',
    'Hoạt động chào tân sinh viên',
    'Năm nay không có đêm gala chào tân sinh viên.',
    'Nhà văn hóa',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000013',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000003',
    '2025-11-30 14:50:00'
),
(
    'f0000000-0000-0000-0000-000000000193',
    'Chính sách sinh viên khó khăn',
    'Nhiều sinh viên nghèo chưa được hỗ trợ kịp thời.',
    'NULL',
    'PENDING',
    false,
    'e0000000-0000-0000-0000-000000000014',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000005',
    '2025-12-01 11:30:00'
),
(
    'f0000000-0000-0000-0000-000000000194',
    'Đề án tuyển sinh 2026',
    'Vẫn chưa công bố chỉ tiêu từng ngành.',
    'NULL',
    'IN_PROGRESS',
    false,
    'e0000000-0000-0000-0000-000000000015',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000002',
    '2025-12-02 15:20:00'
),
(
    'f0000000-0000-0000-0000-000000000195',
    'Học bổng tài năng',
    'Chưa có học bổng dành riêng cho sinh viên đạt giải quốc gia.',
    'NULL',
    'PENDING',
    false,
    'e0000000-0000-0000-0000-000000000016',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000005',
    '2025-12-03 09:40:00'
),
(
    'f0000000-0000-0000-0000-000000000196',
    'Chương trình cố vấn học tập',
    'Mỗi lớp cần có cố vấn học tập đồng hành.',
    'NULL',
    'IN_PROGRESS',
    false,
    'e0000000-0000-0000-0000-000000000017',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000002',
    '2025-12-04 13:10:00'
),
(
    'f0000000-0000-0000-0000-000000000197',
    'Hỗ trợ tâm lý sinh viên',
    'Nhiều sinh viên áp lực học tập nhưng chưa có phòng tư vấn.',
    'NULL',
    'PENDING',
    false,
    'e0000000-0000-0000-0000-000000000020',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000007',
    '2025-12-05 16:30:00'
),
(
    'f0000000-0000-0000-0000-000000000198',
    'Chính sách bảo hiểm y tế',
    'Nhiều sinh viên chưa được hướng dẫn đóng BHYT đúng cách.',
    'NULL',
    'RESOLVED',
    false,
    'e0000000-0000-0000-0000-000000000021',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000007',
    '2025-12-06 10:45:00'
),
(
    'f0000000-0000-0000-0000-000000000199',
    'Học bổng vượt khó',
    'Cần tăng giá trị học bổng cho sinh viên mồ côi, hộ nghèo.',
    'NULL',
    'IN_PROGRESS',
    false,
    'e0000000-0000-0000-0000-000000000022',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000005',
    '2025-12-07 12:15:00'
),
(
    'f0000000-0000-0000-0000-000000000200',
    'Ngày hội tư vấn tuyển sinh',
    'Năm nay chưa tổ chức ngày hội tư vấn cho học sinh THPT.',
    'NULL',
    'PENDING',
    false,
    'e0000000-0000-0000-0000-000000000030',
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000003',
    '2025-12-07 15:50:00'
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
VALUES (
        '10000000-0000-0000-0000-000000000001',
        'f0000000-0000-0000-0000-000000000201',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-01-02 16:25:00'
    ),
    (
        '10000000-0000-0000-0000-000000000002',
        'f0000000-0000-0000-0000-000000000202',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-01-03 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000003',
        'f0000000-0000-0000-0000-000000000203',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-01-05 18:15:00'
    ),
    (
        '10000000-0000-0000-0000-000000000004',
        'f0000000-0000-0000-0000-000000000204',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-01-07 20:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000005',
        'f0000000-0000-0000-0000-000000000205',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-01-08 23:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000006',
        'f0000000-0000-0000-0000-000000000206',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-01-10 17:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000007',
        'f0000000-0000-0000-0000-000000000207',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-01-12 21:55:00'
    ),
    (
        '10000000-0000-0000-0000-000000000008',
        'f0000000-0000-0000-0000-000000000208',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-01-14 19:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000009',
        'f0000000-0000-0000-0000-000000000209',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-01-15 22:45:00'
    ),
    (
        '10000000-0000-0000-0000-000000000010',
        'f0000000-0000-0000-0000-000000000210',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-01-17 19:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000011',
        'f0000000-0000-0000-0000-000000000211',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-01-18 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000012',
        'f0000000-0000-0000-0000-000000000212',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-01-20 17:35:00'
    ),
    (
        '10000000-0000-0000-0000-000000000013',
        'f0000000-0000-0000-0000-000000000213',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-01-22 21:50:00'
    ),
    (
        '10000000-0000-0000-0000-000000000014',
        'f0000000-0000-0000-0000-000000000214',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-01-24 18:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000015',
        'f0000000-0000-0000-0000-000000000215',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-01-25 22:15:00'
    ),
    (
        '10000000-0000-0000-0000-000000000016',
        'f0000000-0000-0000-0000-000000000216',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-01-27 16:45:00'
    ),
    (
        '10000000-0000-0000-0000-000000000017',
        'f0000000-0000-0000-0000-000000000217',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-01-28 23:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000018',
        'f0000000-0000-0000-0000-000000000218',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-01-29 19:55:00'
    ),
    (
        '10000000-0000-0000-0000-000000000019',
        'f0000000-0000-0000-0000-000000000219',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-01-30 23:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000020',
        'f0000000-0000-0000-0000-000000000220',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-01-31 18:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000021',
        'f0000000-0000-0000-0000-000000000221',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-02-01 17:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000022',
        'f0000000-0000-0000-0000-000000000222',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-02-03 21:45:00'
    ),
    (
        '10000000-0000-0000-0000-000000000023',
        'f0000000-0000-0000-0000-000000000223',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-02-05 18:55:00'
    ),
    (
        '10000000-0000-0000-0000-000000000024',
        'f0000000-0000-0000-0000-000000000224',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-02-07 22:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000025',
        'f0000000-0000-0000-0000-000000000225',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-02-08 19:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000026',
        'f0000000-0000-0000-0000-000000000226',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-02-10 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000027',
        'f0000000-0000-0000-0000-000000000227',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-02-12 17:25:00'
    ),
    (
        '10000000-0000-0000-0000-000000000028',
        'f0000000-0000-0000-0000-000000000228',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-02-14 21:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000029',
        'f0000000-0000-0000-0000-000000000229',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-02-15 18:50:00'
    ),
    (
        '10000000-0000-0000-0000-000000000030',
        'f0000000-0000-0000-0000-000000000230',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-02-17 23:15:00'
    ),
    (
        '10000000-0000-0000-0000-000000000031',
        'f0000000-0000-0000-0000-000000000231',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-02-18 19:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000032',
        'f0000000-0000-0000-0000-000000000232',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-02-19 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000033',
        'f0000000-0000-0000-0000-000000000233',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-02-20 17:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000034',
        'f0000000-0000-0000-0000-000000000234',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-02-21 22:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000035',
        'f0000000-0000-0000-0000-000000000235',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-02-22 18:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000036',
        'f0000000-0000-0000-0000-000000000236',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-02-24 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000037',
        'f0000000-0000-0000-0000-000000000237',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-02-25 19:55:00'
    ),
    (
        '10000000-0000-0000-0000-000000000038',
        'f0000000-0000-0000-0000-000000000238',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-02-26 23:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000039',
        'f0000000-0000-0000-0000-000000000239',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-02-27 17:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000040',
        'f0000000-0000-0000-0000-000000000240',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-02-28 21:15:00'
    ),
    (
        '10000000-0000-0000-0000-000000000041',
        'f0000000-0000-0000-0000-000000000241',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-03-01 18:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000042',
        'f0000000-0000-0000-0000-000000000242',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-03-03 22:50:00'
    ),
    (
        '10000000-0000-0000-0000-000000000043',
        'f0000000-0000-0000-0000-000000000243',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-03-05 19:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000044',
        'f0000000-0000-0000-0000-000000000244',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-03-07 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000045',
        'f0000000-0000-0000-0000-000000000245',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-03-08 17:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000046',
        'f0000000-0000-0000-0000-000000000246',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-03-10 21:45:00'
    ),
    (
        '10000000-0000-0000-0000-000000000047',
        'f0000000-0000-0000-0000-000000000247',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-03-12 18:55:00'
    ),
    (
        '10000000-0000-0000-0000-000000000048',
        'f0000000-0000-0000-0000-000000000248',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-03-14 22:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000049',
        'f0000000-0000-0000-0000-000000000249',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-03-15 19:15:00'
    ),
    (
        '10000000-0000-0000-0000-000000000050',
        'f0000000-0000-0000-0000-000000000250',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-03-17 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000051',
        'f0000000-0000-0000-0000-000000000251',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-03-18 17:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000052',
        'f0000000-0000-0000-0000-000000000252',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-03-19 22:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000053',
        'f0000000-0000-0000-0000-000000000253',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-03-20 18:25:00'
    ),
    (
        '10000000-0000-0000-0000-000000000054',
        'f0000000-0000-0000-0000-000000000254',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-03-21 22:45:00'
    ),
    (
        '10000000-0000-0000-0000-000000000055',
        'f0000000-0000-0000-0000-000000000255',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-03-22 17:50:00'
    ),
    (
        '10000000-0000-0000-0000-000000000056',
        'f0000000-0000-0000-0000-000000000256',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-03-24 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000057',
        'f0000000-0000-0000-0000-000000000257',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-03-25 17:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000058',
        'f0000000-0000-0000-0000-000000000258',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-03-26 23:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000059',
        'f0000000-0000-0000-0000-000000000259',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-03-27 18:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000060',
        'f0000000-0000-0000-0000-000000000260',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-03-28 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000061',
        'f0000000-0000-0000-0000-000000000262',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-04-01 16:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000062',
        'f0000000-0000-0000-0000-000000000263',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-04-03 21:55:00'
    ),
    (
        '10000000-0000-0000-0000-000000000063',
        'f0000000-0000-0000-0000-000000000264',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-04-05 18:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000064',
        'f0000000-0000-0000-0000-000000000265',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-04-07 22:45:00'
    ),
    (
        '10000000-0000-0000-0000-000000000065',
        'f0000000-0000-0000-0000-000000000266',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-04-08 19:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000066',
        'f0000000-0000-0000-0000-000000000267',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-04-10 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000067',
        'f0000000-0000-0000-0000-000000000268',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-04-12 17:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000068',
        'f0000000-0000-0000-0000-000000000269',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-04-14 21:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000069',
        'f0000000-0000-0000-0000-000000000270',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-04-15 18:50:00'
    ),
    (
        '10000000-0000-0000-0000-000000000070',
        'f0000000-0000-0000-0000-000000000271',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-04-17 23:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000071',
        'f0000000-0000-0000-0000-000000000272',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-04-18 19:35:00'
    ),
    (
        '10000000-0000-0000-0000-000000000072',
        'f0000000-0000-0000-0000-000000000273',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-04-19 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000073',
        'f0000000-0000-0000-0000-000000000274',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-04-20 17:45:00'
    ),
    (
        '10000000-0000-0000-0000-000000000074',
        'f0000000-0000-0000-0000-000000000275',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-04-21 22:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000075',
        'f0000000-0000-0000-0000-000000000276',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-04-22 18:25:00'
    ),
    (
        '10000000-0000-0000-0000-000000000076',
        'f0000000-0000-0000-0000-000000000277',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-04-24 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000077',
        'f0000000-0000-0000-0000-000000000278',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-04-25 19:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000078',
        'f0000000-0000-0000-0000-000000000279',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-04-26 23:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000079',
        'f0000000-0000-0000-0000-000000000280',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-04-27 17:55:00'
    ),
    (
        '10000000-0000-0000-0000-000000000080',
        'f0000000-0000-0000-0000-000000000281',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-05-01 16:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000081',
        'f0000000-0000-0000-0000-000000000282',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-05-03 21:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000082',
        'f0000000-0000-0000-0000-000000000283',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-05-05 18:50:00'
    ),
    (
        '10000000-0000-0000-0000-000000000083',
        'f0000000-0000-0000-0000-000000000284',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-05-07 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000084',
        'f0000000-0000-0000-0000-000000000285',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-05-08 19:15:00'
    ),
    (
        '10000000-0000-0000-0000-000000000085',
        'f0000000-0000-0000-0000-000000000286',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-05-10 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000086',
        'f0000000-0000-0000-0000-000000000287',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-05-12 17:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000087',
        'f0000000-0000-0000-0000-000000000288',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-05-14 22:45:00'
    ),
    (
        '10000000-0000-0000-0000-000000000088',
        'f0000000-0000-0000-0000-000000000289',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-05-15 18:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000089',
        'f0000000-0000-0000-0000-000000000290',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-05-17 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000090',
        'f0000000-0000-0000-0000-000000000291',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-05-18 19:25:00'
    ),
    (
        '10000000-0000-0000-0000-000000000091',
        'f0000000-0000-0000-0000-000000000292',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-05-19 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000092',
        'f0000000-0000-0000-0000-000000000293',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-05-20 17:55:00'
    ),
    (
        '10000000-0000-0000-0000-000000000093',
        'f0000000-0000-0000-0000-000000000294',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-05-21 23:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000094',
        'f0000000-0000-0000-0000-000000000295',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-05-22 18:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000095',
        'f0000000-0000-0000-0000-000000000296',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-05-24 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000096',
        'f0000000-0000-0000-0000-000000000297',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-05-25 19:50:00'
    ),
    (
        '10000000-0000-0000-0000-000000000097',
        'f0000000-0000-0000-0000-000000000298',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-05-26 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000098',
        'f0000000-0000-0000-0000-000000000299',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-05-27 17:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000099',
        'f0000000-0000-0000-0000-000000000300',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-06-01 17:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000100',
        'f0000000-0000-0000-0000-000000000301',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-06-03 21:45:00'
    ),
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
        '10000000-0000-0000-0000-000000000128',
        'f0000000-0000-0000-0000-000000000329',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-07-18 19:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000129',
        'f0000000-0000-0000-0000-000000000330',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-07-19 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000130',
        'f0000000-0000-0000-0000-000000000331',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-07-20 17:45:00'
    ),
    (
        '10000000-0000-0000-0000-000000000131',
        'f0000000-0000-0000-0000-000000000332',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-07-21 23:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000132',
        'f0000000-0000-0000-0000-000000000333',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-07-22 18:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000133',
        'f0000000-0000-0000-0000-000000000334',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-07-24 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000134',
        'f0000000-0000-0000-0000-000000000335',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-07-25 19:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000135',
        'f0000000-0000-0000-0000-000000000336',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-07-26 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000136',
        'f0000000-0000-0000-0000-000000000337',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-07-27 17:50:00'
    ),
    (
        '10000000-0000-0000-0000-000000000137',
        'f0000000-0000-0000-0000-000000000338',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-08-01 17:15:00'
    ),
    (
        '10000000-0000-0000-0000-000000000138',
        'f0000000-0000-0000-0000-000000000339',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-08-03 21:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000139',
        'f0000000-0000-0000-0000-000000000340',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-08-05 18:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000140',
        'f0000000-0000-0000-0000-000000000341',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-08-07 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000141',
        'f0000000-0000-0000-0000-000000000342',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-08-08 19:55:00'
    ),
    (
        '10000000-0000-0000-0000-000000000142',
        'f0000000-0000-0000-0000-000000000343',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-08-10 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000143',
        'f0000000-0000-0000-0000-000000000344',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-08-12 17:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000144',
        'f0000000-0000-0000-0000-000000000345',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-08-14 21:45:00'
    ),
    (
        '10000000-0000-0000-0000-000000000145',
        'f0000000-0000-0000-0000-000000000346',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-08-15 18:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000146',
        'f0000000-0000-0000-0000-000000000347',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-08-17 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000147',
        'f0000000-0000-0000-0000-000000000348',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-08-18 19:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000148',
        'f0000000-0000-0000-0000-000000000349',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-08-19 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000149',
        'f0000000-0000-0000-0000-000000000350',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-08-20 17:50:00'
    ),
    (
        '10000000-0000-0000-0000-000000000150',
        'f0000000-0000-0000-0000-000000000351',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-08-21 23:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000151',
        'f0000000-0000-0000-0000-000000000352',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-08-22 18:35:00'
    ),
    (
        '10000000-0000-0000-0000-000000000152',
        'f0000000-0000-0000-0000-000000000353',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-08-24 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000153',
        'f0000000-0000-0000-0000-000000000354',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-08-25 19:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000154',
        'f0000000-0000-0000-0000-000000000355',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-08-26 23:59:00'
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
        '10000000-0000-0000-0000-000000000166',
        'f0000000-0000-0000-0000-000000000367',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-09-18 19:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000167',
        'f0000000-0000-0000-0000-000000000368',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-09-19 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000168',
        'f0000000-0000-0000-0000-000000000369',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-09-20 17:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000169',
        'f0000000-0000-0000-0000-000000000370',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-09-21 23:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000170',
        'f0000000-0000-0000-0000-000000000371',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-09-22 18:50:00'
    ),
    (
        '10000000-0000-0000-0000-000000000171',
        'f0000000-0000-0000-0000-000000000372',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-09-24 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000172',
        'f0000000-0000-0000-0000-000000000373',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-09-25 19:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000173',
        'f0000000-0000-0000-0000-000000000374',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-09-26 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000174',
        'f0000000-0000-0000-0000-000000000375',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-09-27 17:55:00'
    ),
    (
        '10000000-0000-0000-0000-000000000175',
        'f0000000-0000-0000-0000-000000000376',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-10-01 17:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000176',
        'f0000000-0000-0000-0000-000000000377',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-10-03 21:45:00'
    ),
    (
        '10000000-0000-0000-0000-000000000177',
        'f0000000-0000-0000-0000-000000000378',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-10-05 18:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000178',
        'f0000000-0000-0000-0000-000000000379',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-10-07 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000179',
        'f0000000-0000-0000-0000-000000000380',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-10-08 19:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000180',
        'f0000000-0000-0000-0000-000000000381',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-10-10 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000181',
        'f0000000-0000-0000-0000-000000000382',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-10-12 17:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000182',
        'f0000000-0000-0000-0000-000000000383',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-10-14 22:20:00'
    ),
    (
        '10000000-0000-0000-0000-000000000183',
        'f0000000-0000-0000-0000-000000000384',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-10-15 18:55:00'
    ),
    (
        '10000000-0000-0000-0000-000000000184',
        'f0000000-0000-0000-0000-000000000385',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-10-17 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000185',
        'f0000000-0000-0000-0000-000000000386',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-10-18 19:25:00'
    ),
    (
        '10000000-0000-0000-0000-000000000186',
        'f0000000-0000-0000-0000-000000000387',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-10-19 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000187',
        'f0000000-0000-0000-0000-000000000388',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-10-20 17:50:00'
    ),
    (
        '10000000-0000-0000-0000-000000000188',
        'f0000000-0000-0000-0000-000000000389',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-10-21 23:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000189',
        'f0000000-0000-0000-0000-000000000390',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-10-22 18:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000190',
        'f0000000-0000-0000-0000-000000000391',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-10-24 23:59:00'
    ),
    (
        '10000000-0000-0000-0000-000000000191',
        'f0000000-0000-0000-0000-000000000392',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-10-25 19:15:00'
    ),
    (
        '10000000-0000-0000-0000-000000000192',
        'f0000000-0000-0000-0000-000000000393',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-10-26 23:59:00'
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
    (
        '10000000-0000-0000-0000-000000000201',
        'f0000000-0000-0000-0000-000000000001',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-11-01 15:40:00'
    ),
    (
        '10000000-0000-0000-0000-000000000202',
        'f0000000-0000-0000-0000-000000000002',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-11-01 22:10:00'
    ),
    (
        '10000000-0000-0000-0000-000000000203',
        'f0000000-0000-0000-0000-000000000003',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-11-02 18:20:00'
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
        '10000000-0000-0000-0000-000000000205',
        'f0000000-0000-0000-0000-000000000005',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-11-03 19:50:00'
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
        '10000000-0000-0000-0000-000000000207',
        'f0000000-0000-0000-0000-000000000007',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-11-04 16:15:00'
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
        '10000000-0000-0000-0000-000000000209',
        'f0000000-0000-0000-0000-000000000009',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-11-05 17:30:00'
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
        '10000000-0000-0000-0000-000000000211',
        'f0000000-0000-0000-0000-000000000011',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-11-05 23:59:00'
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
        '10000000-0000-0000-0000-000000000213',
        'f0000000-0000-0000-0000-000000000013',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-11-07 18:45:00'
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
        '10000000-0000-0000-0000-000000000215',
        'f0000000-0000-0000-0000-000000000015',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-11-09 16:20:00'
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
        '10000000-0000-0000-0000-000000000217',
        'f0000000-0000-0000-0000-000000000017',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-11-10 23:59:00'
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
        '10000000-0000-0000-0000-000000000219',
        'f0000000-0000-0000-0000-000000000019',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-11-12 19:15:00'
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
        '10000000-0000-0000-0000-000000000221',
        'f0000000-0000-0000-0000-000000000021',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-11-13 19:20:00'
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
        '10000000-0000-0000-0000-000000000223',
        'f0000000-0000-0000-0000-000000000023',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-11-15 17:10:00'
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
        '10000000-0000-0000-0000-000000000225',
        'f0000000-0000-0000-0000-000000000025',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-11-15 23:59:00'
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
        '10000000-0000-0000-0000-000000000227',
        'f0000000-0000-0000-0000-000000000027',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-11-17 22:40:00'
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
        '10000000-0000-0000-0000-000000000229',
        'f0000000-0000-0000-0000-000000000029',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Thanh tra giáo dục từ chối.',
        NULL,
        '2025-11-19 19:20:00'
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
        '10000000-0000-0000-0000-000000000231',
        'f0000000-0000-0000-0000-000000000031',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-11-21 16:45:00'
    ),
    (
        '10000000-0000-0000-0000-000000000232',
        'f0000000-0000-0000-0000-000000000032',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết',
        NULL,
        '2025-11-30 13:30:00'
    ),
    (
        '10000000-0000-0000-0000-000000000233',
        'f0000000-0000-0000-0000-000000000033',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
        NULL,
        '2025-11-23 23:59:00'
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

-- f...035 - RESOLVED
(
    '10000000-0000-0000-0000-000000000237',
    'f0000000-0000-0000-0000-000000000035',
    'PENDING',
    'Cảm ơn bạn đã gửi phản góp ý đến bộ phận Phòng Thanh tra giáo dục. Chúng tôi sẽ cố gắng xử lý góp ý của bạn trong thời gian sớm nhất.',
    NULL,
    '2025-12-02 14:15:00'
),
(
    '10000000-0000-0000-0000-000000000238',
    'f0000000-0000-0000-0000-000000000035',
    'IN_PROGRESS',
    'Góp ý đang được bộ phận Phòng Thanh tra giáo dục xử lý.',
    NULL,
    '2025-12-02 15:00:00'
),
(
    '10000000-0000-0000-0000-000000000239',
    'f0000000-0000-0000-0000-000000000035',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Thanh tra giáo dục giải quyết.',
    NULL,
    '2025-12-03 09:00:00'
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
),
-- chưa có RESOLVED vì currentStatus = IN_PROGRESS

-- f...037 - PENDING (chưa xử lý xong)
(
    '10000000-0000-0000-0000-000000000242',
    'f0000000-0000-0000-0000-000000000037',
    'PENDING',
    'Cảm ơn bạn đã gửi phản góp ý đến bộ phận Phòng Thanh tra giáo dục. Chúng tôi sẽ cố gắng xử lý góp ý của bạn trong thời gian sớm nhất.',
    NULL,
    '2025-12-05 13:00:00'
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
        '10000000-0000-0000-0000-000000000244',
        'f0000000-0000-0000-0000-000000000039',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.',
        NULL,
        '2025-11-04 13:50:00'
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
        '10000000-0000-0000-0000-000000000247',
        'f0000000-0000-0000-0000-000000000042',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.',
        NULL,
        '2025-11-07 12:15:00'
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
        '10000000-0000-0000-0000-000000000250',
        'f0000000-0000-0000-0000-000000000045',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.',
        NULL,
        '2025-11-10 11:45:00'
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
        '10000000-0000-0000-0000-000000000253',
        'f0000000-0000-0000-0000-000000000048',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.',
        NULL,
        '2025-11-13 07:30:00'
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
        '10000000-0000-0000-0000-000000000255',
        'f0000000-0000-0000-0000-000000000050',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.',
        NULL,
        '2025-11-15 08:40:00'
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
        '10000000-0000-0000-0000-000000000258',
        'f0000000-0000-0000-0000-000000000053',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.',
        NULL,
        '2025-11-18 11:55:00'
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
        '10000000-0000-0000-0000-000000000260',
        'f0000000-0000-0000-0000-000000000056',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.',
        NULL,
        '2025-11-21 08:20:00'
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
        '10000000-0000-0000-0000-000000000262',
        'f0000000-0000-0000-0000-000000000058',
        'REJECTED',
        'Góp ý đã bị bộ phận Phòng Quan hệ doanh nghiệp từ chối.',
        NULL,
        '2025-11-23 09:55:00'
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
        '10000000-0000-0000-0000-000000000266',
        'f0000000-0000-0000-0000-000000000063',
        'RESOLVED',
        'Góp ý đã được bộ phận Phòng Quan hệ doanh nghiệp giải quyết.',
        NULL,
        '2025-11-28 13:30:00'
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
    '10000000-0000-0000-0000-000000000269',
    'f0000000-0000-0000-0000-000000000072',
    'REJECTED',
    'Góp ý đã bị bộ phận Phòng Khoa học & Công nghệ từ chối.',
    NULL,
    '2025-11-03 12:15:00'
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
    '10000000-0000-0000-0000-000000000272',
    'f0000000-0000-0000-0000-000000000075',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.',
    NULL,
    '2025-11-06 08:20:00'
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
    '10000000-0000-0000-0000-000000000275',
    'f0000000-0000-0000-0000-000000000078',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.',
    NULL,
    '2025-11-09 09:30:00'
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
    '10000000-0000-0000-0000-000000000278',
    'f0000000-0000-0000-0000-000000000081',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.',
    NULL,
    '2025-11-12 07:40:00'
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
    '10000000-0000-0000-0000-000000000281',
    'f0000000-0000-0000-0000-000000000084',
    'REJECTED',
    'Góp ý đã bị bộ phận Phòng Khoa học & Công nghệ từ chối.',
    NULL,
    '2025-11-15 13:40:00'
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
    '10000000-0000-0000-0000-000000000284',
    'f0000000-0000-0000-0000-000000000087',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.',
    NULL,
    '2025-11-18 07:55:00'
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
    '10000000-0000-0000-0000-000000000286',
    'f0000000-0000-0000-0000-000000000090',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Khoa học & Công nghệ giải quyết.',
    NULL,
    '2025-11-21 11:20:00'
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
    '10000000-0000-0000-0000-000000000289',
    'f0000000-0000-0000-0000-000000000093',
    'REJECTED',
    'Góp ý đã bị bộ phận Phòng Khoa học & Công nghệ từ chối.',
    NULL,
    '2025-11-24 12:15:00'
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
    '10000000-0000-0000-0000-000000000335',
    'f0000000-0000-0000-0000-000000000166',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Quản trị cơ sở vật chất giải quyết.',
    NULL,
    '2025-11-06 15:30:00'
),
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
    '10000000-0000-0000-0000-000000000338',
    'f0000000-0000-0000-0000-000000000169',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Quản trị cơ sở vật chất giải quyết.',
    NULL,
    '2025-11-16 11:20:00'
),
(
    '10000000-0000-0000-0000-000000000339',
    'f0000000-0000-0000-0000-000000000170',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Quản trị cơ sở vật chất giải quyết.',
    NULL,
    '2025-11-19 13:50:00'
),
(
    '10000000-0000-0000-0000-000000000340',
    'f0000000-0000-0000-0000-000000000171',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Quản trị cơ sở vật chất giải quyết.',
    NULL,
    '2025-11-22 10:30:00'
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
(
    '10000000-0000-0000-0000-000000000343',
    'f0000000-0000-0000-0000-000000000174',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Quản trị cơ sở vật chất giải quyết.',
    NULL,
    '2025-12-01 14:20:00'
),
(
    '10000000-0000-0000-0000-000000000344',
    'f0000000-0000-0000-0000-000000000175',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Quản trị cơ sở vật chất giải quyết.',
    NULL,
    '2025-12-04 11:50:00'
),
(
    '10000000-0000-0000-0000-000000000345',
    'f0000000-0000-0000-0000-000000000180',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Quản trị cơ sở vật chất giải quyết.',
    NULL,
    '2025-12-09 13:30:00'
),
(
    '10000000-0000-0000-0000-000000000346',
    'f0000000-0000-0000-0000-000000000181',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Quản trị cơ sở vật chất giải quyết.',
    NULL,
    '2025-12-10 10:45:00'
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
    '10000000-0000-0000-0000-000000000348',
    'f0000000-0000-0000-0000-000000000184',
    'REJECTED',
    'Góp ý đã bị bộ phận Phòng Tuyển sinh và CTSV từ chối.',
    NULL,
    '2025-11-09 12:20:00'
),
(
    '10000000-0000-0000-0000-000000000349',
    'f0000000-0000-0000-0000-000000000185',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Tuyển sinh và CTSV giải quyết.',
    NULL,
    '2025-11-12 14:50:00'
),
(
    '10000000-0000-0000-0000-000000000350',
    'f0000000-0000-0000-0000-000000000186',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Tuyển sinh và CTSV giải quyết.',
    NULL,
    '2025-11-15 13:10:00'
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
    '10000000-0000-0000-0000-000000000353',
    'f0000000-0000-0000-0000-000000000189',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Tuyển sinh và CTSV giải quyết.',
    NULL,
    '2025-11-24 15:20:00'
),
(
    '10000000-0000-0000-0000-000000000354',
    'f0000000-0000-0000-0000-000000000190',
    'REJECTED',
    'Góp ý đã bị bộ phận Phòng Tuyển sinh và CTSV từ chối.',
    NULL,
    '2025-11-27 14:10:00'
),
(
    '10000000-0000-0000-0000-000000000355',
    'f0000000-0000-0000-0000-000000000191',
    'RESOLVED',
    'Góp ý đã được bộ phận Phòng Tuyển sinh và CTSV giải quyết.',
    NULL,
    '2025-11-30 13:50:00'
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
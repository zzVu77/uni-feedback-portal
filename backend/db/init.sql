-- =================================================================
-- CLEAN UP (Xóa dữ liệu cũ nếu có để tránh lỗi trùng lặp)
-- =================================================================
TRUNCATE TABLE "FileAttachments", "Messages", "ClarificationConversations", 
"CommentReports", "Comments", "Votes", "ForumPosts", "ForwardingLogs", 
"FeedbackStatusHistory", "Feedbacks", "Announcements", "Users", 
"Departments", "Categories", "RefreshTokens", "Notifications" CASCADE;

-- =================================================================
-- STEP 1: CATEGORIES & DEPARTMENTS (Giữ nguyên vì ID đã chuẩn Hex)
-- =================================================================
INSERT INTO "Categories" ("id", "name", "isActive") VALUES
('c0000000-0000-0000-0000-000000000001', 'Cơ sở vật chất', true),
('c0000000-0000-0000-0000-000000000002', 'Đào tạo & Học vụ', true),
('c0000000-0000-0000-0000-000000000003', 'Hoạt động ngoại khóa', true),
('c0000000-0000-0000-0000-000000000004', 'Tác phong giảng viên', true),
('c0000000-0000-0000-0000-000000000005', 'Học phí & Tài chính', true),
('c0000000-0000-0000-0000-000000000006', 'An ninh trật tự', true),
('c0000000-0000-0000-0000-000000000007', 'Góp ý khác', true);

INSERT INTO "Departments" ("id", "name", "email", "description", "location", "phone", "createdAt") VALUES
-- 1. KHỐI PHÒNG BAN CHỨC NĂNG
('d0000000-0000-0000-0000-000000000001', 'Phòng Thanh tra giáo dục', 'thanhtra@uni.edu.vn', 'Chủ trì công tác thanh tra, kiểm tra nội bộ; giám sát việc thực hiện chính sách, pháp luật, quy chế đào tạo và nề nếp giảng dạy; tiếp nhận và giải quyết khiếu nại, tố cáo; thực hiện công tác phòng chống tham nhũng và đảm bảo kỷ cương trong nhà trường.', 'Tòa nhà A - Phòng A101', '028 3896 1001', NOW()),
('d0000000-0000-0000-0000-000000000002', 'Phòng Quan hệ doanh nghiệp', 'qhdn@uni.edu.vn', 'Xây dựng chiến lược hợp tác doanh nghiệp; tổ chức các hoạt động kết nối, ngày hội việc làm và hội thảo hướng nghiệp; tìm kiếm và phát triển nguồn học bổng tài trợ; hỗ trợ sinh viên tìm kiếm địa điểm thực tập và việc làm sau tốt nghiệp.', 'Tòa nhà A - Phòng A102', '028 3896 1002', NOW()),
('d0000000-0000-0000-0000-000000000003', 'Phòng Khoa học & Công nghệ', 'khcn@uni.edu.vn', 'Tham mưu và quản lý hoạt động nghiên cứu khoa học, chuyển giao công nghệ; quản lý các đề tài, dự án khoa học các cấp; tổ chức các hội nghị, hội thảo khoa học; thúc đẩy hoạt động sở hữu trí tuệ và khởi nghiệp đổi mới sáng tạo.', 'Tòa nhà A - Phòng A201', '028 3896 1003', NOW()),
('d0000000-0000-0000-0000-000000000004', 'Phòng Quan hệ quốc tế', 'qhqt@uni.edu.vn', 'Đầu mối quản lý các hoạt động hợp tác quốc tế; xây dựng và triển khai các chương trình trao đổi giảng viên, sinh viên; quản lý các dự án liên kết đào tạo với đối tác nước ngoài; thực hiện công tác lễ tân đối ngoại và tiếp đón đoàn khách quốc tế.', 'Tòa nhà A - Phòng A202', '028 3896 1004', NOW()),
('d0000000-0000-0000-0000-000000000005', 'Phòng Thiết bị – Vật tư', 'tbvt@uni.edu.vn', 'Lập kế hoạch và thực hiện mua sắm, cấp phát tài sản, trang thiết bị, vật tư phục vụ đào tạo và nghiên cứu; quản lý, theo dõi và tổ chức bảo trì, bảo dưỡng định kỳ hệ thống máy móc, thiết bị kỹ thuật toàn trường.', 'Tòa nhà A - Phòng A301', '028 3896 1005', NOW()),
('d0000000-0000-0000-0000-000000000006', 'Phòng Quản trị chiến lược', 'chienluoc@uni.edu.vn', 'Nghiên cứu, xây dựng và rà soát chiến lược phát triển Trường trung hạn và dài hạn; xây dựng hệ thống chỉ số đánh giá hiệu quả hoạt động (KPIs); phân tích dữ liệu và tư vấn cho Ban Giám hiệu về định hướng phát triển.', 'Tòa nhà A - Phòng A302', '028 3896 1006', NOW()),
('d0000000-0000-0000-0000-000000000007', 'Phòng Đảm bảo chất lượng', 'qa@uni.edu.vn', 'Xây dựng và vận hành hệ thống đảm bảo chất lượng bên trong; tổ chức tự đánh giá và đánh giá ngoài cơ sở giáo dục và chương trình đào tạo; thực hiện khảo sát ý kiến các bên liên quan để cải tiến liên tục chất lượng giáo dục.', 'Tòa nhà A - Phòng A401', '028 3896 1007', NOW()),
('d0000000-0000-0000-0000-000000000008', 'Phòng Tổ chức Hành chính', 'tchc@uni.edu.vn', 'Tham mưu về cơ cấu tổ chức, nhân sự, quy hoạch cán bộ; thực hiện chế độ chính sách, bảo hiểm xã hội; quản lý công tác văn thư, lưu trữ, hành chính, lễ tân khánh tiết và đảm bảo an ninh trật tự trong khuôn viên Trường.', 'Tòa nhà A - Phòng A402', '028 3896 1008', NOW()),
('d0000000-0000-0000-0000-000000000009', 'Phòng Quản trị cơ sở vật chất', 'qtcsvc@uni.edu.vn', 'Quản lý quy hoạch đất đai và đầu tư xây dựng cơ bản; quản lý, sửa chữa cơ sở hạ tầng, giảng đường, phòng làm việc; đảm bảo cung cấp điện, nước và vệ sinh môi trường, cảnh quan xanh - sạch - đẹp.', 'Tòa nhà A - Phòng A501', '028 3896 1009', NOW()),
('d0000000-0000-0000-0000-000000000010', 'Phòng Tuyển sinh và CTSV', 'ctsv@uni.edu.vn', 'Tư vấn tuyển sinh và truyền thông tuyển sinh; quản lý hồ sơ và dữ liệu sinh viên; thực hiện các chế độ chính sách, học bổng, miễn giảm học phí; tổ chức tuần sinh hoạt công dân và giáo dục chính trị tư tưởng cho sinh viên.', 'Tòa nhà A - Tầng trệt', '028 3896 1010', NOW()),
('d0000000-0000-0000-0000-000000000011', 'Phòng Kế hoạch – Tài chính', 'khtc@uni.edu.vn', 'Xây dựng kế hoạch tài chính và dự toán ngân sách hàng năm; quản lý nguồn thu, thực hiện chi trả lương và các khoản chi hoạt động; thực hiện công tác kế toán, kiểm soát chi tiêu và báo cáo tài chính theo quy định nhà nước.', 'Tòa nhà A - Phòng A105', '028 3896 1011', NOW()),
('d0000000-0000-0000-0000-000000000012', 'Phòng Đào tạo', 'pdt@uni.edu.vn', 'Tham mưu xây dựng và quản lý chương trình đào tạo; lập thời khóa biểu, kế hoạch giảng dạy; tổ chức đăng ký học phần, thi kết thúc học phần; xét công nhận tốt nghiệp và quản lý cấp phát văn bằng, chứng chỉ.', 'Tòa nhà A - Phòng A106', '028 3896 1012', NOW()),
('d0000000-0000-0000-0000-000000000013', 'Phòng Truyền thông', 'pr@uni.edu.vn', 'Xây dựng và quản trị nhận diện thương hiệu Nhà trường; quản lý vận hành website, mạng xã hội chính thức; tổ chức sự kiện truyền thông, quan hệ báo chí và xử lý khủng hoảng truyền thông.', 'Tòa nhà A - Phòng A205', '028 3896 1013', NOW()),

-- 2. KHỐI KHOA CHUYÊN MÔN
('d0000000-0000-0000-0000-000000000014', 'Khoa Xây dựng', 'khoaxaydung@uni.edu.vn', 'Đào tạo kỹ sư và cử nhân các chuyên ngành xây dựng dân dụng, cầu đường, kiến trúc; nghiên cứu các giải pháp kết cấu, vật liệu mới và quy hoạch đô thị bền vững; tổ chức thực hành, thực tập công trình cho sinh viên.', 'Tòa nhà B - Phòng B101', '028 3896 2014', NOW()),
('d0000000-0000-0000-0000-000000000015', 'Khoa CN Hóa học & Thực phẩm', 'khoahoa@uni.edu.vn', 'Đào tạo chuyên sâu về công nghệ hóa học, công nghệ thực phẩm, công nghệ sinh học; nghiên cứu phát triển sản phẩm thực phẩm, quy trình chế biến và kiểm nghiệm an toàn vệ sinh thực phẩm.', 'Tòa nhà B - Phòng B201', '028 3896 2015', NOW()),
('d0000000-0000-0000-0000-000000000016', 'Khoa Công nghệ Thông tin', 'fit@uni.edu.vn', 'Đào tạo nhân lực chất lượng cao lĩnh vực Công nghệ phần mềm, Hệ thống thông tin, Mạng máy tính và Trí tuệ nhân tạo; nghiên cứu ứng dụng chuyển đổi số và phát triển các giải pháp phần mềm thông minh.', 'Tòa nhà C - Phòng C501', '028 3896 2016', NOW()),
('d0000000-0000-0000-0000-000000000017', 'Khoa Cơ khí động lực', 'ckdl@uni.edu.vn', 'Đào tạo kỹ sư công nghệ kỹ thuật ô tô, máy động lực, xe điện; nghiên cứu cải tiến hiệu suất động cơ và công nghệ ô tô thông minh; quản lý hệ thống xưởng thực hành động cơ hiện đại.', 'Xưởng Thực hành Ô tô', '028 3896 2017', NOW()),
('d0000000-0000-0000-0000-000000000018', 'Khoa CN May & Thời trang', 'maythoitrang@uni.edu.vn', 'Đào tạo lĩnh vực thiết kế thời trang, công nghệ may và kinh doanh thời trang; tổ chức các show diễn thời trang sinh viên; nghiên cứu xu hướng và kỹ thuật may mặc tiên tiến.', 'Tòa nhà F - Phòng F101', '028 3896 2018', NOW()),
('d0000000-0000-0000-0000-000000000019', 'Khoa Điện – Điện tử', 'feee@uni.edu.vn', 'Đào tạo kỹ sư điện, điện tử viễn thông, tự động hóa và điều khiển; nghiên cứu về năng lượng tái tạo, vi mạch bán dẫn và hệ thống nhúng; quản lý các phòng thí nghiệm điện hiện đại.', 'Tòa nhà C - Phòng C301', '028 3896 2019', NOW()),
('d0000000-0000-0000-0000-000000000020', 'Khoa Cơ khí Chế tạo máy', 'ckm@uni.edu.vn', 'Đào tạo chuyên ngành kỹ thuật cơ khí, chế tạo máy, cơ điện tử và robot công nghiệp; nghiên cứu công nghệ CAD/CAM/CNC và thiết kế máy; vận hành xưởng cơ khí trung tâm phục vụ thực hành.', 'Xưởng Cơ khí Trung tâm', '028 3896 2020', NOW()),
('d0000000-0000-0000-0000-000000000021', 'Khoa Lý luận chính trị', 'llct@uni.edu.vn', 'Giảng dạy các môn lý luận chính trị (Triết học, Kinh tế chính trị...), Pháp luật đại cương; tuyên truyền đường lối chính sách của Đảng và Nhà nước; giáo dục đạo đức cách mạng cho sinh viên.', 'Tòa nhà B - Phòng B501', '028 3896 2021', NOW()),
('d0000000-0000-0000-0000-000000000022', 'Khoa Khoa học cơ bản', 'khcb@uni.edu.vn', 'Giảng dạy các môn khoa học cơ sở (Toán, Vật lý, Hóa đại cương) làm nền tảng cho các ngành kỹ thuật; tổ chức các kỳ thi Olympic sinh viên; nghiên cứu khoa học cơ bản và ứng dụng.', 'Tòa nhà B - Phòng B601', '028 3896 2022', NOW()),
('d0000000-0000-0000-0000-000000000023', 'Khoa In & Truyền thông', 'inbaochi@uni.edu.vn', 'Đào tạo kỹ sư công nghệ in, thiết kế đồ họa và truyền thông đa phương tiện; nghiên cứu công nghệ in ấn hiện đại và quy trình xuất bản số; hợp tác với các nhà xuất bản và công ty bao bì.', 'Tòa nhà F - Phòng F201', '028 3896 2023', NOW()),
('d0000000-0000-0000-0000-000000000024', 'Khoa Ngoại ngữ', 'kngoangu@uni.edu.vn', 'Đào tạo cử nhân Ngôn ngữ Anh và Tiếng Anh chuyên ngành kỹ thuật; giảng dạy Tiếng Anh không chuyên cho toàn trường; tổ chức các hoạt động ngoại khóa, câu lạc bộ tiếng Anh và thi chứng chỉ quốc tế.', 'Tòa nhà E - Phòng E101', '028 3896 2024', NOW()),
('d0000000-0000-0000-0000-000000000025', 'Khoa Kinh tế', 'kinhte@uni.edu.vn', 'Đào tạo các ngành Quản trị kinh doanh, Kế toán, Thương mại điện tử và Logistics; nghiên cứu về kinh tế học, quản trị doanh nghiệp và khởi nghiệp; kết nối thực tập tại các tập đoàn kinh tế.', 'Tòa nhà E - Phòng E201', '028 3896 2025', NOW()),
('d0000000-0000-0000-0000-000000000026', 'Khoa Đào tạo chất lượng cao', 'clc@uni.edu.vn', 'Quản lý và vận hành các chương trình đào tạo Chất lượng cao, Tiên tiến và Liên kết quốc tế; cung cấp môi trường học tập tiêu chuẩn quốc tế; tăng cường đào tạo ngoại ngữ và kỹ năng mềm chuyên sâu.', 'Tòa nhà A - Phòng A601', '028 3896 2026', NOW()),

-- 3. TRUNG TÂM VÀ VIỆN NGHIÊN CỨU
('d0000000-0000-0000-0000-000000000027', 'Trung tâm Dịch vụ sinh viên', 'dichvusv@uni.edu.vn', 'Cung cấp và quản lý các dịch vụ tiện ích hỗ trợ đời sống sinh viên: Căng tin, siêu thị tiện lợi, giữ xe, dịch vụ văn phòng phẩm; đảm bảo vệ sinh an toàn thực phẩm và chất lượng dịch vụ trong khuôn viên.', 'Khu Dịch vụ - Canteen', '028 3896 3027', NOW()),
('d0000000-0000-0000-0000-000000000028', 'Trung tâm Dạy học số', 'elearning@uni.edu.vn', 'Xây dựng và phát triển hệ thống quản lý học tập (LMS); số hóa học liệu và bài giảng; hỗ trợ giảng viên và sinh viên ứng dụng công nghệ thông tin trong dạy và học; triển khai đào tạo trực tuyến.', 'Tòa nhà Thông minh - Tầng 3', '028 3896 3028', NOW()),
('d0000000-0000-0000-0000-000000000029', 'Trung tâm Thông tin – Máy tính', 'ttmt@uni.edu.vn', 'Quản trị hệ thống mạng, máy chủ (Server) và trung tâm dữ liệu; đảm bảo an ninh mạng và an toàn thông tin; hỗ trợ kỹ thuật phần cứng, phần mềm và vận hành các phần mềm quản lý của Nhà trường.', 'Tòa nhà C - Phòng Server', '028 3896 3029', NOW()),
('d0000000-0000-0000-0000-000000000030', 'TT GD Thể chất và Quốc phòng', 'gdtcqp@uni.edu.vn', 'Tổ chức giảng dạy các học phần Giáo dục thể chất và Giáo dục Quốc phòng - An ninh; quản lý nhà thi đấu, sân bãi thể thao; tổ chức các giải đấu thể thao và phong trào rèn luyện sức khỏe cho sinh viên.', 'Nhà Thi đấu Đa năng', '028 3896 3030', NOW()),
('d0000000-0000-0000-0000-000000000031', 'Viện Sư phạm kỹ thuật', 'spkt@uni.edu.vn', 'Nghiên cứu khoa học về giáo dục nghề nghiệp; đào tạo, bồi dưỡng nghiệp vụ sư phạm cho giảng viên và giáo viên dạy nghề; tư vấn đổi mới phương pháp giảng dạy và kiểm tra đánh giá theo hướng tiếp cận năng lực.', 'Tòa nhà A - Phòng A701', '028 3896 3031', NOW()),

-- 4. ĐOÀN THỂ VÀ ĐƠN VỊ PHỤC VỤ
('d0000000-0000-0000-0000-000000000032', 'Đoàn trường & Hội Sinh viên', 'doanthanhnien@uni.edu.vn', 'Tổ chức và chỉ đạo các hoạt động phong trào Đoàn, Hội; giáo dục kỹ năng thực hành xã hội; tổ chức các chiến dịch tình nguyện, văn hóa văn nghệ, hỗ trợ sinh viên trong học tập và đời sống.', 'Nhà Văn hóa Sinh viên', '028 3896 4032', NOW()),
('d0000000-0000-0000-0000-000000000033', 'Trạm Y tế', 'yte@uni.edu.vn', 'Thực hiện chăm sóc sức khỏe ban đầu, sơ cấp cứu cho cán bộ và sinh viên; tổ chức khám sức khỏe định kỳ; tuyên truyền phòng chống dịch bệnh và kiểm tra vệ sinh an toàn thực phẩm trong trường học.', 'Khu Y tế', '028 3896 4033', NOW()),
('d0000000-0000-0000-0000-000000000034', 'Thư viện', 'thuvien@uni.edu.vn', 'Thu thập, xử lý và cung cấp tài nguyên thông tin, sách, báo, tạp chí chuyên ngành; quản lý cơ sở dữ liệu số; tổ chức không gian đọc và tự học hiện đại; hướng dẫn người dùng tin và phát triển văn hóa đọc.', 'Tòa nhà Thư viện Trung tâm', '028 3896 4034', NOW()),
('d0000000-0000-0000-0000-000000000035', 'Ban Quản lý ký túc xá', 'ktx@uni.edu.vn', 'Quản lý toàn diện khu nội trú sinh viên; bố trí chỗ ở, đảm bảo an ninh trật tự, vệ sinh môi trường; tổ chức các hoạt động văn hóa, thể thao và hỗ trợ đời sống tinh thần cho sinh viên nội trú.', 'Văn phòng KTX Khu A', '028 3896 4035', NOW());

-- =================================================================
-- STEP 2: USERS (Admin, Staff, Students)
-- FIX: Dùng ID Hex hợp lệ (a... cho Admin, b... cho Staff, e... cho Student)
-- =================================================================

-- Admin (a000...)
INSERT INTO "Users" ("id", "fullName", "password", "email", "role", "departmentId", "createdAt") VALUES
('a0000000-0000-0000-0000-999999999999', 'Quản Trị Viên Hệ Thống', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'admin@uni.edu.vn', 'ADMIN', NULL, NOW());

-- Staff (b000...)
INSERT INTO "Users" ("id", "fullName", "password", "email", "role", "departmentId", "createdAt") VALUES
('b0000000-0000-0000-0000-000000000001', 'Cán bộ Thanh tra', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.thanhtra@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000001', NOW()),
('b0000000-0000-0000-0000-000000000009', 'Cán bộ Quản trị CSVC', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.qtcsvc@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000009', NOW()),
('b0000000-0000-0000-0000-000000000010', 'Chuyên viên CTSV', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.ctsv@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000010', NOW()),
('b0000000-0000-0000-0000-000000000011', 'Kế toán viên', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.khtc@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000011', NOW()),
('b0000000-0000-0000-0000-000000000012', 'Giáo vụ Đào tạo', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.pdt@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000012', NOW()),
('b0000000-0000-0000-0000-000000000016', 'Giáo vụ Khoa CNTT', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.fit@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000016', NOW()),
('b0000000-0000-0000-0000-000000000027', 'NV Dịch vụ sinh viên', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.dvsv@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000027', NOW()),
('b0000000-0000-0000-0000-000000000028', 'NV Dạy học số', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.elearning@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000028', NOW()),
('b0000000-0000-0000-0000-000000000029', 'Kỹ thuật viên TTMT', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.ttmt@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000029', NOW()),
('b0000000-0000-0000-0000-000000000030', 'Giảng viên GDTC', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.gdtc@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000030', NOW()),
('b0000000-0000-0000-0000-000000000034', 'Thủ thư Thư viện', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.thuvien@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000034', NOW()),
('b0000000-0000-0000-0000-000000000035', 'Quản lý KTX', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'staff.ktx@uni.edu.vn', 'DEPARTMENT_STAFF', 'd0000000-0000-0000-0000-000000000035', NOW());

-- Students (e000... - viết tắt Education, vì 'stud' chứa s,t,u là sai hex)
INSERT INTO "Users" ("id", "fullName", "password", "email", "role", "departmentId", "createdAt") VALUES
('e0000000-0000-0000-0000-000000000001', 'Nguyễn Văn An', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv01@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000002', 'Trần Thị Bích', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv02@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000003', 'Lê Hoàng Cường', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv03@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000004', 'Phạm Minh Dũng', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv04@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000005', 'Hoàng Thu Trang', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv05@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000006', 'Vũ Văn Long', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv06@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000010', 'Ngô Văn Kiên', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv10@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000011', 'Dương Thị Lan', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv11@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000012', 'Lý Văn Nam', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv12@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000013', 'Trịnh Thu Nga', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv13@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000014', 'Mai Văn Phúc', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv14@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000015', 'Đinh Thị Quyên', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv15@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000016', 'Lâm Văn Sơn', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv16@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000017', 'Phan Thanh Tâm', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv17@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000020', 'Hà Văn Tùng', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv20@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000021', 'Trương Thị Uyên', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv21@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000022', 'Nguyễn Đức Vinh', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv22@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000030', 'Đỗ Văn Giang', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv30@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000031', 'Ngô Thị Hà', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv31@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000032', 'Dương Văn Hải', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv32@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000033', 'Lý Thị Hạnh', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv33@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000040', 'Vương Văn Lâm', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv40@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000041', 'Hà Thị Linh', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv41@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000042', 'Trương Văn Lộc', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv42@st.uni.edu.vn', 'STUDENT', NULL, NOW()),
('e0000000-0000-0000-0000-000000000043', 'Nguyễn Thị Lý', '$2a$10$8noMz7WuhDZE4hzZN7VnxOORxeq0a0/Ieu0Zfb72DZZ3QeWllKgkC', 'sv43@st.uni.edu.vn', 'STUDENT', NULL, NOW());

-- =================================================================
-- STEP 3: FEEDBACKS
-- Users refs: e000...
-- =================================================================
INSERT INTO "Feedbacks" ("id", "userId", "departmentId", "categoryId", "subject", "description", "location", "currentStatus", "isPrivate", "createdAt") VALUES
('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000001', 'Máy lạnh phòng A302 chảy nước', 'Máy lạnh phía trên bảng chảy nước tong tỏng xuống bàn giáo viên.', 'Phòng A302', 'RESOLVED', false, '2025-09-05 08:30:00'),
('f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000001', 'Bàn ghế gãy chân tại sảnh C', 'Có 2 cái ghế đá ở sảnh C bị gãy chân.', 'Sảnh C', 'RESOLVED', false, '2025-09-06 09:15:00'),
('f0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000001', 'Đèn hành lang khu B tối om', 'Buổi tối đi học về khu B rất tối.', 'Hành lang B2', 'RESOLVED', false, '2025-09-10 18:00:00'),
('f0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000035', 'c0000000-0000-0000-0000-000000000001', 'Ký túc xá mất nước liên tục', 'Phòng 405 KTX khu A mất nước 2 ngày nay chưa có lại.', 'KTX Khu A', 'RESOLVED', false, '2025-09-12 07:00:00'),
('f0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000001', 'Thang máy tòa nhà Trung tâm bị kẹt', 'Thang máy số 2 hay bị rung lắc.', 'Tòa nhà Trung tâm', 'IN_PROGRESS', false, '2025-09-20 10:00:00'),
('f0000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000010', 'd0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000002', 'Không đăng ký được môn Lập trình Web', 'Hệ thống báo lớp đầy dù sĩ số mới 30/60.', 'Hệ thống Đăng ký', 'RESOLVED', false, '2025-10-01 08:00:00'),
('f0000000-0000-0000-0000-000000000007', 'e0000000-0000-0000-0000-000000000011', 'd0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000002', 'Trùng lịch thi môn Toán cao cấp', 'Em bị trùng lịch thi môn Toán và môn Triết.', NULL, 'IN_PROGRESS', true, '2025-10-05 09:30:00'),
('f0000000-0000-0000-0000-000000000008', 'e0000000-0000-0000-0000-000000000012', 'd0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000002', 'Xin mở thêm lớp Tiếng Anh 3', 'Hiện tại các lớp Anh 3 đã full.', NULL, 'REJECTED', false, '2025-10-10 14:00:00'),
('f0000000-0000-0000-0000-000000000011', 'e0000000-0000-0000-0000-000000000020', 'd0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000005', 'Học phí bị tính sai', 'Em đã đóng tiền nhưng hệ thống vẫn báo nợ.', NULL, 'IN_PROGRESS', true, '2025-10-28 09:00:00'),
('f0000000-0000-0000-0000-000000000014', 'e0000000-0000-0000-0000-000000000030', 'd0000000-0000-0000-0000-000000000029', 'c0000000-0000-0000-0000-000000000001', 'Wifi thư viện không kết nối được', 'Tầng 4 thư viện wifi rất yếu.', 'Thư viện Tầng 4', 'PENDING', false, '2025-11-20 14:00:00'),
('f0000000-0000-0000-0000-000000000016', 'e0000000-0000-0000-0000-000000000032', 'd0000000-0000-0000-0000-000000000028', 'c0000000-0000-0000-0000-000000000002', 'Lỗi nộp bài trên LMS', 'Hệ thống LMS báo lỗi 500 khi upload file.', 'Hệ thống LMS', 'PENDING', false, '2025-11-25 20:00:00'),
('f0000000-0000-0000-0000-000000000017', 'e0000000-0000-0000-0000-000000000040', 'd0000000-0000-0000-0000-000000000027', 'c0000000-0000-0000-0000-000000000006', 'Mất mũ bảo hiểm ở nhà xe', 'Em gửi xe ở bãi xe sinh viên bị mất mũ bảo hiểm.', 'Nhà xe SV', 'REJECTED', false, '2025-11-10 16:00:00');

-- =================================================================
-- STEP 4: FORUM POSTS
-- Fix ID: fp... -> 3000... (Số 3 đại diện cho Post)
-- =================================================================
INSERT INTO "ForumPosts" ("id", "feedbackId", "createdAt") VALUES
('30000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '2025-09-05 08:30:00'),
('30000000-0000-0000-0000-000000000014', 'f0000000-0000-0000-0000-000000000014', '2025-11-20 14:00:00'),
('30000000-0000-0000-0000-000000000016', 'f0000000-0000-0000-0000-000000000016', '2025-11-25 20:00:00');

-- =================================================================
-- STEP 5: STATUS HISTORY
-- Fix ID: fh... -> 1000...
-- =================================================================
INSERT INTO "FeedbackStatusHistory" ("id", "feedbackId", "status", "message", "note", "createdAt") VALUES
('10000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'IN_PROGRESS', 'Đã tiếp nhận phản ánh.', NULL, '2025-09-05 10:00:00'),
('10000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', 'RESOLVED', 'Đã vệ sinh máy lạnh.', 'Hoàn thành', '2025-09-07 14:00:00');

-- =================================================================
-- STEP 6: FORWARDING LOGS
-- Fix ID: fl... -> 2000...
-- Staff User ID: b000...
-- =================================================================
INSERT INTO "ForwardingLogs" ("id", "feedbackId", "fromDepartmentId", "toDepartmentId", "userId", "message", "note", "createdAt") VALUES
('20000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000011', 'd0000000-0000-0000-0000-000000000010', 'd0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000010', 'Chuyển phòng KHTC xử lý.', 'Nộp nhầm', '2025-10-28 09:30:00');

-- =================================================================
-- STEP 7: COMMENTS
-- Fix ID: cmt... -> 4000...
-- Target ID: 3000... (ForumPost)
-- =================================================================
INSERT INTO "Comments" ("id", "targetId", "targetType", "userId", "parentId", "content", "createdAt") VALUES
('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'FORUM_POST', 'e0000000-0000-0000-0000-000000000005', NULL, 'Xác nhận nhé, ướt hết vở.', '2025-09-05 09:00:00'),
('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000014', 'FORUM_POST', 'e0000000-0000-0000-0000-000000000015', NULL, 'Wifi chán thực sự.', '2025-11-20 14:15:00'),
('40000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000014', 'FORUM_POST', 'e0000000-0000-0000-0000-000000000017', NULL, 'Dùng 4G đi, kêu ca làm gì.', '2025-11-20 15:00:00');

-- =================================================================
-- STEP 8: VOTES
-- =================================================================
INSERT INTO "Votes" ("userId", "postId", "createdAt") VALUES
('e0000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', NOW()),
('e0000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', NOW());

-- =================================================================
-- STEP 9: REPORTS
-- Fix ID: rpt... -> 5000...
-- Comment ID: 4000...
-- =================================================================
INSERT INTO "CommentReports" ("id", "commentId", "userId", "reason", "status", "adminResponse", "createdAt") VALUES
('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000015', 'Ngôn từ toxic.', 'PENDING', NULL, '2025-11-20 16:00:00');

-- =================================================================
-- STEP 10: ANNOUNCEMENTS
-- Fix ID: ann... -> 6000...
-- Staff User ID: b000...
-- =================================================================
INSERT INTO "Announcements" ("id", "title", "content", "userId", "createdAt") VALUES
('60000000-0000-0000-0000-000000000001', 'Thông báo học bổng', 'Nội dung thông báo...', 'b0000000-0000-0000-0000-000000000010', '2025-11-01 08:00:00'),
('60000000-0000-0000-0000-000000000002', 'Lịch đăng ký môn học', 'Nội dung đăng ký...', 'b0000000-0000-0000-0000-000000000012', '2025-11-10 09:00:00'),
('60000000-0000-0000-0000-000000000003', 'Bảo trì hệ thống', 'Nội dung bảo trì...', 'b0000000-0000-0000-0000-000000000029', '2025-11-23 16:00:00');

-- =================================================================
-- STEP 11: CONVERSATIONS & MESSAGES
-- Fix Conv ID: conv... -> 7000...
-- Fix Msg ID: msg... -> 8000...
-- =================================================================
INSERT INTO "ClarificationConversations" ("id", "subject", "feedbackId", "isClosed", "userId", "createdAt") VALUES
('70000000-0000-0000-0000-000000000001', 'Yêu cầu minh chứng', 'f0000000-0000-0000-0000-000000000007', true, 'e0000000-0000-0000-0000-000000000011', '2025-10-05 10:00:00');

INSERT INTO "Messages" ("id", "conversationId", "userId", "content", "createdAt") VALUES
('80000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000012', 'Gửi ảnh minh chứng đi em.', '2025-10-05 10:00:00'),
('80000000-0000-0000-0000-000000000002', '70000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000011', 'Dạ đây ạ.', '2025-10-05 10:15:00');

-- =================================================================
-- STEP 12: FILE ATTACHMENTS
-- Fix ID: fa... -> 9000...
-- =================================================================
INSERT INTO "FileAttachments" ("id", "targetId", "targetType", "fileName", "fileUrl", "fileType", "fileSize", "createdAt") VALUES
('90000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'FEEDBACK', 'may-lanh.jpg', 'https://storage.u.edu/1.jpg', 'image/jpeg', 204800, '2025-09-05 08:30:00'),
('90000000-0000-0000-0000-000000000020', '60000000-0000-0000-0000-000000000001', 'ANNOUNCEMENT', 'ke-hoach.pdf', 'https://storage.u.edu/2.pdf', 'application/pdf', 2000, '2025-11-01 08:00:00'),
('90000000-0000-0000-0000-000000000030', '80000000-0000-0000-0000-000000000002', 'MESSAGE', 'anh.jpg', 'https://storage.u.edu/3.jpg', 'image/jpeg', 102400, '2025-10-05 10:15:00');

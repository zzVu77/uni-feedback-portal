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

INSERT INTO "Departments" ("id", "name", "email", "createdAt") VALUES
('d0000000-0000-0000-0000-000000000001', 'Phòng Thanh tra giáo dục', 'thanhtra@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000002', 'Phòng Quan hệ doanh nghiệp', 'qhdn@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000003', 'Phòng Khoa học & Công nghệ', 'khcn@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000004', 'Phòng Quan hệ quốc tế', 'qhqt@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000005', 'Phòng Thiết bị – Vật tư', 'tbvt@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000006', 'Phòng Quản trị chiến lược', 'chienluoc@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000007', 'Phòng Đảm bảo chất lượng', 'qa@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000008', 'Phòng Tổ chức Hành chính', 'tchc@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000009', 'Phòng Quản trị cơ sở vật chất', 'qtcsvc@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000010', 'Phòng Tuyển sinh và CTSV', 'ctsv@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000011', 'Phòng Kế hoạch – Tài chính', 'khtc@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000012', 'Phòng Đào tạo', 'pdt@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000013', 'Phòng Truyền thông', 'pr@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000014', 'Khoa Xây dựng', 'khoaxaydung@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000015', 'Khoa CN Hóa học & Thực phẩm', 'khoahoa@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000016', 'Khoa Công nghệ Thông tin', 'fit@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000017', 'Khoa Cơ khí động lực', 'ckdl@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000018', 'Khoa CN May & Thời trang', 'maythoitrang@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000019', 'Khoa Điện – Điện tử', 'feee@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000020', 'Khoa Cơ khí Chế tạo máy', 'ckm@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000021', 'Khoa Lý luận chính trị', 'llct@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000022', 'Khoa Khoa học cơ bản', 'khcb@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000023', 'Khoa In & Truyền thông', 'inbaochi@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000024', 'Khoa Ngoại ngữ', 'kngoangu@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000025', 'Khoa Kinh tế', 'kinhte@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000026', 'Khoa Đào tạo chất lượng cao', 'clc@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000027', 'Trung tâm Dịch vụ sinh viên', 'dichvusv@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000028', 'Trung tâm Dạy học số', 'elearning@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000029', 'Trung tâm Thông tin – Máy tính', 'ttmt@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000030', 'TT GD Thể chất và Quốc phòng', 'gdtcqp@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000031', 'Viện Sư phạm kỹ thuật', 'spkt@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000032', 'Đoàn trường & Hội Sinh viên', 'doanthanhnien@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000033', 'Trạm Y tế', 'yte@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000034', 'Thư viện', 'thuvien@uni.edu.vn', NOW()),
('d0000000-0000-0000-0000-000000000035', 'Ban Quản lý ký túc xá', 'ktx@uni.edu.vn', NOW());

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



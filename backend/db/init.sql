-- Insert departments
INSERT INTO departments (department_id, department_name) VALUES
(1, 'IT Department'),
(2, 'Human Resources'),
(3, 'Academic Affairs'),
(4, 'Student Services');

-- Insert categories
INSERT INTO categories (category_id, category_name) VALUES
(1, 'Infrastructure'),
(2, 'Academic'),
(3, 'Administrative'),
(4, 'Events');

-- Insert users (passwords are placeholders, should be hashed in production)
INSERT INTO users (user_id, full_name, password, email, role, department_id, created_at) VALUES
(1, 'Admin User', 'hashed_password_1', 'admin@university.edu', 'Admin', 1, '2025-09-01 10:00:00'),
(2, 'John Doe', 'hashed_password_2', 'john.doe@university.edu', 'Student', 3, '2025-09-01 10:15:00'),
(3, 'Jane Smith', 'hashed_password_3', 'jane.smith@university.edu', 'DepartmentStaff', 1, '2025-09-01 10:30:00'),
(4, 'Alice Brown', 'hashed_password_4', 'alice.brown@university.edu', 'Student', 3, '2025-09-01 10:45:00'),
(5, 'Bob Wilson', 'hashed_password_5', 'bob.wilson@university.edu', 'DepartmentStaff', 2, '2025-09-01 11:00:00'),
(6, 'Clara Davis', 'hashed_password_6', 'clara.davis@university.edu', 'Student', 4, '2025-09-01 11:15:00');

-- Insert feedbacks
INSERT INTO feedbacks (feedback_id, subject, description, current_status, is_private, user_id, department_id, category_id, created_at) VALUES
(1, 'Broken classroom projector', 'The projector in Room 101 is not working.', 'PENDING', false, 2, 1, 1, '2025-09-02 09:00:00'),
(2, 'Course registration issue', 'Unable to register for CS101 due to system error.', 'IN_PROGRESS', true, 4, 3, 2, '2025-09-02 10:00:00'),
(3, 'Cafeteria food quality', 'Food quality in cafeteria needs improvement.', 'RESOLVED', false, 6, 4, 3, '2025-09-03 08:30:00'),
(4, 'Wi-Fi connectivity', 'Wi-Fi is unstable in the library.', 'PENDING', false, 2, 1, 1, '2025-09-04 14:00:00');

-- Insert feedback_status_history
INSERT INTO feedback_status_history (feedback_status_id, feedback_id, status, message, created_at) VALUES
(1, 1, 'PENDING', 'Feedback received, under review.', '2025-09-02 09:05:00'),
(2, 2, 'PENDING', 'Feedback received.', '2025-09-02 10:05:00'),
(3, 2, 'IN_PROGRESS', 'Investigating the issue.', '2025-09-02 12:00:00'),
(4, 3, 'PENDING', 'Feedback received.', '2025-09-03 08:35:00'),
(5, 3, 'RESOLVED', 'Issue addressed with cafeteria vendor.', '2025-09-03 15:00:00'),
(6, 4, 'PENDING', 'Feedback received, under review.', '2025-09-04 14:05:00');

-- Insert forwarding_logs
INSERT INTO forwarding_logs (forwarding_log_id, feedback_id, from_department_id, to_department_id, user_id, message, created_at) VALUES
(1, 1, 1, 1, 3, 'Forwarded to IT support team for inspection.', '2025-09-02 09:30:00'),
(2, 2, 3, 3, 1, 'Forwarded to registrar for system check.', '2025-09-02 10:30:00'),
(3, 4, 1, 1, 3, 'Forwarded to network team.', '2025-09-04 14:30:00');

-- Insert forum_posts
INSERT INTO forum_posts (post_id, feedback_id, created_at) VALUES
(1, 1, '2025-09-02 09:10:00'),
(2, 3, '2025-09-03 08:40:00'),
(3, 4, '2025-09-04 14:10:00');

-- Insert votes
INSERT INTO votes (user_id, post_id, created_at) VALUES
(2, 1, '2025-09-02 09:15:00'),
(4, 1, '2025-09-02 09:20:00'),
(6, 2, '2025-09-03 09:00:00'),
(2, 3, '2025-09-04 14:15:00'),
(4, 3, '2025-09-04 14:20:00');

-- Insert comments
INSERT INTO comments (comment_id, post_id, user_id, content, created_at) VALUES
(1, 1, 4, 'I faced the same issue in Room 101 yesterday!', '2025-09-02 09:25:00'),
(2, 1, 6, 'Please fix this soon, it affects our classes.', '2025-09-02 09:30:00'),
(3, 2, 2, 'The food quality has been poor for weeks.', '2025-09-03 09:10:00'),
(4, 3, 4, 'Wi-Fi issues are worst during peak hours.', '2025-09-04 14:25:00');

-- Insert comment_reports
INSERT INTO comment_reports (comment_report_id, comment_id, user_id, reason, status, admin_response, created_at) VALUES
(1, 3, 4, 'Inappropriate tone', 'PENDING', NULL, '2025-09-03 09:20:00'),
(2, 4, 6, 'Off-topic comment', 'RESOLVED', 'Comment reviewed, no action needed.', '2025-09-04 14:30:00');

-- Insert clarification_conversations
INSERT INTO clarification_conversations (conversation_id, feedback_id, is_closed, user_id, created_at) VALUES
(1, 2, false, 4, '2025-09-02 10:10:00'),
(2, 3, true, 6, '2025-09-03 08:45:00');

-- Insert messages
INSERT INTO messages (message_id, conversation_id, user_id, content, created_at) VALUES
(1, 1, 4, 'Can you specify which course caused the error?', '2025-09-02 10:15:00'),
(2, 1, 1, 'It was CS101, error code 503.', '2025-09-02 10:20:00'),
(3, 2, 6, 'Can you confirm if the vendor was changed?', '2025-09-03 08:50:00'),
(4, 2, 5, 'Yes, new vendor contract signed.', '2025-09-03 09:00:00');

-- Insert file_attachment_for_feedback
INSERT INTO file_attachment_for_feedback (id, feedback_id, file_name, file_url) VALUES
(1, 1, 'projector_issue.jpg', 'https://example.com/files/projector_issue.jpg'),
(2, 4, 'wifi_log.txt', 'https://example.com/files/wifi_log.txt');

-- Insert announcements
INSERT INTO announcements (id, title, content, created_at, user_id) VALUES
(1, 'System Maintenance', 'Scheduled maintenance on 2025-09-10.', '2025-09-05 12:00:00', 1),
(2, 'New Cafeteria Menu', 'Updated menu starting next week.', '2025-09-06 10:00:00', 5);

-- Insert file_attachment_for_announcement
INSERT INTO file_attachment_for_announcement (id, announcement_id, file_name, file_url) VALUES
(1, 2, 'new_menu.pdf', 'https://example.com/files/new_menu.pdf');

-- Insert notifications
INSERT INTO notifications (notification_id, user_id, content, notification_type, is_read, created_at) VALUES
(1, 2, 'Your feedback on projector issue was received.', 'FEEDBACK_NOTIFICATION', true, '2025-09-02 09:05:00'),
(2, 4, 'Your comment on Wi-Fi post was reported.', 'COMMENT_NOTIFICATION', false, '2025-09-04 14:30:00'),
(3, 6, 'New announcement: New Cafeteria Menu.', 'MESSAGE_NOTIFICATION', true, '2025-09-06 10:05:00'),
(4, 2, 'Your feedback on Wi-Fi was upvoted.', 'VOTE_NOTIFICATION', false, '2025-09-04 14:20:00');
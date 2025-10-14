-- Inserting departments
INSERT INTO
    "Departments" (
        "departmentId",
        "departmentName"
    )
VALUES (1, 'IT Department'),
    (2, 'Human Resources'),
    (3, 'Academic Affairs'),
    (4, 'Student Services');

-- Inserting categories
INSERT INTO
    "Categories" ("categoryId", "categoryName")
VALUES (1, 'Infrastructure'),
    (2, 'Academic'),
    (3, 'Administrative'),
    (4, 'Events');

-- Inserting users (passwords are placeholders, should be hashed in production)
INSERT INTO
    "Users" (
        "userId",
        "fullName",
        "password",
        "email",
        "role",
        "departmentId",
        "createdAt"
    )
VALUES (
        1,
        'Admin User',
        'hashed_password_1',
        'admin@university.edu',
        'ADMIN',
        1,
        '2025-09-01 10:00:00'
    ),
    (
        2,
        'John Doe',
        'hashed_password_2',
        'john.doe@university.edu',
        'STUDENT',
        3,
        '2025-09-01 10:15:00'
    ),
    (
        3,
        'Jane Smith',
        'hashed_password_3',
        'jane.smith@university.edu',
        'DEPARTMENT_STAFF',
        1,
        '2025-09-01 10:30:00'
    ),
    (
        4,
        'Alice Brown',
        'hashed_password_4',
        'alice.brown@university.edu',
        'STUDENT',
        3,
        '2025-09-01 10:45:00'
    ),
    (
        5,
        'Bob Wilson',
        'hashed_password_5',
        'bob.wilson@university.edu',
        'DEPARTMENT_STAFF',
        2,
        '2025-09-01 11:00:00'
    ),
    (
        6,
        'Clara Davis',
        'hashed_password_6',
        'clara.davis@university.edu',
        'STUDENT',
        4,
        '2025-09-01 11:15:00'
    );

-- Inserting feedbacks
INSERT INTO
    "Feedbacks" (
        "feedbackId",
        "subject",
        "description",
        "currentStatus",
        "isPrivate",
        "userId",
        "departmentId",
        "categoryId",
        "createdAt"
    )
VALUES (
        1,
        'Broken classroom projector',
        'The projector in Room 101 is not working.',
        'PENDING',
        false,
        2,
        1,
        1,
        '2025-09-02 09:00:00'
    ),
    (
        2,
        'Course registration issue',
        'Unable to register for CS101 due to system error.',
        'IN_PROGRESS',
        true,
        4,
        3,
        2,
        '2025-09-02 10:00:00'
    ),
    (
        3,
        'Cafeteria food quality',
        'Food quality in cafeteria needs improvement.',
        'RESOLVED',
        false,
        6,
        4,
        3,
        '2025-09-03 08:30:00'
    ),
    (
        4,
        'Wi-Fi connectivity',
        'Wi-Fi is unstable in the library.',
        'PENDING',
        false,
        2,
        1,
        1,
        '2025-09-04 14:00:00'
    );

-- Inserting feedback status history
INSERT INTO
    "FeedbackStatusHistory" (
        "feedbackStatusId",
        "feedbackId",
        "status",
        "message",
        "createdAt"
    )
VALUES (
        1,
        1,
        'PENDING',
        'Feedback received, under review.',
        '2025-09-02 09:05:00'
    ),
    (
        2,
        2,
        'PENDING',
        'Feedback received.',
        '2025-09-02 10:05:00'
    ),
    (
        3,
        2,
        'IN_PROGRESS',
        'Investigating the issue.',
        '2025-09-02 12:00:00'
    ),
    (
        4,
        3,
        'PENDING',
        'Feedback received.',
        '2025-09-03 08:35:00'
    ),
    (
        5,
        3,
        'RESOLVED',
        'Issue addressed with cafeteria vendor.',
        '2025-09-03 15:00:00'
    ),
    (
        6,
        4,
        'PENDING',
        'Feedback received, under review.',
        '2025-09-04 14:05:00'
    );

-- Inserting forwarding logs
INSERT INTO
    "ForwardingLogs" (
        "forwardingLogId",
        "feedbackId",
        "fromDepartmentId",
        "toDepartmentId",
        "userId",
        "message",
        "createdAt"
    )
VALUES (
        1,
        1,
        1,
        1,
        3,
        'Forwarded to IT support team for inspection.',
        '2025-09-02 09:30:00'
    ),
    (
        2,
        2,
        3,
        3,
        1,
        'Forwarded to registrar for system check.',
        '2025-09-02 10:30:00'
    ),
    (
        3,
        4,
        1,
        1,
        3,
        'Forwarded to network team.',
        '2025-09-04 14:30:00'
    );

-- Inserting forum posts
INSERT INTO
    "ForumPosts" (
        "postId",
        "feedbackId",
        "createdAt"
    )
VALUES (1, 1, '2025-09-02 09:10:00'),
    (2, 3, '2025-09-03 08:40:00'),
    (3, 4, '2025-09-04 14:10:00');

-- Inserting votes
INSERT INTO
    "Votes" (
        "userId",
        "postId",
        "createdAt"
    )
VALUES (2, 1, '2025-09-02 09:15:00'),
    (4, 1, '2025-09-02 09:20:00'),
    (6, 2, '2025-09-03 09:00:00'),
    (2, 3, '2025-09-04 14:15:00'),
    (4, 3, '2025-09-04 14:20:00');

-- Inserting comments
INSERT INTO
    "Comments" (
        "commentId",
        "postId",
        "userId",
        "content",
        "createdAt"
    )
VALUES (
        1,
        1,
        4,
        'I faced the same issue in Room 101 yesterday!',
        '2025-09-02 09:25:00'
    ),
    (
        2,
        1,
        6,
        'Please fix this soon, it affects our classes.',
        '2025-09-02 09:30:00'
    ),
    (
        3,
        2,
        2,
        'The food quality has been poor for weeks.',
        '2025-09-03 09:10:00'
    ),
    (
        4,
        3,
        4,
        'Wi-Fi issues are worst during peak hours.',
        '2025-09-04 14:25:00'
    );

-- Inserting comment reports
INSERT INTO
    "CommentReports" (
        "commentReportId",
        "commentId",
        "userId",
        "reason",
        "status",
        "adminResponse",
        "createdAt"
    )
VALUES (
        1,
        3,
        4,
        'Inappropriate tone',
        'PENDING',
        NULL,
        '2025-09-03 09:20:00'
    ),
    (
        2,
        4,
        6,
        'Off-topic comment',
        'RESOLVED',
        'Comment reviewed, no action needed.',
        '2025-09-04 14:30:00'
    );

-- Inserting clarification conversations
INSERT INTO
    "ClarificationConversations" (
        "conversationId",
        "feedbackId",
        "isClosed",
        "userId",
        "createdAt"
    )
VALUES (
        1,
        2,
        false,
        4,
        '2025-09-02 10:10:00'
    ),
    (
        2,
        3,
        true,
        6,
        '2025-09-03 08:45:00'
    );

-- Inserting messages
INSERT INTO
    "Messages" (
        "messageId",
        "conversationId",
        "userId",
        "content",
        "createdAt"
    )
VALUES (
        1,
        1,
        4,
        'Can you specify which course caused the error?',
        '2025-09-02 10:15:00'
    ),
    (
        2,
        1,
        1,
        'It was CS101, error code 503.',
        '2025-09-02 10:20:00'
    ),
    (
        3,
        2,
        6,
        'Can you confirm if the vendor was changed?',
        '2025-09-03 08:50:00'
    ),
    (
        4,
        2,
        5,
        'Yes, new vendor contract signed.',
        '2025-09-03 09:00:00'
    );

-- Inserting file attachments for feedback
INSERT INTO
    "FileAttachmentForFeedback" (
        "id",
        "feedbackId",
        "fileName",
        "fileUrl"
    )
VALUES (
        1,
        1,
        'projector_issue.jpg',
        'https://example.com/files/projector_issue.jpg'
    ),
    (
        2,
        4,
        'wifi_log.txt',
        'https://example.com/files/wifi_log.txt'
    );

-- Inserting announcements
INSERT INTO
    "Announcements" (
        "id",
        "title",
        "content",
        "createdAt",
        "userId"
    )
VALUES (
        1,
        'System Maintenance',
        'Scheduled maintenance on 2025-09-10.',
        '2025-09-05 12:00:00',
        1
    ),
    (
        2,
        'New Cafeteria Menu',
        'Updated menu starting next week.',
        '2025-09-06 10:00:00',
        5
    );

-- Inserting file attachments for announcements
INSERT INTO
    "FileAttachmentForAnnouncement" (
        "id",
        "announcementId",
        "fileName",
        "fileUrl"
    )
VALUES (
        1,
        2,
        'new_menu.pdf',
        'https://example.com/files/new_menu.pdf'
    );

-- Inserting notifications
INSERT INTO
    "Notifications" (
        "notificationId",
        "userId",
        "content",
        "notificationType",
        "isRead",
        "createdAt"
    )
VALUES (
        1,
        2,
        'Your feedback on projector issue was received.',
        'FEEDBACK_NOTIFICATION',
        true,
        '2025-09-02 09:05:00'
    ),
    (
        2,
        4,
        'Your comment on Wi-Fi post was reported.',
        'COMMENT_NOTIFICATION',
        false,
        '2025-09-04 14:30:00'
    ),
    (
        3,
        6,
        'New announcement: New Cafeteria Menu.',
        'MESSAGE_NOTIFICATION',
        true,
        '2025-09-06 10:05:00'
    ),
    (
        4,
        2,
        'Your feedback on Wi-Fi was upvoted.',
        'VOTE_NOTIFICATION',
        false,
        '2025-09-04 14:20:00'
    );

-- Inserting additional users
INSERT INTO
    "Users" (
        "userId",
        "fullName",
        "password",
        "email",
        "role",
        "departmentId",
        "createdAt"
    )
VALUES (
        7,
        'David Johnson',
        'hashed_password_7',
        'david.johnson@university.edu',
        'STUDENT',
        3,
        '2025-09-05 09:00:00'
    ),
    (
        8,
        'Emma Thompson',
        'hashed_password_8',
        'emma.thompson@university.edu',
        'DEPARTMENT_STAFF',
        2,
        '2025-09-05 09:15:00'
    ),
    (
        9,
        'Frank Lee',
        'hashed_password_9',
        'frank.lee@university.edu',
        'STUDENT',
        4,
        '2025-09-05 09:30:00'
    ),
    (
        10,
        'Grace Kim',
        'hashed_password_10',
        'grace.kim@university.edu',
        'DEPARTMENT_STAFF',
        1,
        '2025-09-05 09:45:00'
    );

-- Inserting additional feedbacks
INSERT INTO
    "Feedbacks" (
        "feedbackId",
        "subject",
        "description",
        "currentStatus",
        "isPrivate",
        "userId",
        "departmentId",
        "categoryId",
        "createdAt"
    )
VALUES (
        5,
        'Library lighting issue',
        'Some lights in the library are flickering.',
        'PENDING',
        false,
        7,
        1,
        1,
        '2025-09-05 10:00:00'
    ),
    (
        6,
        'Scholarship application problem',
        'System rejects valid applications.',
        'IN_PROGRESS',
        true,
        9,
        3,
        2,
        '2025-09-05 10:30:00'
    ),
    (
        7,
        'Parking space shortage',
        'Insufficient parking spaces during morning.',
        'PENDING',
        false,
        2,
        4,
        3,
        '2025-09-06 08:00:00'
    ),
    (
        8,
        'Event announcement missing',
        'No announcement for upcoming seminar.',
        'RESOLVED',
        false,
        4,
        3,
        4,
        '2025-09-06 09:00:00'
    ),
    (
        9,
        'Computer lab software update',
        'Need latest software in Lab 202.',
        'IN_PROGRESS',
        false,
        7,
        1,
        1,
        '2025-09-06 11:00:00'
    ),
    (
        10,
        'Cafeteria menu feedback',
        'Request for more vegetarian options.',
        'PENDING',
        true,
        6,
        4,
        3,
        '2025-09-06 12:00:00'
    );

-- Inserting additional feedback status history
INSERT INTO
    "FeedbackStatusHistory" (
        "feedbackStatusId",
        "feedbackId",
        "status",
        "message",
        "createdAt"
    )
VALUES (
        7,
        5,
        'PENDING',
        'Feedback received.',
        '2025-09-05 10:05:00'
    ),
    (
        8,
        6,
        'PENDING',
        'Feedback logged.',
        '2025-09-05 10:35:00'
    ),
    (
        9,
        6,
        'IN_PROGRESS',
        'Investigating application issue.',
        '2025-09-05 11:00:00'
    ),
    (
        10,
        8,
        'PENDING',
        'Feedback received.',
        '2025-09-06 09:05:00'
    ),
    (
        11,
        8,
        'RESOLVED',
        'Event announcement posted.',
        '2025-09-06 10:00:00'
    ),
    (
        12,
        9,
        'IN_PROGRESS',
        'Updating lab software.',
        '2025-09-06 11:15:00'
    );

-- Inserting additional forwarding logs
INSERT INTO
    "ForwardingLogs" (
        "forwardingLogId",
        "feedbackId",
        "fromDepartmentId",
        "toDepartmentId",
        "userId",
        "message",
        "createdAt"
    )
VALUES (
        4,
        5,
        1,
        1,
        10,
        'Forwarded to library maintenance team.',
        '2025-09-05 10:10:00'
    ),
    (
        5,
        6,
        3,
        3,
        1,
        'Forwarded to scholarship office.',
        '2025-09-05 10:40:00'
    ),
    (
        6,
        9,
        1,
        1,
        3,
        'Forwarded to computer lab admin.',
        '2025-09-06 11:10:00'
    );

-- Inserting additional forum posts
INSERT INTO
    "ForumPosts" (
        "postId",
        "feedbackId",
        "createdAt"
    )
VALUES (4, 5, '2025-09-05 10:10:00'),
    (5, 7, '2025-09-06 08:10:00'),
    (6, 9, '2025-09-06 11:05:00');

-- Inserting additional votes
INSERT INTO
    "Votes" (
        "userId",
        "postId",
        "createdAt"
    )
VALUES (2, 4, '2025-09-05 10:15:00'),
    (4, 5, '2025-09-06 08:20:00'),
    (7, 6, '2025-09-06 11:10:00');

-- Inserting additional comments
INSERT INTO
    "Comments" (
        "commentId",
        "postId",
        "userId",
        "content",
        "createdAt"
    )
VALUES (
        5,
        4,
        9,
        'Flickering lights affect reading.',
        '2025-09-05 10:20:00'
    ),
    (
        6,
        5,
        2,
        'Parking is always full in mornings.',
        '2025-09-06 08:15:00'
    ),
    (
        7,
        6,
        7,
        'Software in Lab 202 is outdated.',
        '2025-09-06 11:15:00'
    );

-- Inserting additional comment reports
INSERT INTO
    "CommentReports" (
        "commentReportId",
        "commentId",
        "userId",
        "reason",
        "status",
        "adminResponse",
        "createdAt"
    )
VALUES (
        3,
        6,
        8,
        'Duplicate comment',
        'PENDING',
        NULL,
        '2025-09-06 08:25:00'
    );

-- Inserting additional clarification conversations
INSERT INTO
    "ClarificationConversations" (
        "conversationId",
        "feedbackId",
        "isClosed",
        "userId",
        "createdAt"
    )
VALUES (
        3,
        6,
        false,
        9,
        '2025-09-05 10:40:00'
    ),
    (
        4,
        10,
        false,
        6,
        '2025-09-06 12:05:00'
    );

-- Inserting additional messages
INSERT INTO
    "Messages" (
        "messageId",
        "conversationId",
        "userId",
        "content",
        "createdAt"
    )
VALUES (
        5,
        3,
        9,
        'Scholarship application shows error for valid entries.',
        '2025-09-05 10:45:00'
    ),
    (
        6,
        3,
        1,
        'We are checking the system logs.',
        '2025-09-05 10:50:00'
    ),
    (
        7,
        4,
        6,
        'Please add more vegetarian meals.',
        '2025-09-06 12:10:00'
    ),
    (
        8,
        4,
        5,
        'Cafeteria team notified.',
        '2025-09-06 12:20:00'
    );

-- Inserting additional file attachments for feedback
INSERT INTO
    "FileAttachmentForFeedback" (
        "id",
        "feedbackId",
        "fileName",
        "fileUrl"
    )
VALUES (
        3,
        6,
        'scholarship_error.png',
        'https://example.com/files/scholarship_error.png'
    );

-- Inserting additional announcements
INSERT INTO
    "Announcements" (
        "id",
        "title",
        "content",
        "createdAt",
        "userId"
    )
VALUES (
        3,
        'Parking Update',
        'Additional parking spots available.',
        '2025-09-06 08:30:00',
        5
    ),
    (
        4,
        'Library Lighting Fixed',
        'All library lights repaired.',
        '2025-09-05 11:00:00',
        10
    );

-- Inserting additional file attachments for announcements
INSERT INTO
    "FileAttachmentForAnnouncement" (
        "id",
        "announcementId",
        "fileName",
        "fileUrl"
    )
VALUES (
        2,
        4,
        'lighting_report.pdf',
        'https://example.com/files/lighting_report.pdf'
    );

-- Inserting additional notifications
INSERT INTO
    "Notifications" (
        "notificationId",
        "userId",
        "content",
        "notificationType",
        "isRead",
        "createdAt"
    )
VALUES (
        5,
        7,
        'Your feedback on library lighting was received.',
        'FEEDBACK_NOTIFICATION',
        true,
        '2025-09-05 10:06:00'
    ),
    (
        6,
        9,
        'Scholarship system issue under investigation.',
        'FEEDBACK_NOTIFICATION',
        false,
        '2025-09-05 10:45:00'
    ),
    (
        7,
        2,
        'Your comment on parking post was reported.',
        'COMMENT_NOTIFICATION',
        false,
        '2025-09-06 08:25:00'
    ),
    (
        8,
        6,
        'Cafeteria team responded to your request.',
        'MESSAGE_NOTIFICATION',
        true,
        '2025-09-06 12:20:00'
    );
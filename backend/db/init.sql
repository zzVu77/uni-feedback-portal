-- Inserting departments
INSERT INTO
    "Departments" ("id", "name")
VALUES (
        '550e8400-e29b-41d4-a716-446655440000',
        'IT Department'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440001',
        'Human Resources'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440002',
        'Academic Affairs'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440003',
        'Student Services'
    );

-- Inserting categories
INSERT INTO
    "Categories" ("id", "name")
VALUES (
        '550e8400-e29b-41d4-a716-446655440004',
        'Infrastructure'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440005',
        'Academic'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440006',
        'Administrative'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440007',
        'Events'
    );

-- Inserting users (passwords are placeholders, should be hashed in production)
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
        '550e8400-e29b-41d4-a716-446655440008',
        'Admin User',
        'hashed_password_1',
        'admin@university.edu',
        'ADMIN',
        '550e8400-e29b-41d4-a716-446655440000',
        '2025-09-01 10:00:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440009',
        'John Doe',
        'hashed_password_2',
        'john.doe@university.edu',
        'STUDENT',
        '550e8400-e29b-41d4-a716-446655440002',
        '2025-09-01 10:15:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544000a',
        'Jane Smith',
        'hashed_password_3',
        'jane.smith@university.edu',
        'DEPARTMENT_STAFF',
        '550e8400-e29b-41d4-a716-446655440000',
        '2025-09-01 10:30:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544000b',
        'Alice Brown',
        'hashed_password_4',
        'alice.brown@university.edu',
        'STUDENT',
        '550e8400-e29b-41d4-a716-446655440002',
        '2025-09-01 10:45:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544000c',
        'Bob Wilson',
        'hashed_password_5',
        'bob.wilson@university.edu',
        'DEPARTMENT_STAFF',
        '550e8400-e29b-41d4-a716-446655440001',
        '2025-09-01 11:00:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544000d',
        'Clara Davis',
        'hashed_password_6',
        'clara.davis@university.edu',
        'STUDENT',
        '550e8400-e29b-41d4-a716-446655440003',
        '2025-09-01 11:15:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544000e',
        'David Johnson',
        'hashed_password_7',
        'david.johnson@university.edu',
        'STUDENT',
        '550e8400-e29b-41d4-a716-446655440002',
        '2025-09-05 09:00:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544000f',
        'Emma Thompson',
        'hashed_password_8',
        'emma.thompson@university.edu',
        'DEPARTMENT_STAFF',
        '550e8400-e29b-41d4-a716-446655440001',
        '2025-09-05 09:15:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440010',
        'Frank Lee',
        'hashed_password_9',
        'frank.lee@university.edu',
        'STUDENT',
        '550e8400-e29b-41d4-a716-446655440003',
        '2025-09-05 09:30:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440011',
        'Grace Kim',
        'hashed_password_10',
        'grace.kim@university.edu',
        'DEPARTMENT_STAFF',
        '550e8400-e29b-41d4-a716-446655440000',
        '2025-09-05 09:45:00'
    );

-- Inserting feedbacks
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
        '550e8400-e29b-41d4-a716-446655440012',
        'Broken classroom projector',
        'The projector in Room 101 is not working.',
        'Room 101',
        'PENDING',
        false,
        '550e8400-e29b-41d4-a716-446655440009',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440004',
        '2025-09-02 09:00:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440013',
        'Course registration issue',
        'Unable to register for CS101 due to system error.',
        NULL,
        'IN_PROGRESS',
        true,
        '550e8400-e29b-41d4-a716-44665544000b',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440005',
        '2025-09-02 10:00:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440014',
        'Cafeteria food quality',
        'Food quality in cafeteria needs improvement.',
        'Cafeteria',
        'RESOLVED',
        false,
        '550e8400-e29b-41d4-a716-44665544000d',
        '550e8400-e29b-41d4-a716-446655440003',
        '550e8400-e29b-41d4-a716-446655440006',
        '2025-09-03 08:30:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440015',
        'Wi-Fi connectivity',
        'Wi-Fi is unstable in the library.',
        'Library',
        'PENDING',
        false,
        '550e8400-e29b-41d4-a716-446655440009',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440004',
        '2025-09-04 14:00:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440016',
        'Library lighting issue',
        'Some lights in the library are flickering.',
        'Library',
        'PENDING',
        false,
        '550e8400-e29b-41d4-a716-44665544000e',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440004',
        '2025-09-05 10:00:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440017',
        'Scholarship application problem',
        'System rejects valid applications.',
        NULL,
        'IN_PROGRESS',
        true,
        '550e8400-e29b-41d4-a716-446655440010',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440005',
        '2025-09-05 10:30:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440018',
        'Parking space shortage',
        'Insufficient parking spaces during morning.',
        'Parking Lot A',
        'PENDING',
        false,
        '550e8400-e29b-41d4-a716-446655440009',
        '550e8400-e29b-41d4-a716-446655440003',
        '550e8400-e29b-41d4-a716-446655440006',
        '2025-09-06 08:00:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440019',
        'Event announcement missing',
        'No announcement for upcoming seminar.',
        NULL,
        'RESOLVED',
        false,
        '550e8400-e29b-41d4-a716-44665544000b',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440007',
        '2025-09-06 09:00:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544001a',
        'Computer lab software update',
        'Need latest software in Lab 202.',
        'Lab 202',
        'IN_PROGRESS',
        false,
        '550e8400-e29b-41d4-a716-44665544000e',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440004',
        '2025-09-06 11:00:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544001b',
        'Cafeteria menu feedback',
        'Request for more vegetarian options.',
        'Cafeteria',
        'PENDING',
        true,
        '550e8400-e29b-41d4-a716-44665544000d',
        '550e8400-e29b-41d4-a716-446655440003',
        '550e8400-e29b-41d4-a716-446655440006',
        '2025-09-06 12:00:00'
    );

-- Inserting feedback status history
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
        '550e8400-e29b-41d4-a716-44665544001c',
        '550e8400-e29b-41d4-a716-446655440012',
        'PENDING',
        'Feedback has been successfully submitted to the department.',
        NULL,
        '2025-09-02 09:05:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544001d',
        '550e8400-e29b-41d4-a716-446655440013',
        'PENDING',
        'Feedback has been successfully submitted to the department.',
        'Initial submission note.',
        '2025-09-02 10:05:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544001e',
        '550e8400-e29b-41d4-a716-446655440013',
        'IN_PROGRESS',
        'Feedback is being processed by the department.',
        NULL,
        '2025-09-02 12:00:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544001f',
        '550e8400-e29b-41d4-a716-446655440014',
        'PENDING',
        'Feedback has been successfully submitted to the department.',
        NULL,
        '2025-09-03 08:35:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440020',
        '550e8400-e29b-41d4-a716-446655440014',
        'RESOLVED',
        'Feedback has been resolved.',
        'Addressed with vendor.',
        '2025-09-03 15:00:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440021',
        '550e8400-e29b-41d4-a716-446655440015',
        'PENDING',
        'Feedback has been successfully submitted to the department.',
        NULL,
        '2025-09-04 14:05:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440022',
        '550e8400-e29b-41d4-a716-446655440016',
        'PENDING',
        'Feedback has been successfully submitted to the department.',
        'Lighting issue reported.',
        '2025-09-05 10:05:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440023',
        '550e8400-e29b-41d4-a716-446655440017',
        'PENDING',
        'Feedback has been successfully submitted to the department.',
        NULL,
        '2025-09-05 10:35:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440024',
        '550e8400-e29b-41d4-a716-446655440017',
        'IN_PROGRESS',
        'Feedback is being processed by the department.',
        'Investigating system.',
        '2025-09-05 11:00:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440025',
        '550e8400-e29b-41d4-a716-446655440019',
        'PENDING',
        'Feedback has been successfully submitted to the department.',
        NULL,
        '2025-09-06 09:05:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440026',
        '550e8400-e29b-41d4-a716-446655440019',
        'RESOLVED',
        'Feedback has been resolved.',
        'Announcement posted.',
        '2025-09-06 10:00:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440027',
        '550e8400-e29b-41d4-a716-44665544001a',
        'IN_PROGRESS',
        'Feedback is being processed by the department.',
        NULL,
        '2025-09-06 11:15:00'
    );

-- Inserting forwarding logs
INSERT INTO
    "ForwardingLogs" (
        "id",
        "feedbackId",
        "fromDepartmentId",
        "toDepartmentId",
        "userId",
        "message",
        "createdAt"
    )
VALUES (
        '550e8400-e29b-41d4-a716-446655440028',
        '550e8400-e29b-41d4-a716-446655440012',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-44665544000a',
        'Forwarded to IT support team for inspection.',
        '2025-09-02 09:30:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440029',
        '550e8400-e29b-41d4-a716-446655440013',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440008',
        'Forwarded to registrar for system check.',
        '2025-09-02 10:30:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544002a',
        '550e8400-e29b-41d4-a716-446655440015',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-44665544000a',
        'Forwarded to network team.',
        '2025-09-04 14:30:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544002b',
        '550e8400-e29b-41d4-a716-446655440016',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440011',
        'Forwarded to library maintenance team.',
        '2025-09-05 10:10:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544002c',
        '550e8400-e29b-41d4-a716-446655440017',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440008',
        'Forwarded to scholarship office.',
        '2025-09-05 10:40:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544002d',
        '550e8400-e29b-41d4-a716-44665544001a',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-44665544000a',
        'Forwarded to computer lab admin.',
        '2025-09-06 11:10:00'
    );

-- Inserting forum posts
INSERT INTO
    "ForumPosts" (
        "id",
        "feedbackId",
        "createdAt"
    )
VALUES (
        '550e8400-e29b-41d4-a716-44665544002e',
        '550e8400-e29b-41d4-a716-446655440012',
        '2025-09-02 09:10:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544002f',
        '550e8400-e29b-41d4-a716-446655440014',
        '2025-09-03 08:40:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440030',
        '550e8400-e29b-41d4-a716-446655440015',
        '2025-09-04 14:10:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440031',
        '550e8400-e29b-41d4-a716-446655440016',
        '2025-09-05 10:10:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440032',
        '550e8400-e29b-41d4-a716-446655440018',
        '2025-09-06 08:10:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440033',
        '550e8400-e29b-41d4-a716-44665544001a',
        '2025-09-06 11:05:00'
    );

-- Inserting votes
INSERT INTO
    "Votes" (
        "userId",
        "postId",
        "createdAt"
    )
VALUES (
        '550e8400-e29b-41d4-a716-446655440009',
        '550e8400-e29b-41d4-a716-44665544002e',
        '2025-09-02 09:15:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544000b',
        '550e8400-e29b-41d4-a716-44665544002e',
        '2025-09-02 09:20:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544000d',
        '550e8400-e29b-41d4-a716-44665544002f',
        '2025-09-03 09:00:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440009',
        '550e8400-e29b-41d4-a716-446655440030',
        '2025-09-04 14:15:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544000b',
        '550e8400-e29b-41d4-a716-446655440030',
        '2025-09-04 14:20:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440009',
        '550e8400-e29b-41d4-a716-446655440031',
        '2025-09-05 10:15:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544000b',
        '550e8400-e29b-41d4-a716-446655440032',
        '2025-09-06 08:20:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544000e',
        '550e8400-e29b-41d4-a716-446655440033',
        '2025-09-06 11:10:00'
    );

-- Inserting comments
INSERT INTO
    "Comments" (
        "id",
        "postId",
        "userId",
        "content",
        "createdAt"
    )
VALUES (
        '550e8400-e29b-41d4-a716-446655440034',
        '550e8400-e29b-41d4-a716-44665544002e',
        '550e8400-e29b-41d4-a716-44665544000b',
        'I faced the same issue in Room 101 yesterday!',
        '2025-09-02 09:25:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440035',
        '550e8400-e29b-41d4-a716-44665544002e',
        '550e8400-e29b-41d4-a716-44665544000d',
        'Please fix this soon, it affects our classes.',
        '2025-09-02 09:30:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440036',
        '550e8400-e29b-41d4-a716-44665544002f',
        '550e8400-e29b-41d4-a716-446655440009',
        'The food quality has been poor for weeks.',
        '2025-09-03 09:10:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440037',
        '550e8400-e29b-41d4-a716-446655440030',
        '550e8400-e29b-41d4-a716-44665544000b',
        'Wi-Fi issues are worst during peak hours.',
        '2025-09-04 14:25:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440038',
        '550e8400-e29b-41d4-a716-446655440031',
        '550e8400-e29b-41d4-a716-446655440010',
        'Flickering lights affect reading.',
        '2025-09-05 10:20:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440039',
        '550e8400-e29b-41d4-a716-446655440032',
        '550e8400-e29b-41d4-a716-446655440009',
        'Parking is always full in mornings.',
        '2025-09-06 08:15:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544003a',
        '550e8400-e29b-41d4-a716-446655440033',
        '550e8400-e29b-41d4-a716-44665544000e',
        'Software in Lab 202 is outdated.',
        '2025-09-06 11:15:00'
    );

-- Inserting comment reports
INSERT INTO
    "CommentReports" (
        "id",
        "commentId",
        "userId",
        "reason",
        "status",
        "adminResponse",
        "createdAt"
    )
VALUES (
        '550e8400-e29b-41d4-a716-44665544003b',
        '550e8400-e29b-41d4-a716-446655440036',
        '550e8400-e29b-41d4-a716-44665544000b',
        'Inappropriate tone',
        'PENDING',
        NULL,
        '2025-09-03 09:20:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544003c',
        '550e8400-e29b-41d4-a716-446655440037',
        '550e8400-e29b-41d4-a716-44665544000d',
        'Off-topic comment',
        'RESOLVED',
        'Comment reviewed, no action needed.',
        '2025-09-04 14:30:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544003d',
        '550e8400-e29b-41d4-a716-446655440039',
        '550e8400-e29b-41d4-a716-44665544000f',
        'Duplicate comment',
        'PENDING',
        NULL,
        '2025-09-06 08:25:00'
    );

-- Inserting clarification conversations
INSERT INTO
    "ClarificationConversations" (
        "id",
        "feedbackId",
        "isClosed",
        "userId",
        "createdAt"
    )
VALUES (
        '550e8400-e29b-41d4-a716-44665544003e',
        '550e8400-e29b-41d4-a716-446655440013',
        false,
        '550e8400-e29b-41d4-a716-44665544000b',
        '2025-09-02 10:10:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544003f',
        '550e8400-e29b-41d4-a716-446655440014',
        true,
        '550e8400-e29b-41d4-a716-44665544000d',
        '2025-09-03 08:45:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440040',
        '550e8400-e29b-41d4-a716-446655440017',
        false,
        '550e8400-e29b-41d4-a716-446655440010',
        '2025-09-05 10:40:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440041',
        '550e8400-e29b-41d4-a716-44665544001b',
        false,
        '550e8400-e29b-41d4-a716-44665544000d',
        '2025-09-06 12:05:00'
    );

-- Inserting messages
INSERT INTO
    "Messages" (
        "id",
        "conversationId",
        "userId",
        "content",
        "createdAt"
    )
VALUES (
        '550e8400-e29b-41d4-a716-446655440042',
        '550e8400-e29b-41d4-a716-44665544003e',
        '550e8400-e29b-41d4-a716-44665544000b',
        'Can you specify which course caused the error?',
        '2025-09-02 10:15:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440043',
        '550e8400-e29b-41d4-a716-44665544003e',
        '550e8400-e29b-41d4-a716-446655440008',
        'It was CS101, error code 503.',
        '2025-09-02 10:20:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440044',
        '550e8400-e29b-41d4-a716-44665544003f',
        '550e8400-e29b-41d4-a716-44665544000d',
        'Can you confirm if the vendor was changed?',
        '2025-09-03 08:50:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440045',
        '550e8400-e29b-41d4-a716-44665544003f',
        '550e8400-e29b-41d4-a716-44665544000c',
        'Yes, new vendor contract signed.',
        '2025-09-03 09:00:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440046',
        '550e8400-e29b-41d4-a716-446655440040',
        '550e8400-e29b-41d4-a716-446655440010',
        'Scholarship application shows error for valid entries.',
        '2025-09-05 10:45:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440047',
        '550e8400-e29b-41d4-a716-446655440040',
        '550e8400-e29b-41d4-a716-446655440008',
        'We are checking the system logs.',
        '2025-09-05 10:50:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440048',
        '550e8400-e29b-41d4-a716-446655440041',
        '550e8400-e29b-41d4-a716-44665544000d',
        'Please add more vegetarian meals.',
        '2025-09-06 12:10:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440049',
        '550e8400-e29b-41d4-a716-446655440041',
        '550e8400-e29b-41d4-a716-44665544000c',
        'Cafeteria team notified.',
        '2025-09-06 12:20:00'
    );

-- Inserting file attachments for messages
INSERT INTO
    "FileAttachmentForMessage" (
        "id",
        "messageId",
        "fileName",
        "fileUrl"
    )
VALUES (
        '550e8400-e29b-41d4-a716-44665544005b',
        '550e8400-e29b-41d4-a716-446655440043',
        'error_screenshot.png',
        'https://example.com/files/error_screenshot.png'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544005c',
        '550e8400-e29b-41d4-a716-446655440046',
        'application_error.jpg',
        'https://example.com/files/application_error.jpg'
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
        '550e8400-e29b-41d4-a716-44665544004a',
        '550e8400-e29b-41d4-a716-446655440012',
        'projector_issue.jpg',
        'https://example.com/files/projector_issue.jpg'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544004b',
        '550e8400-e29b-41d4-a716-446655440015',
        'wifi_log.txt',
        'https://example.com/files/wifi_log.txt'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544004c',
        '550e8400-e29b-41d4-a716-446655440017',
        'scholarship_error.png',
        'https://example.com/files/scholarship_error.png'
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
        '550e8400-e29b-41d4-a716-44665544004d',
        'System Maintenance',
        'Scheduled maintenance on 2025-09-10.',
        '2025-09-05 12:00:00',
        '550e8400-e29b-41d4-a716-446655440008'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544004e',
        'New Cafeteria Menu',
        'Updated menu starting next week.',
        '2025-09-06 10:00:00',
        '550e8400-e29b-41d4-a716-44665544000c'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544004f',
        'Parking Update',
        'Additional parking spots available.',
        '2025-09-06 08:30:00',
        '550e8400-e29b-41d4-a716-44665544000c'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440050',
        'Library Lighting Fixed',
        'All library lights repaired.',
        '2025-09-05 11:00:00',
        '550e8400-e29b-41d4-a716-446655440011'
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
        '550e8400-e29b-41d4-a716-446655440051',
        '550e8400-e29b-41d4-a716-44665544004e',
        'new_menu.pdf',
        'https://example.com/files/new_menu.pdf'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440052',
        '550e8400-e29b-41d4-a716-446655440050',
        'lighting_report.pdf',
        'https://example.com/files/lighting_report.pdf'
    );

-- Inserting notifications
INSERT INTO
    "Notifications" (
        "id",
        "userId",
        "content",
        "notificationType",
        "isRead",
        "createdAt"
    )
VALUES (
        '550e8400-e29b-41d4-a716-446655440053',
        '550e8400-e29b-41d4-a716-446655440009',
        'Your feedback on projector issue was received.',
        'FEEDBACK_NOTIFICATION',
        true,
        '2025-09-02 09:05:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440054',
        '550e8400-e29b-41d4-a716-44665544000b',
        'Your comment on Wi-Fi post was reported.',
        'COMMENT_NOTIFICATION',
        false,
        '2025-09-04 14:30:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440055',
        '550e8400-e29b-41d4-a716-44665544000d',
        'New announcement: New Cafeteria Menu.',
        'MESSAGE_NOTIFICATION',
        true,
        '2025-09-06 10:05:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440056',
        '550e8400-e29b-41d4-a716-446655440009',
        'Your feedback on Wi-Fi was upvoted.',
        'VOTE_NOTIFICATION',
        false,
        '2025-09-04 14:20:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440057',
        '550e8400-e29b-41d4-a716-44665544000e',
        'Your feedback on library lighting was received.',
        'FEEDBACK_NOTIFICATION',
        true,
        '2025-09-05 10:06:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440058',
        '550e8400-e29b-41d4-a716-446655440010',
        'Scholarship system issue under investigation.',
        'FEEDBACK_NOTIFICATION',
        false,
        '2025-09-05 10:45:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440059',
        '550e8400-e29b-41d4-a716-446655440009',
        'Your comment on parking post was reported.',
        'COMMENT_NOTIFICATION',
        false,
        '2025-09-06 08:25:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544005a',
        '550e8400-e29b-41d4-a716-44665544000d',
        'Cafeteria team responded to your request.',
        'MESSAGE_NOTIFICATION',
        true,
        '2025-09-06 12:20:00'
    );
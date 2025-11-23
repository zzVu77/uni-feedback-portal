-- Inserting departments
INSERT INTO
    "Departments" (
        "id",
        "name",
        "email",
        "description",
        "location",
        "phone",
        "isActive",
        "createdAt"
    )
VALUES (
        '550e8400-e29b-41d4-a716-446655440000',
        'IT Department',
        'it.support@university.edu',
        'Handles all technical infrastructure, network, and software support.',
        'Building A, Room 101',
        '123-456-7890',
        true,
        '2025-09-01 09:00:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440001',
        'Human Resources',
        'hr@university.edu',
        'Manages employee relations, payroll, and benefits.',
        'Building B, Room 205',
        '123-456-7891',
        true,
        '2025-09-01 09:00:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440002',
        'Academic Affairs',
        'academic.affairs@university.edu',
        'Oversees curriculum, course scheduling, and faculty matters.',
        'Building C, Room 310',
        '123-456-7892',
        true,
        '2025-09-01 09:00:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440003',
        'Student Services',
        'student.services@university.edu',
        'Provides support for student life, including housing, counseling, and activities.',
        'Building D, Room 100',
        '123-456-7893',
        true,
        '2025-09-01 09:00:00'
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
        "note",
        "createdAt"
    )
VALUES (
        '550e8400-e29b-41d4-a716-446655440028',
        '550e8400-e29b-41d4-a716-446655440012',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-44665544000a',
        'Forwarded to IT support team for inspection.',
        'Urgent: Projector critical for classes.',
        '2025-09-02 09:30:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440029',
        '550e8400-e29b-41d4-a716-446655440013',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440008',
        'Forwarded to registrar for system check.',
        NULL,
        '2025-09-02 10:30:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544002a',
        '550e8400-e29b-41d4-a716-446655440015',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-44665544000a',
        'Forwarded to network team.',
        'Check network logs for details.',
        '2025-09-04 14:30:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544002b',
        '550e8400-e29b-41d4-a716-446655440016',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440011',
        'Forwarded to library maintenance team.',
        NULL,
        '2025-09-05 10:10:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544002c',
        '550e8400-e29b-41d4-a716-446655440017',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440008',
        'Forwarded to scholarship office.',
        'High priority: Affects multiple students.',
        '2025-09-05 10:40:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544002d',
        '550e8400-e29b-41d4-a716-44665544001a',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-44665544000a',
        'Forwarded to computer lab admin.',
        NULL,
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
-- Inserting comments: 7 gốc + 21 reply (student discussion) + 6 official staff responses
INSERT INTO
    "Comments" (
        "id",
        "postId",
        "userId",
        "parentId",
        "content",
        "createdAt"
    )
VALUES
    -- Comment gốc 1 (Projector - post 44002e)
    (
        '550e8400-e29b-41d4-a716-446655440034',
        '550e8400-e29b-41d4-a716-44665544002e',
        '550e8400-e29b-41d4-a716-44665544000b',
        NULL,
        'I faced the same issue in Room 101 yesterday!',
        '2025-09-02 09:25:00'
    ),
    -- 3 reply (sinh viên bàn tán)
    (
        '550e8400-e29b-41d4-a716-446655440060',
        '550e8400-e29b-41d4-a716-44665544002e',
        '550e8400-e29b-41d4-a716-446655440009',
        '550e8400-e29b-41d4-a716-446655440034',
        'Yeah, I was there too! The screen went black mid-lecture.',
        '2025-09-02 09:40:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440061',
        '550e8400-e29b-41d4-a716-44665544002e',
        '550e8400-e29b-41d4-a716-44665544000e',
        '550e8400-e29b-41d4-a716-446655440034',
        'We have a group presentation tomorrow... this is bad.',
        '2025-09-02 09:45:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440062',
        '550e8400-e29b-41d4-a716-44665544002e',
        '550e8400-e29b-41d4-a716-44665544000d',
        '550e8400-e29b-41d4-a716-446655440034',
        'Anyone know if they’re fixing it today?',
        '2025-09-02 09:50:00'
    ),

-- Comment gốc 2
(
    '550e8400-e29b-41d4-a716-446655440035',
    '550e8400-e29b-41d4-a716-44665544002e',
    '550e8400-e29b-41d4-a716-44665544000d',
    NULL,
    'Please fix this soon, it affects our classes.',
    '2025-09-02 09:30:00'
),
-- 3 reply
(
    '550e8400-e29b-41d4-a716-446655440063',
    '550e8400-e29b-41d4-a716-44665544002e',
    '550e8400-e29b-41d4-a716-44665544000b',
    '550e8400-e29b-41d4-a716-446655440035',
    'I had to use my phone to show slides last week!',
    '2025-09-02 10:00:00'
),
(
    '550e8400-e29b-41d4-a716-446655440064',
    '550e8400-e29b-41d4-a716-44665544002e',
    '550e8400-e29b-41d4-a716-446655440009',
    '550e8400-e29b-41d4-a716-446655440035',
    'This happens every semester in Room 101...',
    '2025-09-02 10:05:00'
),
(
    '550e8400-e29b-41d4-a716-446655440065',
    '550e8400-e29b-41d4-a716-44665544002e',
    '550e8400-e29b-41d4-a716-44665544000e',
    '550e8400-e29b-41d4-a716-446655440035',
    'Hope they replace it, not just restart...',
    '2025-09-02 10:10:00'
),

-- Comment gốc 3 (Cafeteria - post 44002f)
(
    '550e8400-e29b-41d4-a716-446655440036',
    '550e8400-e29b-41d4-a716-44665544002f',
    '550e8400-e29b-41d4-a716-446655440009',
    NULL,
    'The food quality has been poor for weeks.',
    '2025-09-03 09:10:00'
),
-- 3 reply
(
    '550e8400-e29b-41d4-a716-446655440066',
    '550e8400-e29b-41d4-a716-44665544002f',
    '550e8400-e29b-41d4-a716-44665544000d',
    '550e8400-e29b-41d4-a716-446655440036',
    'The rice is always undercooked!',
    '2025-09-03 09:30:00'
),
(
    '550e8400-e29b-41d4-a716-446655440067',
    '550e8400-e29b-41d4-a716-44665544002f',
    '550e8400-e29b-41d4-a716-44665544000b',
    '550e8400-e29b-41d4-a716-446655440036',
    'I stopped eating there after last Monday.',
    '2025-09-03 09:35:00'
),
(
    '550e8400-e29b-41d4-a716-446655440068',
    '550e8400-e29b-41d4-a716-44665544002f',
    '550e8400-e29b-41d4-a716-44665544000e',
    '550e8400-e29b-41d4-a716-446655440036',
    'We need more vegetarian options too.',
    '2025-09-03 09:40:00'
),

-- Comment gốc 4 (Wi-Fi - post 440030)
(
    '550e8400-e29b-41d4-a716-446655440037',
    '550e8400-e29b-41d4-a716-446655440030',
    '550e8400-e29b-41d4-a716-44665544000b',
    NULL,
    'Wi-Fi issues are worst during peak hours.',
    '2025-09-04 14:25:00'
),
-- 3 reply
(
    '550e8400-e29b-41d4-a716-446655440069',
    '550e8400-e29b-41d4-a716-446655440030',
    '550e8400-e29b-41d4-a716-446655440009',
    '550e8400-e29b-41d4-a716-446655440037',
    'Can’t even load Moodle from 12–2 PM.',
    '2025-09-04 14:40:00'
),
(
    '550e8400-e29b-41d4-a716-44665544006a',
    '550e8400-e29b-41d4-a716-446655440030',
    '550e8400-e29b-41d4-a716-44665544000e',
    '550e8400-e29b-41d4-a716-446655440037',
    'I use mobile data every day now.',
    '2025-09-04 14:45:00'
),
(
    '550e8400-e29b-41d4-a716-44665544006b',
    '550e8400-e29b-41d4-a716-446655440030',
    '550e8400-e29b-41d4-a716-44665544000d',
    '550e8400-e29b-41d4-a716-446655440037',
    'Same in the lab, drops every 5 minutes.',
    '2025-09-04 14:50:00'
),

-- Comment gốc 5 (Library lighting - post 440031)
(
    '550e8400-e29b-41d4-a716-446655440038',
    '550e8400-e29b-41d4-a716-446655440031',
    '550e8400-e29b-41d4-a716-446655440010',
    NULL,
    'Flickering lights affect reading.',
    '2025-09-05 10:20:00'
),
-- 3 reply
(
    '550e8400-e29b-41d4-a716-44665544006c',
    '550e8400-e29b-41d4-a716-446655440031',
    '550e8400-e29b-41d4-a716-44665544000d',
    '550e8400-e29b-41d4-a716-446655440038',
    'It’s like a disco in the study area!',
    '2025-09-05 10:35:00'
),
(
    '550e8400-e29b-41d4-a716-44665544006d',
    '550e8400-e29b-41d4-a716-446655440031',
    '550e8400-e29b-41d4-a716-44665544000b',
    '550e8400-e29b-41d4-a716-446655440038',
    'Gives me a headache after 30 mins.',
    '2025-09-05 10:40:00'
),
(
    '550e8400-e29b-41d4-a716-44665544006e',
    '550e8400-e29b-41d4-a716-446655440031',
    '550e8400-e29b-41d4-a716-44665544009',
    '550e8400-e29b-41d4-a716-446655440038',
    'I moved to the 1st floor, better there.',
    '2025-09-05 10:45:00'
),

-- Comment gốc 6 (Parking - post 440032)
(
    '550e8400-e29b-41d4-a716-446655440039',
    '550e8400-e29b-41d4-a716-446655440032',
    '550e8400-e29b-41d4-a716-446655440009',
    NULL,
    'Parking is always full in mornings.',
    '2025-09-06 08:15:00'
),
-- 3 reply
(
    '550e8400-e29b-41d4-a716-44665544006f',
    '550e8400-e29b-41d4-a716-446655440032',
    '550e8400-e29b-41d4-a716-44665544000e',
    '550e8400-e29b-41d4-a716-446655440039',
    'I circle for 20 mins every day!',
    '2025-09-06 08:30:00'
),
(
    '550e8400-e29b-41d4-a716-446655440070',
    '550e8400-e29b-41d4-a716-446655440032',
    '550e8400-e29b-41d4-a716-44665544000d',
    '550e8400-e29b-41d4-a716-446655440039',
    'Even at 7:45 AM, no spot.',
    '2025-09-06 08:35:00'
),
(
    '550e8400-e29b-41d4-a716-446655440071',
    '550e8400-e29b-41d4-a716-446655440032',
    '550e8400-e29b-41d4-a716-44665544000b',
    '550e8400-e29b-41d4-a716-446655440039',
    'I park at the mall and walk now.',
    '2025-09-06 08:40:00'
),

-- Comment gốc 7 (Software Lab - post 440033)
(
    '550e8400-e29b-41d4-a716-44665544003a',
    '550e8400-e29b-41d4-a716-446655440033',
    '550e8400-e29b-41d4-a716-44665544000e',
    NULL,
    'Software in Lab 202 is outdated.',
    '2025-09-06 11:15:00'
),
-- 3 reply
(
    '550e8400-e29b-41d4-a716-446655440072',
    '550e8400-e29b-41d4-a716-446655440033',
    '550e8400-e29b-41d4-a716-446655440009',
    '550e8400-e29b-41d4-a716-44665544003a',
    'Still on Python 3.8? We need 3.11!',
    '2025-09-06 11:25:00'
),
(
    '550e8400-e29b-41d4-a716-446655440073',
    '550e8400-e29b-41d4-a716-446655440033',
    '550e8400-e29b-41d4-a716-44665544000b',
    '550e8400-e29b-41d4-a716-44665544003a',
    'VS Code keeps crashing on my project.',
    '2025-09-06 11:30:00'
),
(
    '550e8400-e29b-41d4-a716-446655440074',
    '550e8400-e29b-41d4-a716-446655440033',
    '550e8400-e29b-41d4-a716-44665544000d',
    '550e8400-e29b-41d4-a716-44665544003a',
    'I use my laptop instead, lab is useless.',
    '2025-09-06 11:35:00'
),

-- 6 OFFICIAL STAFF RESPONSES (same format)
(
    '550e8400-e29b-41d4-a716-446655440075',
    '550e8400-e29b-41d4-a716-44665544002e',
    '550e8400-e29b-41d4-a716-44665544000a',
    NULL,
    'We have noted your feedback regarding the projector in Room 101 and will address it promptly. Rest assured, the issue is being handled.',
    '2025-09-02 14:00:00'
),
(
    '550e8400-e29b-41d4-a716-446655440076',
    '550e8400-e29b-41d4-a716-44665544002f',
    '550e8400-e29b-41d4-a716-44665544000c',
    NULL,
    'We have noted your feedback about cafeteria food quality and will address it with the vendor. Rest assured, improvements are in progress.',
    '2025-09-03 12:00:00'
),
(
    '550e8400-e29b-41d4-a716-446655440077',
    '550e8400-e29b-41d4-a716-446655440030',
    '550e8400-e29b-41d4-a716-44665544000a',
    NULL,
    'We have noted your feedback on Wi-Fi connectivity and will address it with the network team. Rest assured, we are working on a solution.',
    '2025-09-05 09:00:00'
),
(
    '550e8400-e29b-41d4-a716-446655440078',
    '550e8400-e29b-41d4-a716-446655440031',
    '550e8400-e29b-41d4-a716-446655440011',
    NULL,
    'We have noted your feedback about library lighting and will address it with maintenance. Rest assured, the issue is under review.',
    '2025-09-05 15:00:00'
),
(
    '550e8400-e29b-41d4-a716-446655440079',
    '550e8400-e29b-41d4-a716-446655440032',
    '550e8400-e29b-41d4-a716-446655440008',
    NULL,
    'We have noted your feedback on parking availability and will address it with campus planning. Rest assured, additional solutions are being explored.',
    '2025-09-09 08:00:00'
),
(
    '550e8400-e29b-41d4-a716-44665544007a',
    '550e8400-e29b-41d4-a716-446655440033',
    '550e8400-e29b-41d4-a716-44665544000a',
    NULL,
    'We have noted your feedback on Lab 202 software and will address it with the IT team. Rest assured, an update is being prepared.',
    '2025-09-07 09:00:00'
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
        "subject",
        "feedbackId",
        "isClosed",
        "userId",
        "createdAt"
    )
VALUES (
        '550e8400-e29b-41d4-a716-44665544003e',
        'Clarification on Course Registration Issue',
        '550e8400-e29b-41d4-a716-446655440013',
        false,
        '550e8400-e29b-41d4-a716-44665544000b',
        '2025-09-02 10:10:00'
    ),
    (
        '550e8400-e29b-41d4-a716-44665544003f',
        'Follow-up on Cafeteria Food Quality',
        '550e8400-e29b-41d4-a716-446655440014',
        true,
        '550e8400-e29b-41d4-a716-44665544000d',
        '2025-09-03 08:45:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440040',
        'Details needed for Scholarship Application Problem',
        '550e8400-e29b-41d4-a716-446655440017',
        false,
        '550e8400-e29b-41d4-a716-446655440010',
        '2025-09-05 10:40:00'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440041',
        'Regarding Cafeteria Menu Feedback',
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

-- ===================================================================
-- NOTIFICATIONS – Dummy data (đủ các loại thông báo trong enum)
-- ===================================================================

INSERT INTO
    "Notifications" (
        "id",
        "userId",
        "content",
        "notificationType",
        "targetId",
        "isRead",
        "createdAt"
    )
VALUES
    -- 1. Student nhận thông báo feedback đã được submit thành công
    (
        '550e8400-e29b-41d4-a716-446655440101',
        '550e8400-e29b-41d4-a716-446655440009',
        'Phản hồi của bạn "Máy chiếu phòng 101 bị hỏng" đã được gửi thành công.',
        'FEEDBACK_SUBMITTED_NOTIFICATION',
        '550e8400-e29b-41d4-a716-446655440012',
        false,
        '2025-09-02 09:05:00'
    ),

-- 2. Staff IT nhận thông báo có feedback mới thuộc phòng ban mình
(
    '550e8400-e29b-41d4-a716-446655440102',
    '550e8400-e29b-41d4-a716-446655440009',
    'Có phản hồi mới: "Máy chiếu phòng 101 bị hỏng" (John Doe).',
    'NEW_FEEDBACK_RECEIVED',
    '550e8400-e29b-41d4-a716-446655440012',
    false,
    '2025-09-02 09:06:00'
),

-- 3. Feedback được chuyển tiếp (forward) tới phòng ban khác
(
    '550e8400-e29b-41d4-a716-446655440103',
    '550e8400-e29b-41d4-a716-446655440009',
    'Phản hồi "Máy chiếu phòng 101 bị hỏng" đã được chuyển tới đội hỗ trợ kỹ thuật.',
    'FEEDBACK_FORWARDED_TO_YOU',
    '550e8400-e29b-41d4-a716-446655440012',
    false,
    '2025-09-02 09:35:00'
),

-- 4. Feedback đang được xử lý
(
    '550e8400-e29b-41d4-a716-446655440104',
    '550e8400-e29b-41d4-a716-446655440009',
    'Phản hồi của bạn đang được xử lý.',
    'FEEDBACK_PROCESSING_NOTIFICATION',
    '550e8400-e29b-41d4-a716-446655440012',
    false,
    '2025-09-02 10:00:00'
),

-- 5. Feedback đã được giải quyết
(
    '550e8400-e29b-41d4-a716-446655440105',
    '550e8400-e29b-41d4-a716-446655440009',
    'Phản hồi "Chất lượng thức ăn căng tin" đã được giải quyết. Cảm ơn bạn!',
    'FEEDBACK_RESOLVED_NOTIFICATION',
    '550e8400-e29b-41d4-a716-446655440014',
    true,
    '2025-09-03 15:05:00'
),

-- 6. Có bình luận mới trên bài đăng forum (liên quan feedback)
(
    '550e8400-e29b-41d4-a716-446655440106',
    '550e8400-e29b-41d4-a716-446655440009',
    'Có bình luận mới từ Alice Brown trên bài đăng của bạn.',
    'COMMENT_FORUM_POST_NOTIFICATION',
    '550e8400-e29b-41d4-a716-44665544002e',
    false,
    '2025-09-02 09:26:00'
),

-- 7. Có reply bình luận
(
    '550e8400-e29b-41d4-a716-446655440107',
    '550e8400-e29b-41d4-a716-446655440009',
    'John Doe đã trả lời bình luận của bạn.',
    'REPLY_COMMENT_FORUM_POST_NOTIFICATION',
    '550e8400-e29b-41d4-a716-446655440060',
    false,
    '2025-09-02 09:41:00'
),

-- 8. Ai đó vote bài đăng forum của bạn
(
    '550e8400-e29b-41d4-a716-446655440108',
    '550e8400-e29b-41d4-a716-446655440009',
    'Bài đăng của bạn nhận được 1 lượt ủng hộ mới.',
    'VOTE_FORUM_POST_NOTIFICATION',
    '550e8400-e29b-41d4-a716-44665544002e',
    true,
    '2025-09-02 09:16:00'
),

-- 9. Có tin nhắn mới trong cuộc trò chuyện làm rõ
(
    '550e8400-e29b-41d4-a716-446655440109',
    '550e8400-e29b-41d4-a716-446655440009',
    'Nhân viên đã trả lời trong cuộc trò chuyện làm rõ phản hồi của bạn.',
    'MESSAGE_NEW_NOTIFICATION',
    '550e8400-e29b-41d4-a716-44665544003e',
    false,
    '2025-09-02 10:21:00'
),

-- 10. Admin nhận thông báo có báo cáo bình luận mới
(
    '550e8400-e29b-41d4-a716-44665544010a',
    '550e8400-e29b-41d4-a716-446655440009',
    'Có báo cáo bình luận mới cần xem xét (bài căng tin).',
    'NEW_COMMENT_REPORT_FOR_ADMIN',
    '550e8400-e29b-41d4-a716-44665544003b',
    false,
    '2025-09-03 09:21:00'
),

-- 11. Người báo cáo nhận kết quả xử lý báo cáo
(
    '550e8400-e29b-41d4-a716-44665544010b',
    '550e8400-e29b-41d4-a716-446655440009',
    'Báo cáo bình luận của bạn đã được xử lý – không vi phạm.',
    'REPORT_RESOLVED_NO_VIOLATION',
    '550e8400-e29b-41d4-a716-44665544003b',
    true,
    '2025-09-04 15:00:00'
),

-- 12. Thông báo hệ thống / thông báo chung
(
    '550e8400-e29b-41d4-a716-44665544010c',
    '550e8400-e29b-41d4-a716-446655440009',
    'Hệ thống sẽ bảo trì từ 02:00–04:00 ngày 10/09/2025.',
    'SYSTEM_ANNOUNCEMENT_NOTIFICATION',
    NULL,
    true,
    '2025-09-05 12:05:00'
),

-- 13. Thông báo có announcement mới
(
    '550e8400-e29b-41d4-a716-44665544010d',
    '550e8400-e29b-41d4-a716-446655440009',
    'Thông báo mới: Menu căng tin được cập nhật từ tuần tới.',
    'NEW_ANNOUNCEMENT_NOTIFICATION',
    '550e8400-e29b-41d4-a716-44665544004e',
    false,
    '2025-09-06 10:01:00'
);
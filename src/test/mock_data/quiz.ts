import { GenStatus } from '~/interfaces/IQuiz';

export const postWithQuiz = {
  code: 'api.ok',
  data: {
    id: '54f4a2eb-034d-4e4e-8810-44744bffc87d',
    audience: {
      groups: [
        {
          id: '18508ac3-2bfc-4172-b071-1d67f1b1e05b',
          name: 'Bein Product Team',
          icon: 'https://media.beincom.io/image/variants/group/avatar/6f4e6113-fd61-4b5b-848b-468afe2c8550',
          communityId: '15337361-1577-4b7b-a31d-990df06aa446',
          isCommunity: false,
          privacy: 'OPEN',
          rootGroupId: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
        },
        {
          id: 'aeab68c2-bcec-4edb-a78b-60c0ee90afd7',
          name: 'Bein Founding Community',
          icon: null,
          communityId: '15337361-1577-4b7b-a31d-990df06aa446',
          isCommunity: false,
          privacy: 'OPEN',
          rootGroupId: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
        },
        {
          id: 'b01fb58e-9299-4a0e-a55f-9839293fb42a',
          name: 'Community test group order Linh',
          icon: 'https://media.beincom.io/image/variants/group/avatar/88939640-cfdb-43ac-8689-9bc6e584bc9a',
          communityId: '153c02e4-3b08-4c3e-bb74-dd2d94d0a5e7',
          isCommunity: true,
          privacy: 'PRIVATE',
          rootGroupId: 'b01fb58e-9299-4a0e-a55f-9839293fb42a',
        },
      ],
    },
    content: '# Người dùng vẫn sạc smartphone qua đêm\nKhảo sát của Asus cho thấy người dùng thường xuyên sạc điện thoại qua đêm dù thói quen này được đánh giá gây hại cho thiết bị.\nAsus cho biết một nửa người dùng smartphone của hãng chọn sạc qua đêm, dù thiết bị đã có tính năng sạc nhanh. Trong đó, 25% bật Sạc ổn định - tính năng làm chậm tốc độ sạc để giảm nhiệt và kéo dài tuổi thọ pin; 26% bật Sạc theo lịch trình - chế độ trì hoãn việc sạc đầy 100% pin.Trang công nghệ _Android Authority_ cũng thực hiện khảo sát tương tự và có tới 66% người tham gia có thói quen cắm sạc thiết bị cả đêm.',
    createdAt: '2023-06-29T05:24:25.545Z',
    tags: [],
    quiz: {
      id: 'c14e8f68-2b33-4303-ab81-0f29bb3192ac',
      title: 'testse',
      description: 'ahihihi',
      status: 'PUBLISHED',
      genStatus: 'PROCESSED',
      createdAt: '2023-06-29T08:37:43.927Z',
      updatedAt: '2023-06-29T08:38:39.825Z',
    },
    quizDoing: {
      quizParticipantId: '6bb91eea-04f8-4919-81ee-63f2985a031f',
    },
    quizHighestScore: {
      quizParticipantId: '83127aef-aede-455e-bf05-e04b7b46482a',
      score: 30,
    },
    communities: [
      {
        id: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
        name: 'EVOL Community',
        icon: 'https://media.beincom.io/image/variants/group/avatar/26a806d3-3557-4f7a-b96a-132a9befccff',
        communityId: '15337361-1577-4b7b-a31d-990df06aa446',
        isCommunity: true,
        privacy: 'OPEN',
        rootGroupId: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
      },
      {
        id: 'b01fb58e-9299-4a0e-a55f-9839293fb42a',
        name: 'Community test group order Linh',
        icon: 'https://media.beincom.io/image/variants/group/avatar/88939640-cfdb-43ac-8689-9bc6e584bc9a',
        communityId: '153c02e4-3b08-4c3e-bb74-dd2d94d0a5e7',
        isCommunity: true,
        privacy: 'PRIVATE',
        rootGroupId: 'b01fb58e-9299-4a0e-a55f-9839293fb42a',
      },
    ],
    media: {
      files: [],
      images: [],
      videos: [],
    },
    mentions: [],
    actor: {
      id: '0fa01fde-7c15-4d55-b60a-8e990123bc2e',
      username: 'truongthi',
      fullname: 'Nguyễn Trường Thi',
      email: 'truongthi@evol.vn',
      avatar:
        'https://media.beincom.io/image/variants/user/avatar/7a9ea089-12a6-40e9-96ca-083bcbc5408a',
      isDeactivated: false,
      isVerified: true,
      showingBadges: [
        {
          id: '61a0b534-c390-4685-936e-621e32607953',
          name: 'Team Secret',
          iconUrl:
            'https://media.beincom.io/image/variants/badge/a2a4b6cd-4581-42e6-b28c-dd9d04fec9a6',
          community: {
            id: '656cebfe-1b91-473f-97fd-96837bf9e2a5',
            name: 'Community của Bảo gất là dễ thương nuônnnnnnnnnnnnnn',
          },
        },
      ],
    },
    status: 'PUBLISHED',
    type: 'POST',
    privacy: 'OPEN',
    setting: {
      isImportant: false,
      importantExpiredAt: null,
      canComment: true,
      canReact: true,
    },
    commentsCount: 0,
    totalUsersSeen: 3,
    linkPreview: null,
    markedReadPost: false,
    isSaved: false,
    isReported: false,
    reactionsCount: [
      {
        mask: 1,
      },
    ],
    ownerReactions: [
      {
        id: '427b3794-aa51-4bb6-8ddb-743861585f90',
        reactionName: 'mask',
      },
    ],
  },
  meta: {
    message: 'OK',
  },
};

export const mockGenerateQuizResponse = {
  code: 'api.ok',
  data: {
    id: '47279515-8d41-41e8-935c-d3d07293489b',
    contentId: '2f1bb8bb-84ac-46ed-9a0e-c254487e3520',
    status: 'DRAFT',
    genStatus: GenStatus.PROCESSED,
    title: null,
    description: null,
    numberOfQuestions: 10,
    numberOfQuestionsDisplay: null,
    numberOfAnswers: 4,
    numberOfAnswersDisplay: null,
    isRandom: true,
    questions: [
      {
        id: '123',
        content: 'Con mèo biết làm gì?',
        answers: [
          {
            id: '1234',
            content: 'Biết bơi',
            isCorrect: false,
          },
          {
            id: '12345',
            content: 'Biết sửa cơ điện',
            isCorrect: false,
          },
          {
            id: '123456',
            content: 'Biết trèo cây',
            isCorrect: true,
          },
          {
            id: '1234567',
            content: 'Biết lái ô tô',
            isCorrect: false,
          },
        ],
      },
      {
        id: '12345678',
        content: 'Mèo là động vật thuộc họ nào?',
        answers: [
          {
            id: '123456789',
            content: 'Họ mèo',
            isCorrect: true,
          },
          {
            id: '12345678910',
            content: 'Họ chó',
            isCorrect: false,
          },
          {
            id: '12345678911',
            content: 'Họ báo',
            isCorrect: false,
          },
          {
            id: '12345678912',
            content: 'Họ chuột',
            isCorrect: false,
          },
        ],
      },
      {
        id: '12345678913',
        content: 'Mèo có bao nhiêu chân?',
        answers: [
          {
            id: '12345678914',
            content: '2 chân',
            isCorrect: false,
          },
          {
            id: '12345678915',
            content: '3 chân',
            isCorrect: false,
          },
          {
            id: '12345678916',
            content: '4 chân',
            isCorrect: true,
          },
          {
            id: '12345678917',
            content: '5 chân',
            isCorrect: false,
          },
        ],
      },
      {
        id: '12345678918',
        content: 'Cây cau là loại cây gì?',
        answers: [
          {
            id: '12345678919',
            content: 'Cây cỏ',
            isCorrect: false,
          },
          {
            id: '12345678920',
            content: 'Cây hoa',
            isCorrect: false,
          },
          {
            id: '12345678921',
            content: 'Cây thân gỗ',
            isCorrect: true,
          },
          {
            id: '12345678922',
            content: 'Cây xương rồng',
            isCorrect: false,
          },
        ],
      },
      {
        id: '12345678923',
        content: 'Con mèo có móng vuốt dài hay ngắn?',
        answers: [
          {
            id: '12345678924',
            content: 'Dài',
            isCorrect: true,
          },
          {
            id: '12345678925',
            content: 'Ngắn',
            isCorrect: false,
          },
          {
            id: '12345678926',
            content: 'Không có móng vuốt',
            isCorrect: false,
          },
          {
            id: '12345678927',
            content: 'Móng vuốt giống chó',
            isCorrect: false,
          },
        ],
      },
      {
        id: '12345678928',
        content: 'Còn gọi mèo là gì?',
        answers: [
          {
            id: '12345678929',
            content: 'Mèu',
            isCorrect: false,
          },
          {
            id: '12345678930',
            content: 'Mỡ',
            isCorrect: false,
          },
          {
            id: '12345678931',
            content: 'Móc',
            isCorrect: false,
          },
          {
            id: '12345678932',
            content: 'Miu',
            isCorrect: true,
          },
        ],
      },
      {
        id: '12345678933',
        content: 'Mèo có ai thức ăn yêu thích?',
        answers: [
          {
            id: '12345678934',
            content: 'Rau củ',
            isCorrect: false,
          },
          {
            id: '12345678935',
            content: 'Hamburger',
            isCorrect: false,
          },
          {
            id: '12345678936',
            content: 'Cà phê',
            isCorrect: false,
          },
          {
            id: '12345678937',
            content: 'Cá',
            isCorrect: true,
          },
        ],
      },
      {
        id: '12345678938',
        content: 'Mèo là động vật hoang dã hay nuôi trong nhà?',
        answers: [
          {
            id: '12345678939',
            content: 'Hoang dã',
            isCorrect: false,
          },
          {
            id: '12345678940',
            content: 'Nhà',
            isCorrect: false,
          },
          {
            id: '12345678941',
            content: 'Đều được',
            isCorrect: true,
          },
          {
            id: '12345678942',
            content: 'Không thể xác định',
            isCorrect: false,
          },
        ],
      },
      {
        id: '12345678943',
        content: 'Mèo có màu lông gì?',
        answers: [
          {
            id: '12345678944',
            content: 'Màu trắng',
            isCorrect: false,
          },
          {
            id: '12345678945',
            content: 'Màu đen',
            isCorrect: false,
          },
          {
            id: '12345678946',
            content: 'Màu nâu',
            isCorrect: false,
          },
          {
            id: '12345678947',
            content: 'Tất cả các màu trên',
            isCorrect: true,
          },
        ],
      },
      {
        id: '12345678948',
        content: 'Con mèo có khả năng nào sau đây?',
        answers: [
          {
            id: '12345678949',
            content: 'Bay',
            isCorrect: false,
          },
          {
            id: '12345678950',
            content: 'Biết nói',
            isCorrect: false,
          },
          {
            id: '12345678951',
            content: 'Nhảy cao',
            isCorrect: true,
          },
          {
            id: '12345678952',
            content: 'Đói mãi không no',
            isCorrect: false,
          },
        ],
      },
    ],
    createdAt: '2023-07-02T16:50:29.182Z',
    updatedAt: '2023-07-02T16:50:54.127Z',
  },
  meta: {
    message: 'Created quiz successfully',
  },
};

export const mockResultQuiz = {
  code: 'api.ok',
  data: {
    id: '6bb91eea-04f8-4919-81ee-63f2985a031f',
    title: 'Test06',
    description: null,
    questions: [
      {
        id: 'c52863d0-b19b-4d82-b87c-9e30a2738197',
        content: 'Thành phần nào phụ thuộc vào Application Core trong CA?',
        answers: [
          {
            id: '80915264-d75c-4dc8-8175-bfdd5cc7d523',
            content: 'User Interface',
          },
          {
            id: '1c94329c-6bcd-47f7-b2f3-04f33116dc72',
            content: 'Infrastructure',
          },
          {
            id: 'e5884d8a-97ba-4ccc-a7f8-a2768f32e8c8',
            content: 'Application Core',
          },
          {
            id: 'c53c546d-8bed-4e3c-9de2-e2d1ec1bf7ae',
            content: 'Database',
          },
        ],
      },
      {
        id: 'b37e91c4-e0bd-4344-a12f-60c10efa8df6',
        content: 'Trong CA, User Interface có chứa logic nghiệp vụ phức tạp không?',
        answers: [
          {
            id: 'c67cc70f-2f1d-4933-bf5f-86babe238195',
            content: 'Có',
          },
          {
            id: '85f15f65-4fcb-4338-9ce8-4c7b743bc228',
            content: 'Không',
          },
          {
            id: '344c4ab4-2717-48d0-901b-1ded3fa7720e',
            content: 'Không rõ',
          },
          {
            id: 'a5f15f0d-dbbf-4e66-85a1-b64303c55729',
            content: 'Tùy vào tình huống',
          },
        ],
      },
      {
        id: 'e13342b1-b355-4205-a785-1b2acfff0caf',
        content: 'Trong kiến trúc Clean Architecture (CA), ứng dụng được chia thành bao nhiêu thành phần chính?',
        answers: [
          {
            id: '8473e95b-5044-4731-946e-518dee32a928',
            content: '1',
          },
          {
            id: 'd45c79fa-828e-456f-8569-19e3dcdc2f5f',
            content: '2',
          },
          {
            id: '30e6861e-14dc-44d4-bb8d-2ddd9ea8b615',
            content: '3',
          },
          {
            id: '6d05b0e3-911d-4752-9fe6-e7d60621e17e',
            content: '4',
          },
        ],
      },
    ],
    userAnswers: [
      {
        questionId: 'b37e91c4-e0bd-4344-a12f-60c10efa8df6',
        answerId: '85f15f65-4fcb-4338-9ce8-4c7b743bc228',
      },
      {
        questionId: 'e13342b1-b355-4205-a785-1b2acfff0caf',
        answerId: 'd45c79fa-828e-456f-8569-19e3dcdc2f5f',
      },
      {
        questionId: 'c52863d0-b19b-4d82-b87c-9e30a2738197',
        answerId: '1c94329c-6bcd-47f7-b2f3-04f33116dc72',
      },
    ],
    quizId: 'c14e8f68-2b33-4303-ab81-0f29bb3192ac',
    score: 50,
    totalAnswers: 10,
    totalCorrectAnswers: 5,
    finishedAt: '2023-08-03T10:29:16.973Z',
    timeLimit: 1800,
    startedAt: '2023-08-03T10:28:48.326Z',
    createdAt: '2023-08-03T10:28:48.326Z',
    updatedAt: '2023-08-03T10:29:16.973Z',
    totalTimes: 6,
    content: {
      id: '54f4a2eb-034d-4e4e-8810-44744bffc87d',
      type: 'POST',
    },
  },
  meta: {
    message: 'OK',
  },
};

export const mockResponseSummary = {
    code: "api.ok",
    data: {
      contentId: "c3e104b4-86b9-4f0d-a649-3c2fc15a97fb",
      participants: {
        total: 1,
        pass: 1,
        fail: 0
      }
    },
    meta: {
      message: "OK"
    }
};

export const mockResponseUserParticipants = {
  code: "api.ok",
  data: {
    list: [
      {
        id: "222b7e3b-6c99-4c68-bb4f-02c6c54fe340",
        quizId: "119d1c2d-fc85-41df-bba7-231f876d91b1",
        createdAt: "2023-08-01T07:02:32.545Z",
        score: 100,
        status: "PASS",
        actor: {
          id: "7b63852c-5249-499a-a32b-6bdaa2761fc2",
          username: "trannamanh",
          fullname: "Nam Anh",
          email: "namanh@tgm.vn",
          avatar: "https://media.beincom.io/image/variants/user/avatar/1e65c01e-7916-46aa-b5a8-aeea19cfef97",
          isDeactivated: false,
          isVerified: false,
          showingBadges: [
            {
              id: "e939d0a7-3df8-4139-8522-5254bcb62ed1",
              name: "71",
              iconUrl: "https://media.beincom.io/image/variants/badge/81307d0c-4446-4dcf-9f5c-aa92c2decca6",
              community: {
                id: "b5c7a117-dcb8-47ba-9677-dc33da0320ba",
                name: "Root wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"
              }
            },
            ]
        }
      }
      ],
      meta: {
        startCursor: "eyJjcmVhdGVkQXQiOiIyMDIzLTA4LTAxVDA3OjAyOjMyLjU0NVoifQ==",
        endCursor: "eyJjcmVhdGVkQXQiOiIyMDIzLTA4LTAxVDA3OjAyOjMyLjU0NVoifQ==",
        hasNextPage: false,
        hasPreviousPage: false
      }
  },
  meta: {
    message: "OK"
  }
};

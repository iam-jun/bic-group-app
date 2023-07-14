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
      createdAt: '2023-06-29T08:37:43.927Z',
      updatedAt: '2023-06-29T08:38:39.825Z',
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
        question: 'Con mèo biết làm gì?',
        answers: [
          {
            id: '1234',
            answer: 'Biết bơi',
            isCorrect: false,
          },
          {
            id: '12345',
            answer: 'Biết sửa cơ điện',
            isCorrect: false,
          },
          {
            id: '123456',
            answer: 'Biết trèo cây',
            isCorrect: true,
          },
          {
            id: '1234567',
            answer: 'Biết lái ô tô',
            isCorrect: false,
          },
        ],
      },
      {
        id: '12345678',
        question: 'Mèo là động vật thuộc họ nào?',
        answers: [
          {
            id: '123456789',
            answer: 'Họ mèo',
            isCorrect: true,
          },
          {
            id: '12345678910',
            answer: 'Họ chó',
            isCorrect: false,
          },
          {
            id: '12345678911',
            answer: 'Họ báo',
            isCorrect: false,
          },
          {
            id: '12345678912',
            answer: 'Họ chuột',
            isCorrect: false,
          },
        ],
      },
      {
        id: '12345678913',
        question: 'Mèo có bao nhiêu chân?',
        answers: [
          {
            id: '12345678914',
            answer: '2 chân',
            isCorrect: false,
          },
          {
            id: '12345678915',
            answer: '3 chân',
            isCorrect: false,
          },
          {
            id: '12345678916',
            answer: '4 chân',
            isCorrect: true,
          },
          {
            id: '12345678917',
            answer: '5 chân',
            isCorrect: false,
          },
        ],
      },
      {
        id: '12345678918',
        question: 'Cây cau là loại cây gì?',
        answers: [
          {
            id: '12345678919',
            answer: 'Cây cỏ',
            isCorrect: false,
          },
          {
            id: '12345678920',
            answer: 'Cây hoa',
            isCorrect: false,
          },
          {
            id: '12345678921',
            answer: 'Cây thân gỗ',
            isCorrect: true,
          },
          {
            id: '12345678922',
            answer: 'Cây xương rồng',
            isCorrect: false,
          },
        ],
      },
      {
        id: '12345678923',
        question: 'Con mèo có móng vuốt dài hay ngắn?',
        answers: [
          {
            id: '12345678924',
            answer: 'Dài',
            isCorrect: true,
          },
          {
            id: '12345678925',
            answer: 'Ngắn',
            isCorrect: false,
          },
          {
            id: '12345678926',
            answer: 'Không có móng vuốt',
            isCorrect: false,
          },
          {
            id: '12345678927',
            answer: 'Móng vuốt giống chó',
            isCorrect: false,
          },
        ],
      },
      {
        id: '12345678928',
        question: 'Còn gọi mèo là gì?',
        answers: [
          {
            id: '12345678929',
            answer: 'Mèu',
            isCorrect: false,
          },
          {
            id: '12345678930',
            answer: 'Mỡ',
            isCorrect: false,
          },
          {
            id: '12345678931',
            answer: 'Móc',
            isCorrect: false,
          },
          {
            id: '12345678932',
            answer: 'Miu',
            isCorrect: true,
          },
        ],
      },
      {
        id: '12345678933',
        question: 'Mèo có ai thức ăn yêu thích?',
        answers: [
          {
            id: '12345678934',
            answer: 'Rau củ',
            isCorrect: false,
          },
          {
            id: '12345678935',
            answer: 'Hamburger',
            isCorrect: false,
          },
          {
            id: '12345678936',
            answer: 'Cà phê',
            isCorrect: false,
          },
          {
            id: '12345678937',
            answer: 'Cá',
            isCorrect: true,
          },
        ],
      },
      {
        id: '12345678938',
        question: 'Mèo là động vật hoang dã hay nuôi trong nhà?',
        answers: [
          {
            id: '12345678939',
            answer: 'Hoang dã',
            isCorrect: false,
          },
          {
            id: '12345678940',
            answer: 'Nhà',
            isCorrect: false,
          },
          {
            id: '12345678941',
            answer: 'Đều được',
            isCorrect: true,
          },
          {
            id: '12345678942',
            answer: 'Không thể xác định',
            isCorrect: false,
          },
        ],
      },
      {
        id: '12345678943',
        question: 'Mèo có màu lông gì?',
        answers: [
          {
            id: '12345678944',
            answer: 'Màu trắng',
            isCorrect: false,
          },
          {
            id: '12345678945',
            answer: 'Màu đen',
            isCorrect: false,
          },
          {
            id: '12345678946',
            answer: 'Màu nâu',
            isCorrect: false,
          },
          {
            id: '12345678947',
            answer: 'Tất cả các màu trên',
            isCorrect: true,
          },
        ],
      },
      {
        id: '12345678948',
        question: 'Con mèo có khả năng nào sau đây?',
        answers: [
          {
            id: '12345678949',
            answer: 'Bay',
            isCorrect: false,
          },
          {
            id: '12345678950',
            answer: 'Biết nói',
            isCorrect: false,
          },
          {
            id: '12345678951',
            answer: 'Nhảy cao',
            isCorrect: true,
          },
          {
            id: '12345678952',
            answer: 'Đói mãi không no',
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

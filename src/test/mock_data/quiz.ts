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
    content:
      '# Người dùng vẫn sạc smartphone qua đêm\nKhảo sát của Asus cho thấy người dùng thường xuyên sạc điện thoại qua đêm dù thói quen này được đánh giá gây hại cho thiết bị.\nAsus cho biết một nửa người dùng smartphone của hãng chọn sạc qua đêm, dù thiết bị đã có tính năng sạc nhanh. Trong đó, 25% bật Sạc ổn định - tính năng làm chậm tốc độ sạc để giảm nhiệt và kéo dài tuổi thọ pin; 26% bật Sạc theo lịch trình - chế độ trì hoãn việc sạc đầy 100% pin.Trang công nghệ _Android Authority_ cũng thực hiện khảo sát tương tự và có tới 66% người tham gia có thói quen cắm sạc thiết bị cả đêm.',
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

export const articleWithQuiz = {
  code: 'api.ok',
  data: {
    id: 'c3e104b4-86b9-4f0d-a649-3c2fc15a97fb',
    audience: {
      groups: [
        {
          id: 'c8ddd4d4-9a5e-4d93-940b-e332a8d0422d',
          name: 'Bein Community',
          icon: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-avatar.png',
          communityId: '15337361-1577-4b7b-a31d-990df06aa446',
          privacy: 'OPEN',
          rootGroupId: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
        },
      ],
    },
    content:
      '[{"type":"p","align":"start","children":[{"text":"Quá trình thắt chặt tiền tệ mạnh tay khiến giá euro hiện cao nhất 17 tháng so với đôla Mỹ và cao nhất 3 năm so với nhân dân tệ."}],"id":"AwYVxpTUJhpkBisgiFW2a"},{"type":"p","children":[{"text":"Tỷ giá danh nghĩa đa phương (NEER) – so sánh giá euro với tiền tệ các đối tác thương mại của khu vực đồng euro – hiện ở mức cao nhất lịch sử. Đồng tiền chung châu Âu cũng đang tiến sát đỉnh 3 năm so với nhân dân tệ. Tình hình này gây sức ép lên hoạt động xuất khẩu của khu vực trong bối cảnh cả kinh tế châu Âu và Trung Quốc đều đang trì trệ."}],"id":"cpVoK9llfFzYn2byaADH9"},{"type":"p","children":[{"text":"Mark Dragten – Giám đốc phụ trách tỷ giá hối đoái tại Insight Investment cho biết việc euro mạnh lên \\"chắc chắn\\" là mối lo ngại của Ngân hàng Trung ương châu Âu (ECB). \\"Châu Âu bán lượng hàng lớn sang Trung Quốc. Bạn sẽ phải băn khoăn về nhu cầu khi kinh tế Trung Quốc chậm lại\\", ông giải thích."}],"id":"oN3l0Aelr-ROYnnZbohRw"},{"type":"img","url":"https://i1-kinhdoanh.vnecdn.net/2023/07/24/euro-neer-1690169024-169016908-2561-3279-1690169416.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=y5BN0L0Hm8xZjLKXShKQZg","children":[{"text":""}],"id":"-SYXHtyoYaSc8K1jsA91E"},{"type":"p","align":"left","children":[{"text":"Tỷ giá danh nghĩa đa phương của euro hiện ở mức cao nhất đến nay. Đồ thị: "},{"text":"Bloomberg, ECB","italic":true}],"id":"_iNxt2g8APoN4ozmyklYa"},{"type":"p","children":[{"text":"Dù ECB còn đánh giá nhiều chỉ số khác về tiền tệ ngoài NEER, sức tăng của đồng tiền chung châu Âu đã bắt đầu thu hút sự chú ý. Euro hiện giao dịch quanh đỉnh 17 tháng so với USD. Giá euro đã tăng 18% so với đôla Mỹ kể từ khi "},{"type":"a","url":"https://vnexpress.net/kinh-doanh/euro-ngang-gia-usd-lan-dau-sau-20-nam-4486873.html","target":"_blank","children":[{"text":"ngang giá"}],"id":"GJfUQ_-mJdU5q8W8QdYOk"},{"text":" với tiền tệ này tháng 9 năm ngoái. Nguyên nhân là ECB đang thực hiện quá trình thắt chặt tiền tệ mạnh tay nhất lịch sử. Euro cũng mạnh lên đáng kể so với yen và gần đây tăng vọt so với bảng Anh."}],"id":"b8nPuuU32PMYlv3piAkLX"},{"type":"p","children":[{"text":"Tuy nhiên, biểu đồ kỹ thuật cho thấy euro đang bị mua vào quá mạnh tay. Một vài chỉ số phát tín hiệu đồng tiền này sẽ sớm quay đầu giảm."}],"id":"sg76EbZd_7EJuJjPz8MCq"},{"type":"p","children":[{"text":"Quan chức ECB sẽ có cuộc họp vào thứ Năm tuần này. Nếu Chủ tịch ECB Christine Lagarde nới lỏng quan điểm về cuộc chiến chống lãi suất, giá euro có thể giảm, tương tự bảng Anh. Đà tăng của bảng Anh tuần trước đã chậm lại, sau số liệu cho thấy lạm phát bất ngờ hạ nhiệt trong tháng 6."}],"id":"EYHFDNkbbAn-eEtN2o1RF"},{"type":"p","children":[{"text":"\\"Euro và bảng đều đang có giá cao hơn giá trị thực\\", Brad Bechtel – chiến lược gia tại Jefferies cho biết. Ông dự báo giá euro sẽ giảm về 1,108 USD, từ mức 1,111 USD cuối tuần trước. Các nhà phân tích trong khảo sát của Bloomber cũng cho rằng giá một euro sẽ xuống 1,1 USD tháng 9 năm nay."}],"id":"YySP08EkTSIO0cEjGNWEL"},{"type":"p","children":[{"text":"\\"Việc euro lên đỉnh 17 tháng so với USD chủ yếu do nhu cầu quyền chọn, vì các yếu tố vĩ mô nền tảng không có gì thay đổi. Thị trường không còn phản ứng quá đà với kỳ vọng Fed ngừng tăng lãi. Vì thế, euro sẽ cần chất xúc tác mới nếu muốn tiếp tục xu hướng tăng\\", Vassilis Karamanis – chiến lược gia ngoại hối tại Bloomberg nhận định."}],"id":"kqXTAMuyhl2ZzKVwuufZR"},{"type":"p","children":[{"text":"John Hardy – Giám đốc Chiến lược Ngoại hối tại Saxo Bank cho biết việc euro mạnh lên có thể xuất hiện trong thông điệp của ECB tuần này. \\"ECB có thể lo ngại và thông báo đây là một rủi ro với tăng trưởng kinh tế của khối này\\", ông dự báo."}],"id":"DcfvPVaOlPKdh5maJ3haX"},{"type":"p","children":[{"text":"ECB được kỳ vọng nâng lãi suất tham chiếu thêm 25 điểm cơ bản (0,25%), lên 3,75% tuần này. Nhà đầu tư cũng sẽ theo sát các phát biểu của bà Lagarde để có thêm manh mối về khả năng nâng lãi tháng 9."}],"id":"dSSZTe-jbfwr6MzGGX6FA"},{"type":"p","children":[{"text":"Các số liệu gần đây của khu vực đồng euro không đạt dự báo, trái ngược với Mỹ. Tuần này, giới chức sẽ có thêm thông tin để ra chính sách kinh tế, khi chỉ số giá sản xuất (PMI) của Pháp, Đức và eurozone được công bố. GDP quý II của Pháp và chỉ số đánh giá niềm tin doanh nghiệp tại Đức cũng được quan tâm. Fed cũng sẽ họp chính sách trong hai ngày 25 và 26/7."}],"id":"w6veApQOKi-NskBOVoumt"},{"type":"p","children":[{"text":"\\"Phép thử lớn vẫn là khả năng tăng trưởng của châu Âu. Các nền kinh tế này cần cho thấy sự sôi động nhiều hơn nữa\\", Kit Juckes – chiến lược gia tiền tệ tại Societe Generale kết luận."}],"id":"plnEsfJoiImP9YmM5xUTK"}]',
    createdAt: '2023-07-24T07:23:59.216Z',
    publishedAt: '2023-07-24T07:24:58.106Z',
    scheduledAt: null,
    tags: [
      {
        id: '20588f61-4bbb-45dd-9c66-16b6c00d9540',
        name: 'HUMKI',
        groupId: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
        slug: 'humki',
        createdBy: '123',
        updatedBy: '123',
        totalUsed: 0,
      },
    ],
    series: [
      {
        id: '68f26a25-1413-44ba-8de6-4813c99f9f33',
        title: 'test add article co 3 series',
      },
    ],
    quiz: {
      id: '119d1c2d-fc85-41df-bba7-231f876d91b1',
      title: 'Test taking quiz article',
      description: 'Naha Naha Naha Naha',
      status: 'PUBLISHED',
      genStatus: 'PROCESSED',
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
    ],
    actor: {
      id: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
      username: 'trannamanh',
      fullname: 'Nam Anh',
      email: 'namanh@tgm.vn',
      avatar:
        'https://media.beincom.io/image/variants/user/avatar/1e65c01e-7916-46aa-b5a8-aeea19cfef97',
      isDeactivated: false,
      isVerified: false,
      showingBadges: [
        {
          id: 'e939d0a7-3df8-4139-8522-5254bcb62ed1',
          name: '71',
          iconUrl:
            'https://media.beincom.io/image/variants/badge/81307d0c-4446-4dcf-9f5c-aa92c2decca6',
          community: {
            id: 'b5c7a117-dcb8-47ba-9677-dc33da0320ba',
            name: 'Root wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
          },
        },
        {
          id: 'da3f7113-49d5-4e6c-b296-adc3dc178ed6',
          name: 'Anti Mage hahahaha',
          iconUrl:
            'https://media.beincom.io/image/variants/badge/4192a6e7-09c0-43de-a053-8cfabb482bfd',
          community: {
            id: '656cebfe-1b91-473f-97fd-96837bf9e2a5',
            name: 'Community của Bảo gất là dễ thương nuôn',
          },
        },
      ],
    },
    status: 'PUBLISHED',
    title: 'test article choi nha',
    summary: '123asd',
    type: 'ARTICLE',
    privacy: 'OPEN',
    setting: {
      isImportant: false,
      importantExpiredAt: null,
      canComment: true,
      canReact: true,
    },
    commentsCount: 0,
    totalUsersSeen: 1,
    markedReadPost: false,
    isSaved: false,
    isReported: false,
    reactionsCount: [
      {
        mask: 1,
      },
    ],
    ownerReactions: [],
    wordCount: 730,
    coverMedia: {
      id: 'f247ffc0-b0a9-4fcb-898e-24e6dc6c4a33',
      src: '/image/variants/article/cover/f247ffc0-b0a9-4fcb-898e-24e6dc6c4a33',
      url: 'https://media.beincom.io/image/variants/article/cover/f247ffc0-b0a9-4fcb-898e-24e6dc6c4a33',
      width: 736,
      height: 1102,
      status: 'DONE',
      mimeType: 'image/jpeg',
      resource: 'article:cover',
      createdBy: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
    },
    categories: [
      {
        id: '2bbb37b8-37e9-4b3d-adc3-4e401bfc0e39',
        name: 'Outdoors',
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
        content:
          'Trong CA, User Interface có chứa logic nghiệp vụ phức tạp không?',
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
        content:
          'Trong kiến trúc Clean Architecture (CA), ứng dụng được chia thành bao nhiêu thành phần chính?',
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
  code: 'api.ok',
  data: {
    contentId: 'c3e104b4-86b9-4f0d-a649-3c2fc15a97fb',
    participants: {
      total: 1,
      pass: 1,
      fail: 0,
    },
  },
  meta: {
    message: 'OK',
  },
};

export const mockResponseUserParticipants = {
  code: 'api.ok',
  data: {
    list: [
      {
        id: '222b7e3b-6c99-4c68-bb4f-02c6c54fe340',
        quizId: '119d1c2d-fc85-41df-bba7-231f876d91b1',
        createdAt: '2023-08-01T07:02:32.545Z',
        score: 100,
        status: 'PASS',
        actor: {
          id: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
          username: 'trannamanh',
          fullname: 'Nam Anh',
          email: 'namanh@tgm.vn',
          avatar:
            'https://media.beincom.io/image/variants/user/avatar/1e65c01e-7916-46aa-b5a8-aeea19cfef97',
          isDeactivated: false,
          isVerified: false,
          showingBadges: [
            {
              id: 'e939d0a7-3df8-4139-8522-5254bcb62ed1',
              name: '71',
              iconUrl:
                'https://media.beincom.io/image/variants/badge/81307d0c-4446-4dcf-9f5c-aa92c2decca6',
              community: {
                id: 'b5c7a117-dcb8-47ba-9677-dc33da0320ba',
                name: 'Root wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
              },
            },
          ],
        },
      },
    ],
    meta: {
      startCursor: 'eyJjcmVhdGVkQXQiOiIyMDIzLTA4LTAxVDA3OjAyOjMyLjU0NVoifQ==',
      endCursor: 'eyJjcmVhdGVkQXQiOiIyMDIzLTA4LTAxVDA3OjAyOjMyLjU0NVoifQ==',
      hasNextPage: false,
      hasPreviousPage: false,
    },
  },
  meta: {
    message: 'OK',
  },
};

export const mockCreateQuestionQuizResponse = {
  code: 'api.ok',
  data: {
    id: 'a08a1775-769d-49fe-a8db-6a2729575135',
    content: 'r',
    answers: [
      {
        id: '895b42be-b89e-4af3-9a3d-8b312191c17d',
        content: 'c',
        isCorrect: false,
      },
      {
        id: '376953f6-8a3f-496a-a316-f99b45e71380',
        content: 'v',
        isCorrect: true,
      },
    ],
  },
  meta: {
    message: 'Created question successfully',
  },
};

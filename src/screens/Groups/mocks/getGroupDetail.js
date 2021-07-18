const mockGetGroupDetail = {
  code: 200,
  data: {
    id: 1678,
    name: 'Bein Community Child of Child 1',
    userCount: 888,
    icon: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
    cover: 'https://i.ibb.co/1RjNVC1/cover-evol.png',
    description:
      'Tech People Working on Bein platform\n' +
      '\n' +
      'Đây là Text và hình ảnh. Erat sed có quá nhiều vấn đề sắc tộc ipsum vel quis quam. Nunc etiam dui tortor, non in aliquam lacinia tempor.\n' +
      'Sed vel turpis adipiscing penatibus orci neque. Erat sed fermentum ipsum vel quis quam. Nunc etiam dui tortor, non in',
    children: [
      {
        id: 16789,
        name: 'Bein Community Core Team',
        userCount: 99,
        icon: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
        children: [],
      },
    ],
    parent: {
      id: 167,
      name: 'Bein Community Child 1',
      parent: {
        id: 16,
        name: 'Bein Community',
        parent: {
          id: 14,
          name: 'Bein',
        },
      },
    },
  },
};

export default mockGetGroupDetail;

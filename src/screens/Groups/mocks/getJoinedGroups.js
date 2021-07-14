const mockGetJoinedGroups = {
    code: 200,
    data: [
        {
            id: 14,
            name: "Bein",
            userCount: 555555,
            icon: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
            children: [
                {
                    id: 16,
                    name: 'Bein Community',
                    userCount: 66666,
                    icon: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
                    children: [
                        {
                            id: 167,
                            name: 'Bein Community Child 1',
                            userCount: 7777,
                            icon: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
                            children: [
                                {
                                    id: 1678,
                                    name: 'Bein Community Child of Child 1',
                                    userCount: 888,
                                    icon: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
                                    children: [
                                        {
                                            id: 16789,
                                            name: 'Bein Community Core Team',
                                            userCount: 99,
                                            icon: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
                                            children: [],
                                        }
                                    ],
                                }
                            ],
                        },
                        {
                            id: 116,
                            name: 'Bein Community Child 2',
                            userCount: 1903,
                            icon: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
                            children: [],
                        }
                    ],
                }
            ],
        }
    ],
}

export default mockGetJoinedGroups;

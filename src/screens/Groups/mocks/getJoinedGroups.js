const mockGetJoinedGroups = {
    code: 200,
    data: [
        {
            id: 14,
            name: "Bein",
            parentId: null,
            userCount: 3,
            icon: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
            children: [ //children
                {
                    id: 16,
                    name: 'Bein Community',
                    parentId: 14,
                    userCount: 2,
                    icon: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
                    children: [
                        {
                            id: 116,
                            name: 'Bein Community Child 1',
                            parentId: 16,
                            userCount: 2,
                            icon: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
                            children: [
                                {
                                    id: 1116,
                                    name: 'Bein Community Child of Child 1',
                                    parentId: 116,
                                    userCount: 2,
                                    icon: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
                                    children: [],
                                }
                            ],
                        },
                        {
                            id: 117,
                            name: 'Bein Community Child 2',
                            parentId: 16,
                            userCount: 2,
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

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
                    icon: 'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg?compress=1&resize=800x600',
                    children: [
                        {
                            id: 167,
                            name: 'Bein Community Child 1',
                            userCount: 7777,
                            icon: 'https://cdn.dribbble.com/users/81809/screenshots/3460827/vegeta.jpg',
                            children: [
                                {
                                    id: 1678,
                                    name: 'Bein Community Child of Child 1',
                                    userCount: 888,
                                    icon: 'https://cdn.dribbble.com/users/81809/screenshots/3460812/ultimategohan.jpg',
                                    children: [
                                        {
                                            id: 16789,
                                            name: 'Bein Community Core Team',
                                            userCount: 99,
                                            icon: 'https://cdn.dribbble.com/users/81809/screenshots/3347540/gokussj.jpg?compress=1&resize=400x300',
                                            children: [
                                                {
                                                    id: 167890,
                                                    name: 'Bein Community Core Team Leader',
                                                    userCount: 9,
                                                    icon: 'https://cdn.dribbble.com/users/81809/screenshots/3460820/supervegito.jpg',
                                                    children: [
                                                        {
                                                            id: 1678901,
                                                            name: 'Bein Community Core Team Super Saiyan',
                                                            userCount: 5,
                                                            icon: 'https://cdn.dribbble.com/users/81809/screenshots/3448762/vegitoblue.jpg?compress=1&resize=800x600',
                                                            children: [
                                                                {
                                                                    id: 16789012,
                                                                    name: 'Bein Community Core Super Saiyan God Green Blue Black White',
                                                                    userCount: 3,
                                                                    icon: 'https://cdn.dribbble.com/users/81809/screenshots/3443452/ssg-goku.jpg?compress=1&resize=800x600',
                                                                    children: [],
                                                                }
                                                            ],
                                                        }
                                                    ],
                                                }
                                            ],
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

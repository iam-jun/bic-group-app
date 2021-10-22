const locations = [
  {
    name: 'An Giang',
    type: 'province',
    name_with_type: 'Tỉnh An Giang',
    country: 'Việt Nam',
  },
  {
    name: 'Bà Rịa - Vũng Tàu',
    type: 'province',
    name_with_type: 'Tỉnh Bà Rịa - Vũng Tàu',
    country: 'Việt Nam',
  },
  {
    name: 'Bình Dương',
    type: 'province',
    name_with_type: 'Tỉnh Bình Dương',
    country: 'Việt Nam',
  },
  {
    name: 'Bình Phước',
    type: 'province',
    name_with_type: 'Tỉnh Bình Phước',
    country: 'Việt Nam',
  },
  {
    name: 'Bình Thuận',
    type: 'province',
    name_with_type: 'Tỉnh Bình Thuận',
    country: 'Việt Nam',
  },
  {
    name: 'Bình Định',
    type: 'province',
    name_with_type: 'Tỉnh Bình Định',
    country: 'Việt Nam',
  },
  {
    name: 'Bạc Liêu',
    type: 'province',
    name_with_type: 'Tỉnh Bạc Liêu',
    country: 'Việt Nam',
  },
  {
    name: 'Bắc Giang',
    type: 'province',
    name_with_type: 'Tỉnh Bắc Giang',
    country: 'Việt Nam',
  },
  {
    name: 'Bắc Kạn',
    type: 'province',
    name_with_type: 'Tỉnh Bắc Kạn',
    country: 'Việt Nam',
  },
  {
    name: 'Bắc Ninh',
    type: 'province',
    name_with_type: 'Tỉnh Bắc Ninh',
    country: 'Việt Nam',
  },
  {
    name: 'Bến Tre',
    type: 'province',
    name_with_type: 'Tỉnh Bến Tre',
    country: 'Việt Nam',
  },
  {
    name: 'Cao Bằng',
    type: 'province',
    name_with_type: 'Tỉnh Cao Bằng',
    country: 'Việt Nam',
  },
  {
    name: 'Cà Mau',
    type: 'province',
    name_with_type: 'Tỉnh Cà Mau',
    country: 'Việt Nam',
  },
  {
    name: 'Cần Thơ',
    type: 'city',
    name_with_type: 'Thành phố Cần Thơ',
    country: 'Việt Nam',
  },
  {
    name: 'Điện Biên',
    type: 'province',
    name_with_type: 'Tỉnh Điện Biên',
    country: 'Việt Nam',
  },
  {
    name: 'Đà Nẵng',
    type: 'city',
    name_with_type: 'Thành phố Đà Nẵng',
    country: 'Việt Nam',
  },
  {
    name: 'Đắk Lắk',
    type: 'province',
    name_with_type: 'Tỉnh Đắk Lắk',
    country: 'Việt Nam',
  },
  {
    name: 'Đắk Nông',
    type: 'province',
    name_with_type: 'Tỉnh Đắk Nông',
    country: 'Việt Nam',
  },
  {
    name: 'Đồng Nai',
    type: 'province',
    name_with_type: 'Tỉnh Đồng Nai',
    country: 'Việt Nam',
  },
  {
    name: 'Đồng Tháp',
    type: 'province',
    name_with_type: 'Tỉnh Đồng Tháp',
    country: 'Việt Nam',
  },
  {
    name: 'Gia Lai',
    type: 'province',
    name_with_type: 'Tỉnh Gia Lai',
    country: 'Việt Nam',
  },
  {
    name: 'Hoà Bình',
    type: 'province',
    name_with_type: 'Tỉnh Hoà Bình',
    country: 'Việt Nam',
  },
  {
    name: 'Hà Giang',
    type: 'province',
    name_with_type: 'Tỉnh Hà Giang',
    country: 'Việt Nam',
  },
  {
    name: 'Hà Nam',
    type: 'province',
    name_with_type: 'Tỉnh Hà Nam',
    country: 'Việt Nam',
  },
  {
    name: 'Hà Nội',
    type: 'city',
    name_with_type: 'Thành phố Hà Nội',
    country: 'Việt Nam',
  },
  {
    name: 'Hà Tĩnh',
    type: 'province',
    name_with_type: 'Tỉnh Hà Tĩnh',
    country: 'Việt Nam',
  },
  {
    name: 'Hưng Yên',
    type: 'province',
    name_with_type: 'Tỉnh Hưng Yên',
    country: 'Việt Nam',
  },
  {
    name: 'Hải Dương',
    type: 'province',
    name_with_type: 'Tỉnh Hải Dương',
    country: 'Việt Nam',
  },
  {
    name: 'Hải Phòng',
    type: 'city',
    name_with_type: 'Thành phố Hải Phòng',
    country: 'Việt Nam',
  },
  {
    name: 'Hậu Giang',
    type: 'province',
    name_with_type: 'Tỉnh Hậu Giang',
    country: 'Việt Nam',
  },
  {
    name: 'Hồ Chí Minh',
    type: 'city',
    name_with_type: 'Thành phố Hồ Chí Minh',
    country: 'Việt Nam',
  },
  {
    name: 'Khánh Hòa',
    type: 'province',
    name_with_type: 'Tỉnh Khánh Hòa',
    country: 'Việt Nam',
  },
  {
    name: 'Kiên Giang',
    type: 'province',
    name_with_type: 'Tỉnh Kiên Giang',
    country: 'Việt Nam',
  },
  {
    name: 'Kon Tum',
    type: 'province',
    name_with_type: 'Tỉnh Kon Tum',
    country: 'Việt Nam',
  },
  {
    name: 'Lai Châu',
    type: 'province',
    name_with_type: 'Tỉnh Lai Châu',
    country: 'Việt Nam',
  },
  {
    name: 'Long An',
    type: 'province',
    name_with_type: 'Tỉnh Long An',
    country: 'Việt Nam',
  },
  {
    name: 'Lào Cai',
    type: 'province',
    name_with_type: 'Tỉnh Lào Cai',
    country: 'Việt Nam',
  },
  {
    name: 'Lâm Đồng',
    type: 'province',
    name_with_type: 'Tỉnh Lâm Đồng',
    country: 'Việt Nam',
  },
  {
    name: 'Lạng Sơn',
    type: 'province',
    name_with_type: 'Tỉnh Lạng Sơn',
    country: 'Việt Nam',
  },
  {
    name: 'Nam Định',
    type: 'province',
    name_with_type: 'Tỉnh Nam Định',
    country: 'Việt Nam',
  },
  {
    name: 'Nghệ An',
    type: 'province',
    name_with_type: 'Tỉnh Nghệ An',
    country: 'Việt Nam',
  },
  {
    name: 'Ninh Bình',
    type: 'province',
    name_with_type: 'Tỉnh Ninh Bình',
    country: 'Việt Nam',
  },
  {
    name: 'Ninh Thuận',
    type: 'province',
    name_with_type: 'Tỉnh Ninh Thuận',
    country: 'Việt Nam',
  },
  {
    name: 'Phú Thọ',
    type: 'province',
    name_with_type: 'Tỉnh Phú Thọ',
    country: 'Việt Nam',
  },
  {
    name: 'Phú Yên',
    type: 'province',
    name_with_type: 'Tỉnh Phú Yên',
    country: 'Việt Nam',
  },
  {
    name: 'Quảng Bình',
    type: 'province',
    name_with_type: 'Tỉnh Quảng Bình',
    country: 'Việt Nam',
  },
  {
    name: 'Quảng Nam',
    type: 'province',
    name_with_type: 'Tỉnh Quảng Nam',
    country: 'Việt Nam',
  },
  {
    name: 'Quảng Ngãi',
    type: 'province',
    name_with_type: 'Tỉnh Quảng Ngãi',
    country: 'Việt Nam',
  },
  {
    name: 'Quảng Ninh',
    type: 'province',
    name_with_type: 'Tỉnh Quảng Ninh',
    country: 'Việt Nam',
  },
  {
    name: 'Quảng Trị',
    type: 'province',
    name_with_type: 'Tỉnh Quảng Trị',
    country: 'Việt Nam',
  },
  {
    name: 'Singapore',
    type: 'country',
    name_with_type: 'Singapore',
    country: 'Singapore',
  },
  {
    name: 'Sóc Trăng',
    type: 'province',
    name_with_type: 'Tỉnh Sóc Trăng',
    country: 'Việt Nam',
  },
  {
    name: 'Sơn La',
    type: 'province',
    name_with_type: 'Tỉnh Sơn La',
    country: 'Việt Nam',
  },
  {
    name: 'Thanh Hóa',
    type: 'province',
    name_with_type: 'Tỉnh Thanh Hóa',
    country: 'Việt Nam',
  },
  {
    name: 'Thái Bình',
    type: 'province',
    name_with_type: 'Tỉnh Thái Bình',
    country: 'Việt Nam',
  },
  {
    name: 'Thái Nguyên',
    type: 'province',
    name_with_type: 'Tỉnh Thái Nguyên',
    country: 'Việt Nam',
  },
  {
    name: 'Thừa Thiên Huế',
    type: 'province',
    name_with_type: 'Tỉnh Thừa Thiên Huế',
    country: 'Việt Nam',
  },
  {
    name: 'Tiền Giang',
    type: 'province',
    name_with_type: 'Tỉnh Tiền Giang',
    country: 'Việt Nam',
  },
  {
    name: 'Trà Vinh',
    type: 'province',
    name_with_type: 'Tỉnh Trà Vinh',
    country: 'Việt Nam',
  },
  {
    name: 'Tuyên Quang',
    type: 'province',
    name_with_type: 'Tỉnh Tuyên Quang',
    country: 'Việt Nam',
  },
  {
    name: 'Tây Ninh',
    type: 'province',
    name_with_type: 'Tỉnh Tây Ninh',
    country: 'Việt Nam',
  },
  {
    name: 'USA',
    type: 'country',
    name_with_type: 'USA',
    country: 'USA',
  },
  {
    name: 'Việt Nam',
    type: 'country',
    name_with_type: 'Việt Nam',
    country: 'Việt Nam',
  },
  {
    name: 'Vĩnh Long',
    type: 'province',
    name_with_type: 'Tỉnh Vĩnh Long',
    country: 'Việt Nam',
  },
  {
    name: 'Vĩnh Phúc',
    type: 'province',
    name_with_type: 'Tỉnh Vĩnh Phúc',
    country: 'Việt Nam',
  },
  {
    name: 'Yên Bái',
    type: 'province',
    name_with_type: 'Tỉnh Yên Bái',
    country: 'Việt Nam',
  },
];

export default locations;

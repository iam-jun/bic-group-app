export const allMarkdown = `
Hello everyone, this is a post about markdown in @[g:1:EVOL Community]

Heading

  # h1 Heading
  ## h2 Heading
  ### h3 Heading
  #### h4 Heading
  ##### h5 Heading
  ###### h6 Heading

Custom regex audience

Emoji

:wink: :) :) :uruguay: >:( :angry: :explosive_meltdown::congratulations_party::fake_happy::pleading_cute::scare_frightened::stunned_wow::worry_sad::greedy_money:

raw text of emoji:
\`\`\`
:wink: :) :) :uruguay: >:( :angry: :explosive_meltdown::congratulations_party::fake_happy::pleading_cute::scare_frightened::stunned_wow::worry_sad::greedy_money:
\`\`\`

Horizontal Rules

  Some text above
  ___

  Some text in the middle

  ---

  Some text below


Emphasis

  **This is bold text**

  __This is bold text__

  *This is italic text*

  _This is italic text_

  ~~Strikethrough~~


Blockquotes

  > Blockquotes can also be nested...
  >> ...by using additional greater-than signs right next to each other...
  > > > ...or with spaces between arrows.


Lists

  Unordered

  + Create a list by starting a line with \`+\`, \`-\`, or \`*\`
  + Sub-lists are made by indenting 2 spaces:
    - Marker character change forces new list start:
      * Ac tristique libero volutpat at
      + Facilisis in pretium nisl aliquet. This is a very long list item that will surely wrap onto the next line.
      - Nulla volutpat aliquam velit
  + Very easy!

  Ordered

  1. Lorem ipsum dolor sit amet
  2. Consectetur adipiscing elit. This is a very long list item that will surely wrap onto the next line.
  3. Integer molestie lorem at massa

  Start numbering with offset:

  57. foo
  58. bar


\`\`\`
Sample
text
here
...
\`\`\`


Links

  [link text](https://www.google.com)

  [link with title](https://www.google.com "title text!")

  Autoconverted link https://www.google.com (enable linkify to see)


Images

  ![Pokemon1](https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg)
  ![Pokemon2](https://cdn.dribbble.com/users/183984/screenshots/2565088/pokemon_2.jpg "Pokemon 2")
  ![Pokemon3](https://cdn.dribbble.com/users/183984/screenshots/2569843/pokemon_3.jpg "Pokemon 3")

  Like links, Images also have a footnote style syntax

  ![Alt text][id]

  With a reference later in the document defining the URL location:

  [id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"
  
### Bein Core Team

  |  Id | Username    | Name             |
  | --- | ----------- | ---------------- |
  |  1  | khoattd     | Trần Đăng Khoa   |
  |  2  | vinc        | Nhâm Chấn Vĩ     |
  |  3  | thanct      | Cao Trọng Thân   |
  |  4  | tronghm     | Hoàng Minh Trọng |
  |  5  | nhutdh      | Dương Hoàng Nhựt |
  |  6  | hoangle     | Lê Hoàng         |
  |  7  | khanhhp     | Huỳnh Phương Khanh|
  |  8  | thudlm      | Diệp Lâm Minh Thư|
  |  9  | anhtn       | Trần Nam Anh     |
  |  10 | thienna     | Nguyễn Anh Thiện |
  |  11 | khoibn      | Bùi Nhật Khôi    |
  |  12 | nhanlx      | Nhân Long Xuyên  |
  |  13 | nhanvt      | Ốc Hu Mần        |
  |  14 | toannv      | Nguyễn Văn Toàn  |
  |  15 | trangha     | Hà Phạm Diễm Trang|
  |  16 | anhnm       | Nguyễn Minh Anh   |

`;

export const table = `
Tables

  | Option | Description |
  | ------ | ----------- |
  | data   | path to data files to supply the data that will be passed into templates. |
  | engine | engine to be used for processing templates. Handlebars is the default. |
  | ext    | extension to be used for dest files. |

  Right aligned columns

  | Option | Description |
  | ------:| -----------:|
  | data   | path to data files to supply the data that will be passed into templates. |
  | engine | engine to be used for processing templates. Handlebars is the default. |
  | ext    | extension to be used for dest files. |
`;

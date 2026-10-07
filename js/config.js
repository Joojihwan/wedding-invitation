/**
 * 청첩장 데이터 설정 파일
 * 이 파일만 수정하면 청첩장 내용이 바뀝니다.
 * (카카오톡 미리보기 문구/이미지는 index.html 상단 <meta> 태그도 함께 수정하세요)
 */
window.WEDDING = {
  // 배포 URL (공유 기능에 사용)
  siteUrl: "https://joojihwan.github.io/wedding-invitation/",

  groom: {
    name: "김민준",
    firstName: "민준",
    relation: "장남",
    phone: "010-1234-5678",
    father: { name: "김영호", phone: "010-1111-2222", deceased: false },
    mother: { name: "박미경", phone: "010-3333-4444", deceased: false },
  },
  bride: {
    name: "이서연",
    firstName: "서연",
    relation: "장녀",
    phone: "010-8765-4321",
    father: { name: "이정훈", phone: "010-5555-6666", deceased: false },
    mother: { name: "최은숙", phone: "010-7777-8888", deceased: false },
  },

  // 예식 일시 (24시간제, 한국 시간)
  date: "2027-05-15T12:30:00+09:00",

  venue: {
    name: "라온웨딩홀",
    hall: "3층 그랜드홀",
    address: "서울특별시 강남구 테헤란로 123",
    tel: "02-123-4567",
    lat: 37.5045,
    lng: 127.049,
    transport: [
      { title: "지하철", lines: ["2호선 · 수인분당선 선릉역 5번 출구 도보 5분"] },
      { title: "버스", lines: ["간선 146, 341, 360 · 지선 4412", "‘선릉역’ 정류장 하차"] },
      { title: "자가용", lines: ["건물 지하 주차장 2시간 무료", "주차 공간이 협소하니 대중교통을 이용해 주세요"] },
    ],
  },

  greeting: {
    title: "소중한 분들을 초대합니다",
    message:
      "서로가 마주보며 다져온 사랑을\n이제 함께 한 곳을 바라보며\n걸어갈 수 있는 큰 사랑으로 키우고자 합니다.\n\n저희 두 사람이 사랑의 이름으로\n지켜나갈 수 있게 앞날을\n축복해 주시면 감사하겠습니다.",
  },

  // 대표 사진 & 갤러리 (images 폴더에 사진을 넣고 경로를 바꾸세요)
  coverImage: "images/cover.svg",
  gallery: [
    "images/gallery/01.svg",
    "images/gallery/02.svg",
    "images/gallery/03.svg",
    "images/gallery/04.svg",
    "images/gallery/05.svg",
    "images/gallery/06.svg",
    "images/gallery/07.svg",
    "images/gallery/08.svg",
    "images/gallery/09.svg",
    "images/gallery/10.svg",
    "images/gallery/11.svg",
    "images/gallery/12.svg",
  ],
  galleryPreviewCount: 9,

  // 마음 전하실 곳
  accounts: {
    groom: [
      { role: "신랑", name: "김민준", bank: "국민은행", number: "123456-01-234567", kakaopay: "" },
      { role: "신랑 아버지", name: "김영호", bank: "신한은행", number: "110-123-456789" },
      { role: "신랑 어머니", name: "박미경", bank: "우리은행", number: "1002-123-456789" },
    ],
    bride: [
      { role: "신부", name: "이서연", bank: "카카오뱅크", number: "3333-01-2345678", kakaopay: "" },
      { role: "신부 아버지", name: "이정훈", bank: "농협은행", number: "302-1234-5678-91" },
      { role: "신부 어머니", name: "최은숙", bank: "하나은행", number: "123-456789-01234" },
    ],
  },

  // 카카오톡 공유: https://developers.kakao.com 에서 앱 생성 후 JavaScript 키 입력
  // (플랫폼 > Web 에 GitHub Pages 도메인 등록 필요). 비워두면 버튼이 링크 공유로 동작합니다.
  kakao: {
    jsKey: "",
    shareImage: "images/og.jpg",
  },

  // 배경음악 (예: "audio/bgm.mp3"). 비워두면 버튼이 표시되지 않습니다.
  bgm: "",

  // 벚꽃잎 떨어지는 효과
  petals: true,
};

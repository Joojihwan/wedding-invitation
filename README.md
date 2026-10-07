# 모바일 청첩장

빌드 과정 없는 정적(HTML/CSS/JS) 모바일 청첩장 템플릿입니다. GitHub Pages로 바로 배포할 수 있습니다.

배포 주소: https://joojihwan.github.io/wedding-invitation/

## 구성

| 섹션 | 내용 |
| --- | --- |
| 커버 | 날짜, 대표 사진, 신랑·신부 이름, 예식 정보 |
| 인사말 | 초대 문구, 혼주 소개(故 표시 지원), 전화/문자 연락하기 |
| 예식 일시 | 달력, 실시간 카운트다운, D-day |
| 갤러리 | 3열 그리드, 더보기, 라이트박스(스와이프/키보드) |
| 오시는 길 | 지도, 네이버지도·카카오맵·티맵 길안내, 주소 복사, 교통편 |
| 마음 전하실 곳 | 신랑측/신부측 계좌 아코디언, 계좌번호 복사, 카카오페이 링크 |
| 공유 | 카카오톡 공유(키 설정 시), 링크 복사 |
| 기타 | 꽃잎 효과, 배경음악(선택), 스크롤 등장 애니메이션 |

## 내용 수정

1. **`js/config.js`** — 이름, 혼주, 날짜, 장소, 좌표, 교통편, 인사말, 계좌, 사진 경로 등 모든 데이터.
2. **`index.html` 상단 `<meta>`** — 카카오톡/SNS 링크 미리보기 제목·설명·이미지. 크롤러는 JS를 실행하지 않으므로 직접 수정해야 합니다.
3. **`images/`** — `cover.svg`, `gallery/*.svg`는 임시 이미지입니다. 실제 사진(jpg 권장, 장당 500KB 이하로 압축)으로 교체하고 `config.js` 경로를 맞춰 주세요. `og.jpg`(1200×630)는 링크 미리보기 이미지입니다.

예식장 좌표(`lat`, `lng`)는 네이버/카카오/구글 지도에서 장소를 우클릭하면 확인할 수 있습니다.

## 카카오톡 공유 설정 (선택)

1. https://developers.kakao.com 에서 애플리케이션 생성
2. 앱 설정 → 플랫폼 → Web → 사이트 도메인에 `https://joojihwan.github.io` 등록
3. JavaScript 키를 `config.js`의 `kakao.jsKey`에 입력

키가 없으면 버튼은 기기 공유 시트(Web Share API) 또는 링크 복사로 동작합니다.

## 로컬 미리보기

```bash
python -m http.server 8080
```

브라우저에서 http://localhost:8080 접속.

## GitHub Pages 배포

1. 저장소 → **Settings → Pages**
2. Source: **Deploy from a branch**, Branch: **release** / **(root)** → Save
3. 작업은 `dev`에서 하고, `release`로 PR을 머지하면 배포됩니다. 1~2분 후 https://joojihwan.github.io/wedding-invitation/ 에서 확인

> 카카오톡은 미리보기를 캐시합니다. 메타 정보를 바꾼 뒤에는 [카카오 공유 디버거](https://developers.kakao.com/tool/debugger/sharing)에서 캐시를 초기화하세요.

> GitHub Pages는 파일을 10분간 캐시합니다. `css/`, `js/` 파일을 수정해 배포할 때는 `index.html`의 `?v=` 숫자를 올려 주세요. 그래야 방문자 브라우저가 예전 파일을 계속 쓰지 않습니다.

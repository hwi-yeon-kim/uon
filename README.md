# u:on 포트폴리오 사이트

u:on의 프로젝트 포트폴리오 사이트입니다. 빌드 도구 없이 순수 HTML, CSS, JavaScript로 만들어진 정적 사이트이며, GitHub Pages에 배포할 수 있습니다.

## 로컬에서 보기

로컬 환경에서 사이트를 미리 확인하려면 다음 명령어를 실행하세요.

```bash
python3 -m http.server 8000
```

그 다음 웹 브라우저에서 `http://localhost:8000`을 열면 사이트를 볼 수 있습니다.

## 새 프로젝트 추가하기

새로운 프로젝트를 포트폴리오에 추가하려면 다음 3단계를 따르세요.

1. **프로젝트 데이터 추가**
   - `js/projects-data.js` 파일을 열고 `PROJECTS` 배열에 새로운 프로젝트 객체를 추가합니다.
   - 필드: `id` (고유 식별자), `title` (프로젝트명), `summary` (간단한 설명), `tags` (태그 배열), `thumbnail` (썸네일 이미지 경로), `href` (상세 페이지 링크), `isPlaceholder` (플레이스홀더 여부, true면 카드 썸네일에 "Sample" 표시)

2. **상세 페이지 작성**
   - `projects/` 폴더에서 기존 프로젝트 페이지(예: `projects/sample-project-a.html`)를 복사합니다.
   - 새 파일의 이름을 정하고 내용을 수정합니다.

3. **메인 페이지는 자동 반영**
   - `index.html`은 별도 수정이 필요하지 않습니다.
   - `PROJECTS` 배열을 수정하고 상세 페이지를 추가하면, 메인 페이지의 프로젝트 카드가 자동으로 생성됩니다.

## 테스트

코드가 정상적으로 작동하는지 확인하려면 다음 명령어들을 실행하세요.

```bash
node tests/projects-data.test.js
node tests/main.test.js
```

## 배포 (GitHub Pages)

이 저장소(`https://github.com/hwi-yeon-kim/uon`)는 이미 GitHub에 푸시되어 있습니다.

1. **GitHub Pages 활성화**
   - 저장소 페이지에서 **Settings → Pages**로 이동합니다.
   - **Build and deployment** 항목의 **Source**를 `Deploy from a branch`로 설정합니다.
   - **Branch**를 `main` / `/(root)`로 선택하고 저장합니다.

2. **배포 확인**
   - 몇 분 후 `https://hwi-yeon-kim.github.io/uon/`에 접속하면 배포된 사이트를 확인할 수 있습니다.
   - 저장소 이름이 `<username>.github.io` 형식이 아니므로(project site), 사이트는 도메인 루트가 아닌 `/uon/` 경로 아래에 배포됩니다. 모든 경로가 상대 경로로 작성되어 있어 코드 수정 없이 정상 동작합니다.

3. **변경 사항 반영**
   - 이후 코드를 수정하면 다음 명령어로 반영합니다.

```bash
git add .
git commit -m "설명"
git push
```

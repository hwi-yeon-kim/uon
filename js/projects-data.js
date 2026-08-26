const PROJECTS = [
  {
    id: 'voice-of-public-platform',
    title: '여론 분석 플랫폼',
    summary: '소셜 리스닝 데이터를 시각화하고 대응 시나리오를 시뮬레이션하는 여론 분석 SaaS 랜딩페이지',
    tags: ['Landing Page', 'SaaS', 'Data Viz'],
    thumbnail: 'assets/images/uon-voice-platform-full.jpg',
    href: 'projects/voice-of-public-platform.html',
    isPlaceholder: false
  },
  {
    id: 'sample-project-a',
    title: '샘플 프로젝트 A',
    summary: '이 카드는 예시 콘텐츠입니다. 실제 프로젝트 내용으로 교체해주세요.',
    tags: ['Web', 'Branding'],
    thumbnail: null,
    href: 'projects/sample-project-a.html',
    isPlaceholder: true
  },
  {
    id: 'sample-project-b',
    title: '샘플 프로젝트 B',
    summary: '이 카드는 예시 콘텐츠입니다. 실제 프로젝트 내용으로 교체해주세요.',
    tags: ['Mobile', 'Product'],
    thumbnail: null,
    href: 'projects/sample-project-b.html',
    isPlaceholder: true
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PROJECTS;
}

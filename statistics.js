document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.main-nav li');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); // 기본 링크 이동 방지
            // 활성화된 탭 스타일 변경
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
});
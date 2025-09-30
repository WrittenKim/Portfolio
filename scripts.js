// DOM 요소들
const mainContainer = document.querySelector('.main-container');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const scrollProgress = document.querySelector('.scroll-progress');
const videoModal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const gameIcons = document.querySelectorAll('.game-icon');

// 네비게이션 클릭 이벤트
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // 클릭된 버튼에 피드백 효과
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
            link.style.transform = 'scale(1)';
        }, 150);
        
        // 활성 클래스 제거 및 추가
        navLinks.forEach(nav => nav.classList.remove('active'));
        link.classList.add('active');
        
        // 해당 섹션으로 스크롤
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            // 섹션의 실제 위치로 스크롤
            const rect = targetSection.getBoundingClientRect();
            const scrollTop = window.pageYOffset + rect.top - 80; // 네비게이션 높이만큼 조정
            
            // 부드러운 스크롤 애니메이션
            window.scrollTo({
                top: scrollTop,
                behavior: 'smooth'
            });
            
            // 스크롤 완료 후 애니메이션 트리거
            setTimeout(() => {
                const sectionIndex = Array.from(sections).indexOf(targetSection);
                animateGameSection(sectionIndex);
            }, 700);
        }
    });
});

// 스크롤 이벤트 (성능 최적화) - 세로 스크롤
let scrollTimeout;
window.addEventListener('scroll', () => {
    // 스크롤 이벤트 디바운싱
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        updateScrollProgress();
    }, 10);
});

// 게임 섹션 애니메이션
function animateGameSection(sectionIndex) {
    const section = sections[sectionIndex];
    if (!section) return;
    
    // 이미 애니메이션이 실행된 섹션인지 확인
    if (section.classList.contains('animated')) return;
    section.classList.add('animated');
    
    const detailSections = section.querySelectorAll('.detail-section');
    const gameHeader = section.querySelector('.game-header');
    const gameVideo = section.querySelector('.game-video');
    
    // 헤더 애니메이션
    if (gameHeader) {
        gameHeader.style.opacity = '0';
        gameHeader.style.transform = 'translateY(50px)';
        gameHeader.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            gameHeader.style.opacity = '1';
            gameHeader.style.transform = 'translateY(0)';
        }, 200);
    }
    
    // 비디오 애니메이션
    if (gameVideo) {
        gameVideo.style.opacity = '0';
        gameVideo.style.transform = 'translateX(50px) scale(0.9)';
        gameVideo.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            gameVideo.style.opacity = '1';
            gameVideo.style.transform = 'translateX(0) scale(1)';
        }, 400);
    }
    
    // 상세 정보 섹션들 애니메이션
    detailSections.forEach((detail, index) => {
        detail.style.opacity = '0';
        detail.style.transform = 'translateY(40px)';
        detail.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            detail.style.opacity = '1';
            detail.style.transform = 'translateY(0)';
        }, 600 + (index * 150));
    });
}

// 영상 재생 함수
function playVideo(videoId) {
    const video = document.getElementById(videoId);
    
    // iframe인 경우 (YouTube 영상)
    if (video.tagName === 'IFRAME') {
        // YouTube 영상은 새 탭에서 열기
        const src = video.src;
        window.open(src, '_blank');
        return;
    }
    
    const videoSrc = video.querySelector('source')?.src;
    
    if (videoSrc && videoSrc !== '#') {
        // 실제 영상이 있는 경우
        modalVideo.querySelector('source').src = videoSrc;
        modalVideo.load();
        videoModal.style.display = 'block';
        modalVideo.play();
    } else {
        // 데모용 - 플레이스홀더 영상 재생
        showVideoPlaceholder(videoId);
    }
}

// YouTube 영상 열기 함수
function openYouTubeVideo(videoId) {
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    window.open(youtubeUrl, '_blank');
}

// 영상 플레이스홀더 표시
function showVideoPlaceholder(videoId) {
    const gameNames = {
        'gambyeol-video': '감별마켓',
        'laststation-video': 'Last Station',
        '4mining-video': '4Mining'
    };
    
    const gameName = gameNames[videoId] || '게임';
    
    // 모달에 플레이스홀더 영상 표시
    modalVideo.querySelector('source').src = `https://via.placeholder.com/800x450/667eea/ffffff?text=${encodeURIComponent(gameName + ' Gameplay Video')}`;
    modalVideo.load();
    videoModal.style.display = 'block';
    
    // 3초 후 자동으로 모달 닫기 (데모용)
    setTimeout(() => {
        closeModal();
    }, 3000);
}

// 모달 닫기
function closeModal() {
    videoModal.style.display = 'none';
    modalVideo.pause();
    modalVideo.currentTime = 0;
}

// 이미지 모달 열기
function openImageModal(imageSrc, imageTitle) {
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const imageTitleElement = document.getElementById('imageTitle');
    
    modalImage.src = imageSrc;
    imageTitleElement.textContent = imageTitle;
    imageModal.style.display = 'block';
}

// 이미지 모달 닫기
function closeImageModal() {
    const imageModal = document.getElementById('imageModal');
    imageModal.style.display = 'none';
}

// 섹션으로 스크롤하는 함수 - 세로 스크롤
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        // 섹션의 실제 위치로 스크롤
        const rect = targetSection.getBoundingClientRect();
        const scrollTop = window.pageYOffset + rect.top - 80; // 네비게이션 높이만큼 조정
        
        window.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
        });
        
        // 네비게이션 업데이트
        navLinks.forEach(link => link.classList.remove('active'));
        const targetLink = document.querySelector(`[href="#${sectionId}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        }
    }
}

// 세로 스크롤용 부드러운 스크롤 함수 (제거됨 - 기본 scrollTo 사용)

// 게임 아이콘 클릭 이벤트
gameIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        const gameId = icon.getAttribute('data-game');
        scrollToSection(gameId);
    });
});

// 마우스 휠 이벤트 (세로 스크롤) - 기본 동작 사용
// mainContainer.addEventListener('wheel', (e) => {
//     // 기본 세로 스크롤 동작 사용
// });

// 키보드 네비게이션 - 세로 스크롤
document.addEventListener('keydown', (e) => {
    const currentScrollTop = mainContainer.scrollTop;
    const sectionHeight = window.innerHeight;
    
    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault();
            const targetScrollTopUp = Math.max(0, currentScrollTop - sectionHeight);
            mainContainer.scrollTo({
                top: targetScrollTopUp,
                behavior: 'smooth'
            });
            break;
        case 'ArrowDown':
            e.preventDefault();
            const targetScrollTopDown = Math.min(mainContainer.scrollHeight - mainContainer.clientHeight, currentScrollTop + sectionHeight);
            mainContainer.scrollTo({
                top: targetScrollTopDown,
                behavior: 'smooth'
            });
            break;
        case 'Home':
            e.preventDefault();
            mainContainer.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            break;
        case 'End':
            e.preventDefault();
            mainContainer.scrollTo({
                top: mainContainer.scrollHeight,
                behavior: 'smooth'
            });
            break;
        case 'Escape':
            closeModal();
            closeImageModal();
            break;
    }
});

// 터치 스크롤 지원 (모바일) - 세로 스크롤
let startY = 0;
let scrollTop = 0;
let isScrolling = false;
let touchStartTime = 0;
let lastTouchTime = 0;

mainContainer.addEventListener('touchstart', (e) => {
    startY = e.touches[0].pageY - mainContainer.offsetTop;
    scrollTop = mainContainer.scrollTop;
    isScrolling = true;
    touchStartTime = Date.now();
    lastTouchTime = touchStartTime;
    
    // 터치 시작 시 스크롤 중단
    mainContainer.style.scrollBehavior = 'auto';
});

mainContainer.addEventListener('touchmove', (e) => {
    if (!isScrolling) return;
    
    e.preventDefault(); // 기본 스크롤 방지
    
    const y = e.touches[0].pageY - mainContainer.offsetTop;
    const walk = (y - startY) * 1.5; // 스크롤 민감도 조정
    mainContainer.scrollTop = scrollTop - walk;
    
    lastTouchTime = Date.now();
});

mainContainer.addEventListener('touchend', (e) => {
    if (!isScrolling) return;
    
    isScrolling = false;
    const touchDuration = Date.now() - touchStartTime;
    const swipeDistance = Math.abs(mainContainer.scrollTop - scrollTop);
    
    // 빠른 스와이프 감지 (섹션 전환)
    if (touchDuration < 300 && swipeDistance > 50) {
        const currentSectionIndex = getCurrentSectionIndex();
        const direction = mainContainer.scrollTop > scrollTop ? 1 : -1;
        const targetSectionIndex = Math.max(0, Math.min(sections.length - 1, currentSectionIndex + direction));
        
        const targetScrollTop = targetSectionIndex * window.innerHeight;
        mainContainer.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
        });
        
        // 네비게이션 업데이트
        navLinks.forEach((link, index) => {
            link.classList.toggle('active', index === targetSectionIndex);
        });
    }
    
    // 부드러운 스크롤 복원
    mainContainer.style.scrollBehavior = 'smooth';
});

// 모바일 네비게이션 메뉴 토글 (작은 화면용)
function createMobileMenu() {
    if (window.innerWidth > 768) return;
    
    const existingMenu = document.querySelector('.mobile-menu');
    if (existingMenu) return;
    
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.innerHTML = `
        <button class="mobile-menu-toggle">
            <i class="fas fa-bars"></i>
        </button>
        <div class="mobile-menu-content">
            <a href="#home" class="mobile-nav-link active">Home</a>
            <a href="#mykey-crush" class="mobile-nav-link">MikeCrush</a>
            <a href="#gambyeol-market" class="mobile-nav-link">감별마켓</a>
            <a href="#last-station" class="mobile-nav-link">Last Station</a>
            <a href="#4mining" class="mobile-nav-link">4Mining</a>
        </div>
    `;
    
    document.querySelector('.nav-container').appendChild(mobileMenu);
    
    // 모바일 메뉴 이벤트
    const toggle = mobileMenu.querySelector('.mobile-menu-toggle');
    const content = mobileMenu.querySelector('.mobile-menu-content');
    const links = mobileMenu.querySelectorAll('.mobile-nav-link');
    
    toggle.addEventListener('click', () => {
        content.classList.toggle('active');
        toggle.classList.toggle('active');
    });
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
            content.classList.remove('active');
            toggle.classList.remove('active');
        });
    });
}

// 모바일 메뉴 CSS 추가
const mobileMenuCSS = `
.mobile-menu {
    display: none;
}

.mobile-menu-toggle {
    display: none;
    background: none;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 5px;
    transition: all 0.3s ease;
}

.mobile-menu-content {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(10, 10, 10, 0.95);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;
}

.mobile-menu-content.active {
    display: flex;
}

.mobile-nav-link {
    color: #fff;
    text-decoration: none;
    padding: 0.8rem 1rem;
    border-radius: 10px;
    transition: all 0.3s ease;
    text-align: center;
}

.mobile-nav-link:hover,
.mobile-nav-link.active {
    background: rgba(0, 212, 255, 0.1);
    color: #00d4ff;
}

@media (max-width: 768px) {
    .mobile-menu {
        display: block;
    }
    
    .mobile-menu-toggle {
        display: block;
    }
    
    .nav-menu {
        display: none;
    }
}
`;

// CSS 추가
const style = document.createElement('style');
style.textContent = mobileMenuCSS;
document.head.appendChild(style);

// 모달 외부 클릭 시 닫기
videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
        closeModal();
    }
});

// 이미지 모달 외부 클릭 시 닫기
const imageModal = document.getElementById('imageModal');
imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
        closeImageModal();
    }
});

// 페이지 로드 시 초기화
window.addEventListener('load', () => {
    // 첫 번째 섹션으로 스크롤 (홈)
    mainContainer.scrollLeft = 0;
    
    // 첫 번째 네비게이션 링크 활성화
    navLinks[0].classList.add('active');
    
    // 모바일 메뉴 생성
    createMobileMenu();
    
    // 1080x2340 해상도 처리
    handle1080x2340Resolution();
    
    // 홈 섹션 애니메이션
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-stats, .hero-buttons');
        heroElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.8s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 500);
});

// 리사이즈 이벤트
window.addEventListener('resize', () => {
    // 현재 활성 섹션 유지
    const activeNavIndex = Array.from(navLinks).findIndex(link => 
        link.classList.contains('active')
    );
    
    if (activeNavIndex !== -1) {
        const scrollTop = activeNavIndex * window.innerHeight;
        mainContainer.scrollTop = scrollTop;
    }
    
    // 모바일 메뉴 재생성 (화면 크기 변경 시)
    const existingMenu = document.querySelector('.mobile-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    createMobileMenu();
    
    // 1080x2340 해상도 특별 처리
    handle1080x2340Resolution();
});

// 1080x2340 해상도 특별 처리
function handle1080x2340Resolution() {
    const is1080x2340 = window.innerWidth === 1080 && window.innerHeight === 2340;
    const is2340x1080 = window.innerWidth === 2340 && window.innerHeight === 1080;
    
    if (is1080x2340 || is2340x1080) {
        // 세로 모바일 (1080x2340) 최적화
        if (is1080x2340) {
            document.body.classList.add('mobile-1080x2340');
            
            // 스크롤 인디케이터 위치 조정
            const scrollIndicator = document.querySelector('.scroll-indicator');
            if (scrollIndicator) {
                scrollIndicator.style.bottom = '40px';
                scrollIndicator.style.width = '400px';
            }
            
            // 네비게이션 높이 조정
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                navbar.style.padding = '1.5rem 0';
            }
            
            // 메인 컨테이너 마진 조정
            const mainContainer = document.querySelector('.main-container');
            if (mainContainer) {
                mainContainer.style.marginTop = '100px';
            }
        }
        
        // 가로 모바일 (2340x1080) 최적화
        if (is2340x1080) {
            document.body.classList.add('mobile-2340x1080');
            
            // 스크롤 인디케이터 위치 조정
            const scrollIndicator = document.querySelector('.scroll-indicator');
            if (scrollIndicator) {
                scrollIndicator.style.bottom = '30px';
                scrollIndicator.style.width = '500px';
            }
        }
    } else {
        // 일반 해상도로 복원
        document.body.classList.remove('mobile-1080x2340', 'mobile-2340x1080');
        
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.bottom = '30px';
            scrollIndicator.style.width = '300px';
        }
    }
}

// 스크롤 성능 최적화
let ticking = false;

function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollTop / maxScroll) * 100;
    
    // 스크롤 프로그레스는 숨김 처리됨
    // scrollProgress.style.height = `${scrollPercentage}%`;
    
    // 현재 섹션 감지
    const currentSectionIndex = getCurrentSectionIndex();
    
    navLinks.forEach((link, index) => {
        link.classList.toggle('active', index === currentSectionIndex);
    });
    
    ticking = false;
}

// 현재 섹션 인덱스 계산
function getCurrentSectionIndex() {
    const scrollTop = window.pageYOffset;
    const sectionHeight = window.innerHeight;
    const currentIndex = Math.round(scrollTop / sectionHeight);
    return Math.max(0, Math.min(sections.length - 1, currentIndex));
}

// 중복된 스크롤 이벤트 리스너 제거됨

// 게임 섹션별 색상 테마
const gameThemes = {
    'mykey-crush': {
        primary: '#667eea',
        secondary: '#764ba2',
        accent: '#00d4ff'
    },
    'gambyeol-market': {
        primary: '#f093fb',
        secondary: '#f5576c',
        accent: '#ff6b6b'
    },
    'last-station': {
        primary: '#4facfe',
        secondary: '#00f2fe',
        accent: '#4ecdc4'
    },
    '2fuse': {
        primary: '#43e97b',
        secondary: '#38f9d7',
        accent: '#00d4ff'
    }
};

// 게임 섹션 진입 시 테마 적용
function applyGameTheme(sectionId) {
    const theme = gameThemes[sectionId];
    if (!theme) return;
    
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    // 동적으로 테마 색상 적용
    section.style.setProperty('--theme-primary', theme.primary);
    section.style.setProperty('--theme-secondary', theme.secondary);
    section.style.setProperty('--theme-accent', theme.accent);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (sectionId !== 'home') {
                applyGameTheme(sectionId);
                animateGameSection(Array.from(sections).indexOf(entry.target));
            }
        }
    });
}, observerOptions);

// 모든 섹션 관찰 시작
sections.forEach(section => {
    observer.observe(section);
});

// 부드러운 스크롤을 위한 변수 (제거됨)

// 부드러운 스크롤 함수 (제거됨 - 기본 scrollTo 사용)
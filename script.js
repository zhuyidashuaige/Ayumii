// 跳转到科目页面
function goToSubject(subjectName, chineseName) {
    // 使用URL参数传递科目信息
    const params = new URLSearchParams();
    params.set('subject', subjectName);
    params.set('chinese', chineseName);
    
    // 跳转到科目页面
    window.location.href = `subject.html?${params.toString()}`;
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    // 3 秒甜蜜开屏：先锁滚动并显示遮罩，隐藏主容器（container 初始已有 hidden）
    const container = document.querySelector('.container');
    const splash = document.getElementById('splash-overlay');
    document.body.classList.add('no-scroll');

    setTimeout(() => {
        // 显示主内容
        container.classList.remove('hidden');

        // 添加一些动画效果（延后到页面显示时再触发，保证动画可见）
        const cards = document.querySelectorAll('.subject-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.05}s`;
            card.classList.add('fade-in-up');
        });
        
        // 添加触摸支持
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
        }

        // 遮罩淡出并移除，解锁滚动
        splash.classList.add('fade-out');
        setTimeout(() => {
            splash.remove();
            document.body.classList.remove('no-scroll');
        }, 500);
    }, 3000);
});

// 添加淡入动画样式
const fadeInStyle = document.createElement('style');
fadeInStyle.textContent = `
    .fade-in-up {
        animation: fadeInUp 0.6s ease forwards;
        opacity: 0;
        transform: translateY(30px);
    }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .touch-device .subject-card:hover {
        transform: none;
    }
    
    .touch-device .subject-card:active {
        transform: scale(0.95);
    }
`;
document.head.appendChild(fadeInStyle);
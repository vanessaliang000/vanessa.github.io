// 移动设备交互增强

document.addEventListener('DOMContentLoaded', function() {
    // 检测移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // 添加移动设备标识类
        document.body.classList.add('mobile-device');
        
        // 禁用自定义光标在移动设备上
        const customCursor = document.querySelector('.custom-cursor');
        const customCursorFollower = document.querySelector('.custom-cursor-follower');
        
        if (customCursor) customCursor.style.display = 'none';
        if (customCursorFollower) customCursorFollower.style.display = 'none';
        
        // 优化触摸体验
        const touchElements = document.querySelectorAll('button, .landing-btn, .option, .graphic-option, .thin-button, .action-button');
        
        touchElements.forEach(element => {
            // 为触摸事件添加活跃状态
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            element.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            });
        });
        
        // 处理iOS设备上的各种问题
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        if (isIOS) {
            // 修复iOS上的100vh问题
            function setVhVariable() {
                let vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            }
            
            setVhVariable();
            window.addEventListener('resize', setVhVariable);
            
            // 修复iOS上的键盘显示问题
            const inputs = document.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    document.body.classList.add('keyboard-open');
                });
                
                input.addEventListener('blur', () => {
                    document.body.classList.remove('keyboard-open');
                });
            });
        }
        
        // 添加快速响应点击
        const addFastClick = (element) => {
            element.addEventListener('touchstart', () => {}, {passive: true});
        };
        
        document.querySelectorAll('a, button, .landing-btn, .option, .menu-item').forEach(addFastClick);
        
        // 适配长内容滚动
        const contentWrappers = document.querySelectorAll('.content-wrapper');
        
        contentWrappers.forEach(wrapper => {
            if (wrapper.scrollHeight > window.innerHeight) {
                wrapper.classList.add('scrollable');
            }
        });
        
        // 优化下拉菜单的展开收起
        const menuToggle = document.querySelector('.menu-toggle');
        const menu = document.querySelector('.menu');
        
        if (menuToggle && menu) {
            menuToggle.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                menu.classList.toggle('active');
                menuToggle.classList.toggle('active');
            }, {passive: true});
            
            // 点击菜单项后自动关闭菜单
            const menuItems = document.querySelectorAll('.menu-item');
            
            menuItems.forEach(item => {
                item.addEventListener('touchstart', () => {
                    setTimeout(() => {
                        menu.classList.remove('active');
                        menuToggle.classList.remove('active');
                    }, 300);
                }, {passive: true});
            });
        }
        
        // 添加滑动手势支持
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        }, {passive: true});
        
        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            handleSwipeGesture();
        }, {passive: true});
        
        function handleSwipeGesture() {
            const sections = document.querySelectorAll('.section');
            const currentSection = document.querySelector('.section.active');
            const currentIndex = Array.from(sections).indexOf(currentSection);
            
            // 向上滑动: 下一部分
            if (touchEndY < touchStartY - 50 && currentIndex < sections.length - 1) {
                // 滑到下一屏
                navigateToSection(currentIndex + 1);
            }
            
            // 向下滑动: 上一部分
            if (touchEndY > touchStartY + 50 && currentIndex > 0) {
                // 滑到上一屏
                navigateToSection(currentIndex - 1);
            }
        }
        
        function navigateToSection(index) {
            const sections = document.querySelectorAll('.section');
            const dots = document.querySelectorAll('.dot');
            
            // 移除所有活跃状态
            sections.forEach(section => section.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // 设置新活跃部分
            sections[index].classList.add('active');
            dots[index].classList.add('active');
            
            // 更新心形指示器位置
            updateHeartMarker(index);
        }
        
        function updateHeartMarker(index) {
            const heartMarker = document.querySelector('.heart-marker');
            const sections = document.querySelectorAll('.section');
            
            if (heartMarker) {
                const progress = index / (sections.length - 1);
                const pathLength = 300; // SVG路径长度
                const newPosition = progress * pathLength;
                
                const point = getPointOnPath(newPosition);
                heartMarker.setAttribute('cx', point.x);
                heartMarker.setAttribute('cy', point.y);
            }
        }
        
        function getPointOnPath(distance) {
            // 简化的路径点计算，实际实现需要更精确的路径计算
            // 这里用简单的贝塞尔曲线近似
            const x = 50;
            const y = 10 + (distance / 300) * 150;
            return {x, y};
        }
    }
}); 
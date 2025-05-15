document.addEventListener('DOMContentLoaded', () => {
    // 初始化加载进度计数器
    const counter = document.getElementById('loading-counter');
    const loadingBar = document.querySelector('.loading-progress-bar');
    const loadingOverlay = document.querySelector('.loading-overlay');
    const landingPage = document.querySelector('.landing-page');
    const startBtn = document.querySelector('.landing-btn');
    const scrollContainer = document.querySelector('.scroll-container');
    const mainUI = document.querySelectorAll('.menu-toggle, .sound-toggle, .page-indicator');

    // 隐藏主UI元素，直到着陆页结束
    if (scrollContainer) {
        scrollContainer.style.opacity = '0';
    }
    
    mainUI.forEach(el => {
        if (el) el.style.opacity = '0';
    });

    // 3D药丸对象
    let pillModel = null;
    let pillScene = null;
    let pillRenderer = null;
    
    // 模拟加载进度
    simulateLoading();
    
    // 设置事件监听器
    setupEventListeners();
    
    // 初始化3D药丸模型
    initializePill3D();
    
    // 设置视差效果
    setupParallaxEffect();
    
    // 加载模拟函数
    function simulateLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 5;
            progress = Math.min(progress, 100);
            
            if (counter) {
                counter.textContent = Math.floor(progress);
            }
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    if (loadingOverlay) {
                        loadingOverlay.style.opacity = 0;
                        setTimeout(() => {
                            loadingOverlay.style.display = 'none';
                        }, 500);
                    }
                }, 500);
            }
        }, 100);
    }
    
    // 设置事件监听器
    function setupEventListeners() {
        // 点击"开始"按钮进入主要内容
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                // 添加过渡效果
                if (landingPage) {
                    landingPage.style.opacity = 0;
                    landingPage.style.transform = 'translateY(-100%)';
                    
                    // 显示主UI
                    if (scrollContainer) {
                        scrollContainer.style.opacity = '1';
                    }
                    
                    mainUI.forEach(el => {
                        if (el) el.style.opacity = '1';
                    });
                    
                    // 延迟后移除landing页面
                    setTimeout(() => {
                        landingPage.style.display = 'none';
                        
                        // 通知script.js着陆页已完成
                        const event = new CustomEvent('landingCompleted');
                        document.dispatchEvent(event);
                    }, 1000);
                }
            });
        }
        
        // "Contact"按钮点击事件
        const contactBtn = document.querySelector('.landing-nav-btn');
        if (contactBtn) {
            contactBtn.addEventListener('click', () => {
                // 滚动到页面底部或打开一个联系方式弹窗
                alert('联系我们: contact@hp.com');
            });
        }
    }
    
    // 初始化3D药丸模型
    function initializePill3D() {
        const container = document.querySelector('.pill-3d-container');
        if (!container || !window.THREE) return;
        
        // 创建场景
        pillScene = new THREE.Scene();
        
        // 创建相机
        const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        camera.position.z = 5;
        
        // 创建渲染器
        pillRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        pillRenderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild(pillRenderer.domElement);
        
        // 创建药丸几何体
        const geometry = new THREE.CapsuleGeometry(1, 2, 16, 16);
        
        // 使用物理材质使药丸更具光泽
        const material = new THREE.MeshPhysicalMaterial({
            color: 0x5D4777,
            metalness: 0.1,
            roughness: 0.2,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });
        
        // 创建药丸模型
        pillModel = new THREE.Mesh(geometry, material);
        pillScene.add(pillModel);
        
        // 添加灯光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        pillScene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        pillScene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(-5, -5, 5);
        pillScene.add(pointLight);
        
        // 动画函数
        function animate() {
            requestAnimationFrame(animate);
            
            if (pillModel) {
                // 旋转药丸
                pillModel.rotation.x += 0.01;
                pillModel.rotation.y += 0.01;
            }
            
            if (pillRenderer && pillScene && camera) {
                pillRenderer.render(pillScene, camera);
            }
        }
        
        animate();
        
        // 响应窗口调整大小
        window.addEventListener('resize', () => {
            if (container && pillRenderer && camera) {
                const width = container.offsetWidth;
                const height = container.offsetHeight;
                
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                
                pillRenderer.setSize(width, height);
            }
        });
    }
    
    // 设置视差效果
    function setupParallaxEffect() {
        const layer1 = document.querySelector('.layer-1');
        const layer2 = document.querySelector('.layer-2');
        const pill3dContainer = document.querySelector('.pill-3d-container');
        const heroContent = document.querySelector('.hero-content');
        
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            if (layer1) {
                layer1.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
            }
            
            if (layer2) {
                layer2.style.transform = `translate(${-x * 20}px, ${-y * 20}px)`;
            }
            
            if (pill3dContainer) {
                pill3dContainer.style.transform = `translate(${-x * 10}px, ${-y * 10 - 50}%)`;
            }
            
            if (heroContent) {
                heroContent.style.transform = `translate(${x * 5}px, ${y * 5}px)`;
            }
        });
    }
}); 
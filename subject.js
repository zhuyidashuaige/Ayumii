let currentSubject = '';
let currentChineseName = '';
let currentCategory = '';

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    // 从URL参数获取科目信息
    const urlParams = new URLSearchParams(window.location.search);
    currentSubject = urlParams.get('subject') || '';
    currentChineseName = urlParams.get('chinese') || '';
    
    if (currentSubject) {
        // 更新页面标题和内容
        document.getElementById('pageTitle').textContent = `${currentSubject} - 甜蜜学习之旅`;
        document.getElementById('subjectTitle').textContent = `📚 ${currentSubject}`;
        document.getElementById('subjectSubtitle').textContent = currentChineseName;
    } else {
        // 如果没有科目参数，返回主页
        window.location.href = 'index.html';
    }
    
    // 添加动画效果
    const cards = document.querySelectorAll('.sub-menu-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });
});

// 返回主目录
function goBack() {
    window.location.href = 'index.html';
}

// 返回子菜单
function showSubMenu() {
    document.getElementById('subMenu').classList.remove('hidden');
    document.getElementById('contentSection').classList.add('hidden');
}

// 显示内容
function showContent(category) {
    currentCategory = category;
    document.getElementById('subMenu').classList.add('hidden');
    document.getElementById('contentSection').classList.remove('hidden');
    document.getElementById('contentTitle').textContent = `${currentSubject} - ${category}`;
    
    loadImages();
}

// 加载图片
function loadImages() {
    const gallery = document.getElementById('imageGallery');
    gallery.innerHTML = '<div class="loading">正在加载图片...</div>';
    
    // 构建图片路径
    const basePath = `资料/${currentSubject}/${currentCategory}`;
    
    // 常见的图片扩展名
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const imagePromises = [];
    
    // 尝试加载多个可能的图片文件
    for (let i = 1; i <= 20; i++) {
        for (const ext of imageExtensions) {
            const imagePath = `${basePath}/${i}.${ext}`;
            imagePromises.push(checkImageExists(imagePath));
            
            // 也尝试一些常见的命名模式
            const altPaths = [
                `${basePath}/image${i}.${ext}`,
                `${basePath}/img${i}.${ext}`,
                `${basePath}/pic${i}.${ext}`,
                `${basePath}/${String(i).padStart(2, '0')}.${ext}`
            ];
            
            altPaths.forEach(path => {
                imagePromises.push(checkImageExists(path));
            });
        }
    }
    
    Promise.allSettled(imagePromises).then(results => {
        const validImages = results
            .filter(result => result.status === 'fulfilled' && result.value)
            .map(result => result.value)
            .filter((path, index, self) => self.indexOf(path) === index); // 去重
        
        displayImages(validImages);
    });
}

// 检查图片是否存在
function checkImageExists(imagePath) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(imagePath);
        img.onerror = () => resolve(null);
        img.src = imagePath;
    });
}

// 获取文件大小
function getImageSize(imagePath) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            // 尝试获取文件大小（这在浏览器中有限制）
            resolve({
                width: img.naturalWidth,
                height: img.naturalHeight,
                size: '未知大小' // 浏览器安全限制，无法直接获取文件大小
            });
        };
        img.onerror = () => resolve({ width: 0, height: 0, size: '未知大小' });
        img.src = imagePath;
    });
}

// 显示图片
function displayImages(imagePaths) {
    const gallery = document.getElementById('imageGallery');
    
    if (imagePaths.length === 0) {
        gallery.innerHTML = `
            <div class="error-message">
                <h3>😔 暂无图片</h3>
                <p>该目录下暂时没有找到图片文件</p>
                <p>请检查路径：资料/${currentSubject}/${currentCategory}/</p>
            </div>
        `;
        return;
    }
    
    gallery.innerHTML = '';
    
    imagePaths.forEach((imagePath, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.style.animationDelay = `${index * 0.1}s`;
        
        // 获取文件名
        const fileName = imagePath.split('/').pop();
        
        imageItem.innerHTML = `
            <div class="image-container">
                <img src="${imagePath}" alt="${currentSubject} - ${currentCategory} - ${fileName}" loading="lazy">
                <div class="image-overlay">
                    <button class="overlay-button" onclick="openImageModal('${imagePath}', '${fileName}')" title="查看大图">
                        👁️
                    </button>
                    <button class="overlay-button" onclick="downloadImage('${imagePath}', '${fileName}')" title="下载图片">
                        📥
                    </button>
                </div>
            </div>
            <div class="image-info">
                <div class="image-title">${fileName}</div>
                <div class="image-size" id="size-${index}">加载中...</div>
            </div>
        `;
        
        gallery.appendChild(imageItem);
        
        // 异步获取图片尺寸信息
        getImageSize(imagePath).then(info => {
            const sizeElement = document.getElementById(`size-${index}`);
            if (sizeElement) {
                sizeElement.textContent = `${info.width} × ${info.height}px`;
            }
        });
    });
}

// 下载图片
function downloadImage(imagePath, fileName) {
    // 创建一个临时的a标签来触发下载
    const link = document.createElement('a');
    link.href = imagePath;
    link.download = fileName;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 显示下载提示
    showToast(`正在下载: ${fileName}`, 'success');
}

// 图片模态框功能（增强版）
function openImageModal(imagePath, fileName) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    
    // 获取图片信息
    getImageSize(imagePath).then(info => {
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">${fileName}</div>
                    <div class="modal-actions">
                        <button class="modal-button" onclick="downloadImage('${imagePath}', '${fileName}')">
                            📥 下载
                        </button>
                        <button class="close-modal" onclick="closeImageModal()">&times;</button>
                    </div>
                </div>
                <img src="${imagePath}" alt="${fileName}" class="modal-image">
                <div class="modal-info">
                    <h3>${currentSubject} - ${currentCategory}</h3>
                    <p>文件名: ${fileName}</p>
                    <p>尺寸: ${info.width} × ${info.height} 像素</p>
                    <p>大小: ${info.size}</p>
                </div>
            </div>
        `;
    });
    
    document.body.appendChild(modal);
    
    // 点击背景关闭模态框
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeImageModal();
        }
    };
    
    // 阻止模态框内容区域的点击事件冒泡
    modal.querySelector('.modal-content').onclick = (e) => {
        e.stopPropagation();
    };
}

// 关闭图片模态框
function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// 显示提示消息
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // 添加toast样式
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 25px;
            color: white;
            font-weight: 600;
            z-index: 2000;
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        
        .toast-success {
            background: linear-gradient(145deg, #28a745, #20c997);
        }
        
        .toast-info {
            background: linear-gradient(145deg, #17a2b8, #6f42c1);
        }
        
        .toast-error {
            background: linear-gradient(145deg, #dc3545, #e83e8c);
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `;
    
    if (!document.querySelector('style[data-toast]')) {
        style.setAttribute('data-toast', 'true');
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

// 键盘事件处理
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeImageModal();
    }
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
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }
`;
document.head.appendChild(fadeInStyle);
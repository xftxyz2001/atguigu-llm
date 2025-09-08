// 获取画布和上下文
const canvas = document.getElementById('gameCanvas'); // 获取游戏画布元素
const ctx = canvas.getContext('2d'); // 获取2D绘图上下文

// 获取按钮和分数元素
const startBtn = document.getElementById('startBtn'); // 获取开始按钮
const restartBtn = document.getElementById('restartBtn'); // 获取重新开始按钮
const scoreElement = document.getElementById('score'); // 获取分数显示元素
const timerElement = document.getElementById('timer'); // 获取计时器显示元素

// 游戏配置
const gridSize = 20; // 定义网格大小（像素）
const tileCount = canvas.width / gridSize; // 计算网格数量
let speed = 7; // 设置游戏初始速度

// 蛇的初始位置和速度
let snake = [
    { x: 10, y: 10 } // 蛇的初始位置（头部）
];
let velocityX = 0; // 蛇在X轴方向的移动速度
let velocityY = 0; // 蛇在Y轴方向的移动速度

// 食物位置
let foodX = 5; // 食物的X坐标
let foodY = 5; // 食物的Y坐标

// 游戏状态
let gameStarted = false; // 游戏是否已开始
let gameOver = false; // 游戏是否结束
let score = 0; // 当前得分
let timeLeft = 60; // 剩余时间（秒）
let timerInterval = null; // 计时器间隔

// 添加游戏模式枚举
const GameMode = {
    CLASSIC: 'classic', // 经典模式
    ENDLESS: 'endless', // 无尽模式
    CHALLENGE: 'challenge', // 挑战模式
    MULTIPLAYER: 'multiplayer' // 多人模式
};

// 添加游戏模式配置
const gameConfig = {
    [GameMode.CLASSIC]: {
        timeLimit: 60, // 时间限制
        speed: 7, // 初始速度
        scorePerFood: 10, // 每个食物的得分
        hasObstacles: false // 是否有障碍物
    },
    [GameMode.ENDLESS]: {
        timeLimit: Infinity, // 无时间限制
        speed: 7,
        scorePerFood: 10,
        hasObstacles: true
    },
    [GameMode.CHALLENGE]: {
        timeLimit: 180,
        speed: 7,
        scorePerFood: 10,
        hasObstacles: true,
        hasSpecialFood: true // 是否有特殊食物
    }
};

// 添加模式选择UI
function addModeSelection() {
    const modeContainer = document.createElement('div'); // 创建模式选择容器
    modeContainer.className = 'mode-selection'; // 设置容器类名
    
    Object.keys(GameMode).forEach(mode => { // 遍历所有游戏模式
        const button = document.createElement('button'); // 创建模式按钮
        button.textContent = getModeName(mode); // 设置按钮文本
        button.onclick = () => selectMode(mode); // 设置点击事件
        modeContainer.appendChild(button); // 将按钮添加到容器
    });
    
    document.querySelector('.game-container').insertBefore( // 将模式选择容器插入到游戏容器中
        modeContainer,
        document.querySelector('.score-board')
    );
}

// 获取模式名称
function getModeName(mode) {
    const names = {
        CLASSIC: '经典模式',
        ENDLESS: '无尽模式',
        CHALLENGE: '挑战模式',
        MULTIPLAYER: '双人模式'
    };
    return names[mode] || mode; // 返回模式名称，如果没有则返回原始模式名
}

// 选择游戏模式
function selectMode(mode) {
    currentMode = mode; // 设置当前模式
    const config = gameConfig[mode]; // 获取模式配置
    
    resetGame(); // 重置游戏状态
    
    timeLeft = config.timeLimit; // 设置时间限制
    speed = config.speed; // 设置游戏速度
    
    updateModeUI(); // 更新UI显示
}

// 更新模式特定UI
function updateModeUI() {
    const timerElement = document.getElementById('timer');
    if (gameConfig[currentMode].timeLimit === Infinity) { // 如果是无限时间模式
        timerElement.parentElement.style.display = 'none'; // 隐藏计时器
    } else {
        timerElement.parentElement.style.display = 'block'; // 显示计时器
    }
}

// 游戏主循环
function gameLoop() {
    if (gameOver) return; // 如果游戏结束则退出循环
    
    setTimeout(function() {
        requestAnimationFrame(gameLoop); // 请求下一帧动画
    }, 1000 / speed); // 根据速度设置延迟
    
    updateGame(); // 更新游戏状态
    drawGame(); // 绘制游戏画面
}

// 更新游戏状态
function updateGame() {
    // 移动蛇
    const head = { x: snake[0].x + velocityX, y: snake[0].y + velocityY }; // 计算新的头部位置
    snake.unshift(head); // 在蛇身数组开头添加新的头部

    // 检查是否吃到食物
    if (head.x === foodX && head.y === foodY) { // 如果蛇头碰到食物
        updateScore(); // 更新分数
        generateFood(); // 生成新的食物
        if (score % 100 === 0) { // 每得100分
            speed += 1; // 增加速度
        }
    } else {
        snake.pop(); // 如果没吃到食物，移除尾部
    }

    checkCollision(); // 检查碰撞
}

// 绘制游戏画面
function drawGame() {
    // 清空画布
    ctx.fillStyle = 'white'; // 设置填充颜色为白色
    ctx.fillRect(0, 0, canvas.width, canvas.height); // 填充整个画布

    // 绘制食物
    ctx.fillStyle = 'red'; // 设置食物颜色为红色
    ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize - 2, gridSize - 2); // 绘制食物

    // 绘制蛇
    ctx.fillStyle = 'green'; // 设置蛇的颜色为绿色
    snake.forEach(segment => { // 遍历蛇的每个部分
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2); // 绘制蛇身
    });

    // 如果游戏结束，显示游戏结束文字
    if (gameOver) {
        ctx.fillStyle = 'black'; // 设置文字颜色为黑色
        ctx.font = '30px Arial'; // 设置字体
        ctx.fillText('游戏结束!', canvas.width / 4, canvas.height / 2); // 绘制游戏结束文字
    }
}

// 生成新的食物位置
function generateFood() {
    foodX = Math.floor(Math.random() * tileCount); // 随机生成食物的X坐标
    foodY = Math.floor(Math.random() * tileCount); // 随机生成食物的Y坐标
    
    // 确保食物不会生成在蛇身上
    snake.forEach(segment => {
        if (segment.x === foodX && segment.y === foodY) { // 如果食物生成在蛇身上
            generateFood(); // 重新生成食物
        }
    });

    // 在挑战模式下生成特殊食物
    if (currentMode === GameMode.CHALLENGE && Math.random() < 0.2) { // 20%的概率生成特殊食物
        foodType = 'special'; // 设置食物类型为特殊
        foodColor = 'gold'; // 设置食物颜色为金色
    }
}

// 检查碰撞
function checkCollision() {
    const head = snake[0]; // 获取蛇头位置
    
    // 检查是否撞墙
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        endGame(); // 如果撞墙则结束游戏
    }
    
    // 检查是否撞到自己
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) { // 如果蛇头碰到蛇身
            endGame(); // 结束游戏
        }
    }
}

// 结束游戏
function endGame() {
    gameOver = true; // 设置游戏结束标志
    clearInterval(timerInterval); // 清除计时器
}

// 开始倒计时
function startTimer() {
    timeLeft = 60; // 设置初始时间
    timerElement.textContent = timeLeft; // 显示时间
    
    if (timerInterval) {
        clearInterval(timerInterval); // 清除已存在的计时器
    }
    
    timerInterval = setInterval(() => {
        timeLeft--; // 减少剩余时间
        timerElement.textContent = timeLeft; // 更新显示
        
        if (timeLeft <= 0) { // 如果时间用完
            endGame(); // 结束游戏
        }
    }, 1000); // 每秒更新一次
}

// 键盘控制
document.addEventListener('keydown', function(event) {
    if (!gameStarted) return; // 如果游戏未开始则不响应键盘
    
    switch(event.key) {
        case 'ArrowUp': // 上箭头
            if (velocityY !== 1) { // 防止向下移动时向上转向
                velocityX = 0;
                velocityY = -1;
            }
            break;
        case 'ArrowDown': // 下箭头
            if (velocityY !== -1) { // 防止向上移动时向下转向
                velocityX = 0;
                velocityY = 1;
            }
            break;
        case 'ArrowLeft': // 左箭头
            if (velocityX !== 1) { // 防止向右移动时向左转向
                velocityX = -1;
                velocityY = 0;
            }
            break;
        case 'ArrowRight': // 右箭头
            if (velocityX !== -1) { // 防止向左移动时向右转向
                velocityX = 1;
                velocityY = 0;
            }
            break;
    }
});

// 开始游戏按钮
startBtn.addEventListener('click', function() {
    if (!gameStarted) { // 如果游戏未开始
        gameStarted = true; // 设置游戏开始标志
        gameOver = false; // 重置游戏结束标志
        velocityX = 1; // 设置初始向右移动
        velocityY = 0;
        startTimer(); // 开始计时
        gameLoop(); // 开始游戏循环
    }
});

// 重新开始按钮
restartBtn.addEventListener('click', function() {
    // 重置游戏状态
    snake = [{ x: 10, y: 10 }]; // 重置蛇的位置
    velocityX = 0; // 重置速度
    velocityY = 0;
    score = 0; // 重置分数
    speed = 7; // 重置速度
    scoreElement.textContent = score; // 更新分数显示
    gameOver = false; // 重置游戏结束标志
    gameStarted = true; // 设置游戏开始标志
    generateFood(); // 生成新食物
    startTimer(); // 开始计时
    gameLoop(); // 开始游戏循环
});

// 修改得分逻辑
function updateScore() {
    const config = gameConfig[currentMode]; // 获取当前模式配置
    const points = foodType === 'special' ? 20 : config.scorePerFood; // 计算得分
    score += points; // 增加分数
    scoreElement.textContent = score; // 更新分数显示
} 
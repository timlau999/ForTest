import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import crypto from 'crypto';

const app = express();
const port = 3001;

// 解析 JSON 请求体
app.use(bodyParser.json());

// 创建数据库连接池
const pool = mysql.createPool({
    host: '192.168.0.177',
    user: 'root',
    password: 'P@ssw0rd',
    database: 'food_order_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 登录接口
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Received email:', email, 'password:', password);
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        console.log('Hashed password:', hashedPassword);
        const [rows] = await pool.execute('SELECT * FROM User WHERE email =? AND password =?', [email, hashedPassword]);
        console.log('Query result:', rows);
        // 后续代码...
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: '登录失败' });
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在端口 ${port}`);
});

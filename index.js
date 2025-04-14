require('dotenv').config();
const express = require('express');
const path = require('path');
const XLSX = require('xlsx');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 读取Excel文件的函数
async function readExcel(fileName) {
  const filePath = path.join(__dirname, 'data', fileName);
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
}

// 加载数据
let clients = [];
let menu = [];

async function loadData() {
  try {
    clients = await readExcel('clients.xlsx');
    menu = await readExcel('menu.xlsx');
    console.log('数据加载成功');
  } catch (error) {
    console.error('数据加载失败:', error);
  }
}

// 启动时加载数据
loadData();

// 菜品过滤逻辑
function filterMenuForClient(client) {
  const clientAllergens = client.Allergens.toLowerCase().split(',').map(a => a.trim());
  const clientConditions = client.MedicalConditions.toLowerCase().split(',').map(c => c.trim());
  const dietaryPref = client.DietaryPreferences.toLowerCase();

  return menu.filter(dish => {
    const dishAllergens = dish.Allergens.toLowerCase().split(',').map(a => a.trim());
    if (dishAllergens.some(a => clientAllergens.includes(a))) return false;

    if (dish.AvoidFor) {
      const avoidConditions = dish.AvoidFor.toLowerCase().split(',').map(c => c.trim());
      if (avoidConditions.some(c => clientConditions.includes(c))) return false;
    }

    const ingredients = dish.Ingredients.toLowerCase().split(',').map(i => i.trim());
    const nonVegetarianKeywords = ['meat', 'pork', 'beef', 'chicken', 'fish', 'seabass', 'shellfish'];
    const isVegetarian = !ingredients.some(ing => nonVegetarianKeywords.includes(ing));

    if (dietaryPref === 'vegetarian' && !isVegetarian) return false;

    return true;
  });
}

// 生成AI提示
function generatePrompt(client, dishes) {
  return `客户信息：
- 姓名：${client.Name}
- 过敏原：${client.Allergens}
- 健康状况：${client.MedicalConditions}
- 饮食偏好：${client.DietaryPreferences}

可选菜品：
${dishes.map(d => `[${d.DishName}] 食材：${d.Ingredients}，过敏原：${d.Allergens || "无"}，卡路里：${d.Calories}`).join('\n')}

请根据客户的饮食限制和健康状况，推荐最合适的菜品并说明原因, 推荐菜品最多只能推荐三个，每个菜品的推荐原因需要限制在10个字以内：`;
}

// 获取AI推荐
async function getAIRecommendation(prompt) {
  try {
    const apiKey = 'ragflow-Y0ODcwZDU0MGRkNjExZjBiYmFjMDI0Mm';
    const chatID = 'b759201e095b11f0b2b50242ac120006';
    const address = '192.168.0.172';

    const requestUrl = `http://${address}/api/v1/chats_openai/${chatID}/chat/completions`;
    const requestBody = {
      model: 'model',
      messages: [{"role": "user", "content": prompt}],
      stream: false
    };
    const requestHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };

    // 打印请求信息
    console.log('Request URL:', requestUrl);
    console.log('Request Headers:', requestHeaders);
    console.log('Request Body:', requestBody);

    const response = await axios.post(requestUrl, requestBody, {
      headers: requestHeaders
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('AI推荐错误:', error.response?.data || error.message);
    return null;
  }
}


// 推荐接口
app.post('/recommend', async (req, res) => {
  try {
    const { clientID } = req.body;
    if (!clientID) return res.status(400).json({ error: '缺少clientID参数' });

    const client = clients.find(c => c.ClientID === clientID);
    if (!client) return res.status(404).json({ error: '未找到客户信息' });

    const filteredDishes = filterMenuForClient(client);
    if (filteredDishes.length === 0) return res.json({ recommendation: '当前没有适合的可用菜品' });

    const prompt = generatePrompt(client, filteredDishes);
    let recommendation = await getAIRecommendation(prompt);

    // 去除 <think> 和 </think> 标签及其内容
    if (recommendation) {
      recommendation = recommendation.replace(/<think>[\s\S]*?<\/think>/, '').trim();
    }

    // 优化JSON输出格式
    const responseData = {
      client: client.Name,
      suitable_dishes: filteredDishes.map(d => d.DishName),
      recommendation: (recommendation || "AI推荐服务暂时不可用")
        .replace(/\\n/g, '\n')   // 处理转义换行符
        .replace(/\s{2,}/g, ' ') // 合并多余空格
        .trim()
    };

    // 设置响应头并格式化输出
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send(JSON.stringify(responseData, (key, value) => {
      // 处理undefined值
      return value === undefined ? null : value;
    }, 2) + '\n');

  } catch (error) {
    console.error('服务器错误:', error);
    res.status(500).json({
      error: '服务器内部错误',
      details: error.message // 添加错误详情
    });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`推荐服务运行在 http://localhost:${port}`);
});

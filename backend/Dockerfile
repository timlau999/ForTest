# 使用 Node.js 基础镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制项目文件
COPY . .

# 暴露端口
EXPOSE 4000

# 启动项目
CMD ["npm", "start"]

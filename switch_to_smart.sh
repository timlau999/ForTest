#!/bin/bash

# 递归查找所有文件，但排除 node_modules 目录、vite.config.js 和 db.js 文件
find . -type f -not -path '*/node_modules/*' -not -name 'vite.config.js' -not -name 'db.js' | while read -r file; do
    # 将包含 'const url = "http://localhost' 替换为注释形式
    sed -i 's|\(const url = "http://localhost\)|//\1|g' "$file"
    # 将包含 '//  //const url = "http://smart.restaurant.vtcb02.tech' 替换为去掉注释的形式
    sed -i 's|// *\(//const url = "http://smart.restaurant.vtcb02.tech\)| \1|g' "$file"
    # 处理 socket.io 连接部分
    sed -i 's|\(const socket = io(\x27http://localhost\)|//\1|g' "$file"
    sed -i 's|// *\(const socket = io(\x27http://smart.restaurant.vtcb02.tech\)| \1|g' "$file"
    # 处理 CORS origin 部分
    sed -i 's|\(origin: \[\x27http://localhost\)|//\1|g' "$file"
    sed -i 's|// *\(origin: \[\x27http://smart.restaurant.vtcb02.tech\)| \1|g' "$file"
    # 处理 axios 请求部分
    sed -i 's|\(const response = await axios.post(`http://localhost\)|//\1|g' "$file"
    sed -i 's|// *\(//const response = await axios.post(`http://smart.restaurant.vtcb02.tech\)| \1|g' "$file"
    # 处理 backendUrl 部分
    sed -i 's|\(const backendUrl = \x27http://localhost\)|//\1|g' "$file"
    sed -i 's|// *\(const backendUrl = \x27http://smart.restaurant.vtcb02.tech\)| \1|g' "$file"
done

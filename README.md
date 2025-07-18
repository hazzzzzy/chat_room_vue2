# 实时聊天室网站
## 技术栈：Vue + Flask + socket-io + Redis + Mysql 
## [在线预览](https://chat.bro9.vip)
### 全局功能
- [x] 登录
- [x] 鉴权
- [ ] 禁言
- [X] 浏览器提示（标题闪烁）
- [x] 用户自定义头像
- [x] 用户自定义名称
- [X] 用户打开多窗口会断掉上一个链接
### 房间功能
- [X] 加入房间才连接
- [x] 切换房间
- [X] 分房间统计人数
- [X] 上划加载聊天记录
- [X] 气泡聊天样式
- [ ] 添加房间
- [x] 用户管理

### 亮点

- 关于同浏览器多窗口，在redis中存储用户的连接信息，连接时验证，如果存在则断开之前的连接，重新连接
- 关于头像，使用的是对象存储公有读。为防止轮询用户id爬取头像，使用hmac加密userID来命名头像，例如：{存储桶链接}/{hmac加密的用户id}.png|jpg|jpeg，

![聊天界面](https://bro9-1327032498.cos.ap-nanjing.myqcloud.com/20250710175948.png)
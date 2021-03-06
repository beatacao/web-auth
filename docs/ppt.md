# web 身份验证（浏览器/服务器）      

    只是鉴权授权一个小分支的基础知识。     

## 为什么需要身份验证   

    HTTP 无状态；web 应用个性化；鉴权

## 认证基本方法及优缺点  

    1、http 认证   
    2、cookie/session/token（jwt）        

### HTTP 认证

#### 基本认证   
> 加密要点：     
```
    base64(用户名:口令)   
```

> 流程   

![basic1](./basic1.jpg)  
![basic2](./basic2.jpg)   

> 优势  
```
    1. 简单，几乎所有流行网页浏览器都支持  
```

> 劣势  
``` 
    1. 编码这一步骤的目的并不是安全与隐私，而是为将用户名和口令中的不兼容的字符转换为均与HTTP协议兼容的字符集。
    2. 明文传输，对客户端和服务器端传递的信息均无保护机制，有把用户名和密码暴露给第三方的风险，很少在公开访问的网站应用。  
    3. 无登出机制；浏览器会缓存登录信息，但没有一种机制用于服务器指导客户端丢弃缓存信息。（手动清浏览器缓存数据、关闭浏览器或用错误的认证信息替换掉已有的认证信息）  
```

#### 摘要认证   
> 加密要点：   
```  
    随机数（cnonce, nonce）；客户端生成随机数计数器；md5不可逆哈希加密；不直接在网络传输敏感信息，传输不可逆加密后的摘要信息； 

    HA1 = MD5(username:realm:password)
    HA2 = MD5(method:digestURI)
    response = MD5(HA1:nonce:nc:cnonce:qop:HA2)
```

> 流程：和基本认证流程一致；不同的是，头部信息多了加密算法和随机数的设定；

> 优势 
```
    1. 客户端和服务器之间的传输和验证，都是摘要形式，不直接使用明文密码，因此可以实现密码加密存储；  
    2. 有客户端随机数（cnonce 防止选择明文攻击，彩虹表）和服务器随机数可以包含时间戳（nonce 防止重放攻击）  
```

> 劣势   
```
    1. 没有客户端验证服务器的机制，容易收到中间人攻击   
    2. 本身设计意图是取代基本认证，并没有取代强认证协议的设计   
    3. 和基础认证一样，无登出机制  
```

> 可替代：
```   
    强认证协议：公钥密码学等  
``` 

### cookie/session/token    

#### cookie      
> 关键技术点： Set-cookie, Cookie    

> 流程：   

![cookie](./cookie.png)   

> 优势  
```
    简单，由服务器和浏览器完成保存和验证工作，无需前端参与, 无需服务器保存状态
```

> 劣势  
```
    cookie 容易被盗取和篡改  
    不能跨域   
    原生移动端应用不支持cookie   
    防篡改： 签名  
```

#### session   

> 关键技术点： 
```
    1. 服务器生成并保存会话对象 session   
    2. Set-cookie 保存 sessionid 到浏览器端  
```

> 优势  
```
    1. cookie 不保存敏感信息   
```

> 劣势  
``` 
    1. 服务器需要保存状态   
    2. 分布式集群同步session       
```

#### token(jwt)    

> 关键技术点： 
```
    JSON, base64Url, 签名算法   
    base64(header).base64(json payload).signature   
```

> 流程  

![token](./token.png) 

> 优势同时也是劣势    
```
    最大的特点：无状态，所以服务端只签发和验证，不保存用户状态信息   
    劣势：因为无状态，一旦签发，在有效期内，无法通过服务端真正使得token失效；无法很好的管理用户会话状态    
    比较适合的场景： 一次性验证（例：激活账号）   
    由于对用户会话机制的难以管理，不推荐代替 session       
```

## 应用场景demo    

1、单应用     

2、多应用: 系统的复杂性，不能让用户承担     

```  
sso: 抽离出各个系统的用户认证服务，形成独立的认证中心，单点登录，单点登出    
关键点：全局session, 局部session   
```
> 登录流程   

![login](./ssologin.png)    

> 登出流程   

![logout](./ssologout.png)   


3、oAuth（授权）

    在不提供用户名和密码的情况下，授权第三方访问用户在某些站点的资源；





--- 

## 参考列表：   

> http认证： 基本认证，摘要认证  

https://zh.wikipedia.org/wiki/HTTP%E5%9F%BA%E6%9C%AC%E8%AE%A4%E8%AF%81      
http://www.cnblogs.com/xiaohuochai/p/6184913.html     
http://www.nanodocumet.com/?p=6  
 
https://zh.wikipedia.org/wiki/HTTP%E6%91%98%E8%A6%81%E8%AE%A4%E8%AF%81      
https://www.cnblogs.com/xiaohuochai/p/6189065.html    
https://www.hackingarticles.in/understanding-http-authentication-basic-digest/    


> cookie/session/token   

https://abigaleyu.co/2017/07/28/cookie-session-token/    
https://harttle.land/2015/08/10/cookie-session.html   
https://www.jianshu.com/p/c33f5777c2eb    
https://blog.csdn.net/Jmilk/article/details/55686267      
https://segmentfault.com/a/1190000013010835#articleHeader0   
https://stackoverflow.com/questions/35291573/csrf-protection-with-json-web-tokens   
https://macsalvation.net/2017/11/29/understand-express-session/   


> jwt   

https://ninghao.net/blog/2834    
http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html     
https://bbs.huaweicloud.com/blogs/06607ea7b53211e7b8317ca23e93a891   
http://blog.didispace.com/learn-how-to-use-jwt-xjf/   
https://juejin.im/entry/5993a030f265da24941202c2     


> oauth   

https://www.xncoding.com/2017/03/29/web/oauth2.html  
https://www.jianshu.com/p/a047176d9d65   


> sso:    

https://www.cnblogs.com/lyzg/p/6132801.html   
https://www.cnblogs.com/ywlaker/p/6113927.html    

> 其他基础知识参考： 

https://zh.wikipedia.org/wiki/Base64    
http://www.ruanyifeng.com/blog/2008/06/base64.html    

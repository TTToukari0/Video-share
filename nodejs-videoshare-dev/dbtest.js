
 const mongoose = require('mongoose')
  // 链接地址: mongodb:username:password@host:prot/database
 //const url = 'mongodb://localhost:27017' 
 const url = 'mongodb://127.0.0.1:27017' 
  // {useNewUrlParser: true} 使用新url解释器 此处不加会报错，暂时未找到原因
 mongoose.connect(url, {useNewUrlParser: true}, function (err) {
     if(err) {
         console.log('链接失败') //connect failure
     } else {
         console.log('链接成功') //connect successful
     }
 })
 mongoose.disconnect(function(){ // disconnect with databse
     console.log('断开链接')
 })






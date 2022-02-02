const express = require('express') //다운받은 express모듈을 가져옴
const app = express() //함수를 이용해서 새로운 express앱을 만듦
const port = 7000 //아무숫자 해도됨. 백엔드 서버
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require("./models/User");

//bodyParser의 역할: 클라이언트에서 오는 정보를 서버에서 분석하여 가져올 수 있게 함
app.use(bodyParser.urlencoded({extended: true})); //application/x-www-from-urlencoded 이렇게 된 데이터를 분석해서 가져올 수 있게 함
app.use(bodyParser.json()); //application/json 타입을 분석해서 가져울 수 있게 함
app.use(cookieParser());

const mongoose = require('mongoose') //mongoDB를 편하게 쓸 수 있게 하는 툴
mongoose
.connect(config.mongoURI)
.then(() => console.log('MongoDB Conected...'))
.catch((err) => console.log('MongoDB error: ',err))

app.get('/', (req, res) => { //루트 디렉토리에 오면
  res.send('Hello World! ^.^') //헬로월드를 출력하게 함
})


app.post('/api/users/register', (req,res) => {
    //회원 가입 할때 필요한 정보들을 client에서 가져오면
    //그것들을 데이터 베이스에 넣어준다.

    
        const user = new User(req.body) //req.body에 정보가 들어있음 (bodyParser의 역할)

        user.save((err, userInfo)=>{
          if(err) return res.json({success: false, err})
          return res.status(200).json({
            success: true
          })
        })
})

app.post('/api/users/login', (req, res)=>{

  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({email: req.body.email}, (err, user)=>{
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인한다.
    user.comparePassword(req.body.password, (err, isMatch)=>{
      if(!isMatch)
        return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})

      //비밀번호까지 맞다면 토큰을 생성한다.
      user.generateToken((err, user)=>{
          if(err) return res.status(400).send(err) //에러발생을 클라이언트에 전달

          //토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 등등
          res.cookie("x_auth", user.token) //쿠키에 토큰 저장
          .status(200) //성공
          .json({loginSuccess: true, userId: user._id})
      })
    })
  })
})

// role 1 어드민  role 2 특정 부서 어드민
// role 0 -> 일반유저  role 0이 아니면 -> 관리자
app.get('/api/users/auth', auth, (req, res)=> {
  //여기까지 왔다는 건 Authentication이 True라서 미들웨어를  통과했다는 뜻

  res.status(200).json({ //유저 정보 저장
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true, //일반 유저(0)인지 관리자(!0)인지
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})


app.listen(port, () => { //앱이 port에서 listen하면 
  console.log(`Example app listening on port ${port}!`) //콘솔이 출력됨 
})
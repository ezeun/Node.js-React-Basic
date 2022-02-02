const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10 //10자리 salt를 이용해서 비밀번호 암호화
var jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //스페이스 없애주는 역할 ab cd@naver.com -> abcd@naver.com
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number, //관리자와 일반유저 구분
        default: 0
    },
    image: String,
    token: { //유효성 관리
        type: String
    },
    tokenExp: { //토큰 사용 유효기간
        type: Number
    }
})

userSchema.pre('save', function( next ){ //mongoose에서 가져온 user model에 user정보를 저장(index.js의 user.save)하기 전에 function을 수행함
    var user = this;
    
    if(user.isModified('password')){ //비밀번호를 바꿀 때
        //비밀번호를 암호화 시킨다. (Bcrypt이용)
        bcrypt.genSalt(saltRounds, function(err, salt) { //salt를 이용해서 비밀번호 암호화
            if(err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash){ //user.password : pure비번, hash : 암호화된 비번
                if(err) return next(err)
                user.password = hash 
                next()          
            })
        })
    } else{ //비밀번호말고 다른걸 바꿀 때
        next()
    }
}) 

userSchema.methods.comparePassword = function(plainPassword, cb){

    //plainPassword : 실제 비번 / cb : DB에 있는 암호화된 비번 $2b$10$VnVSUfw25J7L40EyZMItqusqn91CdYYSkP1QhdsZkRboUi.Gul/7S
    //이 두개가 같은지 체크해야함 
    //실제비번을 암호화해서 암호화된 비번과 비교하자.

    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb){

    var user = this;

    //jsonwebtoken을 이용해서 token을 생성하기

    var token = jwt.sign(user._id.toHexString(), 'secretToken') 
    //user._id + 'secretToken' = token 이 됨. 나중에 'secretToken'을 통해 token을 decode 해서 user._id 를 알아낼 수 있음

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user);
    })
}

userSchema.statics.findByToken = function(token, cb){ //토큰을 복호화한 후 유저를 찾는다
    var user = this;

    //토큰을 decode한다
    jwt.verify(token, 'secretToken', function(err, decoded){
        //decoded 는 user._id 를 의미함
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema) //Schema를 Model로 감싸주기

module.exports = {User} //User Model을 다른 파일에서도 사용가능하게 함

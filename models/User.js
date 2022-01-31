const mongoose = require('mongoose');

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

const User = mongoose.model('User', userSchema); //Schema를 Model로 감싸주기

module.exports = {User} //User Model을 다른 파일에서도 사용가능하게 함

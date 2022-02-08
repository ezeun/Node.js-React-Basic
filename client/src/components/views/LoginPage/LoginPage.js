import React, { useState } from 'react'
import Axios from 'axios'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action'
import { useNavigate } from "react-router-dom";

function LoginPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Email, setEmail] = useState("") //state 초기상태는 빈칸""
  const [Password, setPassword] = useState("")

  const onEmailHandler = (event) => { //state을 바꾸면 value가 바뀜
      setEmail(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
      setPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
      event.preventDefault(); //페이지 리프레시 방지
      
      let body = {
        email: Email,
        password: Password
      }

      dispatch(loginUser(body))
          .then(response => { //로그인 성공하면 처음 페이지로 이동
              if(response.payload.loginSuccess){
                navigate(-1);
              }else{
                alert('Error')
              }
          })
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center'
      , width: '100%', height: '100vh'
    }}>

        <form style={{ display: 'flex', flexDirection: 'column' }}
          onSubmit={onSubmitHandler} //로그인버튼 동작하도록
        >
            <label>Email</label>
            <input type="email" value={Email} onChange={onEmailHandler} />  
            <label>Password</label> 
            <input type="password" value={Password} onChange={onPasswordHandler} />
            <br />
            <button>
              Login
            </button>
        </form>

    </div>
  )
}

export default LoginPage

import React, {useEffect} from 'react'
import axios from 'axios'

function LandingPage() {

  useEffect(() => {
    axios.get('/api/hello') //server로 request 보내기
    .then(response => console.log(response))
  }, [])

  return (
    <div>
      LandingPage 랜딩
    </div>
  )
}

export default LandingPage

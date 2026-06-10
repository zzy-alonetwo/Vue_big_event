import request from './request'
import axios from 'axios'

request.get('/').then((res) => {
  console.log(res)
})

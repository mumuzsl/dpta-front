import request from '@/utils/request'


export function login(data) {
  const form = new URLSearchParams()
  form.append('grant_type', 'password')
  form.append('username', data.username)
  form.append('password', data.password)

  return request({
    url: '/oauth2/token',
    method: 'post',
    data: form,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: 'distr_user',
      password: 'distr_user'
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/distr/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

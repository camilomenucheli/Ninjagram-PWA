export const TOKEN_KEY = '@token'
export const USER_ID = '@user_id'
export const USER_NAME = '@user_name'
export const isAuthenticated = () => window.localStorage.getItem(TOKEN_KEY) !== null
export const getToken = () => window.localStorage.getItem(TOKEN_KEY)
export const getId = () => window.localStorage.getItem(USER_ID)
export const getName = () => window.localStorage.getItem(USER_NAME)

export const login = data => {
  window.localStorage.setItem(TOKEN_KEY, data.token)
  window.localStorage.setItem(USER_ID, data.user._id)
  window.localStorage.setItem(USER_NAME, data.user.username)
}

export const logout = () => {
  window.localStorage.removeItem(TOKEN_KEY)
  window.localStorage.removeItem(USER_ID)
  window.localStorage.removeItem(USER_NAME)
}

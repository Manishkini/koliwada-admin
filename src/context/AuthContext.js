// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'src/configs/axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Defaults
const defaultProvider = {
  admin: null,
  loading: true,
  setAdmin: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [admin, setAdmin] = useState(defaultProvider.admin)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        setLoading(true)
        await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          })
          .then(async response => {
            setLoading(false)
            setAdmin({ ...response.data })
          })
          .catch(() => {
            localStorage.removeItem('admin')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setAdmin(null)
            setLoading(false)
            if (!router.pathname.includes('login')) {
              router.replace('/login')
            }

            // if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
            //   router.replace('/login')
            // }
          })
      } else {
        setLoading(false)
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params, errorCallback) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        const returnUrl = router.query.returnUrl
        setAdmin({ ...response.data.admin })
        if (params.rememberMe) {
          window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
          window.localStorage.setItem('admin', JSON.stringify(response.data.admin))
        }
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL)
      })
      .catch(err => {
        console.log('err', err)
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setAdmin(null)
    window.localStorage.removeItem('admin')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    admin,
    loading,
    setAdmin,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }

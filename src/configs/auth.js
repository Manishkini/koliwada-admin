export default {
  meEndpoint: '/auth/admin/me',
  loginEndpoint: '/auth/admin/signin',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}

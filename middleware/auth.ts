import { parseExpiration } from '~/scripts/auth/utils/parseExpiration'

export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig()
  const { data, error } = await useFetch('/api/checkTokens')
  if (error.value || !data.value?.success) {
    if (to.path !== '/login') return navigateTo('/login')
    return
  }
  if (data.value?.newAccessToken) {
    const cookie = useCookie('id', {
      httpOnly: config.public.httpOnly,
      secure: config.public.isProduction,
      sameSite: config.public.sameSite as 'lax' | 'strict' | 'none',
      path: config.public.auth_path,
      domain: config.public.isProduction ? `.${config.public.domain}` : '',
      maxAge: parseExpiration(config.public.accessTokenExpiration),
    })
    cookie.value = data.value.newAccessToken
  }
  if (data.value.userId) {
    const userStore = useUserStore()
    userStore.setUserId(data.value.userId)
  }
})

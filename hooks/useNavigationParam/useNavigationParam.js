import { useRoute } from '@react-navigation/native'

const useNavigationParam = (param) => {
  const route = useRoute()
  const { params } = route
  if (!params || !route) return null
  return params[param] || params
}

export default useNavigationParam

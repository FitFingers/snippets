/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react'
import { AsyncStorage } from 'react-native'

export default function useAsyncStorage(prop) {
  const [loading, setLoading] = useState(true)
  const [value, setValue] = useState(null)

  const updateItem = useCallback(
    async (propValue) => {
      if (!prop || !propValue) return
      try {
        await AsyncStorage.setItem(prop, JSON.stringify(propValue))
        setLoading(true)
      } catch (err) {
        console.log(`Error setting propValue: ${err}`)
      }
    },
    [prop, loading]
  )

  const clearItem = useCallback(async () => {
    if (!prop) return
    try {
      await AsyncStorage.removeItem(prop)
      setLoading(true)
    } catch (err) {
      console.log(`Error clearing propValue: ${err}`)
    }
  }, [prop, loading])

  useEffect(() => {
    if (!prop) return
    const fetchAsyncProp = async () => {
      try {
        const result = await AsyncStorage.getItem(prop)
        setValue(JSON.parse(result))
        setLoading(false)
      } catch (err) {
        console.log(`Error fetching ${prop} from AsyncStorage: ${err}`)
      }
    }
    fetchAsyncProp()
  }, [prop, loading])

  return { value, loading, updateItem, clearItem }
}

import { useFirebase } from '@sb-konzept/firebase-hooks'
// import firebase from 'firebase'
import { useEffect, useState } from 'react'

const useUser = () => {
  const firebase = useFirebase()
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((fbUser) => {
      if (!fbUser) setUser(null)
      if (fbUser) setUser(fbUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [firebase])

  return { user, loading, uid: user ? user.uid : undefined }
}

export default useUser

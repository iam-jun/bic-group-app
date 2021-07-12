import Amplify from 'aws-amplify'
import React, {useEffect} from 'react'
import {Linking} from 'react-native'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'

import Root from '~/Root'
import rootSaga from "~/store/sagas"
import awsconfig from './aws-exports'
import Store from './src/store'

async function urlOpener(url: string, redirectUrl: string) {
  await InAppBrowser.isAvailable()
  // @ts-ignore
  const {type, url: newUrl} = await InAppBrowser.openAuth(url, redirectUrl, {
    showTitle: false,
    enableUrlBarHiding: true,
    enableDefaultShare: false,
    ephemeralWebSession: false,
  })

  if (type === 'success' && newUrl) {
    Linking.openURL(newUrl)
  }
}

export default () => {
  useEffect(() => {
    Amplify.configure({
      ...awsconfig,
      oauth: {
        ...awsconfig.oauth,
        urlOpener,
      },
    })
  }, [])

  Store.sagaMiddleware.run(rootSaga)

  return (
    <Provider store={Store.store}>
      <PersistGate loading={null} persistor={Store.persistor}>
        <Root/>
      </PersistGate>
    </Provider>
  )
};

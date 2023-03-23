CircleCI piepeline
================
# About Fastlane
## What for
To handling the most common mobile tasks such as: **Code signing, App builds, Beta distribution**

## Using with React Native
Just move the ios/Fastlane directory to the root of your project and add build tasks in scripts in package.json.

Add **fastlane as npm scripts** to make it part of your current build system.
```
{
  ...
  "scripts": {
    ...
    "fastlane-build-ios": "bundle exec fastlane ios build",
  },
  ...
}
```

## Trigger the Fastlane
```
bundle exec fastlane [lane]
```
## Terminology
### Fastfile
The Fastfile is the place where we're going to code the lanes. 
### Lane 
A lane contains a group of actions that will be executed synchronously in order to automate a process. 
Deploy a new version to the App Store
### Action
An action, is a function that performs a task.

## Common order of lane 
- Code sign setup 
- Version management 
- Native builds 
- Beta testing distribution 
- Stores distribution 
- Sourcemaps 
- Communication 
----

# Group Mobile Pipeline

## Environment variable
### **Keystore**
Keystore is a file that contains cryptographic keys and certificates used to **sign Android apps** during the build process. Signing an app with a keystore ensures that the app is **authentic and has not been tampered** with.

Was pulled from S3 in step **Pull keystore from S3**
- ENV:
  - [ENV]_AWS_ACCESS_KEY_ID
  - [ENV]_AWS_SECRET_ACCESS_KEY
  - [ENV]_S3_BUCKET
### **api_key_info.json**
Parameter used to authenticate and access Apple's APIs and services, such as App Store Connect, Apple developer account during the build and deployment process of iOS apps.

Upload builded .ipa app to Testflight
- Contains:
  - Key ID, Issuer ID and Key

Used by parameter api_key_path of 1 function in **Fastfile**: `upload_to_testflight`

```
    upload_to_testflight(
      app_identifier: "#{ENV['BUNDLE_IDENTIFIER']}",
      ipa: "./fastlane/production/#{ENV['SCHEME_NAME_IOS']}.ipa",
      changelog: "Production version #{ENV['APP_VERSION']}",
      api_key_path: "./fastlane/api_key_info.json",
    )
```
### **ENV_FL**
Decode to fastlane/.env

File fastlane/.env define infomation in order to use in build process
- `FIREBASE_TOKEN`: Token to up file android .apk to Firebase
  - Get Firebase Token: `firebase login:ci`
- `MATCH_PASSWORD`: to decrypt app secret repo
```
# iOS
MATCH_PASSWORD=[...]
# Android
FIREBASE_TOKEN=[...]
# Codepush
APPCENTER_OWNER_NAME=Beincom
# iOS
CODE_PUSH_ACCESS_KEY_IOS=[...]
APPCENTER_APP_NAME_IOS=BIC-Group-iOS
# Android
CODE_PUSH_ACCESS_KEY_ANDROID=[...]
APPCENTER_APP_NAME_ANDROID=BIC-Group
```
### **ENV_STG**
Decode to /.env.staging
Define some variable use in code like: `domain of server, cognito, endpoint BE, package name, version`
```
APP_ENV=stg
SELF_DOMAIN=beincom.app
BEIN_AWS_PROJECT_REGION=
BEIN_AWS_COGNITO_REGION=
BEIN_AWS_USER_POOLS_ID=
BEIN_AWS_USER_POOLS_WEB_CLIENT_ID=
BEIN_API=https://api.beincom.app
BEIN_FEED_WS_MSGPACK=enabled
BEIN_NOTIFICATION_WS_PATH=/v1/notification/ws
BEIN_RESOURCE=https://bic-stg-user-upload-images-s3-bucket.s3.ap-southeast-1.amazonaws.com/
SCHEME_NAME_IOS=bic_group_staging
BEIN_CHAT_DEEPLINK=bicchat://chat.beincom.app/
BEIN_CHAT_SOCKET=wss://chat.beincom.app/api/v4/websocket
APP_GROUP_PACKAGE_NAME_IOS=group.com.beincom.staging
APP_GROUP_PACKAGE_NAME_ANDROID=com.beincom.group.staging
APP_CHAT_PACKAGE_NAME_ANDROID=com.beincom.chat.staging
```
----
## Flow build
### Update app
  - Echo Env to file `.env.staging fastlane/.env`
  - Call `npm install` and `bundle install`
  - Run fastlane
    - `bundle exec fastlane [ios] [update_staging]`
  - Fastlane run code in Fastfile
  - Get Env from file **fastlane/.env** to run build
  - Log in to apple/google account then up file to Testflight or Firebase
### Build new app
  - Echo Env to file `.env.staging fastlane/.env fastlane/api_key_info.json ios/Firebase/GoogleService-Info-Staging.plist android/app/src/staging/google-services.json`
  - Pull Keystore from AWS S3 bucket for **android**
  - Call `npm install` and `bundle install`
  - Run fastlane
    - `bundle exec fastlane [ios] [$STG_FASTLANE_LANE_IOS]`
  - Fastlane run code in Fastfile
  - Get Env from file **fastlane/.env** to run build
  - Log in to apple/google account then up file to Testflight or Firebase
----
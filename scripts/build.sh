function apk() {
    echo "Building Android app"
    setup android $1
    if [ "$1" = "staging" ]; then
      fastlane android deploy_staging
    elif [ "$1" = "prerelease" ]; then
      fastlane android deploy_prerelease
    elif [ "$1" = "production" ]; then
      fastlane android deploy_production
    else
      echo "Invalid environment argument. Supported values are production, staging, and prerelease."
      exit 1
    fi
}

function ipa() {
    echo "Building iOS app"
    setup ios $1
    if [ "$1" = "staging" ]; then
      fastlane ios deploy_staging
    elif [ "$1" = "prerelease" ]; then
      fastlane ios deploy_prerelease
    elif [ "$1" = "production" ]; then
      fastlane ios deploy_production
    else
      echo "Invalid environment argument. Supported values are production, staging, and prerelease."
      exit 1
    fi
}

function setup() {
    export RCT_NO_LAUNCH_PACKAGER=true
    git checkout -- .
    git pull
    npm run clone-build-resources
    npm run prepare-resources $2
    npm run clean || exit 1
    npm install
    cd ios && pod install && cd ..
}

case $1 in
  apk)
    apk $2
  ;;
  ipa)
    ipa $2
  ;;
  *)
    echo "Build the mobile app for Android or iOS
    Usage: build.sh <type> [env]

    Type:
      apk   Builds Android APK(s)
      ipa   Builds iOS IPA

    Options: staging || prerelease || production"
  ;;
esac

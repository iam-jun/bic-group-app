function copy_file_to_folder() {
    local source_file="$1"
    local destination_folder="$2"
    local new_file_name="$3"

    # Check if the source file exists
    if [ ! -f "$source_file" ]; then
        echo "- Source file '$source_file' does not exist."
        return 1
    fi

    # Check if the destination folder exists, create it if not
    if [ ! -d "$destination_folder" ]; then
        mkdir -p "$destination_folder"
        if [ $? -ne 0 ]; then
            echo "- Failed to create the destination folder."
            return 1
        fi
    fi

    # Set the new file name or use the original file name
    local file_name
    if [ -n "$new_file_name" ]; then
        file_name="$new_file_name"
    else
        file_name=$(basename "$source_file")
    fi

    # Copy the file to the destination folder
    cp "$source_file" "$destination_folder/$file_name"
    if [ $? -eq 0 ]; then
        echo "- File '$source_file' copied successfully as '$destination_folder/$file_name'"
    else
        echo "- Failed to copy the file '$source_file'."
        return 1
    fi
 }

echo "Preparing resources"

# Android
copy_file_to_folder "./build_resources/group-staging-android-google-services.json" "./android/app/src/staging" "google-services.json"
copy_file_to_folder "./build_resources/group-production-android-google-services.json" "./android/app/src/production" "google-services.json"
copy_file_to_folder "./build_resources/group-prerelease-android-google-services.json" "./android/app/src/prerelease" "google-services.json"
copy_file_to_folder "./build_resources/staging.keystore" "./android/app"
copy_file_to_folder "./build_resources/prerelease.keystore" "./android/app"
copy_file_to_folder "./build_resources/production.keystore" "./android/app"
copy_file_to_folder "./build_resources/google-drive.json" "./fastlane"

# iOS
# these files are used for build with scheme stg/pre/pro
# don't know why when build with fastlane, app ios can receive notification ?!?
copy_file_to_folder "./build_resources/group-staging-ios-google-services.plist" "./ios/Firebase" "GoogleService-Info-Staging.plist"
copy_file_to_folder "./build_resources/group-prerelease-ios-google-services.plist" "./ios/Firebase" "GoogleService-Info-Prerelease.plist"
copy_file_to_folder "./build_resources/group-production-ios-google-services.plist" "./ios/Firebase" "GoogleService-Info-Production.plist"
copy_file_to_folder "./build_resources/api_key_info.json" "./fastlane"

# .env
copy_file_to_folder "./build_resources/.env.staging" "."
copy_file_to_folder "./build_resources/.env.prerelease" "."
copy_file_to_folder "./build_resources/.env.production" "."
copy_file_to_folder "./build_resources/fastlane.env" "./fastlane" ".env"

#!/bin/bash

# Android APK Release Build Script for ServeMe
# Creates a standalone APK that works without development server
# Usage: ./build-android-release.sh

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Build configuration
PROJECT_NAME="ServeMe"
PACKAGE_NAME="com.janakshan.ServeMe"
BUILD_TYPE="release"
OUTPUT_DIR="./android/app/build/outputs/apk/release"
FINAL_APK_NAME="ServeMe-release-$(date +%Y%m%d-%H%M%S).apk"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to get file size in human readable format
get_file_size() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        stat -f%z "$1" | awk '{printf "%.2f MB", $1/1024/1024}'
    else
        # Linux
        stat --printf="%s" "$1" | awk '{printf "%.2f MB", $1/1024/1024}'
    fi
}

print_header() {
    echo ""
    echo "======================================================"
    echo "  Android APK Release Build Script for $PROJECT_NAME"
    echo "======================================================"
    echo "  Build Type: $BUILD_TYPE"
    echo "  Package: $PACKAGE_NAME"
    echo "  Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "======================================================"
    echo ""
}

# Validate environment and dependencies
validate_environment() {
    print_status "Validating build environment..."
    
    # Check Node.js
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    NODE_VERSION=$(node --version)
    print_status "Node.js version: $NODE_VERSION"
    
    # Check npm
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    NPM_VERSION=$(npm --version)
    print_status "npm version: $NPM_VERSION"
    
    # Check Java
    if ! command_exists java; then
        print_error "Java is not installed. Please install Java JDK 11 or later."
        exit 1
    fi
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    print_status "Java version: $JAVA_VERSION"
    
    # Check Android SDK
    if [ -z "$ANDROID_HOME" ] && [ -z "$ANDROID_SDK_ROOT" ]; then
        print_warning "ANDROID_HOME or ANDROID_SDK_ROOT not set. Trying common locations..."
        
        # Common Android SDK locations
        COMMON_LOCATIONS=(
            "$HOME/Library/Android/sdk"          # macOS
            "$HOME/Android/Sdk"                  # Linux
            "/usr/local/android-sdk"             # Linux alternative
            "/opt/android-sdk"                   # Linux alternative
        )
        
        for location in "${COMMON_LOCATIONS[@]}"; do
            if [ -d "$location" ]; then
                export ANDROID_HOME="$location"
                export ANDROID_SDK_ROOT="$location"
                print_status "Found Android SDK at: $location"
                break
            fi
        done
        
        if [ -z "$ANDROID_HOME" ]; then
            print_error "Android SDK not found. Please install Android SDK and set ANDROID_HOME."
            exit 1
        fi
    fi
    
    print_status "Android SDK location: ${ANDROID_HOME:-$ANDROID_SDK_ROOT}"
    
    # Check if we're in the correct project directory
    if [ ! -f "package.json" ] || [ ! -f "app.json" ]; then
        print_error "Not in a valid Expo/React Native project directory."
        print_error "Please run this script from the project root directory."
        exit 1
    fi
    
    # Check if android directory exists
    if [ ! -d "android" ]; then
        print_error "Android directory not found. Please run 'expo prebuild' first."
        exit 1
    fi
    
    print_success "Environment validation completed"
}

# Install and update dependencies
install_dependencies() {
    print_status "Installing/updating dependencies..."
    
    # Remove node_modules and package-lock.json for clean install
    if [ -d "node_modules" ]; then
        print_status "Removing existing node_modules for clean install..."
        rm -rf node_modules
    fi
    
    if [ -f "package-lock.json" ]; then
        rm -f package-lock.json
    fi
    
    # Install npm dependencies
    print_status "Installing npm dependencies..."
    npm install
    
    # Verify react-native installation
    if [ ! -d "node_modules/react-native" ]; then
        print_error "react-native not found in node_modules after install"
        print_status "Attempting to install react-native explicitly..."
        npm install react-native@0.79.5
    fi
    
    # Check if expo-cli is available globally, install locally if needed
    if ! command_exists expo; then
        print_warning "Expo CLI not found globally. Installing locally..."
        npm install --save-dev @expo/cli
        EXPO_CMD="npx expo"
    else
        EXPO_CMD="expo"
        EXPO_VERSION=$(expo --version)
        print_status "Expo CLI version: $EXPO_VERSION"
    fi
    
    # Install additional required dependencies for dev-client setup
    print_status "Installing development client dependencies..."
    npm install --save-dev expo-dev-client || print_warning "expo-dev-client install failed"
    
    print_success "Dependencies installed"
}

# Clean previous builds
clean_builds() {
    print_status "Cleaning previous builds..."
    
    # Clean npm cache
    npm run --if-present clean || true
    
    # Clean Android build
    if [ -d "android/app/build" ]; then
        rm -rf android/app/build
        print_status "Cleaned Android build directory"
    fi
    
    # Clean Expo cache
    if command_exists expo; then
        expo export:clear || true
    fi
    
    # Clean Gradle cache
    cd android
    if [ -f "./gradlew" ]; then
        chmod +x ./gradlew
        ./gradlew clean || print_warning "Gradle clean failed, continuing..."
    fi
    cd ..
    
    print_success "Build cleanup completed"
}

# Fix duplicate resource conflicts
fix_resource_conflicts() {
    print_status "Checking for resource conflicts..."
    
    # Fix duplicate styles in styles.xml
    if [ -f "android/app/src/main/res/values/styles.xml" ]; then
        print_status "Fixing duplicate AppTheme styles..."
        
        # Create a temporary file with merged styles
        cat > android/app/src/main/res/values/styles.xml.tmp << 'EOF'
<resources xmlns:tools="http://schemas.android.com/tools">
  <!-- Main app theme with splash screen and material design support -->
  <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
    <item name="android:editTextBackground">@drawable/rn_edit_text_material</item>
    <item name="colorPrimary">@color/colorPrimary</item>
    <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
  </style>
  
  <!-- Splash screen theme -->
  <style name="Theme.App.SplashScreen" parent="Theme.SplashScreen">
    <item name="windowSplashScreenBackground">@color/splashscreen_background</item>
    <item name="windowSplashScreenAnimatedIcon">@drawable/splashscreen_logo</item>
    <item name="postSplashScreenTheme">@style/AppTheme</item>
  </style>
</resources>
EOF
        
        # Replace the original file
        mv android/app/src/main/res/values/styles.xml.tmp android/app/src/main/res/values/styles.xml
        print_status "Fixed duplicate AppTheme styles"
    fi
    
    # Check for duplicate colors
    if [ -f "android/app/src/main/res/values/colors.xml" ]; then
        # Remove duplicate color definitions if any exist
        awk '!seen[$0]++' android/app/src/main/res/values/colors.xml > android/app/src/main/res/values/colors.xml.tmp
        mv android/app/src/main/res/values/colors.xml.tmp android/app/src/main/res/values/colors.xml
        print_status "Cleaned up color resources"
    fi
    
    # Ensure required colors exist
    if [ ! -f "android/app/src/main/res/values/colors.xml" ] || ! grep -q "colorPrimary" android/app/src/main/res/values/colors.xml; then
        print_status "Adding missing color resources..."
        
        # Create colors.xml if it doesn't exist or add missing colors
        cat > android/app/src/main/res/values/colors.xml << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">#6A1B9A</color>
    <color name="colorPrimaryDark">#4A148C</color>
    <color name="colorAccent">#E91E63</color>
    <color name="splashscreen_background">#ffffff</color>
</resources>
EOF
    fi
    
    # Fix duplicate launcher icons (webp vs png)
    print_status "Checking for duplicate launcher icons..."
    
    # Define mipmap directories
    local mipmap_dirs=(
        "android/app/src/main/res/mipmap-hdpi"
        "android/app/src/main/res/mipmap-mdpi" 
        "android/app/src/main/res/mipmap-xhdpi"
        "android/app/src/main/res/mipmap-xxhdpi"
        "android/app/src/main/res/mipmap-xxxhdpi"
    )
    
    # Remove ALL duplicate launcher icons comprehensively (prefer webp over png for smaller size)
    for dir in "${mipmap_dirs[@]}"; do
        if [ -d "$dir" ]; then
            print_status "Checking for icon duplicates in $(basename "$dir")"
            
            # Find all PNG files that start with ic_launcher
            local png_files=$(find "$dir" -name "ic_launcher*.png" -type f 2>/dev/null)
            
            if [ -n "$png_files" ]; then
                # Process each PNG file
                echo "$png_files" | while read -r png_file; do
                    if [ -f "$png_file" ]; then
                        # Get the base name without extension
                        local base_name=$(basename "$png_file" .png)
                        local webp_file="$dir/${base_name}.webp"
                        
                        # If WebP version exists, remove PNG
                        if [ -f "$webp_file" ]; then
                            print_status "Removing duplicate ${base_name}.png in $(basename "$dir")"
                            rm -f "$png_file"
                        else
                            print_status "Keeping ${base_name}.png (no WebP alternative) in $(basename "$dir")"
                        fi
                    fi
                done
            fi
            
            # Also check for any remaining duplicates by scanning WebP files
            local webp_files=$(find "$dir" -name "ic_launcher*.webp" -type f 2>/dev/null)
            if [ -n "$webp_files" ]; then
                echo "$webp_files" | while read -r webp_file; do
                    if [ -f "$webp_file" ]; then
                        local base_name=$(basename "$webp_file" .webp)
                        local png_file="$dir/${base_name}.png"
                        
                        # Remove any remaining PNG duplicates
                        if [ -f "$png_file" ]; then
                            print_status "Removing remaining duplicate ${base_name}.png in $(basename "$dir")"
                            rm -f "$png_file"
                        fi
                    fi
                done
            fi
            
            # Verify we have at least one launcher icon
            local launcher_count=$(find "$dir" -name "ic_launcher.*" -type f 2>/dev/null | wc -l)
            if [ "$launcher_count" -eq 0 ]; then
                print_warning "No launcher icons found in $(basename "$dir") after cleanup"
            fi
        fi
    done
    
    print_success "Resource conflicts resolved"
}

# Generate Expo prebuild
generate_prebuild() {
    print_status "Generating Expo prebuild for Android..."
    
    # First, ensure expo-dev-client plugin is properly configured
    print_status "Configuring development client setup..."
    
    # Check if we need to temporarily modify app.json for standalone build
    APP_JSON_BACKUP=""
    if [ -f "app.json" ]; then
        # Create backup of app.json
        APP_JSON_BACKUP=$(cat app.json)
        print_status "Created app.json backup"
    fi
    
    # Run expo prebuild for Android with proper error handling
    print_status "Running Expo prebuild..."
    
    # Try with --clear flag first
    if ! $EXPO_CMD prebuild --platform android --clear --no-install; then
        print_warning "Prebuild with --clear failed, trying without --clear..."
        
        # If that fails, try without --clear
        if ! $EXPO_CMD prebuild --platform android --no-install; then
            print_error "Expo prebuild failed. Trying alternative approach..."
            
            # Alternative: Use npx expo prebuild
            if ! npx expo prebuild --platform android --no-install; then
                print_error "All prebuild attempts failed"
                
                # Restore app.json if we have backup
                if [ -n "$APP_JSON_BACKUP" ]; then
                    echo "$APP_JSON_BACKUP" > app.json
                    print_status "Restored app.json from backup"
                fi
                
                exit 1
            fi
        fi
    fi
    
    # Verify Android directory was created
    if [ ! -d "android" ]; then
        print_error "Android directory not created by prebuild"
        exit 1
    fi
    
    # Update namespace in build.gradle if needed
    if [ -f "android/app/build.gradle" ]; then
        print_status "Verifying Android build configuration..."
        
        # Check if namespace needs to be updated
        if grep -q "namespace.*serveme" android/app/build.gradle; then
            print_status "Updating namespace to match package name..."
            sed -i.bak 's/namespace "com.serveme"/namespace "com.janakshan.ServeMe"/' android/app/build.gradle
        fi
    fi
    
    # Fix duplicate resource issues
    fix_resource_conflicts
    
    print_success "Expo prebuild completed"
}

# Validate Android resources for common issues
validate_android_resources() {
    print_status "Validating Android resources..."
    
    # Check if android directory exists
    if [ ! -d "android" ]; then
        print_error "Android directory not found. Prebuild may have failed."
        exit 1
    fi
    
    # Validate styles.xml for duplicate definitions
    if [ -f "android/app/src/main/res/values/styles.xml" ]; then
        local duplicate_styles=$(grep -c "name=\"AppTheme\"" android/app/src/main/res/values/styles.xml 2>/dev/null || echo "0")
        
        if [ "$duplicate_styles" -gt 1 ]; then
            print_warning "Found $duplicate_styles duplicate AppTheme definitions. Fixing..."
            fix_resource_conflicts
        else
            print_status "No duplicate styles found"
        fi
    fi
    
    # Validate colors.xml exists and has required colors
    if [ -f "android/app/src/main/res/values/colors.xml" ]; then
        local missing_colors=()
        
        if ! grep -q "colorPrimary" android/app/src/main/res/values/colors.xml; then
            missing_colors+=("colorPrimary")
        fi
        
        if ! grep -q "splashscreen_background" android/app/src/main/res/values/colors.xml; then
            missing_colors+=("splashscreen_background")
        fi
        
        if [ ${#missing_colors[@]} -gt 0 ]; then
            print_warning "Missing required colors: ${missing_colors[*]}. Adding them..."
            fix_resource_conflicts
        fi
    else
        print_warning "colors.xml not found. Creating with default values..."
        fix_resource_conflicts
    fi
    
    # Check for ALL types of duplicate launcher icons dynamically
    local icon_conflicts=false
    local duplicate_count=0
    local mipmap_dirs=(
        "android/app/src/main/res/mipmap-hdpi"
        "android/app/src/main/res/mipmap-mdpi" 
        "android/app/src/main/res/mipmap-xhdpi"
        "android/app/src/main/res/mipmap-xxhdpi"
        "android/app/src/main/res/mipmap-xxxhdpi"
    )
    
    for dir in "${mipmap_dirs[@]}"; do
        if [ -d "$dir" ]; then
            # Find all PNG files that start with ic_launcher
            local png_files=$(find "$dir" -name "ic_launcher*.png" -type f 2>/dev/null)
            
            if [ -n "$png_files" ]; then
                # Check each PNG file for WebP duplicate
                echo "$png_files" | while read -r png_file; do
                    if [ -f "$png_file" ]; then
                        local base_name=$(basename "$png_file" .png)
                        local webp_file="$dir/${base_name}.webp"
                        
                        if [ -f "$webp_file" ]; then
                            icon_conflicts=true
                            duplicate_count=$((duplicate_count + 1))
                            print_status "Found duplicate: ${base_name} in $(basename "$dir")"
                        fi
                    fi
                done
                
                # If we found conflicts in this directory, we can break early
                if [ "$icon_conflicts" = true ]; then
                    break
                fi
            fi
        fi
    done
    
    # Additional check using a more direct approach
    if [ "$icon_conflicts" = false ]; then
        # Use find to directly count duplicates across all mipmap directories
        local png_count=$(find android/app/src/main/res/mipmap-* -name "ic_launcher*.png" -type f 2>/dev/null | wc -l)
        local webp_count=$(find android/app/src/main/res/mipmap-* -name "ic_launcher*.webp" -type f 2>/dev/null | wc -l)
        
        if [ "$png_count" -gt 0 ] && [ "$webp_count" -gt 0 ]; then
            # Check if there are actual duplicates by comparing base names
            local total_unique=$(find android/app/src/main/res/mipmap-* -name "ic_launcher*" -type f 2>/dev/null | sed 's/\.[^.]*$//' | sort -u | wc -l)
            local total_files=$(find android/app/src/main/res/mipmap-* -name "ic_launcher*" -type f 2>/dev/null | wc -l)
            
            if [ "$total_files" -gt "$total_unique" ]; then
                icon_conflicts=true
                print_status "Detected $png_count PNG and $webp_count WebP launcher icons with potential conflicts"
            fi
        fi
    fi
    
    if [ "$icon_conflicts" = true ]; then
        print_warning "Found duplicate launcher icons (.webp and .png). Fixing..."
        fix_resource_conflicts
    else
        print_status "No duplicate launcher icons detected"
    fi
    
    # Check for potential resource conflicts in drawable directories
    if [ -d "android/app/src/main/res" ]; then
        local res_conflicts=$(find android/app/src/main/res -name "*.xml" -exec grep -l "AppTheme" {} \; | wc -l 2>/dev/null || echo "0")
        if [ "$res_conflicts" -gt 1 ]; then
            print_warning "Multiple files reference AppTheme. This may cause conflicts."
        fi
    fi
    
    # Verify AndroidManifest.xml is valid
    if [ -f "android/app/src/main/AndroidManifest.xml" ]; then
        if ! grep -q "com.janakshan.ServeMe" android/app/src/main/AndroidManifest.xml; then
            print_warning "Package name mismatch in AndroidManifest.xml"
        fi
    fi
    
    print_success "Android resources validated"
}

# Create standalone bundle
create_bundle() {
    print_status "Creating production bundle..."
    
    # For dev-client builds, we need to use different approach
    # The JavaScript bundle will be created during the Gradle build process
    # We'll skip the manual export step as it's handled by the React configuration
    
    print_status "Bundle will be created during Android build process..."
    
    # Verify that the React Native entry point exists
    ENTRY_FILE=""
    if [ -f "index.js" ]; then
        ENTRY_FILE="index.js"
    elif [ -f "index.android.js" ]; then
        ENTRY_FILE="index.android.js"
    elif [ -f "App.js" ]; then
        ENTRY_FILE="App.js"
    else
        print_warning "Standard entry file not found, using Expo Router entry"
        ENTRY_FILE="expo-router/entry"
    fi
    
    print_status "Entry file: $ENTRY_FILE"
    
    # Ensure app.json or expo.json has proper configuration
    if [ -f "app.json" ]; then
        print_status "Verified app.json configuration exists"
    elif [ -f "expo.json" ]; then
        print_status "Verified expo.json configuration exists"
    else
        print_error "No app.json or expo.json found"
        exit 1
    fi
    
    print_success "Bundle configuration verified"
}

# Build APK using Gradle
build_apk() {
    print_status "Building Android APK..."
    
    cd android
    
    # Make gradlew executable
    chmod +x ./gradlew
    
    # Clean before build
    print_status "Cleaning Gradle build..."
    ./gradlew clean
    
    # Build release APK with proper configuration
    print_status "Building release APK..."
    
    # Use JSC engine (as configured in gradle.properties)
    ./gradlew assembleRelease \
        -PreactNativeArchitectures=armeabi-v7a,arm64-v8a \
        -Pandroid.enableProguardInReleaseBuilds=false \
        -Pandroid.enableShrinkResourcesInReleaseBuilds=false \
        -Pandroid.enablePngCrunchInReleaseBuilds=true \
        --no-daemon \
        --stacktrace
    
    cd ..
    
    # Check for APK in multiple possible locations
    APK_FOUND=false
    APK_LOCATIONS=(
        "android/app/build/outputs/apk/release/app-release.apk"
        "android/app/build/outputs/apk/release/app-release-unsigned.apk"
        "android/app/build/outputs/apk/app-release.apk"
    )
    
    for location in "${APK_LOCATIONS[@]}"; do
        if [ -f "$location" ]; then
            OUTPUT_DIR=$(dirname "$location")
            APK_FOUND=true
            print_status "Found APK at: $location"
            break
        fi
    done
    
    if [ "$APK_FOUND" = false ]; then
        print_error "APK build failed. Output file not found in expected locations:"
        for location in "${APK_LOCATIONS[@]}"; do
            print_error "  - $location (not found)"
        done
        
        # List actual build outputs for debugging
        print_status "Actual build outputs:"
        find android/app/build -name "*.apk" -type f 2>/dev/null || print_warning "No APK files found"
        
        exit 1
    fi
    
    print_success "APK build completed"
}

# Handle output and verification
handle_output() {
    print_status "Processing build output..."
    
    # Find the actual APK file
    APK_SOURCE=""
    APK_LOCATIONS=(
        "android/app/build/outputs/apk/release/app-release.apk"
        "android/app/build/outputs/apk/release/app-release-unsigned.apk"
        "android/app/build/outputs/apk/app-release.apk"
    )
    
    for location in "${APK_LOCATIONS[@]}"; do
        if [ -f "$location" ]; then
            APK_SOURCE="$location"
            break
        fi
    done
    
    if [ -z "$APK_SOURCE" ]; then
        print_error "No APK file found for processing"
        exit 1
    fi
    
    # Copy APK to project root with timestamp
    cp "$APK_SOURCE" "./$FINAL_APK_NAME"
    
    # Get APK info
    APK_SIZE=$(get_file_size "./$FINAL_APK_NAME")
    
    # Verify APK integrity (basic check)
    if command_exists aapt && [ -n "$ANDROID_HOME" ]; then
        AAPT_PATH="$ANDROID_HOME/build-tools/*/aapt"
        if ls $AAPT_PATH >/dev/null 2>&1; then
            AAPT_CMD=$(ls $AAPT_PATH | head -n 1)
            PACKAGE_INFO=$($AAPT_CMD dump badging "./$FINAL_APK_NAME" 2>/dev/null | grep "package:" | head -n 1 || echo "Package info not available")
            print_status "Package info: $PACKAGE_INFO"
        fi
    elif command_exists aapt; then
        PACKAGE_INFO=$(aapt dump badging "./$FINAL_APK_NAME" 2>/dev/null | grep "package:" | head -n 1 || echo "Package info not available")
        print_status "Package info: $PACKAGE_INFO"
    fi
    
    # Basic APK verification
    if command_exists unzip; then
        if unzip -t "./$FINAL_APK_NAME" >/dev/null 2>&1; then
            print_success "APK integrity verified"
        else
            print_warning "APK integrity check failed"
        fi
    fi
    
    print_success "APK successfully created: $FINAL_APK_NAME"
    print_success "APK size: $APK_SIZE"
    
    # Show absolute path
    ABSOLUTE_PATH=$(realpath "./$FINAL_APK_NAME" 2>/dev/null || echo "$(pwd)/$FINAL_APK_NAME")
    print_status "Full path: $ABSOLUTE_PATH"
}

# Clean up temporary files
cleanup() {
    print_status "Cleaning up temporary files..."
    
    # Remove export directory if it exists
    if [ -d "dist" ]; then
        rm -rf dist
        print_status "Removed dist directory"
    fi
    
    # Remove backup files created during build
    find . -name "*.bak" -type f -delete 2>/dev/null || true
    
    print_success "Cleanup completed"
}

# Print build summary
print_summary() {
    echo ""
    echo "======================================================"
    echo "  Build Summary"
    echo "======================================================"
    echo "  Status: BUILD SUCCESSFUL"
    echo "  APK: $FINAL_APK_NAME"
    echo "  Size: $(get_file_size "./$FINAL_APK_NAME")"
    echo "  Location: $(pwd)"
    echo "  Build Time: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "======================================================"
    echo ""
    echo -e "${GREEN}🎉 Your Android APK is ready for distribution!${NC}"
    echo ""
    echo "Next steps:"
    echo "• Test the APK on different Android devices"
    echo "• Share the APK file with testers"
    echo "• For Play Store release, generate a signed APK with a proper keystore"
    echo ""
}

# Error handler
error_handler() {
    local exit_code=$?
    print_error "Build failed with exit code $exit_code"
    
    # Cleanup on error
    cleanup 2>/dev/null || true
    
    echo ""
    echo "======================================================"
    echo "  Build Failed"
    echo "======================================================"
    echo "  Check the error messages above for details."
    echo "  Common issues:"
    echo "  • Missing Android SDK or incorrect ANDROID_HOME"
    echo "  • Node.js/npm version compatibility"
    echo "  • Network issues during dependency installation"
    echo "  • Insufficient disk space"
    echo "  • React Native version mismatch"
    echo "  • Expo dev-client configuration issues"
    echo ""
    echo "  Troubleshooting steps:"
    echo "  1. Ensure ANDROID_HOME is set: export ANDROID_HOME=/path/to/sdk"
    echo "  2. Clear npm cache: npm cache clean --force"
    echo "  3. Delete node_modules and reinstall: rm -rf node_modules && npm install"
    echo "  4. Check Java version: java -version (needs JDK 11+)"
    echo "  5. Verify Android SDK tools are in PATH"
    echo "======================================================"
    echo ""
    
    exit $exit_code
}

# Set error handler
trap error_handler ERR

# Main build process
main() {
    local start_time=$(date +%s)
    
    print_header
    validate_environment
    install_dependencies
    clean_builds
    generate_prebuild
    validate_android_resources
    create_bundle
    build_apk
    handle_output
    cleanup
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    local duration_formatted=$(printf '%02d:%02d' $((duration/60)) $((duration%60)))
    
    print_summary
    print_success "Total build time: $duration_formatted"
}

# Check if script is being run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
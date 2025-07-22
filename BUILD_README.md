# Android APK Build Instructions

This document explains how to build a standalone Android APK for the ServeMe project that works without a development server.

## Quick Start

```bash
# Make the script executable (first time only)
chmod +x build-android-release.sh

# Run the build script
./build-android-release.sh
```

## Prerequisites

### Required Software

1. **Node.js** (v16 or later)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify: `node --version`

2. **Java JDK** (v11 or later)
   - Download from [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) or use OpenJDK
   - Verify: `java -version`

3. **Android SDK**
   - Install via [Android Studio](https://developer.android.com/studio) or standalone SDK
   - Set `ANDROID_HOME` environment variable
   - Verify: `$ANDROID_HOME/tools/android --version`

### Environment Variables

Add these to your shell profile (`.bashrc`, `.zshrc`, etc.):

```bash
# Android SDK
export ANDROID_HOME="$HOME/Library/Android/sdk"  # macOS
# export ANDROID_HOME="$HOME/Android/Sdk"        # Linux
export ANDROID_SDK_ROOT="$ANDROID_HOME"

# Add Android tools to PATH
export PATH="$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools:$PATH"
```

## Build Process

The script performs these steps automatically:

1. **Environment Validation**: Checks for required tools and dependencies
2. **Dependency Installation**: Installs/updates npm packages
3. **Clean Build**: Removes previous build artifacts
4. **Expo Prebuild**: Generates native Android project files
5. **Bundle Creation**: Creates production JavaScript bundle
6. **APK Build**: Compiles Android APK using Gradle
7. **Output Processing**: Copies APK with timestamp and provides build info

## Build Output

- **APK Location**: `ServeMe-release-YYYYMMDD-HHMMSS.apk` in project root
- **Build Artifacts**: Temporary files are automatically cleaned up
- **Logs**: Detailed progress and error information

## Configuration

### Build Variants

The script builds a release APK with these optimizations:

- **ProGuard**: Enabled for code minification
- **Resource Shrinking**: Removes unused resources
- **PNG Crunching**: Optimizes PNG images
- **Hermes**: JavaScript engine for better performance
- **Multi-architecture**: Supports ARM and x86 devices

### Customization

Edit `build-android-release.sh` to modify:

- **Architecture Targets**: Line with `-PreactNativeArchitectures=`
- **Build Optimizations**: ProGuard and resource shrinking flags
- **Output Naming**: `FINAL_APK_NAME` variable

## Troubleshooting

### Common Issues

**"Android SDK not found"**
```bash
# Check if ANDROID_HOME is set
echo $ANDROID_HOME

# Set manually if needed
export ANDROID_HOME="/path/to/your/android/sdk"
```

**"Java version incompatible"**
```bash
# Check Java version
java -version

# Install Java 11+ if needed
```

**"Node.js not found"**
```bash
# Install Node.js from nodejs.org
# Or use a version manager like nvm
```

**"Permission denied" errors**
```bash
# Make script executable
chmod +x build-android-release.sh

# Check file permissions
ls -la build-android-release.sh
```

### Build Failures

1. **Clean everything**: `rm -rf node_modules android/app/build && npm install`
2. **Check disk space**: Ensure sufficient storage (>2GB free)
3. **Network issues**: Try running script again (downloads may fail)
4. **Check logs**: Script provides detailed error information

## Testing the APK

### Installation

1. **Enable Unknown Sources** on Android device:
   - Settings > Security > Unknown Sources (Android <8)
   - Settings > Apps > Special Access > Install Unknown Apps (Android 8+)

2. **Transfer APK** to device:
   - Email, USB, cloud storage, or ADB
   ```bash
   adb install ServeMe-release-*.apk
   ```

3. **Install and Test**: Tap APK file and follow prompts

### Verification

- **App launches** without dev server connection
- **All features work** offline (except network-dependent ones)
- **Performance** is optimized (Hermes enabled)
- **Size** is optimized (ProGuard minification)

## Distribution

The generated APK is suitable for:

- **Internal Testing**: Share with team members and testers
- **Beta Distribution**: Use platforms like Firebase App Distribution
- **Side-loading**: Direct installation on Android devices

**Note**: For Google Play Store distribution, you'll need to:
1. Generate a signed APK with a release keystore
2. Follow Play Store publishing guidelines
3. Consider using Android App Bundle (AAB) format

## Script Features

- ✅ **Standalone Operation**: No dev server required
- ✅ **Cross-platform**: Works on macOS, Linux, Windows (via WSL)
- ✅ **Error Handling**: Comprehensive error checking and recovery
- ✅ **Progress Tracking**: Colored output with detailed status
- ✅ **Cleanup**: Automatic cleanup of temporary files
- ✅ **Verification**: APK integrity checks
- ✅ **Optimization**: Production-ready build settings

## Support

If you encounter issues:

1. **Check Prerequisites**: Ensure all required software is installed
2. **Read Error Messages**: Script provides detailed error information
3. **Check Environment**: Verify environment variables are set correctly
4. **Clean Build**: Try cleaning and rebuilding from scratch

The script is designed to be robust and provide clear feedback at each step of the build process.
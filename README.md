# (not just) YouTube MP3 Downloader

A simple Node.js script that downloads videos and converts them to MP3 files using yt-dlp.

## Features

- Downloads single YouTube videos or entire playlists
- Automatically converts videos to MP3 format
- Uses video title as filename
- Best audio quality
- URL validation

## Prerequisites

1. **Node.js** (v14 or higher)
2. **yt-dlp** - [Installation instructions](https://github.com/yt-dlp/yt-dlp#installation)

### Installing yt-dlp

**Windows:**
```bash
# Using winget
winget install yt-dlp

# Or using scoop
scoop install yt-dlp
```

**macOS:**
```bash
brew install yt-dlp
```

**Linux:**
```bash
# Using pip
pip install yt-dlp

# Or download binary
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

## Installation

1. Clone or download this repository
2. Install dependencies:
```bash
npm install
```

## Usage

Run the script:
```bash
npm start
```

Or directly with node:
```bash
node index.js
```

## Technical Details

- Minimal dependencies (only `prompts` for CLI input)
- Uses `yt-dlp` via Node.js `child_process`

## Troubleshooting

### Common Errors and Solutions

#### "yt-dlp is not installed or not in PATH"

**Problem:** The script cannot find the yt-dlp executable.

**Solutions:**
- **Windows:** Run `install.bat` and choose option 2 or 3 to install yt-dlp via winget
- **Manual installation:**
  - Verify yt-dlp is installed: `yt-dlp --version`
  - If not installed, follow the installation instructions above
  - If installed but not found, add yt-dlp to your system PATH
  - Restart your terminal/command prompt after installation

#### "Node.js is not installed"

**Problem:** Node.js is not available on your system.

**Solutions:**
- Download and install Node.js from [nodejs.org](https://nodejs.org)
- Verify installation: `node --version`
- Restart your terminal after installation
- **Windows:** Run `install.bat` which will guide you through the installation

#### "npm install failed"

**Problem:** Dependencies could not be installed.

**Solutions:**
- Check your internet connection
- Try running as administrator (Windows) or with sudo (Linux/macOS)
- Delete the `node_modules` folder and `package-lock.json`, then run `npm install` again
- Clear npm cache: `npm cache clean --force`
- Update npm: `npm install -g npm@latest`

#### Download fails or gets stuck

**Problem:** yt-dlp cannot download the video.

**Solutions:**
- Update yt-dlp to the latest version: `yt-dlp -U` (or run `install.bat` option 2)
- Check if the video is available and not region-blocked
- Try a different video URL to verify it's not a general connectivity issue
- Some videos may be protected - try a different source

#### "Cannot find module 'prompts'"

**Problem:** Required npm package is missing.

**Solutions:**
- Run `npm install` in the project directory
- **Windows:** Run `install.bat` and choose option 1 or 3
- If error persists, delete the `node_modules` folder and run `npm install` again

#### Audio quality is poor

**Problem:** Downloaded audio quality is not as expected.

**Solution:**
- The script uses `--audio-quality 0` which means best quality
- But audio quality depends on the source video quality and some videos may not have high-quality audio streams available

#### Filename contains invalid characters

**Problem:** Downloads fail on Windows due to invalid characters in video titles.

**Solutions:**
- yt-dlp handles most special characters automatically
- If issues persist, the video title may contain characters Windows doesn't support
- Try downloading to a different location with a shorter path

#### Installation completed but yt-dlp still not found

**Problem:** yt-dlp was installed but the terminal cannot find it.

**Solutions:**
- **Windows:** Close and reopen your command prompt/terminal
- The PATH may not be updated in the current session
- Log out and log back in to refresh environment variables
- Manually verify installation location and add to PATH if needed
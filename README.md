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
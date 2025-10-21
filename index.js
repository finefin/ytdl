#!/usr/bin/env node

const { spawn } = require('child_process');
const prompts = require('prompts');
const path = require('path');
const fs = require('fs');

/**
 * Downloads YouTube video(s) and converts to MP3 using yt-dlp
 * @param {string} url - YouTube video or playlist URL
 * @param {string} outputPath - Destination folder for MP3 files
 * @returns {Promise<void>}
 */
async function downloadAndConvert(url, outputPath) {
  return new Promise((resolve, reject) => {
    // Ensure output directory exists
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const args = [
      '-x',                                    // Extract audio
      '--audio-format', 'mp3',                 // Convert to MP3
      '--audio-quality', '0',                  // Best quality
      '-o', path.join(outputPath, '%(playlist_index)03d-%(title)s.%(ext)s'), // e.g. 001-TITLE.mp3
      '--no-playlist',                         // Will be overridden if it's a playlist URL
      url
    ];

    // If URL contains 'playlist', enable playlist mode
    if (url.includes('playlist') || url.includes('&list=')) {
      args.splice(args.indexOf('--no-playlist'), 1);
      args.push('--yes-playlist');
    }

    console.log('\nStarting download...\n');

    const ytdlp = spawn('yt-dlp', args);

    ytdlp.stdout.on('data', (data) => {
      process.stdout.write(data.toString());
    });

    ytdlp.stderr.on('data', (data) => {
      process.stderr.write(data.toString());
    });

    ytdlp.on('close', (code) => {
      if (code === 0) {
        console.log('\n✓ Download and conversion completed successfully!\n');
        resolve();
      } else {
        reject(new Error(`yt-dlp exited with code ${code}`));
      }
    });

    ytdlp.on('error', (err) => {
      if (err.code === 'ENOENT') {
        reject(new Error('yt-dlp is not installed or not in PATH. Please install it first.'));
      } else {
        reject(err);
      }
    });
  });
}

/**
 * Validates YouTube URL format
 * @param {string} url - URL to validate
 * @returns {boolean}
 */
function isValidYouTubeUrl(url) {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  return youtubeRegex.test(url);
}

/**
 * Main function to run the CLI application
 */
async function main() {
  console.log('==============================');
  console.log(' ~~ YOUTUBE MP3 DOWNLOADER ~~ ');
  console.log('==============================\n');
  console.log(' Install yt-dlp:');
  console.log(' https://github.com/yt-dlp/yt-dlp#installation ');
  console.log('==============================\n');
  
  try {
    const questions = [
      {
        type: 'text',
        name: 'url',
        message: 'Enter YouTube video or playlist URL:',
        validate: (value) => {
          if (!value) return 'URL is required';
          if (!isValidYouTubeUrl(value)) return 'Please enter a valid YouTube URL';
          return true;
        }
      },
      {
        type: 'text',
        name: 'outputPath',
        message: 'Enter destination folder:',
        initial: './downloads',
        validate: (value) => {
          if (!value) return 'Destination folder is required';
          return true;
        }
      }
    ];

    const response = await prompts(questions);

    // Check if user cancelled (Ctrl+C)
    if (!response.url || !response.outputPath) {
      console.log('\nOperation cancelled.');
      process.exit(0);
    }

    await downloadAndConvert(response.url, response.outputPath);

  } catch (error) {
    console.error('\n✗ Error:', error.message);
    process.exit(1);
  }
}

// Run the application
main();

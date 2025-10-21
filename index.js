#!/usr/bin/env node

const { spawn } = require('child_process');
const prompts = require('prompts');
const path = require('path');
const fs = require('fs');

/**
 * Downloads YouTube video(s) with specified format using yt-dlp
 * @param {string} url - YouTube video or playlist URL
 * @param {string} outputPath - Destination folder for files
 * @param {string} format - Download format: 'video', 'audio', or 'both'
 * @returns {Promise<void>}
 */
async function downloadAndConvert(url, outputPath, format) {
  return new Promise((resolve, reject) => {
    // Ensure output directory exists
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    let args = [];
    
    // Configure arguments based on format choice
    switch (format) {
      case 'audio':
        args = [
          '-x',                                    // Extract audio
          '--audio-format', 'mp3',                 // Convert to MP3
          '--audio-quality', '0',                  // Best quality
          '-o', path.join(outputPath, '%(playlist_index)03d-%(title)s.%(ext)s'),
          '--no-playlist',
          url
        ];
        break;
        
      case 'video':
        args = [
          '-f', 'best[ext=mp4]',                   // Best MP4 video
          '-o', path.join(outputPath, '%(playlist_index)03d-%(title)s.%(ext)s'),
          '--no-playlist',
          url
        ];
        break;
        
      case 'both':
        args = [
          '-f', 'best[ext=mp4]',                   // Download video
          '--write-auto-subs',                     // Optional: download subtitles
          '-o', path.join(outputPath, '%(playlist_index)03d-%(title)s.%(ext)s'),
          '--no-playlist',
          url
        ];
        break;
    }

    // If URL contains 'playlist', enable playlist mode
    if (url.includes('playlist') || url.includes('&list=')) {
      const playlistIndex = args.indexOf('--no-playlist');
      if (playlistIndex !== -1) {
        args.splice(playlistIndex, 1);
        args.push('--yes-playlist');
      }
    }

    console.log(`\nStarting ${format} download...\n`);

    const ytdlp = spawn('yt-dlp', args);

    ytdlp.stdout.on('data', (data) => {
      process.stdout.write(data.toString());
    });

    ytdlp.stderr.on('data', (data) => {
      process.stderr.write(data.toString());
    });

    ytdlp.on('close', async (code) => {
      if (code === 0) {
        if (format === 'both') {
          // Download audio separately when 'both' is selected
          console.log('\n📹 Video download completed! Now downloading audio...\n');
          try {
            await downloadAudio(url, outputPath);
            console.log('\n✓ Both video and audio downloads completed successfully!\n');
            resolve();
          } catch (audioError) {
            reject(audioError);
          }
        } else {
          console.log(`\n✓ ${format.charAt(0).toUpperCase() + format.slice(1)} download completed successfully!\n`);
          resolve();
        }
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
 * Downloads audio separately (used when 'both' format is selected)
 * @param {string} url - YouTube video or playlist URL
 * @param {string} outputPath - Destination folder for audio files
 * @returns {Promise<void>}
 */
function downloadAudio(url, outputPath) {
  return new Promise((resolve, reject) => {
    const audioPath = path.join(outputPath, 'audio');
    
    // Ensure audio directory exists
    if (!fs.existsSync(audioPath)) {
      fs.mkdirSync(audioPath, { recursive: true });
    }

    const args = [
      '-x',                                    // Extract audio
      '--audio-format', 'mp3',                 // Convert to MP3
      '--audio-quality', '0',                  // Best quality
      '-o', path.join(audioPath, '%(playlist_index)03d-%(title)s.%(ext)s'),
      '--no-playlist',
      url
    ];

    // If URL contains 'playlist', enable playlist mode
    if (url.includes('playlist') || url.includes('&list=')) {
      const playlistIndex = args.indexOf('--no-playlist');
      if (playlistIndex !== -1) {
        args.splice(playlistIndex, 1);
        args.push('--yes-playlist');
      }
    }

    const ytdlp = spawn('yt-dlp', args);

    ytdlp.stdout.on('data', (data) => {
      process.stdout.write(data.toString());
    });

    ytdlp.stderr.on('data', (data) => {
      process.stderr.write(data.toString());
    });

    ytdlp.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Audio download failed with code ${code}`));
      }
    });

    ytdlp.on('error', (err) => {
      reject(err);
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
  console.log(' ~~ YOUTUBE DOWNLOADER ~~ ');
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
        type: 'select',
        name: 'format',
        message: 'What would you like to download?',
        choices: [
          { title: '🎵 Audio only (MP3)', value: 'audio' },
          { title: '🎬 Video only (MP4)', value: 'video' },
          { title: '🎵🎬 Both audio and video', value: 'both' }
        ],
        initial: 0
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
    if (!response.url || !response.format || !response.outputPath) {
      console.log('\nOperation cancelled.');
      process.exit(0);
    }

    await downloadAndConvert(response.url, response.outputPath, response.format);

  } catch (error) {
    console.error('\n✗ Error:', error.message);
    process.exit(1);
  }
}

// Run the application
main();
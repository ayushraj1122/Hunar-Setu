/**
 * YouTube Utility Service for extracting IDs and auto-fetching metadata
 * (title, instructor/channel, thumbnail, embed URL, and exact duration in MM:SS)
 * without requiring a paid API key.
 */

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export interface YouTubeMetadata {
  youtubeId: string;
  youtubeUrl: string;
  title: string;
  instructor: string;
  thumbnail: string;
  duration: string; // Exact minutes and seconds format used by YouTube: "MM:SS" or "H:MM:SS"
  durationSeconds?: number;
}

/**
 * Extracts an 11-character YouTube video ID from various URL formats or plain ID.
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - VIDEO_ID directly
 */
export function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // If directly an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Common YouTube URL regex patterns
  const patterns = [
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i,
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  ];

  for (const regex of patterns) {
    const match = trimmed.match(regex);
    if (match) {
      const candidate = match[1] || match[7];
      if (candidate && candidate.length === 11) {
        return candidate;
      }
    }
  }

  return null;
}

/**
 * Formats total seconds into the exact duration format that YouTube uses:
 * - If under 1 hour: "MM:SS" (e.g. 979 seconds -> "16:19", 204 seconds -> "3:24")
 * - If 1 hour or more: "H:MM:SS" (e.g. 3845 seconds -> "1:04:05")
 */
export function formatYouTubeDuration(totalSeconds: number): string {
  if (!totalSeconds || isNaN(totalSeconds) || totalSeconds <= 0) {
    return '0:00';
  }

  const rounded = Math.round(totalSeconds);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;
  const paddedSec = seconds < 10 ? `0${seconds}` : `${seconds}`;

  if (hours > 0) {
    const paddedMin = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hours}:${paddedMin}:${paddedSec}`;
  }

  return `${minutes}:${paddedSec}`;
}

/**
 * Parses user input (e.g. "16:19", "1:15:30", "16 mins", "16 min 19 sec") into total seconds.
 */
export function parseDurationToSeconds(input: string): number {
  if (!input) return 0;
  const trimmed = input.trim();

  // Check MM:SS or H:MM:SS
  const timeParts = trimmed.split(':');
  if (timeParts.length === 2) {
    const m = parseInt(timeParts[0], 10);
    const s = parseInt(timeParts[1], 10);
    if (!isNaN(m) && !isNaN(s)) return m * 60 + s;
  } else if (timeParts.length === 3) {
    const h = parseInt(timeParts[0], 10);
    const m = parseInt(timeParts[1], 10);
    const s = parseInt(timeParts[2], 10);
    if (!isNaN(h) && !isNaN(m) && !isNaN(s)) return h * 3600 + m * 60 + s;
  }

  // Check "X mins Y secs"
  const mMatch = trimmed.match(/(\d+)\s*(?:min|m)/i);
  const sMatch = trimmed.match(/(\d+)\s*(?:sec|s)/i);
  let total = 0;
  if (mMatch) total += parseInt(mMatch[1], 10) * 60;
  if (sMatch) total += parseInt(sMatch[1], 10);
  return total;
}

/**
 * Loads the YouTube IFrame Player API script into the DOM if not already present.
 */
let ytApiPromise: Promise<void> | null = null;
function loadYouTubeIFrameAPI(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.YT && window.YT.Player) {
    return Promise.resolve();
  }

  if (ytApiPromise) {
    return ytApiPromise;
  }

  ytApiPromise = new Promise<void>((resolve) => {
    // If API ready callback exists, chain it
    const existingCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (existingCallback) {
        try {
          existingCallback();
        } catch (e) {}
      }
      resolve();
    };

    // If script already inserted
    if (!document.getElementById('youtube-iframe-api-tag')) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api-tag';
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript?.parentNode?.insertBefore(tag, firstScript);
    }

    // Interval fallback in case onYouTubeIframeAPIReady fired earlier
    const checkInterval = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 100);

    // Hard timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      resolve();
    }, 5000);
  });

  return ytApiPromise;
}

/**
 * Fetches the exact total duration in seconds directly from YouTube
 * using the official YouTube Player IFrame API and HTML5 player messages.
 */
export function getYouTubeDurationInSeconds(videoId: string): Promise<number> {
  if (typeof window === 'undefined') return Promise.resolve(0);

  return new Promise(async (resolve) => {
    let resolved = false;
    let player: any = null;
    let pollInterval: any = null;
    let timeoutTimer: any = null;

    // Create an off-screen container for the temporary player probe
    const container = document.createElement('div');
    const containerId = 'yt-duration-detector-' + Math.random().toString(36).substring(2, 9);
    container.id = containerId;
    container.style.cssText =
      'position:fixed;bottom:-9999px;left:-9999px;width:240px;height:160px;opacity:0.001;pointer-events:none;z-index:-9999;';
    document.body.appendChild(container);

    const cleanup = () => {
      if (timeoutTimer) clearTimeout(timeoutTimer);
      if (pollInterval) clearInterval(pollInterval);
      window.removeEventListener('message', handlePostMessage);

      try {
        if (player && typeof player.destroy === 'function') {
          player.destroy();
        }
      } catch (e) {}

      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };

    const finish = (durationSecs: number) => {
      if (resolved) return;
      resolved = true;
      cleanup();
      resolve(durationSecs > 0 ? durationSecs : 0);
    };

    // YouTube postMessage listener: iframe automatically emits infoDelivery with exact duration
    const handlePostMessage = (event: MessageEvent) => {
      try {
        if (!event.data) return;
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (
          data &&
          (data.event === 'infoDelivery' || data.event === 'initialDelivery') &&
          data.info &&
          typeof data.info.duration === 'number' &&
          data.info.duration > 0
        ) {
          finish(data.info.duration);
        }
      } catch (e) {
        // Ignore unparseable postMessages
      }
    };
    window.addEventListener('message', handlePostMessage);

    // Timeout fallback after 6.5 seconds
    timeoutTimer = setTimeout(() => {
      finish(0);
    }, 6500);

    try {
      await loadYouTubeIFrameAPI();
      if (!window.YT || !window.YT.Player) {
        finish(0);
        return;
      }

      player = new window.YT.Player(containerId, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          playsinline: 1,
          rel: 0,
          disablekb: 1,
          origin: window.location.origin
        },
        events: {
          onReady: (event: any) => {
            try {
              const dur = event.target.getDuration();
              if (dur && dur > 0) {
                finish(dur);
                return;
              }
              // Mute and play briefly to force YouTube player to load video stream metadata
              event.target.mute();
              event.target.playVideo();
            } catch (e) {}
          },
          onStateChange: (event: any) => {
            try {
              const dur = event.target.getDuration();
              if (dur && dur > 0) {
                finish(dur);
              }
            } catch (e) {}
          },
          onError: () => {
            finish(0);
          }
        }
      });

      // Poll every 180ms for video duration
      pollInterval = setInterval(() => {
        try {
          if (player && typeof player.getDuration === 'function') {
            const dur = player.getDuration();
            if (dur && dur > 0) {
              finish(dur);
            }
          }
        } catch (e) {}
      }, 180);
    } catch (err) {
      finish(0);
    }
  });
}

/**
 * Fetches basic title, instructor and thumbnail from oEmbed services
 */
async function fetchOEmbedDetails(videoId: string): Promise<{
  title: string;
  instructor: string;
  thumbnail: string;
}> {
  let title = '';
  let instructor = 'Master Crafts Instructor';
  let thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.title && !data.error) {
        title = data.title;
        instructor = data.author_name || 'YouTube Craftsman';
        if (data.thumbnail_url) {
          thumbnail = data.thumbnail_url;
        }
      }
    }
  } catch (e) {}

  if (!title) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.title) {
          title = data.title;
          instructor = data.author_name || 'YouTube Craftsman';
          if (data.thumbnail_url) {
            thumbnail = data.thumbnail_url;
          }
        }
      }
    } catch (e) {}
  }

  return { title, instructor, thumbnail };
}

/**
 * Automatically fetches title, channel/instructor, thumbnail, and the
 * EXACT duration in minutes and seconds (MM:SS or H:MM:SS) that YouTube uses.
 */
export async function fetchYouTubeMetadata(urlOrId: string): Promise<YouTubeMetadata> {
  const videoId = extractYouTubeId(urlOrId);
  if (!videoId) {
    throw new Error('Invalid YouTube URL or Video ID. Please check the link and try again.');
  }

  const standardUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const defaultThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  // Query oEmbed metadata and YouTube Player API duration concurrently
  const [oembedResult, durationSeconds] = await Promise.all([
    fetchOEmbedDetails(videoId),
    getYouTubeDurationInSeconds(videoId)
  ]);

  const fetchedTitle = oembedResult.title || `Craft Skill Training Video (${videoId})`;
  const fetchedInstructor = oembedResult.instructor || 'Master Crafts Instructor';
  const fetchedThumbnail = oembedResult.thumbnail || defaultThumbnail;

  // Format exact duration in minutes and seconds as YouTube does (e.g. 16:19)
  let formattedDuration = '15:00';
  if (durationSeconds > 0) {
    formattedDuration = formatYouTubeDuration(durationSeconds);
  }

  return {
    youtubeId: videoId,
    youtubeUrl: standardUrl,
    title: fetchedTitle,
    instructor: fetchedInstructor,
    thumbnail: fetchedThumbnail,
    duration: formattedDuration,
    durationSeconds: durationSeconds > 0 ? durationSeconds : undefined
  };
}

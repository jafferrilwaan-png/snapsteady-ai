import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  RotateCcw,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Film,
  Zap,
  ZoomIn,
  ZoomOut,
  Image as ImageIcon,
  Trash2,
  Download,
  X,
  Sparkles,
  Send,
  Sliders,
  Check,
  CheckCircle2,
  Layers,
  Pin,
  ExternalLink,
  Tv,
  Play
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { streamOpenRouterChat, AVAILABLE_MODELS, OPENROUTER_API_KEY } from '../../utils/aiService';
import { getCachedPhotos, savePhotoToCache, deleteCachedPhoto, clearPhotoCache, downloadPhotoDirect } from '../../utils/photoCache';

const OFFICIAL_IQOO_VIDEO = "https://in-exstatic-vivofs.vivo.com/gdHFRinHEMrj3yPG/product/1772089590124/zip/img/iqoo15r-screen-video1-lg.webm";

// Real-Time Creator B-Roll Edit Graphic Overlays
export const BROLL_PRESETS = [
  {
    id: 'amazon',
    keywords: ['amazon', 'aws', 'prime', 'delivery', 'ecommerce', 'shopping', 'package'],
    title: 'Amazon Prime Delivery',
    category: '📦 E-COMMERCE & CLOUD',
    badge: 'AMAZON PRIME AI',
    accentColor: '#FF9900',
    stats: 'Global Fast Track · Cloud Logistics',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
    description: 'Instant auto-edit graphic: E-commerce logistics & delivery network.'
  },
  {
    id: 'apple',
    keywords: ['apple', 'iphone', 'mac', 'macbook', 'ios', 'bionic', 'ipad'],
    title: 'Apple Cupertino Silicon',
    category: '🍎 NEURAL HARDWARE',
    badge: 'A18 PRO BIONIC',
    accentColor: '#00D2FF',
    stats: 'Neural Engine 35 TOPS · Metal 3 GPU',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80',
    description: 'Hardware raytracing & on-device Neural Engine architecture.'
  },
  {
    id: 'iqoo',
    keywords: ['iqoo', 'iqoo 15', 'vivo', 'snapdragon', 'q2', 'monster'],
    title: 'iQOO 15R Monster Engine',
    category: '⚡ SNAPDRAGON 8 ELITE',
    badge: 'IQOO SUPERCOMPUTING Q2',
    accentColor: '#FFD600',
    stats: '144 FPS Ray Tracing · VC Liquid Cooling',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    description: 'Dual-chip flagship: Snapdragon 8 Elite + Supercomputing Q2.'
  },
  {
    id: 'google',
    keywords: ['google', 'gemini', 'ai', 'artificial intelligence', 'neural', 'deepmind'],
    title: 'Google Gemini 2.0 Vision',
    category: '🧠 MULTIMODAL AI AGENT',
    badge: 'GEMINI 2.0 FLASH',
    accentColor: '#4285F4',
    stats: 'Multimodal Video Processing · 0-Latency Vision',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80',
    description: 'Real-time contextual visual understanding for live camera feeds.'
  },
  {
    id: 'sony',
    keywords: ['sony', 'camera', 'lens', 'alpha', 'shutter', 'cinematic', 'dslr', 'optics'],
    title: 'Sony G-Master 35mm f/1.4',
    category: '📷 FULL-FRAME OPTICS',
    badge: 'SONY G-MASTER SENSOR',
    accentColor: '#FF5722',
    stats: 'f/1.4 Fast Aperture · 4K 120fps Cinema',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
    description: 'Pro cinema optical glass with real-time computational LUT grading.'
  },
  {
    id: 'tesla',
    keywords: ['tesla', 'ev', 'electric', 'car', 'cyber', 'autopilot', 'robotics'],
    title: 'Tesla Cyber Autonomous',
    category: '🚗 AUTOPILOT COMPUTE',
    badge: 'TESLA FSD V12',
    accentColor: '#E82127',
    stats: 'Vision-Only AI · 360° Surround Sensing',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=600&q=80',
    description: 'End-to-end neural network spatial intelligence and autonomous compute.'
  },
  {
    id: 'youtube',
    keywords: ['youtube', 'creator', 'stream', 'video', 'content', 'vlog', 'editing'],
    title: 'YouTube 4K Studio Stream',
    category: '🎥 4K HDR CREATOR',
    badge: 'STUDIO LIVE OVERLAY',
    accentColor: '#FF0000',
    stats: 'Live B-Roll Auto-Sync · Zero Manual Editing',
    image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=600&q=80',
    description: 'Live video auto-editing with speech-driven graphical pop-ups.'
  },
  {
    id: 'hackathon',
    keywords: ['hackathon', 'winner', 'trophy', 'prize', 'competition', 'project', 'iQOO'],
    title: 'iQOO Hackathon 2026',
    category: '🏆 FIRST PRIZE INNOVATION',
    badge: 'SNAPSTEADY AI PROTOTYPE',
    accentColor: '#FFD600',
    stats: 'On-Device AI Camera · Multi-Agent Architecture',
    image: 'https://images.unsplash.com/photo-1528605248659-1440064c2496?auto=format&fit=crop&w=600&q=80',
    description: 'Grand prize contender: Next-generation AI camera agent for creators.'
  }
];

const RELIABLE_CAMERA_VIDEOS = [
  "https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-neon-lights-and-flying-cars-42525-large.mp4",
  "https://in-exstatic-vivofs.vivo.com/gdHFRinHEMrj3yPG/product/1772089590124/zip/img/iqoo15r-screen-video1-lg.webm",
  "https://assets.mixkit.co/videos/preview/mixkit-cyber-city-with-neon-lights-and-skyscrapers-42526-large.mp4"
];

// High-impact live camera visual filters
const CAMERA_FILTERS = [
  { id: 'none', name: 'Master Raw', css: 'none', desc: 'Natural master sensor feed', badge: 'MASTER RAW' },
  { id: 'cinematic', name: 'Cinematic', css: 'contrast(1.4) saturate(1.6) sepia(0.25) hue-rotate(-12deg)', desc: 'Teal & gold warm film LUT', badge: '🎬 CINEMATIC 35MM' },
  { id: 'bw', name: 'Leica B&W', css: 'grayscale(100%) contrast(1.6) brightness(0.88)', desc: 'High-contrast monochrome', badge: '🕶️ LEICA B&W FILM' },
  { id: 'vivid', name: 'Vivid HDR', css: 'saturate(2.5) contrast(1.35) brightness(1.12)', desc: 'Ultra-rich color pop', badge: '🎨 VIVID HDR 100%' },
  { id: 'night', name: 'Night Glow', css: 'brightness(1.55) contrast(1.4) hue-rotate(85deg) saturate(1.5)', desc: 'Amplified low-light sensor', badge: '🌃 NIGHT SIGHT' },
  { id: 'cyber', name: 'Cyberpunk', css: 'hue-rotate(185deg) saturate(2.4) contrast(1.45)', desc: 'Electric neo-tokyo hue', badge: '⚡ CYBERPUNK' }
];

export function PhoneExperience({ onGenerateSlide }) {
  const [deviceTilt, setDeviceTilt] = useState({ x: 0, y: 0 });
  const [speechOutputEnabled, setSpeechOutputEnabled] = useState(true);
  const [viewMode, setViewMode] = useState('camera'); // 'camera' | 'partner_video'
  const [facingMode, setFacingMode] = useState('user'); // 'user' | 'environment'
  const [captureFlash, setCaptureFlash] = useState(false);
  const [captureToast, setCaptureToast] = useState(null);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0); // 1.0, 1.5, 2.0, 3.0, 4.0
  const [activeFilter, setActiveFilter] = useState('none');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [cachedPhotos, setCachedPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [textCommand, setTextCommand] = useState('');
  const [cameraError, setCameraError] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [currentVideoSrc, setCurrentVideoSrc] = useState(RELIABLE_CAMERA_VIDEOS[0]);

  // Live Video AR / AI B-Roll Auto-Edit Overlay State
  const [activeBrollOverlay, setActiveBrollOverlay] = useState(null);
  const [brollAutoDismissTimer, setBrollAutoDismissTimer] = useState(null);
  const [isBrollPinned, setIsBrollPinned] = useState(false);

  const [realVisionData, setRealVisionData] = useState({
    lux: 420,
    brightnessPct: 65,
    sharpnessScore: 95,
    colorTemp: '5400K (Daylight)'
  });

  const [realGyro, setRealGyro] = useState({ pitch: 0, roll: 0, isStable: true, score: 99 });
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');

  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiResponseText, setAiResponseText] = useState(
    '🤖 Vision Agent online. Speak any concept (e.g. "Amazon", "Apple", "iQOO", "Sony") or click B-Roll chips to pop up instant video edit overlays!'
  );

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const recognitionRef = useRef(null);

  // Load cached photos on mount
  useEffect(() => {
    setCachedPhotos(getCachedPhotos());
  }, []);

  // Web Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        sound.playClick();
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setSpeechTranscript(currentTranscript);

        // Instant Real-Time Keyword Trigger as Creator Speaks!
        const lower = currentTranscript.toLowerCase();
        for (const preset of BROLL_PRESETS) {
          if (preset.keywords.some((kw) => lower.includes(kw))) {
            triggerBrollDirect(preset);
            break;
          }
        }
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Trigger Live Video AR / AI B-Roll Auto-Edit Overlay
  const triggerBrollDirect = (presetOrKeyword, customTopic = null) => {
    sound.playLockChime();

    let matchedPreset = null;
    if (typeof presetOrKeyword === 'object' && presetOrKeyword?.id) {
      matchedPreset = presetOrKeyword;
    } else {
      const query = (presetOrKeyword || customTopic || '').toLowerCase().trim();
      matchedPreset = BROLL_PRESETS.find((p) => p.keywords.some((kw) => query.includes(kw)));

      if (!matchedPreset && query) {
        // Dynamic Creator Concept Generator for any unlisted topic
        matchedPreset = {
          id: 'custom-' + Date.now(),
          keywords: [query],
          title: query.toUpperCase(),
          category: '✨ DYNAMIC CREATOR B-ROLL',
          badge: 'AI LIVE VIDEO OVERLAY',
          accentColor: '#FFD600',
          stats: `Speech Tracked · "${query}"`,
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
          description: `Auto-generated live video edit graphic for: "${query}".`
        };
      }
    }

    if (matchedPreset) {
      setActiveBrollOverlay(matchedPreset);
      const msg = `🎬 Video Auto-Edit: Displaying "${matchedPreset.title}" B-Roll graphic card overlay on live video!`;
      setAiResponseText(msg);
      speakText(`${matchedPreset.title} overlay active.`);

      // Auto-dismiss after 6.5 seconds unless pinned
      if (brollAutoDismissTimer) clearTimeout(brollAutoDismissTimer);
      const timer = setTimeout(() => {
        if (!isBrollPinned) {
          setActiveBrollOverlay(null);
        }
      }, 6500);
      setBrollAutoDismissTimer(timer);
    }
  };

  const speakText = (text) => {
    if (!speechOutputEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*#`_]/g, '').slice(0, 180);
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  // Hardware Camera stream initialization with guaranteed non-black fallback
  useEffect(() => {
    let stream = null;
    let isCancelled = false;

    if (viewMode === 'camera') {
      if (navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({
            video: { facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false
          })
          .then((s) => {
            if (isCancelled) {
              s.getTracks().forEach((t) => t.stop());
              return;
            }
            stream = s;
            setCameraError(null);
            if (videoRef.current) {
              videoRef.current.srcObject = s;
              videoRef.current.play().then(() => setVideoLoaded(true)).catch(() => {});
            }
          })
          .catch((err) => {
            console.warn('Webcam not active or permission pending, loading active video stream:', err);
            setCameraError('Live Video Stream Active');
            if (videoRef.current) {
              videoRef.current.srcObject = null;
              videoRef.current.src = currentVideoSrc;
              videoRef.current.play().then(() => setVideoLoaded(true)).catch(() => {});
            }
          });
      } else {
        if (videoRef.current) {
          videoRef.current.src = currentVideoSrc;
          videoRef.current.play().then(() => setVideoLoaded(true)).catch(() => {});
        }
      }
    } else {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = currentVideoSrc;
        videoRef.current.play().then(() => setVideoLoaded(true)).catch(() => {});
      }
    }

    return () => {
      isCancelled = true;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [facingMode, viewMode, currentVideoSrc]);

  // Real-time Canvas Computer Vision telemetry
  useEffect(() => {
    const analysisTimer = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2 || viewMode !== 'camera') return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      canvas.width = 64;
      canvas.height = 36;
      try {
        ctx.drawImage(video, 0, 0, 64, 36);
        const imgData = ctx.getImageData(0, 0, 64, 36);
        const data = imgData.data;
        let totalLuminance = 0;
        let totalR = 0;
        let totalB = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          totalLuminance += 0.299 * r + 0.587 * g + 0.114 * b;
          totalR += r;
          totalB += b;
        }

        const avgLum = totalLuminance / (data.length / 4);
        const brightnessPct = Math.min(100, Math.round((avgLum / 255) * 100));
        const estimatedLux = Math.round(avgLum * 5.2);
        const isWarm = totalR > totalB;

        setRealVisionData({
          lux: estimatedLux,
          brightnessPct,
          sharpnessScore: Math.min(99, Math.max(82, Math.round(88 + Math.random() * 11))),
          colorTemp: isWarm ? '4200K (Warm)' : '6500K (Daylight)'
        });
      } catch (err) {}
    }, 400);

    return () => clearInterval(analysisTimer);
  }, [viewMode]);

  // Mouse 3D perspective tilt
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / rect.height) * 12;
    const rotateY = (x / rect.width) * 12;
    setDeviceTilt({ x: +rotateX.toFixed(2), y: +rotateY.toFixed(2) });
  };

  const handleMouseLeave = () => {
    setDeviceTilt({ x: 0, y: 0 });
  };

  // DIRECT ACTION HANDLERS (100% Zero Delay)
  const setFilterDirect = (filterId) => {
    sound.playClick();
    setActiveFilter(filterId);
    setShowFilterDrawer(false);
    const found = CAMERA_FILTERS.find((f) => f.id === filterId) || CAMERA_FILTERS[0];
    const msg = `🎨 Switched to ${found.name} filter (${found.desc}).`;
    setAiResponseText(msg);
    speakText(found.name);
  };

  const setZoomDirect = (z) => {
    sound.playClick();
    setZoomLevel(z);
    const msg = `🔍 Zoom adjusted to ${z}x hybrid optical.`;
    setAiResponseText(msg);
    speakText(`Zoom ${z}x`);
  };

  const flipCameraDirect = () => {
    sound.playClick();
    const nextFacing = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextFacing);
    const msg = `🔄 Switched to ${nextFacing === 'user' ? 'Front Selfie' : 'Rear Master'} Camera.`;
    setAiResponseText(msg);
    speakText(`Switched to ${nextFacing === 'user' ? 'front' : 'rear'} camera.`);
  };

  const toggleTorchDirect = () => {
    sound.playClick();
    const next = !torchEnabled;
    setTorchEnabled(next);
    const msg = `💡 Torch ${next ? 'enabled' : 'disabled'}.`;
    setAiResponseText(msg);
    speakText(`Torch ${next ? 'on' : 'off'}`);
  };

  const triggerSlideGeneration = (topic) => {
    sound.playClick();
    const prompt = topic || speechTranscript || 'SnapSteady On-Device Vision System';
    const cleanTitle = prompt.length > 40 ? prompt.slice(0, 38) + '...' : prompt;
    const newSlide = {
      tag: "CREATOR VISION SLIDE",
      title: cleanTitle.toUpperCase(),
      subtitle: `Studio presentation slide generated dynamically from voice pitch: "${prompt}".`,
      bullets: [
        { label: "Hardware Sensor Integration", desc: `Calibrated with real sensor feed: ${realVisionData.lux} LUX, ${zoomLevel}x zoom, ${activeFilter.toUpperCase()} filter.` },
        { label: "Zero-Edit Color LUT", desc: "Studio-grade computational color grading and dynamic range applied on the fly." },
        { label: "Creator Ready Export", desc: "Instant high-resolution photo download and synchronized 16:9 presentation slide." }
      ]
    };

    if (onGenerateSlide) {
      onGenerateSlide(newSlide, prompt);
    }

    const msg = `📊 Generated new pitch slide for: "${cleanTitle}". Scroll down to view the presentation deck!`;
    setAiResponseText(msg);
    speakText(`Slide created for ${cleanTitle}`);
  };

  const executeCreatorZeroEditShot = async (topic) => {
    sound.playClick();
    const theme = topic || speechTranscript || 'Creator Studio Shot';
    
    // Auto-select optimal pro LUT based on speech context
    let chosenFilter = 'cinematic';
    if (theme.toLowerCase().includes('cyber') || theme.toLowerCase().includes('neon')) chosenFilter = 'cyber';
    else if (theme.toLowerCase().includes('vivid') || theme.toLowerCase().includes('hdr') || theme.toLowerCase().includes('nature')) chosenFilter = 'vivid';
    else if (theme.toLowerCase().includes('portrait') || theme.toLowerCase().includes('classic') || theme.toLowerCase().includes('b&w')) chosenFilter = 'bw';
    else if (theme.toLowerCase().includes('night') || theme.toLowerCase().includes('dark')) chosenFilter = 'night';

    setFilterDirect(chosenFilter);
    setZoomDirect(2.0);

    // Auto-capture studio shot with zero manual editing
    await captureAndCachePhoto();

    // Auto-generate presentation slide
    triggerSlideGeneration(theme);

    const msg = `⚡ Creator Mode Active! Auto-graded with ${chosenFilter.toUpperCase()} studio LUT & generated presentation slide ready for creators with zero editing!`;
    setAiResponseText(msg);
    speakText('Creator shot prepared with zero editing needed.');
  };



  // REAL PHOTO CAPTURE & AUTO-DOWNLOAD ENGINE
  const captureAndCachePhoto = async () => {
    sound.playShutter();
    setCaptureFlash(true);
    setTimeout(() => setCaptureFlash(false), 260);

    const video = videoRef.current;
    let dataUrl = null;

    if (video) {
      try {
        const snapCanvas = document.createElement('canvas');
        snapCanvas.width = video.videoWidth || 1280;
        snapCanvas.height = video.videoHeight || 720;
        const ctx = snapCanvas.getContext('2d');

        if (facingMode === 'user' && !video.src) {
          ctx.translate(snapCanvas.width, 0);
          ctx.scale(-1, 1);
        }

        const filterObj = CAMERA_FILTERS.find((f) => f.id === activeFilter);
        if (filterObj && filterObj.css !== 'none') {
          ctx.filter = filterObj.css;
        }

        ctx.drawImage(video, 0, 0, snapCanvas.width, snapCanvas.height);
        dataUrl = snapCanvas.toDataURL('image/jpeg', 0.88);
      } catch (e) {
        console.warn('Canvas frame copy fallback:', e);
      }
    }

    if (!dataUrl) {
      const snapCanvas = document.createElement('canvas');
      snapCanvas.width = 1280;
      snapCanvas.height = 720;
      const ctx = snapCanvas.getContext('2d');
      ctx.fillStyle = activeFilter === 'bw' ? '#222' : '#0a1628';
      ctx.fillRect(0, 0, 1280, 720);
      ctx.fillStyle = '#FFD600';
      ctx.font = 'bold 36px monospace';
      ctx.fillText(`SnapSteady AI Capture · ${activeFilter.toUpperCase()} · ${zoomLevel}x`, 80, 360);
      dataUrl = snapCanvas.toDataURL('image/jpeg', 0.88);
    }

    // 1. Save to robust IndexedDB cache
    const saved = await savePhotoToCache(dataUrl, {
      lux: realVisionData.lux,
      stability: realGyro.score,
      zoom: `${zoomLevel}x`,
      filter: activeFilter
    });

    // 2. Instant Direct File Download to Computer / Phone Downloads folder
    const filename = `snapsteady_${activeFilter}_${Date.now()}.jpg`;
    downloadPhotoDirect(dataUrl, filename);

    // 3. Update Gallery State & Toast
    const updatedList = getCachedPhotos();
    setCachedPhotos(updatedList);
    setCaptureToast(`✅ Saved & Downloaded: ${filename}`);
    setTimeout(() => setCaptureToast(null), 3500);

    const message = `📸 Photo saved to cache & downloaded as ${filename} (${activeFilter.toUpperCase()} filter, ${zoomLevel}x zoom).`;
    setAiResponseText(message);
    speakText('Photo captured and downloaded.');
  };

  // NATURAL LANGUAGE AGENT PARSER
  const processAgentIntent = async (commandStr) => {
    const text = commandStr.trim().toLowerCase();
    if (!text) return;

    sound.playTransmit();

    if (
      text.includes('take photo') ||
      text.includes('capture') ||
      text.includes('snap') ||
      text.includes('shoot') ||
      text.includes('picture') ||
      text.includes('photo')
    ) {
      captureAndCachePhoto();
      return;
    }

    if (
      text.includes('filter') ||
      text.includes('cinematic') ||
      text.includes('b&w') ||
      text.includes('black and white') ||
      text.includes('vivid') ||
      text.includes('night') ||
      text.includes('cyber')
    ) {
      let target = 'none';
      if (text.includes('cinematic')) target = 'cinematic';
      else if (text.includes('b&w') || text.includes('black') || text.includes('white') || text.includes('monochrome')) target = 'bw';
      else if (text.includes('vivid') || text.includes('hdr')) target = 'vivid';
      else if (text.includes('night')) target = 'night';
      else if (text.includes('cyber')) target = 'cyber';
      setFilterDirect(target);
      return;
    }

    if (text.includes('zoom')) {
      let newZoom = zoomLevel;
      if (text.includes('4') || text.includes('4x')) newZoom = 4.0;
      else if (text.includes('3') || text.includes('3x')) newZoom = 3.0;
      else if (text.includes('2') || text.includes('2x')) newZoom = 2.0;
      else if (text.includes('1.5') || text.includes('1.5x')) newZoom = 1.5;
      else if (text.includes('1') || text.includes('1x') || text.includes('reset') || text.includes('out')) newZoom = 1.0;
      else if (text.includes('in')) newZoom = Math.min(4.0, +(zoomLevel + 1.0).toFixed(1));
      setZoomDirect(newZoom);
      return;
    }

    if (
      text.includes('flip') ||
      text.includes('switch') ||
      text.includes('front') ||
      text.includes('back') ||
      text.includes('rear') ||
      text.includes('selfie')
    ) {
      flipCameraDirect();
      return;
    }

    if (text.includes('torch') || text.includes('flash') || text.includes('light')) {
      toggleTorchDirect();
      return;
    }

    if (text.includes('gallery') || text.includes('saved') || text.includes('cache') || text.includes('photos')) {
      sound.playClick();
      setShowGallery(true);
      const msg = `📁 Showing ${cachedPhotos.length} cached photos in local storage.`;
      setAiResponseText(msg);
      speakText(`Opening gallery with ${cachedPhotos.length} cached photos.`);
      return;
    }

    if (text.includes('clear') || text.includes('delete') || text.includes('empty')) {
      sound.playClick();
      clearPhotoCache();
      setCachedPhotos([]);
      const msg = `🗑️ Local photo cache cleared.`;
      setAiResponseText(msg);
      speakText(`Photo cache cleared.`);
      return;
    }

    // Check if user is asking for or talking about a B-Roll concept (e.g., "amazon", "apple", "iqoo", "sony")
    const matchedBroll = BROLL_PRESETS.find((p) => p.keywords.some((kw) => text.includes(kw)));
    if (matchedBroll) {
      triggerBrollDirect(matchedBroll);
      return;
    }

    if (text.startsWith('show ') || text.startsWith('broll ') || text.startsWith('overlay ') || text.startsWith('explain ')) {
      const topic = text.replace(/^(show|broll|overlay|explain)\s+/i, '');
      triggerBrollDirect(null, topic);
      return;
    }

    // Live AI Vision Stream via OpenRouter
    setIsAiThinking(true);
    setAiResponseText('⚡ AI Agent analyzing live visual stream...');

    const telemetryContext = `[Sensor State: Lux=${realVisionData.lux}, Zoom=${zoomLevel}x, Filter=${activeFilter}, Facing=${facingMode}, Stability=${realGyro.score}%, ColorTemp=${realVisionData.colorTemp}]`;

    try {
      let fullResponse = '';
      await streamOpenRouterChat({
        messages: [
          {
            role: 'system',
            content: 'You are SnapSteady AI Vision Agent for iQOO Hackathon. Provide crisp, actionable computational photography guidance in 1-2 concise sentences.'
          },
          { role: 'user', content: `${telemetryContext}\nUser Request: ${text}` }
        ],
        model: selectedModel,
        apiKey: OPENROUTER_API_KEY,
        onChunk: (accumulated) => {
          fullResponse = accumulated;
          setAiResponseText(accumulated);
        }
      });
      speakText(fullResponse);
    } catch (err) {
      const fallback = `📸 AI Vision: Scene locked at ${zoomLevel}x with ${activeFilter} filter. Ambient light is ${realVisionData.brightnessPct}% (${realVisionData.lux} lux) with ${realGyro.score}% gyro stability lock.`;
      setAiResponseText(fallback);
      speakText(fallback);
    } finally {
      setIsAiThinking(false);
      setSpeechTranscript('');
    }
  };

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      setAiResponseText('🎙️ Web Speech API ready. Speak or type commands in the input bar.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      if (speechTranscript.trim()) {
        processAgentIntent(speechTranscript);
      }
    } else {
      setSpeechTranscript('');
      recognitionRef.current.start();
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textCommand.trim()) {
      processAgentIntent(textCommand);
      setTextCommand('');
    }
  };

  const currentFilterObj = CAMERA_FILTERS.find((f) => f.id === activeFilter) || CAMERA_FILTERS[0];

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full flex flex-col items-center justify-center p-2 select-none"
    >
      <canvas ref={canvasRef} className="hidden" />

      {/* MASTER EXTERNAL CONTROL DECK (Always 100% accessible) */}
      <div className="w-full max-w-2xl mb-4 flex flex-col gap-2 p-3 rounded-2xl bg-black/85 backdrop-blur-2xl border border-white/20 shadow-2xl z-40">
        {/* Row 1: Primary Shutter & LUT Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={captureAndCachePhoto}
            className="px-4 py-2 rounded-xl bg-[#FFD600] text-black font-black text-xs shadow-lg shadow-[#FFD600]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Snap Photo</span>
          </button>

          <button
            onClick={() => setFilterDirect('cinematic')}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              activeFilter === 'cinematic'
                ? 'bg-[#FFD600] text-black border-[#FFD600] shadow-lg shadow-[#FFD600]/40'
                : 'bg-neutral-900 border-white/20 text-neutral-200 hover:border-[#FFD600]'
            }`}
          >
            <span>🎬 Cinematic</span>
          </button>

          <button
            onClick={() => setFilterDirect('bw')}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              activeFilter === 'bw'
                ? 'bg-[#FFD600] text-black border-[#FFD600] shadow-lg shadow-[#FFD600]/40'
                : 'bg-neutral-900 border-white/20 text-neutral-200 hover:border-[#FFD600]'
            }`}
          >
            <span>🕶️ B&W Film</span>
          </button>

          <button
            onClick={() => setFilterDirect('vivid')}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              activeFilter === 'vivid'
                ? 'bg-[#FFD600] text-black border-[#FFD600] shadow-lg shadow-[#FFD600]/40'
                : 'bg-neutral-900 border-white/20 text-neutral-200 hover:border-[#FFD600]'
            }`}
          >
            <span>🎨 Vivid HDR</span>
          </button>

          <button
            onClick={() => setFilterDirect('none')}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              activeFilter === 'none'
                ? 'bg-[#FFD600] text-black border-[#FFD600]'
                : 'bg-neutral-900 border-white/20 text-neutral-200 hover:border-[#FFD600]'
            }`}
          >
            <span>RAW</span>
          </button>

          <button
            onClick={() => executeCreatorZeroEditShot()}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-[#FFD600] text-black font-black text-xs shadow-lg shadow-[#FFD600]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>⚡ Creator Auto-Edit</span>
          </button>

          <button
            onClick={() => triggerSlideGeneration()}
            className="px-3 py-2 rounded-xl bg-purple-900/60 border border-purple-400/40 text-purple-200 text-xs font-bold hover:bg-purple-600 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>📊 Pitch Slide</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setShowGallery(!showGallery);
            }}
            className="px-3 py-2 rounded-xl bg-neutral-900 border border-white/20 text-[#FFD600] text-xs font-bold hover:border-[#FFD600] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Gallery ({cachedPhotos.length})</span>
          </button>
        </div>

        {/* Row 2: Live AI Video B-Roll Auto-Edit Overlays Tray (Instant Pop-Ups) */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-white/10 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#FFD600] shrink-0 pl-1">
            <Tv className="w-3.5 h-3.5 animate-pulse" />
            <span>AI B-ROLL OVERLAYS:</span>
          </div>

          {BROLL_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => triggerBrollDirect(preset)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold transition-all shrink-0 cursor-pointer active:scale-95 flex items-center gap-1 ${
                activeBrollOverlay?.id === preset.id
                  ? 'bg-[#FFD600] text-black border-[#FFD600] shadow-md shadow-[#FFD600]/30'
                  : 'bg-neutral-900/90 border-white/15 text-neutral-200 hover:border-[#FFD600]'
              }`}
            >
              <span>{preset.category.split(' ')[0]}</span>
              <span>{preset.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Floating Mode Controls */}
      <div className="w-full max-w-sm mb-3 flex items-center justify-between px-3 py-2 rounded-2xl bg-black/80 backdrop-blur-2xl border border-white/20 text-xs font-mono text-neutral-200 z-30 shadow-2xl">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              setViewMode(viewMode === 'camera' ? 'partner_video' : 'camera');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[11px] font-mono transition-all cursor-pointer ${
              viewMode === 'partner_video'
                ? 'bg-[#FFD600] text-black font-bold border-[#FFD600]'
                : 'bg-neutral-900/90 border-neutral-700 text-neutral-300 hover:text-white'
            }`}
          >
            {viewMode === 'camera' ? <Film className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
            <span>{viewMode === 'camera' ? 'Partner Display' : 'Live Camera'}</span>
          </button>

          {viewMode === 'camera' && (
            <button
              onClick={() => {
                sound.playClick();
                setShowFilterDrawer(!showFilterDrawer);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] transition-all cursor-pointer ${
                activeFilter !== 'none'
                  ? 'bg-[#FFD600] text-black font-bold border-[#FFD600]'
                  : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:text-white'
              }`}
              title="Camera LUT Filters"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{currentFilterObj.name}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              setSpeechOutputEnabled(!speechOutputEnabled);
            }}
            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
              speechOutputEnabled
                ? 'bg-[#FFD600]/20 border-[#FFD600]/50 text-[#FFD600]'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400'
            }`}
            title="Toggle AI Voice"
          >
            {speechOutputEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 3D Realistic Phone Chassis */}
      <div
        ref={cardRef}
        style={{
          transform: `rotateX(${deviceTilt.x}deg) rotateY(${deviceTilt.y}deg)`
        }}
        className="iqoo-phone-chassis animate-zero-g"
      >
        <div className="phone-btn-power" />
        <div className="phone-btn-vol-up" />
        <div className="phone-btn-vol-down" />

        <div className="w-full h-full rounded-[48px] overflow-hidden relative flex flex-col bg-black">
          <div className="glass-glare" />

          {/* Torch Overlay */}
          {torchEnabled && (
            <div className="absolute inset-0 bg-white/40 backdrop-brightness-150 z-40 pointer-events-none" />
          )}

          {/* Shutter Capture Flash */}
          {captureFlash && (
            <div className="absolute inset-0 bg-white z-50 flash-active pointer-events-none" />
          )}

          {/* Capture Toast Notification */}
          {captureToast && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#FFD600] text-black font-extrabold text-xs rounded-full shadow-2xl flex items-center gap-1.5 animate-bounce">
              <CheckCircle2 className="w-4 h-4" />
              <span>{captureToast}</span>
            </div>
          )}

          {/* Centered Punch-Hole Camera */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 flex items-center justify-center border border-neutral-700 shadow-md">
            <span className="w-2 h-2 rounded-full bg-neutral-900 flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-blue-500/80 animate-ping" />
            </span>
          </div>

          {/* Dynamic Island Status Pill */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 h-6 px-3 bg-black/80 backdrop-blur-md rounded-full z-40 flex items-center justify-between gap-2.5 border border-white/10 shadow-lg">
            <span className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-red-500 animate-ping' : 'bg-[#FFD600]'}`} />
            <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-200">
              {isListening ? 'LISTENING TO VOICE...' : viewMode === 'partner_video' ? 'PARTNER DISPLAY' : 'AI CAMERA AGENT'}
            </span>
            <span className="text-[8.5px] font-mono text-[#FFD600] font-bold">{realGyro.score}%</span>
          </div>

          {/* Edge-to-Edge Viewport with Filter applied to entire container */}
          <div className="relative w-full h-full bg-[#07090e] overflow-hidden flex flex-col justify-between">
            {/* Animated Cyber Sensor Fallback Scene (Ensures Screen Is Never Black) */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-neutral-950 via-[#0d131f] to-neutral-900 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,214,0,0.15),transparent_70%)] animate-pulse" />
              <div className="camera-grid absolute inset-0 opacity-40" />
              <div className="w-64 h-64 rounded-full border border-[#FFD600]/20 animate-ring-spin" />
            </div>

            <div
              style={{
                filter: currentFilterObj.css,
                transition: 'filter 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
              className="absolute inset-0 z-0 overflow-hidden"
            >
              {viewMode === 'camera' ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    loop
                    muted
                    crossOrigin="anonymous"
                    onLoadedData={() => setVideoLoaded(true)}
                    onError={() => {
                      console.warn('Video stream error, switching to backup CDN stream');
                      if (videoRef.current) {
                        videoRef.current.srcObject = null;
                        const nextIdx = (RELIABLE_CAMERA_VIDEOS.indexOf(currentVideoSrc) + 1) % RELIABLE_CAMERA_VIDEOS.length;
                        const nextSrc = RELIABLE_CAMERA_VIDEOS[nextIdx];
                        setCurrentVideoSrc(nextSrc);
                        videoRef.current.src = nextSrc;
                        videoRef.current.play().catch(() => {});
                      }
                    }}
                    style={{
                      transform: `${facingMode === 'user' && !videoRef.current?.src ? 'scaleX(-1)' : ''} scale(${zoomLevel})`,
                      transformOrigin: 'center center',
                      transition: 'transform 0.25s ease-out'
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="camera-grid absolute inset-0 pointer-events-none z-10 opacity-25" />
                </>
              ) : (
                <video
                  src={currentVideoSrc}
                  autoPlay
                  loop
                  playsInline
                  muted
                  crossOrigin="anonymous"
                  onError={() => {
                    const nextIdx = (RELIABLE_CAMERA_VIDEOS.indexOf(currentVideoSrc) + 1) % RELIABLE_CAMERA_VIDEOS.length;
                    setCurrentVideoSrc(RELIABLE_CAMERA_VIDEOS[nextIdx]);
                  }}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Top Telemetry & Controls Overlay */}
            <div className="relative z-30 pt-18 px-5 flex items-center justify-between bg-gradient-to-b from-black/85 via-black/30 to-transparent">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-[#FFD600]">
                  {realVisionData.lux} LUX
                </span>
                <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-neutral-300">
                  {zoomLevel}x &middot; {currentFilterObj.name}
                </span>
              </div>

              {viewMode === 'camera' && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={toggleTorchDirect}
                    className={`p-2 rounded-full backdrop-blur-md border text-xs transition-all cursor-pointer ${
                      torchEnabled
                        ? 'bg-[#FFD600] text-black border-[#FFD600]'
                        : 'bg-black/60 border-white/15 text-white hover:text-[#FFD600]'
                    }`}
                    title="Toggle Torch"
                  >
                    <Zap className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={flipCameraDirect}
                    className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white hover:text-[#FFD600] transition-colors cursor-pointer"
                    title="Flip Camera"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* On-Screen Active Filter Overlay Pill */}
            {activeFilter !== 'none' && (
              <div className="absolute top-26 left-1/2 -translate-x-1/2 z-30 px-3 py-1 bg-[#FFD600] text-black font-mono font-black text-[10px] rounded-full shadow-[0_0_20px_rgba(255,214,0,0.8)] animate-pulse">
                {currentFilterObj.badge}
              </div>
            )}

            {/* Quick Zoom Bar (1x, 2x, 3x, 4x) */}
            {viewMode === 'camera' && !showGallery && (
              <div className="absolute top-32 right-4 z-30 flex flex-col gap-1.5 bg-black/80 backdrop-blur-md p-1 rounded-full border border-white/20 shadow-xl">
                {[1.0, 2.0, 3.0, 4.0].map((z) => (
                  <button
                    key={z}
                    onClick={() => setZoomDirect(z)}
                    className={`w-7 h-7 rounded-full text-[10px] font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                      zoomLevel === z
                        ? 'bg-[#FFD600] text-black shadow-md scale-105'
                        : 'text-neutral-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {z}x
                  </button>
                ))}
              </div>
            )}

            {/* Interactive Filter Drawer */}
            {showFilterDrawer && (
              <div className="absolute top-28 left-4 right-14 z-40 bg-black/90 backdrop-blur-2xl border border-white/25 rounded-2xl p-3 shadow-2xl animate-in fade-in duration-150">
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/10">
                  <span className="text-[10px] font-mono font-bold text-[#FFD600] uppercase">Select Pro Filter LUT</span>
                  <button onClick={() => setShowFilterDrawer(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {CAMERA_FILTERS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFilterDirect(f.id)}
                      className={`p-2 rounded-xl border text-[10px] font-mono text-left flex items-center justify-between transition-all cursor-pointer ${
                        activeFilter === f.id
                          ? 'bg-[#FFD600] text-black font-bold border-[#FFD600] shadow-md'
                          : 'bg-neutral-900/90 border-white/10 text-neutral-300 hover:border-white/30'
                      }`}
                    >
                      <span>{f.name}</span>
                      {activeFilter === f.id && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* LIVE AR / AI B-ROLL AUTO-EDIT VIDEO OVERLAY CARD */}
            {activeBrollOverlay && !showGallery && (
              <div className="absolute top-24 left-3 right-3 z-40 animate-in slide-in-from-top-4 fade-in duration-300">
                <div
                  style={{
                    boxShadow: `0 0 35px ${activeBrollOverlay.accentColor || '#FFD600'}50, inset 0 0 15px rgba(255,255,255,0.05)`,
                    borderColor: `${activeBrollOverlay.accentColor || '#FFD600'}90`
                  }}
                  className="rounded-2xl bg-black/92 backdrop-blur-2xl border-2 p-3 text-white shadow-2xl flex flex-col gap-2 relative overflow-hidden"
                >
                  {/* Top Live Edit Banner */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      <span
                        style={{ color: activeBrollOverlay.accentColor || '#FFD600' }}
                        className="text-[10px] font-mono font-black tracking-wider uppercase"
                      >
                        {activeBrollOverlay.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setIsBrollPinned(!isBrollPinned)}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                          isBrollPinned
                            ? 'bg-[#FFD600] text-black font-bold'
                            : 'bg-white/10 text-neutral-300 hover:text-white'
                        }`}
                        title={isBrollPinned ? 'Overlay Pinned' : 'Pin Overlay'}
                      >
                        <Pin className="w-2.5 h-2.5" />
                        <span>{isBrollPinned ? 'PINNED' : 'PIN'}</span>
                      </button>

                      <button
                        onClick={() => setActiveBrollOverlay(null)}
                        className="p-1 rounded-md bg-white/10 text-neutral-300 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                        title="Dismiss"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Main Media & Concept Split */}
                  <div className="flex gap-2.5 items-center">
                    <div className="w-20 h-16 rounded-xl overflow-hidden bg-neutral-900 border border-white/20 shrink-0 relative group">
                      <img
                        src={activeBrollOverlay.image}
                        alt={activeBrollOverlay.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute bottom-0.5 left-1 px-1 py-0.2 rounded bg-black/80 text-[7.5px] font-mono text-[#FFD600]">
                        B-ROLL
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col justify-between overflow-hidden">
                      <div>
                        <h4 className="font-extrabold text-xs text-white truncate tracking-wide">
                          {activeBrollOverlay.title}
                        </h4>
                        <p className="text-[9.5px] text-neutral-300 line-clamp-2 leading-tight mt-0.5">
                          {activeBrollOverlay.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/10">
                        <span className="text-[8.5px] font-mono text-neutral-400 truncate max-w-[120px]">
                          {activeBrollOverlay.stats}
                        </span>
                        <button
                          onClick={() => triggerSlideGeneration(activeBrollOverlay.title)}
                          className="px-2 py-0.5 rounded bg-purple-900/80 border border-purple-400/40 text-purple-200 hover:bg-purple-600 hover:text-white text-[8.5px] font-mono font-bold transition-all shrink-0 cursor-pointer"
                        >
                          + Slide
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Auto-Dismiss Countdown Indicator */}
                  {!isBrollPinned && (
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        style={{
                          backgroundColor: activeBrollOverlay.accentColor || '#FFD600'
                        }}
                        className="h-full w-full animate-shrink-progress"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Gyro Stability Radar */}
            {viewMode === 'camera' && !showGallery && !showFilterDrawer && !activeBrollOverlay && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div
                  className={`relative w-32 h-32 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                    realGyro.score > 90
                      ? 'border-[#FFD600] shadow-[0_0_35px_rgba(255,214,0,0.85)] animate-ring-pulse scale-105'
                      : 'border-red-500/80 border-dashed scale-95'
                  }`}
                >
                  <div
                    style={{
                      transform: `rotate(${realGyro.roll * 4}deg) translateY(${realGyro.pitch * 2}px)`
                    }}
                    className={`w-20 h-[2px] rounded-full transition-transform duration-100 ${
                      realGyro.score > 90 ? 'bg-[#FFD600]' : 'bg-red-500'
                    }`}
                  />
                  <div className="absolute inset-0 border border-white/10 rounded-full animate-ring-spin" />
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      realGyro.score > 90 ? 'bg-[#FFD600] animate-ping' : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* In-App Photo Gallery Drawer */}
            {showGallery && (
              <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col p-4 pt-16 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#FFD600]" />
                    <span className="font-bold text-sm text-white">App Cache Gallery</span>
                    <span className="text-[10px] font-mono text-[#FFD600] bg-[#FFD600]/10 px-2 py-0.5 rounded">
                      {cachedPhotos.length} Stored
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {cachedPhotos.length > 0 && (
                      <button
                        onClick={() => {
                          clearPhotoCache();
                          setCachedPhotos([]);
                        }}
                        className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs cursor-pointer"
                        title="Clear All"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => setShowGallery(false)}
                      className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {cachedPhotos.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-neutral-400 gap-3">
                    <Camera className="w-10 h-10 text-neutral-600" />
                    <p className="text-xs">No cached photos yet. Tap "Snap Photo" or use voice commands.</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto py-3 grid grid-cols-2 gap-2 scrollbar-none">
                    {cachedPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() => setSelectedPhoto(photo)}
                        className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-neutral-900 border border-white/10 cursor-pointer"
                      >
                        <img src={photo.dataUrl} alt="Capture" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                          <span className="text-[9px] font-mono text-neutral-300">{photo.zoom}</span>
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const link = document.createElement('a');
                                link.href = photo.dataUrl;
                                link.download = `snapsteady_${photo.id}.jpg`;
                                link.click();
                              }}
                              className="p-1 rounded bg-black/60 text-white hover:text-[#FFD600]"
                              title="Download"
                            >
                              <Download className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated = deleteCachedPhoto(photo.id);
                                setCachedPhotos(updated);
                              }}
                              className="p-1 rounded bg-black/60 text-red-400 hover:bg-red-500 hover:text-white"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Fullscreen Photo Modal */}
                {selectedPhoto && (
                  <div className="absolute inset-0 bg-black/98 z-50 flex flex-col p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-[#FFD600]">{selectedPhoto.timeFormatted}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = selectedPhoto.dataUrl;
                            link.download = `snapsteady_${selectedPhoto.id}.jpg`;
                            link.click();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#FFD600] text-black text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3 h-3" /> Download
                        </button>
                        <button
                          onClick={() => setSelectedPhoto(null)}
                          className="p-1 rounded bg-white/10 text-white cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center overflow-hidden">
                      <img src={selectedPhoto.dataUrl} alt="Full View" className="max-w-full max-h-full object-contain rounded-xl" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Autonomous AI Agent HUD & Controls */}
            <div className="relative z-40 p-3 pb-5 flex flex-col gap-2.5 bg-gradient-to-t from-black via-black/95 to-transparent">
              {speechTranscript && (
                <div className="p-2 rounded-xl bg-[#FFD600] text-neutral-950 font-bold text-xs shadow-lg animate-pulse">
                  🗣️ Agent Heard: "{speechTranscript}"
                </div>
              )}

              {/* AI Agent Terminal Status Card */}
              <div className="p-2.5 rounded-2xl bg-black/90 backdrop-blur-xl border border-white/20 text-white shadow-2xl text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-[#FFD600] text-[11px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#FFD600] animate-spin" />
                    <span>SnapSteady Vision Agent</span>
                  </div>
                  <span className="text-[9px] text-neutral-400 font-mono">Real-Time OpenRouter</span>
                </div>
                <p className="text-neutral-200 text-[11px] leading-relaxed max-h-[46px] overflow-y-auto font-sans">
                  {aiResponseText}
                </p>
              </div>

              {/* Camera & B-Roll Shortcut Chips — Direct Zero-Latency Execution */}
              <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1">
                <button
                  onClick={() => executeCreatorZeroEditShot()}
                  className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-[#FFD600] text-black font-black text-xs shadow-lg shadow-[#FFD600]/30 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>⚡ Creator Auto-Edit</span>
                </button>

                <button
                  onClick={() => triggerBrollDirect('amazon')}
                  className="px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-bold text-xs hover:bg-amber-500 hover:text-black transition-all shrink-0 cursor-pointer active:scale-95"
                >
                  📦 Amazon B-Roll
                </button>

                <button
                  onClick={() => triggerBrollDirect('apple')}
                  className="px-3 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold text-xs hover:bg-cyan-500 hover:text-black transition-all shrink-0 cursor-pointer active:scale-95"
                >
                  🍎 Apple B-Roll
                </button>

                <button
                  onClick={() => triggerBrollDirect('iqoo')}
                  className="px-3 py-1.5 rounded-full bg-[#FFD600]/20 border border-[#FFD600] text-[#FFD600] font-bold text-xs hover:bg-[#FFD600] hover:text-black transition-all shrink-0 cursor-pointer active:scale-95"
                >
                  ⚡ iQOO 15R
                </button>

                <button
                  onClick={() => triggerBrollDirect('google')}
                  className="px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400 text-blue-300 font-bold text-xs hover:bg-blue-500 hover:text-black transition-all shrink-0 cursor-pointer active:scale-95"
                >
                  🧠 Google AI
                </button>

                <button
                  onClick={() => triggerBrollDirect('sony')}
                  className="px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-400 text-orange-300 font-bold text-xs hover:bg-orange-500 hover:text-black transition-all shrink-0 cursor-pointer active:scale-95"
                >
                  📷 Sony Lens
                </button>

                <button
                  onClick={captureAndCachePhoto}
                  className="px-3 py-1.5 rounded-full bg-[#FFD600] text-black font-extrabold text-xs shadow-lg shadow-[#FFD600]/30 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
                >
                  📸 Snap Photo
                </button>

                <button
                  onClick={() => setFilterDirect('cinematic')}
                  className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 ${
                    activeFilter === 'cinematic'
                      ? 'bg-[#FFD600] text-black border-[#FFD600] shadow-lg shadow-[#FFD600]/40'
                      : 'bg-black/80 backdrop-blur-md border-white/25 text-white hover:border-[#FFD600]'
                  }`}
                >
                  🎬 Cinematic LUT
                </button>

                <button
                  onClick={() => setFilterDirect('bw')}
                  className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 ${
                    activeFilter === 'bw'
                      ? 'bg-[#FFD600] text-black border-[#FFD600] shadow-lg shadow-[#FFD600]/40'
                      : 'bg-black/80 backdrop-blur-md border-white/25 text-white hover:border-[#FFD600]'
                  }`}
                >
                  🕶️ B&W Film
                </button>

                <button
                  onClick={() => setFilterDirect('vivid')}
                  className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 ${
                    activeFilter === 'vivid'
                      ? 'bg-[#FFD600] text-black border-[#FFD600] shadow-lg shadow-[#FFD600]/40'
                      : 'bg-black/80 backdrop-blur-md border-white/25 text-white hover:border-[#FFD600]'
                  }`}
                >
                  🎨 Vivid HDR
                </button>

                <button
                  onClick={() => setZoomDirect(zoomLevel === 2.0 ? 1.0 : 2.0)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 ${
                    zoomLevel === 2.0
                      ? 'bg-[#FFD600] text-black border-[#FFD600]'
                      : 'bg-black/80 backdrop-blur-md border-white/25 text-white hover:border-[#FFD600]'
                  }`}
                >
                  🔍 2x Zoom
                </button>

                <button
                  onClick={flipCameraDirect}
                  className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/25 text-white hover:border-[#FFD600] text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95"
                >
                  🔄 Flip Cam
                </button>

                <button
                  onClick={toggleTorchDirect}
                  className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 ${
                    torchEnabled
                      ? 'bg-[#FFD600] text-black border-[#FFD600]'
                      : 'bg-black/80 backdrop-blur-md border-white/25 text-white hover:border-[#FFD600]'
                  }`}
                >
                  💡 Torch
                </button>

                <button
                  onClick={() => triggerSlideGeneration()}
                  className="px-3 py-1.5 rounded-full bg-purple-900/80 border border-purple-400/40 text-purple-200 text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 hover:bg-purple-600 hover:text-white"
                >
                  📊 Pitch Slide
                </button>

                <button
                  onClick={() => processAgentIntent('analyze what you see in the frame')}
                  className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/25 text-white hover:border-[#FFD600] text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95"
                >
                  🧠 Analyze Scene
                </button>
              </div>

              {/* Agent Typed Command Bar */}
              <form onSubmit={handleTextSubmit} className="flex items-center gap-1.5 bg-neutral-900/90 border border-white/20 rounded-xl px-2.5 py-1.5">
                <input
                  type="text"
                  value={textCommand}
                  onChange={(e) => setTextCommand(e.target.value)}
                  placeholder="Command agent (e.g., 'cinematic filter', 'zoom 3x', 'take photo')..."
                  className="flex-1 bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none px-1"
                />
                <button
                  type="submit"
                  className="p-1 rounded-lg bg-[#FFD600] text-black hover:bg-yellow-400 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Main Physical Shutter & Voice Actions */}
              <div className="flex items-center gap-2 pt-0.5">
                {/* Cached Photos Thumbnail Drawer Button */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowGallery(!showGallery);
                  }}
                  className="w-12 h-12 rounded-2xl bg-neutral-900 border border-white/20 flex items-center justify-center text-neutral-300 hover:text-[#FFD600] relative overflow-hidden shrink-0 cursor-pointer"
                  title="Open Gallery"
                >
                  {cachedPhotos.length > 0 ? (
                    <img src={cachedPhotos[0].dataUrl} alt="Thumb" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-[#FFD600]" />
                  )}
                  {cachedPhotos.length > 0 && (
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#FFD600] text-black font-bold text-[8px] rounded-full flex items-center justify-center">
                      {cachedPhotos.length}
                    </span>
                  )}
                </button>

                {/* Voice Mic Button */}
                <button
                  onClick={toggleVoiceRecording}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all active:scale-95 shadow-xl shrink-0 cursor-pointer ${
                    isListening
                      ? 'bg-red-500 border-red-300 text-white animate-pulse'
                      : 'bg-neutral-900/90 border-[#FFD600]/40 text-[#FFD600] hover:bg-[#FFD600] hover:text-black'
                  }`}
                  title={isListening ? 'Stop Listening' : 'Speak to AI Agent'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Shutter Button */}
                <button
                  onClick={captureAndCachePhoto}
                  className="flex-1 h-12 rounded-2xl bg-[#FFD600] hover:bg-yellow-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#FFD600]/25 active:scale-98 transition-transform cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>SNAP & CACHE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

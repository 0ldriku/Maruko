import WaveSurfer from '/node_modules/wavesurfer.js/dist/wavesurfer.js';
import RegionsPlugin from '/node_modules/wavesurfer.js/dist/plugins/regions.esm.js';

// Create an instance of WaveSurfer
const ws = WaveSurfer.create({
  container: document.body,
  waveColor: 'rgb(200, 0, 200)',
  progressColor: 'rgb(100, 0, 100)',
  url: '/static/audio/en_example.wav',
  minPxPerSec: 50,
  interact: false,
});

// Initialize the Regions plugin
const wsRegions = ws.registerPlugin(RegionsPlugin.create());

// Find regions separated by silence
const extractRegions = (audioData, duration) => {
  const minValue = 0.01;
  const minSilenceDuration = 0.5;
  const mergeDuration = 0.2;
  const scale = duration / audioData.length;
  const silentRegions = [];

  // Find all silent regions longer than minSilenceDuration
  let start = 0;
  let end = 0;
  let isSilent = false;
  for (let i = 0; i < audioData.length; i++) {
    if (audioData[i] < minValue) {
      if (!isSilent) {
        start = i;
        isSilent = true;
      }
    } else if (isSilent) {
      end = i;
      isSilent = false;
      if (scale * (end - start) > minSilenceDuration) {
        silentRegions.push({ start: scale * start, end: scale * end });
      }
    }
  }

  // Merge silent regions that are close together
  const mergedRegions = [];
  let lastRegion = null;
  for (let i = 0; i < silentRegions.length; i++) {
    if (lastRegion && silentRegions[i].start - lastRegion.end < mergeDuration) {
      lastRegion.end = silentRegions[i].end;
    } else {
      lastRegion = silentRegions[i];
      mergedRegions.push(lastRegion);
    }
  }

  return mergedRegions;
};

// Create regions for each silent part of the audio
ws.on('decode', (duration) => {
  const decodedData = ws.getDecodedData();
  if (decodedData) {
    const regions = extractRegions(decodedData.getChannelData(0), duration);
    // Add regions to the waveform
    regions.forEach((region, index) => {
      wsRegions.addRegion({
        start: region.start,
        end: region.end,
        content: (index + 1).toString(), // Set content to the index plus one
        drag: true,
        resize: true,
      });
    });
  }
});

// Play a region on click
let activeRegion = null;
wsRegions.on('region-clicked', (region, e) => {
  e.stopPropagation();
  region.play();
  activeRegion = region;
});

ws.on('timeupdate', (currentTime) => {
  // When the end of the region is reached
  if (activeRegion && currentTime >= activeRegion.end) {
    // Stop playing
    ws.pause();
    activeRegion = null;
  }
});

// Add event listener for the 'Delete' key press
document.addEventListener('keydown', (e) => {
  if (e.key === 'Delete' && activeRegion) {
    deleteActiveRegion();
  }
});

// Function to delete the active region
const deleteActiveRegion = () => {
  if (activeRegion) {
    activeRegion.remove();
    activeRegion = null;
  }
};

// Function to save regions to a CSV file
const saveRegionsToCSV = () => {
  const regions = wsRegions.getRegions();
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    'Start,End,Content\n' +
    regions.map((region) => `${region.start},${region.end},${region.content}`).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'regions.csv');
  document.body.appendChild(link);
  link.click();
};

// Add event listener for the 'Save Regions' button click
const saveRegionsBtn = document.getElementById('save-regions-btn');
saveRegionsBtn.addEventListener('click', saveRegionsToCSV);


// Function to add a pause boundary
const addPauseBoundary = () => {
  const currentTime = ws.getCurrentTime();
  const region = {
    start: currentTime,
    end: currentTime + 0.5, // Adjust the duration as needed
    content: 'Pause',
    drag: true,
    resize: true,
  };
  wsRegions.addRegion(region);
};

// Add event listener for the 'Add Pause Boundary' button click
const addPauseBtn = document.getElementById('add-pause-btn');
addPauseBtn.addEventListener('click', addPauseBoundary);
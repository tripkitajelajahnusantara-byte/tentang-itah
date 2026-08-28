const fs = require('fs');
const path = require('path');

function generateWav(frequency, durationSeconds, sampleRate = 22050) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 2);
  const blockAlign = numChannels * (bitsPerSample / 2);
  
  const numSamples = sampleRate * durationSeconds;
  const dataSize = numSamples * blockAlign;
  const fileSize = 44 + dataSize;
  
  const buffer = Buffer.alloc(fileSize);
  
  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(fileSize - 8, 4);
  buffer.write('WAVE', 8);
  
  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Chunk size
  buffer.writeUInt16LE(1, 20);  // PCM format
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  
  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  
  // Write sine wave samples with simple attack/decay envelope for a chime sound
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    
    // Envelope: rapid attack, smooth exponential decay
    const attack = Math.min(1, t / 0.05);
    const decay = Math.exp(-t * 2.0);
    const envelope = attack * decay;
    
    // Combine primary frequency + perfect fifth harmony + octave harmonic
    // This gives a nice warm, rich bell/chime like sound
    const wave = 0.5 * Math.sin(2 * Math.PI * frequency * t) +
                 0.3 * Math.sin(2 * Math.PI * (frequency * 1.5) * t) +
                 0.2 * Math.sin(2 * Math.PI * (frequency * 2) * t);
                 
    const sample = Math.round(wave * envelope * 32767);
    buffer.writeInt16LE(sample, offset);
    offset += 2;
  }
  
  return buffer;
}

const dir = path.join(__dirname, '../public/audio');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

// Generate different frequencies for different words to sound friendly and distinct!
const files = {
  'itah.mp3': 523.25,           // C5 note (warm high chime)
  'kueh.mp3': 587.33,           // D5
  'danum.mp3': 659.25,          // E5
  'kuman.mp3': 783.99,          // G5
  'mihop.mp3': 880.00,          // A5
  'penda.mp3': 587.33,          // D5
  'danum-bakumpai.mp3': 659.25, // E5
  'kakah.mp3': 523.25,          // C5
  'nupi.mp3': 783.99,           // G5
  'legenda-tangkiling.mp3': 349.23, // F4 (longer epic sound for folklore)
  'legenda-malawen.mp3': 392.00,    // G4
};

for (const [filename, freq] of Object.entries(files)) {
  const duration = filename.startsWith('legenda') ? 3.0 : 1.5;
  const wavBuffer = generateWav(freq, duration);
  fs.writeFileSync(path.join(dir, filename), wavBuffer);
  console.log(`Generated sample chime sound for ${filename} at ${freq}Hz`);
}

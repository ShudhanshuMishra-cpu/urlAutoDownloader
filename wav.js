import('node-mic').then(({ default: Mic }) => {
    const fs = require('fs');
    const wav = require('node-wav');
  
    const filePath = 'output.wav';
  
    const micInstance = new Mic({ rate: '16000', channels: '1', debug: false, exitOnSilence: 6 });
  
    const outputFileStream = fs.createWriteStream(filePath);
  
    micInstance.getAudioStream()
      .pipe(outputFileStream);
  
    micInstance.start();
  
    console.log('Recording audio... Press Ctrl+C to stop.');
  
    process.on('SIGINT', () => {
      console.log('\nRecording stopped.');
  
      micInstance.stop();
  
      outputFileStream.end();
  
      const buffer = fs.readFileSync(filePath);
      const result = wav.decode(buffer);
  
      fs.writeFileSync(filePath + '.wav', wav.encode(result.channelData, { sampleRate: result.sampleRate, float: false, bitDepth: 16 }));
  
      console.log(`Audio saved as ${filePath}.wav`);
    });
  }).catch(error => {
    console.error('Error:', error);
  });
  
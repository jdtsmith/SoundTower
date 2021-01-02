FIFO_PATH='/tmp/soundtower' # Get from Config somewhere
inputMethod='spsfifo'
SAMPLE_RATE=44100 # [Hz] sample rate of incoming audio
nOctaves=7 # Number of octaves to cover
nNotes=12 # Number of notes per octave
nDownSamp=3 # Number of samples to mean-downsample  (e.g. 3->14.7kHz sampling)
nSamples=768 # Number of samples to read in a "block" (e.g. 768 is 17.4ms worth)
nBlocks=[1,4,8] # Multi-resolution FFT blocks to accumulate and down-sammple

nLED=150
nLEDRow=15.5

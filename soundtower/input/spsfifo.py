import aiofiles
from soundtower.common.config import nSamples,FIFO_PATH
import numpy as np

# Async Generator to Read from Shairport-Sync pipe output
# (output_backend = "pipe"; also consider playback_mode = "mono";
# ignore_volume_control = "yes";)
# Data is 16bit little endian integers (S16LE)
async def read():
    nBytes=nSamples*2*2 # 2 16bit ints
    block=np.empty(2*nSamples,dtype='<i2') 
    mblock=memoryview(block)

    async with aiofiles.open(FIFO_PATH, mode='rb') as fp: # Blocks until writer opens
        read=0
        while True:
            read += await fp.readinto(mblock[read:])
            if read>=nBytes:
                read=0
                yield block[::2] # Just take L channel (mono)
            elif read==0:
                raise BrokenPipeError("Shairport-sync pipe closed")


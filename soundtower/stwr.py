FIFO_PATH='/tmp/soundtower' # Get from Config somewhere
# PCM format:  16 bit signed, little endian, 44,100 samples, interleaved (LRLRLR)

# app

async def run():
    await asyncio.gather(XXX,YYY)
    

def main():
    # Gather aiofile Pipe reader(s), WebUI (with WS), hook them to
    # main soundtower package (which is not async, but is being
    # "driven" by the async pipe reader).  
    asyncio.run(run())



# Write option sets to named JSON file in a given directory:
import os
stDir=os.path.expanduser('~/.soundtower')
os.makedirs(stDir, exist_ok=True)
name='foo'                     # E.g.
with open(path.join(dr,f'{name}.json')) as outfile:
    json.dump(options, outfile)    


# web sockets; serve a small webserver send it async websockets
# Specify address like:
#var socket = new WebSocket("ws://" + location.host + "/whatever");
# NO, using aiohttp's WSs instead
# Sending DRGB (but need DRGBW!)


import socket
    
UDP_IP_ADDRESS = "192.168.8.166"
UDP_PORT_NO = 21324
v = [2, 2, 255, 0, 0, 0, 255, 0, 0, 0, 255]
Message = bytes(v)

clientSock = socket.socket (socket.AF_INET, socket.SOCK_DGRAM)
clientSock.sendto (Message, (UDP_IP_ADDRESS, UDP_PORT_NO))

N=1024
nsamp=2                         # Base level mean-based rebinning binsize
blocks=[1,2,8]              # Multi-resolution, number of blocks
nBlock=N//nsamp                 # Rebinned block size

# Pre-allocate
mBlocks=np.zeros((len(blocks),nBlock),dtype=np.int16)
def stageBlock(block):
    for i,nb in enumerate(blocks):
        n=nBlock//nb
        r=len(block)//n
        block=rebinMean(block,r)
        if nb==1:
            mBlocks[i]=block
        else:
            mBlocks[i,:-n]=mBlocks[i,n:] # Shift
            mBlocks[i,-n:]=block # Accumulate


SAMPLE_RATE=44100 # Hz
baseFreq=55 # Hz, =A1
numOctaves=7
notesPerOctave=12
allnotes=baseFreq * 2**(np.arange(numOctaves*notesPerOctave+1)/notesPerOctave) 


# reshape/mean along axis (5x faster than numpy version)
from numba import njit
@njit
def rebinMean(block,nbin):
    nout=len(block)//nbin
    out=np.zeros(nout,dtype=np.int32)
    for i in range(nout):
        for j in range(nbin): out[i]+=block[nbin*i+j]
        if out[i]<0 and out[i]%2: out[i]+=1  # always average towards zero
        out[i]/=nbin
    return(out)

with open(FIFO_PATH,'rb') as fifo:
    while True:
        select.select([fifo],[],[fifo])
        data = fifo.read(N)
        do_work(data)

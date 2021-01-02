import importlib
from soundtower.common.config import inputMethod
import asyncio
import numpy as np
import time

class TESTINP:
    def __init__(self):
        self.readSamples=importlib.import_module("soundtower.input." + inputMethod).read
        self.block=None
        self.new=False
        self.cnt=0

    async def main(self):
        await asyncio.gather(self.read(),self.otherStuff())
        
    async def read(self):
        async for block in self.readSamples():
            self.block=block
            self.cnt+=1
            
    async def otherStuff(self):
        self.t0=time.perf_counter()
        while True:
            await asyncio.sleep(1)
            if self.cnt>0:
                self.rate=self.cnt/(time.perf_counter()-self.t0)
                print("Got block {}, {} at {:0.1f}Hz".format(self.block.shape,self.block[0:10],self.rate))
                print("current block: ",
                      np.min(self.block),np.median(self.block),np.mean(self.block),np.max(self.block))
                self.cnt=0
                self.t0=time.perf_counter()

if __name__=="__main__":
    try:
        asyncio.run(TESTINP().main())
    except KeyboardInterrupt:
        print('Keyboard Interrupt, exiting')






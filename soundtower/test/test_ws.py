from aiohttp import web, WSMsgType,WSCloseCode
import weakref

class Handler:
    CONTROLS={"colors": ["red","green","blue"]}
    nOctaves,nNotes,bottomFreq=(7,12,55)
    
    def __init__(self):
        self.ws=None

    async def octaves(self,request):
         print("returning octaves:",self.nOctaves,",",self.nNotes)
         return web.json_response({x:getattr(self,x) for x in ("bottomFreq","nOctaves","nNotes")})
        
    async def controls(self,request):
        print("returning controls: ",self.CONTROLS)
        return web.json_response(self.CONTROLS)
        
    async def settings(self,request):
        data = await request.json()
        print(type(data),'; ',data)
        return web.Response(text='OK')

    async def logfreqs(self,request):
        return web.json_response({'logfreqs':range(100)})  # XXX Return frequencies of MRFFT points
    
    async def root_handler(self,request):
        return web.HTTPFound('/soundtower.html')  # redirect

    async def websocket_handler(self,request):
        ws = web.WebSocketResponse()
        ws.prepare(request)
        request.app['sockets'].add(ws)

        try:
            async for msg in ws: # close is auto-handled
                if msg.type == WSMsgType.ERROR:
                    print('ws connection closed with exception %s' %
                          self.ws.exception())
        finally:
            request.app['sockets'].discard(ws)

        
    
app = web.Application()
app['sockets']=weakref.WeakSet()

async def on_shutdown(app):
    for ws in set(app['sockets']):
        await ws.close(code=WSCloseCode.GOING_AWAY,
                       message='Server shutdown')

app.on_shutdown.append(on_shutdown)
handler=Handler()
from itertools import chain
routes=chain((web.get('/'+x,getattr(handler,x)) for x in ('controls','octaves','logfreqs')),
             (web.post('/'+x,getattr(handler,x)) for x in ('settings',)),
             [web.get('/',handler.root_handler),
              web.static('/',path='../static')
              web.get('/ws', handler.websocket_handler)])
app.add_routes(routes)
web.run_app(app)

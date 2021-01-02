import {range,noteScale,logFreqs} from './common'

// SVG Utilities
function createSVG(type) {
  return document.createElementNS("http://www.w3.org/2000/svg",type)
}
function lineSVG(start,end,cls) {	
  let line=createSVG('line')	
  line.setAttribute("x1",start[0]); line.setAttribute("y1",start[1])
  line.setAttribute("x2",end[0]); line.setAttribute("y2",end[1])
  line.setAttribute("class",cls)
  return line
}
function textSVG(pos,text) {
  let txt = createSVG('text')
  txt.setAttribute('x', pos[0])
  txt.setAttribute('y', pos[1])
  txt.textContent = text
  return txt
}

export class SpectrumGraph {
  constructor() {
    this.axes=document.getElementById('bottom-axes') // svg
    this.spectrum=document.getElementById('spectrum') // canvas
    let spstyle=window.getComputedStyle(this.spectrum)
    this.spectrum.width=parseInt(spstyle.width)
    this.spectrum.height=parseInt(spstyle.height)

    this.ctx=this.spectrum.getcontext("2d");
  }

  init() {
    this.colorOctaves();
    this.drawSVGAxes();
    
    // Update SVG height to wrap axes
    let bbox=this.axes.getBBox()
    this.axes.setAttribute('height',bbox.y+bbox.height+1)
  }

  drawUpdate(update) {
    this.ctx.clearRect(0, 0, this.spectrum.width, this.spectrum.height)
    this.drawMRFFT(update.mrfft)
    this.drawPeaks(update.peaks)
    this.drawVolume(update.volume)
  
  //---- drawMRFFT: draw from uint16 dataview
  drawMRFFT(data) {
    this.ctx.beginPath()
    ...
  }
  
  //---- colorOctaves: Set rainbow background of spectrum canvas
  colorOctaves() {
    this.spectrum.style.setProperty("--stripe",`calc(100%/${nOctaves*nNotes})`)
    let v="var(--stripe)",
	lgt=[86,72,55],
	hsl=(j,l) => `hsl(${j*300/(nNotes-1)},50%,${l}%)`,
	rainbow=[...Array(noteScale.nNotes)].map((_,i) => {
	  let l = (i==noteScale.nNotes-1?lgt[2]:lgt[1])
	  return `${hsl(i,lgt[0])} calc(${i}*${v}), ${hsl(i,lgt[0])} calc(${i+1}*${v} - 1px),` +
	    `${hsl(i+0.5,l)} calc(${i+1}*${v} - 1px), ${hsl(i+0.5,l)} calc(${i+1}*${v})`
	}).join(",")
    this.spectrum.style.background=`repeating-linear-gradient(to right,${rainbow})`
  }

  //---- drawSVGAxes: Draw two axes, aligning with the canvas above
  drawSVGAxes() {
    let halfNoteFac=2**(1/noteScale.nNotes/2),
	low=bottomFreq/halfNoteFac,
	high=bottomFreq * 2**nOctaves / halfNoteFac,
	llow=Math.log10(low),lhigh=Math.log10(high),
	lowDecade=Math.ceil(llow),highDecade=Math.floor(lhigh),
	labels,ticks,subticks=[],
	xoff=parseInt(window.getComputedStyle(this.axes).width)-this.spectrum.width

    //Freq Axis 
    ticks=range(lowDecade,highDecade+1).map(v=>(v-llow)/(lhigh-llow))
    labels=range(lowDecade,highDecade+1).map(v=>Math.pow(10,v).toString())
    for (let d=lowDecade-1;d<=highDecade;d++) {
      for (let st of range(2,10).map(v=>d + Math.log10(v))) {
	if ((d>=lowDecade && d<highDecade) || (st >= llow && st <= lhigh)) {
	  subticks.push((st-llow)/(lhigh-llow))
	}
      }
    }
    this.drawSVGAxis([xoff,1],[xoff+canvasSize[0],1],ticks,labels,7,
		     subticks,4,'xaxis freq')

    // Note label axis (fixed freqs; C1=9 semi-tones below A1@55Hz, lowest note)
    let logNoteDel=Math.log10(2**(1/12)), C1=Math.log10(55)-9*logNoteDel,
	bbox=axes.getBBox(), ynext=bbox.y+bbox.height+1
    labels=[],ticks=[]
    for (let o of range(1,nOctaves+2)) {
      for (let [i, n] of [0,5,9].entries()) {
	let logf = C1 + logNoteDel*(n+(o-1)*12)
	if (logf>=llow && logf<=lhigh) {
	  labels.push('CFA'[i]+o)
	  ticks.push((logf-llow)/(lhigh-llow))
	}
      }
    }
    this.drawSVGAxis([xoff,ynext],[xoff+canvasSize[0],ynext],ticks,labels,4,[],null,'xaxis notes')
  }

  //---- drawSVGAxis: Draw a single axis from start to finish ([x,y]),
  //---- adding ticks (array in [0..1]) and matching labels with
  //---- length tlen (pixels), and subticks with length subtlen.
  //---- Label the group as aclass.
  drawSVGAxis(start,finish,ticks,labels,tlen,subticks,subtlen,aclass) { // fractional ticks in [0..1]
    let g=createSVG('g'),
	delta=finish.map((v,i) => v-start[i]),
	dlen=Math.sqrt(delta.reduce((c,v) => c+v**2,0.)),
	tslope=[-delta[1]/dlen,delta[0]/dlen] // tickmark slope (unit)
    
    g.setAttribute("class",aclass)
    g.appendChild(lineSVG(start,finish,'spine'))
    for (const [i, t] of ticks.entries()) {
      let tstart=start.map((v,i)=> v + t*delta[i])
      let tend=tstart.map((v,i)=> v + tlen * tslope[i])
      g.appendChild(lineSVG(tstart,tend,'tick'))
      g.appendChild(textSVG(tend,labels[i]))
    }
    for (const [i, t] of subticks.entries()) {
      let tstart=start.map((v,i)=> v + t*delta[i])
      let tend=tstart.map((v,i)=> v + subtlen * tslope[i])
      g.appendChild(lineSVG(tstart,tend,'subtick'))
    }
    this.axes.appendChild(g);
  }
}

import {logFreqs,noteScale} from './common'

// Control: REST communication with the server (params & settings)
export class Control {
  async init() {
    await this.getNoteScale()
    await this.buildControls()
    await this.getLogFreqs()
  }

  async getNoteScale() {
    const resp=await fetch('/octaves')
    if (!resp.ok) {
      const message = `An error has occured: ${resp.status}`
      throw new Error(message);
    }
    Object.assign(noteScale,await resp.json())
  }

  async buildControls() {
    const resp=await fetch('/controls')
    if (!resp.ok) {
      const message = `An error has occured: ${resp.status}`
      throw new Error(message);
    }
    const ctrls=await resp.json();
    for (const [name,options] of Object.entries(ctrls)) {
      console.log(name);
      let id=document.getElementById(name)
      if (id) {
	for (option of options) {
	  console.log(option);
	  let opt = document.createElement("option")
	  opt.text=option
	  id.add(opt)
	}
      }
    }
  }

  async getLogFreqs() {
    const resp=await fetch('/logfreqs')
    if (!resp.ok) {
      const message = `An error has occured: ${resp.status}`
      throw new Error(message);
    }
    logFreqs=await resp.json().logfreqs;
  }
  
  async submitColor() {
    data=JSON.stringify({
      color: document.getElementById('colors').value,
    })
    
    const resp=await fetch('/settings',{
      method: 'POST',
      body: data
    });
    if (!resp.ok) {
      const message = `An error has occured: ${resp.status}`
      throw new Error(message)
    }
  }
}

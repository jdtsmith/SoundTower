import {SpectrumGraph} from './spectrum_graph'
import {Control} from './control'
import {FireHose} from './firehose'

async function main() {
  let sg=new SpectrumGraph(),ctrl=new Control(),fh=new FireHose();
  await ctrl.init()
  sg.init()
  await fh.init()
}

main()


import React, { Component } from 'react'
import Link from 'next/link'
import Script from 'react-load-script'
import Widget from '../widget/index.js'
import moment from 'moment'
import Steper from '../common/Steper.js'
import Texts from '../hoc/texts.js'
import { md2Html } from '../hoc/utils'
import hljs from 'highlight.js'



const snippet = `<html>
  <head>
    <script src="https://unpkg.com/sdk33@latest"></script>
  </head>
  <body>
    <script type="text/javascript">
      function PayWithBitcoin(){
        sdk33.payInvoice('invoiceID', status => {
          if(status == 'success') doSomething()
        })
      }
    </script>

    <a onclick="PayWithBitcoin()">
      Click to Pay
    </a>
  </body>
</html>`

const fakeWallet = {
  "id": "x",
  "name": "The Moon ☾ Shop",
  "ticker": "mbtc",
  "fiat": "eur",
}

const fakeInvoice = {
  "id": "x",
  "status": "confirmed",
  "confs": 1,
  "eat": new Date("2018-01-31T22:36:16.981Z"),
  "cat": new Date("2018-01-31T22:19:16.981Z"),
  "address": "1QGvKNozPkQRpdNcSz2q5fUWEQASHciZLt",
  "price": {
    "satoshis": 9000000,
    "btc": 0.09,
    "mbtc": 90,
    "fiat": 72835,
    "unit": 809288,
    "fiat_formated": "728,35€",
    "unit_formated": "8.092,88€",
    "ticker": "satoshis",
    "fiat_ticker": "eur",
    "ts": 1517437187830
  },
  "tx": {
    "satoshis": 9000000,
    "index": 0,
    "txhash": "787bd71de4ac28063e1f85533019e36128b33e7c94a4a7654cc74a382bfb59e5",
    "blockhash": "00000000000001806d0ed0f6c6ca796de1e49950aebbe06ba414145a4654c0d0",
    "ts": 1517437345,
    "height": 1
  }
}


const highlight = () => {
 $('pre code').each(function(i, block) {
    hljs.highlightBlock(block)
  })
}

export default class Home extends Component {

  state = { 
      widgetReady: false
    , widgetStatus: 'pending'
  }

  componentDidMount() {
    highlight()
  }


  render() {

    const { widgetReady, widgetStatus } = this.state
    const statuses = ['pending','received','confirmed']

    const onWidget = () => {
      this.setState({ widgetReady: true })
    }

    const onStatus = (status) => {
      this.setState({ widgetStatus: status })
      $('.snippet .hljs-comment').html(`// ${status}`)
    }


    return (<div>

      <div className="bg-dark text-light py-5">

        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h2 className="m-5 pb-5">{Texts.t('hero')}</h2>

              <div className="lead mb-5">{Texts.t('subhero')}</div>
            </div>
          </div>
        </div>

        
        <div className="container">
          <div className="row">
            <div className="col-12 text-left">
              <h2 className="mt-5">Manifesto</h2>
              <div className="line mb-4" />
              <div className="">{Texts.md('what')}</div>
            </div>
          </div>
        </div>

       
        

        <div className="container">
          <div className="row">
            <div className="col-12 text-left  py-5">
              <h2 className="">UX included</h2>
              <div className="line mb-4" style={{width: '100px'}} />
              <div className="">{md2Html(Texts.t('ux'))}</div>
            </div>
            <div className="col-12 text-center">
              <div className="px-5 mx-auto my-5 noselect" style={{maxWidth:'400px'}}>
                <Steper 
                  step={statuses.indexOf(widgetStatus)} 
                  steps={statuses} 
                  title={(step, i)=>`${step}`}
                  onStep={step=>{ onStatus(step) }} 
                />
              </div>

            </div>
            <div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
              <div data-aos="fade-right" data-aos-offset="200"  data-aos-anchor-placement="top-bottom">
                <div className={`${widgetReady?'d-none d-md-block':'d-none'}`}>
                  <div className="snippet">
                    <pre><code >{snippet}</code></pre>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div data-aos="fade-left" data-aos-offset="200"  data-aos-anchor-placement="top-bottom">
                <Widget 
                  status={widgetStatus} 
                  onLoad={onWidget.bind(this)}
                  invoiceId='x' 
                  invoice={fakeInvoice}
                  tip={{ height: 0, ts: new moment().add(-7,'m').unix() }}
                  wallet={fakeWallet}
                  theme="light" 
                  id={'x'} 
                  sockets={false} />
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-12 text-left">
              <h2 className="mt-5">Under the hood</h2>
              <div className="line mb-4" />
              <div className="">{Texts.md('tech')}</div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-12 text-left">
              <h2 className="mt-5">How Much ?</h2>
              <div className="line mb-4" />
              <div className="">{Texts.t('price')}</div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-12 text-left">
              <h2 className="mt-5">Who ?</h2>
              <div className="line mb-4" />
              <div className="">{Texts.md('who')}</div>
            </div>
          </div>
        </div>        
      
      </div>



      <Script
        url="https://unpkg.com/highlight.js@9.12.0/lib/highlight.js"
        onLoad={highlight}
      />


      <style jsx>{`

        .snippet {
          font-size: 14px;
          font-family: monospace;
        }

        .push { height: 400px; }

        .line { 
          display: inline-block;
          background: #92929221;
          height: 3px;
          width: 200px;
        }

      `}</style>

    </div>)
  }
}

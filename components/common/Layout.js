import Head from 'next/head'
import Router from 'next/router'
import NProgress from 'nprogress'

import Header from './Header'
import Footer from './Footer'


Router.onRouteChangeStart = (url) => NProgress.start()
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()


export default  function Layout({ noHeaders, children }) { return (
  <div className="html">

    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>8333.io</title>

      <link rel="stylesheet" type="text/css" href="https://unpkg.com/bootstrap@4.0.0-beta.3/dist/css/bootstrap.min.css" />
      <link rel="stylesheet" type="text/css" href="/static/css/app.css" />
      <link rel="stylesheet" type="text/css" href="/static/css/utils.css" />
      <link rel="stylesheet" type="text/css" href="/static/css/nprogress.css" />
      <link rel="stylesheet" type="text/css" href="/static/css/animate.css" />
      <link rel="stylesheet" type="text/css" href="/static/css/highlight.css" />
      <link rel="stylesheet" type="text/css" href="https://unpkg.com/font-awesome@4.7.0/css/font-awesome.min.css" />
      <link rel="stylesheet" type="text/css" href="https://unpkg.com/aos@2.3.4/dist/aos.css" />
      <script src="https://unpkg.com/jquery@3.3.1/dist/jquery.min.js"></script>
      <script src="https://unpkg.com/tether@1.2.4/dist/js/tether.min.js"></script>
      <script src="https://unpkg.com/popper.js@1.12.9/dist/umd/popper.min.js"></script>
      <script src="https://unpkg.com/bootstrap@4.0.0-beta.3/dist/js/bootstrap.min.js"></script>
      <script src="https://unpkg.com/aos@2.3.4/dist/aos.js"></script>
      
    </Head>



    <div className="body">
      { !noHeaders && <Header /> }
      <div className="body-content">
        {children}
      </div>
      { !noHeaders && <Footer /> }
    </div>

    <style jsx>{`
      .body {
        display: flex;
        min-height: 100vh;
        flex-direction: column;
        background: transparent;
      }
      .body-content {
        flex: 1;
      }
      `}</style>
    
  </div>
)}
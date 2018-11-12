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
      <link rel="stylesheet" type="text/css" href="https://unpkg.com/bootstrap@4.1.0/dist/css/bootstrap.min.css" />
      <link rel="stylesheet" type="text/css" href="/static/build/app.min.css" />
    </Head>


    <div className="body">
      { !noHeaders && <Header /> }
      <div className="body-content">
        {children}
      </div>
      { !noHeaders && <Footer /> }
    </div>
    

    <link rel="stylesheet" type="text/css" href="https://use.fontawesome.com/releases/v5.5.0/css/solid.css" />
    <link rel="stylesheet" type="text/css" href="https://use.fontawesome.com/releases/v5.5.0/css/brands.css" />
    <link rel="stylesheet" type="text/css" href="https://use.fontawesome.com/releases/v5.5.0/css/fontawesome.css" />
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/aos@2.3.4/dist/aos.css" />
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/animate.css@3.7.0/animate.min.css" />
    
    <script src="https://unpkg.com/jquery@3.3.1/dist/jquery.min.js"></script>
    <script src="https://unpkg.com/popper.js@1.14.0/dist/umd/popper.min.js"></script>
    <script src="https://unpkg.com/bootstrap@4.1.0/dist/js/bootstrap.min.js"></script>
    <script src="https://unpkg.com/aos@2.3.4/dist/aos.js"></script>

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
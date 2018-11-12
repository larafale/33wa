import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MarkdownIt from 'markdown-it'
import hljs from '../hoc/hljs'
import keys from 'lodash/keys'

const MD = new MarkdownIt({ 
		html: true 
	, highlight: function (str, lang) {
			if (lang && hljs.getLanguage(lang)) {
			  try {
			    return '<pre class="hljs"><code>' +
						hljs.highlight(lang, str, true).value +
						'</code></pre>';
			  } catch (__) {}
			}

			return '<pre class="hljs"><code>' + MD.utils.escapeHtml(str) + '</code></pre>';
		}
})


MD.use((md, opts) => {
  const originalHeadingOpen = md.renderer.rules.heading_open
  let h1 = -1
  let h2 = -1

  md.renderer.rules.heading_open = function (tokens, idx, opts, env, self) {
    const node = tokens[idx]

    tokens[idx].attrs = tokens[idx].attrs || []

    if(node.tag == 'h1'){
      h1++
      h2 = -1
      tokens[idx].attrs.push(['class', `level-${h1}`])
    }

    if(node.tag == 'h2'){
      h2++
      tokens[idx].attrs.push(['class', `level-${h1}-${h2}`]) 
    }

    return originalHeadingOpen
      ? originalHeadingOpen.apply(this, arguments)
      : self.renderToken.apply(self, arguments)
  }
})


const parseTree = (tree) => {

	const menu = {}
	let level = ''
  let h1 = -1
  let h2 = -1

	tree.map((node, i) => {
		if(node.tag == 'h1' && node.type == 'heading_open'){
      h1++
      h2 = -1
      const nextNode = tree[i+1]
			const value = nextNode.content
			level = value
			menu[value] = { class: `level-${h1}`, subs: {} }
		}

		if(node.tag == 'h2' && node.type == 'heading_open'){
      h2++
			const nextNode = tree[i+1]
			const value = nextNode.content
			menu[level].subs[value] = { class: `level-${h1}-${h2}` }
		}
	})

	return menu
}




export default class DaDocs extends Component {

	constructor(props){
    super(props)

    this.state = { 
        loading: false
      , md: ''
    }

    this.clickMenu = this.clickMenu.bind(this)
  }

  async componentDidMount(){
    const { source } = this.props
    console.log('s', source)
    const md = await (await fetch(source)).text()
    const tree = parseTree(MD.parse(md))

		this.setState({ md, tree })
  }

  clickMenu(className) {
  	$([document.documentElement, document.body]).animate({
        scrollTop: $(`.${className}`).offset().top
    }, 1000)
  }

	render() {

	const { md, tree } = this.state

	  return (<div className="container" style={{padding:0}}>
	    <div className="col-12" style={{padding:0}}>
	    	<div className="d-flex align-items-start">

	    		<div className="d-none d-md-block doc-menu col-md-3 position-sticky" style={{top:0}}>
	    			<ul className="list-unstyled">
	    			{ keys(tree).map((levelone, i) =>
	            <li key={i} className="cursor">
	              <div onClick={e=>this.clickMenu(tree[levelone].class)} className="my-2 doc-menu-one">{levelone}</div>

	              <ul>
			    			{ keys(tree[levelone].subs).map((leveltwo, j) =>
			            <li key={j} onClick={()=>{}} className="cursor">
			              <div onClick={e=>this.clickMenu(tree[levelone].subs[leveltwo].class)} className="doc-menu-two">{leveltwo}</div>
			            </li>
			          )}
			    			</ul>

	            </li>
	          )}
	    			</ul>
	    		</div>

	    		<div className="doc-panel col-12 col-md-9 px-md-5">
	    			{ !md ? <div className="dadocs"><h1>Loading...</h1></div> : <div className="dadocs" dangerouslySetInnerHTML={{ __html: MD.render(md) }} /> }
	    		</div>
	    	
	    	</div>
	    </div>

	    <style jsx>{`

        .doc-menu {
					border-right: 4px solid #f9f9f9;
					padding: 30px 0;
					height: -webkit-fill-available;
        }
        .doc-menu ul {
          overflow: hidden;
         }

        .doc-panel {
					font-size: 12px;
        }

        .doc-menu-one {
					background: #f9f9f9;
					padding: 4px 10px;
					border: 1px solid #f1f1f1;
          border-right: 0;
          text-transform: uppercase;
          font-size: 12px;
        }

        .doc-menu-two {
					color: #8a8a8a;
					font-size: 12px;
        }

      `}</style>
	  </div>)
	}

}

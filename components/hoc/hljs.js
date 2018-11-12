import hljs from 'highlight.js/lib/highlight'
import xml from 'highlight.js/lib/languages/xml'
import javascript from 'highlight.js/lib/languages/javascript'


hljs.registerLanguage('xml', xml)
hljs.registerLanguage('javascript', javascript)

export default hljs
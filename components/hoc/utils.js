import MarkdownIt from 'markdown-it'

const MD = new MarkdownIt()

export const md2Html = (md) => {
  const html = MD.render(md, { html: false, linkify: true })
  return <div dangerouslySetInnerHTML={{ __html: html }}></div>
}
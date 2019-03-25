import {Component} from 'react'

export default class IndexPage extends Component {
  static getInitialProps ({query}) {
    const {
      lang
    } = query

    return {
      lang
    }
  }

  render () {
    return (
      <div>[lang:${this.props.lang}]</div>
    )
  }
}

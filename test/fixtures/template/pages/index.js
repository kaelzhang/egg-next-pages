import {Component} from 'react'

export default class IndexPage extends Component {
  static getInitialProps ({query}) {
    return query
  }

  render () {
    const {
      url,
      pathname,
      asPath,
      ...query
    } = this.props

    return (
      <div>{JSON.stringify(query)}</div>
    )
  }
}

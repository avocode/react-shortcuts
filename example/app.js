import PropTypes from 'prop-types'

let { Shortcuts } = require('../src')

Shortcuts = React.createFactory(Shortcuts)
const { button, div, h1, p } = React.DOM

export default React.createClass({
  displayName: 'App',

  childContextTypes: {
    shortcuts: PropTypes.object.isRequired,
  },

  getInitialState() {
    return { show: true, who: 'Nobody' }
  },

  getChildContext() {
    return { shortcuts: this.props.shortcuts }
  },

  _handleShortcuts(command) {
    switch (command) {
      case 'MOVE_LEFT': return this.setState({ who: 'Hemingway - left' })
      case 'DELETE': return this.setState({ who: 'Hemingway - delete' })
      case 'MOVE_RIGHT': return this.setState({ who: 'Hemingway - right' })
      case 'MOVE_UP': return this.setState({ who: 'Hemingway - top' })
    }
  },

  _handleShortcuts2(command) {
    switch (command) {
      case 'MOVE_LEFT': return this.setState({ who: 'Franz Kafka - left' })
      case 'DELETE': return this.setState({ who: 'Franz Kafka - delete' })
      case 'MOVE_RIGHT': return this.setState({ who: 'Franz Kafka - right' })
      case 'MOVE_UP': return this.setState({ who: 'Franz Kafka - top' })
    }
  },

  _handleRoot(command) {
    this.setState({ who: 'Root shortcuts component' })
  },

  _rebind() {
    this.setState({ show: false })

    setTimeout(() => {
      this.setState({ show: true })
    }, 100)
  },

  render() {
    if (!this.state.show) {
      return null
    }

    return (

      div({ className: 'root' },

        h1({ className: 'who' }, this.state.who),
        button({ className: 'rebind', onClick: this._rebind }, 'Rebind listeners'),

        Shortcuts({
          name: this.constructor.displayName,
          handler: this._handleShortcuts,
          targetNodeSelector: '#app',
          className: 'content',
        },
          div(null,
            h1(null, 'Hemingway'),
            p(null, 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia.')
          )
        ),

        Shortcuts({
          name: this.constructor.displayName,
          handler: this._handleShortcuts2,
          stopPropagation: true,
          className: 'content',
        },

          div(null,
            h1(null, 'Franz Kafka'),
            p(null, 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections.')
          )
        )
      )

    )
  },
})

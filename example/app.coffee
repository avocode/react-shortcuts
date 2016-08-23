{div, h1, p} = React.DOM
Shortcuts = React.createFactory(require '../src/component')

module.exports = React.createClass
  displayName: 'App'

  childContextTypes:
    shortcuts: React.PropTypes.object.isRequired

  getInitialState: ->
    who: 'Nobody'
    unmount: false

  getChildContext: ->
    shortcuts: @props.shortcuts

  _mountIt: ->
    @setState(unmount: false)

  _handleShortcuts: (command) ->
    switch command
      when 'MOVE_LEFT' then @setState(who: 'Hemingway - left')
      when 'DELETE' then @setState(who: 'Hemingway - delete')
      when 'MOVE_RIGHT' then @setState(who: 'Hemingway - right')
      when 'MOVE_UP' then @setState(who: 'Hemingway - top')
      when 'UNMOUNT' then @setState(unmount: true)

  _handleShortcuts2: (command) ->
    switch command
      when 'MOVE_LEFT' then @setState(who: 'Franz Kafka - left')
      when 'DELETE' then @setState(who: 'Franz Kafka - delete')
      when 'MOVE_RIGHT' then @setState(who: 'Franz Kafka - right')
      when 'MOVE_UP' then @setState(who: 'Franz Kafka - top')

  _handleRoot: (command) ->
    @setState(who: 'Root shortcuts component')

  render: ->
    if not @state.unmount

      div className: 'root',

          h1 className: 'who',
            @state.who

          Shortcuts
            name: @constructor.displayName
            handler: @_handleShortcuts
            targetNodeSelector: '#app'
            className: 'content',

            div null,
              h1 null, 'Hemingway'
              p null,
                'Far far away, behind the word mountains, far from the
                countries Vokalia and Consonantia,
                there live the blind texts. Separated they live in
                Bookmarksgrove
                right at the coast of the Semantics,
                a large language ocean. A small river named Duden flows by
                 their place
                and supplies it with the necessary regelialia.'


          Shortcuts
            name: @constructor.displayName
            handler: @_handleShortcuts2
            stopPropagation: true
            className: 'content',

            div null,
              h1 null, 'Franz Kafka'
              p null,
                'One morning, when Gregor Samsa woke from troubled dreams,
                he found himself transformed in his bed into a horrible vermin.
                He lay on his armour-like back, and if he lifted his head a
                little he could see his brown belly, slightly domed
                and divided by arches into stiff sections.'
    else

      h1
        onClick: @_mountIt
        className: 'who',
          'Unmounted!'

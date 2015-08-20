{div} = React.DOM
Shortcuts = React.createFactory(require '../lib/component')

module.exports = React.createClass
  displayName: 'App'

  childContextTypes:
    shortcuts: React.PropTypes.object.isRequired

  getChildContext: ->
    shortcuts: @props.shortcuts

  _handleShortcuts: (command) ->
    constants = @props.shortcuts.getShortcutNames()

    switch command
      when constants.MOVE_LEFT then console.log 'left'
      when constants.DELETE then console.log 'delete'
      when constants.MOVE_RIGHT then console.log 'move right'
      when constants.MOVE_UP then console.log 'move up'

  _handleShortcuts2: (command) ->
    switch command
      when 'MOVE_LEFT' then console.log 'left 2'
      when 'DELETE' then console.log 'delete 2'
      when 'MOVE_RIGHT' then console.log 'move right 2'
      when 'MOVE_UP' then console.log 'move up 2'

  render: ->
    div className: 'root',

      Shortcuts
        name: @constructor.displayName
        handler: @_handleShortcuts
        className: 'content',

        div null,
          'Far far away, behind the word mountains, far from the countries
          Vokalia and Consonantia,
          there live the blind texts. Separated they live in Bookmarksgrove
          right at the coast of the Semantics,
          a large language ocean. A small river named Duden flows by their place
          and supplies it with the necessary regelialia.'


      Shortcuts
        name: @constructor.displayName
        handler: @_handleShortcuts2
        className: 'content',

        div null,
          'One morning, when Gregor Samsa woke from troubled dreams,
          he found himself transformed in his bed into a horrible vermin.
          He lay on his armour-like back, and if he lifted his head a little
          he could see his brown belly, slightly domed and divided by arches
          into stiff sections.'

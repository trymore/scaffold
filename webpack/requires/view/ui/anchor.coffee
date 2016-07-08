module.exports =
class Anchor

  ###
  @param el [HTMLElement]
  ###
  constructor: (@el) ->
    @targetEl = do =>
      href   = @el.getAttribute('href')
      elName = if (href is '#') then 'html, body' else href
      document.querySelector(elName)

    return if @targetEl.length

    @duration = 500
    @timer    = null

    @el.addEventListener('click', @scroll.bind(this))

  ###
  @private
  ###
  scroll: (e) =>
    @beforeTop = window.pageYOffset
    @changeTop = @targetEl.getBoundingClientRect().top

    e.preventDefault()
    @startTime = new Date().getTime()
    @animate()

  ###
  @private
  ###
  animate: ->
    clearTimeout(@timer) if @timer

    newTime = new Date().getTime()

    currentTime = do =>
      if @duration > (newTime - @startTime)
        newTime - @startTime
      else
        @duration

    window.scrollTo(0, @easing(currentTime, @beforeTop, @changeTop, @duration));

    if @duration > currentTime
      @timer = setTimeout(@animate.bind(this), 15)

  ###
  @private
  ###
  easing: (t, b, c, d) ->
    -c * (t /= d) * (t - 2) + b

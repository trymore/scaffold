# describe 'string test', ->
#
#   it 'string-1', ->
#     expect('ok').toEqual('ok')
#
#   it 'string-2', ->
#     expect('ok2').toEqual('ok2')
#
#
# describe 'click test', ->
#
#   beforeEach ->
#     document.body.innerHTML = window.__html__['htdocs/index.html']
#
#   it 'click-1', ->
#     $btn = $ 'button'
#     $txt = $ '.txt'
#     $btn.trigger 'click'
#     $btn.on 'click', ->
#       expect($txt.text()).toEqual('ok')

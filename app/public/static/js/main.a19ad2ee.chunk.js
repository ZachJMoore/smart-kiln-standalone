(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{13:function(t,e,n){},15:function(t,e,n){},17:function(t,e,n){"use strict";n.r(e);var a=n(0),o=n.n(a),c=n(3),i=n.n(c),r=(n(13),n(15),n(1)),u=n(4),s=n(6),l=n(5),h=n(7),d=new function t(){var e=this,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"http://localhost:2222/api";Object(r.a)(this,t),this.url=n,this.getPackage=function(){return fetch("".concat(e.url,"/kiln/get-package"))},this.getSchedules=function(){return fetch("".concat(e.url,"/get-schedules"))}},p=function(t){function e(t){var n;return Object(r.a)(this,e),(n=Object(s.a)(this,Object(l.a)(e).call(this,t))).state={kiln:{}},n.updatePackage=function(){d.getPackage().then(function(t){return t.json()}).then(function(t){n.setState({kiln:t})})},n}return Object(h.a)(e,t),Object(u.a)(e,[{key:"componentDidMount",value:function(){this.updatePackage(),setInterval(this.updatePackage,1e3)}},{key:"render",value:function(){return o.a.createElement("div",{className:"App"},o.a.createElement("h1",null,"Temperature: ",this.state.kiln.temperature))}}]),e}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(o.a.createElement(p,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})},8:function(t,e,n){t.exports=n(17)}},[[8,2,1]]]);
//# sourceMappingURL=main.a19ad2ee.chunk.js.map
/*! For license information please see 977.a57a90bc.chunk.js.LICENSE.txt */
(self.webpackChunkaitweb_config_center=self.webpackChunkaitweb_config_center||[]).push([[977],{26580:function(e,n,t){"use strict";var r=t(44845),a=t(67294),i=t(94184),o=t.n(i),s=t(60790);function c(e,n){var t,i=e.type,c=e.children,l=e.className,u=void 0===l?"":l,p=e.style,d=e.onClick,m=e.disabled,f=e.size,v=void 0===f?"normal":f;return n||(n=(0,a.useRef)(null)),(0,a.useLayoutEffect)((function(){var e,t;if("link"!==i){var r=(0,s.P2)((function(e){var n=e.currentTarget;null==n||n.classList.add("click"),setTimeout((function(){null==n||n.classList.remove("click")}),300)}),300,!0);return null===(e=n)||void 0===e||null===(t=e.current)||void 0===t||t.addEventListener("mouseup",r,!1),function(){var e,t;null===(e=n)||void 0===e||null===(t=e.current)||void 0===t||t.removeEventListener("mouseup",r,!1)}}}),[]),a.createElement("button",{className:o()("ait-button",(t={},(0,r.Z)(t,i,!0),(0,r.Z)(t,u,!!u),(0,r.Z)(t,"small","small"===v),t)),style:p,onClick:d,disabled:m,ref:n},c)}n.Z=(0,a.forwardRef)(c)},36606:function(e,n,t){"use strict";t.d(n,{Z:function(){return R}});var r=t(28222),a=t.n(r),i=t(80222),o=t.n(i),s=t(14418),c=t.n(s),l=t(8446),u=t.n(l),p=t(66870),d=t.n(p),m=t(44845),f=t(95266),v=(t(74916),t(77601),t(57658),t(41539),t(54747),t(67294)),g=t(94184),h=t.n(g),y=t(84538);function E(e,n){var t=a()(e);if(o()){var r=o()(e);n&&(r=c()(r).call(r,(function(n){return u()(e,n).enumerable}))),t.push.apply(t,r)}return t}function x(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?E(Object(t),!0).forEach((function(n){(0,m.Z)(e,n,t[n])})):d()?Object.defineProperties(e,d()(t)):E(Object(t)).forEach((function(n){Object.defineProperty(e,n,u()(t,n))}))}return e}var Z={currentValue:"",errMsg:""};function N(e){var n=e.style,t=e.className,r=void 0===t?"":t,a=e.prefix,i=e.suffix,o=e.type,s=void 0===o?"text":o,c=e.name,l=e.value,u=e.width,p=e.defaultValue,d=e.disabled,g=e.placeholder,E=e.maxLength,N=e.onChange,b=e.onKeyDown,w=e.onKeyUp,C=e.onCompositionStart,_=e.onCompositionUpdate,S=e.onCompositionEnd,k=e.rules,R=void 0===k?[]:k,L=(0,y.Z)(Z),U=(0,f.Z)(L,2),j=U[0],I=U[1],O=(0,v.useRef)(!1);(0,v.useLayoutEffect)((function(){O.current?O.current=!1:I({currentValue:l})}),[l]),(0,v.useLayoutEffect)((function(){void 0===l&&p&&I({currentValue:p})}),[]);var P=function(e){for(var n=e.target.value,t="",r=0;r<R.length;r++){var a=R[r];if("function"==typeof a.pattern){if(!a.pattern(n)){t=a.message;break}}else if(!a.pattern.test(n)){t=a.message;break}}I({currentValue:n,errMsg:t}),null==N||N(e)};return v.createElement("div",{className:h()("ait-input-x",(0,m.Z)({},r,!!r)),tabIndex:a||i?-1:void 0,style:x({width:u},n)},a||i?v.createElement("div",{className:h()("ait-input-affix",{disabled:d})},a&&v.createElement("div",{className:h()("ait-input-prefix",{disabled:d})},a),v.createElement("input",{type:s,name:c,placeholder:g,className:"ait-input",value:l||"",disabled:d,maxLength:E,onInput:P,onKeyDown:b,onKeyUp:w,onCompositionStart:C,onCompositionUpdate:_,onCompositionEnd:S}),i&&v.createElement("div",{className:h()("ait-input-suffix",{disabled:d})},i)):v.createElement("input",{type:s,name:c,placeholder:g,className:h()("ait-input",{error:!!j.errMsg}),value:j.currentValue,disabled:d,maxLength:E,onInput:P,onKeyDown:b,onKeyUp:w,onCompositionStart:C,onCompositionUpdate:_,onCompositionEnd:S}),j.errMsg?v.createElement("div",{className:"ait-input-error-message"},j.errMsg):null)}var b=(0,v.memo)(N),w=t(73126),C=t(18004);function _(e){var n=e.onSearch,t=e.onKeyUp,r=(0,v.useMemo)((function(){return v.createElement(C.Z,{name:"sousuo",className:"ait-input-suffix-search-icon",onClick:n})}),[n]),a=(0,v.useCallback)((function(e){null==t||t(e),13===e.keyCode&&n&&n()}),[n,t]);return v.createElement(b,(0,w.Z)({},e,{suffix:r,onKeyUp:a}))}var S=(0,v.memo)(_),k=b;k.Search=S;var R=k},35607:function(e,n,t){"use strict";t.d(n,{Z:function(){return h}});var r=t(95266),a=t(39022),i=t.n(a),o=t(67294),s="src-components-Spin-index-module-ait_spin-gL8le",c="src-components-Spin-index-module-ait_spin_dot-HrM8e",l="src-components-Spin-index-module-ait_spin_dot_item-l5eAQ",u="src-components-Spin-index-module-ait_spin_box-SJaqQ",p="src-components-Spin-index-module-ait_spin_spinning-HGE_g",d="src-components-Spin-index-module-hide-Tfie2",m="src-components-Spin-index-module-ait_spin_spinning_center-fvXi7",f="src-components-Spin-index-module-ait_spin_container-JVa62",v="src-components-Spin-index-module-ait_spin_mask-x2UYZ";function g(e){var n,t,a=e.children,g=e.delay,h=e.spinning,y=(0,o.useState)(h),E=(0,r.Z)(y,2),x=E[0],Z=E[1];(0,o.useLayoutEffect)((function(){null!=g?setTimeout((function(){return Z((function(){return!h}))}),g):Z((function(){return!h}))}),[h]);var N=(0,o.useMemo)((function(){return o.createElement("div",{className:s},o.createElement("div",{className:c},o.createElement("div",{className:l}),o.createElement("div",{className:l}),o.createElement("div",{className:l}),o.createElement("div",{className:l})))}),[]);return null==a?x?null:N:o.createElement("div",{className:u},o.createElement("div",{className:i()(n="".concat(p)).call(n,x?" ".concat(d):"")},o.createElement("div",{className:m},N)),o.createElement("div",{className:i()(t="".concat(f)).call(t,x?"":" ".concat(v))},a))}var h=(0,o.memo)(g)},18977:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return I}});var r=t(28760),a=t.n(r),i=(t(41539),t(81299),t(68420)),o=t(27344),s=t(5281),c=t(84441),l=t(3020),u=t(3362),p=t(44845),d=t(39022),m=t.n(d),f=(t(74916),t(64765),t(67294)),v="src-pages-login-index-module-page_login-ZiPS1",g="src-pages-login-index-module-login_wrapper-xdCri",h="src-pages-login-index-module-form_item-Hk93t",y="src-pages-login-index-module-form_submit-vfB3j",E="src-pages-login-index-module-form_item_title-RNBs0",x="src-pages-login-index-module-foot-R15pZ",Z=t(36606),N=t(26580),b=t(35607),w=t(98439),C="LOGIN",_="REGISTER",S={login:function(e){return function(n){return w.Z.post("/api/query/login",e).then((function(e){return n({data:e,type:C}),e}))}},register:function(e){return function(n){return w.Z.post("/api/query/register",e).then((function(e){return n({data:e,type:_}),e}))}}},k=t(33486),R=t(14890),L=t(86706);function U(e){var n=function(){if("undefined"==typeof Reflect||!a())return!1;if(a().sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(a()(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var t,r=(0,u.Z)(e);if(n){var i=(0,u.Z)(this).constructor;t=a()(r,arguments,i)}else t=r.apply(this,arguments);return(0,l.Z)(this,t)}}var j=function(e){(0,c.Z)(t,e);var n=U(t);function t(e){var r;return(0,i.Z)(this,t),r=n.call(this,e),(0,p.Z)((0,s.Z)(r),"handleChangeUserName",(function(e){r.setState({userName:e.target.value})})),(0,p.Z)((0,s.Z)(r),"handleChangePassword",(function(e){r.setState({password:e.target.value})})),(0,p.Z)((0,s.Z)(r),"onSubmit",(function(){console.log(r.state);var e=r.state,n=e.userName,t=e.password;return n?t?void r.props.login({userName:n,password:t}).then((function(e){if(console.log(e),0===e.code){var n=r.props.location.search.split("?redirect=")[1];r.props.navigator(n?decodeURIComponent(n):"/home")}})).catch((function(e){console.log(e)})):k.Z.warn("用户密码不能为空"):k.Z.warn("用户名不能为空")})),(0,p.Z)((0,s.Z)(r),"onRegister",(function(){var e=r.state,n=e.userName,t=e.password;return n?t?void r.props.register({userName:n,password:t}).then((function(e){console.log(e)})).catch((function(e){console.log(e)})):k.Z.warn("用户密码不能为空"):k.Z.warn("用户名不能为空")})),(0,p.Z)((0,s.Z)(r),"handleNavigateToRegister",(function(){r.props.navigator("/register"),window.location.reload()})),console.log(e),r.type="/login"===e.location.pathname?"login":"register",r.state={userName:"",password:"",loading:!1},r}return(0,o.Z)(t,[{key:"render",value:function(){var e,n=this.state,t=n.userName,r=n.password,a=n.loading;return f.createElement(b.Z,{spinning:a},f.createElement("section",{className:v},f.createElement("div",{className:g},f.createElement("div",{className:h},f.createElement("span",{className:E},"用户名："),f.createElement(Z.Z,{value:t,placeholder:"请输入用户名",onChange:this.handleChangeUserName})),f.createElement("div",{className:h},f.createElement("span",{className:E},"密码："),f.createElement(Z.Z,{type:"password",value:r,placeholder:"请输入用户密码",onChange:this.handleChangePassword,rules:[{message:"密码格式不正确",pattern:/^[0-9a-zA-Z]{6}$/}]})),f.createElement("div",{className:m()(e="".concat(h," ")).call(e,y)},"login"===this.type?f.createElement(N.Z,{type:"primary",style:{width:100},onClick:this.onSubmit},"登录"):f.createElement(N.Z,{type:"primary",style:{width:100},onClick:this.onRegister},"注册")),"login"===this.type?f.createElement("div",{className:x},"还没有账号，去",f.createElement(N.Z,{type:"link",onClick:this.handleNavigateToRegister},"注册")):null)))}}]),t}(f.PureComponent),I=(0,L.$j)(null,(function(e){return(0,R.DE)(S,e)}))(j)},94184:function(e,n){var t;!function(){"use strict";var r={}.hasOwnProperty;function a(){for(var e=[],n=0;n<arguments.length;n++){var t=arguments[n];if(t){var i=typeof t;if("string"===i||"number"===i)e.push(t);else if(Array.isArray(t)){if(t.length){var o=a.apply(null,t);o&&e.push(o)}}else if("object"===i){if(t.toString!==Object.prototype.toString&&!t.toString.toString().includes("[native code]")){e.push(t.toString());continue}for(var s in t)r.call(t,s)&&t[s]&&e.push(s)}}}return e.join(" ")}e.exports?(a.default=a,e.exports=a):void 0===(t=function(){return a}.apply(n,[]))||(e.exports=t)}()},81150:function(e){e.exports=Object.is||function(e,n){return e===n?0!==e||1/e==1/n:e!=e&&n!=n}},77601:function(e,n,t){"use strict";t(74916);var r,a,i=t(82109),o=t(46916),s=t(60614),c=t(19670),l=t(41340),u=(r=!1,(a=/[ac]/).exec=function(){return r=!0,/./.exec.apply(this,arguments)},!0===a.test("abc")&&r),p=/./.test;i({target:"RegExp",proto:!0,forced:!u},{test:function(e){var n=c(this),t=l(e),r=n.exec;if(!s(r))return o(p,n,t);var a=o(r,n,t);return null!==a&&(c(a),!0)}})},64765:function(e,n,t){"use strict";var r=t(46916),a=t(27007),i=t(19670),o=t(68554),s=t(84488),c=t(81150),l=t(41340),u=t(58173),p=t(97651);a("search",(function(e,n,t){return[function(n){var t=s(this),a=o(n)?void 0:u(n,e);return a?r(a,n,t):new RegExp(n)[e](l(t))},function(e){var r=i(this),a=l(e),o=t(n,r,a);if(o.done)return o.value;var s=r.lastIndex;c(s,0)||(r.lastIndex=0);var u=p(r,a);return c(r.lastIndex,s)||(r.lastIndex=s),null===u?-1:u.index}]}))}}]);
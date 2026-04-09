(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function n(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=n(a);fetch(a.href,i)}})();const ti="modulepreload",ni=function(t){return"/"+t},Ls={},re=function(e,n,s){let a=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),o=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));a=Promise.allSettled(n.map(l=>{if(l=ni(l),l in Ls)return;Ls[l]=!0;const d=l.endsWith(".css"),c=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${c}`))return;const u=document.createElement("link");if(u.rel=d?"stylesheet":ti,d||(u.as="script"),u.crossOrigin="",u.href=l,o&&u.setAttribute("nonce",o),document.head.appendChild(u),d)return new Promise((p,h)=>{u.addEventListener("load",p),u.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${l}`)))})}))}function i(r){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=r,window.dispatchEvent(o),!o.defaultPrevented)throw r}return a.then(r=>{for(const o of r||[])o.status==="rejected"&&i(o.reason);return e().catch(i)})},R=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:global,G=Object.keys,Y=Array.isArray;function X(t,e){return typeof e!="object"||G(e).forEach(function(n){t[n]=e[n]}),t}typeof Promise>"u"||R.Promise||(R.Promise=Promise);const vt=Object.getPrototypeOf,si={}.hasOwnProperty;function ae(t,e){return si.call(t,e)}function Ze(t,e){typeof e=="function"&&(e=e(vt(t))),(typeof Reflect>"u"?G:Reflect.ownKeys)(e).forEach(n=>{ve(t,n,e[n])})}const Js=Object.defineProperty;function ve(t,e,n,s){Js(t,e,X(n&&ae(n,"get")&&typeof n.get=="function"?{get:n.get,set:n.set,configurable:!0}:{value:n,configurable:!0,writable:!0},s))}function Je(t){return{from:function(e){return t.prototype=Object.create(e.prototype),ve(t.prototype,"constructor",t),{extend:Ze.bind(null,t.prototype)}}}}const ai=Object.getOwnPropertyDescriptor;function os(t,e){let n;return ai(t,e)||(n=vt(t))&&os(n,e)}const ii=[].slice;function en(t,e,n){return ii.call(t,e,n)}function Qs(t,e){return e(t)}function lt(t){if(!t)throw new Error("Assertion Failed")}function Xs(t){R.setImmediate?setImmediate(t):setTimeout(t,0)}function Zs(t,e){return t.reduce((n,s,a)=>{var i=e(s,a);return i&&(n[i[0]]=i[1]),n},{})}function be(t,e){if(typeof e=="string"&&ae(t,e))return t[e];if(!e)return t;if(typeof e!="string"){for(var n=[],s=0,a=e.length;s<a;++s){var i=be(t,e[s]);n.push(i)}return n}var r=e.indexOf(".");if(r!==-1){var o=t[e.substr(0,r)];return o==null?void 0:be(o,e.substr(r+1))}}function le(t,e,n){if(t&&e!==void 0&&(!("isFrozen"in Object)||!Object.isFrozen(t)))if(typeof e!="string"&&"length"in e){lt(typeof n!="string"&&"length"in n);for(var s=0,a=e.length;s<a;++s)le(t,e[s],n[s])}else{var i=e.indexOf(".");if(i!==-1){var r=e.substr(0,i),o=e.substr(i+1);if(o==="")n===void 0?Y(t)&&!isNaN(parseInt(r))?t.splice(r,1):delete t[r]:t[r]=n;else{var l=t[r];l&&ae(t,r)||(l=t[r]={}),le(l,o,n)}}else n===void 0?Y(t)&&!isNaN(parseInt(e))?t.splice(e,1):delete t[e]:t[e]=n}}function ea(t){var e={};for(var n in t)ae(t,n)&&(e[n]=t[n]);return e}const ri=[].concat;function ta(t){return ri.apply([],t)}const na="BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(ta([8,16,32,64].map(t=>["Int","Uint","Float"].map(e=>e+t+"Array")))).filter(t=>R[t]),oi=na.map(t=>R[t]);Zs(na,t=>[t,!0]);let Se=null;function Tt(t){Se=typeof WeakMap<"u"&&new WeakMap;const e=In(t);return Se=null,e}function In(t){if(!t||typeof t!="object")return t;let e=Se&&Se.get(t);if(e)return e;if(Y(t)){e=[],Se&&Se.set(t,e);for(var n=0,s=t.length;n<s;++n)e.push(In(t[n]))}else if(oi.indexOf(t.constructor)>=0)e=t;else{const i=vt(t);for(var a in e=i===Object.prototype?{}:Object.create(i),Se&&Se.set(t,e),t)ae(t,a)&&(e[a]=In(t[a]))}return e}const{toString:li}={};function Ln(t){return li.call(t).slice(8,-1)}const jn=typeof Symbol<"u"?Symbol.iterator:"@@iterator",ci=typeof jn=="symbol"?function(t){var e;return t!=null&&(e=t[jn])&&e.apply(t)}:function(){return null},Ye={};function fe(t){var e,n,s,a;if(arguments.length===1){if(Y(t))return t.slice();if(this===Ye&&typeof t=="string")return[t];if(a=ci(t)){for(n=[];!(s=a.next()).done;)n.push(s.value);return n}if(t==null)return[t];if(typeof(e=t.length)=="number"){for(n=new Array(e);e--;)n[e]=t[e];return n}return[t]}for(e=arguments.length,n=new Array(e);e--;)n[e]=arguments[e];return n}const ls=typeof Symbol<"u"?t=>t[Symbol.toStringTag]==="AsyncFunction":()=>!1;var ue=typeof location<"u"&&/^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);function sa(t,e){ue=t,aa=e}var aa=()=>!0;const di=!new Error("").stack;function He(){if(di)try{throw He.arguments,new Error}catch(t){return t}return new Error}function Tn(t,e){var n=t.stack;return n?(e=e||0,n.indexOf(t.name)===0&&(e+=(t.name+t.message).split(`
`).length),n.split(`
`).slice(e).filter(aa).map(s=>`
`+s).join("")):""}var ia=["Unknown","Constraint","Data","TransactionInactive","ReadOnly","Version","NotFound","InvalidState","InvalidAccess","Abort","Timeout","QuotaExceeded","Syntax","DataClone"],cs=["Modify","Bulk","OpenFailed","VersionChange","Schema","Upgrade","InvalidTable","MissingAPI","NoSuchDatabase","InvalidArgument","SubTransaction","Unsupported","Internal","DatabaseClosed","PrematureCommit","ForeignAwait"].concat(ia),ui={VersionChanged:"Database version changed by other database connection",DatabaseClosed:"Database has been closed",Abort:"Transaction aborted",TransactionInactive:"Transaction has already completed or failed",MissingAPI:"IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"};function Qe(t,e){this._e=He(),this.name=t,this.message=e}function ra(t,e){return t+". Errors: "+Object.keys(e).map(n=>e[n].toString()).filter((n,s,a)=>a.indexOf(n)===s).join(`
`)}function tn(t,e,n,s){this._e=He(),this.failures=e,this.failedKeys=s,this.successCount=n,this.message=ra(t,e)}function pt(t,e){this._e=He(),this.name="BulkError",this.failures=Object.keys(e).map(n=>e[n]),this.failuresByPos=e,this.message=ra(t,e)}Je(Qe).from(Error).extend({stack:{get:function(){return this._stack||(this._stack=this.name+": "+this.message+Tn(this._e,2))}},toString:function(){return this.name+": "+this.message}}),Je(tn).from(Qe),Je(pt).from(Qe);var ds=cs.reduce((t,e)=>(t[e]=e+"Error",t),{});const pi=Qe;var I=cs.reduce((t,e)=>{var n=e+"Error";function s(a,i){this._e=He(),this.name=n,a?typeof a=="string"?(this.message=`${a}${i?`
 `+i:""}`,this.inner=i||null):typeof a=="object"&&(this.message=`${a.name} ${a.message}`,this.inner=a):(this.message=ui[e]||n,this.inner=null)}return Je(s).from(pi),t[e]=s,t},{});I.Syntax=SyntaxError,I.Type=TypeError,I.Range=RangeError;var js=ia.reduce((t,e)=>(t[e+"Error"]=I[e],t),{}),Gt=cs.reduce((t,e)=>(["Syntax","Type","Range"].indexOf(e)===-1&&(t[e+"Error"]=I[e]),t),{});function q(){}function bt(t){return t}function hi(t,e){return t==null||t===bt?e:function(n){return e(t(n))}}function Ne(t,e){return function(){t.apply(this,arguments),e.apply(this,arguments)}}function yi(t,e){return t===q?e:function(){var n=t.apply(this,arguments);n!==void 0&&(arguments[0]=n);var s=this.onsuccess,a=this.onerror;this.onsuccess=null,this.onerror=null;var i=e.apply(this,arguments);return s&&(this.onsuccess=this.onsuccess?Ne(s,this.onsuccess):s),a&&(this.onerror=this.onerror?Ne(a,this.onerror):a),i!==void 0?i:n}}function fi(t,e){return t===q?e:function(){t.apply(this,arguments);var n=this.onsuccess,s=this.onerror;this.onsuccess=this.onerror=null,e.apply(this,arguments),n&&(this.onsuccess=this.onsuccess?Ne(n,this.onsuccess):n),s&&(this.onerror=this.onerror?Ne(s,this.onerror):s)}}function mi(t,e){return t===q?e:function(n){var s=t.apply(this,arguments);X(n,s);var a=this.onsuccess,i=this.onerror;this.onsuccess=null,this.onerror=null;var r=e.apply(this,arguments);return a&&(this.onsuccess=this.onsuccess?Ne(a,this.onsuccess):a),i&&(this.onerror=this.onerror?Ne(i,this.onerror):i),s===void 0?r===void 0?void 0:r:X(s,r)}}function gi(t,e){return t===q?e:function(){return e.apply(this,arguments)!==!1&&t.apply(this,arguments)}}function us(t,e){return t===q?e:function(){var n=t.apply(this,arguments);if(n&&typeof n.then=="function"){for(var s=this,a=arguments.length,i=new Array(a);a--;)i[a]=arguments[a];return n.then(function(){return e.apply(s,i)})}return e.apply(this,arguments)}}Gt.ModifyError=tn,Gt.DexieError=Qe,Gt.BulkError=pt;var wt={};const oa=100,[Pn,nn,Cn]=typeof Promise>"u"?[]:(()=>{let t=Promise.resolve();if(typeof crypto>"u"||!crypto.subtle)return[t,vt(t),t];const e=crypto.subtle.digest("SHA-512",new Uint8Array([0]));return[e,vt(e),t]})(),la=nn&&nn.then,zt=Pn&&Pn.constructor,ps=!!Cn;var qn=!1,vi=Cn?()=>{Cn.then(Bt)}:R.setImmediate?setImmediate.bind(null,Bt):R.MutationObserver?()=>{var t=document.createElement("div");new MutationObserver(()=>{Bt(),t=null}).observe(t,{attributes:!0}),t.setAttribute("i","1")}:()=>{setTimeout(Bt,0)},ht=function(t,e){ct.push([t,e]),sn&&(vi(),sn=!1)},Bn=!0,sn=!0,Pe=[],Ut=[],On=null,Rn=bt,Xe={id:"global",global:!0,ref:0,unhandleds:[],onunhandled:Cs,pgp:!1,env:{},finalize:function(){this.unhandleds.forEach(t=>{try{Cs(t[0],t[1])}catch{}})}},D=Xe,ct=[],Ce=0,Wt=[];function E(t){if(typeof this!="object")throw new TypeError("Promises must be constructed via new");this._listeners=[],this.onuncatched=q,this._lib=!1;var e=this._PSD=D;if(ue&&(this._stackHolder=He(),this._prev=null,this._numPrev=0),typeof t!="function"){if(t!==wt)throw new TypeError("Not a function");return this._state=arguments[1],this._value=arguments[2],void(this._state===!1&&Fn(this,this._value))}this._state=null,this._value=null,++e.ref,da(this,t)}const Nn={get:function(){var t=D,e=an;function n(s,a){var i=!t.global&&(t!==D||e!==an);const r=i&&!we();var o=new E((l,d)=>{hs(this,new ca(rn(s,t,i,r),rn(a,t,i,r),l,d,t))});return ue&&ha(o,this),o}return n.prototype=wt,n},set:function(t){ve(this,"then",t&&t.prototype===wt?Nn:{get:function(){return t},set:Nn.set})}};function ca(t,e,n,s,a){this.onFulfilled=typeof t=="function"?t:null,this.onRejected=typeof e=="function"?e:null,this.resolve=n,this.reject=s,this.psd=a}function da(t,e){try{e(n=>{if(t._state===null){if(n===t)throw new TypeError("A promise cannot be resolved with itself.");var s=t._lib&&Pt();n&&typeof n.then=="function"?da(t,(a,i)=>{n instanceof E?n._then(a,i):n.then(a,i)}):(t._state=!0,t._value=n,ua(t)),s&&Ct()}},Fn.bind(null,t))}catch(n){Fn(t,n)}}function Fn(t,e){if(Ut.push(e),t._state===null){var n=t._lib&&Pt();e=Rn(e),t._state=!1,t._value=e,ue&&e!==null&&typeof e=="object"&&!e._promise&&function(s,a,i){try{s.apply(null,i)}catch{}}(()=>{var s=os(e,"stack");e._promise=t,ve(e,"stack",{get:()=>qn?s&&(s.get?s.get.apply(e):s.value):t.stack})}),function(s){Pe.some(a=>a._value===s._value)||Pe.push(s)}(t),ua(t),n&&Ct()}}function ua(t){var e=t._listeners;t._listeners=[];for(var n=0,s=e.length;n<s;++n)hs(t,e[n]);var a=t._PSD;--a.ref||a.finalize(),Ce===0&&(++Ce,ht(()=>{--Ce==0&&ys()},[]))}function hs(t,e){if(t._state!==null){var n=t._state?e.onFulfilled:e.onRejected;if(n===null)return(t._state?e.resolve:e.reject)(t._value);++e.psd.ref,++Ce,ht(bi,[n,t,e])}else t._listeners.push(e)}function bi(t,e,n){try{On=e;var s,a=e._value;e._state?s=t(a):(Ut.length&&(Ut=[]),s=t(a),Ut.indexOf(a)===-1&&function(i){for(var r=Pe.length;r;)if(Pe[--r]._value===i._value)return void Pe.splice(r,1)}(e)),n.resolve(s)}catch(i){n.reject(i)}finally{On=null,--Ce==0&&ys(),--n.psd.ref||n.psd.finalize()}}function pa(t,e,n){if(e.length===n)return e;var s="";if(t._state===!1){var a,i,r=t._value;r!=null?(a=r.name||"Error",i=r.message||r,s=Tn(r,0)):(a=r,i=""),e.push(a+(i?": "+i:"")+s)}return ue&&((s=Tn(t._stackHolder,2))&&e.indexOf(s)===-1&&e.push(s),t._prev&&pa(t._prev,e,n)),e}function ha(t,e){var n=e?e._numPrev+1:0;n<100&&(t._prev=e,t._numPrev=n)}function Bt(){Pt()&&Ct()}function Pt(){var t=Bn;return Bn=!1,sn=!1,t}function Ct(){var t,e,n;do for(;ct.length>0;)for(t=ct,ct=[],n=t.length,e=0;e<n;++e){var s=t[e];s[0].apply(null,s[1])}while(ct.length>0);Bn=!0,sn=!0}function ys(){var t=Pe;Pe=[],t.forEach(s=>{s._PSD.onunhandled.call(null,s._value,s)});for(var e=Wt.slice(0),n=e.length;n;)e[--n]()}function Ot(t){return new E(wt,!1,t)}function N(t,e){var n=D;return function(){var s=Pt(),a=D;try{return De(n,!0),t.apply(this,arguments)}catch(i){e&&e(i)}finally{De(a,!1),s&&Ct()}}}Ze(E.prototype,{then:Nn,_then:function(t,e){hs(this,new ca(null,null,t,e,D))},catch:function(t){if(arguments.length===1)return this.then(null,t);var e=arguments[0],n=arguments[1];return typeof e=="function"?this.then(null,s=>s instanceof e?n(s):Ot(s)):this.then(null,s=>s&&s.name===e?n(s):Ot(s))},finally:function(t){return this.then(e=>(t(),e),e=>(t(),Ot(e)))},stack:{get:function(){if(this._stack)return this._stack;try{qn=!0;var t=pa(this,[],20).join(`
From previous: `);return this._state!==null&&(this._stack=t),t}finally{qn=!1}}},timeout:function(t,e){return t<1/0?new E((n,s)=>{var a=setTimeout(()=>s(new I.Timeout(e)),t);this.then(n,s).finally(clearTimeout.bind(null,a))}):this}}),typeof Symbol<"u"&&Symbol.toStringTag&&ve(E.prototype,Symbol.toStringTag,"Dexie.Promise"),Xe.env=ya(),Ze(E,{all:function(){var t=fe.apply(null,arguments).map(Rt);return new E(function(e,n){t.length===0&&e([]);var s=t.length;t.forEach((a,i)=>E.resolve(a).then(r=>{t[i]=r,--s||e(t)},n))})},resolve:t=>{if(t instanceof E)return t;if(t&&typeof t.then=="function")return new E((n,s)=>{t.then(n,s)});var e=new E(wt,!0,t);return ha(e,On),e},reject:Ot,race:function(){var t=fe.apply(null,arguments).map(Rt);return new E((e,n)=>{t.map(s=>E.resolve(s).then(e,n))})},PSD:{get:()=>D,set:t=>D=t},totalEchoes:{get:()=>an},newPSD:Ae,usePSD:nt,scheduler:{get:()=>ht,set:t=>{ht=t}},rejectionMapper:{get:()=>Rn,set:t=>{Rn=t}},follow:(t,e)=>new E((n,s)=>Ae((a,i)=>{var r=D;r.unhandleds=[],r.onunhandled=i,r.finalize=Ne(function(){(function(o){function l(){o(),Wt.splice(Wt.indexOf(l),1)}Wt.push(l),++Ce,ht(()=>{--Ce==0&&ys()},[])})(()=>{this.unhandleds.length===0?a():i(this.unhandleds[0])})},r.finalize),t()},e,n,s))}),zt&&(zt.allSettled&&ve(E,"allSettled",function(){const t=fe.apply(null,arguments).map(Rt);return new E(e=>{t.length===0&&e([]);let n=t.length;const s=new Array(n);t.forEach((a,i)=>E.resolve(a).then(r=>s[i]={status:"fulfilled",value:r},r=>s[i]={status:"rejected",reason:r}).then(()=>--n||e(s)))})}),zt.any&&typeof AggregateError<"u"&&ve(E,"any",function(){const t=fe.apply(null,arguments).map(Rt);return new E((e,n)=>{t.length===0&&n(new AggregateError([]));let s=t.length;const a=new Array(s);t.forEach((i,r)=>E.resolve(i).then(o=>e(o),o=>{a[r]=o,--s||n(new AggregateError(a))}))})}));const V={awaits:0,echoes:0,id:0};var wi=0,Vt=[],bn=0,an=0,ki=0;function Ae(t,e,n,s){var a=D,i=Object.create(a);i.parent=a,i.ref=0,i.global=!1,i.id=++ki;var r=Xe.env;i.env=ps?{Promise:E,PromiseProp:{value:E,configurable:!0,writable:!0},all:E.all,race:E.race,allSettled:E.allSettled,any:E.any,resolve:E.resolve,reject:E.reject,nthen:Ts(r.nthen,i),gthen:Ts(r.gthen,i)}:{},e&&X(i,e),++a.ref,i.finalize=function(){--this.parent.ref||this.parent.finalize()};var o=nt(i,t,n,s);return i.ref===0&&i.finalize(),o}function tt(){return V.id||(V.id=++wi),++V.awaits,V.echoes+=oa,V.id}function we(){return!!V.awaits&&(--V.awaits==0&&(V.id=0),V.echoes=V.awaits*oa,!0)}function Rt(t){return V.echoes&&t&&t.constructor===zt?(tt(),t.then(e=>(we(),e),e=>(we(),z(e)))):t}function xi(t){++an,V.echoes&&--V.echoes!=0||(V.echoes=V.id=0),Vt.push(D),De(t,!0)}function Si(){var t=Vt[Vt.length-1];Vt.pop(),De(t,!1)}function De(t,e){var n=D;if((e?!V.echoes||bn++&&t===D:!bn||--bn&&t===D)||fa(e?xi.bind(null,t):Si),t!==D&&(D=t,n===Xe&&(Xe.env=ya()),ps)){var s=Xe.env.Promise,a=t.env;nn.then=a.nthen,s.prototype.then=a.gthen,(n.global||t.global)&&(Object.defineProperty(R,"Promise",a.PromiseProp),s.all=a.all,s.race=a.race,s.resolve=a.resolve,s.reject=a.reject,a.allSettled&&(s.allSettled=a.allSettled),a.any&&(s.any=a.any))}}function ya(){var t=R.Promise;return ps?{Promise:t,PromiseProp:Object.getOwnPropertyDescriptor(R,"Promise"),all:t.all,race:t.race,allSettled:t.allSettled,any:t.any,resolve:t.resolve,reject:t.reject,nthen:nn.then,gthen:t.prototype.then}:{}}function nt(t,e,n,s,a){var i=D;try{return De(t,!0),e(n,s,a)}finally{De(i,!1)}}function fa(t){la.call(Pn,t)}function rn(t,e,n,s){return typeof t!="function"?t:function(){var a=D;n&&tt(),De(e,!0);try{return t.apply(this,arguments)}finally{De(a,!1),s&&fa(we)}}}function Ts(t,e){return function(n,s){return t.call(this,rn(n,e),rn(s,e))}}(""+la).indexOf("[native code]")===-1&&(tt=we=q);const Ps="unhandledrejection";function Cs(t,e){var n;try{n=e.onuncatched(t)}catch{}if(n!==!1)try{var s,a={promise:e,reason:t};if(R.document&&document.createEvent?((s=document.createEvent("Event")).initEvent(Ps,!0,!0),X(s,a)):R.CustomEvent&&X(s=new CustomEvent(Ps,{detail:a}),a),s&&R.dispatchEvent&&(dispatchEvent(s),!R.PromiseRejectionEvent&&R.onunhandledrejection))try{R.onunhandledrejection(s)}catch{}ue&&s&&!s.defaultPrevented&&console.warn(`Unhandled rejection: ${t.stack||t}`)}catch{}}var z=E.reject;function Kn(t,e,n,s){if(t.idbdb&&(t._state.openComplete||D.letThrough||t._vip)){var a=t._createTransaction(e,n,t._dbSchema);try{a.create(),t._state.PR1398_maxLoop=3}catch(i){return i.name===ds.InvalidState&&t.isOpen()&&--t._state.PR1398_maxLoop>0?(console.warn("Dexie: Need to reopen db"),t._close(),t.open().then(()=>Kn(t,e,n,s))):z(i)}return a._promise(e,(i,r)=>Ae(()=>(D.trans=a,s(i,r,a)))).then(i=>a._completion.then(()=>i))}if(t._state.openComplete)return z(new I.DatabaseClosed(t._state.dbOpenError));if(!t._state.isBeingOpened){if(!t._options.autoOpen)return z(new I.DatabaseClosed);t.open().catch(q)}return t._state.dbReadyPromise.then(()=>Kn(t,e,n,s))}const qs="3.2.7",je="￿",Hn=-1/0,he="Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.",ma="String expected.",yt=[],pn=typeof navigator<"u"&&/(MSIE|Trident|Edge)/.test(navigator.userAgent),$i=pn,_i=pn,ga=t=>!/(dexie\.js|dexie\.min\.js)/.test(t),hn="__dbnames",wn="readonly",kn="readwrite";function Fe(t,e){return t?e?function(){return t.apply(this,arguments)&&e.apply(this,arguments)}:t:e}const va={type:3,lower:-1/0,lowerOpen:!1,upper:[[]],upperOpen:!1};function Nt(t){return typeof t!="string"||/\./.test(t)?e=>e:e=>(e[t]===void 0&&t in e&&delete(e=Tt(e))[t],e)}class Ei{_trans(e,n,s){const a=this._tx||D.trans,i=this.name;function r(l,d,c){if(!c.schema[i])throw new I.NotFound("Table "+i+" not part of transaction");return n(c.idbtrans,c)}const o=Pt();try{return a&&a.db===this.db?a===D.trans?a._promise(e,r,s):Ae(()=>a._promise(e,r,s),{trans:a,transless:D.transless||D}):Kn(this.db,e,[this.name],r)}finally{o&&Ct()}}get(e,n){return e&&e.constructor===Object?this.where(e).first(n):this._trans("readonly",s=>this.core.get({trans:s,key:e}).then(a=>this.hook.reading.fire(a))).then(n)}where(e){if(typeof e=="string")return new this.db.WhereClause(this,e);if(Y(e))return new this.db.WhereClause(this,`[${e.join("+")}]`);const n=G(e);if(n.length===1)return this.where(n[0]).equals(e[n[0]]);const s=this.schema.indexes.concat(this.schema.primKey).filter(d=>{if(d.compound&&n.every(c=>d.keyPath.indexOf(c)>=0)){for(let c=0;c<n.length;++c)if(n.indexOf(d.keyPath[c])===-1)return!1;return!0}return!1}).sort((d,c)=>d.keyPath.length-c.keyPath.length)[0];if(s&&this.db._maxKey!==je){const d=s.keyPath.slice(0,n.length);return this.where(d).equals(d.map(c=>e[c]))}!s&&ue&&console.warn(`The query ${JSON.stringify(e)} on ${this.name} would benefit of a compound index [${n.join("+")}]`);const{idxByName:a}=this.schema,i=this.db._deps.indexedDB;function r(d,c){try{return i.cmp(d,c)===0}catch{return!1}}const[o,l]=n.reduce(([d,c],u)=>{const p=a[u],h=e[u];return[d||p,d||!p?Fe(c,p&&p.multi?v=>{const f=be(v,u);return Y(f)&&f.some(g=>r(h,g))}:v=>r(h,be(v,u))):c]},[null,null]);return o?this.where(o.name).equals(e[o.keyPath]).filter(l):s?this.filter(l):this.where(n).equals("")}filter(e){return this.toCollection().and(e)}count(e){return this.toCollection().count(e)}offset(e){return this.toCollection().offset(e)}limit(e){return this.toCollection().limit(e)}each(e){return this.toCollection().each(e)}toArray(e){return this.toCollection().toArray(e)}toCollection(){return new this.db.Collection(new this.db.WhereClause(this))}orderBy(e){return new this.db.Collection(new this.db.WhereClause(this,Y(e)?`[${e.join("+")}]`:e))}reverse(){return this.toCollection().reverse()}mapToClass(e){this.schema.mappedClass=e;const n=s=>{if(!s)return s;const a=Object.create(e.prototype);for(var i in s)if(ae(s,i))try{a[i]=s[i]}catch{}return a};return this.schema.readHook&&this.hook.reading.unsubscribe(this.schema.readHook),this.schema.readHook=n,this.hook("reading",n),e}defineClass(){return this.mapToClass(function(e){X(this,e)})}add(e,n){const{auto:s,keyPath:a}=this.schema.primKey;let i=e;return a&&s&&(i=Nt(a)(e)),this._trans("readwrite",r=>this.core.mutate({trans:r,type:"add",keys:n!=null?[n]:null,values:[i]})).then(r=>r.numFailures?E.reject(r.failures[0]):r.lastResult).then(r=>{if(a)try{le(e,a,r)}catch{}return r})}update(e,n){if(typeof e!="object"||Y(e))return this.where(":id").equals(e).modify(n);{const s=be(e,this.schema.primKey.keyPath);if(s===void 0)return z(new I.InvalidArgument("Given object does not contain its primary key"));try{typeof n!="function"?G(n).forEach(a=>{le(e,a,n[a])}):n(e,{value:e,primKey:s})}catch{}return this.where(":id").equals(s).modify(n)}}put(e,n){const{auto:s,keyPath:a}=this.schema.primKey;let i=e;return a&&s&&(i=Nt(a)(e)),this._trans("readwrite",r=>this.core.mutate({trans:r,type:"put",values:[i],keys:n!=null?[n]:null})).then(r=>r.numFailures?E.reject(r.failures[0]):r.lastResult).then(r=>{if(a)try{le(e,a,r)}catch{}return r})}delete(e){return this._trans("readwrite",n=>this.core.mutate({trans:n,type:"delete",keys:[e]})).then(n=>n.numFailures?E.reject(n.failures[0]):void 0)}clear(){return this._trans("readwrite",e=>this.core.mutate({trans:e,type:"deleteRange",range:va})).then(e=>e.numFailures?E.reject(e.failures[0]):void 0)}bulkGet(e){return this._trans("readonly",n=>this.core.getMany({keys:e,trans:n}).then(s=>s.map(a=>this.hook.reading.fire(a))))}bulkAdd(e,n,s){const a=Array.isArray(n)?n:void 0,i=(s=s||(a?void 0:n))?s.allKeys:void 0;return this._trans("readwrite",r=>{const{auto:o,keyPath:l}=this.schema.primKey;if(l&&a)throw new I.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");if(a&&a.length!==e.length)throw new I.InvalidArgument("Arguments objects and keys must have the same length");const d=e.length;let c=l&&o?e.map(Nt(l)):e;return this.core.mutate({trans:r,type:"add",keys:a,values:c,wantResults:i}).then(({numFailures:u,results:p,lastResult:h,failures:v})=>{if(u===0)return i?p:h;throw new pt(`${this.name}.bulkAdd(): ${u} of ${d} operations failed`,v)})})}bulkPut(e,n,s){const a=Array.isArray(n)?n:void 0,i=(s=s||(a?void 0:n))?s.allKeys:void 0;return this._trans("readwrite",r=>{const{auto:o,keyPath:l}=this.schema.primKey;if(l&&a)throw new I.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");if(a&&a.length!==e.length)throw new I.InvalidArgument("Arguments objects and keys must have the same length");const d=e.length;let c=l&&o?e.map(Nt(l)):e;return this.core.mutate({trans:r,type:"put",keys:a,values:c,wantResults:i}).then(({numFailures:u,results:p,lastResult:h,failures:v})=>{if(u===0)return i?p:h;throw new pt(`${this.name}.bulkPut(): ${u} of ${d} operations failed`,v)})})}bulkDelete(e){const n=e.length;return this._trans("readwrite",s=>this.core.mutate({trans:s,type:"delete",keys:e})).then(({numFailures:s,lastResult:a,failures:i})=>{if(s===0)return a;throw new pt(`${this.name}.bulkDelete(): ${s} of ${n} operations failed`,i)})}}function ft(t){var e={},n=function(r,o){if(o){for(var l=arguments.length,d=new Array(l-1);--l;)d[l-1]=arguments[l];return e[r].subscribe.apply(null,d),t}if(typeof r=="string")return e[r]};n.addEventType=i;for(var s=1,a=arguments.length;s<a;++s)i(arguments[s]);return n;function i(r,o,l){if(typeof r!="object"){var d;o||(o=gi),l||(l=q);var c={subscribers:[],fire:l,subscribe:function(u){c.subscribers.indexOf(u)===-1&&(c.subscribers.push(u),c.fire=o(c.fire,u))},unsubscribe:function(u){c.subscribers=c.subscribers.filter(function(p){return p!==u}),c.fire=c.subscribers.reduce(o,l)}};return e[r]=n[r]=c,c}G(d=r).forEach(function(u){var p=d[u];if(Y(p))i(u,d[u][0],d[u][1]);else{if(p!=="asap")throw new I.InvalidArgument("Invalid event config");var h=i(u,bt,function(){for(var v=arguments.length,f=new Array(v);v--;)f[v]=arguments[v];h.subscribers.forEach(function(g){Xs(function(){g.apply(null,f)})})})}})}}function it(t,e){return Je(e).from({prototype:t}),e}function We(t,e){return!(t.filter||t.algorithm||t.or)&&(e?t.justLimit:!t.replayFilter)}function xn(t,e){t.filter=Fe(t.filter,e)}function Sn(t,e,n){var s=t.replayFilter;t.replayFilter=s?()=>Fe(s(),e()):e,t.justLimit=n&&!s}function Yt(t,e){if(t.isPrimKey)return e.primaryKey;const n=e.getIndexByKeyPath(t.index);if(!n)throw new I.Schema("KeyPath "+t.index+" on object store "+e.name+" is not indexed");return n}function Bs(t,e,n){const s=Yt(t,e.schema);return e.openCursor({trans:n,values:!t.keysOnly,reverse:t.dir==="prev",unique:!!t.unique,query:{index:s,range:t.range}})}function Ft(t,e,n,s){const a=t.replayFilter?Fe(t.filter,t.replayFilter()):t.filter;if(t.or){const i={},r=(o,l,d)=>{if(!a||a(l,d,p=>l.stop(p),p=>l.fail(p))){var c=l.primaryKey,u=""+c;u==="[object ArrayBuffer]"&&(u=""+new Uint8Array(c)),ae(i,u)||(i[u]=!0,e(o,l,d))}};return Promise.all([t.or._iterate(r,n),Os(Bs(t,s,n),t.algorithm,r,!t.keysOnly&&t.valueMapper)])}return Os(Bs(t,s,n),Fe(t.algorithm,a),e,!t.keysOnly&&t.valueMapper)}function Os(t,e,n,s){var a=N(s?(i,r,o)=>n(s(i),r,o):n);return t.then(i=>{if(i)return i.start(()=>{var r=()=>i.continue();e&&!e(i,o=>r=o,o=>{i.stop(o),r=q},o=>{i.fail(o),r=q})||a(i.value,i,o=>r=o),r()})})}function Q(t,e){try{const n=Rs(t),s=Rs(e);if(n!==s)return n==="Array"?1:s==="Array"?-1:n==="binary"?1:s==="binary"?-1:n==="string"?1:s==="string"?-1:n==="Date"?1:s!=="Date"?NaN:-1;switch(n){case"number":case"Date":case"string":return t>e?1:t<e?-1:0;case"binary":return function(a,i){const r=a.length,o=i.length,l=r<o?r:o;for(let d=0;d<l;++d)if(a[d]!==i[d])return a[d]<i[d]?-1:1;return r===o?0:r<o?-1:1}(Ns(t),Ns(e));case"Array":return function(a,i){const r=a.length,o=i.length,l=r<o?r:o;for(let d=0;d<l;++d){const c=Q(a[d],i[d]);if(c!==0)return c}return r===o?0:r<o?-1:1}(t,e)}}catch{}return NaN}function Rs(t){const e=typeof t;if(e!=="object")return e;if(ArrayBuffer.isView(t))return"binary";const n=Ln(t);return n==="ArrayBuffer"?"binary":n}function Ns(t){return t instanceof Uint8Array?t:ArrayBuffer.isView(t)?new Uint8Array(t.buffer,t.byteOffset,t.byteLength):new Uint8Array(t)}class Ai{_read(e,n){var s=this._ctx;return s.error?s.table._trans(null,z.bind(null,s.error)):s.table._trans("readonly",e).then(n)}_write(e){var n=this._ctx;return n.error?n.table._trans(null,z.bind(null,n.error)):n.table._trans("readwrite",e,"locked")}_addAlgorithm(e){var n=this._ctx;n.algorithm=Fe(n.algorithm,e)}_iterate(e,n){return Ft(this._ctx,e,n,this._ctx.table.core)}clone(e){var n=Object.create(this.constructor.prototype),s=Object.create(this._ctx);return e&&X(s,e),n._ctx=s,n}raw(){return this._ctx.valueMapper=null,this}each(e){var n=this._ctx;return this._read(s=>Ft(n,e,s,n.table.core))}count(e){return this._read(n=>{const s=this._ctx,a=s.table.core;if(We(s,!0))return a.count({trans:n,query:{index:Yt(s,a.schema),range:s.range}}).then(r=>Math.min(r,s.limit));var i=0;return Ft(s,()=>(++i,!1),n,a).then(()=>i)}).then(e)}sortBy(e,n){const s=e.split(".").reverse(),a=s[0],i=s.length-1;function r(d,c){return c?r(d[s[c]],c-1):d[a]}var o=this._ctx.dir==="next"?1:-1;function l(d,c){var u=r(d,i),p=r(c,i);return u<p?-o:u>p?o:0}return this.toArray(function(d){return d.sort(l)}).then(n)}toArray(e){return this._read(n=>{var s=this._ctx;if(s.dir==="next"&&We(s,!0)&&s.limit>0){const{valueMapper:a}=s,i=Yt(s,s.table.core.schema);return s.table.core.query({trans:n,limit:s.limit,values:!0,query:{index:i,range:s.range}}).then(({result:r})=>a?r.map(a):r)}{const a=[];return Ft(s,i=>a.push(i),n,s.table.core).then(()=>a)}},e)}offset(e){var n=this._ctx;return e<=0||(n.offset+=e,We(n)?Sn(n,()=>{var s=e;return(a,i)=>s===0||(s===1?(--s,!1):(i(()=>{a.advance(s),s=0}),!1))}):Sn(n,()=>{var s=e;return()=>--s<0})),this}limit(e){return this._ctx.limit=Math.min(this._ctx.limit,e),Sn(this._ctx,()=>{var n=e;return function(s,a,i){return--n<=0&&a(i),n>=0}},!0),this}until(e,n){return xn(this._ctx,function(s,a,i){return!e(s.value)||(a(i),n)}),this}first(e){return this.limit(1).toArray(function(n){return n[0]}).then(e)}last(e){return this.reverse().first(e)}filter(e){var n,s;return xn(this._ctx,function(a){return e(a.value)}),n=this._ctx,s=e,n.isMatch=Fe(n.isMatch,s),this}and(e){return this.filter(e)}or(e){return new this.db.WhereClause(this._ctx.table,e,this)}reverse(){return this._ctx.dir=this._ctx.dir==="prev"?"next":"prev",this._ondirectionchange&&this._ondirectionchange(this._ctx.dir),this}desc(){return this.reverse()}eachKey(e){var n=this._ctx;return n.keysOnly=!n.isMatch,this.each(function(s,a){e(a.key,a)})}eachUniqueKey(e){return this._ctx.unique="unique",this.eachKey(e)}eachPrimaryKey(e){var n=this._ctx;return n.keysOnly=!n.isMatch,this.each(function(s,a){e(a.primaryKey,a)})}keys(e){var n=this._ctx;n.keysOnly=!n.isMatch;var s=[];return this.each(function(a,i){s.push(i.key)}).then(function(){return s}).then(e)}primaryKeys(e){var n=this._ctx;if(n.dir==="next"&&We(n,!0)&&n.limit>0)return this._read(a=>{var i=Yt(n,n.table.core.schema);return n.table.core.query({trans:a,values:!1,limit:n.limit,query:{index:i,range:n.range}})}).then(({result:a})=>a).then(e);n.keysOnly=!n.isMatch;var s=[];return this.each(function(a,i){s.push(i.primaryKey)}).then(function(){return s}).then(e)}uniqueKeys(e){return this._ctx.unique="unique",this.keys(e)}firstKey(e){return this.limit(1).keys(function(n){return n[0]}).then(e)}lastKey(e){return this.reverse().firstKey(e)}distinct(){var e=this._ctx,n=e.index&&e.table.schema.idxByName[e.index];if(!n||!n.multi)return this;var s={};return xn(this._ctx,function(a){var i=a.primaryKey.toString(),r=ae(s,i);return s[i]=!0,!r}),this}modify(e){var n=this._ctx;return this._write(s=>{var a;if(typeof e=="function")a=e;else{var i=G(e),r=i.length;a=function(f){for(var g=!1,y=0;y<r;++y){var m=i[y],b=e[m];be(f,m)!==b&&(le(f,m,b),g=!0)}return g}}const o=n.table.core,{outbound:l,extractKey:d}=o.schema.primaryKey,c=this.db._options.modifyChunkSize||200,u=[];let p=0;const h=[],v=(f,g)=>{const{failures:y,numFailures:m}=g;p+=f-m;for(let b of G(y))u.push(y[b])};return this.clone().primaryKeys().then(f=>{const g=y=>{const m=Math.min(c,f.length-y);return o.getMany({trans:s,keys:f.slice(y,y+m),cache:"immutable"}).then(b=>{const k=[],_=[],w=l?[]:null,x=[];for(let $=0;$<m;++$){const T=b[$],L={value:Tt(T),primKey:f[y+$]};a.call(L,L.value,L)!==!1&&(L.value==null?x.push(f[y+$]):l||Q(d(T),d(L.value))===0?(_.push(L.value),l&&w.push(f[y+$])):(x.push(f[y+$]),k.push(L.value)))}const M=We(n)&&n.limit===1/0&&(typeof e!="function"||e===$n)&&{index:n.index,range:n.range};return Promise.resolve(k.length>0&&o.mutate({trans:s,type:"add",values:k}).then($=>{for(let T in $.failures)x.splice(parseInt(T),1);v(k.length,$)})).then(()=>(_.length>0||M&&typeof e=="object")&&o.mutate({trans:s,type:"put",keys:w,values:_,criteria:M,changeSpec:typeof e!="function"&&e}).then($=>v(_.length,$))).then(()=>(x.length>0||M&&e===$n)&&o.mutate({trans:s,type:"delete",keys:x,criteria:M}).then($=>v(x.length,$))).then(()=>f.length>y+m&&g(y+c))})};return g(0).then(()=>{if(u.length>0)throw new tn("Error modifying one or more objects",u,p,h);return f.length})})})}delete(){var e=this._ctx,n=e.range;return We(e)&&(e.isPrimKey&&!_i||n.type===3)?this._write(s=>{const{primaryKey:a}=e.table.core.schema,i=n;return e.table.core.count({trans:s,query:{index:a,range:i}}).then(r=>e.table.core.mutate({trans:s,type:"deleteRange",range:i}).then(({failures:o,lastResult:l,results:d,numFailures:c})=>{if(c)throw new tn("Could not delete some values",Object.keys(o).map(u=>o[u]),r-c);return r-c}))}):this.modify($n)}}const $n=(t,e)=>e.value=null;function Di(t,e){return t<e?-1:t===e?0:1}function Mi(t,e){return t>e?-1:t===e?0:1}function se(t,e,n){var s=t instanceof wa?new t.Collection(t):t;return s._ctx.error=n?new n(e):new TypeError(e),s}function Ve(t){return new t.Collection(t,()=>ba("")).limit(0)}function Ii(t,e,n,s,a,i){for(var r=Math.min(t.length,s.length),o=-1,l=0;l<r;++l){var d=e[l];if(d!==s[l])return a(t[l],n[l])<0?t.substr(0,l)+n[l]+n.substr(l+1):a(t[l],s[l])<0?t.substr(0,l)+s[l]+n.substr(l+1):o>=0?t.substr(0,o)+e[o]+n.substr(o+1):null;a(t[l],d)<0&&(o=l)}return r<s.length&&i==="next"?t+n.substr(t.length):r<t.length&&i==="prev"?t.substr(0,n.length):o<0?null:t.substr(0,o)+s[o]+n.substr(o+1)}function Kt(t,e,n,s){var a,i,r,o,l,d,c,u=n.length;if(!n.every(f=>typeof f=="string"))return se(t,ma);function p(f){a=function(y){return y==="next"?m=>m.toUpperCase():m=>m.toLowerCase()}(f),i=function(y){return y==="next"?m=>m.toLowerCase():m=>m.toUpperCase()}(f),r=f==="next"?Di:Mi;var g=n.map(function(y){return{lower:i(y),upper:a(y)}}).sort(function(y,m){return r(y.lower,m.lower)});o=g.map(function(y){return y.upper}),l=g.map(function(y){return y.lower}),d=f,c=f==="next"?"":s}p("next");var h=new t.Collection(t,()=>xe(o[0],l[u-1]+s));h._ondirectionchange=function(f){p(f)};var v=0;return h._addAlgorithm(function(f,g,y){var m=f.key;if(typeof m!="string")return!1;var b=i(m);if(e(b,l,v))return!0;for(var k=null,_=v;_<u;++_){var w=Ii(m,b,o[_],l[_],r,d);w===null&&k===null?v=_+1:(k===null||r(k,w)>0)&&(k=w)}return g(k!==null?function(){f.continue(k+c)}:y),!1}),h}function xe(t,e,n,s){return{type:2,lower:t,upper:e,lowerOpen:n,upperOpen:s}}function ba(t){return{type:1,lower:t,upper:t}}class wa{get Collection(){return this._ctx.table.db.Collection}between(e,n,s,a){s=s!==!1,a=a===!0;try{return this._cmp(e,n)>0||this._cmp(e,n)===0&&(s||a)&&(!s||!a)?Ve(this):new this.Collection(this,()=>xe(e,n,!s,!a))}catch{return se(this,he)}}equals(e){return e==null?se(this,he):new this.Collection(this,()=>ba(e))}above(e){return e==null?se(this,he):new this.Collection(this,()=>xe(e,void 0,!0))}aboveOrEqual(e){return e==null?se(this,he):new this.Collection(this,()=>xe(e,void 0,!1))}below(e){return e==null?se(this,he):new this.Collection(this,()=>xe(void 0,e,!1,!0))}belowOrEqual(e){return e==null?se(this,he):new this.Collection(this,()=>xe(void 0,e))}startsWith(e){return typeof e!="string"?se(this,ma):this.between(e,e+je,!0,!0)}startsWithIgnoreCase(e){return e===""?this.startsWith(e):Kt(this,(n,s)=>n.indexOf(s[0])===0,[e],je)}equalsIgnoreCase(e){return Kt(this,(n,s)=>n===s[0],[e],"")}anyOfIgnoreCase(){var e=fe.apply(Ye,arguments);return e.length===0?Ve(this):Kt(this,(n,s)=>s.indexOf(n)!==-1,e,"")}startsWithAnyOfIgnoreCase(){var e=fe.apply(Ye,arguments);return e.length===0?Ve(this):Kt(this,(n,s)=>s.some(a=>n.indexOf(a)===0),e,je)}anyOf(){const e=fe.apply(Ye,arguments);let n=this._cmp;try{e.sort(n)}catch{return se(this,he)}if(e.length===0)return Ve(this);const s=new this.Collection(this,()=>xe(e[0],e[e.length-1]));s._ondirectionchange=i=>{n=i==="next"?this._ascending:this._descending,e.sort(n)};let a=0;return s._addAlgorithm((i,r,o)=>{const l=i.key;for(;n(l,e[a])>0;)if(++a,a===e.length)return r(o),!1;return n(l,e[a])===0||(r(()=>{i.continue(e[a])}),!1)}),s}notEqual(e){return this.inAnyRange([[Hn,e],[e,this.db._maxKey]],{includeLowers:!1,includeUppers:!1})}noneOf(){const e=fe.apply(Ye,arguments);if(e.length===0)return new this.Collection(this);try{e.sort(this._ascending)}catch{return se(this,he)}const n=e.reduce((s,a)=>s?s.concat([[s[s.length-1][1],a]]):[[Hn,a]],null);return n.push([e[e.length-1],this.db._maxKey]),this.inAnyRange(n,{includeLowers:!1,includeUppers:!1})}inAnyRange(e,n){const s=this._cmp,a=this._ascending,i=this._descending,r=this._min,o=this._max;if(e.length===0)return Ve(this);if(!e.every(m=>m[0]!==void 0&&m[1]!==void 0&&a(m[0],m[1])<=0))return se(this,"First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower",I.InvalidArgument);const l=!n||n.includeLowers!==!1,d=n&&n.includeUppers===!0;let c,u=a;function p(m,b){return u(m[0],b[0])}try{c=e.reduce(function(m,b){let k=0,_=m.length;for(;k<_;++k){const w=m[k];if(s(b[0],w[1])<0&&s(b[1],w[0])>0){w[0]=r(w[0],b[0]),w[1]=o(w[1],b[1]);break}}return k===_&&m.push(b),m},[]),c.sort(p)}catch{return se(this,he)}let h=0;const v=d?m=>a(m,c[h][1])>0:m=>a(m,c[h][1])>=0,f=l?m=>i(m,c[h][0])>0:m=>i(m,c[h][0])>=0;let g=v;const y=new this.Collection(this,()=>xe(c[0][0],c[c.length-1][1],!l,!d));return y._ondirectionchange=m=>{m==="next"?(g=v,u=a):(g=f,u=i),c.sort(p)},y._addAlgorithm((m,b,k)=>{for(var _=m.key;g(_);)if(++h,h===c.length)return b(k),!1;return!!function(w){return!v(w)&&!f(w)}(_)||(this._cmp(_,c[h][1])===0||this._cmp(_,c[h][0])===0||b(()=>{u===a?m.continue(c[h][0]):m.continue(c[h][1])}),!1)}),y}startsWithAnyOf(){const e=fe.apply(Ye,arguments);return e.every(n=>typeof n=="string")?e.length===0?Ve(this):this.inAnyRange(e.map(n=>[n,n+je])):se(this,"startsWithAnyOf() only works with strings")}}function de(t){return N(function(e){return kt(e),t(e.target.error),!1})}function kt(t){t.stopPropagation&&t.stopPropagation(),t.preventDefault&&t.preventDefault()}const xt="storagemutated",$e="x-storagemutated-1",Me=ft(null,xt);class Li{_lock(){return lt(!D.global),++this._reculock,this._reculock!==1||D.global||(D.lockOwnerFor=this),this}_unlock(){if(lt(!D.global),--this._reculock==0)for(D.global||(D.lockOwnerFor=null);this._blockedFuncs.length>0&&!this._locked();){var e=this._blockedFuncs.shift();try{nt(e[1],e[0])}catch{}}return this}_locked(){return this._reculock&&D.lockOwnerFor!==this}create(e){if(!this.mode)return this;const n=this.db.idbdb,s=this.db._state.dbOpenError;if(lt(!this.idbtrans),!e&&!n)switch(s&&s.name){case"DatabaseClosedError":throw new I.DatabaseClosed(s);case"MissingAPIError":throw new I.MissingAPI(s.message,s);default:throw new I.OpenFailed(s)}if(!this.active)throw new I.TransactionInactive;return lt(this._completion._state===null),(e=this.idbtrans=e||(this.db.core?this.db.core.transaction(this.storeNames,this.mode,{durability:this.chromeTransactionDurability}):n.transaction(this.storeNames,this.mode,{durability:this.chromeTransactionDurability}))).onerror=N(a=>{kt(a),this._reject(e.error)}),e.onabort=N(a=>{kt(a),this.active&&this._reject(new I.Abort(e.error)),this.active=!1,this.on("abort").fire(a)}),e.oncomplete=N(()=>{this.active=!1,this._resolve(),"mutatedParts"in e&&Me.storagemutated.fire(e.mutatedParts)}),this}_promise(e,n,s){if(e==="readwrite"&&this.mode!=="readwrite")return z(new I.ReadOnly("Transaction is readonly"));if(!this.active)return z(new I.TransactionInactive);if(this._locked())return new E((i,r)=>{this._blockedFuncs.push([()=>{this._promise(e,n,s).then(i,r)},D])});if(s)return Ae(()=>{var i=new E((r,o)=>{this._lock();const l=n(r,o,this);l&&l.then&&l.then(r,o)});return i.finally(()=>this._unlock()),i._lib=!0,i});var a=new E((i,r)=>{var o=n(i,r,this);o&&o.then&&o.then(i,r)});return a._lib=!0,a}_root(){return this.parent?this.parent._root():this}waitFor(e){var n=this._root();const s=E.resolve(e);if(n._waitingFor)n._waitingFor=n._waitingFor.then(()=>s);else{n._waitingFor=s,n._waitingQueue=[];var a=n.idbtrans.objectStore(n.storeNames[0]);(function r(){for(++n._spinCount;n._waitingQueue.length;)n._waitingQueue.shift()();n._waitingFor&&(a.get(-1/0).onsuccess=r)})()}var i=n._waitingFor;return new E((r,o)=>{s.then(l=>n._waitingQueue.push(N(r.bind(null,l))),l=>n._waitingQueue.push(N(o.bind(null,l)))).finally(()=>{n._waitingFor===i&&(n._waitingFor=null)})})}abort(){this.active&&(this.active=!1,this.idbtrans&&this.idbtrans.abort(),this._reject(new I.Abort))}table(e){const n=this._memoizedTables||(this._memoizedTables={});if(ae(n,e))return n[e];const s=this.schema[e];if(!s)throw new I.NotFound("Table "+e+" not part of transaction");const a=new this.db.Table(e,s,this);return a.core=this.db.core.table(e),n[e]=a,a}}function Gn(t,e,n,s,a,i,r){return{name:t,keyPath:e,unique:n,multi:s,auto:a,compound:i,src:(n&&!r?"&":"")+(s?"*":"")+(a?"++":"")+ka(e)}}function ka(t){return typeof t=="string"?t:t?"["+[].join.call(t,"+")+"]":""}function xa(t,e,n){return{name:t,primKey:e,indexes:n,mappedClass:null,idxByName:Zs(n,s=>[s.name,s])}}let St=t=>{try{return t.only([[]]),St=()=>[[]],[[]]}catch{return St=()=>je,je}};function zn(t){return t==null?()=>{}:typeof t=="string"?function(e){return e.split(".").length===1?s=>s[e]:s=>be(s,e)}(t):e=>be(e,t)}function Fs(t){return[].slice.call(t)}let ji=0;function mt(t){return t==null?":id":typeof t=="string"?t:`[${t.join("+")}]`}function Ti(t,e,n){function s(l){if(l.type===3)return null;if(l.type===4)throw new Error("Cannot convert never type to IDBKeyRange");const{lower:d,upper:c,lowerOpen:u,upperOpen:p}=l;return d===void 0?c===void 0?null:e.upperBound(c,!!p):c===void 0?e.lowerBound(d,!!u):e.bound(d,c,!!u,!!p)}const{schema:a,hasGetAll:i}=function(l,d){const c=Fs(l.objectStoreNames);return{schema:{name:l.name,tables:c.map(u=>d.objectStore(u)).map(u=>{const{keyPath:p,autoIncrement:h}=u,v=Y(p),f=p==null,g={},y={name:u.name,primaryKey:{name:null,isPrimaryKey:!0,outbound:f,compound:v,keyPath:p,autoIncrement:h,unique:!0,extractKey:zn(p)},indexes:Fs(u.indexNames).map(m=>u.index(m)).map(m=>{const{name:b,unique:k,multiEntry:_,keyPath:w}=m,x={name:b,compound:Y(w),keyPath:w,unique:k,multiEntry:_,extractKey:zn(w)};return g[mt(w)]=x,x}),getIndexByKeyPath:m=>g[mt(m)]};return g[":id"]=y.primaryKey,p!=null&&(g[mt(p)]=y.primaryKey),y})},hasGetAll:c.length>0&&"getAll"in d.objectStore(c[0])&&!(typeof navigator<"u"&&/Safari/.test(navigator.userAgent)&&!/(Chrome\/|Edge\/)/.test(navigator.userAgent)&&[].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1]<604)}}(t,n),r=a.tables.map(l=>function(d){const c=d.name;return{name:c,schema:d,mutate:function({trans:u,type:p,keys:h,values:v,range:f}){return new Promise((g,y)=>{g=N(g);const m=u.objectStore(c),b=m.keyPath==null,k=p==="put"||p==="add";if(!k&&p!=="delete"&&p!=="deleteRange")throw new Error("Invalid operation type: "+p);const{length:_}=h||v||{length:1};if(h&&v&&h.length!==v.length)throw new Error("Given keys array must have same length as given values array.");if(_===0)return g({numFailures:0,failures:{},results:[],lastResult:void 0});let w;const x=[],M=[];let $=0;const T=H=>{++$,kt(H)};if(p==="deleteRange"){if(f.type===4)return g({numFailures:$,failures:M,results:[],lastResult:void 0});f.type===3?x.push(w=m.clear()):x.push(w=m.delete(s(f)))}else{const[H,K]=k?b?[v,h]:[v,null]:[h,null];if(k)for(let C=0;C<_;++C)x.push(w=K&&K[C]!==void 0?m[p](H[C],K[C]):m[p](H[C])),w.onerror=T;else for(let C=0;C<_;++C)x.push(w=m[p](H[C])),w.onerror=T}const L=H=>{const K=H.target.result;x.forEach((C,W)=>C.error!=null&&(M[W]=C.error)),g({numFailures:$,failures:M,results:p==="delete"?h:x.map(C=>C.result),lastResult:K})};w.onerror=H=>{T(H),L(H)},w.onsuccess=L})},getMany:({trans:u,keys:p})=>new Promise((h,v)=>{h=N(h);const f=u.objectStore(c),g=p.length,y=new Array(g);let m,b=0,k=0;const _=x=>{const M=x.target;y[M._pos]=M.result,++k===b&&h(y)},w=de(v);for(let x=0;x<g;++x)p[x]!=null&&(m=f.get(p[x]),m._pos=x,m.onsuccess=_,m.onerror=w,++b);b===0&&h(y)}),get:({trans:u,key:p})=>new Promise((h,v)=>{h=N(h);const f=u.objectStore(c).get(p);f.onsuccess=g=>h(g.target.result),f.onerror=de(v)}),query:function(u){return p=>new Promise((h,v)=>{h=N(h);const{trans:f,values:g,limit:y,query:m}=p,b=y===1/0?void 0:y,{index:k,range:_}=m,w=f.objectStore(c),x=k.isPrimaryKey?w:w.index(k.name),M=s(_);if(y===0)return h({result:[]});if(u){const $=g?x.getAll(M,b):x.getAllKeys(M,b);$.onsuccess=T=>h({result:T.target.result}),$.onerror=de(v)}else{let $=0;const T=g||!("openKeyCursor"in x)?x.openCursor(M):x.openKeyCursor(M),L=[];T.onsuccess=H=>{const K=T.result;return K?(L.push(g?K.value:K.primaryKey),++$===y?h({result:L}):void K.continue()):h({result:L})},T.onerror=de(v)}})}(i),openCursor:function({trans:u,values:p,query:h,reverse:v,unique:f}){return new Promise((g,y)=>{g=N(g);const{index:m,range:b}=h,k=u.objectStore(c),_=m.isPrimaryKey?k:k.index(m.name),w=v?f?"prevunique":"prev":f?"nextunique":"next",x=p||!("openKeyCursor"in _)?_.openCursor(s(b),w):_.openKeyCursor(s(b),w);x.onerror=de(y),x.onsuccess=N(M=>{const $=x.result;if(!$)return void g(null);$.___id=++ji,$.done=!1;const T=$.continue.bind($);let L=$.continuePrimaryKey;L&&(L=L.bind($));const H=$.advance.bind($),K=()=>{throw new Error("Cursor not stopped")};$.trans=u,$.stop=$.continue=$.continuePrimaryKey=$.advance=()=>{throw new Error("Cursor not started")},$.fail=N(y),$.next=function(){let C=1;return this.start(()=>C--?this.continue():this.stop()).then(()=>this)},$.start=C=>{const W=new Promise((U,A)=>{U=N(U),x.onerror=de(A),$.fail=A,$.stop=O=>{$.stop=$.continue=$.continuePrimaryKey=$.advance=K,U(O)}}),Z=()=>{if(x.result)try{C()}catch(U){$.fail(U)}else $.done=!0,$.start=()=>{throw new Error("Cursor behind last entry")},$.stop()};return x.onsuccess=N(U=>{x.onsuccess=Z,Z()}),$.continue=T,$.continuePrimaryKey=L,$.advance=H,Z(),W},g($)},y)})},count({query:u,trans:p}){const{index:h,range:v}=u;return new Promise((f,g)=>{const y=p.objectStore(c),m=h.isPrimaryKey?y:y.index(h.name),b=s(v),k=b?m.count(b):m.count();k.onsuccess=N(_=>f(_.target.result)),k.onerror=de(g)})}}}(l)),o={};return r.forEach(l=>o[l.name]=l),{stack:"dbcore",transaction:t.transaction.bind(t),table(l){if(!o[l])throw new Error(`Table '${l}' not found`);return o[l]},MIN_KEY:-1/0,MAX_KEY:St(e),schema:a}}function Un({_novip:t},e){const n=e.db,s=function(a,i,{IDBKeyRange:r,indexedDB:o},l){return{dbcore:function(c,u){return u.reduce((p,{create:h})=>({...p,...h(p)}),c)}(Ti(i,r,l),a.dbcore)}}(t._middlewares,n,t._deps,e);t.core=s.dbcore,t.tables.forEach(a=>{const i=a.name;t.core.schema.tables.some(r=>r.name===i)&&(a.core=t.core.table(i),t[i]instanceof t.Table&&(t[i].core=a.core))})}function on({_novip:t},e,n,s){n.forEach(a=>{const i=s[a];e.forEach(r=>{const o=os(r,a);(!o||"value"in o&&o.value===void 0)&&(r===t.Transaction.prototype||r instanceof t.Transaction?ve(r,a,{get(){return this.table(a)},set(l){Js(this,a,{value:l,writable:!0,configurable:!0,enumerable:!0})}}):r[a]=new t.Table(a,i))})})}function Wn({_novip:t},e){e.forEach(n=>{for(let s in n)n[s]instanceof t.Table&&delete n[s]})}function Pi(t,e){return t._cfg.version-e._cfg.version}function Ci(t,e,n,s){const a=t._dbSchema,i=t._createTransaction("readwrite",t._storeNames,a);i.create(n),i._completion.catch(s);const r=i._reject.bind(i),o=D.transless||D;Ae(()=>{D.trans=i,D.transless=o,e===0?(G(a).forEach(l=>{_n(n,l,a[l].primKey,a[l].indexes)}),Un(t,n),E.follow(()=>t.on.populate.fire(i)).catch(r)):function({_novip:l},d,c,u){const p=[],h=l._versions;let v=l._dbSchema=Yn(l,l.idbdb,u),f=!1;const g=h.filter(m=>m._cfg.version>=d);function y(){return p.length?E.resolve(p.shift()(c.idbtrans)).then(y):E.resolve()}return g.forEach(m=>{p.push(()=>{const b=v,k=m._cfg.dbschema;Jn(l,b,u),Jn(l,k,u),v=l._dbSchema=k;const _=Sa(b,k);_.add.forEach(x=>{_n(u,x[0],x[1].primKey,x[1].indexes)}),_.change.forEach(x=>{if(x.recreate)throw new I.Upgrade("Not yet support for changing primary key");{const M=u.objectStore(x.name);x.add.forEach($=>Vn(M,$)),x.change.forEach($=>{M.deleteIndex($.name),Vn(M,$)}),x.del.forEach($=>M.deleteIndex($))}});const w=m._cfg.contentUpgrade;if(w&&m._cfg.version>d){Un(l,u),c._memoizedTables={},f=!0;let x=ea(k);_.del.forEach(L=>{x[L]=b[L]}),Wn(l,[l.Transaction.prototype]),on(l,[l.Transaction.prototype],G(x),x),c.schema=x;const M=ls(w);let $;M&&tt();const T=E.follow(()=>{if($=w(c),$&&M){var L=we.bind(null,null);$.then(L,L)}});return $&&typeof $.then=="function"?E.resolve($):T.then(()=>$)}}),p.push(b=>{(!f||!$i)&&function(k,_){[].slice.call(_.db.objectStoreNames).forEach(w=>k[w]==null&&_.db.deleteObjectStore(w))}(m._cfg.dbschema,b),Wn(l,[l.Transaction.prototype]),on(l,[l.Transaction.prototype],l._storeNames,l._dbSchema),c.schema=l._dbSchema})}),y().then(()=>{var m,b;b=u,G(m=v).forEach(k=>{b.db.objectStoreNames.contains(k)||_n(b,k,m[k].primKey,m[k].indexes)})})}(t,e,i,n).catch(r)})}function Sa(t,e){const n={del:[],add:[],change:[]};let s;for(s in t)e[s]||n.del.push(s);for(s in e){const a=t[s],i=e[s];if(a){const r={name:s,def:i,recreate:!1,del:[],add:[],change:[]};if(""+(a.primKey.keyPath||"")!=""+(i.primKey.keyPath||"")||a.primKey.auto!==i.primKey.auto&&!pn)r.recreate=!0,n.change.push(r);else{const o=a.idxByName,l=i.idxByName;let d;for(d in o)l[d]||r.del.push(d);for(d in l){const c=o[d],u=l[d];c?c.src!==u.src&&r.change.push(u):r.add.push(u)}(r.del.length>0||r.add.length>0||r.change.length>0)&&n.change.push(r)}}else n.add.push([s,i])}return n}function _n(t,e,n,s){const a=t.db.createObjectStore(e,n.keyPath?{keyPath:n.keyPath,autoIncrement:n.auto}:{autoIncrement:n.auto});return s.forEach(i=>Vn(a,i)),a}function Vn(t,e){t.createIndex(e.name,e.keyPath,{unique:e.unique,multiEntry:e.multi})}function Yn(t,e,n){const s={};return en(e.objectStoreNames,0).forEach(a=>{const i=n.objectStore(a);let r=i.keyPath;const o=Gn(ka(r),r||"",!1,!1,!!i.autoIncrement,r&&typeof r!="string",!0),l=[];for(let c=0;c<i.indexNames.length;++c){const u=i.index(i.indexNames[c]);r=u.keyPath;var d=Gn(u.name,r,!!u.unique,!!u.multiEntry,!1,r&&typeof r!="string",!1);l.push(d)}s[a]=xa(a,o,l)}),s}function Jn({_novip:t},e,n){const s=n.db.objectStoreNames;for(let a=0;a<s.length;++a){const i=s[a],r=n.objectStore(i);t._hasGetAll="getAll"in r;for(let o=0;o<r.indexNames.length;++o){const l=r.indexNames[o],d=r.index(l).keyPath,c=typeof d=="string"?d:"["+en(d).join("+")+"]";if(e[i]){const u=e[i].idxByName[c];u&&(u.name=l,delete e[i].idxByName[c],e[i].idxByName[l]=u)}}}typeof navigator<"u"&&/Safari/.test(navigator.userAgent)&&!/(Chrome\/|Edge\/)/.test(navigator.userAgent)&&R.WorkerGlobalScope&&R instanceof R.WorkerGlobalScope&&[].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1]<604&&(t._hasGetAll=!1)}class qi{_parseStoresSpec(e,n){G(e).forEach(s=>{if(e[s]!==null){var a=e[s].split(",").map((r,o)=>{const l=(r=r.trim()).replace(/([&*]|\+\+)/g,""),d=/^\[/.test(l)?l.match(/^\[(.*)\]$/)[1].split("+"):l;return Gn(l,d||null,/\&/.test(r),/\*/.test(r),/\+\+/.test(r),Y(d),o===0)}),i=a.shift();if(i.multi)throw new I.Schema("Primary key cannot be multi-valued");a.forEach(r=>{if(r.auto)throw new I.Schema("Only primary key can be marked as autoIncrement (++)");if(!r.keyPath)throw new I.Schema("Index must have a name and cannot be an empty string")}),n[s]=xa(s,i,a)}})}stores(e){const n=this.db;this._cfg.storesSource=this._cfg.storesSource?X(this._cfg.storesSource,e):e;const s=n._versions,a={};let i={};return s.forEach(r=>{X(a,r._cfg.storesSource),i=r._cfg.dbschema={},r._parseStoresSpec(a,i)}),n._dbSchema=i,Wn(n,[n._allTables,n,n.Transaction.prototype]),on(n,[n._allTables,n,n.Transaction.prototype,this._cfg.tables],G(i),i),n._storeNames=G(i),this}upgrade(e){return this._cfg.contentUpgrade=us(this._cfg.contentUpgrade||q,e),this}}function fs(t,e){let n=t._dbNamesDB;return n||(n=t._dbNamesDB=new qe(hn,{addons:[],indexedDB:t,IDBKeyRange:e}),n.version(1).stores({dbnames:"name"})),n.table("dbnames")}function ms(t){return t&&typeof t.databases=="function"}function Qn(t){return Ae(function(){return D.letThrough=!0,t()})}function Bi(){var t;return!navigator.userAgentData&&/Safari\//.test(navigator.userAgent)&&!/Chrom(e|ium)\//.test(navigator.userAgent)&&indexedDB.databases?new Promise(function(e){var n=function(){return indexedDB.databases().finally(e)};t=setInterval(n,100),n()}).finally(function(){return clearInterval(t)}):Promise.resolve()}function Oi(t){const e=t._state,{indexedDB:n}=t._deps;if(e.isBeingOpened||t.idbdb)return e.dbReadyPromise.then(()=>e.dbOpenError?z(e.dbOpenError):t);ue&&(e.openCanceller._stackHolder=He()),e.isBeingOpened=!0,e.dbOpenError=null,e.openComplete=!1;const s=e.openCanceller;function a(){if(e.openCanceller!==s)throw new I.DatabaseClosed("db.open() was cancelled")}let i=e.dbReadyResolve,r=null,o=!1;const l=()=>new E((d,c)=>{if(a(),!n)throw new I.MissingAPI;const u=t.name,p=e.autoSchema?n.open(u):n.open(u,Math.round(10*t.verno));if(!p)throw new I.MissingAPI;p.onerror=de(c),p.onblocked=N(t._fireOnBlocked),p.onupgradeneeded=N(h=>{if(r=p.transaction,e.autoSchema&&!t._options.allowEmptyDB){p.onerror=kt,r.abort(),p.result.close();const f=n.deleteDatabase(u);f.onsuccess=f.onerror=N(()=>{c(new I.NoSuchDatabase(`Database ${u} doesnt exist`))})}else{r.onerror=de(c);var v=h.oldVersion>Math.pow(2,62)?0:h.oldVersion;o=v<1,t._novip.idbdb=p.result,Ci(t,v/10,r,c)}},c),p.onsuccess=N(()=>{r=null;const h=t._novip.idbdb=p.result,v=en(h.objectStoreNames);if(v.length>0)try{const g=h.transaction((f=v).length===1?f[0]:f,"readonly");e.autoSchema?function({_novip:y},m,b){y.verno=m.version/10;const k=y._dbSchema=Yn(0,m,b);y._storeNames=en(m.objectStoreNames,0),on(y,[y._allTables],G(k),k)}(t,h,g):(Jn(t,t._dbSchema,g),function(y,m){const b=Sa(Yn(0,y.idbdb,m),y._dbSchema);return!(b.add.length||b.change.some(k=>k.add.length||k.change.length))}(t,g)||console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Some queries may fail.")),Un(t,g)}catch{}var f;yt.push(t),h.onversionchange=N(g=>{e.vcFired=!0,t.on("versionchange").fire(g)}),h.onclose=N(g=>{t.on("close").fire(g)}),o&&function({indexedDB:g,IDBKeyRange:y},m){!ms(g)&&m!==hn&&fs(g,y).put({name:m}).catch(q)}(t._deps,u),d()},c)}).catch(d=>d&&d.name==="UnknownError"&&e.PR1398_maxLoop>0?(e.PR1398_maxLoop--,console.warn("Dexie: Workaround for Chrome UnknownError on open()"),l()):E.reject(d));return E.race([s,(typeof navigator>"u"?E.resolve():Bi()).then(l)]).then(()=>(a(),e.onReadyBeingFired=[],E.resolve(Qn(()=>t.on.ready.fire(t.vip))).then(function d(){if(e.onReadyBeingFired.length>0){let c=e.onReadyBeingFired.reduce(us,q);return e.onReadyBeingFired=[],E.resolve(Qn(()=>c(t.vip))).then(d)}}))).finally(()=>{e.onReadyBeingFired=null,e.isBeingOpened=!1}).then(()=>t).catch(d=>{e.dbOpenError=d;try{r&&r.abort()}catch{}return s===e.openCanceller&&t._close(),z(d)}).finally(()=>{e.openComplete=!0,i()})}function Xn(t){var e=i=>t.next(i),n=a(e),s=a(i=>t.throw(i));function a(i){return r=>{var o=i(r),l=o.value;return o.done?l:l&&typeof l.then=="function"?l.then(n,s):Y(l)?Promise.all(l).then(n,s):n(l)}}return a(e)()}function Ri(t,e,n){var s=arguments.length;if(s<2)throw new I.InvalidArgument("Too few arguments");for(var a=new Array(s-1);--s;)a[s-1]=arguments[s];return n=a.pop(),[t,ta(a),n]}function $a(t,e,n,s,a){return E.resolve().then(()=>{const i=D.transless||D,r=t._createTransaction(e,n,t._dbSchema,s),o={trans:r,transless:i};if(s)r.idbtrans=s.idbtrans;else try{r.create(),t._state.PR1398_maxLoop=3}catch(u){return u.name===ds.InvalidState&&t.isOpen()&&--t._state.PR1398_maxLoop>0?(console.warn("Dexie: Need to reopen db"),t._close(),t.open().then(()=>$a(t,e,n,null,a))):z(u)}const l=ls(a);let d;l&&tt();const c=E.follow(()=>{if(d=a.call(r,r),d)if(l){var u=we.bind(null,null);d.then(u,u)}else typeof d.next=="function"&&typeof d.throw=="function"&&(d=Xn(d))},o);return(d&&typeof d.then=="function"?E.resolve(d).then(u=>r.active?u:z(new I.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"))):c.then(()=>d)).then(u=>(s&&r._resolve(),r._completion.then(()=>u))).catch(u=>(r._reject(u),z(u)))})}function Ht(t,e,n){const s=Y(t)?t.slice():[t];for(let a=0;a<n;++a)s.push(e);return s}const Ni={stack:"dbcore",name:"VirtualIndexMiddleware",level:1,create:function(t){return{...t,table(e){const n=t.table(e),{schema:s}=n,a={},i=[];function r(c,u,p){const h=mt(c),v=a[h]=a[h]||[],f=c==null?0:typeof c=="string"?1:c.length,g=u>0,y={...p,isVirtual:g,keyTail:u,keyLength:f,extractKey:zn(c),unique:!g&&p.unique};return v.push(y),y.isPrimaryKey||i.push(y),f>1&&r(f===2?c[0]:c.slice(0,f-1),u+1,p),v.sort((m,b)=>m.keyTail-b.keyTail),y}const o=r(s.primaryKey.keyPath,0,s.primaryKey);a[":id"]=[o];for(const c of s.indexes)r(c.keyPath,0,c);function l(c){const u=c.query.index;return u.isVirtual?{...c,query:{index:u,range:(p=c.query.range,h=u.keyTail,{type:p.type===1?2:p.type,lower:Ht(p.lower,p.lowerOpen?t.MAX_KEY:t.MIN_KEY,h),lowerOpen:!0,upper:Ht(p.upper,p.upperOpen?t.MIN_KEY:t.MAX_KEY,h),upperOpen:!0})}}:c;var p,h}return{...n,schema:{...s,primaryKey:o,indexes:i,getIndexByKeyPath:function(c){const u=a[mt(c)];return u&&u[0]}},count:c=>n.count(l(c)),query:c=>n.query(l(c)),openCursor(c){const{keyTail:u,isVirtual:p,keyLength:h}=c.query.index;return p?n.openCursor(l(c)).then(v=>v&&function(f){return Object.create(f,{continue:{value:function(y){y!=null?f.continue(Ht(y,c.reverse?t.MAX_KEY:t.MIN_KEY,u)):c.unique?f.continue(f.key.slice(0,h).concat(c.reverse?t.MIN_KEY:t.MAX_KEY,u)):f.continue()}},continuePrimaryKey:{value(y,m){f.continuePrimaryKey(Ht(y,t.MAX_KEY,u),m)}},primaryKey:{get:()=>f.primaryKey},key:{get(){const y=f.key;return h===1?y[0]:y.slice(0,h)}},value:{get:()=>f.value}})}(v)):n.openCursor(c)}}}}}};function gs(t,e,n,s){return n=n||{},s=s||"",G(t).forEach(a=>{if(ae(e,a)){var i=t[a],r=e[a];if(typeof i=="object"&&typeof r=="object"&&i&&r){const o=Ln(i);o!==Ln(r)?n[s+a]=e[a]:o==="Object"?gs(i,r,n,s+a+"."):i!==r&&(n[s+a]=e[a])}else i!==r&&(n[s+a]=e[a])}else n[s+a]=void 0}),G(e).forEach(a=>{ae(t,a)||(n[s+a]=e[a])}),n}const Fi={stack:"dbcore",name:"HooksMiddleware",level:2,create:t=>({...t,table(e){const n=t.table(e),{primaryKey:s}=n.schema;return{...n,mutate(i){const r=D.trans,{deleting:o,creating:l,updating:d}=r.table(e).hook;switch(i.type){case"add":if(l.fire===q)break;return r._promise("readwrite",()=>c(i),!0);case"put":if(l.fire===q&&d.fire===q)break;return r._promise("readwrite",()=>c(i),!0);case"delete":if(o.fire===q)break;return r._promise("readwrite",()=>c(i),!0);case"deleteRange":if(o.fire===q)break;return r._promise("readwrite",()=>function(p){return u(p.trans,p.range,1e4)}(i),!0)}return n.mutate(i);function c(p){const h=D.trans,v=p.keys||function(f,g){return g.type==="delete"?g.keys:g.keys||g.values.map(f.extractKey)}(s,p);if(!v)throw new Error("Keys missing");return(p=p.type==="add"||p.type==="put"?{...p,keys:v}:{...p}).type!=="delete"&&(p.values=[...p.values]),p.keys&&(p.keys=[...p.keys]),function(f,g,y){return g.type==="add"?Promise.resolve([]):f.getMany({trans:g.trans,keys:y,cache:"immutable"})}(n,p,v).then(f=>{const g=v.map((y,m)=>{const b=f[m],k={onerror:null,onsuccess:null};if(p.type==="delete")o.fire.call(k,y,b,h);else if(p.type==="add"||b===void 0){const _=l.fire.call(k,y,p.values[m],h);y==null&&_!=null&&(y=_,p.keys[m]=y,s.outbound||le(p.values[m],s.keyPath,y))}else{const _=gs(b,p.values[m]),w=d.fire.call(k,_,y,b,h);if(w){const x=p.values[m];Object.keys(w).forEach(M=>{ae(x,M)?x[M]=w[M]:le(x,M,w[M])})}}return k});return n.mutate(p).then(({failures:y,results:m,numFailures:b,lastResult:k})=>{for(let _=0;_<v.length;++_){const w=m?m[_]:v[_],x=g[_];w==null?x.onerror&&x.onerror(y[_]):x.onsuccess&&x.onsuccess(p.type==="put"&&f[_]?p.values[_]:w)}return{failures:y,results:m,numFailures:b,lastResult:k}}).catch(y=>(g.forEach(m=>m.onerror&&m.onerror(y)),Promise.reject(y)))})}function u(p,h,v){return n.query({trans:p,values:!1,query:{index:s,range:h},limit:v}).then(({result:f})=>c({type:"delete",keys:f,trans:p}).then(g=>g.numFailures>0?Promise.reject(g.failures[0]):f.length<v?{failures:[],numFailures:0,lastResult:void 0}:u(p,{...h,lower:f[f.length-1],lowerOpen:!0},v)))}}}}})};function _a(t,e,n){try{if(!e||e.keys.length<t.length)return null;const s=[];for(let a=0,i=0;a<e.keys.length&&i<t.length;++a)Q(e.keys[a],t[i])===0&&(s.push(n?Tt(e.values[a]):e.values[a]),++i);return s.length===t.length?s:null}catch{return null}}const Ki={stack:"dbcore",level:-1,create:t=>({table:e=>{const n=t.table(e);return{...n,getMany:s=>{if(!s.cache)return n.getMany(s);const a=_a(s.keys,s.trans._cache,s.cache==="clone");return a?E.resolve(a):n.getMany(s).then(i=>(s.trans._cache={keys:s.keys,values:s.cache==="clone"?Tt(i):i},i))},mutate:s=>(s.type!=="add"&&(s.trans._cache=null),n.mutate(s))}}})};function vs(t){return!("from"in t)}const ye=function(t,e){if(!this){const n=new ye;return t&&"d"in t&&X(n,t),n}X(this,arguments.length?{d:1,from:t,to:arguments.length>1?e:t}:{d:0})};function $t(t,e,n){const s=Q(e,n);if(isNaN(s))return;if(s>0)throw RangeError();if(vs(t))return X(t,{from:e,to:n,d:1});const a=t.l,i=t.r;if(Q(n,t.from)<0)return a?$t(a,e,n):t.l={from:e,to:n,d:1,l:null,r:null},Ks(t);if(Q(e,t.to)>0)return i?$t(i,e,n):t.r={from:e,to:n,d:1,l:null,r:null},Ks(t);Q(e,t.from)<0&&(t.from=e,t.l=null,t.d=i?i.d+1:1),Q(n,t.to)>0&&(t.to=n,t.r=null,t.d=t.l?t.l.d+1:1);const r=!t.r;a&&!t.l&&ln(t,a),i&&r&&ln(t,i)}function ln(t,e){vs(e)||function n(s,{from:a,to:i,l:r,r:o}){$t(s,a,i),r&&n(s,r),o&&n(s,o)}(t,e)}function Hi(t,e){const n=Zn(e);let s=n.next();if(s.done)return!1;let a=s.value;const i=Zn(t);let r=i.next(a.from),o=r.value;for(;!s.done&&!r.done;){if(Q(o.from,a.to)<=0&&Q(o.to,a.from)>=0)return!0;Q(a.from,o.from)<0?a=(s=n.next(o.from)).value:o=(r=i.next(a.from)).value}return!1}function Zn(t){let e=vs(t)?null:{s:0,n:t};return{next(n){const s=arguments.length>0;for(;e;)switch(e.s){case 0:if(e.s=1,s)for(;e.n.l&&Q(n,e.n.from)<0;)e={up:e,n:e.n.l,s:1};else for(;e.n.l;)e={up:e,n:e.n.l,s:1};case 1:if(e.s=2,!s||Q(n,e.n.to)<=0)return{value:e.n,done:!1};case 2:if(e.n.r){e.s=3,e={up:e,n:e.n.r,s:0};continue}case 3:e=e.up}return{done:!0}}}}function Ks(t){var e,n;const s=(((e=t.r)===null||e===void 0?void 0:e.d)||0)-(((n=t.l)===null||n===void 0?void 0:n.d)||0),a=s>1?"r":s<-1?"l":"";if(a){const i=a==="r"?"l":"r",r={...t},o=t[a];t.from=o.from,t.to=o.to,t[a]=o[a],r[a]=o[i],t[i]=r,r.d=Hs(r)}t.d=Hs(t)}function Hs({r:t,l:e}){return(t?e?Math.max(t.d,e.d):t.d:e?e.d:0)+1}Ze(ye.prototype,{add(t){return ln(this,t),this},addKey(t){return $t(this,t,t),this},addKeys(t){return t.forEach(e=>$t(this,e,e)),this},[jn](){return Zn(this)}});const Gi={stack:"dbcore",level:0,create:t=>{const e=t.schema.name,n=new ye(t.MIN_KEY,t.MAX_KEY);return{...t,table:s=>{const a=t.table(s),{schema:i}=a,{primaryKey:r}=i,{extractKey:o,outbound:l}=r,d={...a,mutate:p=>{const h=p.trans,v=h.mutatedParts||(h.mutatedParts={}),f=w=>{const x=`idb://${e}/${s}/${w}`;return v[x]||(v[x]=new ye)},g=f(""),y=f(":dels"),{type:m}=p;let[b,k]=p.type==="deleteRange"?[p.range]:p.type==="delete"?[p.keys]:p.values.length<50?[[],p.values]:[];const _=p.trans._cache;return a.mutate(p).then(w=>{if(Y(b)){m!=="delete"&&(b=w.results),g.addKeys(b);const x=_a(b,_);x||m==="add"||y.addKeys(b),(x||k)&&function(M,$,T,L){function H(K){const C=M(K.name||"");function W(U){return U!=null?K.extractKey(U):null}const Z=U=>K.multiEntry&&Y(U)?U.forEach(A=>C.addKey(A)):C.addKey(U);(T||L).forEach((U,A)=>{const O=T&&W(T[A]),at=L&&W(L[A]);Q(O,at)!==0&&(O!=null&&Z(O),at!=null&&Z(at))})}$.indexes.forEach(H)}(f,i,x,k)}else if(b){const x={from:b.lower,to:b.upper};y.add(x),g.add(x)}else g.add(n),y.add(n),i.indexes.forEach(x=>f(x.name).add(n));return w})}},c=({query:{index:p,range:h}})=>{var v,f;return[p,new ye((v=h.lower)!==null&&v!==void 0?v:t.MIN_KEY,(f=h.upper)!==null&&f!==void 0?f:t.MAX_KEY)]},u={get:p=>[r,new ye(p.key)],getMany:p=>[r,new ye().addKeys(p.keys)],count:c,query:c,openCursor:c};return G(u).forEach(p=>{d[p]=function(h){const{subscr:v}=D;if(v){const f=k=>{const _=`idb://${e}/${s}/${k}`;return v[_]||(v[_]=new ye)},g=f(""),y=f(":dels"),[m,b]=u[p](h);if(f(m.name||"").add(b),!m.isPrimaryKey){if(p!=="count"){const k=p==="query"&&l&&h.values&&a.query({...h,values:!1});return a[p].apply(this,arguments).then(_=>{if(p==="query"){if(l&&h.values)return k.then(({result:x})=>(g.addKeys(x),_));const w=h.values?_.result.map(o):_.result;h.values?g.addKeys(w):y.addKeys(w)}else if(p==="openCursor"){const w=_,x=h.values;return w&&Object.create(w,{key:{get:()=>(y.addKey(w.primaryKey),w.key)},primaryKey:{get(){const M=w.primaryKey;return y.addKey(M),M}},value:{get:()=>(x&&g.addKey(w.primaryKey),w.value)}})}return _})}y.add(n)}}return a[p].apply(this,arguments)}}),d}}}};class qe{constructor(e,n){this._middlewares={},this.verno=0;const s=qe.dependencies;this._options=n={addons:qe.addons,autoOpen:!0,indexedDB:s.indexedDB,IDBKeyRange:s.IDBKeyRange,...n},this._deps={indexedDB:n.indexedDB,IDBKeyRange:n.IDBKeyRange};const{addons:a}=n;this._dbSchema={},this._versions=[],this._storeNames=[],this._allTables={},this.idbdb=null,this._novip=this;const i={dbOpenError:null,isBeingOpened:!1,onReadyBeingFired:null,openComplete:!1,dbReadyResolve:q,dbReadyPromise:null,cancelOpen:q,openCanceller:null,autoSchema:!0,PR1398_maxLoop:3};var r;i.dbReadyPromise=new E(o=>{i.dbReadyResolve=o}),i.openCanceller=new E((o,l)=>{i.cancelOpen=l}),this._state=i,this.name=e,this.on=ft(this,"populate","blocked","versionchange","close",{ready:[us,q]}),this.on.ready.subscribe=Qs(this.on.ready.subscribe,o=>(l,d)=>{qe.vip(()=>{const c=this._state;if(c.openComplete)c.dbOpenError||E.resolve().then(l),d&&o(l);else if(c.onReadyBeingFired)c.onReadyBeingFired.push(l),d&&o(l);else{o(l);const u=this;d||o(function p(){u.on.ready.unsubscribe(l),u.on.ready.unsubscribe(p)})}})}),this.Collection=(r=this,it(Ai.prototype,function(o,l){this.db=r;let d=va,c=null;if(l)try{d=l()}catch(v){c=v}const u=o._ctx,p=u.table,h=p.hook.reading.fire;this._ctx={table:p,index:u.index,isPrimKey:!u.index||p.schema.primKey.keyPath&&u.index===p.schema.primKey.name,range:d,keysOnly:!1,dir:"next",unique:"",algorithm:null,filter:null,replayFilter:null,justLimit:!0,isMatch:null,offset:0,limit:1/0,error:c,or:u.or,valueMapper:h!==bt?h:null}})),this.Table=function(o){return it(Ei.prototype,function(l,d,c){this.db=o,this._tx=c,this.name=l,this.schema=d,this.hook=o._allTables[l]?o._allTables[l].hook:ft(null,{creating:[yi,q],reading:[hi,bt],updating:[mi,q],deleting:[fi,q]})})}(this),this.Transaction=function(o){return it(Li.prototype,function(l,d,c,u,p){this.db=o,this.mode=l,this.storeNames=d,this.schema=c,this.chromeTransactionDurability=u,this.idbtrans=null,this.on=ft(this,"complete","error","abort"),this.parent=p||null,this.active=!0,this._reculock=0,this._blockedFuncs=[],this._resolve=null,this._reject=null,this._waitingFor=null,this._waitingQueue=null,this._spinCount=0,this._completion=new E((h,v)=>{this._resolve=h,this._reject=v}),this._completion.then(()=>{this.active=!1,this.on.complete.fire()},h=>{var v=this.active;return this.active=!1,this.on.error.fire(h),this.parent?this.parent._reject(h):v&&this.idbtrans&&this.idbtrans.abort(),z(h)})})}(this),this.Version=function(o){return it(qi.prototype,function(l){this.db=o,this._cfg={version:l,storesSource:null,dbschema:{},tables:{},contentUpgrade:null}})}(this),this.WhereClause=function(o){return it(wa.prototype,function(l,d,c){this.db=o,this._ctx={table:l,index:d===":id"?null:d,or:c};const u=o._deps.indexedDB;if(!u)throw new I.MissingAPI;this._cmp=this._ascending=u.cmp.bind(u),this._descending=(p,h)=>u.cmp(h,p),this._max=(p,h)=>u.cmp(p,h)>0?p:h,this._min=(p,h)=>u.cmp(p,h)<0?p:h,this._IDBKeyRange=o._deps.IDBKeyRange})}(this),this.on("versionchange",o=>{o.newVersion>0?console.warn(`Another connection wants to upgrade database '${this.name}'. Closing db now to resume the upgrade.`):console.warn(`Another connection wants to delete database '${this.name}'. Closing db now to resume the delete request.`),this.close()}),this.on("blocked",o=>{!o.newVersion||o.newVersion<o.oldVersion?console.warn(`Dexie.delete('${this.name}') was blocked`):console.warn(`Upgrade '${this.name}' blocked by other connection holding version ${o.oldVersion/10}`)}),this._maxKey=St(n.IDBKeyRange),this._createTransaction=(o,l,d,c)=>new this.Transaction(o,l,d,this._options.chromeTransactionDurability,c),this._fireOnBlocked=o=>{this.on("blocked").fire(o),yt.filter(l=>l.name===this.name&&l!==this&&!l._state.vcFired).map(l=>l.on("versionchange").fire(o))},this.use(Ni),this.use(Fi),this.use(Gi),this.use(Ki),this.vip=Object.create(this,{_vip:{value:!0}}),a.forEach(o=>o(this))}version(e){if(isNaN(e)||e<.1)throw new I.Type("Given version is not a positive number");if(e=Math.round(10*e)/10,this.idbdb||this._state.isBeingOpened)throw new I.Schema("Cannot add version when database is open");this.verno=Math.max(this.verno,e);const n=this._versions;var s=n.filter(a=>a._cfg.version===e)[0];return s||(s=new this.Version(e),n.push(s),n.sort(Pi),s.stores({}),this._state.autoSchema=!1,s)}_whenReady(e){return this.idbdb&&(this._state.openComplete||D.letThrough||this._vip)?e():new E((n,s)=>{if(this._state.openComplete)return s(new I.DatabaseClosed(this._state.dbOpenError));if(!this._state.isBeingOpened){if(!this._options.autoOpen)return void s(new I.DatabaseClosed);this.open().catch(q)}this._state.dbReadyPromise.then(n,s)}).then(e)}use({stack:e,create:n,level:s,name:a}){a&&this.unuse({stack:e,name:a});const i=this._middlewares[e]||(this._middlewares[e]=[]);return i.push({stack:e,create:n,level:s??10,name:a}),i.sort((r,o)=>r.level-o.level),this}unuse({stack:e,name:n,create:s}){return e&&this._middlewares[e]&&(this._middlewares[e]=this._middlewares[e].filter(a=>s?a.create!==s:!!n&&a.name!==n)),this}open(){return Oi(this)}_close(){const e=this._state,n=yt.indexOf(this);if(n>=0&&yt.splice(n,1),this.idbdb){try{this.idbdb.close()}catch{}this._novip.idbdb=null}e.dbReadyPromise=new E(s=>{e.dbReadyResolve=s}),e.openCanceller=new E((s,a)=>{e.cancelOpen=a})}close(){this._close();const e=this._state;this._options.autoOpen=!1,e.dbOpenError=new I.DatabaseClosed,e.isBeingOpened&&e.cancelOpen(e.dbOpenError)}delete(){const e=arguments.length>0,n=this._state;return new E((s,a)=>{const i=()=>{this.close();var r=this._deps.indexedDB.deleteDatabase(this.name);r.onsuccess=N(()=>{(function({indexedDB:o,IDBKeyRange:l},d){!ms(o)&&d!==hn&&fs(o,l).delete(d).catch(q)})(this._deps,this.name),s()}),r.onerror=de(a),r.onblocked=this._fireOnBlocked};if(e)throw new I.InvalidArgument("Arguments not allowed in db.delete()");n.isBeingOpened?n.dbReadyPromise.then(i):i()})}backendDB(){return this.idbdb}isOpen(){return this.idbdb!==null}hasBeenClosed(){const e=this._state.dbOpenError;return e&&e.name==="DatabaseClosed"}hasFailed(){return this._state.dbOpenError!==null}dynamicallyOpened(){return this._state.autoSchema}get tables(){return G(this._allTables).map(e=>this._allTables[e])}transaction(){const e=Ri.apply(this,arguments);return this._transaction.apply(this,e)}_transaction(e,n,s){let a=D.trans;a&&a.db===this&&e.indexOf("!")===-1||(a=null);const i=e.indexOf("?")!==-1;let r,o;e=e.replace("!","").replace("?","");try{if(o=n.map(d=>{var c=d instanceof this.Table?d.name:d;if(typeof c!="string")throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");return c}),e=="r"||e===wn)r=wn;else{if(e!="rw"&&e!=kn)throw new I.InvalidArgument("Invalid transaction mode: "+e);r=kn}if(a){if(a.mode===wn&&r===kn){if(!i)throw new I.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");a=null}a&&o.forEach(d=>{if(a&&a.storeNames.indexOf(d)===-1){if(!i)throw new I.SubTransaction("Table "+d+" not included in parent transaction.");a=null}}),i&&a&&!a.active&&(a=null)}}catch(d){return a?a._promise(null,(c,u)=>{u(d)}):z(d)}const l=$a.bind(null,this,r,o,a,s);return a?a._promise(r,l,"lock"):D.trans?nt(D.transless,()=>this._whenReady(l)):this._whenReady(l)}table(e){if(!ae(this._allTables,e))throw new I.InvalidTable(`Table ${e} does not exist`);return this._allTables[e]}}const zi=typeof Symbol<"u"&&"observable"in Symbol?Symbol.observable:"@@observable";class Ui{constructor(e){this._subscribe=e}subscribe(e,n,s){return this._subscribe(e&&typeof e!="function"?e:{next:e,error:n,complete:s})}[zi](){return this}}function Ea(t,e){return G(e).forEach(n=>{ln(t[n]||(t[n]=new ye),e[n])}),t}function Wi(t){let e,n=!1;const s=new Ui(a=>{const i=ls(t);let r=!1,o={},l={};const d={get closed(){return r},unsubscribe:()=>{r=!0,Me.storagemutated.unsubscribe(h)}};a.start&&a.start(d);let c=!1,u=!1;function p(){return G(l).some(f=>o[f]&&Hi(o[f],l[f]))}const h=f=>{Ea(o,f),p()&&v()},v=()=>{if(c||r)return;o={};const f={},g=function(y){i&&tt();const m=()=>Ae(t,{subscr:y,trans:null}),b=D.trans?nt(D.transless,m):m();return i&&b.then(we,we),b}(f);u||(Me(xt,h),u=!0),c=!0,Promise.resolve(g).then(y=>{n=!0,e=y,c=!1,r||(p()?v():(o={},l=f,a.next&&a.next(y)))},y=>{c=!1,n=!1,a.error&&a.error(y),d.unsubscribe()})};return v(),d});return s.hasValue=()=>n,s.getValue=()=>e,s}let es;try{es={indexedDB:R.indexedDB||R.mozIndexedDB||R.webkitIndexedDB||R.msIndexedDB,IDBKeyRange:R.IDBKeyRange||R.webkitIDBKeyRange}}catch{es={indexedDB:null,IDBKeyRange:null}}const Ie=qe;function Jt(t){let e=me;try{me=!0,Me.storagemutated.fire(t)}finally{me=e}}Ze(Ie,{...Gt,delete:t=>new Ie(t,{addons:[]}).delete(),exists:t=>new Ie(t,{addons:[]}).open().then(e=>(e.close(),!0)).catch("NoSuchDatabaseError",()=>!1),getDatabaseNames(t){try{return function({indexedDB:e,IDBKeyRange:n}){return ms(e)?Promise.resolve(e.databases()).then(s=>s.map(a=>a.name).filter(a=>a!==hn)):fs(e,n).toCollection().primaryKeys()}(Ie.dependencies).then(t)}catch{return z(new I.MissingAPI)}},defineClass:()=>function(t){X(this,t)},ignoreTransaction:t=>D.trans?nt(D.transless,t):t(),vip:Qn,async:function(t){return function(){try{var e=Xn(t.apply(this,arguments));return e&&typeof e.then=="function"?e:E.resolve(e)}catch(n){return z(n)}}},spawn:function(t,e,n){try{var s=Xn(t.apply(n,e||[]));return s&&typeof s.then=="function"?s:E.resolve(s)}catch(a){return z(a)}},currentTransaction:{get:()=>D.trans||null},waitFor:function(t,e){const n=E.resolve(typeof t=="function"?Ie.ignoreTransaction(t):t).timeout(e||6e4);return D.trans?D.trans.waitFor(n):n},Promise:E,debug:{get:()=>ue,set:t=>{sa(t,t==="dexie"?()=>!0:ga)}},derive:Je,extend:X,props:Ze,override:Qs,Events:ft,on:Me,liveQuery:Wi,extendObservabilitySet:Ea,getByKeyPath:be,setByKeyPath:le,delByKeyPath:function(t,e){typeof e=="string"?le(t,e,void 0):"length"in e&&[].map.call(e,function(n){le(t,n,void 0)})},shallowClone:ea,deepClone:Tt,getObjectDiff:gs,cmp:Q,asap:Xs,minKey:Hn,addons:[],connections:yt,errnames:ds,dependencies:es,semVer:qs,version:qs.split(".").map(t=>parseInt(t)).reduce((t,e,n)=>t+e/Math.pow(10,2*n))}),Ie.maxKey=St(Ie.dependencies.IDBKeyRange),typeof dispatchEvent<"u"&&typeof addEventListener<"u"&&(Me(xt,t=>{if(!me){let e;pn?(e=document.createEvent("CustomEvent"),e.initCustomEvent($e,!0,!0,t)):e=new CustomEvent($e,{detail:t}),me=!0,dispatchEvent(e),me=!1}}),addEventListener($e,({detail:t})=>{me||Jt(t)}));let me=!1;if(typeof BroadcastChannel<"u"){const t=new BroadcastChannel($e);typeof t.unref=="function"&&t.unref(),Me(xt,e=>{me||t.postMessage(e)}),t.onmessage=e=>{e.data&&Jt(e.data)}}else if(typeof self<"u"&&typeof navigator<"u"){Me(xt,e=>{try{me||(typeof localStorage<"u"&&localStorage.setItem($e,JSON.stringify({trig:Math.random(),changedParts:e})),typeof self.clients=="object"&&[...self.clients.matchAll({includeUncontrolled:!0})].forEach(n=>n.postMessage({type:$e,changedParts:e})))}catch{}}),typeof addEventListener<"u"&&addEventListener("storage",e=>{if(e.key===$e){const n=JSON.parse(e.newValue);n&&Jt(n.changedParts)}});const t=self.document&&navigator.serviceWorker;t&&t.addEventListener("message",function({data:e}){e&&e.type===$e&&Jt(e.changedParts)})}E.rejectionMapper=function(t,e){if(!t||t instanceof Qe||t instanceof TypeError||t instanceof SyntaxError||!t.name||!js[t.name])return t;var n=new js[t.name](e||t.message,t);return"stack"in t&&ve(n,"stack",{get:function(){return this.inner.stack}}),n},sa(ue,ga);const S=new qe("ApexFocus");S.version(1).stores({tasks:"++id, status, context, goalId, createdAt, dueDate",focus_sessions:"++id, taskId, goalId, startedAt, date, context",time_blocks:"++id, taskId, date, startTime",settings:"key",sync_log:"++id, syncedAt, module"});S.version(2).stores({tasks:"++id, status, context, subjectId, goalId, createdAt, dueDate",focus_sessions:"++id, taskId, goalId, subjectId, startedAt, date, context",time_blocks:"++id, taskId, date, startTime",settings:"key",sync_log:"++id, syncedAt, module",subjects:"++id, name, createdAt"});S.on("ready",async()=>{var n;if(await S.subjects.count()===0){const s=Date.now();await S.subjects.bulkAdd([{name:"Engineering Math",color:"#7F77DD",icon:"∑",dailyGoalMins:60,createdAt:s,order:0},{name:"Engineering Sci A",color:"#D85A30",icon:"⚙",dailyGoalMins:90,createdAt:s,order:1},{name:"Engineering Sci B",color:"#1D9E75",icon:"⚡",dailyGoalMins:60,createdAt:s,order:2},{name:"Field Methods",color:"#BA7517",icon:"🗺",dailyGoalMins:45,createdAt:s,order:3}])}const e=await S.settings.get("main");if(!e)await S.settings.put({key:"main",defaultDuration:50,breakLength:10,longBreakAfter:4,longBreakLength:30,showCountdownRing:!0,autoStartBreak:!1,autoStartNextSession:!1,dailyGoalHours:4,activeDays:[1,2,3,4,5],streakFreezeEnabled:!1,streakGraceDays:1,contexts:[{id:"study",label:"Study",color:"#7F77DD",isStudy:!0},{id:"civil",label:"Civil eng",color:"#BA7517",isStudy:!0},{id:"personal",label:"Personal",color:"#D4537E",isStudy:!1},{id:"trading",label:"Trading",color:"#1D9E75",isStudy:!1}],accentColor:"#7F77DD",theme:"dark",sessionEndSound:!0,breakEndReminder:!0,dailyGoalAlert:!0,morningReminderEnabled:!0,morningReminderTime:"08:30",syncStudy:!0,syncHabits:!0,syncGoals:!0,syncMood:!1,aiProvider:"gemini",aiApiKey:"",aiMorningPrioritisation:!0,aiWeeklyReview:!0,aiDistractionAlerts:!0,aiSmartRescheduling:!1});else{const s={};"theme"in e||(s.theme="dark"),e.contexts&&!((n=e.contexts[0])!=null&&n.hasOwnProperty("isStudy"))&&(s.contexts=e.contexts.map(a=>({...a,isStudy:a.isStudy??(a.id==="study"||a.id==="civil")}))),Object.keys(s).length>0&&await S.settings.put({...e,...s,key:"main"})}});async function te(){return S.settings.get("main")}async function Vi(t){const e=await S.settings.get("main");await S.settings.put({...e,...t,key:"main"})}async function ie(){return(await S.subjects.toArray()).sort((e,n)=>(e.order??99)-(n.order??99)||e.name.localeCompare(n.name))}async function Yi(t){const e=await S.subjects.count(),n=await S.subjects.add({color:"#7F77DD",icon:"📚",dailyGoalMins:60,createdAt:Date.now(),order:e,...t});return re(()=>Promise.resolve().then(()=>ze),void 0).then(s=>s.syncSubject(n)).catch(()=>{}),n}async function Qt(t,e){const n=await S.subjects.update(t,e);return re(()=>Promise.resolve().then(()=>ze),void 0).then(s=>s.syncSubject(t)).catch(()=>{}),n}async function Ji(t){return await S.tasks.where("subjectId").equals(t).modify({subjectId:null}),re(()=>Promise.resolve().then(()=>ze),void 0).then(e=>e.syncDeleteSubject(t)).catch(()=>{}),S.subjects.delete(t)}async function _t(t){return S.focus_sessions.where("date").equals(t).toArray()}async function Ke(t,e){return S.focus_sessions.where("date").between(t,e,!0,!0).sortBy("startedAt")}async function Qi(t){const e=await S.focus_sessions.add({...t,date:new Date(t.startedAt).toISOString().slice(0,10)});return re(()=>Promise.resolve().then(()=>ze),void 0).then(n=>n.syncSession(e)).catch(()=>{}),e}async function cn(t){return(await _t(t)).reduce((n,s)=>n+(s.durationMins||0),0)}async function et(t,e){return(await _t(t)).filter(s=>s.subjectId===e).reduce((s,a)=>s+(a.durationMins||0),0)}async function Aa(t,e,n=0){let s=0,a=0;const i=new Date;for(let r=0;r<365;r++){const o=new Date(i);if(o.setDate(o.getDate()-r),!t.includes(o.getDay()))continue;const l=o.toISOString().slice(0,10);if(await cn(l)>=e)s++,a=0;else if(r!==0)if(a<n)a++;else break}return s}async function bs(t,e,n,s=0){let a=0,i=0,r=0,o=0,l=!1;const d=new Date;for(let c=0;c<365;c++){const u=new Date(d);if(u.setDate(u.getDate()-c),!n.includes(u.getDay()))continue;const p=u.toISOString().slice(0,10);if(await et(p,t)>=e)r++,o=0,i=Math.max(i,r),l||(a=r);else if(c!==0)if(o<s)o++;else{l=!0,r=0;break}}return{current:a,best:i}}S.version(3).stores({tasks:"++id, status, context, subjectId, goalId, createdAt, dueDate",focus_sessions:"++id, taskId, goalId, subjectId, startedAt, date, context",time_blocks:"++id, taskId, date, startTime",settings:"key",sync_log:"++id, syncedAt, module",subjects:"++id, name, createdAt",planned_sessions:"++id, subjectId, date, createdAt"});S.version(4).stores({tasks:"++id, status, context, subjectId, goalId, createdAt, dueDate",focus_sessions:"++id, taskId, goalId, subjectId, startedAt, date, context",time_blocks:"++id, taskId, date, startTime",settings:"key",sync_log:"++id, syncedAt, module",subjects:"++id, name, createdAt",planned_sessions:"++id, subjectId, taskId, date, createdAt",recurring_sessions:"++id, subjectId, createdAt"});async function Xi(t){return S.planned_sessions.where("date").equals(t).toArray()}async function ws(t,e){return S.planned_sessions.where("date").between(t,e,!0,!0).toArray()}async function Da(t){const e=await S.planned_sessions.add({...t,createdAt:Date.now()});return re(()=>Promise.resolve().then(()=>ze),void 0).then(n=>n.syncPlanned(e)).catch(()=>{}),e}async function Zi(t){return re(()=>Promise.resolve().then(()=>ze),void 0).then(e=>e.syncDeletePlanned(t)).catch(()=>{}),S.planned_sessions.delete(t)}async function er(){return S.recurring_sessions.toArray()}async function tr(t){return S.recurring_sessions.add({...t,createdAt:Date.now(),active:!0})}async function nr(t,e){return S.recurring_sessions.update(t,e)}async function sr(t){return S.recurring_sessions.delete(t)}async function ar(t,e){var l;const n=await S.recurring_sessions.where("active").equals(1).toArray().catch(()=>S.recurring_sessions.toArray().then(d=>d.filter(c=>c.active)));if(!n.length)return;const s=await ws(t,e),a=(d,c,u)=>`${d}|${c}|${u}`,i=new Set(s.map(d=>a(d.date,d.subjectId,d.startTime))),r=new Date(t+"T00:00:00"),o=new Date(e+"T00:00:00");for(let d=new Date(r);d<=o;d.setDate(d.getDate()+1)){const c=d.getDay(),u=d.toISOString().slice(0,10);for(const p of n){if(!((l=p.days)!=null&&l.includes(c)))continue;const h=a(u,p.subjectId,p.startTime);i.has(h)||(await Da({subjectId:p.subjectId,taskId:p.taskId||null,date:u,startTime:p.startTime,durationMins:p.durationMins,notes:p.notes||"",fromRecurring:p.id}),i.add(h))}}}const ir="https://xiaatddlhvasqzzfveli.supabase.co",Gs="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpYWF0ZGRsaHZhc3F6emZ2ZWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2OTEzODgsImV4cCI6MjA5MTI2NzM4OH0.-a1XP-z6kzOBUJcGGNs8UiNFFx7F8dYsqom9XVR631U";let En=null;function pe(){if(En)return En;let t=localStorage.getItem("apex_user_id");return t||(t="user_"+crypto.randomUUID(),localStorage.setItem("apex_user_id",t)),En=t,t}function rr(){return{"Content-Type":"application/json",apikey:Gs,Authorization:"Bearer "+Gs,Prefer:"resolution=merge-duplicates,return=minimal"}}async function st(t,e={}){const n=await fetch(ir+"/rest/v1"+t,{...e,headers:{...rr(),...e.headers||{}}});if(!n.ok){const a=await n.text().catch(()=>"");throw new Error(`Supabase ${e.method||"GET"} ${t} → ${n.status}: ${a}`)}const s=await n.text();return s?JSON.parse(s):null}async function Ge(){try{const t=await S.settings.get("syncQueue");return t!=null&&t.value?JSON.parse(t.value):[]}catch{return[]}}async function Ma(t){await S.settings.put({key:"syncQueue",value:JSON.stringify(t)})}async function ne(t){const e=await Ge(),n=e.findIndex(s=>s.table===t.table&&s.localId===t.localId);n>=0?e[n]=t:e.push(t),await Ma(e)}let Ia="idle",Xt=[],ks=0;function La(t){return Xt.push(t),t(Ia,ks),()=>{Xt=Xt.filter(e=>e!==t)}}function ee(t,e=0){Ia=t,ks=e,Xt.forEach(n=>n(t,e))}let ce=navigator.onLine;window.addEventListener("online",()=>{ce=!0,Et()});window.addEventListener("offline",()=>{ce=!1,ee("offline",ks)});async function ja(t){const e=await S.settings.get("idMap_"+t).catch(()=>null);return e!=null&&e.value?JSON.parse(e.value):{}}async function or(t,e){await S.settings.put({key:"idMap_"+t,value:JSON.stringify(e)})}async function xs(t,e){return(await ja(t))[e]||null}async function lr(t,e,n){const s=await ja(t);s[e]=n,await or(t,s)}async function Ss(t){return{local_id:t.id,name:t.name,color:t.color||"#7F77DD",icon:t.icon||"",daily_goal_mins:t.dailyGoalMins||60,order:t.order??0,created_at:t.createdAt||Date.now(),updated_at:Date.now(),deleted:!1,user_id:pe()}}async function $s(t){let e=null;return t.subjectId&&(e=await xs("subjects",t.subjectId)),{local_id:t.id,title:t.title,context:t.context||null,subject_id:e,priority:t.priority||3,status:t.status||"inbox",estimated_mins:t.estimatedMins||null,due_date:t.dueDate||null,due_time:t.dueTime||null,notes:t.notes||null,completed_at:t.completedAt||null,created_at:t.createdAt||Date.now(),updated_at:Date.now(),deleted:!1,user_id:pe()}}async function _s(t){let e=null;return t.subjectId&&(e=await xs("subjects",t.subjectId)),{local_id:t.id,subject_id:e,task_id:t.taskId||null,context:t.context||null,started_at:t.startedAt,duration_mins:t.durationMins||0,distractions:t.distractions||0,distraction_log:t.distractionLog?JSON.stringify(t.distractionLog):null,quality_rating:t.qualityRating||null,notes:t.notes||null,date:t.date,created_at:t.startedAt||Date.now(),updated_at:Date.now(),deleted:!1,user_id:pe()}}async function Es(t){let e=null;return t.subjectId&&(e=await xs("subjects",t.subjectId)),{local_id:t.id,subject_id:e,date:t.date,start_time:t.startTime||null,duration_mins:t.durationMins||50,notes:t.notes||null,created_at:t.createdAt||Date.now(),updated_at:Date.now(),deleted:!1,user_id:pe()}}async function oe(t,e){await st("/"+t+"?on_conflict=local_id,user_id",{method:"POST",headers:{Prefer:"resolution=merge-duplicates,return=representation"},body:JSON.stringify(e)})}async function cr(t){try{const e=await S.subjects.get(t);if(!e)return;const n=await Ss(e);ce?(await oe("subjects",n),await lr("subjects",t,n.local_id),ke()):(await ne({table:"subjects",localId:t,type:"upsert"}),ee("offline",(await Ge()).length))}catch(e){console.warn("[Sync] subject failed:",e),await ne({table:"subjects",localId:t,type:"upsert"})}}async function yn(t){try{const e=await S.tasks.get(t);if(!e)return;const n=await $s(e);ce?(await oe("tasks",n),ke()):(await ne({table:"tasks",localId:t,type:"upsert"}),ee("offline",(await Ge()).length))}catch(e){console.warn("[Sync] task failed:",e),await ne({table:"tasks",localId:t,type:"upsert"})}}async function dr(t){try{const e=await S.focus_sessions.get(t);if(!e)return;const n=await _s(e);ce?(await oe("focus_sessions",n),ke()):(await ne({table:"focus_sessions",localId:t,type:"upsert"}),ee("offline",(await Ge()).length))}catch(e){console.warn("[Sync] session failed:",e),await ne({table:"focus_sessions",localId:t,type:"upsert"})}}async function ur(t){try{const e=await S.planned_sessions.get(t);if(!e)return;const n=await Es(e);ce?(await oe("planned_sessions",n),ke()):(await ne({table:"planned_sessions",localId:t,type:"upsert"}),ee("offline",(await Ge()).length))}catch(e){console.warn("[Sync] planned failed:",e),await ne({table:"planned_sessions",localId:t,type:"upsert"})}}async function pr(t){try{ce?(await st(`/subjects?local_id=eq.${t}&user_id=eq.${pe()}`,{method:"PATCH",body:JSON.stringify({deleted:!0,updated_at:Date.now()})}),ke()):await ne({table:"subjects",localId:t,type:"delete"})}catch(e){console.warn("[Sync] delete subject failed:",e),await ne({table:"subjects",localId:t,type:"delete"})}}async function As(t){try{ce?(await st(`/tasks?local_id=eq.${t}&user_id=eq.${pe()}`,{method:"PATCH",body:JSON.stringify({deleted:!0,updated_at:Date.now()})}),ke()):await ne({table:"tasks",localId:t,type:"delete"})}catch{await ne({table:"tasks",localId:t,type:"delete"})}}async function hr(t){try{ce?(await st(`/planned_sessions?local_id=eq.${t}&user_id=eq.${pe()}`,{method:"PATCH",body:JSON.stringify({deleted:!0,updated_at:Date.now()})}),ke()):await ne({table:"planned_sessions",localId:t,type:"delete"})}catch{await ne({table:"planned_sessions",localId:t,type:"delete"})}}async function Et(){const t=await Ge();if(t.length===0){ee("synced",0);return}ee("syncing",t.length);const e=[];for(const n of t)try{if(n.type==="upsert"){if(n.table==="subjects"){const s=await S.subjects.get(n.localId);s&&await oe("subjects",await Ss(s))}else if(n.table==="tasks"){const s=await S.tasks.get(n.localId);s&&await oe("tasks",await $s(s))}else if(n.table==="focus_sessions"){const s=await S.focus_sessions.get(n.localId);s&&await oe("focus_sessions",await _s(s))}else if(n.table==="planned_sessions"){const s=await S.planned_sessions.get(n.localId);s&&await oe("planned_sessions",await Es(s))}}else n.type==="delete"&&await st(`/${n.table}?local_id=eq.${n.localId}&user_id=eq.${pe()}`,{method:"PATCH",body:JSON.stringify({deleted:!0,updated_at:Date.now()})})}catch(s){console.warn("[Sync] flush failed for",n,s),e.push(n)}await Ma(e),e.length===0?(ke(),ee("synced",0)):ee("error",e.length)}async function Ta(){if(!ce){ee("offline",(await Ge()).length);return}ee("syncing",0);try{const[t,e,n,s]=await Promise.all([S.subjects.toArray(),S.tasks.toArray(),S.focus_sessions.toArray(),S.planned_sessions.toArray()]);for(const i of t)await oe("subjects",await Ss(i));for(const i of e)await oe("tasks",await $s(i));for(const i of n)await oe("focus_sessions",await _s(i));for(const i of s)await oe("planned_sessions",await Es(i));const a=await S.settings.get("main");a&&await st("/settings?on_conflict=user_id",{method:"POST",headers:{Prefer:"resolution=merge-duplicates,return=minimal"},body:JSON.stringify({user_id:pe(),data:JSON.stringify(a),updated_at:Date.now()})}),await Et(),ke(),ee("synced",0)}catch(t){console.warn("[Sync] initial sync error:",t),ee("error",0)}}async function ke(){const t=Date.now();await S.settings.put({key:"lastSupabaseSync",value:t}),ee("synced",0)}async function yr(){const t=await S.settings.get("lastSupabaseSync").catch(()=>null);return(t==null?void 0:t.value)||null}function Pa(){Et(),setInterval(()=>{ce&&Et()},6e4)}const ze=Object.freeze(Object.defineProperty({__proto__:null,flushQueue:Et,getLastSyncTime:yr,getUserId:pe,initialSync:Ta,onSyncStatus:La,startAutoSync:Pa,syncDeletePlanned:hr,syncDeleteSubject:pr,syncDeleteTask:As,syncPlanned:ur,syncSession:dr,syncSubject:cr,syncTask:yn},Symbol.toStringTag,{value:"Module"}));function F(){return new Date().toISOString().slice(0,10)}function Ca(t){return new Date(t).toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}function At(t){const e=Math.floor(Math.max(0,t)/60),n=Math.max(0,t)%60;return`${String(e).padStart(2,"0")}:${String(n).padStart(2,"0")}`}function B(t){const e=Math.floor(t/60),n=t%60;return e===0?`${n}m`:n===0?`${e}h`:`${e}h ${n}m`}function Be(t){return(t/60).toFixed(1)+"h"}function Dt(t){return t===0?"12am":t<12?`${t}am`:t===12?"12pm":`${t-12}pm`}function j(t=""){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function qa(t,e,n=80){let s=null,a=null;t.addEventListener("touchstart",i=>{s=i.touches[0].clientX,a=i.touches[0].clientY},{passive:!0}),t.addEventListener("touchend",i=>{if(s===null)return;const r=i.changedTouches[0].clientX-s,o=Math.abs(i.changedTouches[0].clientY-a);r<-n&&o<40&&e(),s=null},{passive:!0})}function Ba(t,e,n=80){let s=null,a=null;t.addEventListener("touchstart",i=>{s=i.touches[0].clientX,a=i.touches[0].clientY},{passive:!0}),t.addEventListener("touchend",i=>{if(s===null)return;const r=i.changedTouches[0].clientX-s,o=Math.abs(i.changedTouches[0].clientY-a);r>n&&o<40&&e(),s=null},{passive:!0})}async function Mt(t,e){var n,s,a,i,r,o;if(!e)return null;try{const l=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:t}]}],generationConfig:{maxOutputTokens:512,temperature:.7}})});if(!l.ok)throw new Error(`Gemini ${l.status}`);return((o=(r=(i=(a=(s=(n=(await l.json()).candidates)==null?void 0:n[0])==null?void 0:s.content)==null?void 0:a.parts)==null?void 0:i[0])==null?void 0:r.text)==null?void 0:o.trim())??null}catch(l){return console.warn("Gemini call failed:",l.message),null}}function Oa(t,e){const n=e.slice(-20).map(a=>a.context);return`You are a productivity assistant. Given these tasks and recent focus history, 
suggest the top 3 tasks to focus on today. Reply with ONLY a JSON array of 3 task titles 
from the list, nothing else. Example: ["Task A","Task B","Task C"]

Tasks:
${t.slice(0,15).map(a=>`- "${a.title}" [${a.context}] est:${a.estimatedMins||"?"}min priority:${a.priority}`).join(`
`)}

Recent focus contexts: ${[...new Set(n)].join(", ")}
Today: ${new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}`}function Ra(t,e,n){var l;const s={};t.forEach(d=>{s[d.context]=(s[d.context]||0)+(d.durationMins||0)});const a=((l=Object.entries(s).sort((d,c)=>c[1]-d[1])[0])==null?void 0:l[0])||"none",i=Array(24).fill(0);t.forEach(d=>{i[new Date(d.startedAt).getHours()]+=d.durationMins||0});const r=i.indexOf(Math.max(...i)),o=t.length?Math.round(t.reduce((d,c)=>d+(c.distractions||0),0)/t.length):0;return`You are a productivity coach. Give exactly 4 short insight observations (each under 12 words) 
about this week's focus data. Reply ONLY as a JSON array of 4 strings.

Data:
- Total focus: ${Math.round(e/60*10)/10}h across ${t.length} sessions
- Current streak: ${n} days
- Most focused context: ${a}
- Peak focus hour: ${Dt(r)}
- Avg distractions per session: ${o}`}function Na(t,e){return`A focus session just ended with ${t.distractions} distractions 
(the user's average is ${e.toFixed(1)}). 
Give ONE short, direct, encouraging suggestion (under 15 words) to reduce distractions next time. 
Reply with only the suggestion text, no preamble.`}const Fa=Object.freeze(Object.defineProperty({__proto__:null,buildDistractionPrompt:Na,buildMorningPrompt:Oa,buildWeeklySummaryPrompt:Ra,callGemini:Mt,dayLabel:Ca,esc:j,fmtHours:Be,fmtMins:B,fmtTime:At,hourLabel:Dt,onSwipeLeft:qa,onSwipeRight:Ba,todayStr:F},Symbol.toStringTag,{value:"Module"}));let Oe="all",ge="active",dt="priority",ts=null;async function fr(t){const[e,n]=await Promise.all([te(),ie()]);t.innerHTML=`
    <div class="view-header">
      <div>
        <h1 class="view-title">Inbox</h1>
        <p class="view-sub">${Ca(F())}</p>
      </div>
      <button class="icon-btn" id="add-task-btn" title="Add task">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
    </div>

    <div class="ctx-filters" id="ctx-filters">
      <button class="ctx-pill ${Oe==="all"?"active":""}" data-ctx="all">All</button>
      ${e.contexts.map(a=>`
        <button class="ctx-pill ${Oe===a.id?"active":""}" data-ctx="${a.id}">
          <span class="ctx-dot" style="background:${a.color}"></span>${a.label}
        </button>
      `).join("")}
    </div>

    <div class="filter-row">
      <div class="filter-tabs">
        <button class="filter-tab ${ge==="active"?"active":""}" data-filter="active">Active</button>
        <button class="filter-tab ${ge==="today"?"active":""}" data-filter="today">Today</button>
        <button class="filter-tab ${ge==="done"?"active":""}" data-filter="done">Done</button>
      </div>
      <div class="sort-wrap">
        <select class="sort-select" id="sort-select">
          <option value="priority" ${dt==="priority"?"selected":""}>Priority</option>
          <option value="due"      ${dt==="due"?"selected":""}>Due date</option>
          <option value="created"  ${dt==="created"?"selected":""}>Newest</option>
        </select>
      </div>
    </div>

    <div id="task-list"></div>

    <div class="inbox-footer">
      <span id="task-count"></span>
      <button class="link-btn" id="plan-btn">Plan my day →</button>
    </div>
  `;async function s(){const[a,i,r]=await Promise.all([S.tasks.toArray(),te(),ie()]);Ka(a,i,r),za(a)}t.querySelector("#ctx-filters").addEventListener("click",a=>{const i=a.target.closest(".ctx-pill");i&&(Oe=i.dataset.ctx,ts=null,t.querySelectorAll(".ctx-pill").forEach(r=>r.classList.remove("active")),i.classList.add("active"),s())}),t.querySelectorAll(".filter-tab").forEach(a=>{a.addEventListener("click",()=>{ge=a.dataset.filter,t.querySelectorAll(".filter-tab").forEach(i=>i.classList.remove("active")),a.classList.add("active"),s()})}),t.querySelector("#sort-select").addEventListener("change",a=>{dt=a.target.value,s()}),t.querySelector("#add-task-btn").addEventListener("click",()=>{gr(s)}),t.querySelector("#plan-btn").addEventListener("click",()=>{re(()=>Promise.resolve().then(()=>vn),void 0).then(a=>a.navigateTo("focus"))}),s()}function Ka(t,e,n){const s=document.getElementById("task-list");if(!s)return;let a=Oe==="all"?t:t.filter(l=>l.context===Oe);ts&&(a=a.filter(l=>l.subjectId===ts));const i=a.filter(l=>!l.completedAt),r=a.filter(l=>!!l.completedAt);let o=[];if(ge==="today"?o=i.filter(l=>l.status==="today"):ge==="done"?o=r:o=i,o=mr(o,dt),s.innerHTML="",o.length===0){s.appendChild(wr(ge));return}if(ge==="active"){const l=o.filter(c=>c.status==="today"),d=o.filter(c=>c.status!=="today");l.length>0&&(s.insertAdjacentHTML("beforeend",zs("Today",l.length)),l.forEach(c=>s.appendChild(An(c,e,n)))),d.length>0&&(s.insertAdjacentHTML("beforeend",zs("Backlog",d.length)),d.forEach(c=>s.appendChild(An(c,e,n))))}else o.forEach(l=>s.appendChild(An(l,e,n)))}function mr(t,e){return[...t].sort((n,s)=>{if(e==="due")return!n.dueDate&&!s.dueDate?(n.priority||3)-(s.priority||3):n.dueDate?s.dueDate?new Date(n.dueDate)-new Date(s.dueDate):-1:1;if(e==="created")return(s.createdAt||0)-(n.createdAt||0);const a=(n.priority||3)-(s.priority||3);return a!==0?a:(n.createdAt||0)-(s.createdAt||0)})}function An(t,e,n){const s=e.contexts.find(h=>h.id===t.context),a=t.subjectId?n.find(h=>h.id===t.subjectId):null,i=(s==null?void 0:s.color)||"#888",r=(s==null?void 0:s.label)||t.context,o=!!t.completedAt,d={1:"var(--coral)",2:"var(--amber)",3:"var(--text-muted)"}[t.priority]||"var(--text-muted)",c=document.createElement("div");c.className="task-row-wrap",c.dataset.id=t.id,c.innerHTML=`
    <div class="swipe-bg swipe-bg--complete">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>
      <span>${o?"Undo":"Done"}</span>
    </div>
    <div class="swipe-bg swipe-bg--delete">
      <span>Delete</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
    </div>
    <div class="task-row ${o?"task-done":""}">
      <div class="task-check ${o?"checked":""}" data-check="${t.id}">
        ${o?'<svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="2.5"><path d="M3 8l4 4 6-6"/></svg>':""}
      </div>
      <span class="priority-dot" style="background:${d}" title="${["","High","Med","Low"][t.priority||3]}"></span>
      <div class="task-content">
        <p class="task-title ${o?"task-title--done":""}">${j(t.title)}</p>
        <div class="task-meta-row">
          <span class="ctx-tag" style="background:${i}22;color:${i};border:0.5px solid ${i}44">${r}</span>
          ${a?`<span class="subj-tag" style="background:${a.color}22;color:${a.color};border:0.5px solid ${a.color}44">${a.icon?a.icon+" ":""}${j(a.name)}</span>`:""}
          ${t.estimatedMins?`<span class="task-est">${B(t.estimatedMins)}</span>`:""}
          ${t.notes?'<svg class="task-notes-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>':""}
        </div>
      </div>
      ${br(t.dueDate)}
    </div>
  `;const u=c.querySelector(".task-row");return c.querySelector("[data-check]").addEventListener("click",async h=>{h.stopPropagation(),await ns(t.id)}),u.addEventListener("click",h=>{h.target.closest("[data-check]")||vr(t.id)}),qa(c,async()=>{c.style.transition="opacity .2s",c.style.opacity="0",await Us(220),await ns(t.id)}),Ba(c,async()=>{c.style.transition="opacity .2s",c.style.opacity="0",await Us(220),await S.tasks.delete(t.id),As(t.id).catch(()=>{}),It()}),c}async function gr(t){var l;const[e,n]=await Promise.all([te(),ie()]),s=new Set(e.contexts.filter(d=>d.isStudy).map(d=>d.id)),a=Oe!=="all"?e.contexts.find(d=>d.id===Oe):e.contexts[0];let i={title:"",context:(a==null?void 0:a.id)||((l=e.contexts[0])==null?void 0:l.id)||"study",subjectId:null,priority:3,status:ge==="today"?"today":"inbox",estimatedMins:null,dueDate:null,dueTime:null,notes:""};const r=document.createElement("div");r.className="modal-overlay",r.innerHTML=Ha("Add task",i,e,n,s,!1),document.body.appendChild(r),requestAnimationFrame(()=>r.querySelector(".detail-modal").classList.add("modal-open")),r.querySelector("#edit-title").focus(),Ga(r,i,e,n);const o=()=>{r.querySelector(".detail-modal").classList.remove("modal-open"),setTimeout(()=>r.remove(),250)};r.querySelector("#modal-close").addEventListener("click",o),r.addEventListener("click",d=>{d.target===r&&o()}),r.querySelector("#save-btn").addEventListener("click",async()=>{const d=r.querySelector("#edit-title").value.trim();if(!d){r.querySelector("#edit-title").focus();return}i.title=d;const c=await S.tasks.add({...i,createdAt:Date.now(),completedAt:null,goalId:null});yn(c).catch(()=>{}),o(),t?t():It()})}async function vr(t){var l,d;const e=await S.tasks.get(t);if(!e)return;const[n,s]=await Promise.all([te(),ie()]),a=new Set(n.contexts.filter(c=>c.isStudy).map(c=>c.id));let i={title:e.title,context:e.context,subjectId:e.subjectId??null,priority:e.priority,status:e.status,estimatedMins:e.estimatedMins??null,dueDate:e.dueDate??null,dueTime:e.dueTime??null,notes:e.notes??""};const r=document.createElement("div");r.className="modal-overlay",r.innerHTML=Ha("Edit task",i,n,s,a,!0),document.body.appendChild(r),requestAnimationFrame(()=>r.querySelector(".detail-modal").classList.add("modal-open")),Ga(r,i,n,s);const o=()=>{r.querySelector(".detail-modal").classList.remove("modal-open"),setTimeout(()=>r.remove(),250)};r.querySelector("#modal-close").addEventListener("click",o),r.addEventListener("click",c=>{c.target===r&&o()}),r.querySelector("#save-btn").addEventListener("click",async()=>{i.title=r.querySelector("#edit-title").value.trim()||e.title,await S.tasks.update(t,i),yn(t).catch(()=>{}),o(),It()}),(l=r.querySelector("#delete-btn"))==null||l.addEventListener("click",async()=>{confirm("Delete this task?")&&(await S.tasks.delete(t),As(t).catch(()=>{}),o(),It())}),(d=r.querySelector("#complete-btn"))==null||d.addEventListener("click",async()=>{await ns(t),o()})}function Ha(t,e,n,s,a,i){const r=a.has(e.context);return`
    <div class="modal-card detail-modal">
      <div class="modal-drag-bar"></div>
      <div class="modal-header">
        <textarea class="modal-title-input" id="edit-title" rows="2" placeholder="Task title…">${j(e.title)}</textarea>
        <button class="modal-close-btn" id="modal-close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">

        <label class="modal-field-label">Context</label>
        <div class="seg-row" id="ctx-seg" style="flex-wrap:wrap;margin-bottom:14px">
          ${n.contexts.map(o=>{const l=e.context===o.id;return`<button class="seg-btn ${l?"seg-ctx-active":""}" data-val="${o.id}" data-color="${o.color}" data-is-study="${o.isStudy?"1":"0"}"
              style="${l?`background:${o.color}22;border-color:${o.color};color:${o.color}`:""}">
              <span class="ctx-dot" style="background:${o.color}"></span>${o.label}
            </button>`}).join("")}
        </div>

        <div id="subject-row" style="${r&&s.length?"":"display:none"}">
          <label class="modal-field-label">Subject</label>
          <div class="seg-row" id="subj-seg" style="flex-wrap:wrap;margin-bottom:14px">
            <button class="seg-btn ${e.subjectId?"":"seg-active"}" data-val="">None</button>
            ${s.map(o=>{const l=e.subjectId===o.id;return`<button class="seg-btn ${l?"seg-ctx-active":""}" data-val="${o.id}" data-color="${o.color}"
                style="${l?`background:${o.color}22;border-color:${o.color};color:${o.color}`:""}">
                ${o.icon?o.icon+" ":""}${j(o.name)}
              </button>`}).join("")}
          </div>
        </div>

        <div class="modal-row-2">
          <div style="flex:1;min-width:0">
            <label class="modal-field-label">Priority</label>
            <div class="seg-row" id="pri-seg" style="gap:4px">
              ${[{v:1,l:"High",c:"#D85A30"},{v:2,l:"Med",c:"#BA7517"},{v:3,l:"Low",c:"#888780"}].map(o=>{const l=e.priority===o.v;return`<button class="seg-btn ${l?"seg-active":""}" data-val="${o.v}" data-color="${o.c}"
                  style="${l?`background:${o.c}22;border-color:${o.c};color:${o.c}`:""}">${o.l}</button>`}).join("")}
            </div>
          </div>
          <div>
            <label class="modal-field-label">Est.</label>
            <div style="display:flex;align-items:center;gap:6px">
              <input type="number" class="num-input" id="edit-est" value="${e.estimatedMins||""}" placeholder="—" min="5" max="480" step="5">
              <span class="field-unit">min</span>
            </div>
          </div>
        </div>

        <div class="modal-row-2" style="margin-top:12px">
          <div style="flex:1">
            <label class="modal-field-label">Schedule</label>
            <div class="seg-row" id="status-seg">
              <button class="seg-btn ${e.status==="today"?"seg-active":""}" data-val="today">Today</button>
              <button class="seg-btn ${e.status==="inbox"?"seg-active":""}" data-val="inbox">Backlog</button>
            </div>
          </div>
          <div>
            <label class="modal-field-label">Due date</label>
            <input type="date" class="time-input date-input" id="edit-due" value="${e.dueDate||""}">
          </div>
        </div>

        <div style="margin-top:12px">
          <label class="modal-field-label">Due time <span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--text-muted)">(optional)</span></label>
          <input type="time" class="time-input" id="edit-due-time" value="${e.dueTime||""}">
        </div>

        <label class="modal-field-label" style="margin-top:14px">Notes</label>
        <textarea class="detail-notes" id="edit-notes" rows="3" placeholder="Add notes…">${j(e.notes||"")}</textarea>

      </div>
      <div class="modal-footer">
        ${i?`
          <button class="btn-ghost danger" id="delete-btn">Delete</button>
          <button class="btn-ghost" id="complete-btn">${e.completedAt?"Undo":"Complete"}</button>
        `:""}
        <button class="btn-primary" id="save-btn">${i?"Save changes":"Add task"}</button>
      </div>
    </div>
  `}function Ga(t,e,n,s,a){var i,r,o,l;(i=t.querySelector("#edit-est"))==null||i.addEventListener("input",d=>{e.estimatedMins=d.target.value?+d.target.value:null}),(r=t.querySelector("#edit-notes"))==null||r.addEventListener("input",d=>{e.notes=d.target.value}),(o=t.querySelector("#edit-due"))==null||o.addEventListener("change",d=>{e.dueDate=d.target.value||null}),(l=t.querySelector("#edit-due-time"))==null||l.addEventListener("change",d=>{e.dueTime=d.target.value||null}),t.querySelectorAll("#ctx-seg .seg-btn").forEach(d=>{d.addEventListener("click",()=>{t.querySelectorAll("#ctx-seg .seg-btn").forEach(h=>{h.classList.remove("seg-ctx-active"),h.style.cssText=""}),d.classList.add("seg-ctx-active");const c=d.dataset.color;d.style.background=c+"22",d.style.borderColor=c,d.style.color=c,e.context=d.dataset.val;const u=d.dataset.isStudy==="1",p=t.querySelector("#subject-row");p&&(p.style.display=u&&s.length?"":"none"),u||(e.subjectId=null)})}),t.querySelectorAll("#subj-seg .seg-btn").forEach(d=>{d.addEventListener("click",()=>{t.querySelectorAll("#subj-seg .seg-btn").forEach(u=>{u.classList.remove("seg-ctx-active","seg-active"),u.style.cssText=""});const c=d.dataset.val;if(c){d.classList.add("seg-ctx-active");const u=d.dataset.color;d.style.background=u+"22",d.style.borderColor=u,d.style.color=u,e.subjectId=+c}else d.classList.add("seg-active"),e.subjectId=null})}),t.querySelectorAll("#pri-seg .seg-btn").forEach(d=>{d.addEventListener("click",()=>{t.querySelectorAll("#pri-seg .seg-btn").forEach(u=>{u.classList.remove("seg-active"),u.style.cssText=""}),d.classList.add("seg-active");const c=d.dataset.color;d.style.background=c+"22",d.style.borderColor=c,d.style.color=c,e.priority=+d.dataset.val})}),t.querySelectorAll("#status-seg .seg-btn").forEach(d=>{d.addEventListener("click",()=>{t.querySelectorAll("#status-seg .seg-btn").forEach(c=>c.classList.remove("seg-active")),d.classList.add("seg-active"),e.status=d.dataset.val})})}function br(t){if(!t)return"";const e=new Date;e.setHours(0,0,0,0);const n=new Date(t);n.setHours(0,0,0,0);const s=Math.round((n-e)/864e5);return s<0?'<span class="due-badge due-badge--overdue">overdue</span>':s===0?'<span class="due-badge due-badge--today">today</span>':s<=3?`<span class="due-badge due-badge--upcoming">in ${s}d</span>`:`<span class="due-badge due-badge--upcoming">${n.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</span>`}function wr(t){const e={active:{icon:"✓",title:"All clear",hint:"Tap + to add your first task"},today:{icon:"☀",title:"Nothing scheduled today",hint:"Add a task and set it to Today"},done:{icon:"🎉",title:"No completed tasks yet",hint:"Swipe a task left or tap to complete it"}},n=e[t]||e.active,s=document.createElement("div");return s.className="empty-state",s.innerHTML=`
    <div class="empty-icon">${n.icon}</div>
    <p class="empty-title">${n.title}</p>
    <p class="empty-hint">${n.hint}</p>
  `,s}async function ns(t){const e=await S.tasks.get(t);e&&(await S.tasks.update(t,{completedAt:e.completedAt?null:Date.now(),status:e.completedAt?"inbox":e.status}),yn(t).catch(()=>{}),It())}async function It(){const[t,e,n]=await Promise.all([S.tasks.toArray(),te(),ie()]);Ka(t,e,n),za(t)}function za(t){const e=document.getElementById("task-count");if(!e)return;const n=t.filter(i=>!i.completedAt),s=t.filter(i=>!!i.completedAt),a=n.reduce((i,r)=>i+(r.estimatedMins||0),0);e.textContent=`${n.length} active${a>0?" · "+B(a):""} · ${s.length} done`}function zs(t,e){return`<div class="section-header">${t}<span class="section-count">${e}</span></div>`}function Us(t){return new Promise(e=>setTimeout(e,t))}let gt=null,Zt=null,P={},Te=0;async function kr(t){Ds=t;const[e,n]=await Promise.all([te(),ie()]),s=await Ms();if(t.innerHTML=`
    <div class="view-header">
      <h1 class="view-title">Focus</h1>
      <span class="state-badge" id="state-badge">Idle</span>
    </div>
    <div id="session-stage"></div>
  `,gt&&P.taskId){const a=await S.tasks.get(P.taskId),i=e.contexts.find(o=>o.id===(a==null?void 0:a.context)),r=P.subjectId?n.find(o=>o.id===P.subjectId):null;mn(t,a,i,r,P.durationMins,e)}else fn(t,s,e,n)}async function xr(t){return Ds=t,kr(t)}let Ds=null;async function fn(t,e,n,s){var l,d;Re(),Lt("Idle","");const a=t.querySelector("#session-stage");a.innerHTML=`
    <div id="daily-progress-wrap"></div>
    <div id="subject-progress-wrap"></div>

    <p class="stage-label">Subject <span class="stage-label-hint">optional</span></p>
    <div class="subject-picker" id="subject-picker">
      <button class="subject-chip ${s.length?"":"hidden"} subject-chip--none selected" data-id="">
        No subject
      </button>
      ${s.map(c=>`
        <button class="subject-chip" data-id="${c.id}"
          style="--sc:${c.color}">
          <span class="subject-chip-icon">${c.icon||"📚"}</span>
          <span>${j(c.name)}</span>
        </button>
      `).join("")}
    </div>

    <p class="stage-label" style="margin-top:18px">Task <span class="stage-label-hint">optional</span></p>
    <div id="task-picker" class="task-picker">
      ${e.length===0?`<div class="empty-state" style="padding:24px 0">
             <p style="font-size:13px;color:var(--text-muted)">No tasks scheduled for today.</p>
             <button class="btn-ghost" style="margin-top:10px;font-size:12px" id="go-inbox">Go to Inbox →</button>
           </div>`:`<button class="picker-row picker-row--none selected" data-id="">
             <span style="color:var(--text-muted);font-size:13px">Free session — no task</span>
           </button>
           ${e.map(c=>Ua(c,n.contexts,s,!1)).join("")}`}
    </div>

    <p class="stage-label" style="margin-top:18px">Session length</p>
    <div class="seg-row" id="dur-seg">
      ${[25,50,90].map(c=>`
        <button class="seg-btn ${n.defaultDuration===c?"seg-active":""}" data-mins="${c}">${c} min</button>
      `).join("")}
    </div>

    <button class="btn-primary full-width" id="start-btn" style="margin-top:24px">
      Start session
    </button>

    <div class="planner-link-row">
      <button class="link-btn" id="open-planner">View day planner →</button>
    </div>
  `,Sr(n),$r(s,n);let i=null,r=null,o=n.defaultDuration;a.querySelectorAll(".subject-chip").forEach(c=>{c.addEventListener("click",()=>{a.querySelectorAll(".subject-chip").forEach(u=>u.classList.remove("selected")),c.classList.add("selected"),r=c.dataset.id?+c.dataset.id:null})}),a.querySelectorAll(".picker-row").forEach(c=>{c.addEventListener("click",()=>{a.querySelectorAll(".picker-row").forEach(u=>u.classList.remove("selected")),c.classList.add("selected"),i=c.dataset.id?+c.dataset.id:null,i&&!r&&S.tasks.get(i).then(u=>{if(u!=null&&u.subjectId){const p=a.querySelector(`.subject-chip[data-id="${u.subjectId}"]`);p&&(a.querySelectorAll(".subject-chip").forEach(h=>h.classList.remove("selected")),p.classList.add("selected"),r=u.subjectId)}})})}),a.querySelectorAll("#dur-seg .seg-btn").forEach(c=>{c.addEventListener("click",()=>{a.querySelectorAll("#dur-seg .seg-btn").forEach(u=>u.classList.remove("seg-active")),c.classList.add("seg-active"),o=+c.dataset.mins})}),(l=a.querySelector("#go-inbox"))==null||l.addEventListener("click",()=>{re(()=>Promise.resolve().then(()=>vn),void 0).then(c=>c.navigateTo("inbox"))}),(d=a.querySelector("#open-planner"))==null||d.addEventListener("click",()=>{Ar(t,e,n,s)}),a.querySelector("#start-btn").addEventListener("click",async()=>{const c=i?await S.tasks.get(i):null,u=c?n.contexts.find(h=>h.id===c.context):null,p=r?s.find(h=>h.id===r):null;mn(t,c,u,p,o,n)})}async function Sr(t){const e=await cn(F()),n=t.dailyGoalHours*60,s=Math.min(100,Math.round(e/n*100)),a=document.getElementById("daily-progress-wrap");a&&(a.innerHTML=`
    <div class="daily-progress-card">
      <div class="dp-row">
        <span class="dp-label">Today's focus</span>
        <span class="dp-val">${B(e)} <span class="dp-target">/ ${t.dailyGoalHours}h</span></span>
      </div>
      <div class="dp-bar-bg">
        <div class="dp-bar-fg" style="width:${s}%"></div>
      </div>
      ${s>=100?'<p class="dp-done">Daily goal reached 🎉</p>':""}
    </div>
  `)}async function $r(t,e){if(!t.length)return;const n=document.getElementById("subject-progress-wrap");if(!n)return;const s=F(),a=await Promise.all(t.map(async i=>{const r=await et(s,i.id),o=Math.min(100,Math.round(r/(i.dailyGoalMins||60)*100)),l=e.streakFreezeEnabled?e.streakGraceDays??1:0,{current:d}=await bs(i.id,i.dailyGoalMins,e.activeDays,l);return{s:i,mins:r,pct:o,streak:d}}));n.innerHTML=`
    <div class="subj-progress-section">
      <p class="stage-label" style="margin-bottom:8px">Subject goals</p>
      ${a.map(({s:i,mins:r,pct:o,streak:l})=>`
        <div class="subj-progress-row">
          <div class="subj-progress-head">
            <span class="subj-progress-icon" style="color:${i.color}">${i.icon||"📚"}</span>
            <span class="subj-progress-name">${j(i.name)}</span>
            <span class="subj-progress-val">${B(r)}<span class="subj-progress-goal"> / ${B(i.dailyGoalMins)}</span></span>
            ${l>0?`<span class="subj-streak-badge" style="${l>=14?"background:rgba(186,117,23,.2);color:#BA7517;border-color:rgba(186,117,23,.4)":l>=7?"background:rgba(127,119,221,.2);color:#7F77DD;border-color:rgba(127,119,221,.4)":""}">${l>=30?"🔥🔥🔥":l>=14?"🔥🔥":"🔥"} ${l}</span>`:""}
          </div>
          <div class="dp-bar-bg" style="margin-top:5px">
            <div class="dp-bar-fg" style="width:${o}%;background:${i.color}"></div>
          </div>
          ${o>=100?`<p class="dp-done" style="color:${i.color}">Goal reached ✓</p>`:""}
        </div>
      `).join("")}
    </div>
  `}function mn(t,e,n,s,a,i){Re(),Lt("Focus","focus");const r=(s==null?void 0:s.color)||(n==null?void 0:n.color)||"#7F77DD",o=(a||i.defaultDuration)*60,l=2*Math.PI*68;P={taskId:(e==null?void 0:e.id)||null,goalId:(e==null?void 0:e.goalId)||null,context:(e==null?void 0:e.context)||null,subjectId:(s==null?void 0:s.id)||null,startedAt:Date.now(),durationMins:a||i.defaultDuration,distractions:0,distractionLog:[],qualityRating:null,notes:""};const d=t.querySelector("#session-stage"),c=s?`${s.icon?s.icon+" ":""}${s.name}`:e?e.title:"Free session";d.innerHTML=`
    <div class="active-header">
      <div class="task-pill" style="border-color:${r}44">
        <span class="ctx-dot" style="background:${r}"></span>
        <span class="pill-text">${j(c)}</span>
      </div>
      ${e&&e.title!==c?`
        <p class="active-task-sub">${j(e.title)}</p>
      `:""}
      <div class="pomo-dots" id="pomo-dots">
        ${Array.from({length:i.longBreakAfter||4},(v,f)=>`
          <div class="pomo-dot ${f<Te?"done":f===Te?"active":""}"></div>
        `).join("")}
      </div>
    </div>

    ${s?`
      <div id="active-subj-progress"></div>
    `:""}

    <div class="timer-wrap">
      <div class="timer-ring-wrap">
        <svg class="timer-svg" viewBox="0 0 160 160">
          <circle class="ring-bg" cx="80" cy="80" r="68"/>
          <circle class="ring-fg" id="ring-fg" cx="80" cy="80" r="68"
            stroke="${r}"
            stroke-dasharray="${l.toFixed(1)}"
            stroke-dashoffset="0"/>
        </svg>
        <div class="timer-center">
          <p class="timer-num" id="timer-num">${At(o)}</p>
          <p class="timer-sub" id="timer-sub">Focus</p>
        </div>
      </div>
    </div>

    <div class="active-controls">
      <button class="btn-ghost flex-2" id="pause-btn">Pause</button>
      <button class="btn-ghost danger flex-1" id="end-btn">End</button>
    </div>

    <div class="distract-section">
      <p class="stage-label">Log distraction</p>
      <div class="distract-chips">
        ${["Phone","Notification","Thought","Noise","Other"].map(v=>`<button class="distract-chip" data-type="${v}">${v}</button>`).join("")}
      </div>
      <div class="distract-counter">
        <span class="stage-label" style="margin:0">Distractions</span>
        <span class="distract-badge" id="distract-badge">0</span>
      </div>
    </div>
  `,s&&ss(s);let u=o,p=!1;gt=setInterval(()=>{var m,b,k;if(p)return;u--;const v=document.getElementById("timer-num");v&&(v.textContent=At(Math.max(0,u)));const f=u/o,g=(l*(1-f)).toFixed(1),y=document.getElementById("ring-fg");y&&y.setAttribute("stroke-dashoffset",g),s&&(o-u)%30===0&&ss(s),u<=0&&(Re(),Te++,(m=window._apexHaptic)==null||m.call(window,"medium"),i.sessionEndSound&&((b=window._apexPlayBeep)==null||b.call(window,"session-end")),(k=window._apexNotify)==null||k.call(window,"Session complete — Apex Focus",`${P.durationMins}m logged. Rate your session.`),Ws(t,e,n,s,i))},1e3);const h=d.querySelector("#pause-btn");h.addEventListener("click",()=>{p=!p,h.textContent=p?"Resume":"Pause",Lt(p?"Paused":"Focus",p?"":"focus")}),d.querySelector("#end-btn").addEventListener("click",()=>{Re();const v=Math.max(1,Math.round((Date.now()-P.startedAt)/6e4));P.durationMins=v,Te++,Ws(t,e,n,s,i)}),d.querySelectorAll(".distract-chip").forEach(v=>{v.addEventListener("click",()=>{P.distractions++,P.distractionLog.push({type:v.dataset.type,at:Date.now()});const f=document.getElementById("distract-badge");f&&(f.textContent=P.distractions),v.classList.add("logged"),setTimeout(()=>v.classList.remove("logged"),900)})}),"wakeLock"in navigator&&navigator.wakeLock.request("screen").catch(()=>{})}async function ss(t,e){const n=document.getElementById("active-subj-progress");if(!n)return;const s=await et(F(),t.id),a=Math.min(100,Math.round(s/(t.dailyGoalMins||60)*100));n.innerHTML=`
    <div class="active-subj-bar">
      <div class="active-subj-bar-head">
        <span style="font-size:12px;color:var(--text-muted)">${j(t.name)} today</span>
        <span style="font-size:12px;color:${t.color}">${B(s)} / ${B(t.dailyGoalMins)}</span>
      </div>
      <div class="dp-bar-bg" style="margin-top:4px">
        <div class="dp-bar-fg" style="width:${a}%;background:${t.color}"></div>
      </div>
    </div>
  `}async function Ws(t,e,n,s,a){let i=null;if(a.aiDistractionAlerts&&a.aiApiKey&&P.distractions>0){const r=await _t(F()),o=r.length?r.reduce((l,d)=>l+(d.distractions||0),0)/r.length:0;P.distractions>o*1.5+1&&(i=await Mt(Na(P,o),a.aiApiKey).catch(()=>null))}if(a.aiSmartRescheduling&&a.aiApiKey)try{const r=new Date,o=r.getHours()*60+r.getMinutes(),l=await S.time_blocks.where("date").equals(F()).filter(d=>d.startTime>o).toArray();if(l.length>0&&!i){const d=[...new Set(l.map(h=>h.taskId).filter(Boolean))],u=(await Promise.all(d.map(h=>S.tasks.get(h)))).filter(Boolean).map(h=>h.title),p=`You are a productivity assistant. A focus session just ended and it's now ${r.getHours()}:${String(r.getMinutes()).padStart(2,"0")}. The user still has these tasks planned: ${u.join(", ")}. In one short sentence (under 15 words), suggest whether to continue the plan or drop the lowest priority task. Be direct.`;i=await Mt(p,a.aiApiKey).catch(()=>null)}}catch{}_r(t,e,n,s,a,i)}function _r(t,e,n,s,a,i=null){Lt("Done","done");const r=t.querySelector("#session-stage"),o=P.distractions>0?Math.max(0,Math.round(100-P.distractions/P.durationMins*100*.5)):100;r.innerHTML=`
    <div class="wrap-hero">
      <div class="wrap-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="#0F6E56" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </div>
      <p class="wrap-title">Session complete</p>
      <p class="wrap-meta">
        ${P.durationMins}m
        ${s?`· <span style="color:${s.color}">${s.icon||""}${s.name}</span>`:""}
        · ${P.distractions} distraction${P.distractions!==1?"s":""}
      </p>
    </div>

    <div class="stat-grid">
      <div class="stat-card">
        <p class="stat-val">${B(P.durationMins)}</p>
        <p class="stat-label">Duration</p>
      </div>
      <div class="stat-card">
        <p class="stat-val">${o}%</p>
        <p class="stat-label">Focus rate</p>
      </div>
      <div class="stat-card">
        <p class="stat-val" id="quality-stat">—</p>
        <p class="stat-label">Quality</p>
      </div>
    </div>

    ${s?'<div id="wrap-subj-progress"></div>':""}

    ${i?`
      <div class="ai-tip">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        ${j(i)}
      </div>
    `:""}

    <p class="stage-label">Rate this session</p>
    <div class="seg-row" id="quality-seg">
      <button class="seg-btn" data-val="Deep">Deep</button>
      <button class="seg-btn" data-val="Good">Good</button>
      <button class="seg-btn" data-val="Patchy">Patchy</button>
    </div>

    <p class="stage-label" style="margin-top:16px">Session note</p>
    <textarea class="session-note" id="session-note" rows="3"
      placeholder="What did you get done? Any blockers?"></textarea>

    <div class="wrap-actions">
      <button class="btn-ghost" id="break-btn">Take ${a.breakLength}m break</button>
      <button class="btn-primary" id="save-btn">Save &amp; finish</button>
    </div>
  `,s&&ss(s).then(()=>{et(F(),s.id).then(l=>{if(l+P.durationMins>=s.dailyGoalMins&&l<s.dailyGoalMins){const d=document.getElementById("wrap-subj-progress");d&&d.insertAdjacentHTML("beforeend",`
            <p class="dp-done" style="color:${s.color};margin-top:4px">
              ${s.name} goal reached 🎉
            </p>
          `)}})}),r.querySelector("#session-note").addEventListener("input",l=>{P.notes=l.target.value}),r.querySelectorAll("#quality-seg .seg-btn").forEach(l=>{l.addEventListener("click",()=>{r.querySelectorAll("#quality-seg .seg-btn").forEach(c=>{c.classList.remove("seg-active"),c.style.cssText=""}),l.classList.add("seg-active"),l.style.background="var(--accent)22",l.style.borderColor="var(--accent)",l.style.color="var(--accent)",P.qualityRating=l.dataset.val;const d=document.getElementById("quality-stat");d&&(d.textContent=l.dataset.val)})}),r.querySelector("#save-btn").addEventListener("click",async()=>{await Ys(a,s);const[l,d]=await Promise.all([Ms(),ie()]);fn(t,l,a,d)}),r.querySelector("#break-btn").addEventListener("click",async()=>{await Ys(a,s);const l=Te>0&&Te%(a.longBreakAfter||4)===0;l&&(Te=0),Er(t,l?a.longBreakLength:a.breakLength,a)})}function Er(t,e,n){Re(),Lt("Break","break");const s=e*60;let a=s;const i=2*Math.PI*68,r=t.querySelector("#session-stage");r.innerHTML=`
    <p style="text-align:center;font-size:13px;color:var(--text-muted);margin:0 0 4px">
      ${e>=20?"Long break — step away and recharge":"Short break — stretch and breathe"}
    </p>
    <div class="timer-wrap">
      <div class="timer-ring-wrap">
        <svg class="timer-svg" viewBox="0 0 160 160">
          <circle class="ring-bg" cx="80" cy="80" r="68"/>
          <circle class="ring-fg" id="break-ring" cx="80" cy="80" r="68"
            stroke="#1D9E75"
            stroke-dasharray="${i.toFixed(1)}"
            stroke-dashoffset="0"/>
        </svg>
        <div class="timer-center">
          <p class="timer-num" id="break-num">${At(s)}</p>
          <p class="timer-sub" style="color:var(--teal)">Break</p>
        </div>
      </div>
    </div>
    <button class="btn-primary full-width" id="skip-break" style="margin-top:24px">
      Skip break
    </button>
  `,Zt=setInterval(()=>{var d;a--;const o=document.getElementById("break-num"),l=document.getElementById("break-ring");o&&(o.textContent=At(Math.max(0,a))),l&&l.setAttribute("stroke-dashoffset",(i*(1-a/s)).toFixed(1)),a<=0&&(Re(),n.breakEndReminder&&((d=window._apexPlayBeep)==null||d.call(window,"break-end")),Vs(t,n))},1e3),r.querySelector("#skip-break").addEventListener("click",()=>{Re(),Vs(t,n)})}async function Vs(t,e){const[n,s]=await Promise.all([Ms(),ie()]);fn(t,n,e,s)}async function Ar(t,e,n,s){const a=await S.time_blocks.where("date").equals(F()).toArray(),i=Object.fromEntries(e.map(o=>[o.id,o])),r=t.querySelector("#session-stage");r.innerHTML=`
    <div class="planner-header">
      <div>
        <p class="stage-label" style="margin:0 0 2px">Day planner</p>
        <p class="planner-total" id="planner-total">${is(a)}h blocked</p>
      </div>
      <button class="btn-accent" id="back-setup">← Back</button>
    </div>
    <div class="planner-grid" id="planner-grid"></div>
    <button class="btn-primary full-width" style="margin-top:16px" id="planner-start">
      Start first session
    </button>
  `,r.querySelector("#back-setup").addEventListener("click",async()=>{fn(t,e,n,s)}),r.querySelector("#planner-start").addEventListener("click",async()=>{const o=new Date,l=o.getHours()*60+o.getMinutes(),d=a.filter(h=>h.taskId&&i[h.taskId]).sort((h,v)=>h.startTime-v.startTime).find(h=>h.startTime>=l),c=d?i[d.taskId]:e[0];if(!c)return;const u=n.contexts.find(h=>h.id===c.context),p=c.subjectId?s.find(h=>h.id===c.subjectId):null;mn(t,c,u,p,(d==null?void 0:d.durationMins)||n.defaultDuration,n)}),as(r,e,n,s,a,i)}function as(t,e,n,s,a,i){const r=t.querySelector("#planner-grid");if(!r)return;r.innerHTML="";const o=Array.from({length:14},(c,u)=>u+7),d=new Date().getHours();o.forEach(c=>{const u=a.find(k=>Math.floor(k.startTime/60)===c),p=u?i[u.taskId]:null,h=p?n.contexts.find(k=>k.id===p.context):null,v=p!=null&&p.subjectId?s.find(k=>k.id===p.subjectId):null,f=(v==null?void 0:v.color)||(h==null?void 0:h.color)||"#7F77DD",g=c===d,y=document.createElement("div");y.className="planner-row"+(g?" planner-now":""),y.innerHTML=`
      <div class="planner-hour ${g?"planner-hour--now":""}">${Wa(c)}</div>
      <div class="planner-slot">
        ${g?'<div class="now-line"><span class="now-dot"></span></div>':""}
        ${p?`<div class="planner-block" data-task-id="${p.id}"
               style="background:${f}22;border-color:${f}44;color:${f}">
               <span class="block-title">${j(p.title)}</span>
               ${v?`<span class="block-subj">${v.icon||""} ${j(v.name)}</span>`:""}
               ${u.durationMins?`<span class="block-dur">${u.durationMins}m</span>`:""}
             </div>`:`<div class="planner-empty" data-hour="${c}"><span>+ add block</span></div>`}
      </div>
    `;const m=y.querySelector(".planner-block");if(m){let k=null;m.addEventListener("click",async()=>{if(k){clearTimeout(k),k=null;return}const x=await S.tasks.get(+m.dataset.taskId),M=await te(),$=M.contexts.find(L=>L.id===(x==null?void 0:x.context)),T=x!=null&&x.subjectId?s.find(L=>L.id===x.subjectId):null;mn(Ds,x,$,T,u.durationMins||M.defaultDuration,M)});const _=()=>{k=setTimeout(async()=>{if(k=null,!confirm("Remove this block?"))return;await S.time_blocks.delete(u.id);const x=await S.time_blocks.where("date").equals(F()).toArray();as(t,e,n,s,x,Object.fromEntries(e.map($=>[$.id,$])));const M=t.querySelector("#planner-total");M&&(M.textContent=is(x)+"h blocked")},500)},w=()=>{k&&(clearTimeout(k),k=null)};m.addEventListener("touchstart",_,{passive:!0}),m.addEventListener("touchend",w),m.addEventListener("mousedown",_),m.addEventListener("mouseup",w),m.addEventListener("mouseleave",w)}const b=y.querySelector(".planner-empty");b&&b.addEventListener("click",()=>Dr(c,e,n,async()=>{const k=await S.time_blocks.where("date").equals(F()).toArray();as(t,e,n,s,k,Object.fromEntries(e.map(w=>[w.id,w])));const _=t.querySelector("#planner-total");_&&(_.textContent=is(k)+"h blocked")})),r.appendChild(y)})}async function Dr(t,e,n,s){var l;const a=document.createElement("div");a.className="modal-overlay",a.innerHTML=`
    <div class="modal-card detail-modal">
      <div class="modal-drag-bar"></div>
      <div class="modal-header">
        <p style="font-size:15px;font-weight:500;color:var(--text-primary);margin:0">Block ${Wa(t)}</p>
        <button class="modal-close-btn" id="block-close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <label class="modal-field-label">Task</label>
        <div class="task-picker" id="block-task-picker" style="max-height:220px;overflow-y:auto">
          ${e.map((d,c)=>Ua(d,n.contexts,[],c===0)).join("")}
        </div>
        <label class="modal-field-label" style="margin-top:14px">Duration</label>
        <div class="seg-row" id="block-dur-seg">
          <button class="seg-btn" data-mins="25">25m</button>
          <button class="seg-btn seg-active" data-mins="50">50m</button>
          <button class="seg-btn" data-mins="90">90m</button>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-ghost" id="block-cancel">Cancel</button>
        <button class="btn-primary" id="block-save">Add block</button>
      </div>
    </div>
  `,document.body.appendChild(a),requestAnimationFrame(()=>a.querySelector(".detail-modal").classList.add("modal-open"));let i=((l=e[0])==null?void 0:l.id)||null,r=50;a.querySelectorAll(".picker-row").forEach(d=>{d.addEventListener("click",()=>{a.querySelectorAll(".picker-row").forEach(c=>c.classList.remove("selected")),d.classList.add("selected"),i=d.dataset.id?+d.dataset.id:null})}),a.querySelectorAll("#block-dur-seg .seg-btn").forEach(d=>{d.addEventListener("click",()=>{a.querySelectorAll("#block-dur-seg .seg-btn").forEach(c=>c.classList.remove("seg-active")),d.classList.add("seg-active"),r=+d.dataset.mins})});const o=()=>{a.querySelector(".detail-modal").classList.remove("modal-open"),setTimeout(()=>a.remove(),250)};a.querySelector("#block-close").addEventListener("click",o),a.querySelector("#block-cancel").addEventListener("click",o),a.addEventListener("click",d=>{d.target===a&&o()}),a.querySelector("#block-save").addEventListener("click",async()=>{i&&(await S.time_blocks.add({taskId:i,date:F(),startTime:t*60,durationMins:r,createdAt:Date.now()}),o(),s())})}async function Ys(t,e){var n,s,a,i,r,o,l;await Qi(P);try{const d=t.dailyGoalHours*60,c=await cn(F());c-P.durationMins<d&&c>=d&&t.dailyGoalAlert&&((n=window._apexHaptic)==null||n.call(window,"success"),(s=window._apexPlayBeep)==null||s.call(window,"goal-reached"),(a=window._apexNotify)==null||a.call(window,"Daily goal reached! 🎉",`${t.dailyGoalHours}h of deep work done.`,"goal-reached"))}catch{}if(e)try{const d=await et(F(),e.id)-P.durationMins,c=await et(F(),e.id);if(d<e.dailyGoalMins&&c>=e.dailyGoalMins){(i=window._apexHaptic)==null||i.call(window,"success"),(r=window._apexPlayBeep)==null||r.call(window,"goal-reached");const u=t.streakFreezeEnabled?t.streakGraceDays??1:0,{current:p}=await bs(e.id,e.dailyGoalMins,t.activeDays,u);[3,7,14,30].includes(p)&&((o=window._apexHaptic)==null||o.call(window,"success"),(l=window._apexNotify)==null||l.call(window,`${p}-day streak! 🔥`,`You've hit your ${e.name} goal ${p} days in a row.`,"streak-"+e.id))}}catch{}t.syncHabits&&await cn(F())>=t.dailyGoalHours*60&&await S.settings.put({key:"habitSync_"+F(),value:!0})}async function Ms(){return S.tasks.where("status").anyOf(["today","inbox"]).filter(t=>!t.completedAt).toArray()}function Re(){gt&&(clearInterval(gt),gt=null),Zt&&(clearInterval(Zt),Zt=null)}function Lt(t,e){const n=document.getElementById("state-badge");n&&(n.textContent=t,n.className="state-badge"+(e?" badge-"+e:""))}function Ua(t,e,n,s){const a=e.find(o=>o.id===t.context),i=n==null?void 0:n.find(o=>o.id===t.subjectId),r=(i==null?void 0:i.color)||(a==null?void 0:a.color)||"#888780";return`
    <div class="picker-row ${s?"selected":""}" data-id="${t.id}">
      <span class="ctx-dot" style="background:${r}"></span>
      <div class="picker-content">
        <p class="picker-title">${j(t.title)}</p>
        <p class="picker-meta">
          ${(a==null?void 0:a.label)||t.context}
          ${i?" · "+(i.icon||"")+i.name:""}
          ${t.estimatedMins?" · est. "+B(t.estimatedMins):""}
        </p>
      </div>
      <span class="picker-check">✓</span>
    </div>
  `}function is(t){return(t.reduce((e,n)=>e+(n.durationMins||50),0)/60).toFixed(1)}function Wa(t){return t===0?"12am":t<12?`${t}am`:t===12?"12pm":`${t-12}pm`}async function Mr(t){const e=new Date;let n=e.getFullYear(),s=e.getMonth();t.innerHTML=`
    <div class="view-header">
      <h1 class="view-title">Calendar</h1>
      <button class="icon-btn" id="schedule-btn" title="Schedule a session">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
    </div>
    <div id="week-summary"></div>
    <div id="cal-nav" class="cal-nav"></div>
    <div id="cal-grid" class="cal-grid"></div>
    <div id="day-sheet"></div>
  `;const[a,i]=await Promise.all([te(),ie()]);async function r(){const o=new Date;o.setDate(o.getDate()-7);const l=new Date;l.setDate(l.getDate()+28),await ar(o.toISOString().slice(0,10),l.toISOString().slice(0,10)).catch(()=>{}),await Promise.all([Ir(i),Va(n,s,i)])}t.querySelector("#cal-nav").addEventListener("click",async o=>{o.target.closest("#prev-month")&&(s--,s<0&&(s=11,n--),await r()),o.target.closest("#next-month")&&(s++,s>11&&(s=0,n++),await r()),o.target.closest("#today-btn")&&(n=e.getFullYear(),s=e.getMonth(),await r())}),t.querySelector("#cal-grid").addEventListener("click",async o=>{const l=o.target.closest(".cal-day[data-date]");l&&await rs(l.dataset.date,i)}),t.querySelector("#schedule-btn").addEventListener("click",()=>{const o=_e(e);Ya(o,i,r)}),await r()}async function Ir(t,e){const n=document.getElementById("week-summary");if(!n)return;const s=new Date,a=new Date(s);a.setDate(s.getDate()-(s.getDay()+6)%7);const i=new Date(a);i.setDate(a.getDate()+6);const r=_e(a),o=_e(i),[l,d]=await Promise.all([Ke(r,o),ws(r,o)]),c=l.reduce((m,b)=>m+(b.durationMins||0),0),u=l.length,p=d.length,h=new Map;l.forEach(m=>{m.subjectId&&h.set(m.subjectId,(h.get(m.subjectId)||0)+(m.durationMins||0))});const v=Array(7).fill(0);l.forEach(m=>{const k=(new Date(m.startedAt).getDay()+6)%7;v[k]+=m.durationMins||0});const f=Math.max(...v,1),g=["M","T","W","T","F","S","S"],y=(s.getDay()+6)%7;n.innerHTML=`
    <div class="week-summary-card">
      <div class="week-summary-head">
        <span class="week-summary-title">This week</span>
        <span class="week-summary-stat">${dn(c)} · ${u} session${u!==1?"s":""}${p?` · ${p} planned`:""}</span>
      </div>
      <div class="week-bars">
        ${g.map((m,b)=>`
          <div class="week-bar-col">
            <div class="week-bar-wrap">
              <div class="week-bar-fill ${b===y?"week-bar-today":""}"
                style="height:${Math.round(v[b]/f*100)}%"></div>
            </div>
            <span class="week-bar-label ${b===y?"week-bar-label--today":""}">${m}</span>
          </div>
        `).join("")}
      </div>
      ${t.length?`
        <div class="week-subj-row">
          ${t.filter(m=>h.has(m.id)).map(m=>`
            <span class="week-subj-chip" style="background:${m.color}22;color:${m.color};border-color:${m.color}44">
              ${m.icon?m.icon+" ":""}${dn(h.get(m.id))}
            </span>
          `).join("")}
        </div>
      `:""}
    </div>
  `}async function Va(t,e,n,s){const a=document.getElementById("cal-nav"),i=document.getElementById("cal-grid");if(!a||!i)return;const r=new Date(t,e,1).toLocaleDateString("en-GB",{month:"long",year:"numeric"});a.innerHTML=`
    <button class="cal-nav-btn" id="prev-month">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <div class="cal-month-label">
      <span>${r}</span>
      <button class="cal-today-pill" id="today-btn">Today</button>
    </div>
    <button class="cal-nav-btn" id="next-month">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
  `;const o=new Date(t,e,1),l=new Date(t,e+1,0),d=_e(o),c=_e(l),[u,p,h]=await Promise.all([Ke(d,c),ws(d,c),S.tasks.where("dueDate").between(d,c,!0,!0).toArray()]),v=new Map,f=w=>(v.has(w)||v.set(w,{sessions:[],planned:[],tasks:[]}),v.get(w));u.forEach(w=>f(w.date).sessions.push(w)),p.forEach(w=>f(w.date).planned.push(w)),h.forEach(w=>{w.dueDate&&f(w.dueDate).tasks.push(w)});const g=(o.getDay()+6)%7,y=l.getDate(),m=new Date,b=_e(m);let _=`<div class="cal-dow-row">${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(w=>`<div class="cal-dow">${w}</div>`).join("")}</div><div class="cal-cells">`;for(let w=0;w<g;w++)_+='<div class="cal-day cal-day--empty"></div>';for(let w=1;w<=y;w++){const x=new Date(t,e,w),M=_e(x),$=v.get(M)||{sessions:[],planned:[],tasks:[]},T=M===b,L=x<m&&!T,H=x>m,K=[...new Set($.sessions.filter(W=>W.subjectId).map(W=>{const Z=n.find(U=>U.id===W.subjectId);return Z==null?void 0:Z.color}).filter(Boolean))].slice(0,3),C=$.sessions.reduce((W,Z)=>W+(Z.durationMins||0),0);_+=`
      <div class="cal-day ${T?"cal-day--today":""} ${L&&!$.sessions.length&&!$.planned.length?"cal-day--empty-past":""}"
        data-date="${M}">
        <span class="cal-day-num ${T?"cal-day-num--today":""}">${w}</span>
        ${C>0?`<span class="cal-day-mins">${dn(C)}</span>`:""}
        <div class="cal-day-dots">
          ${K.map(W=>`<span class="cal-dot" style="background:${W}"></span>`).join("")}
          ${$.planned.length&&H?'<span class="cal-dot cal-dot--planned"></span>':""}
          ${$.tasks.length?'<span class="cal-dot cal-dot--task"></span>':""}
        </div>
      </div>
    `}_+="</div>",i.innerHTML=_}async function rs(t,e,n){var h,v;const s=document.getElementById("day-sheet");if(!s)return;const a=new Date(t+"T00:00:00"),i=a.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"}),r=t===_e(new Date),o=a<new Date&&!r,[l,d,c]=await Promise.all([Ke(t,t),Xi(t),S.tasks.filter(f=>f.dueDate===t).toArray()]),u=l.reduce((f,g)=>f+(g.durationMins||0),0);function p(f,g=!1){const y=f.subjectId?e.find(k=>k.id===f.subjectId):null,m=(y==null?void 0:y.color)||"var(--accent)",b=g?f.startTime||"":new Date(f.startedAt).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});return`
      <div class="day-session-row ${g?"day-session-row--planned":""}" data-id="${f.id}" data-planned="${g}">
        <div class="day-session-bar" style="background:${m}"></div>
        <div class="day-session-body">
          <div class="day-session-head">
            <span class="day-session-subj" style="color:${m}">
              ${y?(y.icon?y.icon+" ":"")+y.name:"No subject"}
            </span>
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            ${g?'<span class="day-session-badge">planned</span>':'<span class="day-session-badge day-session-badge--done">done</span>'}
          </div>
          </div>
          <div class="day-session-meta">
            ${b?`<span>${b}</span>`:""}
            <span>${B(f.durationMins||0)}</span>
            ${!g&&f.qualityRating?`<span>${f.qualityRating}</span>`:""}
            ${f.notes?`<span class="day-session-note">${j(f.notes)}</span>`:""}
          </div>
        </div>
        ${g?`
          <button class="day-session-delete" data-id="${f.id}" title="Remove">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        `:""}
      </div>
    `}s.innerHTML=`
    <div class="day-sheet-inner" id="day-sheet-inner">
      <div class="day-sheet-handle"></div>
      <div class="day-sheet-header">
        <div>
          <p class="day-sheet-title">${i}</p>
          ${u>0?`<p class="day-sheet-sub">${dn(u)} focused</p>`:""}
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          ${o?"":'<button class="btn-accent" id="day-schedule-btn">+ Plan session</button>'}
          <button class="icon-btn" id="day-sheet-close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      ${l.length===0&&d.length===0&&c.length===0?`
        <p class="day-sheet-empty">${o?"No sessions recorded.":"Nothing planned yet."}</p>
      `:""}

      ${d.length>0?`
        <p class="day-sheet-section">Planned</p>
        ${d.map(f=>p(f,!0)).join("")}
      `:""}

      ${l.length>0?`
        <p class="day-sheet-section">Completed</p>
        ${l.map(f=>p(f,!1)).join("")}
      `:""}

      ${c.length>0?`
        <p class="day-sheet-section">Tasks due</p>
        ${c.map(f=>`
          <div class="day-task-row">
            <span class="day-task-check ${f.completedAt?"checked":""}">
              ${f.completedAt?"✓":""}
            </span>
            <span class="day-task-title ${f.completedAt?"task-title--done":""}">${j(f.title)}</span>
          </div>
        `).join("")}
      `:""}
    </div>
  `,requestAnimationFrame(()=>{var f;(f=s.querySelector("#day-sheet-inner"))==null||f.classList.add("day-sheet--open")}),(h=s.querySelector("#day-sheet-close"))==null||h.addEventListener("click",()=>{var f;(f=s.querySelector("#day-sheet-inner"))==null||f.classList.remove("day-sheet--open"),setTimeout(()=>{s.innerHTML=""},280)}),s.addEventListener("click",f=>{var g;f.target===s&&((g=s.querySelector("#day-sheet-inner"))==null||g.classList.remove("day-sheet--open"),setTimeout(()=>{s.innerHTML=""},280))}),s.querySelectorAll(".day-session-delete").forEach(f=>{f.addEventListener("click",async g=>{g.stopPropagation();const y=+f.dataset.id;if(await Zi(y),s.innerHTML="",await rs(t,e),document.getElementById("cal-grid")){const b=document.getElementById("cal-nav"),k=b?parseInt(b.dataset.month??new Date().getMonth()):new Date().getMonth(),_=b?parseInt(b.dataset.year??new Date().getFullYear()):new Date().getFullYear();await Va(_,k,e)}})}),(v=s.querySelector("#day-schedule-btn"))==null||v.addEventListener("click",()=>{var f;(f=s.querySelector("#day-sheet-inner"))==null||f.classList.remove("day-sheet--open"),setTimeout(()=>{s.innerHTML="",Ya(t,e,async()=>{const[g,y,m]=await Promise.all([te(),ie()]);await rs(t,y)})},280)})}function Ya(t,e,n){var l,d;const s=document.createElement("div");s.className="modal-overlay",s.innerHTML=`
    <div class="modal-card detail-modal">
      <div class="modal-drag-bar"></div>
      <div class="modal-header">
        <p style="font-size:15px;font-weight:500;color:var(--text-primary);margin:0">Plan a session</p>
        <button class="modal-close-btn" id="sched-close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">

        <label class="modal-field-label">Subject</label>
        <div class="seg-row" id="sched-subj-seg" style="flex-wrap:wrap;margin-bottom:14px">
          ${e.length===0?'<p style="font-size:12px;color:var(--text-muted)">No subjects yet — add them in Settings.</p>':e.map((c,u)=>`
                <button class="seg-btn ${u===0?"seg-ctx-active":""}" data-id="${c.id}" data-color="${c.color}"
                  style="${u===0?`background:${c.color}22;border-color:${c.color};color:${c.color}`:""}">
                  ${c.icon?c.icon+" ":""}${j(c.name)}
                </button>
              `).join("")}
        </div>

        <label class="modal-field-label">Link a task <span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--text-muted)">(optional)</span></label>
        <div id="sched-task-wrap" style="margin-bottom:14px">
          <select class="sort-select" id="sched-task-sel" style="width:100%;padding:8px;font-size:13px">
            <option value="">No task linked</option>
          </select>
        </div>

        <div class="modal-row-2">
          <div style="flex:1">
            <label class="modal-field-label">Date</label>
            <input type="date" class="time-input date-input" id="sched-date" value="${t}">
          </div>
          <div>
            <label class="modal-field-label">Start time</label>
            <input type="time" class="time-input" id="sched-time" value="09:00">
          </div>
        </div>

        <div style="margin-top:12px">
          <label class="modal-field-label">Duration</label>
          <div class="seg-row" id="sched-dur-seg">
            <button class="seg-btn" data-mins="25">25m</button>
            <button class="seg-btn seg-active" data-mins="50">50m</button>
            <button class="seg-btn" data-mins="90">90m</button>
            <button class="seg-btn" data-mins="120">2h</button>
          </div>
        </div>

        <div style="margin-top:12px">
          <label class="modal-field-label">Notes <span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--text-muted)">(optional)</span></label>
          <textarea class="detail-notes" id="sched-notes" rows="2" placeholder="What do you plan to cover?"></textarea>
        </div>

      </div>
      <div class="modal-footer">
        <button class="btn-ghost" id="sched-cancel">Cancel</button>
        <button class="btn-primary" id="sched-save">Save plan</button>
      </div>
    </div>
  `,document.body.appendChild(s),requestAnimationFrame(()=>s.querySelector(".detail-modal").classList.add("modal-open"));let a=((l=e[0])==null?void 0:l.id)||null,i=50;async function r(c){const u=s.querySelector("#sched-task-sel");if(!u)return;const p=await S.tasks.filter(v=>!v.completedAt&&(!c||v.subjectId===c||!v.subjectId)).toArray(),h=u.value;u.innerHTML='<option value="">No task linked</option>'+p.map(v=>`<option value="${v.id}" ${v.id==h?"selected":""}>${j(v.title)}</option>`).join("")}e.length&&r((d=e[0])==null?void 0:d.id),s.querySelectorAll("#sched-subj-seg .seg-btn").forEach(c=>{c.addEventListener("click",()=>{s.querySelectorAll("#sched-subj-seg .seg-btn").forEach(p=>{p.classList.remove("seg-ctx-active"),p.style.cssText=""}),c.classList.add("seg-ctx-active");const u=c.dataset.color;c.style.background=u+"22",c.style.borderColor=u,c.style.color=u,a=+c.dataset.id,r(a)})}),s.querySelectorAll("#sched-dur-seg .seg-btn").forEach(c=>{c.addEventListener("click",()=>{s.querySelectorAll("#sched-dur-seg .seg-btn").forEach(u=>u.classList.remove("seg-active")),c.classList.add("seg-active"),i=+c.dataset.mins})});const o=()=>{s.querySelector(".detail-modal").classList.remove("modal-open"),setTimeout(()=>s.remove(),250)};s.querySelector("#sched-close").addEventListener("click",o),s.querySelector("#sched-cancel").addEventListener("click",o),s.addEventListener("click",c=>{c.target===s&&o()}),s.querySelector("#sched-save").addEventListener("click",async()=>{var v;if(!a){o();return}const c=s.querySelector("#sched-date").value,u=s.querySelector("#sched-time").value,p=s.querySelector("#sched-notes").value.trim();if(!c)return;const h=(v=s.querySelector("#sched-task-sel"))==null?void 0:v.value;await Da({subjectId:a,taskId:h?+h:null,date:c,startTime:u,durationMins:i,notes:p}),o(),n&&await n()})}function _e(t){return t.toISOString().slice(0,10)}function dn(t){if(t<60)return`${t}m`;const e=Math.floor(t/60),n=t%60;return n?`${e}h ${n}m`:`${e}h`}let jt=[];async function Lr(t){const[e,n]=await Promise.all([te(),ie()]);t.innerHTML=`
    <div class="view-header">
      <div>
        <h1 class="view-title">Insights</h1>
        <p class="view-sub" id="period-label"></p>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <button class="btn-accent" id="open-review">Review</button>
        <div class="seg-row" style="margin:0;gap:4px">
          <button class="seg-btn seg-active" id="btn-week" data-view="week">Week</button>
          <button class="seg-btn"            id="btn-day"  data-view="day">Day</button>
        </div>
      </div>
    </div>
    <div id="insights-body"></div>
  `;let s="week";async function a(){Ur(),t.querySelector("#btn-week").classList.toggle("seg-active",s==="week"),t.querySelector("#btn-day").classList.toggle("seg-active",s==="day"),s==="week"?await jr(e,n):await Tr(e,n)}t.querySelector("#btn-week").addEventListener("click",()=>{s="week",a()}),t.querySelector("#btn-day").addEventListener("click",()=>{s="day",a()}),t.querySelector("#open-review").addEventListener("click",()=>{re(()=>Promise.resolve().then(()=>vn),void 0).then(i=>i.navigateTo("review"))}),a()}async function jr(t,e){const{fromStr:n,toStr:s,monday:a,prevFromStr:i,prevToStr:r}=zr();document.getElementById("period-label").textContent="Week of "+a.toLocaleDateString("en-GB",{day:"numeric",month:"short"});const[o,l,d,c]=await Promise.all([Ke(n,s),Ke(i,r),Aa(t.activeDays,t.dailyGoalHours*60,t.streakFreezeEnabled?t.streakGraceDays??1:0),S.focus_sessions.toArray()]),u=o.reduce((A,O)=>A+(O.durationMins||0),0),p=l.reduce((A,O)=>A+(O.durationMins||0),0),h=o.filter(A=>A.durationMins>0).map(A=>Math.max(0,100-Math.round((A.distractions||0)/A.durationMins*100*.5))),v=h.length?Math.round(h.reduce((A,O)=>A+O,0)/h.length):null,f=l.filter(A=>A.durationMins>0).map(A=>Math.max(0,100-Math.round((A.distractions||0)/A.durationMins*100*.5))),g=f.length?Math.round(f.reduce((A,O)=>A+O,0)/f.length):null,y=c.length?c.reduce((A,O)=>(O.durationMins||0)>(A.durationMins||0)?O:A,c[0]):null,m=y&&o.some(A=>A.id===y.id),b=p>0?Math.round((u-p)/p*100):null,k=l.length>0?o.length-l.length:null,_=Array(24).fill(0);o.forEach(A=>{_[new Date(A.startedAt).getHours()]+=A.durationMins||0});const w=_.indexOf(Math.max(..._.slice(6,22))),x=_[w]>0?Dt(w):"—",M=Array(24).fill(0);l.forEach(A=>{M[new Date(A.startedAt).getHours()]+=A.durationMins||0});const $=M.indexOf(Math.max(...M.slice(6,22))),T=Array(7).fill(0);o.forEach(A=>{const O=(new Date(A.startedAt).getDay()+6)%7;T[O]+=A.durationMins||0});const L=new Map;o.forEach(A=>{A.subjectId&&L.set(A.subjectId,(L.get(A.subjectId)||0)+(A.durationMins||0))});const H=new Map;l.forEach(A=>{A.subjectId&&H.set(A.subjectId,(H.get(A.subjectId)||0)+(A.durationMins||0))});const K={};o.forEach(A=>{const O=A.context||"other";K[O]=(K[O]||0)+(A.durationMins||0)});const C=Math.max(1,Object.values(K).reduce((A,O)=>A+O,0)),W=t.streakFreezeEnabled?t.streakGraceDays??1:0,Z=await Promise.all(e.map(async A=>{const{current:O,best:at}=await bs(A.id,A.dailyGoalMins,t.activeDays,W);return{...A,current:O,best:at}})),U=document.getElementById("insights-body");U.innerHTML=`

    <div class="metric-grid">
      ${Ee("Focus hours",Be(u),b!==null?b>0?`↑ ${b}% from last week`:b<0?`↓ ${Math.abs(b)}% from last week`:"Same as last week":p===0?"No data last week":"",b!==null&&b>0?"positive":b!==null&&b<0?"negative":"")}
      ${Ee("Sessions",o.length,k!==null?k>0?`${k} more than last week`:k<0?`${Math.abs(k)} fewer than last week`:"Same as last week":"",k>0?"positive":k<0?"negative":"")}
      ${Ee("Focus rate",v!==null?v+"%":"—",v!==null&&g!==null?v>g?`↑ up from ${g}% last week`:v<g?`↓ down from ${g}% last week`:"Same as last week":v!==null?"Based on distractions logged":"Log sessions to see",v!==null&&g!==null&&v>g?"positive":"")}
      ${Ee("Streak",d+" day"+(d!==1?"s":""),d>=7?"🔥 On fire — keep going":d>=3?"Building momentum":d===0?"Start a session to begin":d+" day"+(d!==1?"s":"")+" in a row",d>=3?"positive":"")}
    </div>

    ${m?`
      <div class="comment-card comment-card--highlight">
        <span class="comment-card-icon">🏆</span>
        <div>
          <p class="comment-card-title">Personal best this week</p>
          <p class="comment-card-body">Your longest session ever — ${B(y.durationMins)} — was logged this week.</p>
        </div>
      </div>
    `:y?`
      <div class="comment-card">
        <span class="comment-card-icon">🏅</span>
        <div>
          <p class="comment-card-title">Personal best session</p>
          <p class="comment-card-body">${B(y.durationMins)} on ${new Date(y.startedAt).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}. Beat it!</p>
        </div>
      </div>
    `:""}

    <div class="card">
      <p class="stage-label">Daily focus — hours</p>
      <div style="position:relative;height:140px">
        <canvas id="daily-chart"></canvas>
      </div>
    </div>

    ${e.length>0?`
      <div class="card">
        <p class="stage-label">Goal breakdown by subject</p>
        <div id="subj-bars"></div>
      </div>

      <div class="card">
        <p class="stage-label">Subject streaks</p>
        <div id="streak-panel"></div>
      </div>
    `:""}

    <div class="two-col-grid">
      <div class="card" style="margin-bottom:0">
        <p class="stage-label">By context</p>
        <div id="goal-bars"></div>
      </div>
      <div class="card" style="margin-bottom:0">
        <p class="stage-label">Quality</p>
        <div style="position:relative;height:120px">
          <canvas id="quality-chart"></canvas>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:12px">
      <p class="stage-label">Peak focus hours</p>
      <p class="metric-helper" style="margin-bottom:8px">
        ${_[w]>0?`Most productive at ${x}${$&&$!==w?` — shifted from ${Dt($)} last week`:""}`:"No sessions yet this week"}
      </p>
      <div class="heatmap" id="heatmap"></div>
      <div class="heatmap-labels">
        <span>6am</span><span>9am</span><span>12pm</span><span>3pm</span><span>6pm</span><span>9pm</span>
      </div>
    </div>

    <div class="card" id="ai-insights-card">
      <p class="stage-label" style="margin-bottom:10px">AI observations</p>
      <div id="ai-chips">
        ${o.length===0?'<p class="empty-hint">Complete sessions to see AI insights.</p>':'<div class="ai-loading"><div class="ai-spinner"></div><span>Analysing your week…</span></div>'}
      </div>
    </div>

    ${o.length===0?`
      <div class="empty-state" style="margin-top:20px">
        <div class="empty-icon">📊</div>
        <p class="empty-title">No sessions yet this week</p>
        <p class="empty-hint">Head to Focus to log your first session.</p>
      </div>
    `:""}
  `,o.length>0&&(Pr(T,t),Or(o),Rr(_),Nr(K,C,t.contexts),e.length>0&&(Cr(e,L,H,u),qr(Z)),Gr(o,u,d,t))}async function Tr(t,e){const n=F(),s=new Date;s.setDate(s.getDate()-1);const a=s.toISOString().slice(0,10),[i,r]=await Promise.all([_t(n),_t(a)]),o=i.reduce((y,m)=>y+(m.durationMins||0),0),l=r.reduce((y,m)=>y+(m.durationMins||0),0),d=i.reduce((y,m)=>y+(m.distractions||0),0),c=t.dailyGoalHours*60,u=Math.min(100,Math.round(o/c*100)),p=i.filter(y=>y.durationMins>0).map(y=>Math.max(0,100-Math.round((y.distractions||0)/y.durationMins*100*.5))),h=p.length?Math.round(p.reduce((y,m)=>y+m,0)/p.length):null,v=Array(24).fill(0);i.forEach(y=>{v[new Date(y.startedAt).getHours()]+=y.durationMins||0}),v.indexOf(Math.max(...v));const f=new Map;i.forEach(y=>{y.subjectId&&f.set(y.subjectId,(f.get(y.subjectId)||0)+(y.durationMins||0))}),document.getElementById("period-label").textContent=new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"});const g=document.getElementById("insights-body");g.innerHTML=`
    <div class="metric-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">
      ${Ee("Focus today",Be(o),l>0?o>l?`↑ More than yesterday's ${Be(l)}`:o<l?`↓ Less than yesterday's ${Be(l)}`:"Same as yesterday":`Goal: ${t.dailyGoalHours}h`,o>=c?"positive":"")}
      ${Ee("Sessions",i.length,i.length===0?"Start your first session":i.length===1?"First session done":`Avg ${B(Math.round(o/i.length))} each`,"")}
      ${Ee("Focus rate",h!==null?h+"%":"—",h===null?"Log sessions to see":h>=90?"Excellent — near zero distractions":h>=70?"Good — minimal interruptions":"Could improve — log distractions",h!==null&&h>=70?"positive":h!==null&&h<50?"negative":"")}
      ${Ee("Distractions",d,d===0?"None logged — great focus":d<=2?"Low — well controlled":d<=5?"Moderate — keep an eye on it":"High — try logging triggers",d===0?"positive":d>5?"negative":"")}
    </div>

    <div class="card">
      <div class="dp-row" style="margin-bottom:6px">
        <span class="dp-label">Daily goal progress</span>
        <span class="dp-val" style="font-size:14px">${u}%</span>
      </div>
      <div class="dp-bar-bg">
        <div class="dp-bar-fg" style="width:${u}%"></div>
      </div>
      <p class="metric-helper" style="margin-top:6px">
        ${u>=100?"Goal reached 🎉 — anything extra is a bonus":u>=50?`${B(c-o)} to go — you're over halfway`:`${B(c-o)} remaining to hit ${t.dailyGoalHours}h`}
      </p>
    </div>

    ${e.length>0&&f.size>0?`
      <div class="card">
        <p class="stage-label">Subject progress today</p>
        <div id="today-subj-bars"></div>
      </div>
    `:""}

    <div class="card">
      <p class="stage-label">Sessions timeline</p>
      ${i.length===0?'<p class="empty-hint" style="padding:8px 0">No sessions yet today.</p>':`<div style="position:relative;height:${Math.max(80,i.length*48)}px">
             <canvas id="timeline-chart"></canvas>
           </div>`}
    </div>

    <div class="two-col-grid">
      <div class="card" style="margin-bottom:0">
        <p class="stage-label">By context</p>
        <div id="day-goal-bars"></div>
      </div>
      <div class="card" style="margin-bottom:0">
        <p class="stage-label">Distraction log</p>
        <div id="distract-log"></div>
      </div>
    </div>
  `,i.length>0&&(Fr(i,e),Kr(i,t.contexts),Hr(i)),e.length>0&&f.size>0&&Br(e,f)}function Pr(t,e){const n=document.getElementById("daily-chart");if(!n)return;const s=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],a=e.dailyGoalHours,i=t.map((o,l)=>o/60>=a?"#1D9E75":o>0?"#7F77DD":"rgba(127,119,221,0.15)"),r=new Chart(n,{type:"bar",data:{labels:s,datasets:[{data:t.map(o=>+(o/60).toFixed(2)),backgroundColor:i,borderRadius:5,borderSkipped:!1},{type:"line",data:Array(7).fill(a),borderColor:"rgba(127,119,221,0.35)",borderDash:[4,4],borderWidth:1,pointRadius:0,fill:!1}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{callbacks:{label:o=>o.datasetIndex===0?B(Math.round(o.parsed.y*60)):"Goal: "+o.parsed.y+"h"}}},scales:{x:{grid:{display:!1},ticks:{color:"#5e5a72",font:{size:11}}},y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#5e5a72",font:{size:11},callback:o=>o+"h"},beginAtZero:!0}}}});jt.push(r)}function Cr(t,e,n,s){const a=document.getElementById("subj-bars");if(!a)return;const i=Math.max(1,s),r=t.filter(o=>e.has(o.id)).sort((o,l)=>(e.get(l.id)||0)-(e.get(o.id)||0));if(r.length===0){a.innerHTML='<p class="empty-hint">No subject sessions this week.</p>';return}a.innerHTML=r.map(o=>{const l=e.get(o.id)||0,d=n.get(o.id)||0,c=Math.round(l/i*100);Math.min(100,Math.round(l/(o.dailyGoalMins*5)*100));const u=d>0?Math.round((l-d)/d*100):null;return`
      <div style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
          <span style="font-size:12px;font-weight:500;color:var(--text-primary)">
            ${o.icon?o.icon+" ":""}${j(o.name)}
          </span>
          <span style="font-size:12px;font-weight:600;color:${o.color}">${B(l)}</span>
        </div>
        <div class="dp-bar-bg">
          <div class="dp-bar-fg" style="width:${c}%;background:${o.color}"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:3px">
          <span class="metric-helper">${c}% of total focus time</span>
          <span class="metric-helper ${u!==null&&u>0?"metric-helper--pos":u!==null&&u<0?"metric-helper--neg":""}">
            ${u!==null?u>0?`↑ ${u}% vs last week`:u<0?`↓ ${Math.abs(u)}% vs last week`:"same as last week":`goal: ${B(o.dailyGoalMins)}/day`}
          </span>
        </div>
      </div>
    `}).join("")}function qr(t){const e=document.getElementById("streak-panel");if(!e)return;const n=t.filter(s=>s.current>0||s.best>0);if(n.length===0){e.innerHTML='<p class="empty-hint">Hit your daily goal for a subject to start a streak.</p>';return}e.innerHTML=n.map(s=>`
    <div class="streak-row">
      <span class="streak-icon" style="color:${s.color}">${s.icon||"📚"}</span>
      <div class="streak-body">
        <span class="streak-name">${j(s.name)}</span>
        <span class="streak-helper">${s.current>0?`${s.current} day streak`:"No active streak"} · best: ${s.best} day${s.best!==1?"s":""}</span>
      </div>
      <div class="streak-nums">
        ${s.current>0?`<span class="streak-fire">🔥 ${s.current}</span>`:'<span class="streak-fire" style="opacity:.3">—</span>'}
      </div>
    </div>
  `).join("")}function Br(t,e){const n=document.getElementById("today-subj-bars");n&&(n.innerHTML=t.filter(s=>e.has(s.id)).map(s=>{const a=e.get(s.id)||0,i=Math.min(100,Math.round(a/s.dailyGoalMins*100));return`
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:12px;font-weight:500;color:var(--text-primary)">${s.icon?s.icon+" ":""}${j(s.name)}</span>
          <span style="font-size:12px;color:${s.color};font-weight:500">${B(a)} / ${B(s.dailyGoalMins)}</span>
        </div>
        <div class="dp-bar-bg">
          <div class="dp-bar-fg" style="width:${i}%;background:${s.color}"></div>
        </div>
        <p class="metric-helper" style="margin-top:3px">
          ${i>=100?"Goal reached ✓":`${B(s.dailyGoalMins-a)} to go`}
        </p>
      </div>
    `}).join(""))}function Or(t){const e=document.getElementById("quality-chart");if(!e)return;const n={Deep:0,Good:0,Patchy:0};if(t.forEach(r=>{r.qualityRating&&n[r.qualityRating]++}),Object.values(n).reduce((r,o)=>r+o,0)===0){e.parentElement.innerHTML='<p class="empty-hint" style="padding:16px 0;font-size:11px">Rate sessions to see quality data.</p>';return}const a=new Chart(e,{type:"doughnut",data:{labels:["Deep","Good","Patchy"],datasets:[{data:[n.Deep,n.Good,n.Patchy],backgroundColor:["#1D9E75","#7F77DD","#D85A30"],borderWidth:0,hoverOffset:4}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"68%",plugins:{legend:{display:!1},tooltip:{callbacks:{label:r=>`${r.label}: ${r.parsed}`}}}}});jt.push(a);const i=document.createElement("div");i.className="quality-legend",i.innerHTML=[["Deep","#1D9E75",n.Deep],["Good","#7F77DD",n.Good],["Patchy","#D85A30",n.Patchy]].filter(([,,r])=>r>0).map(([r,o,l])=>`<span class="q-leg-item"><span style="width:8px;height:8px;border-radius:2px;background:${o};display:inline-block"></span> ${r} <strong>${l}</strong></span>`).join(""),e.parentElement.appendChild(i)}function Rr(t){const e=document.getElementById("heatmap");if(!e)return;const n=Math.max(...t.slice(6,22),1);for(let s=6;s<=21;s++){const a=t[s],i=a===0?.07:.14+a/n*.82,r=Math.max(8,Math.round(a/n*60)+8),o=document.createElement("div");o.className="heat-cell",o.style.cssText=`height:${r}px;opacity:${i.toFixed(2)};background:var(--accent)`,o.title=`${Dt(s)} — ${B(Math.round(a))}`,e.appendChild(o)}}function Nr(t,e,n){const s=document.getElementById("goal-bars");if(s){if(Object.keys(t).length===0){s.innerHTML='<p class="empty-hint">No sessions yet.</p>';return}s.innerHTML=Object.entries(t).sort((a,i)=>i[1]-a[1]).map(([a,i])=>{const r=n.find(c=>c.id===a),o=(r==null?void 0:r.color)||"#888780",l=(r==null?void 0:r.label)||a,d=Math.round(i/e*100);return`
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:11px;color:var(--text-secondary)">${l}</span>
          <span style="font-size:11px;font-weight:500;color:var(--text-primary)">${B(i)} <span style="color:var(--text-muted);font-weight:400">(${d}%)</span></span>
        </div>
        <div class="progress-bg"><div class="progress-fg" style="width:${d}%;background:${o}"></div></div>
      </div>`}).join("")}}function Fr(t,e){const n=document.getElementById("timeline-chart");if(!n)return;const s=t.map(o=>new Date(o.startedAt).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})),a=t.map(o=>o.durationMins||0),i=t.map(o=>{if(o.subjectId){const l=e==null?void 0:e.find(d=>d.id===o.subjectId);if(l)return l.color}return o.qualityRating==="Deep"?"#1D9E75":o.qualityRating==="Patchy"?"#D85A30":"#7F77DD"}),r=new Chart(n,{type:"bar",indexAxis:"y",data:{labels:s,datasets:[{data:a,backgroundColor:i,borderRadius:4,borderSkipped:!1}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{callbacks:{label:o=>B(o.parsed.x)}}},scales:{x:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#5e5a72",font:{size:11},callback:o=>o+"m"},beginAtZero:!0},y:{grid:{display:!1},ticks:{color:"#5e5a72",font:{size:11}}}}}});jt.push(r)}function Kr(t,e){const n=document.getElementById("day-goal-bars");if(!n)return;const s={};t.forEach(i=>{s[i.context]=(s[i.context]||0)+(i.durationMins||0)});const a=Math.max(1,Object.values(s).reduce((i,r)=>i+r,0));n.innerHTML=Object.entries(s).map(([i,r])=>{const o=e.find(d=>d.id===i),l=Math.round(r/a*100);return`
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:11px;color:var(--text-secondary)">${(o==null?void 0:o.label)||i}</span>
          <span style="font-size:11px;font-weight:500;color:var(--text-primary)">${l}%</span>
        </div>
        <div class="progress-bg"><div class="progress-fg" style="width:${l}%;background:${(o==null?void 0:o.color)||"#888780"}"></div></div>
      </div>`}).join("")||'<p class="empty-hint">No sessions.</p>'}function Hr(t){const e=document.getElementById("distract-log");if(!e)return;const n={};t.forEach(a=>{(a.distractionLog||[]).forEach(i=>{n[i.type]=(n[i.type]||0)+1})});const s=Object.entries(n).sort((a,i)=>i[1]-a[1]);if(s.length===0){e.innerHTML='<p class="empty-hint" style="font-size:11px">No distractions logged.</p>';return}e.innerHTML=s.map(([a,i])=>`
    <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:0.5px solid var(--border)">
      <span style="font-size:12px;color:var(--text-secondary)">${a}</span>
      <span style="font-size:12px;font-weight:500;color:var(--text-primary)">${i}×</span>
    </div>
  `).join("")}async function Gr(t,e,n,s){const a=document.getElementById("ai-chips");if(!a)return;if(!s.aiApiKey||!s.aiWeeklyReview){a.innerHTML='<p class="empty-hint">Add a Gemini API key in Settings → AI to enable weekly insights.</p>';return}const i=await Mt(Ra(t,e,n),s.aiApiKey);if(!i){a.innerHTML='<p class="empty-hint">Could not load AI insights. Check your API key.</p>';return}let r=[];try{const o=i.replace(/```json|```/g,"").trim();r=JSON.parse(o),Array.isArray(r)||(r=[i])}catch{r=[i]}a.innerHTML=r.map(o=>`
    <div class="insight-chip">
      <span class="insight-dot"></span>${j(typeof o=="string"?o:JSON.stringify(o))}
    </div>
  `).join("")}function zr(){const t=new Date,e=new Date(t);e.setDate(t.getDate()-(t.getDay()+6)%7);const n=new Date(e);n.setDate(e.getDate()-7);const s=new Date(e);return s.setDate(e.getDate()-1),{fromStr:e.toISOString().slice(0,10),toStr:t.toISOString().slice(0,10),prevFromStr:n.toISOString().slice(0,10),prevToStr:s.toISOString().slice(0,10),monday:e}}function Ee(t,e,n="",s=""){return`
    <div class="metric-card">
      <p class="metric-label">${t}</p>
      <p class="metric-value">${e}</p>
      ${n?`<p class="metric-helper ${s==="positive"?"metric-helper--pos":s==="negative"?"metric-helper--neg":""}">${n}</p>`:""}
    </div>`}function Ur(){jt.forEach(t=>{try{t.destroy()}catch{}}),jt=[]}async function Wr(t){const e=await te();let n=structuredClone(e),s="session";t.innerHTML=`
    <div class="view-header">
      <h1 class="view-title">Settings</h1>
      <button class="btn-save" id="save-btn">Save</button>
    </div>
    <div class="settings-layout">
      <nav class="settings-nav" id="settings-nav">
        ${Le("session","Session",ao())}
        ${Le("subjects","Subjects",io())}
        ${Le("recurring","Recurring",uo())}
        ${Le("contexts","Contexts",ro())}
        ${Le("alerts","Alerts",oo())}
        ${Le("sync","Sync",lo())}
        ${Le("ai","AI",co())}
      </nav>
      <div class="settings-content" id="settings-content"></div>
    </div>
  `;async function a(){var o;const i=t.querySelector("#settings-content"),r={session:Vr,subjects:Jr,recurring:no,contexts:Xr,alerts:Zr,sync:eo,ai:to};await((o=r[s])==null?void 0:o.call(r,i,n))}t.querySelector("#settings-nav").addEventListener("click",async i=>{const r=i.target.closest(".settings-nav-item");r&&(t.querySelectorAll(".settings-nav-item").forEach(o=>o.classList.remove("active")),r.classList.add("active"),s=r.dataset.panel,await a())}),t.querySelector("#save-btn").addEventListener("click",async()=>{await Vi(n);const i=t.querySelector("#save-btn");i.textContent="Saved ✓",i.style.background="var(--teal)",setTimeout(()=>{i.textContent="Save",i.style.background=""},2e3)}),await a()}function Vr(t,e){var n;t.innerHTML=`
    <div class="settings-section">
      <p class="settings-section-title">Pomodoro timer</p>
      <div class="card">
        ${rt("Default session","defaultDuration",e.defaultDuration,"min",25,120,5)}
        ${rt("Short break","breakLength",e.breakLength,"min",5,30,5)}
        ${rt("Long break after","longBreakAfter",e.longBreakAfter,"sessions",2,8,1)}
        ${rt("Long break length","longBreakLength",e.longBreakLength,"min",15,60,5)}
      </div>
    </div>

    <div class="settings-section">
      <p class="settings-section-title">Behaviour</p>
      <div class="card">
        ${J("Show countdown ring","showCountdownRing",e.showCountdownRing,"SVG ring around the timer")}
        ${J("Auto-start break","autoStartBreak",e.autoStartBreak,"Break starts immediately after session")}
        ${J("Auto-start next session","autoStartNextSession",e.autoStartNextSession,"Skip setup between sessions")}
      </div>
    </div>

    <div class="settings-section">
      <p class="settings-section-title">Daily target</p>
      <div class="card">
        ${rt("Daily focus goal","dailyGoalHours",e.dailyGoalHours,"hours",1,16,.5)}
        <div class="setting-row">
          <div><p class="setting-label">Active days</p><p class="setting-hint">Counts toward streak</p></div>
          <div class="day-grid" id="day-grid">
            ${["S","M","T","W","T","F","S"].map((s,a)=>`
              <button class="day-btn ${e.activeDays.includes(a)?"active":""}"
                data-day="${a}">${s}</button>
            `).join("")}
          </div>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <p class="settings-section-title">Appearance</p>
      <div class="card">
        <div class="setting-row">
          <div><p class="setting-label">Theme</p><p class="setting-hint">Changes app colour scheme</p></div>
          <div class="seg-row" id="theme-seg" style="margin:0;gap:6px">
            ${["dark","light","system"].map(s=>`
              <button class="seg-btn ${(e.theme||"dark")===s?"seg-active":""}"
                data-theme="${s}">${s.charAt(0).toUpperCase()+s.slice(1)}</button>
            `).join("")}
          </div>
        </div>
        <div class="setting-row" style="border-top:0.5px solid var(--border)">
          <p class="setting-label">Accent colour</p>
          <div class="accent-swatches" id="accent-swatches">
            ${["#7F77DD","#1D9E75","#D85A30","#D4537E","#378ADD","#BA7517"].map(s=>`
              <button class="accent-swatch ${e.accentColor===s?"selected":""}"
                data-color="${s}" style="background:${s}"></button>
            `).join("")}
          </div>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <p class="settings-section-title">Streak protection</p>
      <div class="card">
        ${J("Streak freeze","streakFreezeEnabled",e.streakFreezeEnabled,"Allow a grace period before your streak resets")}
        <div class="setting-row ${e.streakFreezeEnabled?"":"setting-row--disabled"}" id="grace-row">
          <div><p class="setting-label">Grace days</p><p class="setting-hint">Missed active days before streak breaks</p></div>
          <div style="display:flex;align-items:center;gap:6px">
            <input type="number" class="num-input" data-field="streakGraceDays"
              value="${e.streakGraceDays??1}" min="1" max="3" step="1"
              ${e.streakFreezeEnabled?"":"disabled"}>
            <span class="field-unit">day${(e.streakGraceDays??1)!==1?"s":""}</span>
          </div>
        </div>
      </div>
    </div>
  `,gn(t,e),t.querySelector("#day-grid").addEventListener("click",s=>{const a=s.target.closest(".day-btn");if(!a)return;const i=+a.dataset.day;e.activeDays.includes(i)?e.activeDays=e.activeDays.filter(r=>r!==i):e.activeDays=[...e.activeDays,i].sort((r,o)=>r-o),a.classList.toggle("active",e.activeDays.includes(i))}),(n=t.querySelector('[data-field="streakFreezeEnabled"]'))==null||n.addEventListener("change",s=>{const a=t.querySelector("#grace-row"),i=t.querySelector('[data-field="streakGraceDays"]');a&&a.classList.toggle("setting-row--disabled",!s.target.checked),i&&(i.disabled=!s.target.checked)}),t.querySelector("#theme-seg").addEventListener("click",s=>{const a=s.target.closest(".seg-btn");a&&(e.theme=a.dataset.theme,t.querySelectorAll("#theme-seg .seg-btn").forEach(i=>i.classList.remove("seg-active")),a.classList.add("seg-active"),Ja(e.theme))}),t.querySelector("#accent-swatches").addEventListener("click",s=>{const a=s.target.closest(".accent-swatch");a&&(e.accentColor=a.dataset.color,t.querySelectorAll(".accent-swatch").forEach(i=>i.classList.remove("selected")),a.classList.add("selected"),document.documentElement.style.setProperty("--accent",e.accentColor))})}const Yr=["📚","∑","⚙","⚡","🗺","🔬","🧮","📐","🌍","📊","🧪","💡","🏗","📝","🎯","⚖","🔭","🖥"];async function Jr(t,e){async function n(){const a=await ie();t.innerHTML=`
      <div class="settings-section">
        <p class="settings-section-title">Study subjects</p>
        <p class="settings-hint-text">Subjects drive the focus timer, daily goals, and streaks. Tasks can optionally be linked to a subject.</p>
        <div class="card" id="subj-card">
          ${a.length===0?'<p class="settings-hint-text" style="padding:12px 0">No subjects yet — add one below.</p>':""}
          ${a.map(i=>`
            <div class="subj-row" data-id="${i.id}">
              <button class="subj-icon-btn" data-id="${i.id}" style="background:${i.color}22;color:${i.color};border:1px solid ${i.color}44">
                ${j(i.icon||"📚")}
              </button>
              <div class="subj-row-body">
                <input class="subj-name-input" value="${j(i.name)}" data-id="${i.id}" maxlength="40" placeholder="Subject name">
                <div class="subj-row-meta">
                  <input type="color" class="subj-color-input ctx-color-input" value="${i.color}" data-id="${i.id}" title="Colour">
                  <span class="subj-goal-label">Goal:</span>
                  <input type="number" class="subj-goal-input num-input" value="${i.dailyGoalMins}" min="5" max="480" step="5" data-id="${i.id}">
                  <span class="subj-goal-unit">min/day</span>
                </div>
              </div>
              <button class="ctx-remove-btn subj-delete-btn" data-id="${i.id}" title="Delete subject">×</button>
            </div>
          `).join("")}
        </div>
        <button class="btn-ghost full-width-ghost" id="add-subj">+ Add subject</button>
      </div>
    `,s(),t.querySelector("#add-subj").addEventListener("click",async()=>{await Yi({name:"New subject",color:"#7F77DD",icon:"📚",dailyGoalMins:60}),await n()})}function s(){t.querySelectorAll(".subj-name-input").forEach(a=>{a.addEventListener("input",async i=>{await Qt(+i.target.dataset.id,{name:i.target.value})})}),t.querySelectorAll(".subj-color-input").forEach(a=>{a.addEventListener("input",async i=>{const r=+i.target.dataset.id;await Qt(r,{color:i.target.value});const o=t.querySelector(`.subj-row[data-id="${r}"]`),l=o==null?void 0:o.querySelector(".subj-icon-btn");l&&(l.style.background=i.target.value+"22",l.style.color=i.target.value,l.style.border=`1px solid ${i.target.value}44`)})}),t.querySelectorAll(".subj-goal-input").forEach(a=>{a.addEventListener("input",async i=>{await Qt(+i.target.dataset.id,{dailyGoalMins:+i.target.value})})}),t.querySelectorAll(".subj-icon-btn").forEach(a=>{a.addEventListener("click",i=>{const r=+a.dataset.id;Qr(t,r,a)})}),t.querySelectorAll(".subj-delete-btn").forEach(a=>{a.addEventListener("click",async i=>{const r=+a.dataset.id;confirm("Delete this subject? Sessions already logged will keep their data.")&&(await Ji(r),await n())})})}await n()}function Qr(t,e,n,s){var r;(r=t.querySelector(".icon-picker"))==null||r.remove();const a=document.createElement("div");a.className="icon-picker",a.innerHTML=Yr.map(o=>`
    <button class="icon-picker-btn" data-icon="${o}">${o}</button>
  `).join("");const i=n.getBoundingClientRect();a.style.position="fixed",a.style.top=i.bottom+6+"px",a.style.left=i.left+"px",a.style.zIndex="500",document.body.appendChild(a),a.addEventListener("click",async o=>{const l=o.target.closest(".icon-picker-btn");l&&(await Qt(e,{icon:l.dataset.icon}),n.textContent=l.dataset.icon,a.remove())}),setTimeout(()=>{document.addEventListener("click",function o(l){!a.contains(l.target)&&l.target!==n&&(a.remove(),document.removeEventListener("click",o))})},50)}function Xr(t,e){function n(){t.innerHTML=`
      <div class="settings-section">
        <p class="settings-section-title">Task contexts</p>
        <p class="settings-hint-text">Contexts colour-code tasks in the Inbox. Mark a context as "Study" to enable the subject picker on tasks with that context.</p>
        <div class="card" id="ctx-card">
          ${e.contexts.map((a,i)=>`
            <div class="ctx-edit-row" data-i="${i}">
              <input class="ctx-color-input" type="color" value="${a.color}" data-i="${i}" title="Colour">
              <input class="ctx-label-input" value="${j(a.label)}" data-i="${i}" maxlength="20" placeholder="Label">
              <label class="ctx-study-toggle" title="Study context — shows subject picker on tasks">
                <input type="checkbox" class="ctx-is-study" data-i="${i}" ${a.isStudy?"checked":""}>
                <span class="ctx-study-label">Study</span>
              </label>
              <button class="ctx-remove-btn" data-i="${i}">×</button>
            </div>
          `).join("")}
        </div>
        <button class="btn-ghost full-width-ghost" id="add-ctx">+ Add context</button>
      </div>
    `,s(),t.querySelector("#add-ctx").addEventListener("click",()=>{e.contexts.push({id:"ctx_"+Date.now(),label:"New context",color:"#7F77DD",isStudy:!1}),n()})}function s(){t.querySelectorAll(".ctx-color-input").forEach(a=>{a.addEventListener("input",i=>{e.contexts[+i.target.dataset.i].color=i.target.value})}),t.querySelectorAll(".ctx-label-input").forEach(a=>{a.addEventListener("input",i=>{e.contexts[+i.target.dataset.i].label=i.target.value})}),t.querySelectorAll(".ctx-is-study").forEach(a=>{a.addEventListener("change",i=>{e.contexts[+i.target.dataset.i].isStudy=a.checked})}),t.querySelectorAll(".ctx-remove-btn").forEach(a=>{a.addEventListener("click",i=>{e.contexts.splice(+i.currentTarget.dataset.i,1),n()})})}n()}function Zr(t,e){t.innerHTML=`
    <div class="settings-section">
      <p class="settings-section-title">Notifications</p>
      <div class="card">
        ${J("Session end sound","sessionEndSound",e.sessionEndSound,"Plays when timer hits zero")}
        ${J("Break end reminder","breakEndReminder",e.breakEndReminder,"Nudge when break time is up")}
        ${J("Daily goal reached","dailyGoalAlert",e.dailyGoalAlert,"Celebrate hitting your target")}
        ${J("Morning planning nudge","morningReminderEnabled",e.morningReminderEnabled,"Reminds you to plan your day")}
        <div class="setting-row">
          <div><p class="setting-label">Reminder time</p></div>
          <input type="time" class="time-input" data-field="morningReminderTime"
            value="${e.morningReminderTime}">
        </div>
      </div>
    </div>
  `,gn(t,e)}function eo(t,e){const n=window._apexSyncStatus||{status:"idle",pending:0},s={idle:{text:"Not started yet",cls:""},syncing:{text:"Syncing…",cls:"sync-badge--syncing"},synced:{text:"Synced just now",cls:"sync-badge--ok"},offline:{text:`Offline — ${n.pending} change${n.pending!==1?"s":""} pending`,cls:"sync-badge--offline"},error:{text:`Sync error — ${n.pending} queued`,cls:"sync-badge--error"}},a=s[n.status]||s.idle;t.innerHTML=`
    <div class="settings-section">
      <p class="settings-section-title">Cloud sync</p>
      <p class="settings-hint-text">All subjects, tasks, sessions, and planned sessions are automatically synced to Supabase whenever you're online. Offline changes are queued and uploaded on reconnect.</p>
      <div class="card">
        <div class="setting-row">
          <div>
            <p class="setting-label">Status</p>
            <p class="setting-hint">Updates in real time</p>
          </div>
          <span class="sync-status-badge ${a.cls}" id="sync-status-badge">${a.text}</span>
        </div>
        <div class="setting-row" style="border-top:0.5px solid var(--border)">
          <p class="setting-label">Last synced</p>
          <span id="last-sync-time" class="setting-hint" style="color:var(--text-muted)">Loading…</span>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <p class="settings-section-title">Life dashboard modules</p>
      <p class="settings-hint-text">Apex Focus also writes to a shared IndexedDB for your local dashboard.</p>
      <div class="card">
        ${J("Study module","syncStudy",e.syncStudy,"Auto-log focus hours as study time")}
        ${J("Habits module","syncHabits",e.syncHabits,'Auto-check "deep work" habit on goal')}
        ${J("Goals module","syncGoals",e.syncGoals,"Update goal progress from sessions")}
        ${J("Mood module","syncMood",e.syncMood,"Attach session quality to mood entries")}
      </div>
    </div>
  `,gn(t,e),re(()=>Promise.resolve().then(()=>ze),void 0).then(async({getLastSyncTime:i})=>{const r=await i(),o=t.querySelector("#last-sync-time");o&&(o.textContent=r?new Date(r).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",day:"numeric",month:"short"}):"Never")}).catch(()=>{})}function to(t,e){t.innerHTML=`
    <div class="settings-section">
      <p class="settings-section-title">Features</p>
      <div class="card">
        ${J("Morning prioritisation","aiMorningPrioritisation",e.aiMorningPrioritisation,"Top 3 task suggestions each morning")}
        ${J("Weekly review summary","aiWeeklyReview",e.aiWeeklyReview,"AI insight chips on Insights tab")}
        ${J("Distraction alerts","aiDistractionAlerts",e.aiDistractionAlerts,"Tips when distraction rate spikes")}
        ${J("Smart rescheduling","aiSmartRescheduling",e.aiSmartRescheduling,"Suggests replanning when sessions run late")}
      </div>
    </div>
    <div class="settings-section">
      <p class="settings-section-title">Provider</p>
      <div class="card">
        <div class="setting-row">
          <p class="setting-label">Model</p>
          <div class="seg-row" style="margin:0;gap:6px">
            <button class="seg-btn ${e.aiProvider==="gemini"?"seg-active":""}" id="prov-gemini" data-val="gemini">Gemini</button>
            <button class="seg-btn ${e.aiProvider==="openai"?"seg-active":""}" id="prov-openai" data-val="openai">OpenAI</button>
          </div>
        </div>
        <div class="setting-row">
          <p class="setting-label">API key</p>
          <input type="password" class="api-key-input" data-field="aiApiKey"
            value="${e.aiApiKey}" placeholder="Paste key here…">
        </div>
        <div class="setting-row" style="border:none;padding-top:4px">
          <span id="key-status" class="key-status"></span>
          <button class="link-btn" id="test-key">Test connection</button>
        </div>
      </div>
    </div>
    <p class="settings-hint-text" style="margin-top:4px">
      Uses Gemini 2.5 Flash on the free tier — no credit card needed.
      <br>Get a key at <strong>aistudio.google.com</strong>.
    </p>
  `,gn(t,e),t.querySelectorAll("#prov-gemini, #prov-openai").forEach(n=>{n.addEventListener("click",()=>{t.querySelectorAll("#prov-gemini, #prov-openai").forEach(s=>s.classList.remove("seg-active")),n.classList.add("seg-active"),e.aiProvider=n.dataset.val})}),t.querySelector("#test-key").addEventListener("click",async()=>{const n=t.querySelector("#key-status");if(!e.aiApiKey){n.textContent="No API key set.",n.className="key-status fail";return}n.textContent="Testing…",n.className="key-status";const{callGemini:s}=await re(async()=>{const{callGemini:i}=await Promise.resolve().then(()=>Fa);return{callGemini:i}},void 0),a=await s('Reply with only the word "ok".',e.aiApiKey);a&&a.toLowerCase().includes("ok")?(n.textContent="Connected ✓",n.className="key-status ok"):(n.textContent="Connection failed. Check your key.",n.className="key-status fail")})}async function no(t,e){async function n(){var o;const[s,a,i]=await Promise.all([er(),ie(),S.tasks.toArray()]),r=i.filter(l=>!l.completedAt);t.innerHTML=`
      <div class="settings-section">
        <p class="settings-section-title">Recurring study sessions</p>
        <p class="settings-hint-text">These sessions auto-populate your calendar each week. Toggle them on/off without deleting.</p>
        <div class="card" id="recur-list">
          ${s.length===0?'<p class="settings-hint-text" style="padding:8px 0">No recurring sessions yet.</p>':s.map(l=>{const d=a.find(h=>h.id===l.subjectId),c=l.taskId?r.find(h=>h.id===l.taskId):null,u=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],p=(l.days||[]).map(h=>u[h]).join(", ");return`
                  <div class="recur-row">
                    <div class="recur-row-left">
                      <label class="toggle recur-toggle">
                        <input type="checkbox" class="recur-active-toggle" data-id="${l.id}" ${l.active?"checked":""}>
                        <span class="toggle-track"></span>
                        <span class="toggle-thumb"></span>
                      </label>
                    </div>
                    <div class="recur-row-body">
                      <p class="recur-title">
                        <span style="color:${(d==null?void 0:d.color)||"var(--accent)"}">
                          ${d!=null&&d.icon?d.icon+" ":""}${(d==null?void 0:d.name)||"Unknown subject"}
                        </span>
                        ${c?` · ${c.title}`:""}
                      </p>
                      <p class="recur-meta">${p||"No days set"} · ${l.startTime||"—"} · ${l.durationMins}m</p>
                    </div>
                    <button class="ctx-remove-btn recur-delete" data-id="${l.id}">×</button>
                  </div>
                `}).join("")}
        </div>
        <button class="btn-ghost full-width-ghost" id="add-recur">+ Add recurring session</button>
      </div>
    `,t.querySelectorAll(".recur-active-toggle").forEach(l=>{l.addEventListener("change",async d=>{await nr(+d.target.dataset.id,{active:d.target.checked})})}),t.querySelectorAll(".recur-delete").forEach(l=>{l.addEventListener("click",async d=>{await sr(+l.dataset.id),await n()})}),(o=t.querySelector("#add-recur"))==null||o.addEventListener("click",()=>{so(a,r,n)})}await n()}function so(t,e,n){var d;const s=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],a=document.createElement("div");a.className="modal-overlay",a.innerHTML=`
    <div class="modal-card detail-modal">
      <div class="modal-drag-bar"></div>
      <div class="modal-header">
        <p style="font-size:15px;font-weight:500;color:var(--text-primary);margin:0">Recurring session</p>
        <button class="modal-close-btn" id="recur-close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <label class="modal-field-label">Subject</label>
        <div class="seg-row" id="rs-subj" style="flex-wrap:wrap;margin-bottom:14px">
          ${t.map((c,u)=>`
            <button class="seg-btn ${u===0?"seg-ctx-active":""}" data-id="${c.id}" data-color="${c.color}"
              style="${u===0?`background:${c.color}22;border-color:${c.color};color:${c.color}`:""}">
              ${c.icon?c.icon+" ":""}${j(c.name)}
            </button>
          `).join("")}
        </div>

        <label class="modal-field-label">Linked task <span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--text-muted)">(optional)</span></label>
        <select class="sort-select" id="rs-task" style="width:100%;padding:8px;margin-bottom:14px;font-size:13px">
          <option value="">No task linked</option>
          ${e.map(c=>`<option value="${c.id}">${j(c.title)}</option>`).join("")}
        </select>

        <label class="modal-field-label">Repeat on</label>
        <div class="day-grid" id="rs-days" style="margin-bottom:14px">
          ${s.map((c,u)=>`<button class="day-btn" data-day="${u}">${c.slice(0,1)}</button>`).join("")}
        </div>

        <div class="modal-row-2">
          <div>
            <label class="modal-field-label">Start time</label>
            <input type="time" class="time-input" id="rs-time" value="09:00">
          </div>
          <div>
            <label class="modal-field-label">Duration</label>
            <div class="seg-row" id="rs-dur" style="margin:0;gap:4px">
              <button class="seg-btn" data-mins="25">25m</button>
              <button class="seg-btn seg-active" data-mins="50">50m</button>
              <button class="seg-btn" data-mins="90">90m</button>
            </div>
          </div>
        </div>

        <label class="modal-field-label" style="margin-top:12px">Notes</label>
        <textarea class="detail-notes" id="rs-notes" rows="2" placeholder="e.g. Finish lab report…"></textarea>
      </div>
      <div class="modal-footer">
        <button class="btn-ghost" id="rs-cancel">Cancel</button>
        <button class="btn-primary" id="rs-save">Save</button>
      </div>
    </div>
  `,document.body.appendChild(a),requestAnimationFrame(()=>a.querySelector(".detail-modal").classList.add("modal-open"));let i=((d=t[0])==null?void 0:d.id)||null,r=[],o=50;a.querySelectorAll("#rs-subj .seg-btn").forEach(c=>{c.addEventListener("click",()=>{a.querySelectorAll("#rs-subj .seg-btn").forEach(p=>{p.classList.remove("seg-ctx-active"),p.style.cssText=""}),c.classList.add("seg-ctx-active");const u=c.dataset.color;c.style.background=u+"22",c.style.borderColor=u,c.style.color=u,i=+c.dataset.id})}),a.querySelectorAll("#rs-days .day-btn").forEach(c=>{c.addEventListener("click",()=>{const u=+c.dataset.day;r.includes(u)?(r=r.filter(p=>p!==u),c.classList.remove("active")):(r.push(u),c.classList.add("active"))})}),a.querySelectorAll("#rs-dur .seg-btn").forEach(c=>{c.addEventListener("click",()=>{a.querySelectorAll("#rs-dur .seg-btn").forEach(u=>u.classList.remove("seg-active")),c.classList.add("seg-active"),o=+c.dataset.mins})});const l=()=>{a.querySelector(".detail-modal").classList.remove("modal-open"),setTimeout(()=>a.remove(),250)};a.querySelector("#recur-close").addEventListener("click",l),a.querySelector("#rs-cancel").addEventListener("click",l),a.addEventListener("click",c=>{c.target===a&&l()}),a.querySelector("#rs-save").addEventListener("click",async()=>{if(!i||r.length===0)return;const c=a.querySelector("#rs-task").value;await tr({subjectId:i,taskId:c?+c:null,days:r.sort(),startTime:a.querySelector("#rs-time").value,durationMins:o,notes:a.querySelector("#rs-notes").value.trim()}),l(),n&&n()})}function Ja(t){const e=window.matchMedia("(prefers-color-scheme: dark)").matches,n=t==="dark"||t==="system"&&e;document.documentElement.setAttribute("data-theme",n?"dark":"light")}function gn(t,e){t.querySelectorAll("[data-field]").forEach(n=>{const s=n.dataset.field;n.type==="checkbox"?n.addEventListener("change",()=>{e[s]=n.checked}):n.type==="number"?n.addEventListener("input",()=>{e[s]=+n.value}):n.addEventListener("input",()=>{e[s]=n.value})})}function J(t,e,n,s=""){return`
    <div class="setting-row">
      <div>
        <p class="setting-label">${t}</p>
        ${s?`<p class="setting-hint">${s}</p>`:""}
      </div>
      <label class="toggle">
        <input type="checkbox" data-field="${e}" ${n?"checked":""}>
        <span class="toggle-track"></span>
        <span class="toggle-thumb"></span>
      </label>
    </div>`}function rt(t,e,n,s,a,i,r){return`
    <div class="setting-row">
      <p class="setting-label">${t}</p>
      <div style="display:flex;align-items:center;gap:6px">
        <input type="number" class="num-input" data-field="${e}"
          value="${n}" min="${a}" max="${i}" step="${r}">
        <span class="field-unit">${s}</span>
      </div>
    </div>`}function Le(t,e,n){return`
    <button class="settings-nav-item ${t==="session"?"active":""}" data-panel="${t}">
      ${n}<span>${e}</span>
    </button>`}const Ue=t=>`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${t}</svg>`,ao=()=>Ue('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),io=()=>Ue('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>'),ro=()=>Ue('<circle cx="6" cy="6" r="2"/><circle cx="14" cy="10" r="2"/><path d="M8 6h4M8 10H4"/>'),oo=()=>Ue('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>'),lo=()=>Ue('<path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>'),co=()=>Ue('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M8 10h.01M12 10h.01M16 10h.01M8 14h8"/>'),uo=()=>Ue('<path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>');async function po(t){const e=await te(),{fromStr:n,toStr:s,monday:a,sunday:i}=Is(),r=await Ke(n,s),o=r.reduce((g,y)=>g+(y.durationMins||0),0),l=await Aa(e.activeDays,e.dailyGoalHours*60),d=await S.tasks.filter(g=>g.completedAt&&g.completedAt>=a.getTime()&&g.completedAt<=Date.now()).toArray(),c=await S.tasks.where("status").equals("today").filter(g=>!g.completedAt).toArray(),u={};r.forEach(g=>{u[g.context]=(u[g.context]||0)+(g.durationMins||0)});const p=Object.entries(u).sort((g,y)=>y[1]-g[1])[0],h=p?e.contexts.find(g=>g.id===p[0]):null,v=Array(7).fill(0);r.forEach(g=>{const y=(new Date(g.startedAt).getDay()+6)%7;v[y]+=g.durationMins||0});const f=Math.max(...v,1);t.innerHTML=`
    <div class="view-header">
      <div>
        <h1 class="view-title">Weekly review</h1>
        <p class="view-sub">${a.toLocaleDateString("en-GB",{day:"numeric",month:"short"})} – ${i.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</p>
      </div>
      <button class="btn-accent" id="close-review">Done</button>
    </div>

    <div class="review-hero">
      <div class="review-stat-row">
        <div class="review-stat">
          <p class="review-stat-val">${Be(o)}</p>
          <p class="review-stat-label">focused</p>
        </div>
        <div class="review-stat-divider"></div>
        <div class="review-stat">
          <p class="review-stat-val">${r.length}</p>
          <p class="review-stat-label">sessions</p>
        </div>
        <div class="review-stat-divider"></div>
        <div class="review-stat">
          <p class="review-stat-val">${l}</p>
          <p class="review-stat-label">day streak</p>
        </div>
      </div>

      <div class="review-minibar">
        ${["M","T","W","T","F","S","S"].map((g,y)=>{const m=Math.round(v[y]/f*100);return`
            <div class="rmb-col">
              <div class="rmb-bar-wrap">
                <div class="rmb-bar" style="height:${Math.max(3,m)}%;background:${m>0?"var(--accent)":"var(--bg-surface)"}"></div>
              </div>
              <span class="rmb-label">${g}</span>
            </div>`}).join("")}
      </div>
    </div>

    ${h?`
      <div class="review-highlight" style="border-color:${h.color}44;background:${h.color}11">
        <span class="ctx-dot" style="background:${h.color}"></span>
        <span style="font-size:13px;color:var(--text-secondary)">
          Most focused on <strong style="color:var(--text-primary)">${h.label}</strong>
          — ${B(p[1])} this week
        </span>
      </div>
    `:""}

    <div class="card" id="ai-review-card">
      <p class="stage-label" style="margin-bottom:10px">AI review</p>
      <div id="ai-review-body">
        <div class="ai-loading">
          <div class="ai-spinner"></div>
          <span>${e.aiApiKey?"Generating your review…":"Add an API key in Settings → AI to enable AI reviews."}</span>
        </div>
      </div>
    </div>

    <div class="card">
      <p class="stage-label">Completed this week</p>
      ${d.length===0?'<p class="empty-hint" style="padding:6px 0">No tasks completed yet.</p>':d.slice(0,8).map(g=>{const y=e.contexts.find(b=>b.id===g.context);return`
              <div class="review-task-row">
                <div class="task-check checked" style="width:16px;height:16px;flex-shrink:0">
                  <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="2.5"><path d="M3 8l4 4 6-6"/></svg>
                </div>
                <span class="ctx-dot" style="background:${(y==null?void 0:y.color)||"#888780"}"></span>
                <span style="font-size:12px;color:var(--text-secondary);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${j(g.title)}</span>
              </div>`}).join("")}
    </div>

    ${c.length>0?`
      <div class="card">
        <p class="stage-label">Carrying forward</p>
        ${c.slice(0,6).map(g=>{const y=e.contexts.find(b=>b.id===g.context);return`
            <div class="review-task-row">
              <div class="task-check" style="width:16px;height:16px;flex-shrink:0"></div>
              <span class="ctx-dot" style="background:${(y==null?void 0:y.color)||"#888780"}"></span>
              <span style="font-size:12px;color:var(--text-secondary);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${j(g.title)}</span>
            </div>`}).join("")}
      </div>
    `:""}

    <div class="card">
      <p class="stage-label">Reflection note</p>
      <textarea class="session-note" id="review-note" rows="4"
        placeholder="What went well? What would you do differently next week?">${await yo()}</textarea>
      <button class="btn-primary full-width" style="margin-top:12px" id="save-note-btn">Save reflection</button>
    </div>

    <div class="review-next-week">
      <p class="stage-label" style="margin-bottom:10px">Next week intentions</p>
      <div class="seg-row" style="flex-wrap:wrap">
        ${e.contexts.map(g=>`
          <button class="seg-btn intention-btn" data-ctx="${g.id}"
            style="display:flex;align-items:center;gap:5px">
            <span class="ctx-dot" style="background:${g.color}"></span>${g.label}
          </button>
        `).join("")}
      </div>
      <textarea class="session-note" id="intention-note" rows="2" style="margin-top:8px"
        placeholder="What's the #1 thing to move forward on next week?">${await fo()}</textarea>
      <button class="btn-primary full-width" style="margin-top:10px" id="save-intention-btn">Set intention</button>
    </div>
  `,t.querySelector("#close-review").addEventListener("click",()=>{re(()=>Promise.resolve().then(()=>vn),void 0).then(g=>g.navigateTo("inbox"))}),t.querySelector("#save-note-btn").addEventListener("click",async()=>{const g=t.querySelector("#review-note").value;await S.settings.put({key:"reviewNote_"+n,value:g});const y=t.querySelector("#save-note-btn");y.textContent="Saved ✓",setTimeout(()=>{y.textContent="Save reflection"},1800)}),t.querySelector("#save-intention-btn").addEventListener("click",async()=>{const g=t.querySelector("#intention-note").value;await S.settings.put({key:"intention_"+s,value:g});const y=t.querySelector("#save-intention-btn");y.textContent="Intention set ✓",setTimeout(()=>{y.textContent="Set intention"},1800)}),t.querySelectorAll(".intention-btn").forEach(g=>{g.addEventListener("click",()=>{g.classList.toggle("seg-active")})}),e.aiApiKey&&e.aiWeeklyReview&&r.length>0?ho(r,o,l,e):e.aiApiKey?r.length===0&&(document.getElementById("ai-review-body").innerHTML='<p class="empty-hint">Complete sessions this week to generate a review.</p>'):document.getElementById("ai-review-body").innerHTML='<p class="empty-hint">Add a Gemini API key in Settings → AI to enable AI weekly reviews.</p>'}async function ho(t,e,n,s){const a=document.getElementById("ai-review-body");if(!a)return;const{callGemini:i}=await re(async()=>{const{callGemini:c}=await Promise.resolve().then(()=>Fa);return{callGemini:c}},void 0),r=t.reduce((c,u)=>c+(u.distractions||0),0)/t.length,o=`You are a productivity coach giving a warm, direct weekly review.

Data:
- Total focus: ${Be(e)} across ${t.length} sessions
- Streak: ${n} days
- Avg distractions per session: ${r.toFixed(1)}
- Quality ratings: ${t.filter(c=>c.qualityRating).map(c=>c.qualityRating).join(", ")||"none rated"}

Write a short weekly review in exactly this JSON format:
{
  "headline": "One punchy sentence summarising the week (under 12 words)",
  "strength": "One specific thing that went well (under 20 words)",
  "opportunity": "One concrete thing to improve next week (under 20 words)",
  "challenge": "Acknowledge one difficulty without being preachy (under 15 words)"
}
Reply with only valid JSON, no markdown.`,l=await i(o,s.aiApiKey);if(!a)return;if(!l){a.innerHTML='<p class="empty-hint">AI review unavailable. Check your API key.</p>';return}let d={};try{const c=l.replace(/```json|```/g,"").trim();d=JSON.parse(c)}catch{a.innerHTML=`<p style="font-size:13px;color:var(--text-secondary);line-height:1.6">${j(l)}</p>`;return}a.innerHTML=`
    <p class="review-headline">${j(d.headline||"")}</p>
    <div class="review-items">
      ${Dn("Strength",d.strength,"#1D9E75")}
      ${Dn("Improve",d.opportunity,"#D85A30")}
      ${Dn("Acknowledged",d.challenge,"#888780")}
    </div>
  `}function Dn(t,e,n){return e?`
    <div class="review-item">
      <span class="review-item-label" style="color:${n}">${t}</span>
      <p class="review-item-text">${j(e)}</p>
    </div>`:""}async function yo(){const{fromStr:t}=Is(),e=await S.settings.get("reviewNote_"+t);return j((e==null?void 0:e.value)||"")}async function fo(){const{toStr:t}=Is(),e=await S.settings.get("intention_"+t);return j((e==null?void 0:e.value)||"")}function Is(){const t=new Date,e=new Date(t);e.setDate(t.getDate()-(t.getDay()+6)%7),e.setHours(0,0,0,0);const n=new Date(e);return n.setDate(e.getDate()+6),n.setHours(23,59,59,999),{fromStr:e.toISOString().slice(0,10),toStr:t.toISOString().slice(0,10),monday:e,sunday:n}}const Qa=["inbox","focus","calendar","insights","settings","review"];let un="inbox";const Mn={inbox:fr,focus:xr,calendar:Mr,insights:Lr,settings:Wr,review:po};function Xa(){const t=location.hash.replace("#","");Qa.includes(t)&&(un=t),mo(),qt(un)}async function qt(t){var n;if(!Qa.includes(t))return;un=t,location.hash=t,document.querySelectorAll(".nav-item").forEach(s=>{s.classList.toggle("active",s.dataset.tab===t)});const e=document.getElementById("view");if(e){e.classList.add("view-exit"),await new Promise(s=>setTimeout(s,120)),e.innerHTML="",e.classList.remove("view-exit"),e.classList.add("view-enter");try{await((n=Mn[t])==null?void 0:n.call(Mn,e)),requestAnimationFrame(()=>{requestAnimationFrame(()=>{e.classList.add("view-enter-active"),setTimeout(()=>{e.classList.remove("view-enter","view-enter-active")},220)})})}catch(s){console.error(`[Apex Focus] Render error on ${t}:`,s),e.innerHTML=`
      <div class="view-error">
        <div class="view-error-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <p class="view-error-title">Something went wrong</p>
        <p class="view-error-msg">${s.message||"Unexpected error."}</p>
        <button class="btn-ghost" onclick="location.reload()" style="margin-top:12px">Reload app</button>
      </div>
    `}}}function mo(){document.getElementById("app").innerHTML=`
    <div id="view" class="view"></div>
    <nav class="bottom-nav">
      ${ot("inbox",go(),"Inbox")}
      ${ot("focus",vo(),"Focus")}
      ${ot("calendar",bo(),"Calendar")}
      ${ot("insights",wo(),"Insights")}
      ${ot("settings",ko(),"Settings")}
    </nav>
  `,document.querySelectorAll(".nav-item").forEach(t=>{t.addEventListener("click",()=>qt(t.dataset.tab))})}function ot(t,e,n){return`
    <button class="nav-item ${t===un?"active":""}" data-tab="${t}">
      ${e}<span>${n}</span>
    </button>`}const go=()=>'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-6l-2 3H10L8 12H2"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',vo=()=>'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',bo=()=>'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',wo=()=>'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',ko=()=>'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',vn=Object.freeze(Object.defineProperty({__proto__:null,initRouter:Xa,navigateTo:qt},Symbol.toStringTag,{value:"Module"}));async function xo(){return"Notification"in window?Notification.permission==="granted"?!0:await Notification.requestPermission()==="granted":!1}function Za(t,e,n="apex-focus"){Notification.permission==="granted"&&new Notification(t,{body:e,tag:n,icon:"/icons/icon-192.png",badge:"/icons/icon-192.png",silent:!1})}function So(t="session-end"){try{const e=new(window.AudioContext||window.webkitAudioContext),n={"session-end":[{freq:523,start:0,dur:.12},{freq:659,start:.14,dur:.12},{freq:784,start:.28,dur:.22}],"break-end":[{freq:440,start:0,dur:.1},{freq:440,start:.14,dur:.1}],"goal-reached":[{freq:523,start:0,dur:.1},{freq:659,start:.12,dur:.1},{freq:784,start:.24,dur:.1},{freq:1047,start:.36,dur:.22}]};(n[t]||n["session-end"]).forEach(({freq:a,start:i,dur:r})=>{const o=e.createOscillator(),l=e.createGain();o.connect(l),l.connect(e.destination),o.frequency.value=a,o.type="sine",l.gain.setValueAtTime(.18,e.currentTime+i),l.gain.exponentialRampToValueAtTime(.001,e.currentTime+i+r),o.start(e.currentTime+i),o.stop(e.currentTime+i+r+.05)})}catch{}}function $o(t){if(!t)return;const[e,n]=t.split(":").map(Number),s=new Date,a=new Date;a.setHours(e,n,0,0),a<=s&&a.setDate(a.getDate()+1);const i=a-s;setTimeout(()=>{Za("Plan your day — Apex Focus","Good morning! Time to set your focus blocks for today.")},Math.min(i,2147483647))}te().then(t=>{if(t!=null&&t.theme){Ja(t.theme);try{localStorage.setItem("apexThemeCache",JSON.stringify({theme:t.theme}))}catch{}}});function _o(t="light"){var e;if((e=window.navigator)!=null&&e.vibrate){const n={light:[8],medium:[15],heavy:[30],success:[10,50,10]};navigator.vibrate(n[t]||n.light)}}document.addEventListener("pointerdown",t=>{const e=t.target.closest("button, .task-row, .picker-row, .cal-day, .subject-chip, .ctx-pill");e&&(e.classList.add("haptic-pop"),e.addEventListener("animationend",()=>e.classList.remove("haptic-pop"),{once:!0}))},{passive:!0});window._apexHaptic=_o;window._apexSyncStatus={status:"idle",pending:0,lastSync:null};La((t,e)=>{window._apexSyncStatus={status:t,pending:e,lastSync:window._apexSyncStatus.lastSync};const n=document.getElementById("sync-status-badge");n&&ei(n,t,e)});function ei(t,e,n){const s={idle:{text:"Not started",cls:""},syncing:{text:"Syncing…",cls:"sync-badge--syncing"},synced:{text:"Synced just now",cls:"sync-badge--ok"},offline:{text:`Offline — ${n} change${n!==1?"s":""} pending`,cls:"sync-badge--offline"},error:{text:`Error — ${n} change${n!==1?"s":""} queued`,cls:"sync-badge--error"}},a=s[e]||s.idle;t.textContent=a.text,t.className="sync-status-badge "+a.cls}window._apexUpdateSyncBadge=ei;function Eo(t){return new Promise((e,n)=>{if(window.Chart){e();return}const s=document.createElement("script");s.src=t,s.onload=e,s.onerror=n,document.head.appendChild(s)})}let ut=null;window.addEventListener("beforeinstallprompt",t=>{t.preventDefault(),ut=t,Ao()});function Ao(){if(sessionStorage.getItem("installDismissed")||window.matchMedia("(display-mode: standalone)").matches)return;const t=document.createElement("div");t.className="install-banner",t.innerHTML=`
    <div class="install-banner-inner">
      <div class="install-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
      </div>
      <div class="install-text">
        <p class="install-title">Install Apex Focus</p>
        <p class="install-sub">Add to home screen for the full app experience</p>
      </div>
      <div class="install-actions">
        <button class="install-btn" id="install-btn">Install</button>
        <button class="install-dismiss" id="install-dismiss">✕</button>
      </div>
    </div>
  `,document.body.appendChild(t),document.getElementById("install-btn").addEventListener("click",async()=>{if(!ut)return;ut.prompt();const{outcome:e}=await ut.userChoice;ut=null,t.remove()}),document.getElementById("install-dismiss").addEventListener("click",()=>{sessionStorage.setItem("installDismissed","1"),t.remove()})}async function Do(t){if(!t.aiMorningPrioritisation||!t.aiApiKey)return;const e=await S.settings.get("morningPromptDate");if((e==null?void 0:e.value)===F())return;const s=new Date().getHours();if(s<6||s>11)return;const a=await S.tasks.where("status").anyOf(["today","inbox"]).filter(c=>!c.completedAt).toArray();if(a.length===0)return;const{fromStr:i}=jo(),r=await Ke(i,F()),o=Oa(a,r),l=await Mt(o,t.aiApiKey);if(!l)return;let d=[];try{const c=l.replace(/```json|```/g,"").trim();d=JSON.parse(c)}catch{return}if(!(!Array.isArray(d)||d.length===0)){for(const c of d){const u=a.find(p=>p.title.toLowerCase().includes(c.toLowerCase().slice(0,20)));u&&u.status!=="today"&&await S.tasks.update(u.id,{status:"today"})}await S.settings.put({key:"morningPromptDate",value:F()}),await S.settings.put({key:"morningPromptResult",value:JSON.stringify(d)}),Mo(d)}}function Mo(t){const e=document.createElement("div");e.className="morning-card",e.innerHTML=`
    <div class="morning-card-inner">
      <div class="morning-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        <p class="morning-title">Good morning — your top 3 for today</p>
        <button class="morning-close" id="morning-close">✕</button>
      </div>
      <ol class="morning-list">
        ${t.slice(0,3).map(n=>`<li>${n}</li>`).join("")}
      </ol>
      <button class="btn-primary full-width" style="font-size:12px;padding:9px" id="morning-start">
        Start with first task →
      </button>
    </div>
  `,document.body.appendChild(e),document.getElementById("morning-close").addEventListener("click",()=>e.remove()),document.getElementById("morning-start").addEventListener("click",()=>{e.remove(),qt("focus")}),setTimeout(()=>e.classList.add("morning-card--in"),50)}async function Io(){await Eo("https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"),await S.open(),Xa(),Ta().catch(()=>{}),Pa();const t=await te();t.accentColor&&document.documentElement.style.setProperty("--accent",t.accentColor);try{const n=new Date;n.setDate(n.getDate()-1);const s=n.toISOString().slice(0,10);await S.time_blocks.where("date").below(s).delete()}catch{}if(t.morningReminderEnabled&&await xo()&&$o(t.morningReminderTime),window._apexPlayBeep=So,window._apexNotify=Za,Do(t).catch(()=>{}),new Date().getDay()===0){const n=await S.settings.get("lastReviewDate");(n==null?void 0:n.value)!==F()&&setTimeout(()=>Lo(),3e3)}}function Lo(){const t=document.createElement("div");t.className="morning-card",t.innerHTML=`
    <div class="morning-card-inner">
      <div class="morning-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        <p class="morning-title">Time for your weekly review</p>
        <button class="morning-close" id="sunday-close">✕</button>
      </div>
      <p style="font-size:12px;color:var(--text-muted);margin:0 0 12px;line-height:1.5">
        Reflect on this week and set your intention for the next one.
      </p>
      <button class="btn-primary full-width" style="font-size:12px;padding:9px" id="sunday-start">
        Open weekly review →
      </button>
    </div>
  `,document.body.appendChild(t),document.getElementById("sunday-close").addEventListener("click",async()=>{await S.settings.put({key:"lastReviewDate",value:F()}),t.remove()}),document.getElementById("sunday-start").addEventListener("click",async()=>{await S.settings.put({key:"lastReviewDate",value:F()}),t.remove(),qt("review")}),setTimeout(()=>t.classList.add("morning-card--in"),50)}function jo(){const t=new Date,e=new Date(t);return e.setDate(t.getDate()-(t.getDay()+6)%7),{fromStr:e.toISOString().slice(0,10)}}Io().catch(t=>{document.getElementById("app").innerHTML=`
    <div style="padding:40px;text-align:center;color:#D85A30">
      <p style="font-size:16px;font-weight:500">Failed to start</p>
      <p style="font-size:12px;margin-top:8px;color:#5e5a72">${t.message}</p>
    </div>
  `});

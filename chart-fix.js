(()=>{
const oldDetail=window.detail;
const $=id=>document.getElementById(id);
function twseDate(s){const p=String(s).split('/');if(p.length!==3)return s;return `${Number(p[0])+1911}-${p[1].padStart(2,'0')}-${p[2].padStart(2,'0')}`}
function num(s){if(s==null)return null;const v=Number(String(s).replaceAll(',','').replace('--',''));return Number.isFinite(v)?v:null}
function monthKeys(n=12){const out=[],d=new Date();for(let i=0;i<n;i++){const x=new Date(d.getFullYear(),d.getMonth()-i,1);out.push(`${x.getFullYear()}${String(x.getMonth()+1).padStart(2,'0')}01`)}return out.reverse()}
async function fetchTwse(symbol){const all=[];for(const date of monthKeys(12)){try{const u=`https://www.twse.com.tw/rwd/zh/afterTrading/STOCK_DAY?date=${date}&stockNo=${encodeURIComponent(symbol)}&response=json`;const r=await fetch(u,{cache:'no-store'});if(!r.ok)continue;const d=await r.json();if(!Array.isArray(d.data))continue;for(const a of d.data){const row={date:twseDate(a[0]),volume:num(a[1]),open:num(a[3]),high:num(a[4]),low:num(a[5]),close:num(a[6])};if([row.open,row.high,row.low,row.close].every(Number.isFinite))all.push(row)}}catch(e){}}
const m=new Map();all.forEach(x=>m.set(x.date,x));return [...m.values()].sort((a,b)=>a.date.localeCompare(b.date))}
function ma(data,n){return data.map((x,i)=>{if(i<n-1)return null;let s=0;for(let j=i-n+1;j<=i;j++)s+=data[j].close;return s/n})}

function drawChart(data,symbol,name){
 const host=$('tvchart');
 host.innerHTML=`<div style="height:100%;display:flex;flex-direction:column;min-height:620px">
 <div style="padding:8px 10px;border-bottom:1px solid #243a55;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
   <div><b>${symbol} ${name||''}</b> <span style="color:#91a4bd;font-size:12px">TWSE 日K</span></div>
   <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
    <button class="btn small tw-range" data-n="22">1月</button><button class="btn small tw-range" data-n="66">3月</button><button class="btn small tw-range" data-n="132">6月</button><button class="btn small tw-range" data-n="250">1年</button><button class="btn small" id="twReset">重設</button>
   </div>
 </div>
 <div id="twInfo" style="height:26px;padding:5px 10px;color:#aebed0;font-size:12px;border-bottom:1px solid #1a2a3d">滑鼠移到 K 棒查看 OHLC；滾輪縮放、拖曳平移、雙擊重設</div>
 <canvas id="twCanvas" style="flex:1;min-height:560px;width:100%;cursor:crosshair"></canvas>
 </div>`;
 const c=$('twCanvas'),ctx=c.getContext('2d');
 let visible=Math.min(132,data.length), offset=0, hoverIndex=null, dragging=false,lastX=0;
 const clamp=()=>{visible=Math.max(15,Math.min(data.length,Math.round(visible)));offset=Math.max(0,Math.min(Math.max(0,data.length-visible),Math.round(offset)))};
 function getView(){clamp();const end=data.length-offset,start=Math.max(0,end-visible);return {view:data.slice(start,end),start,end}}
 function render(){
  const rect=host.getBoundingClientRect(),W=Math.max(760,rect.width),H=Math.max(560,rect.height-76),dpr=window.devicePixelRatio||1;
  c.width=W*dpr;c.height=H*dpr;c.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
  const {view,start}=getView(); if(!view.length)return;
  const left=58,right=66,top=28,bottom=30,volH=105,gap=24,priceH=H-top-bottom-volH-gap;
  const highs=view.map(x=>x.high),lows=view.map(x=>x.low),max=Math.max(...highs),min=Math.min(...lows),pad=(max-min)*.07||1,pMax=max+pad,pMin=min-pad,maxVol=Math.max(...view.map(x=>x.volume||0),1),xstep=(W-left-right)/view.length;
  const y=v=>top+(pMax-v)/(pMax-pMin)*priceH, volY=v=>top+priceH+gap+volH-(v/maxVol*volH), x=i=>left+(i+.5)*xstep;
  ctx.fillStyle='#0a111b';ctx.fillRect(0,0,W,H);ctx.font='11px system-ui';
  ctx.strokeStyle='#1b2a3b';ctx.fillStyle='#8fa3ba';ctx.lineWidth=1;
  for(let i=0;i<=5;i++){const yy=top+i*priceH/5,val=pMax-i*(pMax-pMin)/5;ctx.beginPath();ctx.moveTo(left,yy);ctx.lineTo(W-right,yy);ctx.stroke();ctx.textAlign='right';ctx.fillText(val.toFixed(2),W-7,yy+4)}
  ctx.textAlign='left';ctx.fillStyle='#899cb3';ctx.fillText('成交量',5,top+priceH+gap+13);
  const full20=ma(data,20),full50=ma(data,50),ma20=full20.slice(start,start+view.length),ma50=full50.slice(start,start+view.length);
  function line(arr,color){ctx.strokeStyle=color;ctx.lineWidth=1.4;ctx.beginPath();let began=false;arr.forEach((v,i)=>{if(!Number.isFinite(v))return;const xx=x(i),yy=y(v);if(!began){ctx.moveTo(xx,yy);began=true}else ctx.lineTo(xx,yy)});ctx.stroke()}
  line(ma20,'#f4ca63');line(ma50,'#6ea8fe');ctx.fillStyle='#f4ca63';ctx.fillText('MA20',left+8,16);ctx.fillStyle='#6ea8fe';ctx.fillText('MA50',left+58,16);
  view.forEach((d,i)=>{const xx=x(i),up=d.close>=d.open,color=up?'#ff5d73':'#55d6b2';ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(xx,y(d.high));ctx.lineTo(xx,y(d.low));ctx.stroke();const bw=Math.max(2,Math.min(14,xstep*.66)),yy=y(Math.max(d.open,d.close)),hh=Math.max(1,Math.abs(y(d.open)-y(d.close)));ctx.fillRect(xx-bw/2,yy,bw,hh);const vy=volY(d.volume||0);ctx.globalAlpha=.55;ctx.fillRect(xx-bw/2,vy,bw,top+priceH+gap+volH-vy);ctx.globalAlpha=1});
  const tickCount=Math.min(6,view.length);ctx.fillStyle='#8395aa';ctx.textAlign='center';for(let i=0;i<tickCount;i++){const idx=Math.round(i*(view.length-1)/(tickCount-1||1));ctx.fillText(view[idx].date.slice(5),x(idx),H-8)}
  if(hoverIndex!=null&&hoverIndex>=0&&hoverIndex<view.length){const d=view[hoverIndex],xx=x(hoverIndex),yy=y(d.close);ctx.save();ctx.setLineDash([4,4]);ctx.strokeStyle='#6e8298';ctx.beginPath();ctx.moveTo(xx,top);ctx.lineTo(xx,top+priceH+gap+volH);ctx.moveTo(left,yy);ctx.lineTo(W-right,yy);ctx.stroke();ctx.restore();ctx.fillStyle='#dce6f1';ctx.textAlign='left';ctx.fillText(d.date,Math.min(W-160,xx+8),top+16);$('twInfo').innerHTML=`${d.date}　開 <b>${d.open}</b>　高 <b>${d.high}</b>　低 <b>${d.low}</b>　收 <b>${d.close}</b>　量 <b>${((d.volume||0)/1000).toLocaleString()} 張</b>`}
 }
 function pointerIndex(ev){const rect=c.getBoundingClientRect(),mx=ev.clientX-rect.left,{view}=getView(),left=58,right=66,xstep=(rect.width-left-right)/view.length;return Math.max(0,Math.min(view.length-1,Math.floor((mx-left)/xstep)))}
 c.addEventListener('mousemove',e=>{if(dragging){const dx=e.clientX-lastX;lastX=e.clientX;const {view}=getView(),pxPer=(c.getBoundingClientRect().width-124)/view.length;if(Math.abs(dx)>=pxPer*.45){offset+=Math.round(-dx/pxPer);clamp();render()}return}hoverIndex=pointerIndex(e);render()});
 c.addEventListener('mouseleave',()=>{hoverIndex=null;dragging=false;$('twInfo').textContent='滑鼠移到 K 棒查看 OHLC；滾輪縮放、拖曳平移、雙擊重設';render()});
 c.addEventListener('mousedown',e=>{dragging=true;lastX=e.clientX;c.style.cursor='grabbing'});window.addEventListener('mouseup',()=>{dragging=false;c.style.cursor='crosshair'});
 c.addEventListener('wheel',e=>{e.preventDefault();const before=visible,ratio=pointerIndex(e)/Math.max(1,getView().view.length-1);visible*=e.deltaY>0?1.18:.84;clamp();const change=before-visible;offset+=Math.round(change*(1-ratio));clamp();hoverIndex=null;render()},{passive:false});
 c.addEventListener('dblclick',()=>{visible=Math.min(132,data.length);offset=0;hoverIndex=null;render()});
 host.querySelectorAll('.tw-range').forEach(b=>b.onclick=()=>{visible=Math.min(Number(b.dataset.n),data.length);offset=0;hoverIndex=null;render()});$('twReset').onclick=()=>{visible=Math.min(132,data.length);offset=0;hoverIndex=null;render()};
 const ro=new ResizeObserver(()=>render());ro.observe(host);render();
}
function renderTech(data){const el=$('tvtech');if(!data.length){el.innerHTML='<div class="panel muted">沒有可計算的行情資料。</div>';return}const closes=data.map(x=>x.close),last=closes.at(-1),hi=Math.max(...closes.slice(-250)),lo=Math.min(...closes.slice(-250));const avg=n=>closes.length>=n?closes.slice(-n).reduce((a,b)=>a+b,0)/n:null;const m20=avg(20),m50=avg(50),m150=avg(150),m200=avg(200);const boxes=[['最新收盤',last?.toFixed(2)],['20日均線',m20?.toFixed(2)||'—'],['50日均線',m50?.toFixed(2)||'—'],['150日均線',m150?.toFixed(2)||'—'],['200日均線',m200?.toFixed(2)||'—'],['距52週高',hi?((last/hi-1)*100).toFixed(1)+'%':'—'],['52週區間位置',hi>lo?((last-lo)/(hi-lo)*100).toFixed(0)+'%':'—'],['趨勢',last>m50&&m50>m150?'偏多':'待觀察']];el.innerHTML=`<div style="padding:18px"><div class="mini">${boxes.map(x=>`<div class="mb"><small>${x[0]}</small><b>${x[1]}</b></div>`).join('')}</div><div class="foot">證交所行情計算；K 線可使用滾輪縮放與拖曳平移。</div></div>`}
function renderFund(x){$('tvprofile').innerHTML=`<div class="panel"><h3>${x.symbol} ${x.name}</h3><p class="muted">台股基本面頁面使用外部可靠來源，避免 TradingView Widget 商品限制。</p><p><button class="btn" onclick="window.open('https://goodinfo.tw/tw/StockDetail.asp?STOCK_ID=${x.symbol}','_blank')">Goodinfo</button> <button class="btn" onclick="window.open('https://tw.stock.yahoo.com/quote/${x.symbol}.TW','_blank')">Yahoo 股市</button> <button class="btn" onclick="window.open('https://www.tradingview.com/symbols/TWSE-${x.symbol}/','_blank')">TradingView 主站</button></p></div>`;$('tvfund').innerHTML=`<div class="panel"><h3>籌碼 / 法人</h3><p><button class="btn" onclick="window.open('https://www.wantgoo.com/stock/${x.symbol}/major-investors/main-trend','_blank')">玩股網籌碼</button></p></div>`}
window.detail=async(m,i)=>{if(m!=='TW')return oldDetail(m,i);const x=watch[m][i];$('mt').textContent=x.symbol;$('mn').textContent=x.name;$('stockModal').classList.add('show');document.body.style.overflow='hidden';document.querySelectorAll('#stockModal .tabs button').forEach((b,j)=>b.classList.toggle('on',j===0));document.querySelectorAll('#stockModal .tabp').forEach((p,j)=>p.classList.toggle('on',j===0));$('tvchart').innerHTML='<div style="display:grid;place-items:center;height:100%;color:#91a4bd">正在讀取證交所 K 線資料…</div>';$('tvtech').innerHTML='<div style="display:grid;place-items:center;height:100%;color:#91a4bd">正在計算技術面…</div>';renderFund(x);const data=await fetchTwse(x.symbol);if(!data.length){$('tvchart').innerHTML=`<div class="panel" style="margin:20px"><h3>目前無法取得 ${x.symbol} 行情</h3><p class="muted">可能是證交所暫時限制跨站請求。</p><button class="btn" onclick="window.open('https://tw.stock.yahoo.com/quote/${x.symbol}.TW','_blank')">Yahoo 股市</button> <button class="btn" onclick="window.open('https://www.tradingview.com/symbols/TWSE-${x.symbol}/','_blank')">TradingView 主站</button></div>`;$('tvtech').innerHTML='<div class="panel muted" style="margin:20px">行情資料暫時無法讀取。</div>';return}drawChart(data,x.symbol,x.name);renderTech(data)};
})();
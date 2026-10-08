(()=>{
const $=id=>document.getElementById(id);
const COLORS={bg:'#07111f',text:'#91a4bd',grid:'#1c3048',up:'#ff5d73',down:'#55d6b2',ma20:'#f4ca63',ma50:'#6ea8fe',ma100:'#c084fc',ma200:'#f59e0b'};
let lwPromise=null;
function activateModal(x){
  $('mt').textContent=x.symbol;$('mn').textContent=x.name||'';
  $('stockModal').classList.add('show');document.body.style.overflow='hidden';
  document.querySelectorAll('#stockModal .tabs button').forEach((b,j)=>b.classList.toggle('on',j===0));
  document.querySelectorAll('#stockModal .tabp').forEach((p,j)=>p.classList.toggle('on',j===0));
}
function loadLW(){
  if(window.LightweightCharts)return Promise.resolve();
  if(lwPromise)return lwPromise;
  lwPromise=new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/lightweight-charts@4.2.0/dist/lightweight-charts.standalone.production.js';
    s.async=true;s.onload=resolve;s.onerror=()=>reject(new Error('互動 K 線元件載入失敗'));
    document.head.appendChild(s);
  });
  return lwPromise;
}
function n(v){if(v==null)return null;const z=Number(String(v).replaceAll(',','').replace('--',''));return Number.isFinite(z)?z:null}
function isoStart(months=30){const d=new Date();d.setMonth(d.getMonth()-months);return d.toISOString().slice(0,10)}
async function fetchFinMind(symbol){
  const p=new URLSearchParams({dataset:'TaiwanStockPrice',data_id:symbol,start_date:isoStart(32)});
  const r=await fetch(`https://api.finmindtrade.com/api/v4/data?${p.toString()}`,{cache:'no-store',mode:'cors'});
  if(!r.ok)throw new Error('FinMind HTTP '+r.status);
  const j=await r.json();if(j.status!==200&&!Array.isArray(j.data))throw new Error(j.msg||'FinMind 無資料');
  return (j.data||[]).map(a=>({time:a.date,open:n(a.open),high:n(a.max??a.high),low:n(a.min??a.low),close:n(a.close),volume:n(a.Trading_Volume??a.volume)})).filter(a=>a.time&&[a.open,a.high,a.low,a.close].every(Number.isFinite));
}
function rocDateToISO(s){const p=String(s).split('/');if(p.length!==3)return s;return `${Number(p[0])+1911}-${String(p[1]).padStart(2,'0')}-${String(p[2]).padStart(2,'0')}`}
function monthsBack(count=30){const a=[],d=new Date();for(let i=count-1;i>=0;i--){const x=new Date(d.getFullYear(),d.getMonth()-i,1);a.push(`${x.getFullYear()}${String(x.getMonth()+1).padStart(2,'0')}01`)}return a}
async function fetchTWSE(symbol){
  const all=[];for(const date of monthsBack(30)){
    try{const r=await fetch(`https://www.twse.com.tw/rwd/zh/afterTrading/STOCK_DAY?date=${date}&stockNo=${encodeURIComponent(symbol)}&response=json`,{cache:'no-store'});if(!r.ok)continue;const j=await r.json();for(const a of (j.data||[])){const row={time:rocDateToISO(a[0]),volume:n(a[1]),open:n(a[3]),high:n(a[4]),low:n(a[5]),close:n(a[6])};if([row.open,row.high,row.low,row.close].every(Number.isFinite))all.push(row)}}catch(e){}
  }
  const m=new Map();all.forEach(x=>m.set(x.time,x));return [...m.values()].sort((a,b)=>a.time.localeCompare(b.time));
}
async function fetchTW(symbol){
  try{const d=await fetchFinMind(symbol);if(d.length>30)return d}catch(e){console.warn('FinMind fallback',e)}
  return await fetchTWSE(symbol);
}
function moving(data,len){const out=[];let sum=0;for(let i=0;i<data.length;i++){sum+=data[i].close;if(i>=len)sum-=data[i-len].close;if(i>=len-1)out.push({time:data[i].time,value:sum/len})}return out}
function findLegs(x){try{return positions.filter(p=>p.market==='TW'&&p.ticker===x.symbol).flatMap(p=>p.legs.map(l=>({type:l.type,time:(l.at||'').slice(0,10),price:l.price})))}catch{return[]}}
function addLine(chart,data,color,title){const s=chart.addLineSeries({color,lineWidth:2,title,priceLineVisible:false,lastValueVisible:false});s.setData(data);return s}
function renderUS(x){
  activateModal(x);
  const exch=x.exchange||'NASDAQ',sym=`${exch}:${x.symbol}`;
  const host=$('tvchart');
  host.innerHTML='<div class="tradingview-widget-container" style="height:100%;width:100%"><div class="tradingview-widget-container__widget" style="height:calc(100% - 32px);width:100%"></div><div id="tvFallback" style="height:32px;padding:5px 10px;border-top:1px solid #243a55;font-size:12px"></div></div>';
  const script=document.createElement('script');script.type='text/javascript';script.src='https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';script.async=true;
  script.text=JSON.stringify({autosize:true,symbol:sym,interval:'D',timezone:'exchange',theme:'dark',style:'1',locale:'zh_TW',allow_symbol_change:true,calendar:false,hide_side_toolbar:false,hide_top_toolbar:false,hide_legend:false,hide_volume:false,withdateranges:true,save_image:true,support_host:'https://www.tradingview.com'});
  host.querySelector('.tradingview-widget-container').appendChild(script);
  const link=`https://www.tradingview.com/chart/?symbol=${encodeURIComponent(sym)}`;
  const fallback=$('tvFallback');fallback.innerHTML=`如果圖表被瀏覽器阻擋：<button class="btn small" onclick="window.open('${link}','_blank')">開啟 TradingView</button>`;
  $('tvtech').innerHTML=`<div class="panel" style="margin:18px"><h3>${x.symbol} 技術分析</h3><p class="muted">主圖使用 TradingView 官方 Advanced Chart Widget。</p><button class="btn" onclick="window.open('${link}','_blank')">開啟完整 TradingView</button></div>`;
  $('tvchip').innerHTML=`<div class="panel" style="margin:18px"><h3>美股籌碼 / 機構持股</h3><button class="btn" onclick="window.open('https://finance.yahoo.com/quote/${x.symbol}/holders/','_blank')">查看機構持股</button></div>`;
  $('tvprofile').innerHTML=`<div class="panel"><h3>${x.symbol} ${x.name||''}</h3><button class="btn" onclick="window.open('https://www.tradingview.com/symbols/${exch}-${x.symbol}/','_blank')">TradingView 個股頁</button></div>`;
  $('tvfund').innerHTML=`<div class="panel"><h3>基本面</h3><button class="btn" onclick="window.open('https://finance.yahoo.com/quote/${x.symbol}/financials/','_blank')">Yahoo Finance 財報</button></div>`;
}
function renderTWChart(data,x){
  const host=$('tvchart');host.innerHTML=`<div style="height:100%;display:flex;flex-direction:column"><div style="padding:9px 12px;border-bottom:1px solid #243a55;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap"><div><b>${x.symbol} ${x.name||''}</b> <span class="muted">台股日 K｜可縮放拖曳</span></div><div id="twReadout" style="font-size:12px;color:#b8c7d9">移到 K 棒查看 OHLC</div></div><div style="padding:7px 12px;border-bottom:1px solid #182b42;display:flex;gap:12px;flex-wrap:wrap;font-size:12px"><b style="color:${COLORS.ma20}">MA20</b><b style="color:${COLORS.ma50}">MA50</b><b style="color:${COLORS.ma100}">MA100</b><b style="color:${COLORS.ma200}">MA200</b><span class="muted">滾輪縮放｜拖曳平移｜十字線</span></div><div id="twPriceChart" style="height:510px"></div><div style="padding:5px 12px;color:#91a4bd;font-size:11px;border-top:1px solid #243a55">成交量</div><div id="twVolChart" style="height:175px"></div></div>`;
  const common={layout:{background:{type:'solid',color:COLORS.bg},textColor:COLORS.text},grid:{vertLines:{color:COLORS.grid},horzLines:{color:COLORS.grid}},rightPriceScale:{borderColor:'#2a405b'},timeScale:{borderColor:'#2a405b'},handleScroll:{mouseWheel:true,pressedMouseMove:true,horzTouchDrag:true,vertTouchDrag:false},handleScale:{axisPressedMouseMove:true,mouseWheel:true,pinch:true}};
  const ph=$('twPriceChart'),vh=$('twVolChart');
  const pc=LightweightCharts.createChart(ph,{...common,width:ph.clientWidth,height:510});
  const candle=pc.addCandlestickSeries({upColor:COLORS.up,downColor:COLORS.down,borderUpColor:COLORS.up,borderDownColor:COLORS.down,wickUpColor:COLORS.up,wickDownColor:COLORS.down});
  candle.setData(data.map(d=>({time:d.time,open:d.open,high:d.high,low:d.low,close:d.close})));
  addLine(pc,moving(data,20),COLORS.ma20,'MA20');addLine(pc,moving(data,50),COLORS.ma50,'MA50');addLine(pc,moving(data,100),COLORS.ma100,'MA100');addLine(pc,moving(data,200),COLORS.ma200,'MA200');
  const markers=findLegs(x).map(l=>({time:l.time,position:l.type==='BUY'?'belowBar':'aboveBar',color:l.type==='BUY'?'#22c55e':'#ef4444',shape:l.type==='BUY'?'arrowUp':'arrowDown',text:`${l.type==='BUY'?'買':'賣'} ${l.price||''}`})).filter(m=>data.some(d=>d.time===m.time));if(markers.length)candle.setMarkers(markers);
  const vc=LightweightCharts.createChart(vh,{...common,width:vh.clientWidth,height:175});const vol=vc.addHistogramSeries({priceFormat:{type:'volume'},priceScaleId:''});vol.priceScale().applyOptions({scaleMargins:{top:.08,bottom:0}});vol.setData(data.map(d=>({time:d.time,value:d.volume||0,color:d.close>=d.open?'rgba(255,93,115,.65)':'rgba(85,214,178,.65)'})));
  let sync=false;pc.timeScale().subscribeVisibleLogicalRangeChange(r=>{if(!r||sync)return;sync=true;vc.timeScale().setVisibleLogicalRange(r);sync=false});vc.timeScale().subscribeVisibleLogicalRangeChange(r=>{if(!r||sync)return;sync=true;pc.timeScale().setVisibleLogicalRange(r);sync=false});
  pc.subscribeCrosshairMove(p=>{if(!p||!p.time)return;const d=p.seriesData.get(candle);if(!d)return;$('twReadout').innerHTML=`${p.time}　O ${d.open.toFixed(2)}　H ${d.high.toFixed(2)}　L ${d.low.toFixed(2)}　C <b>${d.close.toFixed(2)}</b>`});
  const ro=new ResizeObserver(()=>{pc.applyOptions({width:ph.clientWidth});vc.applyOptions({width:vh.clientWidth})});ro.observe(host);
  const bars=Math.min(130,data.length);pc.timeScale().setVisibleLogicalRange({from:data.length-bars,to:data.length+4});vc.timeScale().setVisibleLogicalRange({from:data.length-bars,to:data.length+4});
}
function renderTech(data){const c=data.map(d=>d.close),last=c.at(-1),avg=k=>c.length>=k?c.slice(-k).reduce((a,b)=>a+b,0)/k:null,m20=avg(20),m50=avg(50),m100=avg(100),m200=avg(200),hi=Math.max(...c.slice(-252)),lo=Math.min(...c.slice(-252));const boxes=[['最新收盤',last?.toFixed(2)||'—'],['MA20',m20?.toFixed(2)||'—'],['MA50',m50?.toFixed(2)||'—'],['MA100',m100?.toFixed(2)||'—'],['MA200',m200?.toFixed(2)||'—'],['距52週高',hi?((last/hi-1)*100).toFixed(1)+'%':'—'],['52週位置',hi>lo?((last-lo)/(hi-lo)*100).toFixed(0)+'%':'—'],['均線排列',last>m20&&m20>m50&&m50>m100&&m100>m200?'完整多頭':'未完整多頭']];$('tvtech').innerHTML=`<div style="padding:18px"><div class="mini">${boxes.map(a=>`<div class="mb"><small>${a[0]}</small><b>${a[1]}</b></div>`).join('')}</div><div class="foot">均線以日收盤價計算。</div></div>`}
async function renderChip(x){const el=$('tvchip');el.innerHTML='<div style="display:grid;place-items:center;height:100%;color:#91a4bd">讀取法人資料中…</div>';let body='';try{const p=new URLSearchParams({dataset:'TaiwanStockInstitutionalInvestorsBuySell',data_id:x.symbol,start_date:new Date(Date.now()-14*864e5).toISOString().slice(0,10)});const r=await fetch(`https://api.finmindtrade.com/api/v4/data?${p}`,{cache:'no-store'});const j=await r.json();const rows=j.data||[];const lastDate=rows.at(-1)?.date;const day=rows.filter(v=>v.date===lastDate);const groups={};day.forEach(v=>{const name=v.name||v.institutional_investors||'法人';groups[name]=(groups[name]||0)+(n(v.buy)||0)-(n(v.sell)||0)});body=Object.keys(groups).length?`<div class="mini">${Object.entries(groups).map(([k,v])=>`<div class="mb"><small>${k}</small><b class="${v>0?'good':v<0?'bad':''}">${(v/1000).toLocaleString(undefined,{maximumFractionDigits:0})} 張</b></div>`).join('')}</div>`:'<div class="muted">暫無法人資料。</div>'}catch(e){body='<div class="muted">法人資料暫時無法取得。</div>'}el.innerHTML=`<div style="padding:18px"><h3>籌碼 / 法人</h3>${body}<div class="callout" style="margin-top:18px">主力券商分點沒有穩定免費官方 API，因此保留專業網站入口。</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" onclick="window.open('https://www.wantgoo.com/stock/${x.symbol}/major-investors/main-trend','_blank')">玩股網主力</button><button class="btn" onclick="window.open('https://goodinfo.tw/tw/ShowBuySaleChart.asp?STOCK_ID=${x.symbol}','_blank')">Goodinfo 買賣超</button></div></div>`}
function renderFund(x){$('tvprofile').innerHTML=`<div class="panel"><h3>${x.symbol} ${x.name||''}</h3><button class="btn" onclick="window.open('https://goodinfo.tw/tw/StockDetail.asp?STOCK_ID=${x.symbol}','_blank')">Goodinfo</button></div>`;$('tvfund').innerHTML=`<div class="panel"><h3>公司 / 財報</h3><p class="muted">台股 K 線與籌碼留在 TradeLab；詳細財報連到專業資料站。</p></div>`}
window.detail=async(m,i)=>{
  const x=watch[m][i];if(!x)return;
  if(m==='US'){renderUS(x);return}
  activateModal(x);$('tvchart').innerHTML='<div style="display:grid;place-items:center;height:100%;color:#91a4bd">正在讀取台股日 K…</div>';$('tvtech').innerHTML='<div style="display:grid;place-items:center;height:100%;color:#91a4bd">正在計算技術面…</div>';renderFund(x);renderChip(x);
  try{await loadLW();const data=await fetchTW(x.symbol);if(!data.length)throw new Error('沒有取得歷史行情');renderTWChart(data,x);renderTech(data)}catch(e){$('tvchart').innerHTML=`<div class="panel" style="margin:18px"><h3>台股圖表載入失敗</h3><p class="muted">${String(e.message||e)}</p><button class="btn" onclick="window.open('https://www.wantgoo.com/stock/${x.symbol}','_blank')">開啟玩股網</button></div>`;$('tvtech').innerHTML='<div class="panel muted" style="margin:18px">技術資料暫時無法載入。</div>'}
};
})();
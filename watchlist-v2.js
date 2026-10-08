(()=>{
const US=[
// 上游｜IC設計 / 半導體設計生態 35
['NVDA','NVIDIA','NASDAQ','上游','IC設計'],['AVGO','Broadcom','NASDAQ','上游','IC設計'],['AMD','AMD','NASDAQ','上游','IC設計'],['QCOM','Qualcomm','NASDAQ','上游','IC設計'],['TXN','Texas Instruments','NASDAQ','上游','IC設計'],['ADI','Analog Devices','NASDAQ','上游','IC設計'],['MU','Micron Technology','NASDAQ','上游','IC設計'],['MRVL','Marvell Technology','NASDAQ','上游','IC設計'],['MCHP','Microchip Technology','NASDAQ','上游','IC設計'],['MPWR','Monolithic Power Systems','NASDAQ','上游','IC設計'],['ON','onsemi','NASDAQ','上游','IC設計'],['INTC','Intel','NASDAQ','上游','IC設計'],['ARM','Arm Holdings','NASDAQ','上游','IC設計'],['SNPS','Synopsys','NASDAQ','上游','IC設計'],['CDNS','Cadence Design Systems','NASDAQ','上游','IC設計'],['SWKS','Skyworks Solutions','NASDAQ','上游','IC設計'],['QRVO','Qorvo','NASDAQ','上游','IC設計'],['LSCC','Lattice Semiconductor','NASDAQ','上游','IC設計'],['ALGM','Allegro MicroSystems','NASDAQ','上游','IC設計'],['MTSI','MACOM Technology Solutions','NASDAQ','上游','IC設計'],['CRUS','Cirrus Logic','NASDAQ','上游','IC設計'],['SYNA','Synaptics','NASDAQ','上游','IC設計'],['SITM','SiTime','NASDAQ','上游','IC設計'],['SLAB','Silicon Laboratories','NASDAQ','上游','IC設計'],['POWI','Power Integrations','NASDAQ','上游','IC設計'],['RMBS','Rambus','NASDAQ','上游','IC設計'],['AMBA','Ambarella','NASDAQ','上游','IC設計'],['SMTC','Semtech','NASDAQ','上游','IC設計'],['CRDO','Credo Technology','NASDAQ','上游','IC設計'],['ALAB','Astera Labs','NASDAQ','上游','IC設計'],['PI','Impinj','NASDAQ','上游','IC設計'],['MXL','MaxLinear','NASDAQ','上游','IC設計'],['INDI','indie Semiconductor','NASDAQ','上游','IC設計'],['CEVA','CEVA','NASDAQ','上游','IC設計'],['AOSL','Alpha & Omega Semiconductor','NASDAQ','上游','IC設計'],
// 上游｜被動元件 / 連接器 12
['APH','Amphenol','NYSE','上游','被動元件'],['TEL','TE Connectivity','NYSE','上游','被動元件'],['GLW','Corning','NYSE','上游','被動元件'],['LFUS','Littelfuse','NASDAQ','上游','被動元件'],['VSH','Vishay Intertechnology','NYSE','上游','被動元件'],['CTS','CTS Corporation','NYSE','上游','被動元件'],['BELFB','Bel Fuse','NASDAQ','上游','被動元件'],['ROG','Rogers Corporation','NYSE','上游','被動元件'],['MEI','Methode Electronics','NYSE','上游','被動元件'],['ST','Sensata Technologies','NYSE','上游','被動元件'],['BDC','Belden','NYSE','上游','被動元件'],['VICR','Vicor','NASDAQ','上游','被動元件'],
// 中游｜載板 / PCB / 先進封裝 10
['AMKR','Amkor Technology','NASDAQ','中游','載板'],['TTMI','TTM Technologies','NASDAQ','中游','載板'],['PLXS','Plexus','NASDAQ','中游','載板'],['SANM','Sanmina','NASDAQ','中游','載板'],['FLEX','Flex','NASDAQ','中游','載板'],['JBL','Jabil','NYSE','中游','載板'],['CLS','Celestica','NYSE','中游','載板'],['COHU','Cohu','NASDAQ','中游','載板'],['KLIC','Kulicke & Soffa','NASDAQ','中游','載板'],['ONTO','Onto Innovation','NYSE','中游','載板'],
// 中游｜光通訊 15
['ANET','Arista Networks','NYSE','中游','光通訊'],['CSCO','Cisco Systems','NASDAQ','中游','光通訊'],['COHR','Coherent','NYSE','中游','光通訊'],['LITE','Lumentum','NASDAQ','中游','光通訊'],['CIEN','Ciena','NYSE','中游','光通訊'],['FN','Fabrinet','NYSE','中游','光通訊'],['AAOI','Applied Optoelectronics','NASDAQ','中游','光通訊'],['ADTN','ADTRAN','NASDAQ','中游','光通訊'],['VIAV','Viavi Solutions','NASDAQ','中游','光通訊'],['IPGP','IPG Photonics','NASDAQ','中游','光通訊'],['CALX','Calix','NYSE','中游','光通訊'],['COMM','CommScope','NASDAQ','中游','光通訊'],['HLIT','Harmonic','NASDAQ','中游','光通訊'],['UI','Ubiquiti','NYSE','中游','光通訊'],['NOK','Nokia ADR','NYSE','中游','光通訊'],
// 中游｜散熱 10
['VRT','Vertiv','NYSE','中游','散熱'],['TT','Trane Technologies','NYSE','中游','散熱'],['CARR','Carrier Global','NYSE','中游','散熱'],['JCI','Johnson Controls','NYSE','中游','散熱'],['MOD','Modine Manufacturing','NYSE','中游','散熱'],['AAON','AAON','NASDAQ','中游','散熱'],['SPXC','SPX Technologies','NYSE','中游','散熱'],['FLS','Flowserve','NYSE','中游','散熱'],['XYL','Xylem','NYSE','中游','散熱'],['EMR','Emerson Electric','NYSE','中游','散熱'],
// 中游｜電力 / 資料中心電力 10
['ETN','Eaton','NYSE','中游','電力'],['GEV','GE Vernova','NYSE','中游','電力'],['PWR','Quanta Services','NYSE','中游','電力'],['HUBB','Hubbell','NYSE','中游','電力'],['BE','Bloom Energy','NYSE','中游','電力'],['VST','Vistra','NYSE','中游','電力'],['CEG','Constellation Energy','NASDAQ','中游','電力'],['NRG','NRG Energy','NYSE','中游','電力'],['GNRC','Generac','NYSE','中游','電力'],['AES','AES Corporation','NYSE','中游','電力'],
// 下游｜低軌衛星 & 衛星通訊 8
['ASTS','AST SpaceMobile','NASDAQ','下游','低軌衛星&衛星通訊'],['RKLB','Rocket Lab','NASDAQ','下游','低軌衛星&衛星通訊'],['IRDM','Iridium Communications','NASDAQ','下游','低軌衛星&衛星通訊'],['VSAT','Viasat','NASDAQ','下游','低軌衛星&衛星通訊'],['GSAT','Globalstar','NASDAQ','下游','低軌衛星&衛星通訊'],['SATS','EchoStar','NASDAQ','下游','低軌衛星&衛星通訊'],['KTOS','Kratos Defense & Security','NASDAQ','下游','低軌衛星&衛星通訊'],['RDW','Redwire','NYSE','下游','低軌衛星&衛星通訊']
].map(a=>({symbol:a[0],name:a[1],market:'US',exchange:a[2],stage:a[3],category:a[4]}));

const TW=[
// 上游｜IC設計 15
['2454','聯發科','TWSE','上游','IC設計'],['3034','聯詠','TWSE','上游','IC設計'],['2379','瑞昱','TWSE','上游','IC設計'],['6531','愛普*','TWSE','上游','IC設計'],['6526','達發','TWSE','上游','IC設計'],['6415','矽力*-KY','TWSE','上游','IC設計'],['3661','世芯-KY','TWSE','上游','IC設計'],['3443','創意','TWSE','上游','IC設計'],['3035','智原','TWSE','上游','IC設計'],['4966','譜瑞-KY','TWSE','上游','IC設計'],['5269','祥碩','TWSE','上游','IC設計'],['3529','力旺','TPEX','上游','IC設計'],['3227','原相','TPEX','上游','IC設計'],['6533','晶心科','TWSE','上游','IC設計'],['6643','M31','TPEX','上游','IC設計'],
// 上游｜被動元件 6
['2327','國巨','TWSE','上游','被動元件'],['2492','華新科','TWSE','上游','被動元件'],['2375','凱美','TWSE','上游','被動元件'],['3026','禾伸堂','TWSE','上游','被動元件'],['6173','信昌電','TPEX','上游','被動元件'],['6449','鈺邦','TWSE','上游','被動元件'],
// 中游｜載板 / PCB 7
['3037','欣興','TWSE','中游','載板'],['8046','南電','TWSE','中游','載板'],['3189','景碩','TWSE','中游','載板'],['2368','金像電','TWSE','中游','載板'],['4958','臻鼎-KY','TWSE','中游','載板'],['2313','華通','TWSE','中游','載板'],['2355','敬鵬','TWSE','中游','載板'],
// 中游｜光通訊 7
['2345','智邦','TWSE','中游','光通訊'],['4979','華星光','TPEX','中游','光通訊'],['3363','上詮','TPEX','中游','光通訊'],['3081','聯亞','TPEX','中游','光通訊'],['6442','光聖','TWSE','中游','光通訊'],['3163','波若威','TPEX','中游','光通訊'],['4977','眾達-KY','TWSE','中游','光通訊'],
// 中游｜散熱 6
['3017','奇鋐','TWSE','中游','散熱'],['3324','雙鴻','TPEX','中游','散熱'],['2421','建準','TWSE','中游','散熱'],['3653','健策','TWSE','中游','散熱'],['8996','高力','TPEX','中游','散熱'],['3338','泰碩','TWSE','中游','散熱'],
// 中游｜電力 5
['2308','台達電','TWSE','中游','電力'],['6412','群電','TWSE','中游','電力'],['6282','康舒','TWSE','中游','電力'],['2301','光寶科','TWSE','中游','電力'],['6409','旭隼','TWSE','中游','電力'],
// 下游｜低軌衛星 & 衛星通訊 4
['3491','昇達科','TPEX','下游','低軌衛星&衛星通訊'],['6285','啟碁','TWSE','下游','低軌衛星&衛星通訊'],['2314','台揚','TWSE','下游','低軌衛星&衛星通訊'],['3596','智易','TWSE','下游','低軌衛星&衛星通訊']
].map(a=>({symbol:a[0],name:a[1],market:'TW',exchange:a[2],stage:a[3],category:a[4]}));

// 讓既有 detail(market,index) 照常運作
watch.US.splice(0,watch.US.length,...US);
watch.TW.splice(0,watch.TW.length,...TW);

const stageOrder=['上游','中游','下游'];
const catOrder=['IC設計','被動元件','載板','光通訊','散熱','電力','低軌衛星&衛星通訊'];
function groupedHTML(market){
 const data=watch[market];
 return `<div style="padding:2px 0 8px;color:#91a4bd;font-size:11px">${market==='US'?'美股 100 檔':'台股 50 檔'}｜依供應鏈位置與產業類別整理；同類內以大型／代表性公司優先。</div>`+
 stageOrder.map(stage=>{
   const cats=catOrder.map(cat=>({cat,items:data.map((x,i)=>({x,i})).filter(z=>z.x.stage===stage&&z.x.category===cat)})).filter(g=>g.items.length);
   if(!cats.length)return'';
   return `<section style="margin:14px 0 22px"><div style="font-size:19px;font-weight:900;padding:9px 11px;border-left:4px solid #56d6b2;background:rgba(86,214,178,.06);border-radius:8px;margin-bottom:10px">${stage}</div>${cats.map(g=>`<div style="margin:12px 0"><div style="display:flex;align-items:center;justify-content:space-between;margin:0 2px 7px"><b style="font-size:14px;color:#d8e5f4">${g.cat}</b><span class="tag">${g.items.length} 檔</span></div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:7px">${g.items.map(({x,i})=>`<div class="witem" onclick="detail('${market}',${i})" style="margin:0;min-height:74px"><div class="wtop"><div><span class="ticker">${x.symbol}</span> <span class="muted">${x.name}</span></div><span class="tag">${x.exchange}</span></div><div class="note" style="margin-top:6px">${stage} · ${g.cat}</div></div>`).join('')}</div></div>`).join('')}</section>`;
 }).join('');
}
window.renderWatch=function(){
 const us=document.getElementById('usw'),tw=document.getElementById('tww');
 if(us)us.innerHTML=groupedHTML('US');
 if(tw)tw.innerHTML=groupedHTML('TW');
};
renderWatch();
})();
const products = [
  {id:1,name:"Charizard ex",game:"pokemon",gameName:"Pokémon",condition:"Near Mint",price:1850,rarity:"Ultra Rare"},
  {id:2,name:"Pikachu Illustration",game:"pokemon",gameName:"Pokémon",condition:"Near Mint",price:1290,rarity:"Illustration Rare"},
  {id:3,name:"Monkey D. Luffy",game:"onepiece",gameName:"One Piece",condition:"Mint",price:990,rarity:"Leader"},
  {id:4,name:"Roronoa Zoro",game:"onepiece",gameName:"One Piece",condition:"Excellent",price:720,rarity:"Super Rare"},
  {id:5,name:"Dark Magician",game:"yugioh",gameName:"Yu-Gi-Oh!",condition:"Near Mint",price:1450,rarity:"Ultra Rare"},
  {id:6,name:"Blue-Eyes White Dragon",game:"yugioh",gameName:"Yu-Gi-Oh!",condition:"Excellent",price:2200,rarity:"Secret Rare"},
  {id:7,name:"Lightning Bolt",game:"mtg",gameName:"Magic: The Gathering",condition:"Near Mint",price:390,rarity:"Rare"},
  {id:8,name:"Black Lotus Proxy",game:"mtg",gameName:"Magic: The Gathering",condition:"Play",price:650,rarity:"Collector"}
];

const tournaments = [
  {date:"05 OCT 2026",game:"Pokémon",title:"CardVerse Weekly #12",place:"CardVerse Arena",slots:"32 / 64 ที่นั่ง",fee:"฿150"},
  {date:"11 OCT 2026",game:"One Piece",title:"Grand Battle Vol. 3",place:"CardVerse Arena",slots:"48 / 64 ที่นั่ง",fee:"฿200"},
  {date:"18 OCT 2026",game:"Yu-Gi-Oh!",title:"Duel Night Championship",place:"CardVerse Arena",slots:"20 / 40 ที่นั่ง",fee:"฿150"},
  {date:"25 OCT 2026",game:"MTG",title:"Friday Night Magic",place:"CardVerse Arena",slots:"18 / 32 ที่นั่ง",fee:"฿100"},
  {date:"01 NOV 2026",game:"Pokémon",title:"Beginner Cup",place:"CardVerse Arena",slots:"12 / 32 ที่นั่ง",fee:"ฟรี"},
  {date:"08 NOV 2026",game:"One Piece",title:"Community Cup",place:"CardVerse Arena",slots:"30 / 64 ที่นั่ง",fee:"฿150"}
];

let cart = JSON.parse(localStorage.getItem("cardverseCart") || "[]");

const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const gameFilter = document.getElementById("gameFilter");

function money(n){return new Intl.NumberFormat("th-TH",{style:"currency",currency:"THB",maximumFractionDigits:0}).format(n)}
function renderProducts(){
  const q = searchInput.value.toLowerCase().trim();
  const game = gameFilter.value;
  const filtered = products.filter(p => (game==="all" || p.game===game) && p.name.toLowerCase().includes(q));
  grid.innerHTML = filtered.length ? filtered.map(p => `
    <article class="product">
      <div class="product-art">
        <div class="product-card-visual"><span>${p.gameName}</span><strong>${p.name}</strong><span>${p.rarity}</span></div>
      </div>
      <div class="product-body">
        <div class="game">${p.gameName} • ${p.rarity}</div>
        <h3>${p.name}</h3>
        <div class="meta"><span>${p.condition}</span><span>✓ ตรวจสอบแล้ว</span></div>
        <div class="price">${money(p.price)}</div>
        <button class="btn primary add-cart" data-id="${p.id}">เพิ่มลงตะกร้า</button>
      </div>
    </article>`).join("") : `<div style="grid-column:1/-1;padding:40px;text-align:center;color:#a9afc4">ไม่พบการ์ดที่ค้นหา</div>`;
}
function renderTournaments(){
  document.getElementById("tournamentGrid").innerHTML = tournaments.slice(0,3).map(t => `
    <article class="tournament">
      <div class="date">${t.date}</div><div class="game">${t.game}</div><h3>${t.title}</h3>
      <p>📍 ${t.place}</p><p>👥 ${t.slots}</p><p>💳 ค่าสมัคร ${t.fee}</p>
      <button class="btn ghost join" data-title="${t.title}">สมัครแข่งขัน</button>
    </article>`).join("");
}
function renderCart(){
  document.getElementById("cartCount").textContent = cart.reduce((s,x)=>s+x.qty,0);
  const box = document.getElementById("cartItems");
  box.innerHTML = cart.length ? cart.map(x=>`
    <div class="cart-row">
      <div><strong>${x.name}</strong><small>${money(x.price)} × ${x.qty}</small></div>
      <button class="remove" data-remove="${x.id}">ลบ</button>
    </div>`).join("") : `<p style="color:#a9afc4;text-align:center;margin-top:50px">ยังไม่มีสินค้าในตะกร้า</p>`;
  document.getElementById("cartTotal").textContent = money(cart.reduce((s,x)=>s+x.price*x.qty,0));
  localStorage.setItem("cardverseCart",JSON.stringify(cart));
}
function toast(msg){
  const el=document.getElementById("toast"); el.textContent=msg; el.classList.add("show");
  setTimeout(()=>el.classList.remove("show"),2200);
}

grid.addEventListener("click",e=>{
  const btn=e.target.closest(".add-cart"); if(!btn)return;
  const p=products.find(x=>x.id===Number(btn.dataset.id)); const found=cart.find(x=>x.id===p.id);
  found ? found.qty++ : cart.push({...p,qty:1});
  renderCart(); toast(`เพิ่ม ${p.name} ลงตะกร้าแล้ว`);
});
document.getElementById("cartItems").addEventListener("click",e=>{
  const id=Number(e.target.dataset.remove); if(!id)return;
  cart=cart.filter(x=>x.id!==id); renderCart();
});
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("overlay").classList.add("show")}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("overlay").classList.remove("show")}
document.getElementById("openCart").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
document.getElementById("overlay").onclick=closeCart;
document.getElementById("checkoutBtn").onclick=()=>cart.length?toast("Demo: ขั้นตอนชำระเงินจะเชื่อมต่อระบบจริงในขั้นถัดไป"):toast("เพิ่มการ์ดลงตะกร้าก่อน");

searchInput.addEventListener("input",renderProducts);
gameFilter.addEventListener("change",renderProducts);
document.querySelectorAll(".chip").forEach(c=>c.onclick=()=>{
  document.querySelectorAll(".chip").forEach(x=>x.classList.remove("active")); c.classList.add("active");
  gameFilter.value=c.dataset.game; renderProducts();
});
document.getElementById("tradeForm").onsubmit=e=>{
  e.preventDefault();
  document.getElementById("tradeMessage").textContent="✓ ลงประกาศแลกการ์ดเรียบร้อยแล้ว (Demo)";
  e.target.reset();
};
document.getElementById("tournamentGrid").addEventListener("click",e=>{
  const btn=e.target.closest(".join"); if(!btn)return;
  toast(`เปิดฟอร์มสมัคร ${btn.dataset.title} — Demo`);
});
document.getElementById("showAllTournaments").onclick=()=>{
  document.getElementById("tournamentGrid").innerHTML=tournaments.map(t=>`
    <article class="tournament"><div class="date">${t.date}</div><div class="game">${t.game}</div><h3>${t.title}</h3>
    <p>📍 ${t.place}</p><p>👥 ${t.slots}</p><p>💳 ค่าสมัคร ${t.fee}</p><button class="btn ghost join" data-title="${t.title}">สมัครแข่งขัน</button></article>`).join("");
  document.getElementById("showAllTournaments").style.display="none";
};
renderProducts(); renderTournaments(); renderCart();

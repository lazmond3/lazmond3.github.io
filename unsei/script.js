// ======== 基礎データ ========

// 苗字固定：9,7
const sei1 = 9;
const sei2 = 7;

// 画数ごとの吉凶
const luckMap = {
  1:"◎",2:"△",3:"◎",4:"△",5:"◎",6:"◎",7:"◎",8:"◎",9:"△",10:"△",
  11:"◎",12:"△",13:"◎",14:"△",15:"◎",16:"◎",17:"◎",18:"◎",19:"△",20:"△",
  21:"◎",22:"△",23:"◎",24:"◎",25:"◎",26:"△",27:"○",28:"△",29:"○",30:"△",
  31:"◎",32:"◎",33:"◎",34:"△",35:"◎",36:"○",37:"◎",38:"○",39:"◎",40:"△",
  41:"◎",42:"○",43:"△",44:"△",45:"◎",46:"△",47:"◎",48:"◎",49:"△",50:"○"
};

// 五行の割当（末尾1桁）
function gogyo(num){
  const n = num % 10;
  if([1,2].includes(n)) return "木";
  if([3,4].includes(n)) return "火";
  if([5,6].includes(n)) return "土";
  if([7,8].includes(n)) return "金";
  return "水";
}

// 三才表（土固定）
const sansaiTable = {
  "土木木":"○","土木火":"○","土木土":"△","土木金":"△","土木水":"△",
  "土火木":"◎","土火火":"○","土火土":"◎","土火金":"△","土火水":"△",
  "土土木":"△","土土火":"◎","土土土":"◎","土土金":"◎","土土水":"△",
  "土金木":"△","土金火":"△","土金土":"◎","土金金":"◎","土金水":"△",
  "土水木":"△","土水火":"△","土水土":"△","土水金":"△","土水水":"△"
};

// ======== 計算ロジック ========

// 各格の計算
function calcKaku(n1, n2){
  const tenkaku = sei1 + sei2;
  const jikaku = n1 + n2;
  const jinkaku = sei2 + n1;
  const gaikaku = tenkaku + jikaku - jinkaku;
  const soukaku = sei1 + sei2 + n1 + n2;
  return {tenkaku, jinkaku, jikaku, gaikaku, soukaku};
}

// 三才判定
function calcSansai(tenkaku, jinkaku, jikaku){
  const t = gogyo(tenkaku);
  const j = gogyo(jinkaku);
  const c = gogyo(jikaku);
  const key = "土" + j + c; // 苗字は土固定
  return sansaiTable[key] || "△";
}

// 家庭運・仕事運
function calcFamilyWork(soukaku, n1, n2){
  const family = luckMap[soukaku - n2] || "△";
  const work = luckMap[soukaku - sei1] || "△";
  return {family, work};
}

// ======== 出力関数 ========

function calcUnsei(){
  const n1 = parseInt(document.getElementById("name1").value);
  const n2 = parseInt(document.getElementById("name2").value);
  if(!n1 || !n2) return alert("名前1と名前2の画数を入力してください。");

  const {tenkaku, jinkaku, jikaku, gaikaku, soukaku} = calcKaku(n1, n2);
  const san = calcSansai(tenkaku, jinkaku, jikaku);
  const {family, work} = calcFamilyWork(soukaku, n1, n2);

  const html = `
  <table>
    <tr><th>項目</th><th>画数</th><th>運勢</th></tr>
    <tr><td>天格</td><td>${tenkaku}</td><td>${luckMap[tenkaku]}</td></tr>
    <tr><td>人格</td><td>${jinkaku}</td><td>${luckMap[jinkaku]}</td></tr>
    <tr><td>地格</td><td>${jikaku}</td><td>${luckMap[jikaku]}</td></tr>
    <tr><td>外格</td><td>${gaikaku}</td><td>${luckMap[gaikaku]}</td></tr>
    <tr><td>総格</td><td>${soukaku}</td><td>${luckMap[soukaku]}</td></tr>
    <tr><td>三才</td><td>${gogyo(tenkaku)}-${gogyo(jinkaku)}-${gogyo(jikaku)}</td><td>${san}</td></tr>
    <tr><td>家庭運</td><td>${soukaku - n2}</td><td>${family}</td></tr>
    <tr><td>仕事運</td><td>${soukaku - sei1}</td><td>${work}</td></tr>
  </table>`;
  document.getElementById("result1").innerHTML = html;
}

// ======== 名前2探索 ========
function searchName2(){
  const n1 = parseInt(document.getElementById("name1_search").value);
  const cond = document.getElementById("condition").value;
  if(!n1) return alert("名前1の画数を入力してください。");

  let result = [];
  for(let n2=1;n2<=50;n2++){
    const {tenkaku, jinkaku, jikaku, gaikaku, soukaku} = calcKaku(n1,n2);
    const san = calcSansai(tenkaku, jinkaku, jikaku);
    const {family, work} = calcFamilyWork(soukaku, n1, n2);
    const ten = luckMap[tenkaku], jin = luckMap[jinkaku], chi = luckMap[jikaku], gai = luckMap[gaikaku], sou = luckMap[soukaku];

    const allgood = [ten,jin,chi,gai,sou,san,family,work].every(v=>v==="◎");
    const exceptWorkFamily = [ten,jin,chi,gai,sou,san].every(v=>v==="◎");
    const exceptWork = [ten,jin,chi,gai,sou,san,family].every(v=>v==="◎");

    if(
      (cond==="allgood" && allgood) ||
      (cond==="except_workfamily" && exceptWorkFamily) ||
      (cond==="except_work" && exceptWork)
    ){
      result.push(n2);
    }
  }
  document.getElementById("result2").innerText = result.length ? 
    "該当する名前2画数: " + result.join(", ") : "該当なし";
}

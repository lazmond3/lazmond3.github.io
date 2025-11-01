// 固定値
const sei1 = 9, sei2 = 7;

const luckMap = {
  1:"◎",2:"△",3:"◎",4:"△",5:"◎",6:"◎",7:"◎",8:"◎",9:"△",10:"△",
  11:"◎",12:"△",13:"◎",14:"△",15:"◎",16:"◎",17:"◎",18:"◎",19:"△",20:"△",
  21:"◎",22:"△",23:"◎",24:"◎",25:"◎",26:"△",27:"○",28:"△",29:"○",30:"△",
  31:"◎",32:"◎",33:"◎",34:"△",35:"◎",36:"○",37:"◎",38:"○",39:"◎",40:"△",
  41:"◎",42:"○",43:"△",44:"△",45:"◎",46:"△",47:"◎",48:"◎",49:"△",50:"○"
};

function gogyo(num){
  const n = num % 10;
  if([1,2].includes(n)) return "木";
  if([3,4].includes(n)) return "火";
  if([5,6].includes(n)) return "土";
  if([7,8].includes(n)) return "金";
  return "水";
}

const sansaiTable = {
  "土木木":"○","土木火":"○","土木土":"△","土木金":"△","土木水":"△",
  "土火木":"◎","土火火":"○","土火土":"◎","土火金":"△","土火水":"△",
  "土土木":"△","土土火":"◎","土土土":"◎","土土金":"◎","土土水":"△",
  "土金木":"△","土金火":"△","土金土":"◎","土金金":"◎","土金水":"△",
  "土水木":"△","土水火":"△","土水土":"△","土水金":"△","土水水":"△"
};

function calcKaku(n1,n2){
  const tenkaku = sei1 + sei2;
  const jinkaku = sei2 + n1;
  const chikaku = n1 + n2;
  const gaikaku = tenkaku + chikaku - jinkaku;
  const soukaku = sei1 + sei2 + n1 + n2;
  return {tenkaku,jinkaku,chikaku,gaikaku,soukaku};
}

function calcSansai(ten,jin,chi){
  const key = "土" + gogyo(jin) + gogyo(chi);
  return sansaiTable[key] || "△";
}

function calcFamilyWork(sou,n1,n2){
  return {
    family: luckMap[sou - n2] || "△",
    work: luckMap[sou - sei1] || "△"
  };
}

// ------------------------

function rankScore(v){
  if(v==="◎") return 3;
  if(v==="○") return 2;
  return 1;
}

function overallScore(o){
  return rankScore(o.ten)+rankScore(o.jin)+rankScore(o.chi)+rankScore(o.gai)+rankScore(o.sou)+rankScore(o.san)+rankScore(o.family)+rankScore(o.work);
}

// ------------------------

function calcUnsei(){
  const n1 = parseInt(document.getElementById("name1").value);
  const n2 = parseInt(document.getElementById("name2").value);
  if(!n1 || !n2){ alert("入力してください"); return; }

  const {tenkaku,jinkaku,chikaku,gaikaku,soukaku} = calcKaku(n1,n2);
  const san = calcSansai(tenkaku,jinkaku,chikaku);
  const {family,work} = calcFamilyWork(soukaku,n1,n2);

  const rows = [
    ["天格",tenkaku,luckMap[tenkaku]],
    ["人格",jinkaku,luckMap[jinkaku]],
    ["地格",chikaku,luckMap[chikaku]],
    ["外格",gaikaku,luckMap[gaikaku]],
    ["総格",soukaku,luckMap[soukaku]],
    ["三才",`${gogyo(tenkaku)}-${gogyo(jinkaku)}-${gogyo(chikaku)}`,san],
    ["家庭運",soukaku-n2,family],
    ["仕事運",soukaku-sei1,work]
  ];

  const table = rows.map(r=>{
    const cls = r[2]==="◎"?"good":r[2]==="○"?"ok":"bad";
    return `<tr class="${cls}"><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`;
  }).join("");
  document.getElementById("result1").innerHTML=`<table><tr><th>項目</th><th>値</th><th>評価</th></tr>${table}</table>`;
}

// ------------------------

function searchName2(){
  const n1 = parseInt(document.getElementById("name1_search").value)_

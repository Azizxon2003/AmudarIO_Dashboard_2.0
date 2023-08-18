// global variable
let allDevices = [];
let meteostations = "";
//colors
let orgColors = {
  Karantin: "#e2f0f9",
  //
  "Samarqand Issiqxona": "#d1cfb6",
  //
  Tuproqshunoslik: "#b1afef",
  //
  "Akfa University": "#bce3e3",
  //
  FarPI: "#d9d9d9",
  //
  "Kogon Agro": "#bce3df",
  //
  UNDP: "#bdf3ff",
  //
  AmudarIO: "#6a6ef0",
  //
  TIQXMMI: "#f7bdff",
  //
  "Toshkent shahri": "#ffd6bd",
};
async function getDevices(token) {
  // function to get devices
  const response = await fetch("http://oxus.amudar.io/api/meteoDevices", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const translater = await response.json();
  const dataObject = translater.data;
  for (let i = 0; i < dataObject.length; i++) {
    allDevices.push(dataObject[i]); // getting all devices
  }
}

function Display() {
  //sorting allDevices by org_Id
  allDevices.sort((a, b) => {
    return a.org_id - b.org_id;
  });

  let box = ``;
  let perviousOrg = "";
  let currentOrg = "";
  let outerBoxProp = ``;
  meteostations = document.querySelector(".box");
  // looping allDevices in order to get devices separarely and setting border style
  for (let i = 0; i < allDevices.length; i++) {
    let organization = allDevices[i].org.name;
    if (
      perviousOrg != organization &&
      organization != allDevices[i + 1].org.name
    ) {
      currentOrg = `<h5 class="orgName">${organization} </h5>`;
      outerBoxProp = ` border: 2px ; border-style: solid solid solid solid;  `;
    } else if (i == allDevices.length - 1) {
      outerBoxProp = `border: 2px ; border-style: solid solid solid dotted; padding-top: 20px;`;
    } else if (
      i != allDevices.length - 1 &&
      organization != allDevices[i + 1].org.name
    ) {
      outerBoxProp = `border: 2px ; border-style: solid solid solid dotted; padding-top: 20px;`;
    } else if (perviousOrg == organization) {
      outerBoxProp = `border: 2px ; border-style: solid dotted solid dotted; padding-top: 20px;`;
      currentOrg = ` `;
    } else {
      currentOrg = `<h5 class="orgName">${organization} </h5>`;
      outerBoxProp = `border: 2px ; border-style: solid dotted solid solid;`;
    }
    box = boxGenerator(allDevices[i]);
    perviousOrg = organization;
  }
  meteostations.innerHTML += box;
  function boxGenerator(key) {
    let boxColor = "";
    //giving color according to the name of org
    for (var color in orgColors) {
      if (color === key.org.name) {
        boxColor = orgColors[color];
      }
    }
    let time = "";
    // cutting unnecessary part to display time
    if (key.last_signal_human === null) {
      time = ``;
    } else if (key.last_signal_human) {
      time = key.last_signal_human.replace("аввал", "");
    } else {
      time = key.last_signal_human;
    }
    let imgPath = ``;
    //analyzing battery level
    if (Math.round(key.battery) < 11) {
      imgPath = `<img src="low-battery-colored.png" alt="Low battery" class="battery"></img>`;
    } else if (Math.round(key.battery) >= 11 && Math.round(key.battery) < 13) {
      imgPath = `<img src="half-battery-colored.png" alt="Half battery" class="battery"></img>`;
    } else if (Math.round(key.battery) >= 13) {
      imgPath = `<img src="full-battery-colored.png" alt="Full battery" class="battery"></img>`;
    }
    box += `
    <div class="outerBox" style="background-color:${boxColor}; ${outerBoxProp}">
     ${currentOrg}
      <div class="deviceBox" style="text-align: center; background-color:${boxColor} ;">
        <h6 class="${getStatus(key.last_signal_human)}">${
      key.serial_number
    }</h6>
        <div class="innerDiv">
          <h6>${time}    (${Math.round(key.battery)}V)${imgPath} </<h6>
        </div>
      </div>
    </div>
    `;

    return box;
  }
}
//function to calculate time Difference
function getStatus(lastSignal) {
  let color = "";
  if (lastSignal) {
    time = lastSignal.split(" ");
    if (time[1] == "сония") {
      color = "Green";
    } else if (time[1] == "дақиқа") {
      if (time[0] >= "0" || time[0] <= "60") {
        color = "Green";
      }
    } else if (time[1] == "соат") {
      if (time[0] <= "2" && time[0] >= "1") {
        color = "Yellow";
      } else if (time[0] >= "2") {
        color = "Red";
      }
    } else if (lastSignal === null) {
      color = "Red";
    } else {
      color = "Red";
    }
  } else {
    color = "Red";
  }
  return color;
}
async function www() {
  await getDevices("1|5BJOUuyiGaVNvX5WofDZm3LFlWRWDYhOxPj8JAoK");
  Display();
}
www();

//funtion to refresh list of devices
setInterval(() => {
  meteostations.innerHTML = ``;
  allDevices = [];
  www();
}, 300000);

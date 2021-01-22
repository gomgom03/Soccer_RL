

let checkboxes = [...document.getElementsByClassName("typeSelectInput")];
const typeSelect = [...document.getElementsByClassName("typeSelect")];

typeSelect.forEach(x => { x.addEventListener("click", () => { loadDataGraph(checkboxes[0].checked, checkboxes[1].checked, checkboxes[2].checked, checkboxes[3].checked, checkboxes[4].checked) }) })

const dataChart = document.getElementById('dataChart'),
    averageX = document.getElementById("averageX"),
    averageXButton = document.getElementById("averageXButton")
let chartData = [[], [], [], []];
let totIterations = 0;
let averageXVal = 100;

averageXButton.addEventListener("click", () => {
    if (averageX.value !== "") {
        averageXVal = parseInt(averageX.value);
        resetGraph();
    }
})

dataChart.width = window.innerWidth / 2;
dataChart.height = window.innerWidth / 3;


const ctx = dataChart.getContext('2d');
let scatterChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: `Reward 1`,
            borderColor: "#1ad94d",
            backgroundColor: 'transparent',
            hidden: true,
            data: [{ x: 0, y: 0 }]
        },
        {
            label: `Reward 2`,
            borderColor: "#d1371f",
            backgroundColor: 'transparent',
            hidden: true,
            data: [{ x: 0, y: 0 }]
        },
        {
            label: `Reward 3`,
            borderColor: "#165af7",
            backgroundColor: 'transparent',
            hidden: true,
            data: [{ x: 0, y: 0 }]
        },
        {
            label: `Reward 4`,
            borderColor: "#9600ed",
            backgroundColor: 'transparent',
            hidden: true,
            data: [{ x: 0, y: 0 }]
        },
        {
            label: `All Rewards`,
            borderColor: "#ff8c00",
            backgroundColor: 'transparent',
            hidden: false,
            data: [{ x: 0, y: 0 }]
        }]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom',
                scaleLabel: {
                    display: true,
                    labelString: 'Time (Minutes)'
                }
            }],
            yAxes: [{
                type: 'linear',
                position: 'bottom',
                scaleLabel: {
                    display: true,
                    labelString: ''
                },
                ticks: {
                    suggestedMin: -1,
                    suggestedMax: 1
                }
            }]
        }
    }
});

function loadDataGraph(b0, b1, b2, b3, b4) {
    scatterChart.data.datasets[0].hidden = !b0;
    scatterChart.data.datasets[1].hidden = !b1;
    scatterChart.data.datasets[2].hidden = !b2;
    scatterChart.data.datasets[3].hidden = !b3;
    scatterChart.data.datasets[4].hidden = !b4;
    scatterChart.update();
}

function addData(arr) {
    totIterations++;
    chartData[0].push(arr[0]);
    chartData[1].push(arr[1]);
    chartData[2].push(arr[2]);
    chartData[3].push(arr[3]);
    if (totIterations % averageXVal == 0) {
        let tempXValue = totIterations / averageXVal
        let tempTot = 0;
        for (let i = 0; i < 4; i++) {
            let tot = 0;
            let temp = chartData[i];
            for (let j = totIterations - averageXVal; j < totIterations; j++) {
                tot += temp[j];
            }
            tempTot += tot;
            scatterChart.data.datasets[i].data.push({ x: tempXValue, y: tot / averageXVal })
        }
        scatterChart.data.datasets[4].data.push({ x: tempXValue, y: tempTot / averageXVal })
        scatterChart.update();
    }
}

function resetGraph() {
    scatterChart.data.datasets.forEach(x => {
        x.data = [{ x: 0, y: 0 }];
    })
    for (let k = 1; k <= Math.floor(totIterations / averageXVal); k++) {
        let tempTot = 0;
        for (let i = 0; i < 4; i++) {
            let tot = 0;
            let temp = chartData[i];
            for (let j = averageXVal * (k - 1); j < averageXVal * k; j++) {
                tot += temp[j];
            }
            tempTot += tot;
            scatterChart.data.datasets[i].data.push({ x: k, y: tot / averageXVal })
        }
        scatterChart.data.datasets[4].data.push({ x: k, y: tempTot / averageXVal })
        scatterChart.update();
    }
}

function generateColor() {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
}

function darkenColor(clr) {
    let temp = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(clr);
    let rClr = parseInt(temp[1], 16)
    let gClr = parseInt(temp[2], 16)
    let bClr = parseInt(temp[3], 16)
    function partHexDark(part) {
        let hex = (Math.round(part * 0.9)).toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    function makeHex(r, g, b) {
        return "#" + partHexDark(r) + partHexDark(g) + partHexDark(b);
    }
    return makeHex(rClr, gClr, bClr);
}
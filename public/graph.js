

let checkboxes = [...document.getElementsByClassName("typeSelectInput")];
const typeSelect = [...document.getElementsByClassName("typeSelect")];

typeSelect.forEach(x => { x.addEventListener("click", () => { loadDataGraph(checkboxes[0].checked, checkboxes[1].checked, checkboxes[2].checked, checkboxes[3].checked) }) })

const dataChart = document.getElementById('dataChart');
let chartData = {
    1: [],

}

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
            data: [{ x: 0, y: -1 }, { x: 10, y: -0.5 }]
        },
        {
            label: `Reward 2`,
            borderColor: "#d1371f",
            backgroundColor: 'transparent',
            hidden: true,
            data: [{ x: 0, y: -1 }, { x: 10, y: -0.4 }]
        },
        {
            label: `Reward 3`,
            borderColor: "#165af7",
            backgroundColor: 'transparent',
            hidden: true,
            data: [{ x: 0, y: -1 }, { x: 10, y: -0.3 }]
        },
        {
            label: `Reward 4`,
            borderColor: "#9600ed",
            backgroundColor: 'transparent',
            hidden: true,
            data: [{ x: 0, y: -1 }, { x: 10, y: -0.2 }]
        },
        {
            label: `All Rewards`,
            borderColor: "#ff8c00",
            backgroundColor: 'transparent',
            hidden: true,
            data: [{ x: 0, y: -1 }, { x: 10, y: -0.1 }]
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

function loadDataGraph(id) {

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


let env = {};
let spec = {};
let agent;
let rewards = {
    abReward: 0.25,
    bgReward: 0.25,
    distReward: 0.25,
    angleReward: 0.25
}
let otherParam = {
    numSensors: 128
}

const rewardFactorInputs = [...document.getElementsByClassName("rewardFactorInputs")];
const parameterInputs = [...document.getElementsByClassName("parameterInputs")];
const otherInputs = [...document.getElementsByClassName("otherInputs")];
const startButtons = [...document.getElementsByClassName("startButtons")];

startButtons.forEach(x => { x.addEventListener("click", startNew) });



// spec.update = 'qlearn'; // qlearn | sarsa
// spec.gamma = 0.9; // discount factor, [0, 1)
// spec.epsilon = 0.2; // initial epsilon for epsilon-greedy policy, [0, 1)
// spec.alpha = 0.01; // value function learning rate
// spec.experience_add_every = 10; // number of time steps before we add another experience to replay memory
// spec.experience_size = 5000; // size of experience replay memory
// spec.learning_steps_per_iteration = 20;
// spec.tderror_clamp = 1.0; // for robustness
// spec.num_hidden_units = 100 // number of neurons in hidden layer


function startNew() {
    env = {};
    env.getNumStates = function () { return otherParam.numSensors; }
    env.getMaxNumActions = function () { return 8; }
    parameterInputs.forEach(x => {
        let temp = x.value;
        temp !== "" ? x.type !== "text" ? spec[x.id] = parseFloat(temp) : spec[x.id] = temp : null;
        console.log(spec);
    })
    rewardFactorInputs.forEach(x => {
        let temp = x.value;
        temp !== "" ? rewards[x.id] = parseFloat(temp) : null;
    })
    otherInputs.forEach(x => {
        let temp = x.value;
        temp !== "" ? otherParam[x.id] = parseFloat(temp) : null;
    })
    agent = new RL.DQNAgent(env, spec);
    alert("Updated");
}

startNew();


function dqn_learn(sensorData) {
    let action = agent.act(sensorData); // s is an array of length 8
    let reward = moveActor(action);
    agent.learn(reward); // the agent improves its Q,policy,model, etc. reward is a float
}
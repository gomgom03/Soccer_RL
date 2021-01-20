

let env = {};
let rewards = {
    abReward,
    bgReward,
    distReward,
    angleReward,
    numSensors = 128
}

const rewardFactorInputs = [...document.getElementsByClassName("rewardFactorInputs")];
const parameterInputs = [...document.getElementsByClassName("parameterInputs")];
const startButtons = [...document.getElementsByClassName("startButtons")];

startButtons.forEach(x => { x.addEventListener("click", startNew) });

function startNew() {
    env = {};

}

// spec.update = 'qlearn'; // qlearn | sarsa
// spec.gamma = 0.9; // discount factor, [0, 1)
// spec.epsilon = 0.2; // initial epsilon for epsilon-greedy policy, [0, 1)
// spec.alpha = 0.01; // value function learning rate
// spec.experience_add_every = 10; // number of time steps before we add another experience to replay memory
// spec.experience_size = 5000; // size of experience replay memory
// spec.learning_steps_per_iteration = 20;
// spec.tderror_clamp = 1.0; // for robustness
// spec.num_hidden_units = 100 // number of neurons in hidden layer

env.getNumStates = function () { return numSensors; }
env.getMaxNumActions = function () { return 8; }

let spec = { alpha: 0.01 } // see full options on top of this page
agent = new RL.DQNAgent(env, spec);

function dqn_learn(sensorData) {
    let action = agent.act(sensorData); // s is an array of length 8
    let reward = moveActor(action);
    //console.log(sensorData);
    agent.learn(reward); // the agent improves its Q,policy,model, etc. reward is a float
}
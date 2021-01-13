let env = {};
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
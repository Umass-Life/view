const GET_ALL_TASKS = "GET_ALL_TASKS";
const GET_BY_ID = "GET_BY_ID";
const CREATE_TASK = "CREATE_TASK";
const UPDATE_TASK = "UPDATE_TASK";
const DELETE_TASK = "DELETE_TASK";
let TASK_ID_COUNTER = 3;

// ACTIONS //
const _getAll = (obtainedTasks) => {
    return { type: GET_ALL_TASKS, tasks: obtainedTasks };
};

const _create = (task) => {
    return { type: CREATE_TASK, task: task};
};

const _update = (task) => {
    return { type: UPDATE_TASK, task: task };
};

const _delete = (taskId) => {
    return { type: DELETE_TASK, taskId: taskId};
};

const _getById = (taskId) => {
    return { type: GET_BY_ID, taskId: taskId};
};

// ACITON CREATORS //
// make ajax calls to api server

class TaskActionService {
    static create(text){
        let taskObj = {text: text, done: false, id: TASK_ID_COUNTER++};
        return _create(taskObj);
    }
    static _update(id, updateSchema){
        updateSchema.id = id;
        return _update(updateSchema);
    }
    static _delete(id){ return _delete(id); }
    static _getById(id){ return _getById(id); }
}

export { TaskActionService, GET_ALL_TASKS, CREATE_TASK, UPDATE_TASK, DELETE_TASK };

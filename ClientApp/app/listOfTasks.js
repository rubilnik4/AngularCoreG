var ListOfTasks = /** @class */ (function () {
    function ListOfTasks(id, name, tasksTo) {
        if (tasksTo === void 0) { tasksTo = []; }
        this.id = id;
        this.name = name;
        this.tasksTo = tasksTo;
    }
    return ListOfTasks;
}());
export { ListOfTasks };
var TaskTo = /** @class */ (function () {
    function TaskTo(id, idTable, complete, name) {
        this.id = id;
        this.idTable = idTable;
        this.complete = complete;
        this.name = name;
    }
    return TaskTo;
}());
export { TaskTo };
//# sourceMappingURL=listOfTasks.js.map
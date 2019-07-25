
export class ListOfTasks {
    constructor(
        public id?: number,
        public name?: string,
        public tasksTo: TaskTo[]=[],
    ) { }   
}
export class TaskTo {
    constructor(
        public id?: number,
        public idTable?: number,
        public complete?: boolean,
        public name?: string,
    ) { }
}
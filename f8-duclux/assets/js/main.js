const CONFIG = {
    clock: {
        selector: "#clock"
    },
    parent: {
        selector: "#todo-list",
    },
    item: {
        element: "div",
        selector: ".todo-item",
        attrs: {
            class: "todo-item"
        }
    }
}
class Clock {
    config;
    clockElement;
    date = new Date();
    timerId;
    constructor(config = {clock: {selector: 'body'}}) {
        this.config = config;
        this.clockElement = document.querySelector(this.config.clock.selector);
    }
    init() {
        this.timerId = setInterval(this.showTime.bind(this), 1000);
    }
    showTime() {
        this.date = new Date();
        const { h, m, s, session } = this.formatTime(this.date);
        const timer = h + ":" + m + ":" + s + " " + session;
        this.clockElement.innerText = timer;
    }
    formatTime(date) {
        let session = "AM";
        let h = date.getHours(), m = date.getMinutes(), s = date.getSeconds()
        if(h == 0) {
            h = 12;
        }
        if (h > 12) {
            h = h - 12;
            session = "PM";
        }
        h = (h < 10) ? "0" + h : h;
        m = (m < 10) ? "0" + m : m;
        s = (s < 10) ? "0" + s : s;
        return {h,m,s, session};
    }
    onDestroy() {
        clearInterval(this.timerId);
    }
}
const clock = new Clock(CONFIG);
class Storage {
    state = {
        items: [],
        currentItem: null
    }
    storageKey;
    constructor(storageKey = "TODO_TODAY") {
        this.storageKey = storageKey;
        this.state = JSON.parse(localStorage.getItem(this.storageKey) || "{}");
    }
    get items() {
        if(!!this.state.items && this.state.items.length > 0) {
            return this.state.items;
        }
        return [];
    }
    get currentItem() {
        return this.state.currentItem;
    }
    addItem(item) {
        let { items = [] } = this.state;
        this.state = {...this.state, items: [item,...items]};
        this.saved();
        return item;
    }
    updateItem(id, item) {
        let { items } = this.state;
        let index = this.itemIndex(id);
        if(index !== -1) {
            const itemMatched = {...items[index]};
            Object.keys(item).forEach(key => {
                itemMatched[key] = item[key];
            })
            this.state.items = [
                ...items.slice(0, index),
                {...itemMatched},
                ...items.slice(index+1)
            ]
            this.saved();
            return this.state.items;
        }
        return false;
    }
    removeItem(id) {
        this.state.items = this.state.items.filter(item => item.id !== id);
        this.saved();
        return this.state.items;
    }
    itemIndex(id) {
        return this.state.items.findIndex(item => item.id === id)
    }
    saved() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    }
}
const storage = new Storage("TODO_DATA");

class TodoItem {
    id; name; isDone; level; timestamp;
    constructor(name, level = 1) {
        this.id = this.UID();
        this.name = name;
        this.isDone = false;
        this.level = level;
        this.timestamp = new Date();
    }
    UID() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

}

class TodoList {
    config;
    listElement;
    tasks = [];
    constructor(config = {}) {
        this.config = config;
        this.listElement = document.querySelector(this.config.parent.selector);
        this.tasks = storage.items;
    }
    init() {
        this.render(this.tasks);
    }
    addTask(name, level) {
        if(name.trim()) {
            const task = new TodoItem(name, level);
            storage.addItem(task);
            const itemElement = this.createItemElement(task);
            this.listElement.insertBefore(itemElement, this.listElement.childNodes[0])
        }
    }
    deleteTask(id) {
        const items = storage.removeItem(id);
        this.render(items);
    }
    updateStatus(id) {
        const index = storage.itemIndex(id);
        let { isDone: currentStatus } = storage.items[index];
        const updated = storage.updateItem(id, {isDone: !currentStatus});
        if(updated) {
            this.render(updated)
        }
    }
    updateName(id, name) {
        const updated = storage.updateItem(id, {name});
        if(updated) {
            this.render(updated)
        }
    }

    createItemElement(item) {
        let nodeItem = document.createElement(this.config.item.element);
        const attrs = this.config.item.attrs;
        const time = new Date(item.timestamp).toLocaleDateString().split('/').slice(0,2).reverse().join('/');
        const attrsKey = Object.keys(attrs)
        attrsKey.forEach(attr => {
            nodeItem.setAttribute(`${attr}`, `${attrs[attr]}`);
        });
        nodeItem.setAttribute('data-level', `${item.level}`);
        nodeItem.setAttribute('data-completed', `${item.isDone}`);
        nodeItem.setAttribute('data-id', `${item.id}`);
        const itemContent = `
            <div 
            class="todo-item__content"
            data-edit="content" 
            >
                ${item.name}
            </div>
            ${item.level === "2"? '<div class="important icon i-important"></div>' : ""}
            <div 
            class="todo-item__actions"
            data-id=${item.id}
            >
                <div class="todo-item__timestamp">
                    ${time}
                </div>
                <div
                data-action="status" 
                class="icon ${item.isDone ? 'i-done' : 'i-check'}"></div>
                <div
                data-action="delete" 
                class="icon i-delete"></div>
            </>
            `
        nodeItem.innerHTML = itemContent;
        return nodeItem;
    }
    render(tasks) {
        this.listElement.innerHTML = "";
        tasks.forEach(item => {
            const itemElement = this.createItemElement(item);
            this.listElement.appendChild(itemElement);
        })
    }
}
function handleEvent(event) {
    const element = event.target;
    const parentElement = element.parentNode;
    const { id, completed } = parentElement.dataset;
    if(element.hasAttribute('data-action')) {
        switch (element.dataset.action) {
            case "delete":
                todoList.deleteTask(id);
                break;
            case "status":
                todoList.updateStatus(id);
                break;
            default:
                return;
        }
    }
    if(element.hasAttribute('data-edit')) {
        if(completed === 'false') {
            element.setAttribute('contenteditable', 'true');
            element.addEventListener("blur", function(e) {
                todoList.updateName(id, element.innerHTML);
            }, false);
        }
    }
}

const todoList = new TodoList(CONFIG);

//Started;
todoList.init();
clock.init();
document
    .querySelector('#task-name')
    .addEventListener('keyup', function(e) {
        if(e.keyCode === 13) {
            let importantElement = document.querySelector('#task-important')
            const level = importantElement.checked ? "2" : "1";
            todoList.addTask(this.value, level);
            importantElement.checked = false;
            this.value = "";
        }
    });
document
    .querySelector(CONFIG.parent.selector)
    .addEventListener('click', function(e) {handleEvent(e)})
document
    .querySelector(CONFIG.parent.selector)
    .addEventListener('dblclick', function(e) {handleEvent(e)})
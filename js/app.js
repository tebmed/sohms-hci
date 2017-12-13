// Connection with websocket on server
var connection = new WebSocket('ws://localhost:8003');

connection.onopen = function () {
    connection.send("Ping");
};

connection.onmessage = function (e) {
    $.post('logger.php',{
        data: {
            message: e.data,
            filename: app.filename
        }
    });
    app.logs[app.indexLogs++] = e.data;
    app.handleEvent(e.data);
};

connection.onerror = function (error) {
    console.log("WS error: "+error);
};

const protocole = {
    clear: function() {
        connection.send('clear');
    },
    init: function(scenario) {
        connection.send('init:' + JSON.stringify(scenario));
    },
    deleteOrder: function(order) {
        connection.send('deleteOrder:' + JSON.stringify(order));
    }
};


Vue.component('navigator', {
    props: {
        items: Array,
        click: Function,
        selected: String
    },
    template: '#navigator'
})

const Scenarios = {
    template: '#scenarios',
    mounted: function() {
        // Change selected item
        this.selected = this.scenarios[0].name;
        this.loadScenario(this.scenarios[0].name);
    },
    methods: {
        loadScenario: function(filename) {

            // Change selected item
            this.selected = filename;

            var editor = $("#editor");
            if (editor.children())
                editor.children().remove();

            $.ajax({
                method: "GET",
                url: "js/scenarios/"+ filename + ".json",
                success: (data) => {
					if (typeof data == "string") {
						data = JSON.parse(data);
					}
                    this.code = CodeMirror($('#editor')[0], {
                        value: JSON.stringify(data,null,4),
                        mode:  "application/json",
                        theme: "dracula",
						lint: true,
                        lineNumbers: true,
						gutters: ['CodeMirror-lint-markers']
                    });
                },
                error: (err) => {
                    console.log(err);
                }
            });
        },
        runScenarioSelected: function() {
            protocole.clear();
            protocole.init(this.code.getValue());
            data = JSON.parse(this.code.getValue());

            for (item of data.orders)
                item.status = "Waiting";
            
            app.scenarioRun = data;
            router.push("/workshop");
        }
    },
    data: () => {
        return {
            scenarios: [
                { name: "exemple" },
                { name: "ps0" },
				{ name: "ps1" },
                { name: "ps2" },
                { name: "ps3" }
            ],
            selected: null
        }
    }
};
const Workshop = { 
    template: '#workshop',
    methods: {
        deleteOrder: function(index) {
            protocole.deleteOrder(this.$root.scenarioRun.orders[index]);
            this.$root.scenarioRun.orders.splice(index, 1);
        }
    }
};

const routes = [
    { path: '/scenarios', component: Scenarios },
    { path: '/workshop', component: Workshop }
]
const router = new VueRouter({
    routes
})

var app = new Vue({
    router,
    el: '#app',
    data: {
        filename: null,
        logs: [],
        indexLogs: 0,
        scenarioRun: null
    },
    computed: {
        moment: function() {
            return window.moment;
        }
    },
    created: function() {
        this.generateFileName();
    },
    methods: {
        generateFileName: function() {
            this.filename = this.moment().format();
        },
        handleEvent: function(data) {
            var array = data.split(':');
            if (array[0] === "order") {
                for (item of this.scenarioRun.orders) {
                    if (item.id === parseInt(array[1])) {
                        item.status = array[2];
                    }
                }
            }
        }
    },
    mounted: () => {
        router.push('/scenarios');
    }
});

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
            app.scenarioRun = JSON.parse(this.code.getValue());
        }
    },
    data: () => {
        return {
            scenarios: [
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

    },
    computed: {
        scenarioRun: function() {
            return app ? app.scenarioRun : null;
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
        }
    }
});

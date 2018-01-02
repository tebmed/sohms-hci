// Connection with websocket on server
var connection = new WebSocket('ws://localhost:8003');

connection.onopen = function () {
   // connection.send("Ping");
};

connection.onmessage = function (e) {
    $.post('scenarios.php',{
        data: {
            message: e.data,
            filename: app.filename,
            action: 'log'
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
        connection.send('init:' + data.replace(/\s/g, ""));
    },
    deleteProductOfOrder: function(order_index, product_index) {
        connection.send('deleteProductOfOrder:order:'+order_index+":product:"+product_index);
    }
};


Vue.component('navigator', {
    props: {
        items: Array,
        click: Function,
        selected: String
    },
    template: '#navigator'
});

Vue.component('modal', {
    template: "#modal-template",
    methods: {
        addScenario: function() {
            var self = this;
            $.post('scenarios.php',{
                data: {
                    json: "",
                    filename: self.filename,
                    action: 'add'
                }
            }, () => {
                this.$parent.refreshList();
            });
            this.$emit('close');
        }
    },
    data: () => {
        return {
            filename: ""
        }
    }
})

const Scenarios = {
    template: '#scenarios',
    mounted: function() {
        this.refreshList();
    },
    methods: {
        refreshList: function() {
            var self = this;
            $.get('scenarios.php', 
                {
                    action: 'list'
                },
                (data) => {
                    self.scenarios = JSON.parse(data);
                    
                    // Change selected item
                    self.selected = self.scenarios[0];
                    self.loadScenario(self.scenarios[0]);
                }
            );
        },
        loadScenario: function(filename) {

            // Change selected item
            this.selected = filename;

            var editor = $("#editor");
            if (editor.children())
                editor.children().remove();

			var self = this;

            $.ajax({
                method: "GET",
                url: "scenarios/"+ filename + ".json",
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
						gutters: ['CodeMirror-lint-markers'],
                    })
					this.code.on('changes',function() {
						self.verifyScenario();
					});
                    self.verifyScenario();

                    self.saveScenario(filename);
                },
                error: (err) => {
                    console.log(err);
                }
            });
        },
		verifyScenario: function() {
			this.errors = Janet.validate(this.code.getValue(),template);
        },
        saveScenario: function(filename) {
            var codeEditor = this.code;
            $('#editor')[0].addEventListener('keydown', function(e) {
                if ((e.keyCode == 83 & e.ctrlKey) || (e.keyCode == 83 & e.metaKey)) {
                    e.preventDefault();
                    $.post('scenarios.php',{
                        data: {
                            json: JSON.stringify(codeEditor.getValue()),
                            filename: filename,
                            action: 'scenario'
                        }
                    });
                }
            });
        },
        runScenarioSelected: function() {
            protocole.clear();
            protocole.init(this.code.getValue(" "));
            data = JSON.parse(this.code.getValue());

            for (item of data.orders) {
                item.status = "Waiting";
                for(product of item.products) {
                    product.status = "Waiting";
                    product.start = "";
                    product.end = "";
                }
            }
            
            app.scenarioRun = data;
            router.push("/workshop");
        }
    },
    data: () => {
        return {
            scenarios: [],
            selected: null,
            errors: true,
            showModal: false
        }
    }
};
const Workshop = {
    template: '#workshop',
    methods: {
        deleteProductOfOrder: function(order_index, product_index) {
            protocole.deleteProductOfOrder(order_index, product_index);
            this.$root.scenarioRun.orders[order_index].products.splice(product_index, 1);
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

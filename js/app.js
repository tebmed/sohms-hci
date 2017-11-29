// Connection with websocket on server
var connection = new WebSocket('ws://localhost:8003');

connection.onopen = function () {
  connection.send('Ping');
};

connection.onmessage = function (e) {
    console.log("Server: "+e.data);
};

connection.onerror = function (error) {
    console.log("WS error: "+error);
};

/*
Vue.component('navigator', {
    props: ['items', 'click'],
    template: '<nav class="col-sm-3 col-md-2 d-none d-sm-block bg-light sidebar">\
                    <ul class="nav nav-pills flex-column">\
                        <li class="nav-item" v-for="item in items">\
                            <a class="nav-link" style="cursor: pointer;" href="#/scenarios" v-bind:class="{ active: item.name === selected }" @click="click">Scenario {{ item.name }}</a>\
                        </li>\
                    </ul>\
                </nav>',
    data: () => {
        return { selected: null }
    }
})*/

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
            var scope = this;

            $.ajax({
                method: "GET",
                url: "js/scenarios/"+ filename + ".json",
                success: (data) => {
                    CodeMirror($('#editor')[0], {
                        value: data,
                        mode:  "javascript",
                        theme: "dracula",
                        lineNumbers: true
                    });
                },
                error: (err) => {
                    console.log(err);
                }
            });
        }
    },
    data: () => { 
        return { 
            scenario: null,
            scenarios: [
                {
                    name: "ps1"
                },
                {
                    name: "ps2"
                },
                {
                    name: "ps3"
                }
            ],
            selected: null
        } 
    }
};
const Atelier = { template: '<h1>Atelier</h1>' }

const routes = [
    { path: '/scenarios', component: Scenarios },
    { path: '/atelier', component: Atelier }
]
const router = new VueRouter({
    routes
})

var app = new Vue({
    router,
    el: '#app',
    data: {
        currentRoute: window.location.pathname
    }
});
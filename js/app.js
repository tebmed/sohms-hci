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


const Scenarios = { 
    template: '#scenarios',
    mounted: function() {
        var scope = this;

        $.ajax({
            method: "GET",
            url: "js/scenarios/"+ this.$route.params.filename + ".json",
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
    },
    data: () => { return { scenario: null } }
};
const Atelier = { template: '<h1>Atelier</h1>' }

const routes = [
    { path: '/scenarios/:filename', component: Scenarios },
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
var app = new Vue({
    el: '#app',
    data: {

    },
    methods: {
        test: function(data) {
            console.log("here" + data);
            // Try to call api REST with ajax
            var path = '',
                verb = '';
            // $.ajax(path ,{
            //     method: verb,
            //     data: data,
            //     success: function(data) {

            //     },
            //     error: function(error) {
                    
            //     }
            // });
        }
    }
});
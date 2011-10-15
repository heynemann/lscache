(function(globals) {

    globals.Lsd = new Class({
        initialize: function(localStorage){
            this.storage = localStorage;
            if (!this.storage) {
                this.storage = globals.localStorage;
            }
            this.registeredItems = {};
        },

        registerCache: function(key, cacheMiss, duration) {
            if (this.registeredItems[key]) {
                throw "Can't re-register cache item '" + key + "'.";
            }
            this.registeredItems[key] = {
                key: key,
                cacheMiss: cacheMiss,
                duration: duration
            };
        }
    });

})(window);

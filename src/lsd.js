(function(globals) {

    globals.Lsd = new Class({
        initialize: function(localStorage){
            this.storage = localStorage;
            if (!this.storage) {
                this.storage = globals.localStorage;
            }
            this.registeredItems = {};
            if (this.storage.items) {
                this.cachedItems = JSON.parse(this.storage.items);
            } else {
                this.cachedItems = [];
            }
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
        },

        time: function() {
            return +new Date();
        },

        get: function(key, callback) {
            if (this.cachedItems[key] && this.cachedItems[key].expiration > this.time()) {
                callback(this.cachedItems[key].value);
            } else {
                this.registeredItems[key].cacheMiss(function(data) {
                    this.cachedItems[key] = {
                        value: data,
                        expiration: this.time() + (this.registeredItems[key].duration * 1000)
                    };
                    this.storage.items = JSON.stringify(this.cachedItems);

                    callback(data);
                }.bind (this));
            }
        }
    });

})(window);

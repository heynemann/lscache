(function(globals) {

    globals.Lsd = new Class({
        initialize: function(localStorage){
            this.storage = localStorage;
            if (!this.storage) {
                this.storage = globals.localStorage;
            }
            this.registeredItems = {};

            if (!this.storage.items) this.storage.items = '{}';
            this.cachedItems = JSON.parse(this.storage.items);

            this.removeExpiredItems();
        },

        removeExpiredItems: function() {
            var changed = false;

            for (key in this.cachedItems) {
                if (this.isExpired(key)) {
                    delete this.cachedItems[key];
                    changed = true;
                }
            }

            if (changed) this.persistCache();
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

        persistCache: function() {
            this.storage.items = JSON.stringify(this.cachedItems);
        },

        isExpired: function(key) {
            return (this.cachedItems[key] == null) || this.cachedItems[key].e < this.time();
        },

        get: function(key, callback) {
            if (!this.registeredItems[key]) {
                throw("Can't find key '" + key + "'.");
            }
            if (!this.isExpired(key)) {
                callback(this.cachedItems[key].v);
            } else {
                this.registeredItems[key].cacheMiss(function(data) {
                    this.cachedItems[key] = {
                        v: data,
                        e: this.time() + (this.registeredItems[key].duration * 1000)
                    };
                    this.persistCache();

                    callback(data);
                }.bind (this));
            }
        }
    });

})(window);

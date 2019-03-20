function Publish() {
    this.subs = {};
}

Publish.prototype = {
    on: function(type, callback) {
        if (!this.subs[type]) {
            this.subs[type] = [];
        }

        this.subs[type].push(callback);
    },
    emit: function(type) {

        var params = Array.prototype.slice.call(arguments, 1);

        if (this.subs[type] && this.subs[type].length) {
            this.subs[type].forEach(item => {
                item.apply(this, params)
            })
        } else {
            console.log('还没有监听改事件')
        }
    }
}

var p1 = new Publish();

p1.on('a1', function() {
    console.log('a1被触发了...', arguments)
})

p1.on('a1', function() {
    console.log('a2被触发了...')
})

p1.emit('a1', '第二个参数', true, 123);
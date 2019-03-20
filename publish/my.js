function Publish() {
    this.subs = {};
}

Publish.prototype = {
    on: function(type, fn) {
        //第一次声明为数组
        if (!this.subs[type]) {
            this.subs[type] = [];
        }

        this.subs[type].push(fn);
    },
    emit: function(type) {

        //将除掉事件名的参数放到一个数组中
        var params = Array.prototype.slice.call(arguments, 1);

        if (this.subs[type] && this.subs[type].length) {
            this.subs[type].forEach(item => {

                //将后面的参数都传给item
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
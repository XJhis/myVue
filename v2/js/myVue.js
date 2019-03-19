//将DOM节点转为文档节点且赋值
function nodeToFragment(node, vm) {
    var pp = document.createDocumentFragment(),
        child = null;

    while (child = node.firstChild) {
        compile(child, vm);
        pp.appendChild(child);
    }

    return pp;

}

//对页面中所有有MyVue的指令或者变量的节点进行编译
function compile(node, vm) {
    var reg = /\{\{(.*)\}\}/,
        attr;

    //元素节点
    if (node.nodeType == 1) {
        attr = node.attributes;

        for (var i = 0; i < attr.length; i++) {
            if (attr[i].nodeName === "v-model") {
                var val = attr[i].nodeValue;
                //添加事件
                node.addEventListener('input', function(e) {
                    vm[val] = e.target.value;
                })

                //将data中的值给文本框                
                //每一个页面中有变量的节点都会有一个自己的Watcher;

                new Watcher(vm, node, val);

                node.removeAttribute('v-model');


            }
        }
    }

    //如果为文本节点
    if (node.nodeType == 3) {
        if (reg.test(node.nodeValue)) {

            var name = RegExp.$1;

            new Watcher(vm, node, name);
        }
    }

}

//生成的实例，首次会将该实例添加到对应的属性的Deep中
//后面改变DOM中节点值
function Watcher(vm, node, key) {
	Deep.target = this;
	this.name  = key;
	this.node = node;
	this.vm = vm;

	this.update();

	Deep.target = null;
}

Watcher.prototype.update = function () {

	if (this.node.nodeType === 1) {
		this.node.value = this.vm[this.name]; //这里会取vm中值，会执行该属性的get方法
	}else {
		this.node.nodeValue = this.vm[this.name];
	}
}

//给data中的所有属性添加数据劫持
function observe(obj, vm) {
    Object.keys(obj).forEach(key => {
        defineReactive(vm, key, obj[key]);
    })
}

function defineReactive(vm, key, val) {
    // 需要用一个中间变量存储data中变量的值
    var deep = new Deep();

    Object.defineProperty(vm, key, {
        get: function() {
        	//只有首次取值的时候会执行该方法，将Watcher实例放到deep实力中去
        	if (Deep.target) {
        		deep.addSubs(Deep.target)
        	}

            return val;
        },
        set: function(newVal) {
            if (newVal === val) {
                return;
            } else {
                //先赋值在发布通知
                val = newVal;
                // console.log(val); // 方便看效果
                deep.notify();
            }
        }
    });

}




//生成的deep实例会存储某个属性所有的Watcher
function Deep() {
    this.subs = [];
}

Deep.prototype.addSubs = function(fn) {
    this.subs.push(fn);
}

Deep.prototype.notify = function(fn) {
    this.subs.forEach(item => {
        item.update();
    })
}




function MyVue(options) {
    this.data = options.data;

    observe(this.data, this);

    var app = document.getElementById(options.el);

    //利用了文档碎片。操作DOM效率更高
    var frag = nodeToFragment(app, this);

    app.appendChild(frag);

}


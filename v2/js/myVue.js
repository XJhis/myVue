//将DOM节点转为文档节点且赋值
function nodeToFragment(node, vm) {
    var pp = document.createDocumentFragment(),
        child = null;

    while (child = node.firstChild) {
        // console.log(child)
        compile(child, vm);
        pp.appendChild(child);
    }

    return pp;

}

//将有vue指令进行编译
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
                    // console.log('e:', e.target.value)
                    vm[val] = e.target.value;
                })

                node.value = vm.data[val];
                node.removeAttribute('v-model');
                

            }
        }
    }

    //如果为文本节点
    if (node.nodeType == 3) {
        if (reg.test(node.nodeValue)) {
            var name = RegExp.$1;
            node.nodeValue = vm.data[name];
        }
    }
}


function defineReactive(vm, key, val) {
    // 需要用一个中间变量存储data中变量的值
    Object.defineProperty(vm, key, {
        get: function () {
            return val;
        },
        set: function (newVal) {
            if (newVal === val) {
                return; 
            } else {
                val = newVal;
                console.log(val); // 方便看效果
            }
        }
    });

}

function observe(obj, vm) {
    Object.keys(obj).forEach(key => {
        defineReactive(vm, key, obj[key]);
    })
}


function MyVue(options) {
    this.data = options.data;

    observe(this.data, this);

    var app = document.getElementById(options.el);

    var frag = nodeToFragment(app, this);    

    app.appendChild(frag);

}

// var app = new MyVue({
// 			el: '#app',
// 			data: {
// 				name: 'pitter'
// 			}
// 		})
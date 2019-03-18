

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
	if (node.nodeType==1) {
		attr = node.attributes;

		for (var i = 0; i < attr.length; i++) {
			if (attr[i].nodeName==="v-model") {
				var val = attr[i].nodeValue;
				node.value = vm.data[val];
				node.removeAttribute('v-model')
			}
		}
	}

	//如果为文本节点
	if (node.nodeType==3) {
		if (reg.test(node.nodeValue)) {
			var name = RegExp.$1;
			node.nodeValue = vm.data[name];
		}
	}
}

function MyVue(options) {
	// body...
	this.data = options.data;

	var app = document.querySelector(options.el);

	var frag = nodeToFragment(app, this);


	document.querySelector(options.el).appendChild(frag);

}
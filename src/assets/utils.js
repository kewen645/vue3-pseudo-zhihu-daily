// 检测是否为纯粹的对象
export const isPlainObject = function isPlainObject(obj) {
  let proto, Ctor;
  if (!obj || Object.prototype.toString.call(obj) !== "[object Object]") return false;
  proto = Object.getPrototypeOf(obj);
  if (!proto) return true;
  Ctor = Object.prototype.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor === "function" && Ctor === Object;
};

// 处理最大宽度
export const handleMaxWidth = function handleMaxWidth() {
  let HTML = document.documentElement,
    app = document.querySelector('#app'),
    size = parseFloat(HTML.style.fontSize);
  if (size > 75) {
    HTML.style.fontSize = '75px';
    app.style.width = '750px';
    return;
  }
  app.style.width = '100%';
  app.style.minHeight = HTML.clientHeight + 'px';
};

// 日期格式化
export const formatTime = function formatTime(time, template) {
  if (typeof time !== "string") {
    time = new Date().toLocaleString('zh-CN', { hour12: false });
  }
  if (typeof template !== "string") {
    template = "{0}年{1}月{2}日 {3}:{4}:{5}";
  }
  // 解析出年月日等信息
  // match()函数是String对象的方法，参数是正则表达式，返回值是数组。
  // test()函数是RegExp对象的方法，参数是字符串，返回值是boolean类型。
  // exec()函数是RegExp对象的方法，参数是字符串，查找并返回当前的匹配结果，并以数组的形式返回。
  let arr = [];
  if (/^\d{8}$/.test(time)) {
    let [, $1, $2, $3] = /^(\d{4})(\d{2})(\d{2})$/.exec(time);
    arr.push($1, $2, $3);
  } else {
    arr = time.match(/\d+/g);
  }
  // 把获取的数据替换模板
  // replace函数中的callback只要匹配就执行一次, _为整个match, $1为匹配()分组中的第一个分组，这里是{}中的数字
  return template.replace(/\{(\d+)\}/g, (_, $1) => {
    let item = arr[$1] || "00";
    if (item.length < 2) item = "0" + item;
    return item;
  });
};
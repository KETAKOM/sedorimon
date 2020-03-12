

const rank_up_limit = 40000;
const three_months_total_sales_limit = 4

// 「Webアプリケーションとして導入」しているGASのURL
const gasUrl = "https://script.google.com/macros/s/AKfycbxR8Rf_EaGZ8FIT5q_HT-QshRjwgZPeyO00yas_HAbvwFXvoMtn/exec";

// $(function() {
//     // 画面にボタンを挿入する
//     $('.item_box').prepend('<input type="button" id="postBtn" value="リストに保存">');

//     // ボタンがクリックされたときの処理
//     $('#postBtn').on('click', function() {
        
//     });
// });

window.onload = function() {
    var l = false;
    l = Logic();

    if (l === true) {
        Acrion();
        return;
    }
    BadAction();
}



function Logic () {
    // // ランキングでのチェック
    // var rank = $(".data_ranking").text();
    // if (rank >= rank_up_limit) {
    //     return false;
    // }

    // 中古販売数でのチェック
    var tr = $(".table-bordered tbody").children('tr');
    var second_hand_goos = tr.eq(3);
    var three_months_total_sales = second_hand_goos.children('td').eq(5).text();
    
    if (three_months_total_sales < three_months_total_sales_limit) {
        return false;
    }

    return true;
}

function Acrion() {
    Save();
    CloseWindow();
}

function BadAction() {
    CloseWindow();
}

function CloseWindow() {
    window.close();
}

function Save() {
    var obj = {
        name: "",
        mono_url: "",
        amazon_url: "",
        asin: "",
        jan: "",
        standard_num: "",
        rank: "",
        used_lowest_price: "",// 中古品の最安値
        used_lowest_price_get: "",// 中古品の最安値で利益が出る金額
        lowest_price_near_new: "",// 中古品でほぼ新品状態の最安値
        lowest_price_near_new_get: "", // 中古品でほぼ新品状態の利益が出る値
        quantity: "",// 出品者数
        used_sales: "", //3ヶ月間の販売数
    }

    var amazon_detail = $(".product_data_summary_box").prev("div").children("h3").children("a");

    obj.name = amazon_detail.text();
    obj.mono_url = location.href;
    obj.amazon_url = amazon_detail.attr("href");
    obj.asin = $("#_asin").text();
    obj.jan = $("#export_ean_code_wrap").children(".clip_bd").text();
    obj.standard_num = $("#export_ean_code_wrap").parent().next("span").children(".clip_bd").text();
    obj.rank = $(".data_ranking").text();

    var used = $(".used_data.base");
    obj.used_lowest_price = used.children(".price.used_price_color").text();
    obj.used_lowest_price_get = used.children(".used_price_color.item_conditions_data_box").children(".prime_price").children(".self_ship").text();

    var sub_used_price = $(".sub_condition_price_row.base.oc_row.mint.active");
    obj.lowest_price_near_new = sub_used_price.children(".price.sub_condition_price_color._btn_size_style.item_conditions_data_box").text();
    obj.lowest_price_near_new_get = $(".self_ship").data('nyukin-price');

    obj.quantity = $(".quantity.used_price_color._btn_size_style.item_conditions_data_box").data('total-count');
    obj.used_sales = $(".sales_data.used.used_price_color.item_conditions_data_box").children(".sales").text();

    console.log(obj);
    post2GAS(obj);
}

function post2GAS(obj){
    var data = {
        name: obj.name,
        mono_url: obj.mono_url,
        amazon_url: obj.amazon_url,
        asin: obj.asin,
        jan: obj.jan,
        standard_num: obj.standard_num,
        rank: obj.rank,
        used_lowest_price: obj.used_lowest_price,
        used_lowest_price_get: obj. used_lowest_price_get,
        lowest_price_near_new: obj.lowest_price_near_new,
        lowest_price_near_new_get: obj.lowest_price_near_new_get,
        quantity: obj.quantity,
        used_sales: obj.used_sales,
    }

    console.log(data);
    $.ajax({
        type: 'POST',
        url: gasUrl,
        data: JSON.stringify(data)
    })
    .done( function(data) {
        console.log(data);
        console.log("成功");
    })
    .fail( function(jqXHR, textStatus, errorThrown) {
        console.log("失敗");
        console.log("XMLHttpRequest : " + jqXHR.status);
        console.log("textStatus : " + textStatus);
        console.log("errorThrown : " + errorThrown);
    })
    .always( (data) => {
        console.log("処理終了");
    });
}
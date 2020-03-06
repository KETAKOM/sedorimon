

const rank_up_limit = 40000;
const three_months_total_sales_limit = 3

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
    // ランキングでのチェック
    var rank = $(".data_ranking").text();
    if (rank >= rank_up_limit) {
        return false;
    }

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
    alert("OK");
}

function BadAction() {
    CloseWindow();
}

function CloseWindow() {
    window.close();
  }
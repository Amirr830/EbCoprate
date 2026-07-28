export const fa2En = (str) => {
    var persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
    var arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g]
    if (typeof str === 'string') {
        for (var i = 0; i < 10; i++) {
            str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
        }
    }
    return str;
}

export const number2PersianText = (value) => {
    if (value >= 1000000000000)
        return "";
    var yekan = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
    var dahgan = ["", "ده", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"]
    var sadgan = ["", "یکصد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصت", "هفتصد", "هشتصد", "نهصد"]
    var hezar = ["", "هزار", "میلیون", "میلیاد"]
    var ten2twenty = ["", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده"]

    const b1 = 1000000000;
    const m1 = 1000000;
    const t1 = 1000;
    var Bil = parseInt((value / b1).toFixed(20));//میلیارد
    var Mel = parseInt(parseInt(value % b1) / m1);//میلیون
    var Tho = parseInt(parseInt(value % m1) / t1);//هزار
    var Zer = parseInt(value % t1);//صد

    var number = [Zer, Tho, Mel, Bil];

    console.log(number, value, b1)

    var total = "";
    for (var i = number.length; i > 0; i--) {
        var vTemp = number[i - 1];
        var s = parseInt(vTemp / 100);
        var d = parseInt((vTemp % 100) / 10);
        var y = parseInt((vTemp % 100) % 10);

        if (vTemp != 0) {
            if (!total == '')
                total += "و ";


            var temp = sadgan[s];

            if (d == 1) {
                if (ten2twenty[y] == '' || temp?.trim() == '')
                    temp += "";
                else
                    temp += " و ";
                temp += ten2twenty[y];
            } else {
                if (dahgan[d] == '' || temp?.trim() == '')
                    temp += " ";
                else
                    temp += " و ";
                temp += dahgan[d];

                if (yekan[y] == '' || temp?.trim() == '')
                    temp += " ";
                else
                    temp += " و ";
                temp += yekan[y];
            }
            total += temp + " " + hezar[i - 1] + " ";
        }
    }


    return total?.trim() == '' ? "صفر" : total?.trim();
}



export function setComma(x) {
    if (x == '' || x == null || x == undefined) return '0'
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}



export function extractNumber(x) {
    try {
        if (x == '' || x == null || x == undefined) return ''
        var d = fa2En(x)
        // var numberPattern = /\d+/g
        var numberPattern = /\d+[.]?/g
        return d.match(numberPattern).join('')
    } catch (e) {
        console.log(e)
    }
}


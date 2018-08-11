import _ from 'lodash'
import moment from 'moment';
const sformat = require('string-format');

// const MONTH_LIST = ["january", ""]
const DATE = (x) => x.getDate()
const YEAR = (x) => x.getYear()+1900;
const MONTH_NUM = (x) => x.getMonth()+1;
const MONTH = (obj, cap=false) => {
    const x = obj.getMonth();
    const _cap_f = (word) => cap ? (word.split("").map((ii,jj) => jj == 0 ? ii.toUpperCase() : ii).join("")) : word;
    switch(x){
        case 0: return _cap_f("january")
        case 1: return _cap_f("february")
        case 2: return _cap_f("march")
        case 3: return _cap_f("april")
        case 4: return _cap_f("may")
        case 5: return _cap_f("june")
        case 6: return _cap_f("july")
        case 7: return _cap_f("august")
        case 8: return _cap_f("september")
        case 9: return _cap_f("october")
        case 10: return _cap_f("november")
        case 11: return _cap_f("december")
        default: return ""
    }
}

const PAD2 = (num) => {
    if (num>=0 && num < 10) return "0"+new String(num);
    return num;
}

const formatDateDay = (d) => moment(d).format("YYYY-MM-DD");

const msToHours = (ms) => ms/3600000;

const truncateDecimal = (num, dig) => num.toFixed(2)

const dformat = (x, options={cap: true, month_num: true, pretty: false, detailed: false}) => {
    const { cap, month_num, pretty, detailed } = options;
    const _date = DATE(x);
    const _month = month_num ? MONTH_NUM(x) : MONTH(x, cap)
    const _year = YEAR(x);
    if (detailed){
        return sformat("{0}-{1}-{2} {3}:{4}:{5}", _year, _month, _date, PAD2(x.getHours()),
                        PAD2(x.getMinutes()), PAD2(x.getSeconds()))
    }
    if (pretty) return sformat("{0} {1}, {2}", _date, MONTH(x, cap), _year);
    return sformat("{2}-{1}-{0}", PAD2(_date), PAD2(_month), _year)
}

export {
    DATE,
    YEAR,
    MONTH,
    MONTH_NUM,
    dformat,
    formatDateDay,
    truncateDecimal,
    msToHours
}

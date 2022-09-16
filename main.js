const exprInp = document.querySelector("#input");
const evalBtn = document.querySelector(".eval-btn");
const resInp = document.querySelector("#result");

evalBtn.addEventListener("click", function(){
    let expr = exprInp.value.replaceAll(" ", "");
    if (noInvalidChars(expr)){
        const result = evaluate(expr);
        if (result == "" || result == undefined) { errorhandler(); }
        else { resInp.value = result; }
    }
    else { errorhandler(); }
})

function noInvalidChars(s){
    for (let i = 0; i < s.length; i++){
        if (s[i] != '0' && s[i] != '1' && s[i] != '2' && s[i] != '3' && s[i] != '4' && s[i] != '5' && s[i] != '6' &&
            s[i] != '7' && s[i] != '8' && s[i] != '9' && s[i] != '*' && s[i] != '/' && s[i] != '+' && s[i] != '-' &&
            s[i] != '(' && s[i] != ')') { return false; }
    }
    return true;
}

function errorhandler(){
    alert("Invalid Expression");
    exprInp.value = "";
    resInp.value = "";
}

function evaluate(s){
    s = evalParen(s);
    s = finalEval(s);
    return s;
}

function evalParen(s){
    while (s.includes("(") || s.includes(")")){
        let op_i = -1; let cl_i = -1;
        let p_i = getParenIndexes(s);
        if (p_i == "") { return ""; }
        else {
            let pars = p_i.split(" ");
            op_i = parseInt(pars[0]);
            cl_i = parseInt(pars[1]);
        }
        s = s.replace(s.substr(op_i, cl_i - op_i + 1), evaluate(s.substr(op_i + 1, cl_i - op_i - 1)));
    }
    return s;
}

function getParenIndexes(s){
    let op_i = s.indexOf("("); let cl_i = s.indexOf(")");
    if (op_i == -1 || cl_i == -1 || cl_i < op_i + 2) { return ""; }
    while (cl_i != -1){
        if (evaluate(s.substr(op_i + 1, cl_i - op_i - 1)) != "") { return `${op_i} ${cl_i}`; }
        cl_i = s.substr(cl_i + 1).indexOf(")") + cl_i + 1;
    }
    return "";
}

function finalEval(s){
    if (s.length < 2 && s != "0" && s != "1" && s != "2" && s != "3" && s != "4" && s != "5" && s != "6" &&
        s != "7" && s != "8" && s != "9") { return ""; }
    
    while (s.includes("*") || s.includes("/")){
        let mul_i = s.indexOf("*"); let div_i = s.indexOf("/");

        if (mul_i == -1) { s = evalDiv(s, div_i); }
        else if (div_i == -1) { s = evalMul(s, mul_i); }
        else if (mul_i < div_i) { s = evalMul(s, mul_i); }
        else { s = evalDiv(s, div_i); }

        if (s == "") { return ""; }
    }

    while (s.includes("+") || s.substr(1).includes("-")){
        let add_i = s.indexOf("+");
        let sub_i = s.substr(1).indexOf("-") + 1; if (sub_i == 0) { sub_i--; }

        if (add_i == -1) { s = evalSub(s, sub_i); }
        else if (sub_i == -1) { s = evalAdd(s, add_i); }
        else if (add_i < sub_i) { s = evalAdd(s, add_i); }
        else { s = evalSub(s, sub_i); }

        if (s == "") { return ""; }
    }

    return s;
}

function evalMul(s, i){
    if (i == 0 || i == s.length - 1) { return ""; }

    let l_op = getLeftOp(s, i);
    let r_op = getRightOp(s, i);
    if (l_op == "" || r_op == "") { return ""; }

    let new_s = (parseFloat(l_op) * parseFloat(r_op)).toString();
    let old_s = s.substr(i - l_op.length, l_op.length + 1 + r_op.length);
    s = s.replace(old_s, new_s);
    return s;
}

function evalDiv(s, i){
    if (i == 0 || i == s.length - 1) { return ""; }

    let l_op = getLeftOp(s, i);
    let r_op = getRightOp(s, i);
    if (l_op == "" || r_op == "") { return ""; }

    if (parseFloat(r_op) == 0.0) { return ""; }
    let new_s = (parseFloat(l_op) / parseFloat(r_op)).toString();
    let old_s = s.substr(i - l_op.length, l_op.length + 1 + r_op.length);
    s = s.replace(old_s, new_s);
    return s;
}

function evalAdd(s, i){
    if (i == 0 || i == s.length - 1) { return ""; }

    let l_op = getLeftOp(s, i);
    let r_op = getRightOp(s, i);
    if (l_op == "" || r_op == "") { return ""; }

    let new_s = (parseFloat(l_op) + parseFloat(r_op)).toString();
    let old_s = s.substr(i - l_op.length, l_op.length + 1 + r_op.length);
    s = s.replace(old_s, new_s);
    return s;
}

function evalSub(s, i){
    if (i == 0 || i == s.length - 1) { return ""; }

    let l_op = getLeftOp(s, i);
    let r_op = getRightOp(s, i);
    if (l_op == "" || r_op == "") { return ""; }

    let new_s = (parseFloat(l_op) - parseFloat(r_op)).toString();
    let old_s = s.substr(i - l_op.length, l_op.length + 1 + r_op.length);
    s = s.replace(old_s, new_s);
    return s;
}

function getLeftOp(s, i){
    let li = i-1;
    if (s[li] == '*' || s[li] == '/' || s[li] == '+' || s[li] == '-') { return ""; }

    while (li != -1 && s[li] != '*' && s[li] != '/' && s[li] != '+' && s[li] != '-') { li--; } li++;
    if ((li == 1 && s[0] == '-') || (li > 1 && s[li-1] == '-' && (s[li-2] == '*' || s[li - 2] == '/' ||
        s[li - 2] == '+' || s[li - 2] == '-'))) { li--; }

    return s.substr(li, i-li);
}

function getRightOp(s, i){
    let ri = i + 1;
    if (s[ri] == '*' || s[ri] == '/' || s[ri] == '+') { return ""; }
    if (s[ri] == '-') { ri++; }

    while (ri != s.length && s[ri] != '*' && s[ri] != '/' && s[ri] != '+' && s[ri] != '-') { ri++; } ri--;

    return s.substr(i+1, ri-i);
}
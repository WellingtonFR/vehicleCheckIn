//Valida data de nascimento
function verifyDate(date) {
    date = date.replace(/\//g, "-"); //substitui barra por hífen
    var data_array = data.split("-"); // quebra a data em array

    if (date_array[0].length != 4) {
        date = new Date(date_array[2], date_array[1] - 1, date_array[0]) // data no formato yyyy/MM/dd
    }

    // comparando as datas
    if (date < new Date()) {
        return true
    }

    return false
}

//altera a data para salvar no formato padrão do javascript

//Pega a data atual dd/mm/yyyy
function getDate(id) {
    let date = new Date();
    let month = (date.getMonth() + 1).toString()
    let day = (date.getDate()).toString()
    if (month.length == 1) {
        month = "0" + month
    }
    if (day.length == 1) {
        day = "0" + day
    }
    let today = day + "/" + month + "/" + date.getFullYear()
    $(id).val(today)
}

//Calendário
function calendar(id) {
    $(id).datepicker({
        format: "dd/mm/yyyy",
        days: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
        daysShort: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"],
        daysMin: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"],
        months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        monthsShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    })
}

//Troca formato monetário para exibição
function replaceValueIn(valor) {
    valor.toLocaleString('pt-br', { minimumFractionDigits: 2 });
}
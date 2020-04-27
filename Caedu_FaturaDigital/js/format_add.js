window.addEventListener("load", function (event) {
    event.preventDefault()
    var sms_add = sessionStorage.getItem('add_status_sms')
    var emailCadastrado = sessionStorage.getItem('email_c ')


    if (sms_add !== null) {
        document.getElementById("message_email").innerHTML = " Fatura já aderida via e-mail "
        document.getElementById("emailFatDigital").value = emailCadastrado
    }

})


window.addEventListener("load", function (event) {
    event.preventDefault()
    var numcell = sessionStorage.getItem('numcell')
    if (numcell !== this.undefined) {
        try {
            var area = numcell.slice(0, 2)
            var telefone = numcell.slice(2)
            document.getElementById("message_error").innerHTML = " Fatura já aderida via sms "
            document.getElementById("smsFatDigitalDD").value = area
            document.getElementById("smsFatDigital").value = telefone
        }
        catch{

        }

    }

})





document.getElementById('checkboxemail').addEventListener('change', (event) => {
    document.getElementById("message_error").innerHTML = ""
    document.getElementById("tipeFaturaname").innerHTML = "E-mail"

    if (document.getElementById('checkboxemail').checked == true) {
        document.getElementById('checkboxsms').checked = false
    }
})

document.getElementById('checkboxsms').addEventListener('change', (event) => {
    document.getElementById("message_email").innerHTML = ""
    document.getElementById("tipeFaturaname").innerHTML = "SMS"
    if (document.getElementById('checkboxsms').checked == true) {
        document.getElementById('checkboxemail').checked = false
    }
})

document.getElementById("termos_add").addEventListener('click', function () {
    let emailchecked = document.querySelector("#checkboxemail").checked
    let smschecked = document.querySelector("#checkboxsms").checked
    if (emailchecked === true) {
        PDFObject.embed("_Faq_Termos/Termo_de_Adesao_Fatura_Digital_via_EMAIL.pdf", "#example1");
        document.getElementById("tipoAdessao").innerHTML = "e-mail"
    } else if (smschecked === true) {
        PDFObject.embed("_Faq_Termos/Avanti_Termo_de_Adesao_Fatura_Digital_via_SMS.pdf", "#example1");
        document.getElementById("tipoAdessao").innerHTML = "sms"
    }
})






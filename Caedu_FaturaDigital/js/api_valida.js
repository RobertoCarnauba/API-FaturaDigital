

function mascaraDate(d, e) {
    return new Promise((res, rej) => {
        d.value.replace('/\/\//', '/')
        if (e.keyCode != 8 && e.keyCode != 46) {
            if (d.value.length == 2) {
                d.value += '/'
                res()
            } else if (d.value.length == 5) {
                d.value += '/'
                res()
            } else if (d.value.length == 3) {
                let m = d.value.split('')
                d.value = m[0] + m[1] + '/' + m[2]
                res()
            } else if (d.value.length == 6) {
                let m = d.value.split('')
                d.value = m[0] + m[1] + m[2] + m[3] + m[4] + '/' + m[5]
                res()
            }
        }
    })
}

function fMasc(objeto, mascara) {
    obj = objeto
    masc = mascara
    setTimeout("fMascEx()", 1)
}
function fMascEx() {
    obj.value = masc(obj.value)
}
function mCPF(cpf) {
    cpf = cpf.replace(/\D/g, "")
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    return cpf
}


'use strict';

const baseurl = "https://cards-api-hml-v3.marketpay.com.br:8055";

let acesso_L = "havantisys"
let acesso_S = "havantisys.CDT1"



//ok
function getConsulta(e) {
    document.getElementsByClassName('loader')[0].style.display = 'flex'
    document.getElementById("erro_server").innerHTML = ""
    e.preventDefault()
    document.getElementById('alert_cpf').innerHTML = ""
    document.getElementById("alert_nasc").innerHTML = ""

    let cpf = document.getElementById("cpf").value.split(".").join("").split("-").join("");
    let dataiput = document.getElementById("txtDataNasc").value
    if (cpf !== "") {
        if (cpf.length > 10) {
            autenticar().then(token => {
                consultaCpf(token, cpf).then(idCliente => {
                    sessionStorage.setItem("CPF", cpf)
                    if (idCliente != undefined) {
                        consultInformacoes()
                        consultadataNasc(token, cpf).then(newDate => {
                            if (dataiput !== "" || dataiput.length === 10) {
                                if (dataiput == newDate) {
                                    // document.getElementsByClassName("loader")[0].style.display = 'flex'
                                    ConsultaIDCell(idCliente, "", 3).then(() => {
                                        //alert(sessionStorage.getItem("numcell"))
                                        window.location.href = "addfatura.html"
                                    })

                                } else {
                                    //alert("Data de nascimento incorreta, tente novamente")
                                    document.getElementsByClassName('loader')[0].style.display = 'none'
                                    document.getElementById("alert_nasc").innerHTML = "Data de nascimento incorreta, tente novamente"
                                }

                            } else {
                                //alert("Data não preenchida")
                                document.getElementsByClassName('loader')[0].style.display = 'none'
                                document.getElementById("alert_nasc").innerHTML = "Data não preenchida"

                            }


                        })

                    }
                }).catch(e => { })
            }).catch(e => { })
        } else {
            alert("CPF inválido, digite novamente!")
            console.log("Erro de requição")

        }
    } else {
        //alert("Digite seu CPF!")
        document.getElementsByClassName('loader')[0].style.display = 'none'
        document.getElementById('alert_cpf').innerHTML = 'Digite seu CPF!'

    }
}

//ok
function autenticar() {
    return new Promise((resolve, reject) => {
        let data = {
            login: "",
            senha: ""
        }
        var request = new XMLHttpRequest()
        request.timeout = 10000
        request.open('POST', baseurl + '/autenticacao/tokens', true)
        data.login = acesso_L;
        data.senha = acesso_S;
        let dataSend = JSON.stringify(data)
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.onload = function () {
            if (request.status === 200) {
                document.getElementsByClassName('loader')[0].style.display = 'flex'
                let objResponse = JSON.parse(request.responseText)
                sessionStorage.setItem('token', objResponse.data)
                resolve(objResponse.data)
            } else {
                reject()
                console.log('Erro na consulta do CPF, tente novamente!')
            }
        }
        request.ontimeout = function () {
            //alert("Erro no servidor, entre em contato com o administrador")
            document.getElementById("erro_server").innerHTML = "Erro no servidor, entre em contato com o administrador"
            document.getElementsByClassName('loader')[0].style.display = 'none'
            document.getElementById("cpf").value = ""
            document.getElementById("txtDataNasc").value = ""
        };
        request.send(dataSend)
    }).catch(e => { })
}

//ok
async function consultaCpf(token, cpf) {
    window.addEventListener("load", function () {
        var load_screen = document.getElementById("load_screen");
        document.body.removeChild(load_screen);
    });
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest()
        request.timeout = 10000
        request.open('GET', baseurl + '/api/api/v3/portadores/consulta-cliente-cpf?cpf=' + cpf, true)
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.setRequestHeader('Authorization', token);
        //console.log(request)
        request.onload = function () {
            if (request.status != 500) {
                if (request.status === 200) {
                    let objResponse = JSON.parse(request.responseText)
                    if (objResponse.clientes.length > 0) {
                        sessionStorage.setItem('usuario', objResponse.clientes[0].idCliente)
                        resolve(objResponse.clientes[0].idCliente)
                    } else {
                        //alert("CPF não cadastrado!")
                        document.getElementsByClassName('loader')[0].style.display = 'none'
                        document.getElementById("alert_cpf").innerHTML = "CPF não cadastrado!"
                        reject()
                    }
                } else {
                    // alert("CPF não cadastrado!")
                    document.getElementsByClassName('loader')[0].style.display = 'none'
                    document.getElementById("alert_cpf").innerHTML = "CPF não cadastrado!"
                    reject()
                }
            } else {
                alert("Erro na API \n " + request.responseText + "\n Entre em contato com administrador")
                inputClear()
            }
        }
        request.ontimeout = function () {
            //alert("Erro no servidor, entre em contato com o administrador")
            document.getElementById("erro_server").innerHTML = "Erro no servidor, entre em contato com o administrador"
            document.getElementsByClassName('loader')[0].style.display = 'none'
            document.getElementById("cpf").value = ""
            document.getElementById("txtDataNasc").value = ""
        };

        request.send();
    }).catch(e => { })
}

async function consultadataNasc(token, cpf) {
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest()
        request.open('GET', baseurl + '/api/api/v3/portadores/consulta-cliente-completo-cpf?cpf=' + cpf, true)
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.setRequestHeader('Authorization', token);
        request.onload = function () {
            if (request.status === 200) {
                let objResponse = JSON.parse(request.responseText)
                let email_c = objResponse[0].email
                sessionStorage.setItem("email_c ", email_c)
                let data = objResponse[0].dataNascimento
                var newDate = data.split('-').reverse().join('/')
                // console.log(newDate)
                resolve(newDate)
            } else {
                reject()
            }
        }
        request.send()
    }).catch(e => { })
}


// ----Fatura Digital Email---
function check_fatura() {
    var numcell = sessionStorage.getItem('numcell')
    var sms_add = sessionStorage.getItem('add_status_sms')
    if(numcell != undefined ||sms_add != undefined){
        alert("Deseja realmente mudar de produto?")
        window.location.href = "alteracaoProduto.html"
    }

}

function faturadigital(e) {
    
    document.getElementById("message_email").innerHTML = ""
    document.getElementById("message_error").innerHTML = ""
    document.getElementsByClassName('loader')[0].style.display = 'flex'
    e.preventDefault()
    let emailchecked = document.querySelector("#checkboxemail").checked
    let smschecked = document.querySelector("#checkboxsms").checked
    let aceitosms = document.querySelector("#aceitosms").checked
    if (emailchecked == true) {
        if (aceitosms == true) {
            document.getElementById("alert_termo").innerHTML = ""
            if(check_fatura()){

            }else{
                faturaDigitalemail(e)
            }
        } else {
            //alert('Para fatura via E-mail, é necessário aceitar os termos de adesão!')
            document.getElementsByClassName('loader')[0].style.display = 'none'
            document.getElementById("alert_termo").innerHTML = "Para fatura via E-mail, é necessário aceitar os termos de adesão!"
        }
    } else if (smschecked == true) {
        if (aceitosms == true) {
            ConsultaCell()
        } else {
            //alert('Para fatura via SMS, é necessário aceitar os termos de adesão!')
            document.getElementsByClassName('loader')[0].style.display = 'none'
            document.getElementById("alert_termo").innerHTML = "Para fatura via SMS, é necessário aceitar os termos de adesão!"
        }
    } else {
        //alert('Selecione a opção de fatura!')
        document.getElementsByClassName('loader')[0].style.display = 'none'
        document.getElementById("message_email").innerHTML = "Selecione as opção de fatura!"
        document.getElementById("message_error").innerHTML = "Selecione as opção de fatura!"
    }
}



//ok
function faturaDigitalemail(e) {
    return new Promise((resolve, reject) => {
        e.preventDefault()
        let email = document.querySelector("#emailFatDigital").value
        let emailconf = document.querySelector("#emailFatDigitalConfir").value
        let reg = /^[\w.\+]+@\w+.\w{2,}(?:.\w{2})?$/;
        if (reg.test(email)) {
            if (email != "" || emailconf != "") {
                if (email == emailconf) {
                    let id = sessionStorage.getItem('usuario')
                    let token = sessionStorage.getItem('token')
                    addFaturaDigital(email, id, token).then(res => {
                        //window.location.href = "email.html"
                        resolve()
                    }).catch(e => { })
                } else {
                    // alert("Os e-mails não correspondem!")
                    document.getElementById("message_email").innerHTML = "Campo de e-mail não correspondem!"
                    document.getElementsByClassName('loader')[0].style.display = 'none'
                }
            } else {
                // alert("Campo de e-mail não preenchido!"); 
                document.getElementById("message_email").innerHTML = "Campo de e-mail não preenchido!"
                document.getElementsByClassName('loader')[0].style.display = 'none'
            }
        } else {
            // alert("Email inválido!");
            document.getElementById("message_email").innerHTML = "E-mails não preenchido"
            document.getElementsByClassName('loader')[0].style.display = 'none'
        }
    }).catch(e => { })


}

//ok
function addFaturaDigital(email, id, token) {
    return new Promise((resolve, reject) => {
        event.preventDefault()
        let request = new XMLHttpRequest()
        request.open('POST', baseurl + '/api/api/v3/portadores/' + id + '/adesao-fatura-digital?email=' + email, true)
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.setRequestHeader('Authorization', token);
        request.onload = function () {
            if (request.status != 500) {
                if (request.status === 200) {
                    // alert("Serviço de fatura digital por e-mail aderido com sucesso!")
                    window.location.href = "adesaosucesso.html"
                    inputClear()

                    resolve()
                } else {
                    alert('Erro ao aderir a fatura por e-mail, é preciso estar logado!')
                    window.location.href = "index.html"
                    inputClear()
                    reject()
                }
            } else {
                alert("Erro na API \n " + request.responseText + "\n Entre em contato com administrador")
                inputClear()
            }
        }
        request.send()
    }).catch(e => { })

}

//ok
function cancelarFatura(event) {
    //event.preventDefault()
    let id = sessionStorage.getItem('usuario')
    cancelFaturaDigital(id).then(res => {
        ConsultaIDCell(id, 2).then(() => {
            CancelarFaturaPdfSms(id).then(() => { })
        }).catch(e => { })
    }).catch(e => { })
}



//ok
function cancelFaturaDigital(id) {
    return new Promise((resolve, reject) => {
        event.preventDefault()
        var request = new XMLHttpRequest()
        request.open('POST', baseurl + '/api/api/v3/portadores/' + id + '/cancelamento-fatura-digital', true)
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.setRequestHeader('Authorization', sessionStorage.getItem('token'));
        request.onload = function () {
            if (request.status === 200) {
                resolve(JSON.parse(request.responseText))
            } else {
                alert('Erro em cancelar fatura digital, tente novamente!')
                reject()
            }
        }
        request.send()
    }).catch(e => { })
}

//ok
function ConsultaIDCell(id, tell_1, cod) {
    return new Promise((resolve, reject) => {
        event.preventDefault()
        let request = new XMLHttpRequest()
        request.open('GET', baseurl + '/api/api/v3/portadores/' + id + '/telefones/', true)
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.setRequestHeader('Authorization', sessionStorage.getItem('token'));
        request.onload = function () {
            if (request.status === 200) {
                let objResponse = JSON.parse(request.responseText)
                let exist = false
                let fullTel
                objResponse.forEach(e => {
                    if (cod == 1) {
                        fullTel = e.area + e.numero
                        if (tell_1 === fullTel) {
                            sessionStorage.setItem('idcell', e.id)
                            exist = true
                        }
                    } else {
                        if (e.isRecebeFaturaSms) {
                            if (cod === 3) {
                                exist = true
                                fullTel = e.area + e.numero
                                sessionStorage.setItem('numcell', fullTel)
                            } else {
                                sessionStorage.setItem('idcell', e.id)
                                exist = true
                            }
                        }
                    }
                })
                if (exist) {
                    resolve()
                } else {
                    if (cod == 1) {
                        AddTelefone(tell_1).then(id => {
                            sessionStorage.setItem('idcell', id)
                            resolve()
                        }).catch(e => {
                            document.getElementById("message_error").innerHTML = "Telefone incorreto"
                            document.getElementsByClassName('loader')[0].style.display = 'none'
                            //alert(e)
                        })
                    } else if (cod === 2) {
                        // cliente não possui adesão de celular para cancelar
                    } else {
                        resolve()
                    }
                }

            } else {
                alert('Erro ao consultar o celular, é preciso estar logado!')
                window.location.href = "index.html"
                reject()
            }
        }
        request.send()
    }).catch(e => { alert(e) })
}




//ok
// function CancelarFaturaPdfSms(id){   
//     return new Promise((resolve, reject) =>{
//         let idCelular = sessionStorage.getItem('idcell')
//         let request = new XMLHttpRequest()
//         request.open('PATCH', baseurl + '/api/api/v3/portadores/'+ id +'/cancelar-fatura-pdf-sms?idCelular='+ idCelular, true)
//         request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
//         request.setRequestHeader('Authorization', sessionStorage.getItem('token'));
//         request.onload = function(){
//             if(request.status === 400){
//                 alert('Fatura digital e SMS canceladas!')
//                 document.getElementById('article-fatura-1').style.display = 'flex'
//                 document.getElementById('article-fatura-2').style.display = 'none'
//                 resolve()
//             }else if (request.status == 200){
//                 alert('Fatura digital e SMS canceladas!')
//                 document.getElementById('article-fatura-1').style.display = 'flex'
//                 document.getElementById('article-fatura-2').style.display = 'none'
//                 resolve()
//             }else{
//                 alert('Fatura digital e SMS canceladas!')
//                 document.getElementById('article-fatura-1').style.display = 'flex'
//                 document.getElementById('article-fatura-2').style.display = 'none'
//                 resolve()
//             }
//         }
//         request.send()
//     }) .catch(e => {})
// }

// ----Fatura Digital SMS ---

function ConsultaCell() {
    return new Promise((resolve, reject) => {
        event.preventDefault()
        let tel1dd = document.querySelector("#smsFatDigitalDD").value
        let tel1 = document.querySelector("#smsFatDigital").value
        let tell_1 = tel1dd + tel1
        let tel2dd = document.querySelector("#smsFatDigitalConfirDD").value
        let tel2 = document.querySelector("#smsFatDigitalConfir").value
        let tell_2 = tel2dd + tel2
        if (tel1 != "" && tel2 != "") {
            if (tel1.length >= 9 && tel1.length <= 11) {
                if (tell_1 == tell_2) {
                    let id = sessionStorage.getItem('usuario')
                    ConsultaIDCell(id, tell_1, 1).then(() => {
                        faturaDigitalSMS(id).then(() => {
                            resolve()
                        }).catch(e => { })
                    }).catch(err => { reject() })
                } else {
                    // alert("Os número digitados não correspondem!")
                    document.getElementById("message_error").innerHTML = 'Os número digitados não são iguais'
                    document.getElementsByClassName('loader')[0].style.display = 'none'
                    reject()
                }
            } else {
                // alert("O número digitado está incorreto!")
                document.getElementById("message_error").innerHTML = 'Os número digitados esta errado!'
                document.getElementsByClassName('loader')[0].style.display = 'none'
                document.querySelector("#smsFatDigital").focus();
                reject()
            }
        } else {
            // alert("Os campos de SMS estão vazios!")
            document.getElementById("message_error").innerHTML = 'Os campos de SMS estão vazios!'
            document.getElementsByClassName('loader')[0].style.display = 'none'
            reject()
        }
    }).catch(e => { })
}

function faturaDigitalSMS(id) {
    return new Promise((resolve, reject) => {
        let idCelular = sessionStorage.getItem('idcell')
        let request = new XMLHttpRequest()
        request.open('PATCH', baseurl + '/api/api/v3/portadores/' + id + '/adesao-fatura-pdf-sms?idCelular=' + idCelular, true)
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.setRequestHeader('Authorization', sessionStorage.getItem('token'));
        request.onload = function () {
            if (request.status == 500) {
                alert("Erro na API \n " + request.responseText + "\n\n Entre em contato com administrador")
                document.getElementsByClassName('loader')[0].style.display = 'none'
                //inputClear()
            }
            else if (request.status != 500) {
                let objResponse = JSON.parse(request.responseText)
                if (request.status == 400) {
                    let message_sms = objResponse.detail
                    //alert(message_sms)
                    let m = document.getElementById("message_error")
                    if (m.innerText.length == 0) {
                        document.getElementById('message_error').innerHTML = message_sms
                    }

                    document.getElementsByClassName('loader')[0].style.display = 'none'
                    document.getElementById("alert_termo").innerHTML = ""
                    inputClear()
                    resolve()
                } else if (request.status == 202) {
                    window.location.href = "adesaosucesso.html"
                    inputClear()

                    resolve()
                }
            }
            else {
                console.log('error', request.responseText)
                inputClear()
                reject()
            }
        }
        request.send()
    }).catch(e => { })
}

function consultInformacoes() {
    return new Promise((resolve, reject) => {
        let id = sessionStorage.getItem('usuario')
        let token = sessionStorage.getItem('token')
        let request = new XMLHttpRequest()
        request.open('GET', baseurl + '/api/api/v3/portadores/' + id + '/informacoes', true)
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.setRequestHeader('Authorization', token);
        request.onload = function () {
            if (request.status === 200 || request.status === 201) {
                let objResponse = JSON.parse(request.responseText)
                let add_fatura_sms = objResponse.statusFaturaDigital
                if (add_fatura_sms === 'A') {
                    sessionStorage.setItem('add_status_sms', add_fatura_sms)
                } else {
                }
                resolve(add_fatura_sms)
            } else {
                reject()
            }
        }
        request.send()
    })
}

function AddTelefone(tel) {
    return new Promise((resolve, reject) => {
        let id = sessionStorage.getItem('usuario')
        let token = sessionStorage.getItem('token')
        let data = {
            faturaDigital: false,
            receberSMS: false,
            tipo: "CELULAR",
            ramal: null,
            area: tel.slice(0, 2),
            telefone: tel.slice(2)
        }
        let request = new XMLHttpRequest()
        request.open('POST', baseurl + '/api/api/v3/portadores/' + id + '/telefones/', true)
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.setRequestHeader('Authorization', token);
        request.onload = function () {
            if (request.status === 200 || request.status === 201) {
                let objResponse = JSON.parse(request.responseText)
                resolve(objResponse.id)
            } else {
                reject()
            }
        }
        request.send(JSON.stringify(data))
    })
}






// ===== Validações ======

function checarEmail() {
    let email = document.querySelector("#emailFatDigital").value
    if (email == "" || email.indexOf('@') < 0 || email.indexOf('.') < 0) {
        //   alert( "Por favor, informe um e-mail válido!" );
        document.getElementById("message_email").innerHTML = "E-mail invalido!"
    }
}

function inputClear() {
    document.querySelector("#checkboxemail").checked = false
    document.querySelector("#emailFatDigital").value = ""
    document.querySelector("#emailFatDigitalConfir").value = ""
    document.querySelector("#smsFatDigitalDD").value = ""
    document.querySelector("#smsFatDigital").value = ""
    document.querySelector("#smsFatDigitalConfirDD").value = ""
    document.querySelector("#smsFatDigitalConfir").value = ""
    // document.querySelector("#cpf").value = ""
    // document.querySelector("#txtDataNasc").value = ""
    document.querySelector("#checkboxsms").checked = false
    document.querySelector("#aceitosms").checked = false
}

function callFaqIndex(e) {
    e.preventDefault()
    sessionStorage.setItem('faq', 1)
    window.location.href = 'faq.html'
}

function callFaqFatura(e) {
    e.preventDefault()
    sessionStorage.setItem('faq', 2)
    window.location.href = 'faq.html'
}



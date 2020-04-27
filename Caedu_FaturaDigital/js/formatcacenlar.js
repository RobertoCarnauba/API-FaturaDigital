

 function send_cancelamento(){

    let cpf = sessionStorage.getItem('CPF')
    var data = (new Date()).toISOString().match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}/)[0].split('-').reverse().join('/');

    var e = document.getElementById("selec_cancelar");
    var strUser = e.options[e.selectedIndex].value;

    if(strUser === "Outros"){
        let outros = document.getElementsByClassName("m_cancelar")[0].value
        strUser = outros
    }
  
    Email.send({
        SecureToken : "9a492f11-736d-45c0-b029-25e7e7cb2d6f",
        To : 'caedufaturacancelamento@gmail.com',
        From : "caedufaturacancelamento@gmail.com",
        Subject : "Cancelou a fatura digital CPF: " + cpf +' data: '+data,
        Body : '<h1>CPF:'+cpf+'</h1> </br> <h3>Data do cancelamento: '+data+'</br><h3>Motivo: '+strUser+'</h3> </h3><img src="https://www.caedu.com.br/wp-content/uploads/2019/10/logo.png">'
    }).then(
      //message => alert(message)
    );
}



document.getElementById('radio-1').addEventListener('change', (event) => {
    if (document.getElementById('radio-1').checked == true) {
        document.getElementById('radio-2').checked = false
    }
})

document.getElementById('radio-2').addEventListener('change', (event) => {
    if (document.getElementById('radio-2').checked == true) {
        document.getElementById('radio-1').checked = false
    }
})


document.getElementById("selec_cancelar").addEventListener("change", function () {
    document.getElementById("divErro").innerHTML = ""
    var e = document.getElementById("selec_cancelar");
    var strUser = e.options[e.selectedIndex].value;
    if (strUser == "Outros") {
        document.getElementsByClassName("m_cancelar")[0].style.display = 'flex';
    } else {
        document.getElementsByClassName("m_cancelar")[0].style.display = 'none';
    }
})


function cancelarFatura(event) {
    let c = document.getElementById("radio-2").checked
    var e = document.getElementById("selec_cancelar");
    var strUser = e.options[e.selectedIndex].value;
    document.getElementsByClassName('loader')[0].style.display = 'flex'
    if (strUser != "Selecione" && c == true) {
        send_cancelamento(event)
        let id = sessionStorage.getItem('usuario')
        cancelFaturaDigital(id).then(() => {
            ConsultaIDCell(id, "", 2).then(() => {
                CancelarFaturaPdfSms(id).then(() => { 
                    window.location.href = "cancelado.html"
                }).catch(e => {
                    alert(e)
                    // alert cancelamento sms com erro no servidor
                })
            }).catch(e => {
                alert(e)
                // alert consulta id celular com erro no servidor
            })
        }).catch(e => {
            alert(e)
            // alert cancelmanto email com erro no servidor
        })

    }else{
        //alert("selecione uma das opçoes")
        document.getElementsByClassName('loader')[0].style.display = 'none'
        document.getElementById("divErro").innerHTML = "Selecione uma das opções"
    }

   

}

function cancelFaturaDigital(id) {
    return new Promise((resolve, reject) => {
        event.preventDefault()
        var request = new XMLHttpRequest()
        request.open('POST', baseurl + '/api/api/v3/portadores/' + id + '/cancelamento-fatura-digital', true)
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.setRequestHeader('Authorization', sessionStorage.getItem('token'));
        request.onload = function () {
            if (request.status === 200) {
                resolve()
            } else {
                reject()
            }
        }
        request.send()
    }).catch(e => { })
}

function CancelarFaturaPdfSms(id) {
    return new Promise((resolve, reject) => {
        let idCelular = sessionStorage.getItem('idcell')
        let request = new XMLHttpRequest()
        request.open('PATCH', baseurl + '/api/api/v3/portadores/' + id + '/cancelar-fatura-pdf-sms?idCelular=' + idCelular, true)
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.setRequestHeader('Authorization', sessionStorage.getItem('token'));
        request.onload = function () {
            if(request.status === 200) {
                resolve()
            }else{
                reject()
            }
        }
        request.send()
    }).catch(e => { })
}

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
                objResponse.forEach(e => {
                    if(cod == 1){
                        let fullTel = e.area + e.numero
                        console.log(fullTel)
                        if(tell_1 === fullTel){
                            sessionStorage.setItem('idcell', e.id)
                            exist = true
                        }
                    }else{
                        if(e.isRecebeFaturaSms){
                            sessionStorage.setItem('idcell', e.id)
                            exist = true
                        }
                    }
                })
                if(exist){
                    resolve()
                }else{
                    if(cod == 1){
                        AddTelefone(tell_1).then(id => {
                            sessionStorage.setItem('idcell', id)
                            resolve()
                        }).catch(e => {
                            //alert(e)
                        })
                    }else{
                        reject()
                    }
                }

            } else {
                alert('Erro ao consultar o celular, é preciso estar logado!')
                window.location.href = "index.html"
                reject()
            }
        }
        request.send()
    }).catch(e => { alert(e)})
}


document.getElementById("btnCancelar").addEventListener("click", async function () {
    let id = sessionStorage.getItem('usuario')
    let token = sessionStorage.getItem('token')
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest()
        request.open('GET', baseurl + '/api/api/v3/portadores/'+ id +'/lista-fatura-futura', true)
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.setRequestHeader('Authorization', token);
        request.onload = function () {
            if (request.status === 200) {
                let objResponse = JSON.parse(request.responseText)
                resolve(objResponse)
                let data = objResponse.faturasFuturas[0].dataVencimento
                var newDate = data.split('-').reverse().join('/')
                sessionStorage.setItem('vencimento', newDate)
                //console.log(newDate)
            } else {
                reject()
            }
        }
        request.send()
    }).catch(e => {})
})

document.getElementById("btnCancelar").addEventListener("click", function(){
    let c = document.getElementById("radio-1").checked
    if(c === true){
        window.location.href = "nocancelado.html"
    }
})

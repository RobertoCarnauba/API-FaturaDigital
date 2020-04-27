
let cpfmax = document.getElementById("cpf")
cpfmax.oninput = function () {
	if (this.value.length > 14) {
		this.value = this.value.slice(0,14); 
	}
}

let data = document.getElementById("txtDataNasc")
data.oninput = function () {
	if (this.value.length > 10) {
		this.value = this.value.slice(0,10); 
	}
}
data.onkeyup = (event) => {
    mascaraDate(data,event).then(() => {
        data.value.replace('/\/\//', '/')
        if(data.value.length == 3){
            let v = parseInt(data.value.replace('/',''))
            if(v <= 0 || v >= 32){
                data.style.borderColor = 'red'
            }else{
                data.style.borderColor = '#b1b1b1'
            }
        }else if(data.value.length == 6){
            let v1 = data.value.split('')
            let v3 = parseInt(v1[3] + v1[4])
            if(v3 <= 0 || v3 >= 13){
                data.style.borderColor = 'red'
            }else{
                data.style.borderColor = '#b1b1b1'
            }
        }
    })
}


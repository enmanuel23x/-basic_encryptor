var opc=document.getElementById('act').value
var allwords
var words
var config
const fs = require('fs');
        function post1intcrypt(){
            if(document.getElementById('text').value.length==16){
                document.getElementById('transa').disabled = true;
                document.getElementById('text').disabled = true;
                document.getElementById('key').disabled = true;
                encrypt()
            }else{
                swal({
                    title: words.alerttitle1,
                      text: words.alert6,
                      icon: "warning",
                      buttons: {
                        cancelar: words.alertbtn2,
                        aceptar: words.alertbtn1
                      },
                }).then((value) => {
                    switch (value) {
                        case "aceptar":
                            swal.close();
                            encrypt()
                            break
                        default:
                            swal.close();
                            break;
                            }
                    })
            }
        }
        //Oyente para comenzar el proceso segun metodo
        function read(){
            if(opc==0){
                if(document.getElementById('key').value.length==16){
                    post1intcrypt()
                }else{
                    swal({
                        title: words.alerttitle1,
                          text: words.alert5,
                          icon: "warning",
                          buttons: {
                            cancelar: words.alertbtn2,
                            aceptar: words.alertbtn1
                          },
                    }).then((value) => {
                        switch (value) {
                            case "aceptar":
                                swal.close();
                                post1intcrypt()
                                break
                            default:
                                swal.close();
                                break;
                                }
                        })
                    }
            }else{
                if(document.getElementById('key').value.length==32){
                    if(document.getElementById('text').value.length==32){
                        document.getElementById('transa').disabled = true;
                        document.getElementById('text').disabled = true;
                        document.getElementById('key').disabled = true;
                        decrypt()
                    }else{
                        swal({title: words.alerttitle1,text: words.alert4,icon: "warning"});
                    }
                }else{
                    swal({title: words.alerttitle1,text: words.alert3,icon: "warning"});
                }
            }
        }
        function reset(){
            document.getElementById('transa').disabled = false;
            document.getElementById('text').disabled = false;
            document.getElementById('key').disabled = false;
            document.getElementById('text').value="";
            document.getElementById('key').value="";
            document.getElementById("shell-out").value="";
            document.getElementById("hexa").value="";
        }
        
        //Oyente para opcion de metodo (Encriptar/Desencriptar)
        function changeopc(){
            opc=document.getElementById('act').value
            reset()
            if(opc==0){
                swal({title: words.alerttitle2,text: words.alert1,icon: "info"});
                document.getElementById("t1").innerHTML=words.title2+"(Dec):"
                document.getElementById("t2").innerHTML=words.title3+"(Dec):"
                document.getElementById("t3").innerHTML=words.title6+"(Dec):"
                document.getElementById('key').removeEventListener("input", is_hexadecimal_key);
                document.getElementById('text').removeEventListener("input", is_hexadecimal_text);
                document.getElementById('key').removeAttribute("maxlength");
                document.getElementById('text').removeAttribute("maxlength");
                document.getElementById('key').setAttribute("maxlength","16");
                document.getElementById('text').setAttribute("maxlength","16");
            }else{
                swal({title: words.alerttitle2,text: words.alert2,icon: "info"});
                document.getElementById("t1").innerHTML=words.title2+"(Hex):"
                document.getElementById("t2").innerHTML=words.title3+"(Hex):"
                document.getElementById("t3").innerHTML=words.title6+"(Hex):"
                document.getElementById('key').addEventListener("input", is_hexadecimal_key);
                document.getElementById('text').addEventListener("input", is_hexadecimal_text);
                document.getElementById('key').removeAttribute("maxlength");
                document.getElementById('text').removeAttribute("maxlength");
                document.getElementById('key').setAttribute("maxlength","32");
                document.getElementById('text').setAttribute("maxlength","32");
            }
            
        }
        //Oyente para opcion de lenguaje(CH/ES/FR/IN/EN/IT)
        function changelang(){
            let e = document.getElementById("lang");
            let strLang = e.options[e.selectedIndex].value;
            let lan
            for(let i=0;i<config.selectL2.length;i++){
                if(config.langs[i].lang==strLang ){
                    config.langs[i].status="1"
                    lan=config.langs[i].file
                }else{
                    config.langs[i].status="0"
                }
            }
            let data = JSON.stringify(config);
            fs.writeFileSync(__dirname+'/assets/json/config.json', data);
            readlangfile(lan)
        }
        //Inicializador de texto segun idioma seleccionado
        function readlangfile(lan){
            fs.readFile(__dirname+'/assets/json/langs/'+lan, (err, data) => {
                if (err) throw err;
                words = JSON.parse(data);
                document.getElementById("title").innerHTML=words.title1
                document.getElementById("t1").innerHTML=words.title2+"(Dec):"
                document.getElementById("t2").innerHTML=words.title3+"(Dec):"
                document.getElementById("trans").innerHTML=words.title4
                document.getElementById("sh").innerHTML=words.title5
                document.getElementById("t3").innerHTML=words.title6+"(Dec):"
                document.getElementById("refre").innerHTML=words.title7
                document.getElementById("t4").innerHTML=words.title8
                document.getElementById("t5").innerHTML=words.title9
                fillselect(document.getElementById("act"),words.selectE1,words.selectE2)
                infoalert()
                });
        }
        function infoalert(){
            swal({title: words.alerttitle2,text: words.alert1,icon: "info"});
        }
        //Inicializador de configuracion previa
        fs.readFile(__dirname+'/assets/json/config.json', (err, data) => {
            if (err) throw err;
            config = JSON.parse(data);
            let lang
            fillselect(document.getElementById("lang"),config.selectL1,config.selectL2)
            for(let i=0;i<config.langs.length;i++){
                if(config.langs[i].status=="1"){
                    document.getElementById("lang").options[i].selected = 'selected';
                    lang=config.langs[i].file
                }
                }
                readlangfile(lang)
            });
        function fillselect(stl,ar,ar2){
            stl.innerHTML=""
            for(let i=0;i<ar.length;i++){
                stl.innerHTML+="<option value="+ar2[i]+">"+ar[i]+"</option>"
            }
        }
        function is_hexadecimal_text(){
            t=document.getElementById('text')
            str=t.value
            regexp = /^[0-9a-fA-F]+$/;
            while(true){
                if (regexp.test(str)){
                    t.value=str
                    break
                }else{
                    if(str.length!=0){
                        str=str.substring(0, str.length - 1);
                    }else{
                        t.value=""
                        break
                        }
                    }
                }
            }
            function is_hexadecimal_key(){
                t=document.getElementById('key')
                str=t.value
                regexp = /^[0-9a-fA-F]+$/;
                while(true){
                    if (regexp.test(str)){
                        t.value=str
                        break
                    }else{
                        if(str.length!=0){
                            str=str.substring(0, str.length - 1);
                        }else{
                            t.value=""
                            break
                            }
                        }
                    }
                    
                }
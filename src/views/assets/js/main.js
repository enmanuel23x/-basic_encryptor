var opc=0;
var words
var config
const fs = require('fs');
        //Oyente para comenzar el proceso segun metodo
        function read(){
            document.getElementById('transa').disabled = true;
            document.getElementById('text').disabled = true;
            document.getElementById('key').disabled = true;
            if(opc==0){
            encrypt()
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
            alert(opc)
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
                document.getElementById("t1").innerHTML=words.title2
                document.getElementById("t2").innerHTML=words.title3
                document.getElementById("trans").innerHTML=words.title4
                document.getElementById("sh").innerHTML=words.title5
                document.getElementById("t3").innerHTML=words.title6
                document.getElementById("refre").innerHTML=words.title7
                document.getElementById("t4").innerHTML=words.title8
                document.getElementById("t5").innerHTML=words.title9
                fillselect(document.getElementById("act"),words.selectE1,words.selectE2)
                });
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
    document.getElementById("hexa").value="";
    var finalout= document.getElementById("hexa")
    document.getElementById("text").value="";
    var shell= document.getElementById("shell-out")
    var bitwiseBuffer = require('bitwise-buffer')
    var anyBase = require('any-base'),
            bin2hex = anyBase(anyBase.BIN, anyBase.HEX);
            hex2bin = anyBase(anyBase.HEX, anyBase.BIN);
            hex2dec = anyBase(anyBase.HEX, anyBase.DEC);
            dec2hex = anyBase(anyBase.DEC, anyBase.HEX);
    var { xor, and, or, nor, not, leftShift, rightShift, lshift, rshift } = bitwiseBuffer
    var sbox=[
            ["63","7C","77","7B","F2","6B","6F","C5","30","01","67","2B","FE","D7","AB","76"],
            ["CA","82","C9","7D","FA","59","47","F0","AD","D4","A2","AF","9C","A4","72","C0"],
            ["B7","FD","93","26","36","3F","F7","CC","34","A5","E5","F1","71","D8","31","15"],
            ["04","C7","23","C3","18","96","05","9A","07","12","80","E2","EB","27","B2","75"],
            ["09","83","2C","1A","1B","6E","5A","A0","52","3B","D6","B3","29","E3","2F","84"],
            ["53","D1","00","ED","20","FC","B1","5B","6A","CB","BE","39","4A","4C","58","CF"],
            ["D0","EF","AA","FB","43","4D","33","85","45","F9","02","7F","50","3C","9F","A8"],
            ["51","A3","40","8F","92","9D","38","F5","BC","B6","DA","21","10","FF","F3","D2"],
            ["CD","0C","13","EC","5F","97","44","17","C4","A7","7E","3D","64","5D","19","73"],
            ["60","81","4F","DC","22","2A","90","88","46","EE","B8","14","DE","5E","0B","DB"],
            ["E0","32","3A","0A","49","06","24","5C","C2","D3","AC","62","91","95","E4","79"],
            ["E7","C8","37","6D","8D","D5","4E","A9","6C","56","F4","EA","65","7A","AE","08"],
            ["BA","78","25","2E","1C","A6","B4","C6","E8","DD","74","1F","4B","BD","8B","8A"],
            ["70","3E","B5","66","48","03","F6","0E","61","35","57","B9","86","C1","1D","9E"],
            ["E1","F8","98","11","69","D9","8E","94","9B","1E","87","E9","CE","55","28","DF"],
            ["8C","A1","89","0D","BF","E6","42","68","41","99","2D","0F","B0","54","BB","16"]]
        function read(){
            var str=str=document.getElementById("text").value
            if(document.getElementById("text").value.length<16){
                for(i=0;i<16-document.getElementById("text").value.length;i++){
                    str+=" "
                }
            }

            text = require('string-to-binary')(str);
            shell.value+="Text Input:"+document.getElementById("text").value+"\n\n"
            shell.value+="Binary Input: "+text+"\n\n"
            text=bin2hex(text);
            //text="3243F6A8885A308D313198A2E0370734"
            shell.value+="Hexadecimal Input: "+text+"\n\n"
            var arr1=[],arr2=[],cont=0
            //ciclo para formar la matriz
            while(text.length>0){
                arr1.push(text.substring(0, 2))
                text=text.substring(2)
                cont++;
                if(cont==4){
                    if(arr2.length<=0){
                        arr2=[arr1];
                    }else{
                        arr2.push(arr1);
                    }
                    arr1=[]
                    cont=0;
                }
            }
            //Clave Principal: 2B7E151628AED2A6ABF7158809CF4F3C
            var clavep=[
                ["2B","7E","15","16"],
                ["28","AE","D2","A6"],
                ["AB","F7","15","88"],
                ["09","CF","4F","3C"]]
            claves=[]
            claves.push(clavep)
            var rcon=["01","02","04","08","10","20","40","80","1B","36"]
            for(contj=1;contj<11;contj++){
                i=contj
                claves.push([])
                claves[i]=step2(claves[i-1],claves[i],claves[i-1][3].slice(0),rcon[i-1].slice(0))
            }
            reply=[]
            for(conti=0;conti<claves.length;conti++){
                reply.push(upper(transpose(claves[conti])))
            }
            //Salida por Shell
            //Estado
            shell.value+="Estado: \n";print4x4(transpose(arr2))
            //Claves
            shell.value+="Claves: \n\n";printkeys(reply)
            let AddRoundKey = upper(step3(transpose(arr2).slice(0),transpose(clavep).slice(0)))
            let SubBytes,ShiftRows,MixColumns
            for(let myfinali=1;myfinali<reply.length-1;myfinali++){
                //Rondas 1-9
                SubBytes = upper(step4(AddRoundKey.slice(0)));
                ShiftRows= upper(step5(SubBytes.slice(0)));
                MixColumns =step6(ShiftRows.slice(0))
                finalprint([AddRoundKey,SubBytes,ShiftRows,MixColumns,reply[myfinali]],myfinali)
                AddRoundKey = upper(step3(MixColumns.slice(0),reply[myfinali].slice(0)))
            }
            //Ronda 10
            SubBytes = upper(step4(AddRoundKey.slice(0)));
            ShiftRows= upper(step5(SubBytes.slice(0)));
            MixColumns=[["  ","  ","  ","  "],["  ","  ","  ","  "],["  ","  ","  ","  "],["  ","  ","  ","  "]]
            finalprint([AddRoundKey,SubBytes,ShiftRows,MixColumns,reply[10]],10)
            //Texto encriptado
            AddRoundKey = upper(step3(ShiftRows.slice(0),reply[10].slice(0)))
            shell.value+="Salida:\n"
            print4x4(AddRoundKey.slice(0))
            printencrypt(transpose(AddRoundKey.slice(0)))
        }
        //paso 2
        function step2(claveprev,clavepost,pivot,r){
            pivot.push(pivot.splice(0, 1)[0]);
            let myvalue=[]
            for(i=0;i<4;i++){
                myrow=sbox[parseInt((pivot[i].split("")[0]), 16)]
                myvalue.push(myrow[parseInt((pivot[i].split("")[1]), 16)])
            }
            myarr=[]
            for(i=0;i<claveprev.length;i++){
                for(j=0;j<claveprev[0].length;j++){
                    a = Buffer.from(claveprev[i][j], 'hex')
                    b = Buffer.from(myvalue[j], 'hex')
                    val=xor(a, b).toString('hex')
                    if(i==0){
                        a = Buffer.from(val, 'hex')
                        if(j==0){
                            str=r
                        }else{
                            str="00"
                        }
                        b = Buffer.from(str, 'hex')
                        val=xor(a, b).toString('hex')
                    }else{
                    }
                    myarr.push(val)
                    myvalue[j]=val
                }
            }
            let cont=0,arr1=[]
            for(i=0;i<myarr.length;i++){
                arr1.push(myarr[i])
                cont++;
                if(cont==4){
                    if(clavepost.length<=0){
                        clavepost=[arr1];
                    }else{
                        clavepost.push(arr1);
                    }
                    arr1=[]
                    cont=0;
                }
            }
            return clavepost
        }
        //paso 3 | AddRoundKey
        function step3(state,key){
            let myvalue=[],row
            for(i=0;i<4;i++){
                row=[]
                for(j=0;j<4;j++){
                    mya=state[i][j]
                    if(mya.length % 2!=0){
                        mya="0"+mya
                    }
                    myb=key[i][j]
                    if(myb.length % 2!=0){
                        myb="0"+myb
                    }
                    a = Buffer.from(mya, 'hex')
                    b = Buffer.from(myb, 'hex')
                    row.push(xor(a, b).toString('hex'))
                }
                if(myvalue.length==0){
                    myvalue=[row];
                }else{
                    myvalue.push(row)
                }  
            }
            return myvalue;
        }
        //paso 4 | SubBytes
        function step4(arr){
            let myvalue=[],fvalue=[]
            for(i=0;i<arr.length;i++){
                myvalue=[]
                for(j=0;j<arr[0].length;j++){
                    myrow=sbox[parseInt((arr[i][j].split("")[0]), 16)]
                    myvalue.push(myrow[parseInt((arr[i][j].split("")[1]), 16)])
                }
                if(fvalue.length==0){
                    fvalue=[myvalue];
                }else{
                    fvalue.push(myvalue)
                }
            }
            return fvalue;
        }
        //paso 5 | ShiftRows
        function step5(arr){
            let myvalue=[]
            for(i=0;i<4;i++){
                row=[]
                cont=0,j=i
                while(cont!=4){
                    cont++;
                    if(j==4){
                        j=0;
                    }
                    row.push(arr[i][j])
                    j++;
                } 
                if(myvalue.length==0){
                    myvalue=[row];
                }else{
                    myvalue.push(row)
                }
            }
            return myvalue;
        }
        //paso 6 | MixColumns
        function step6(arr){
            let detarr=[
                ["02","03","01","01"],
                ["01","02","03","01"],
                ["01","01","02","03"],
                ["03","01","01","02"]
            ]
            let arr2ret=[],myval,Helper=[]
            myarr=transpose(arr)
            for(let i=0;i<myarr.length;i++){
                myval=myarr[i]
                Helper=[]
                for(let k=0;k<myarr[0].length;k++){
                    Helper.push(step6multhelper(myval,detarr[k]))
                }
                if(arr2ret.length==0){
                    arr2ret=[Helper]
                }else{
                    arr2ret.push(Helper)
                }
            }
            return upper(transpose(arr2ret))
        }
        function step6multhelper(marr1,marr2){
            let retvalue="",tempvalue
            for(let mi=0;mi<marr1.length;mi++){
                if(marr2[mi]==1){
                    tempvalue=marr1[mi]
                }else if(marr2[mi]==2){
                    tempvalue=step6helper(marr1[mi].toLowerCase())
                }else{
                    a=marr1[mi]
                    if(a.length % 2 != 0){
                        a="0"+a
                    }
                    myan = Buffer.from(a, 'hex')
                    b=step6helper(marr1[mi].toLowerCase())
                    if(b.length % 2 != 0){
                        b="0"+b
                    }
                    mybn = Buffer.from(b, 'hex')
                    tempvalue= xor(myan, mybn).toString('hex')
                }
                tempvalue=tempvalue.toUpperCase()
                if(retvalue==""){
                    retvalue=[tempvalue]
                }else{
                    retvalue.push(tempvalue)
                }
            }
            let fval=""
            for(let mi=0;mi<retvalue.length-1;mi++){
                if(fval==""){
                    a = retvalue[mi]
                }else{
                    a =fval
                }
                if(a.length % 2 != 0){
                    a="0"+a
                }
                mya = Buffer.from(a, 'hex')
                b=retvalue[mi+1]
                if(b.length % 2 != 0){
                    b="0"+b
                }
                myb = Buffer.from(b, 'hex')
                fval= xor(mya, myb).toString('hex')
            }
            return fval
        }
        function step6helper(txtorigin){
            txt= hex2bin(txtorigin)
            let myarr=[]
            let mval=""
            myarr= txt.split("")
            if(myarr.length==8){
                myarr.shift()
                myarr.push("0")
            
            for(myi=0;myi<myarr.length;myi++){
                mval+=myarr[myi]
            }
            a = bin2hex(mval)
            if(a.length % 2 != 0){
                a="0"+a
            }
            af = Buffer.from(a, 'hex')
            bf = Buffer.from("1B", 'hex')
            return xor(af, bf).toString('hex')
            }else{
                myarr.push("0")
                for(myi=0;myi<myarr.length;myi++){
                    mval+=myarr[myi]
                }
                return bin2hex(mval)
            }
        }
        //Imprimir matrices 4x4
        function print4x4(arr){
            for(i=0;i<4;i++){
                for(j=0;j<4;j++){
                    shell.value+=arr[i][j]+" "
                }  
                shell.value+="\n"
            }
            shell.value+="\n"
        }
        //Imprimir claves
        function printkeys(arr){
            shell.value+="Estado:       Subclave 1:   Subclave 2:   Subclave 3:   Subclave 4:   Subclave 5:\n"
            let n1=0,n2=6
            for(j=0;j<reply[0].length;j++){
                for(mi=n1;mi<n2;mi++){
                    printrow(reply[mi][j])
                }
                shell.value+="\n"
                if(j==3 & n1==0){
                    shell.value+="\nSubclave 6:   Subclave 7:   Subclave 8:   Subclave 9:   Subclave 10:\n"
                    n1=6
                    n2=11
                    j=0
                }
            }
            shell.value+="\n"
        }
        function printrow(arr){
            for(i=0;i<arr.length;i++){
                shell.value+=arr[i]+" "
            }
            shell.value+="  "
        }
        //Imprimpir matrices de cifrado
        function finalprint(arr,n){
            if(n!=10){
                shell.value+="------------------------------------------Ronda "+n+"-------------------------------------------\n"
            }else{
                shell.value+="------------------------------------------Ronda "+n+"------------------------------------------\n"
            }
           
            shell.value+="Entrada:      SubBytes:     ShiftRows:    MixColumns:   Subclave:\n"
            for(j=0;j<arr[0].length;j++){
                for(mi=0;mi<arr.length;mi++){
                    printrow(arr[mi][j])
                }
                shell.value+="\n"
            }
            if(n==10){
                shell.value+="--------------------------------------------------------------------------------------------"
            }
            shell.value+="\n"
        }
        //Imprimir texto cifrado
        function printencrypt(arr){
            for(i=0;i<arr.length;i++){
                for(j=0;j<arr.length;j++){
                    finalout.value+=arr[i][j]
                }
            }
        }
        //transposicion de matrices
        function transpose(matrix) {
            var copy=[],copy2=[]
            for(j=0;j<matrix[0].length;j++){
                copy=[]
                for(i=0;i<matrix.length;i++){
                    copy.push(matrix[i][j])
                }
                copy2.push(copy)
            }
            return copy2
        }
        //Elevar caracteres
        function upper(arr){
            for(let i=0;i<arr.length;i++){
                for(let j=0;j<arr[0].length;j++){
                    arr[i][j]=arr[i][j].toUpperCase()
                }
            }
            return arr
        }
